# Quick Setup Guide

## 🚀 5-Minute Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Python ML
cd ../python-ml
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 2. Configure API Keys

#### Backend: `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/global-intel

# Required for full functionality
OPENAI_API_KEY=sk-...

# Optional (system works without these)
GOOGLE_CUSTOM_SEARCH_API_KEY=...
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=...
BING_SEARCH_API_KEY=...
NEWS_API_KEY=...
GOOGLE_MAPS_API_KEY=...
```

#### Frontend: `frontend/.env`
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=...
```

### 3. Start Services

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Python ML:**
```bash
cd python-ml
python main.py
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Python ML: http://localhost:8000

## 🔑 Getting API Keys

### OpenAI (Required)
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Add to `OPENAI_API_KEY`

### Google Custom Search (Optional)
1. Go to https://console.cloud.google.com/
2. Enable Custom Search API
3. Create credentials
4. Get API key and Search Engine ID

### Google Maps (Optional)
1. Go to https://console.cloud.google.com/
2. Enable Maps JavaScript API
3. Create API key
4. Add to both backend and frontend .env

### Bing Search (Optional)
1. Go to https://portal.azure.com/
2. Create Bing Search resource
3. Get API key

### NewsAPI (Optional)
1. Go to https://newsapi.org/
2. Sign up for free account
3. Get API key

## ✅ Verify Installation

### Test Backend
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok"}
```

### Test Python ML
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

### Test Frontend
Open http://localhost:3000 in browser

## 🎯 First Steps

1. Click "Analyze Event" button
2. Enter: "Ukraine conflict impact on oil prices"
3. Wait for analysis (30-60 seconds)
4. View results on dashboard
5. Click event card for detailed analysis
6. Try AI Assistant with questions

## 🐛 Common Issues

### MongoDB not starting
```bash
# Create data directory
mkdir -p /data/db
sudo mongod --dbpath /data/db
```

### Port already in use
```bash
# Change ports in .env files
# Backend: PORT=5001
# Frontend: vite.config.js server.port: 3001
```

### Python dependencies fail
```bash
# Use virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### API keys not working
- Check .env files are in correct directories
- Restart servers after adding keys
- Verify keys are valid and have quota

## 📚 Next Steps

- Read full README.md for detailed documentation
- Explore API endpoints
- Customize impact rules
- Add more data sources
- Deploy to production

## 💡 Tips

- Start with just OpenAI key for basic functionality
- Add other API keys gradually
- Use example queries in AI Assistant
- Check browser console for errors
- Monitor backend logs for issues

---

**Need help?** Check the main README.md or review code comments.
