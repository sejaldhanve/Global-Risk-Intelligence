const OpenAI = require('openai');
const Analysis = require('../../models/Analysis');

class ConsensusEngine {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeConsensus(sources, query) {
    try {
      const chunks = this.splitSources(sources);
      
      const analyses = await Promise.all(
        chunks.map(chunk => this.analyzeChunk(chunk, query))
      );

      const consensus = await this.mergeAnalyses(analyses, query);
      
      return consensus;
    } catch (error) {
      console.error('Consensus analysis error:', error.message);
      throw error;
    }
  }

  splitSources(sources, chunkSize = 5) {
    const chunks = [];
    for (let i = 0; i < sources.length; i += chunkSize) {
      chunks.push(sources.slice(i, i + chunkSize));
    }
    return chunks;
  }

  async analyzeChunk(sources, query) {
    const sourcesText = sources.map((s, i) => 
      `Source ${i + 1} (${s.domain}):\nTitle: ${s.title}\nContent: ${s.snippet || s.content || ''}\n`
    ).join('\n---\n');

    const prompt = `Analyze these news sources about: "${query}"

${sourcesText}

Provide a structured analysis with:
1. Key facts mentioned
2. Common themes
3. Contradictions or inconsistencies
4. Credibility assessment
5. Risk level (low/medium/high/critical)

IMPORTANT: Return ONLY valid JSON with no markdown formatting. Use lowercase for enum values (low/medium/high/critical).`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a geopolitical intelligence analyst. Analyze news sources objectively and identify key insights, risks, and consensus.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    });

    return this.safeJsonParse(response.choices[0].message.content);
  }

  async mergeAnalyses(analyses, query) {
    const mergedText = analyses.map((a, i) => 
      `Analysis ${i + 1}:\n${JSON.stringify(a, null, 2)}`
    ).join('\n\n---\n\n');

    const prompt = `Merge these analyses about: "${query}"

${mergedText}

Create a final consensus report with:
1. summary (concise overview)
2. confidence (0-100)
3. riskLevel (MUST be one of: low, medium, high, critical - lowercase only)
4. countries (array of affected countries)
5. impact (key impacts)
6. consensus (what sources agree on)
7. uncertainties (what's unclear or disputed)

IMPORTANT: Return ONLY valid JSON with no markdown formatting. Use lowercase for all enum values.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a senior intelligence analyst creating consensus reports from multiple analyses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2
    });

    return this.safeJsonParse(response.choices[0].message.content);
  }

  safeJsonParse(content) {
    try {
      let cleaned = content.trim();
      
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }
      
      const parsed = JSON.parse(cleaned);
      
      if (parsed.riskLevel && typeof parsed.riskLevel === 'string') {
        parsed.riskLevel = parsed.riskLevel.toLowerCase();
      }
      
      return parsed;
    } catch (error) {
      console.warn('Failed to parse OpenAI response as JSON:', error.message);
      console.warn('Content:', content.substring(0, 200));
      return { text: content };
    }
  }

  async saveAnalysis(eventId, result, sources) {
    const analysis = new Analysis({
      eventId,
      analysisType: 'consensus',
      result,
      confidence: result.confidence || 0,
      aiModel: 'gpt-4',
      sources: sources.map(s => s._id).filter(Boolean)
    });

    await analysis.save();
    return analysis;
  }
}

module.exports = new ConsensusEngine();
