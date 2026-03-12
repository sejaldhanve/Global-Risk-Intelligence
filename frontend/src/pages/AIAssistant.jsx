import { useState } from 'react'
import { Send, Bot, Loader, AlertCircle } from 'lucide-react'
import axios from 'axios'

export default function AIAssistant() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const exampleQuestions = [
    "How will the Ukraine conflict affect oil prices?",
    "Which regions are most impacted by Middle East tensions?",
    "Is the risk of shipping disruptions real or exaggerated?",
    "What commodities are at highest risk from current conflicts?"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    const userMessage = { role: 'user', content: question }
    setMessages([...messages, userMessage])
    setQuestion('')
    setLoading(true)

    try {
      const response = await axios.post('/api/agent/query', { question })
      
      const assistantMessage = {
        role: 'assistant',
        content: response.data.response
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = {
        role: 'error',
        content: error.response?.data?.error || 'Failed to get response from AI assistant'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (example) => {
    setQuestion(example)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center animate-slide-up">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 shadow-[0_0_15px_rgba(252,163,17,0.3)]">
          <Bot className="h-8 w-8 text-[#fca311]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          AI Intelligence Assistant
        </h1>
        <p className="text-gray-400">
          Ask questions about geopolitical events, impacts, and forecasts
        </p>
      </div>

      {messages.length === 0 && (
        <div className="card animate-slide-up animation-delay-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-100">Example Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleQuestions.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="text-left p-4 border border-white/10 rounded-lg hover:border-[#fca311]/50 hover:bg-white/5 transition-colors group"
              >
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{example}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card min-h-[400px] max-h-[600px] overflow-y-auto animate-slide-up animation-delay-200">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center animate-pulse">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Start a conversation by asking a question</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[#fca311] to-[#ffd166] text-black'
                      : message.role === 'error'
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                      : 'bg-white/10 text-gray-100 border border-white/5'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="space-y-3 text-sm md:text-base">
                      <p className="font-medium text-white">{message.content.answer}</p>
                      
                      {message.content.keyFindings && message.content.keyFindings.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-[#ffd166]">Key Findings:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                            {message.content.keyFindings.map((finding, i) => (
                              <li key={i}>{finding}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {message.content.data && (
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                          {message.content.data.risk && (
                            <div>
                              <span className="text-xs text-gray-400">Risk Level</span>
                              <p className="font-semibold text-white">{message.content.data.risk}</p>
                            </div>
                          )}
                          {message.content.data.confidence && (
                            <div>
                              <span className="text-xs text-gray-400">Confidence</span>
                              <p className="font-semibold text-white">{message.content.data.confidence}%</p>
                            </div>
                          )}
                        </div>
                      )}

                      {message.content.recommendations && message.content.recommendations.length > 0 && (
                        <div className="pt-3 border-t border-white/10">
                          <h4 className="font-semibold text-sm mb-2 text-[#ffd166]">Recommendations:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                            {message.content.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : message.role === 'error' ? (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ) : (
                    <p className="font-medium">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 shadow-md">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader className="h-5 w-5 animate-spin text-[#fca311]" />
                    <span>Analyzing intelligence...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="card animate-slide-up animation-delay-300">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about geopolitical events, impacts, or forecasts..."
            className="input flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
            <span>Send Target Check</span>
          </button>
        </div>
      </form>
    </div>
  )
}
