import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Loader, AlertCircle, User, Trash2, Sparkles } from 'lucide-react'
import axios from 'axios'

export default function AIAssistant() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const normalizeAssistantContent = (content) => {
    if (!content) {
      return {
        answer: 'No response received from assistant.',
        keyFindings: [],
        data: {},
        recommendations: []
      }
    }

    if (typeof content === 'string') {
      return {
        answer: content,
        keyFindings: [],
        data: {},
        recommendations: []
      }
    }

    if (typeof content === 'object') {
      return {
        answer: content.answer || content.text || content.message || 'No response received from assistant.',
        keyFindings: Array.isArray(content.keyFindings) ? content.keyFindings : [],
        data: content.data && typeof content.data === 'object' ? content.data : {},
        recommendations: Array.isArray(content.recommendations) ? content.recommendations : []
      }
    }

    return {
      answer: 'No response received from assistant.',
      keyFindings: [],
      data: {},
      recommendations: []
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const exampleQuestions = [
    "How will the Ukraine conflict affect oil prices?",
    "Which regions are most impacted by Middle East tensions?",
    "Is the risk of shipping disruptions real or exaggerated?",
    "What commodities are at highest risk from current conflicts?"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMessage = { role: 'user', content: question, time: timestamp }
    setMessages([...messages, userMessage])
    setQuestion('')
    setLoading(true)

    try {
      const response = await axios.post('/api/agent/query', { question })
      
      const assistantMessage = {
        role: 'assistant',
        content: response.data?.response || { answer: 'No response received from assistant.' },
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = {
        role: 'error',
        content: error.response?.data?.error || 'Failed to get response from AI assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (example) => {
    setQuestion(example)
  }

  const clearChat = () => {
    setMessages([])
    setQuestion('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative z-10">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-full shadow-[0_0_15px_rgba(252,163,17,0.3)] relative group">
            <div className="absolute inset-0 bg-[#fca311]/20 rounded-full blur-md group-hover:bg-[#fca311]/40 transition-all duration-300"></div>
            <Bot className="h-7 w-7 text-[#fca311] relative z-10" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              AI Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fca311] to-[#ffd166]">Datalink</span>
            </h1>
            <p className="text-sm text-gray-400 font-light flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span>
              Secure Analyst Terminal Online
            </p>
          </div>
        </div>
        
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="px-4 py-2 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-500/50 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Terminal
          </button>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="card h-[calc(100dvh-240px)] max-h-[760px] min-h-[460px] flex flex-col p-0 overflow-hidden border border-white/10 shadow-2xl relative">
        {/* Ambient background glow inside chat */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#fca311] opacity-[0.02] rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar [scrollbar-gutter:stable] p-6 space-y-6 relative z-10">
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-slide-up">
              <div className="relative">
                <div className="absolute inset-0 bg-[#fca311]/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="w-24 h-24 rounded-full border border-white/10 bg-[#050510]/80 backdrop-blur-md flex items-center justify-center relative z-10">
                   <Sparkles className="h-10 w-10 text-[#fca311]" />
                </div>
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-white">Initialize Analyst Query</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Query the global defense matrix for real-time risk assessments, regional impacts, and strategic forecasts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
                {exampleQuestions.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(example)}
                    className="text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#fca311]/50 hover:bg-white/10 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fca311]/0 to-[#fca311]/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors relative z-10 font-medium">"{example}"</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatars */}
                    <div className="flex-shrink-0 mt-1">
                      {message.role === 'user' ? (
                        <div className="w-8 h-8 rounded-full bg-[#fca311] flex items-center justify-center shadow-[0_0_10px_rgba(252,163,17,0.4)]">
                          <User className="h-4 w-4 text-black" />
                        </div>
                      ) : message.role === 'error' ? (
                        <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
                          <Bot className="h-4 w-4 text-[#fca311]" />
                        </div>
                      )}
                    </div>

                    {/* Bubble Content */}
                    <div className="flex flex-col gap-1">
                      <div className={`flex items-center gap-2 px-1 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500 font-medium">{message.role === 'user' ? 'Operator' : 'AI Datalink'}</span>
                        <span className="text-[10px] text-gray-600 uppercase">{message.time}</span>
                      </div>
                      
                      <div
                        className={`rounded-2xl p-4 shadow-md ${
                          message.role === 'user'
                            ? 'bg-white/10 text-white border border-white/20 rounded-tr-sm'
                            : message.role === 'error'
                            ? 'bg-red-500/10 border border-red-500/30 text-red-200 rounded-tl-sm'
                            : 'bg-gradient-to-br from-white/5 to-transparent text-gray-200 border border-white/10 rounded-tl-sm'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          (() => {
                            const assistantContent = normalizeAssistantContent(message.content)
                            const riskValue = typeof assistantContent.data?.risk === 'string' ? assistantContent.data.risk : 'unknown'
                            const normalizedRisk = riskValue.toLowerCase()
                            const confidenceValue = typeof assistantContent.data?.confidence === 'number'
                              ? assistantContent.data.confidence
                              : null

                            return (
                              <div className="space-y-4 text-sm md:text-base font-light leading-relaxed">
                                <p className="text-gray-100">{assistantContent.answer}</p>
                                
                                {assistantContent.keyFindings.length > 0 && (
                                  <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                                    <h4 className="font-semibold text-xs uppercase tracking-wider mb-2 text-[#ffd166] flex items-center gap-2">
                                      <Sparkles className="h-3 w-3" /> Key Analysis
                                    </h4>
                                    <ul className="space-y-2">
                                      {assistantContent.keyFindings.map((finding, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-300">
                                          <span className="text-[#fca311] mt-0.5">&bull;</span>
                                          <span>{finding}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 mt-4">
                                  <div>
                                    <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Risk Assessed</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase
                                      ${normalizedRisk === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                                        normalizedRisk === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                                        normalizedRisk === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                        'bg-white/10 text-gray-300 border border-white/20'}`}>
                                      {riskValue}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">AI Confidence</span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold">
                                      {confidenceValue !== null ? `${confidenceValue}%` : 'N/A'}
                                    </span>
                                  </div>
                                </div>

                                {assistantContent.recommendations.length > 0 && (
                                  <div className="pt-3 border-t border-white/10 mt-4">
                                    <h4 className="font-semibold text-xs uppercase tracking-wider mb-2 text-[#22c55e]">Actionable Intelligence:</h4>
                                    <ul className="space-y-1 text-sm text-gray-300">
                                      {assistantContent.recommendations.map((rec, i) => (
                                        <li key={i} className="flex gap-2">
                                          <span className="text-[#22c55e] mt-0.5 opacity-50">→</span>
                                          <span>{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )
                          })()
                        ) : message.role === 'error' ? (
                          <div className="flex items-start gap-2">
                            <p className="text-sm">{message.content}</p>
                          </div>
                        ) : (
                          <p className="font-medium">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-fade-in pl-11">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 shadow-md inline-block">
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#fca311] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-[#fca311] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-[#fca311] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm font-medium tracking-wide">Processing signal...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-[#050510]/95 z-20">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#fca311]/0 via-[#fca311]/30 to-[#ffd166]/0 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Transmit intelligence query..."
              className="input flex-1 bg-black/50 border-white/20 relative z-10 focus:border-[#fca311] focus:ring-[#fca311]/20 font-light"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="btn btn-primary relative z-10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group-focus-within:shadow-[0_0_20px_rgba(252,163,17,0.4)]"
            >
              <Send className="h-5 w-5" />
              <span className="hidden sm:inline">Transmit</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
