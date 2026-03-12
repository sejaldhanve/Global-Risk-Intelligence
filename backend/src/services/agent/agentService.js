const OpenAI = require('openai');
const searchAggregator = require('../search/searchAggregator');
const sourceRanker = require('../search/sourceRanker');
const consensusEngine = require('../ai/consensusEngine');
const impactAnalyzer = require('../impact/impactAnalyzer');
const forecastService = require('../forecast/forecastService');
const mapService = require('../map/mapService');
const eventExtractor = require('../ai/eventExtractor');

class AgentService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.tools = [
      {
        name: 'search_news',
        description: 'Search for news and information about geopolitical events using multiple search engines',
        parameters: {
          query: 'search query string',
          count: 'number of results (default 10)'
        }
      },
      {
        name: 'rank_sources',
        description: 'Rank and filter news sources by credibility, recency, and relevance',
        parameters: {
          sources: 'array of sources to rank'
        }
      },
      {
        name: 'analyze_consensus',
        description: 'Analyze multiple sources to find consensus and identify key facts',
        parameters: {
          sources: 'array of sources',
          query: 'analysis query'
        }
      },
      {
        name: 'analyze_impact',
        description: 'Analyze the impact of an event on sectors, commodities, and trade routes',
        parameters: {
          eventData: 'event information object'
        }
      },
      {
        name: 'generate_forecast',
        description: 'Generate price/impact forecast for commodities affected by the event',
        parameters: {
          eventData: 'event information',
          commodity: 'commodity to forecast (oil, gas, wheat, shipping, etc.)'
        }
      },
      {
        name: 'get_location',
        description: 'Get geographic coordinates for a country or region',
        parameters: {
          country: 'country name',
          region: 'region name (optional)'
        }
      }
    ];
  }

  async processQuery(userQuery) {
    try {
      const plan = await this.createPlan(userQuery);
      
      const result = await this.executePlan(plan, userQuery);
      
      const response = await this.formatResponse(result, userQuery);
      
      return response;
    } catch (error) {
      console.error('Agent processing error:', error.message);
      throw error;
    }
  }

  async createPlan(userQuery) {
    const prompt = `You are an intelligence analyst AI agent. Create a step-by-step plan to answer this query:

"${userQuery}"

Available tools:
${this.tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}

Return a JSON plan with steps, each containing:
{
  "steps": [
    {
      "tool": "tool_name",
      "parameters": {...},
      "reasoning": "why this step is needed"
    }
  ]
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI agent planner. Create efficient plans to answer geopolitical intelligence queries.'
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

  async executePlan(plan, userQuery) {
    const results = {
      query: userQuery,
      steps: [],
      data: {}
    };

    for (const step of plan.steps || []) {
      try {
        console.log(`Executing step: ${step.tool}`);
        
        const stepResult = await this.executeTool(step.tool, step.parameters, results.data);
        
        results.steps.push({
          tool: step.tool,
          reasoning: step.reasoning,
          success: true,
          result: stepResult
        });

        results.data[step.tool] = stepResult;
      } catch (error) {
        console.error(`Error executing ${step.tool}:`, error.message);
        results.steps.push({
          tool: step.tool,
          reasoning: step.reasoning,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  async executeTool(toolName, parameters, previousData) {
    switch (toolName) {
      case 'search_news':
        return await searchAggregator.aggregateSearch(
          parameters.query,
          { count: parameters.count || 10 }
        );

      case 'rank_sources':
        const sources = parameters.sources || previousData.search_news || [];
        return sourceRanker.rankSources(sources);

      case 'analyze_consensus':
        const sourcesToAnalyze = parameters.sources || previousData.rank_sources || [];
        return await consensusEngine.analyzeConsensus(
          sourcesToAnalyze.slice(0, 15),
          parameters.query
        );

      case 'analyze_impact':
        const eventData = parameters.eventData || previousData.analyze_consensus || {};
        return impactAnalyzer.analyzeImpact(eventData);

      case 'generate_forecast':
        const eventForForecast = parameters.eventData || previousData.analyze_consensus || {};
        return await forecastService.generateForecast(
          eventForForecast,
          parameters.commodity || 'oil'
        );

      case 'get_location':
        return await mapService.geocodeLocation(
          parameters.country,
          parameters.region
        );

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  async formatResponse(executionResult, userQuery) {
    const resultsText = executionResult.steps.map(step => 
      `${step.tool}: ${step.success ? 'Success' : 'Failed'}\n${JSON.stringify(step.result || step.error, null, 2)}`
    ).join('\n\n---\n\n');

    const prompt = `Based on the execution results, provide a comprehensive answer to the user's query.

User Query: "${userQuery}"

Execution Results:
${resultsText}

Provide a clear, structured response that:
1. Directly answers the user's question
2. Highlights key findings
3. Includes relevant data (numbers, forecasts, impacts)
4. Mentions confidence levels and uncertainties
5. Provides actionable insights

Format as JSON with:
{
  "answer": "main answer text",
  "keyFindings": ["finding 1", "finding 2", ...],
  "data": {
    "impact": {...},
    "forecast": {...},
    "risk": "...",
    "confidence": 0-100
  },
  "recommendations": ["recommendation 1", ...]
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert geopolitical intelligence analyst providing clear, data-driven answers.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4
    });

    const formattedResponse = this.safeJsonParse(response.choices[0].message.content);
    
    return {
      ...formattedResponse,
      executionSteps: executionResult.steps.map(s => ({
        tool: s.tool,
        success: s.success
      })),
      rawData: executionResult.data
    };
  }

  async answerQuestion(question) {
    try {
      const response = await this.processQuery(question);
      return response;
    } catch (error) {
      return {
        answer: `I encountered an error processing your query: ${error.message}`,
        keyFindings: [],
        data: {},
        recommendations: [],
        error: true
      };
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
      
      return JSON.parse(cleaned);
    } catch (error) {
      console.warn('Failed to parse OpenAI response as JSON:', error.message);
      return { text: content };
    }
  }
}

module.exports = new AgentService();
