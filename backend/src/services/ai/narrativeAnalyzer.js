const OpenAI = require('openai');
const Narrative = require('../../models/Narrative');

class NarrativeAnalyzer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeNarrative(eventData, sources) {
    try {
      const narrativeText = this.buildNarrativeText(eventData, sources);
      
      const sentimentAnalysis = await this.analyzeSentiment(narrativeText, sources);
      
      const verification = await this.verifyAgainstReality(eventData, sources);
      
      const classification = this.classifyNarrative(sentimentAnalysis, verification);

      const narrative = {
        narrativeText,
        sentiment: sentimentAnalysis.sentiment,
        classification: classification.type,
        confidence: classification.confidence,
        analysis: {
          keyPoints: sentimentAnalysis.keyPoints || [],
          inconsistencies: verification.inconsistencies || [],
          verification: verification.summary
        }
      };

      return narrative;
    } catch (error) {
      console.error('Narrative analysis error:', error.message);
      throw error;
    }
  }

  buildNarrativeText(eventData, sources) {
    const titles = sources.slice(0, 10).map(s => s.title).join('. ');
    return `${eventData.event || eventData.title}: ${titles}`;
  }

  async analyzeSentiment(narrativeText, sources) {
    const sourcesText = sources.slice(0, 10).map(s => 
      `${s.title}\n${s.snippet || ''}`
    ).join('\n---\n');

    const prompt = `Analyze the sentiment and narrative of these news sources:

${sourcesText}

Return JSON with:
{
  "sentiment": "positive/negative/neutral/mixed",
  "tone": "description of overall tone",
  "keyPoints": ["main narrative points"],
  "emotionalLanguage": ["examples of emotional/biased language"],
  "confidence": 0-100
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing media narratives and detecting bias, sentiment, and framing.'
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

  async verifyAgainstReality(eventData, sources) {
    const prompt = `Verify this event against factual reality:

Event: ${eventData.event || eventData.title}
Description: ${eventData.description || ''}
Country: ${eventData.country || ''}

Sources claim:
${sources.slice(0, 5).map(s => `- ${s.title}`).join('\n')}

Analyze:
1. Are there verifiable facts?
2. Are there contradictions between sources?
3. Is there evidence of misinformation?
4. What can be confirmed vs what is speculation?

Return JSON with:
{
  "verifiedFacts": ["list of verified facts"],
  "unverifiedClaims": ["list of unverified claims"],
  "inconsistencies": ["contradictions found"],
  "realityCheck": "real/uncertain/suspicious",
  "summary": "brief verification summary",
  "confidence": 0-100
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a fact-checker verifying geopolitical events against reality and detecting misinformation.'
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

  classifyNarrative(sentimentAnalysis, verification) {
    const realityCheck = verification.realityCheck?.toLowerCase() || 'uncertain';
    const confidence = verification.confidence || 50;

    let type = 'uncertain';
    
    if (realityCheck === 'real' && confidence > 70) {
      type = 'real';
    } else if (realityCheck === 'suspicious' || confidence < 30) {
      type = 'fake';
    }

    return {
      type,
      confidence
    };
  }

  async saveNarrative(eventId, narrativeData, sources) {
    const narrative = new Narrative({
      eventId,
      narrativeText: narrativeData.narrativeText,
      sentiment: narrativeData.sentiment,
      classification: narrativeData.classification,
      confidence: narrativeData.confidence,
      evidenceSources: sources.map(s => s._id).filter(Boolean),
      analysis: narrativeData.analysis
    });

    await narrative.save();
    return narrative;
  }

  safeJsonParse(content) {
    try {
      let cleaned = content.trim();
      
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }
      
      return JSON.parse(cleaned);
    } catch (error) {
      console.warn('Failed to parse OpenAI response as JSON:', error.message);
      return { text: content };
    }
  }
}

module.exports = new NarrativeAnalyzer();
