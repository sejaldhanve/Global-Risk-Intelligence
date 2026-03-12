import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import EventDetail from './pages/EventDetail'
import AIAssistant from './pages/AIAssistant'
import FeaturesOverview from './pages/features/FeaturesOverview'
import RegionIntelligence from './pages/features/RegionIntelligence'
import DomainFiltering from './pages/features/DomainFiltering'
import SystemImpact from './pages/features/SystemImpact'
import RiskForecast from './pages/features/RiskForecast'
import NarrativeAnalysis from './pages/features/NarrativeAnalysis'
import PublicDiscourseFeature from './pages/features/PublicDiscourse'
import AIAssistantFeature from './pages/features/AIAssistantFeature'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/assistant" element={<AIAssistant />} />

          <Route path="/features" element={<FeaturesOverview />} />
          <Route path="/features/region-intelligence" element={<RegionIntelligence />} />
          <Route path="/features/domain-filtering" element={<DomainFiltering />} />
          <Route path="/features/system-impact" element={<SystemImpact />} />
          <Route path="/features/risk-forecast" element={<RiskForecast />} />
          <Route path="/features/narrative-analysis" element={<NarrativeAnalysis />} />
          <Route path="/features/public-discourse" element={<PublicDiscourseFeature />} />
          <Route path="/features/ai-assistant" element={<AIAssistantFeature />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
