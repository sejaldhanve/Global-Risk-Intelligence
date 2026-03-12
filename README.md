# Global Conflict Impact Intelligence Platform

A production-ready, hackathon-level geopolitical intelligence platform that aggregates multi-source news, performs AI-powered analysis, generates forecasts, and provides interactive visualizations.

## 🚀 Features

### Core Capabilities
- **Multi-Search Engine Aggregation** - Google Custom Search, Bing, NewsAPI
- **Source Ranking Engine** - Credibility scoring, frequency analysis, recency weighting
- **AI Consensus Voting** - GPT-4 powered analysis with confidence scoring
- **Event Extraction** - Automated geopolitical event detection
- **Impact Analysis** - Sector, commodity, and trade route impact assessment
- **ML Forecasting** - Prophet-based price predictions
- **Narrative vs Reality Detection** - Misinformation detection and verification
- **Agentic AI Assistant** - Natural language query interface
- **Google Maps Integration** - Interactive conflict visualization
- **Real-time Dashboard** - Event monitoring and risk tracking

### Technical Stack
- **Backend**: Node.js + Express
- **ML Service**: Python + FastAPI
- **Database**: MongoDB + Mongoose
- **Cache**: Redis (optional)
- **Frontend**: React + Vite + TailwindCSS
- **Maps**: Google Maps API
- **AI**: OpenAI GPT-4
- **Charts**: Recharts

## 📁 Project Structure

```
Global-Risk-Intelligence/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express server
│   │   ├── config/                # Database & Redis config
│   │   ├── models/                # Mongoose models
│   │   ├── routes/                # API routes
│   │   ├── controllers/           # Request handlers
│   │   └── services/              # Business logic
│   │       ├── ai/                # AI services
│   │       ├── search/            # Search aggregation
│   │       ├── impact/            # Impact analysis
│   │       ├── forecast/          # Forecasting
│   │       ├── map/               # Geocoding
│   │       └── agent/             # AI agent
│   ├── package.json
│   └── .env.example
├── python-ml/
│   ├── main.py                    # FastAPI server
│   ├── forecast.py                # ML forecasting
│   ├── impact_model.py            # Impact modeling
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/                 # React pages
    │   ├── components/            # React components
    │   │   ├── maps/              # Google Maps
    │   │   └── dashboard/         # Dashboard components
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```



## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB 6.0+
- Redis 7.0+ (optional)

### 1. Clone and Navigate
```bash
cd Global-Risk-Intelligence
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your API keys
```

### 3. Python ML Service Setup
```bash
cd ../python-ml
pip install -r requirements.txt
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your Google Maps API key
```

### 5. Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
REDIS_URL=redis://localhost:6379

OPENAI_API_KEY=your_openai_api_key

GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_api_key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

BING_SEARCH_API_KEY=your_bing_api_key
NEWS_API_KEY=your_newsapi_key

PYTHON_ML_SERVICE_URL=http://localhost:8000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 🚀 Running the Application

### Start MongoDB
```bash
mongod --dbpath /path/to/data
```

### Start Redis (Optional)
```bash
redis-server
```

### Start Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Python ML Service
```bash
cd python-ml
python main.py
# Service runs on http://localhost:8000
```

### Start Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

## 📡 API Endpoints

### Search & Analysis
- `POST /api/search` - Multi-source search aggregation
- `POST /api/search/rank` - Rank sources by credibility
- `POST /api/analyze/consensus` - AI consensus analysis
- `POST /api/analyze/extract` - Extract event data
- `POST /api/analyze/narrative` - Narrative verification
- `POST /api/analyze/impact` - Impact analysis
- `POST /api/analyze/full` - Full analysis pipeline

### Events
- `POST /api/event` - Create new event analysis
- `GET /api/event` - Get all events (with filters)
- `GET /api/event/:id` - Get event details
- `PUT /api/event/:id` - Update event
- `DELETE /api/event/:id` - Delete event

### Maps & Forecasting
- `POST /api/map/geocode` - Geocode location
- `GET /api/map/regions` - Get map regions
- `POST /api/forecast` - Generate forecast
- `GET /api/forecast` - Get forecasts

### AI Agent
- `POST /api/agent/query` - Ask AI assistant
- `POST /api/agent/process` - Process complex query

## 🎯 Usage Examples

### Create Event Analysis
```bash
curl -X POST http://localhost:5000/api/event \
  -H "Content-Type: application/json" \
  -d '{"query": "Ukraine conflict impact on oil prices"}'
```

### Ask AI Assistant
```bash
curl -X POST http://localhost:5000/api/agent/query \
  -H "Content-Type: application/json" \
  -d '{"question": "How will Middle East tensions affect shipping?"}'
```

### Search News
```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Iran sanctions", "count": 10}'
```

## 🗄️ Database Models

### Event
- title, description, country, region, lat, lng
- sources[], impact, forecast, summary
- narrativeAnalysis, eventType, status

### Source
- url, title, content, snippet, domain
- credibilityScore, searchEngine, publishedAt

### Analysis
- eventId, analysisType, result, confidence
- aiModel, sources[], metadata

### Forecast
- eventId, commodity, prediction, confidence
- timeframe, modelUsed, data

### MapRegion
- country, region, lat, lng, bounds
- riskLevel, activeEvents[]

### Narrative
- eventId, narrativeText, sentiment
- classification, confidence, evidenceSources[]

## 🔧 Key Services

### Search Aggregator
Combines results from Google, Bing, and NewsAPI with deduplication.

### Source Ranker
Ranks sources based on:
- Credibility (domain reputation)
- Frequency (cross-source validation)
- Recency (publication date)
- Similarity (content matching)

### AI Consensus Engine
Uses GPT-4 to:
- Analyze multiple sources
- Extract key facts
- Identify contradictions
- Generate consensus summary

### Impact Analyzer
Rule-based system analyzing:
- Affected sectors
- Commodity impacts
- Trade route disruptions
- Economic severity

### Forecast Service
Hybrid ML + rule-based forecasting:
- Prophet time series analysis
- Event impact multipliers
- Confidence scoring

### Agentic AI
Multi-tool agent pipeline:
- Search tool
- Ranking tool
- Analysis tool
- Impact tool
- Forecast tool
- Map tool

## 🎨 Frontend Features

### Dashboard
- Interactive Google Maps with conflict markers
- Event cards with risk levels
- Risk distribution charts
- Real-time statistics
- Event filtering

### Event Detail Page
- Comprehensive event analysis
- AI consensus summary
- Impact breakdown
- Price forecasts
- Source verification
- Interactive map

### AI Assistant
- Natural language queries
- Multi-step reasoning
- Structured responses
- Example questions
- Real-time analysis

## 🔐 Security Notes

- Never commit API keys to version control
- Use environment variables for all secrets
- Implement rate limiting in production
- Add authentication for production deployment
- Validate all user inputs
- Sanitize database queries

## 📊 Performance Optimization

- Redis caching for frequent queries
- MongoDB indexing on key fields
- Lazy loading for map markers
- Pagination for large result sets
- Debounced search inputs
- Optimized bundle sizes

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongosh
# Verify connection string in .env
```

### API Key Errors
- Verify all API keys are valid
- Check API quotas and limits
- Ensure .env files are loaded

### Frontend Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

MIT License - Free for hackathon and educational use

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend!

## 📧 Support

For issues and questions, check the API documentation or review the code comments.

---

**Built for hackathons. Production-ready architecture. Fully functional.**
