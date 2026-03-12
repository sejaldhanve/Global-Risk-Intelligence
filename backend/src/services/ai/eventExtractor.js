const OpenAI = require('openai');

class EventExtractor {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async extractEvent(text, sources = []) {
    try {
      const sourcesContext = sources.slice(0, 10).map(s => 
        `${s.title}: ${s.snippet || ''}`
      ).join('\n');

      const prompt = `Extract structured event information from this text and sources:

Query: ${text}

Sources:
${sourcesContext}

Extract and return JSON with:
{
  "country": "primary country involved",
  "region": "specific region/city",
  "event": "concise event description",
  "sector": "affected sector (energy/trade/military/political/economic)",
  "risk": "risk level (low/medium/high/critical)",
  "eventType": "type (war/sanction/attack/trade_dispute/natural_disaster/political_crisis/other)",
  "description": "detailed description",
  "affectedCountries": ["array of all affected countries"],
  "commodities": ["affected commodities like oil, gas, wheat"],
  "confidence": 0-100
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at extracting structured geopolitical event data from news sources. Be precise and factual.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2
      });

      const extracted = this.safeJsonParse(response.choices[0].message.content);
      return extracted;
    } catch (error) {
      console.error('Event extraction error:', error.message);
      throw error;
    }
  }

  async extractMultipleEvents(sources) {
    try {
      const sourcesText = sources.slice(0, 20).map((s, i) => 
        `${i + 1}. ${s.title}\n${s.snippet || ''}`
      ).join('\n\n');

      const prompt = `Identify distinct geopolitical events from these sources:

${sourcesText}

Return JSON array of events, each with:
{
  "title": "event title",
  "country": "primary country",
  "region": "region",
  "eventType": "type",
  "severity": "low/medium/high/critical",
  "relatedSources": [indices of related sources]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an intelligence analyst identifying distinct events from news sources.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      });

      const result = this.safeJsonParse(response.choices[0].message.content);
      return result.events || [];
    } catch (error) {
      console.error('Multiple event extraction error:', error.message);
      return [];
    }
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
      
      if (parsed.risk && typeof parsed.risk === 'string') {
        parsed.risk = parsed.risk.toLowerCase();
      }
      if (parsed.eventType && typeof parsed.eventType === 'string') {
        parsed.eventType = parsed.eventType.toLowerCase().replace(/ /g, '_');
      }
      
      return parsed;
    } catch (error) {
      console.warn('Failed to parse OpenAI response as JSON:', error.message);
      return { text: content };
    }
  }
}

module.exports = new EventExtractor();
