require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');

const searchRoutes = require('./routes/search');
const analysisRoutes = require('./routes/analysis');
const eventRoutes = require('./routes/event');
const mapRoutes = require('./routes/map');
const forecastRoutes = require('./routes/forecast');
const agentRoutes = require('./routes/agent');
const discourseRoutes = require('./routes/discourse');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'Global Conflict Impact Intelligence Platform API',
    version: '1.0.0',
    endpoints: {
      search: '/api/search',
      analysis: '/api/analyze',
      events: '/api/event',
      map: '/api/map',
      forecast: '/api/forecast',
      agent: '/api/agent'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/search', searchRoutes);
app.use('/api/analyze', analysisRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/discourse', discourseRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log(`\n📚 Available endpoints:`);
      console.log(`   POST /api/search - Search aggregation`);
      console.log(`   POST /api/analyze/full - Full analysis`);
      console.log(`   POST /api/event - Create event`);
      console.log(`   GET  /api/event - Get events`);
      console.log(`   POST /api/map/geocode - Geocode location`);
      console.log(`   POST /api/forecast - Generate forecast`);
      console.log(`   POST /api/agent/query - Ask AI agent\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
