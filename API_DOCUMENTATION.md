# API Documentation

Base URL: `http://localhost:5000/api`

_All endpoints return JSON. Authentication is not enabled for hackathon use—add auth for production._

---
## Search APIs

### `POST /search`
Aggregate Google, Bing, and NewsAPI results.

**Body**
```json
{
  "query": "Ukraine conflict oil",
  "count": 10,
  "sources": ["google", "bing", "newsapi"]
}
```

**Success**
```json
{
  "success": true,
  "query": "Ukraine conflict oil",
  "totalResults": 25,
  "results": [
    {
      "title": "Oil surges on Ukraine tensions",
      "url": "https://...",
      "snippet": "...",
      "source": "google",
      "credibilityScore": 85,
      "rank": 1
    }
  ]
}
```

### `POST /search/rank`
Rank arbitrary sources by credibility/frequency/recency.
```json
{
  "sources": [{ "title": "...", "url": "..." }]
}
```

---
## Analysis APIs

### `POST /analyze/consensus`
Run AI consensus on sources.
```json
{
  "query": "Red Sea attacks",
  "sources": [...]
}
```

### `POST /analyze/extract`
Extract structured event details from text + sources.
```json
{
  "text": "...",
  "sources": [...]
}
```

### `POST /analyze/narrative`
Narrative vs reality detection.
```json
{
  "eventData": {...},
  "sources": [...]
}
```

### `POST /analyze/impact`
Rule-based impact analyzer.
```json
{
  "eventData": {
    "eventType": "war",
    "country": "Ukraine",
    "risk": "high"
  }
}
```

### `POST /analyze/full`
Full pipeline (consensus + extraction + impact + narrative).

---
## Event APIs

### `POST /event`
Create an event by running the end-to-end pipeline (search → rank → AI → map → impact → forecast).
```json
{
  "query": "Taiwan strait military drills"
}
```

### `GET /event`
List events with filters.
`/api/event?riskLevel=high&country=Ukraine&domain=energy_supply&limit=20&page=1`

**Query Parameters:**
- `riskLevel`: Filter by risk level (low, medium, high, critical)
- `country`: Filter by country name
- `domain`: Filter by intelligence domain (verified_news, economic_indicators, shipping_activity, energy_supply, logistics_networks, public_discourse)
- `status`: Filter by status (active, monitoring, resolved)
- `limit`: Number of results per page (default: 50)
- `page`: Page number (default: 1)

### `GET /event/:id`
Fetch event + forecasts.

### `PUT /event/:id`
Update event document.

### `DELETE /event/:id`
Remove event.

---
## Map APIs

### `POST /map/geocode`
```json
{
  "country": "Israel",
  "region": "Tel Aviv"
}
```

### `GET /map/regions`
Optional `riskLevel` query parameter.

### `PUT /map/regions/risk`
```json
{
  "country": "Ukraine",
  "region": "Kyiv",
  "riskLevel": "critical"
}
```

---
## Forecast APIs

### `POST /forecast`
```json
{
  "eventData": {
    "event": "Ukraine conflict",
    "eventType": "war",
    "country": "Ukraine",
    "risk": "high"
  },
  "commodity": "wheat"
}
```

### `GET /forecast`
Query params: `commodity`, `eventId`, `limit`.

---
## Agent APIs

### `POST /agent/query`
Ask the agentic AI assistant.
```json
{
  "question": "How will Middle East tensions affect oil?"
}
```

**Response**
```json
{
  "success": true,
  "response": {
    "answer": "Oil likely rises 8-12%...",
    "keyFindings": ["Strait of Hormuz risk", "OPEC spare capacity limited"],
    "data": {
      "risk": "high",
      "confidence": 82
    },
    "recommendations": ["Monitor shipping lanes", "Hedge crude exposure"]
  }
}
```

### `POST /agent/process`
Returns intermediate tool execution outputs for debugging.

---
## Python ML Service Endpoints
(Base URL: `http://localhost:8000`)

### `GET /health`
Health check.

### `POST /forecast`
```json
{
  "event": "...",
  "eventType": "war",
  "country": "Ukraine",
  "commodity": "oil",
  "severity": "high"
}
```

### `POST /impact`
Rule-based impact modeling.

---
## Public Discourse APIs

### `POST /discourse/aggregate`
Aggregate public discourse from various platforms.
```json
{
  "query": "Ukraine conflict",
  "limit": 10
}
```

**Response**
```json
{
  "success": true,
  "query": "Ukraine conflict",
  "discourse": [
    {
      "platform": "reddit",
      "content": "Discussion about Ukraine conflict",
      "sentiment": "mixed",
      "engagement": 842,
      "timestamp": "2024-03-12T10:30:00Z",
      "url": "https://reddit.com/..."
    }
  ],
  "aggregatedSentiment": {
    "dominant": "concerned",
    "distribution": { "concerned": 5, "mixed": 3, "supportive": 2 }
  },
  "totalEngagement": 4250
}
```

### `POST /discourse/narratives`
Detect dominant narratives from discourse data.
```json
{
  "discourseData": [...]
}
```

---
## Notes
- All endpoints return `{ success: false, error: "message" }` on failure.
- Rate limiting/Auth should be added before production.
- Use `PYTHON_ML_SERVICE_URL` to point backend at ML microservice.
- Domain filtering available on event endpoints for intelligence categorization.
