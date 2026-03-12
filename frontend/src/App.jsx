import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import EventDetail from './pages/EventDetail'
import AIAssistant from './pages/AIAssistant'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/assistant" element={<AIAssistant />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
