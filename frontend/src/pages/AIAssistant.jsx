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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Bot className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Intelligence Assistant
        </h1>
        <p className="text-gray-600">
          Ask questions about geopolitical events, impacts, and forecasts
        </p>
      </div>

      {messages.length === 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Example Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleQuestions.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <p className="text-sm text-gray-700">{example}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Start a conversation by asking a question</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : message.role === 'error'
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="space-y-3">
                      <p className="font-medium">{message.content.answer}</p>
                      
                      {message.content.keyFindings && message.content.keyFindings.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Key Findings:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {message.content.keyFindings.map((finding, i) => (
                              <li key={i}>{finding}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {message.content.data && (
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                          {message.content.data.risk && (
                            <div>
                              <span className="text-xs text-gray-600">Risk Level</span>
                              <p className="font-semibold">{message.content.data.risk}</p>
                            </div>
                          )}
                          {message.content.data.confidence && (
                            <div>
                              <span className="text-xs text-gray-600">Confidence</span>
                              <p className="font-semibold">{message.content.data.confidence}%</p>
                            </div>
                          )}
                        </div>
                      )}

                      {message.content.recommendations && message.content.recommendations.length > 0 && (
                        <div className="pt-3 border-t border-gray-200">
                          <h4 className="font-semibold text-sm mb-2">Recommendations:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
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
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="flex gap-3">
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
            className="btn btn-primary flex items-center gap-2"
          >
            <Send className="h-5 w-5" />
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
