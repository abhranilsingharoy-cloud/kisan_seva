"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Camera, ArrowLeft, Zap, Circle, CheckCircle, XCircle, Leaf, 
  TrendingUp, CloudSun, Brain, MessageSquare, Star, ThumbsUp, ThumbsDown, 
  Home, Calendar, Activity, MapPin, Globe, Plus, Mic, Image as ImageIcon,
  ChevronDown, ChevronUp
} from 'lucide-react';

// Types
type MessageSender = 'user' | 'agent' | 'system';
type MessageType = 'text' | 'diagnosis' | 'price' | 'weather' | 'thinking';

interface Message {
  id: string;
  sender: MessageSender;
  type: MessageType;
  text: string;
  agentLabel?: string;
  data?: any;
}

const AGENTS = [
  { id: 'diagnosis', name: 'Diagnosis Agent', icon: <Activity size={16} />, status: 'active', color: 'var(--color-success)' },
  { id: 'weather', name: 'Weather Agent', icon: <CloudSun size={16} />, status: 'active', color: 'var(--color-success)' },
  { id: 'market', name: 'Market Agent', icon: <TrendingUp size={16} />, status: 'active', color: 'var(--color-success)' },
  { id: 'soil', name: 'Soil Health Agent', icon: <Leaf size={16} />, status: 'active', color: 'var(--color-success)' },
  { id: 'outbreak', name: 'Outbreak Monitor', icon: <Globe size={16} />, status: 'active', color: 'var(--color-success)' },
  { id: 'kb', name: 'Knowledge Base', icon: <Brain size={16} />, status: 'active', color: 'var(--color-success)' },
  { id: 'sms', name: 'SMS/IVR Agent', icon: <MessageSquare size={16} />, status: 'active', color: 'var(--color-success)' }
];

export default function AgentChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [isThinking, setIsThinking] = useState(false);
  const [activeThinkingAgents, setActiveThinkingAgents] = useState<string[]>([]);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // ── Real API call with Gemini fallback ──────────────────
  const callAgentAPI = async (query: string) => {
    try {
      const resp = await fetch('/api/v1/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language: selectedLang,
          user_id: 'demo-farmer-001',
          context: {},
        }),
      })
      if (!resp.ok) throw new Error(`API ${resp.status}`)
      return await resp.json()
    } catch (err) {
      console.error('[AgentChat] API error:', err)
      return null
    }
  }

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? inputText).trim()
    if (!text) return

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      type: 'text',
      text,
    }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    await runAgentResponse(text)
  }

  const runAgentResponse = async (query: string) => {
    const q = query.toLowerCase()
    setIsThinking(true)

    // ── Detect intent for routing animation + rich cards ──
    let routedAgents: string[]
    let responseType: MessageType
    let agentLabel: string
    let responseData: any = null

    if (q.includes('tomato') || q.includes('brown') || q.includes('spot') ||
        q.includes('disease') || q.includes('blight') || q.includes('leaf')) {
      routedAgents  = ['Diagnosis Agent', 'Knowledge Base']
      responseType  = 'diagnosis'
      agentLabel    = '🔬 Diagnosis Agent'
      responseData  = {
        disease: 'Early Blight (Alternaria Solani)',
        crop: 'Tomato', confidence: 91, severity: 'Moderate',
        treatment: [
          'Remove and destroy infected lower leaves immediately.',
          'Apply Mancozeb 75 WP @ 2.5 g/litre as foliar spray.',
          'Avoid overhead irrigation — keep foliage dry.',
          'Follow up with Copper Oxychloride after 7 days.',
        ],
        organic: 'Neem oil 5 ml/litre or Bacillus subtilis spray every 7 days.',
      }
    } else if (q.includes('price') || q.includes('mandi') || q.includes('onion') ||
               q.includes('bhav') || q.includes('market')) {
      routedAgents  = ['Market Agent']
      responseType  = 'price'
      agentLabel    = '📈 Market Agent'
      responseData  = {
        bestMarket: 'Azadpur Delhi', bestPrice: '₹2,340', unit: 'qtl',
        mandis: [
          { name: 'Azadpur Delhi',   price: '₹2,340', delta: '+45', trend: 'up'   },
          { name: 'Lasalgaon, MH',   price: '₹2,100', delta: '-10', trend: 'down' },
          { name: 'Pune APMC',       price: '₹2,250', delta: '+20', trend: 'up'   },
        ],
      }
    } else if (q.includes('water') || q.includes('irrigation') ||
               q.includes('wheat') || q.includes('paani') || q.includes('sinchayee')) {
      routedAgents  = ['Weather Agent', 'Soil Health Agent']
      responseType  = 'weather'
      agentLabel    = '🌤 Weather + Soil Agents'
      responseData  = {
        recommendation: 'Irrigate 28 mm today',
        summary: 'Hot and dry — soil moisture at root zone is 42%. No rain forecast for 3 days.',
        forecast: [
          { day: 'Today', temp: '34°', icon: '☀️' },
          { day: 'Tomorrow', temp: '36°', icon: '🌤' },
          { day: 'Wed', temp: '33°', icon: '⛅' },
        ],
      }
    } else {
      routedAgents  = ['Knowledge Base', 'Master Orchestrator']
      responseType  = 'text'
      agentLabel    = '🧠 KisanSeva AI'
      responseData  = null
    }

    setActiveThinkingAgents(routedAgents)

    // ── Call real Gemini API ──────────────────────────────
    const apiResult = await callAgentAPI(query)
    setIsThinking(false)

    // Use LLM text for general queries; use rich card data for known intents
    const responseText =
      responseData
        ? (apiResult?.result?.text ?? 'Analysis complete. See details below.')
        : (apiResult?.result?.text ??
           'Based on agricultural best practices, monitor your field for early stress signs and maintain optimal irrigation schedules.')

    setMessages(prev => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        type: responseType,
        text: responseText,
        agentLabel,
        data: responseData,
      },
    ])
  }

  const handleSuggestion = (text: string) => {
    handleSend(text)
  }

  return (
    <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden font-sans" style={{ backgroundColor: 'var(--color-parchment, #fcfaf1)', color: 'var(--color-ink, #211b15)' }}>
      
      {/* LEFT SIDEBAR (Desktop) */}
      <div className="hidden lg:flex w-80 flex-col flex-shrink-0 border-r border-gray-800" style={{ backgroundColor: 'var(--color-charcoal-olive, #252a23)', color: 'var(--color-parchment, #fcfaf1)' }}>
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="text-green-400" size={24} />
            <h1 className="text-2xl font-bold font-serif tracking-tight">KisanSeva</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-bark, #96897b)' }}>AI Advisory System</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Active Agents */}
          <div>
            <h2 className="text-xs uppercase tracking-wider mb-4 font-semibold text-gray-400">System Status</h2>
            <div className="space-y-3">
              {AGENTS.map(agent => (
                <div key={agent.id} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-gray-800 text-gray-300 group-hover:bg-gray-700 transition-colors">
                      {agent.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-200">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xs uppercase tracking-wider mb-4 font-semibold text-gray-400">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Diagnose my crop', icon: <ImageIcon size={14} />, query: 'My tomato leaves have brown spots' },
                { label: 'Check mandi prices', icon: <TrendingUp size={14} />, query: 'Best price for onion near Pune' },
                { label: 'Get irrigation schedule', icon: <CloudSun size={14} />, query: 'How much water for wheat today?' },
                { label: 'Soil fertilizer plan', icon: <Leaf size={14} />, query: 'Fertilizer plan for nitrogen deficient soil' }
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => handleSuggestion(action.query)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md bg-gray-800/50 hover:bg-gray-800 text-gray-300 transition-colors"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Language Selector */}
          <div>
            <h2 className="text-xs uppercase tracking-wider mb-3 font-semibold text-gray-400">Language</h2>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'EN', code: 'en' }, 
                { label: 'हिं', code: 'hi' }, 
                { label: 'বাং', code: 'bn' },
                { label: 'தமி', code: 'ta' }, 
                { label: 'తెలు', code: 'te' }
              ].map((lang, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedLang(lang.code)}
                  className={`px-3 py-1 text-xs rounded-md font-medium ${selectedLang === lang.code ? 'bg-gray-700 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Architecture Expander */}
          <div>
            <button 
              onClick={() => setShowArchitecture(!showArchitecture)}
              className="flex items-center justify-between w-full text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-gray-300"
            >
              Agent Architecture
              {showArchitecture ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showArchitecture && (
              <div className="mt-3 text-[10px] leading-tight text-gray-500 font-mono bg-gray-900 p-3 rounded-md overflow-hidden">
                <pre>{`User Input
   │
▼ Router Agent
   ├─► Diagnosis
   ├─► Market
   └─► Weather
   │
▼ Synthesis
   │
Final Output`}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col relative h-full">
        
        {/* Top Chat Bar */}
        <header className="flex-shrink-0 h-16 border-b flex items-center justify-between px-4 lg:px-6 z-10 bg-white/80 backdrop-blur-md" style={{ borderColor: 'var(--color-bone, #efe9e0)' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg">KisanSeva AI</h1>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-100">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-success, #2d7a4f)' }}></span>
                  <span className="text-[10px] font-medium text-green-700 uppercase tracking-wider">Online</span>
                </div>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-bark, #96897b)' }}>Multi-Agent System · 7 Agents Active</p>
            </div>
          </div>
          <button 
            onClick={() => setMessages([])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-bone, #efe9e0)', color: 'var(--color-saddle, #50463c)' }}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-32 space-y-6">
          
          {messages.length === 0 ? (
            /* Welcome State */
            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center space-y-8 animate-fade-in mt-10">
              <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--color-bone, #efe9e0)' }}>
                <Bot size={40} style={{ color: 'var(--color-sage, #7a9779)' }} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-serif font-bold">Namaste! I'm your KisanSeva AI</h2>
                <p className="text-lg" style={{ color: 'var(--color-saddle, #50463c)' }}>Powered by 7 specialist agricultural agents working together.</p>
              </div>
              
              <div className="w-full max-w-lg space-y-3 mt-8">
                <p className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--color-bark, #96897b)' }}>Ask me anything</p>
                {[
                  'My tomato leaves have brown spots 🍅',
                  'Best price for onion near Pune 📈',
                  'How much water for wheat today? 💧'
                ].map((suggestion, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSuggestion(suggestion)}
                    className="w-full p-4 rounded-xl text-left border shadow-sm hover:shadow-md transition-all flex items-center justify-between group bg-white"
                    style={{ borderColor: 'var(--color-bone, #efe9e0)' }}
                  >
                    <span className="font-medium text-gray-800">{suggestion}</span>
                    <Send size={16} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
                  </button>
                ))}
              </div>
              
              <div className="flex flex-col items-center gap-3 mt-8 pt-8 border-t w-full max-w-lg" style={{ borderColor: 'var(--color-bone, #efe9e0)' }}>
                <p className="text-sm" style={{ color: 'var(--color-bark, #96897b)' }}>Or upload a crop photo for instant diagnosis</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-medium shadow-sm hover:shadow transition-shadow"
                  style={{ backgroundColor: 'var(--color-honey-amber, #e8b672)', color: '#fff' }}
                >
                  <Camera size={18} />
                  Upload Photo
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" />
              </div>
            </div>
          ) : (
            /* Message List */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, i) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  
                  {msg.sender === 'agent' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-sm border border-gray-100 bg-white">
                      <Bot size={18} style={{ color: 'var(--color-sage, #7a9779)' }} />
                    </div>
                  )}

                  <div className={`max-w-[85%] lg:max-w-[75%] ${msg.sender === 'user' ? '' : 'space-y-3'}`}>
                    
                    {/* Agent Label */}
                    {msg.sender === 'agent' && msg.agentLabel && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-sage, #7a9779)' }}>
                        {msg.agentLabel}
                      </div>
                    )}

                    {/* Message Bubble/Card */}
                    <div 
                      className={`rounded-2xl p-4 shadow-sm ${
                        msg.sender === 'user' 
                          ? 'rounded-tr-sm text-gray-900 font-medium' 
                          : 'rounded-tl-sm bg-white border'
                      }`}
                      style={msg.sender === 'user' 
                        ? { backgroundColor: 'var(--color-honey-amber, #e8b672)' } 
                        : { borderColor: 'var(--color-bone, #efe9e0)' }
                      }
                    >
                      {/* Text content */}
                      {msg.text && (
                        <p className={`whitespace-pre-wrap leading-relaxed ${msg.type !== 'text' ? 'mb-4' : ''}`}>
                          {msg.text}
                        </p>
                      )}

                      {/* Specialized Rich Cards */}
                      {msg.type === 'diagnosis' && msg.data && (
                        <div className="rounded-xl overflow-hidden border border-amber-200 bg-amber-50/50 mt-2">
                          <div className="p-4 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-xs font-semibold uppercase text-amber-700 tracking-wider mb-1">Detected Issue</div>
                                <h3 className="text-lg font-bold font-serif text-gray-900">{msg.data.disease}</h3>
                                <p className="text-sm text-gray-600">Crop: {msg.data.crop}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                  {msg.data.severity} Severity
                                </span>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600 font-medium">Confidence</span>
                                <span className="text-green-700 font-bold">{msg.data.confidence}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${msg.data.confidence}%` }}></div>
                              </div>
                            </div>

                            <div className="space-y-2 pt-2">
                              <h4 className="text-sm font-semibold text-gray-900">Immediate Treatment:</h4>
                              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 ml-1">
                                {msg.data.treatment.map((step: string, idx: number) => (
                                  <li key={idx} className="leading-snug">{step}</li>
                                ))}
                              </ol>
                            </div>

                            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-sm flex gap-2 items-start mt-3">
                              <Leaf className="text-green-600 shrink-0 mt-0.5" size={16} />
                              <div>
                                <span className="font-semibold text-green-800 block mb-0.5">Organic Alternative</span>
                                <span className="text-green-700">{msg.data.organic}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white border-t border-amber-200 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Was this correct?</span>
                            <div className="flex gap-2">
                              <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded bg-gray-50 hover:bg-green-50 hover:text-green-700 border border-gray-200 transition-colors">
                                <ThumbsUp size={12} /> Yes
                              </button>
                              <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded bg-gray-50 hover:bg-red-50 hover:text-red-700 border border-gray-200 transition-colors">
                                <ThumbsDown size={12} /> No
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {msg.type === 'price' && msg.data && (
                        <div className="rounded-xl border mt-2 overflow-hidden bg-white" style={{ borderColor: 'var(--color-bone, #efe9e0)' }}>
                          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-semibold uppercase text-emerald-700 tracking-wider flex items-center gap-1 mb-1">
                                <Star size={12} className="fill-emerald-600 text-emerald-600" /> Best Price Alert
                              </div>
                              <div className="text-lg font-bold text-gray-900">{msg.data.bestMarket}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-emerald-700">{msg.data.bestPrice}</div>
                              <div className="text-xs text-gray-600">per {msg.data.unit}</div>
                            </div>
                          </div>
                          <div className="p-0">
                            <table className="w-full text-sm">
                              <tbody>
                                {msg.data.mandis.map((mandi: any, idx: number) => (
                                  <tr key={idx} className={`border-b last:border-0 ${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`} style={{ borderColor: 'var(--color-bone, #efe9e0)' }}>
                                    <td className="py-3 px-4 text-gray-800 font-medium">{mandi.name}</td>
                                    <td className="py-3 px-4 text-right font-semibold text-gray-900">{mandi.price}</td>
                                    <td className="py-3 px-4 text-right w-20">
                                      <span className={`inline-flex items-center text-xs font-medium ${mandi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                        {mandi.trend === 'up' ? '▲' : '▼'} {mandi.delta}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="p-3 bg-gray-50 flex justify-center">
                            <button className="text-sm font-medium hover:underline" style={{ color: 'var(--color-sage, #7a9779)' }}>
                              Set Price Alert for Onion
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.type === 'weather' && msg.data && (
                        <div className="rounded-xl border mt-2 overflow-hidden bg-white" style={{ borderColor: 'var(--color-bone, #efe9e0)' }}>
                          <div className="p-4 pb-3">
                            <p className="text-sm text-gray-600 mb-3">{msg.data.summary}</p>
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 font-medium text-sm">
                              <Zap size={16} className="text-blue-500" />
                              {msg.data.recommendation}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 divide-x border-t bg-gray-50" style={{ borderColor: 'var(--color-bone, #efe9e0)' }}>
                            {msg.data.forecast.map((f: any, idx: number) => (
                              <div key={idx} className="p-3 flex flex-col items-center justify-center text-center">
                                <span className="text-xs text-gray-500 font-medium mb-1">{f.day}</span>
                                {f.icon}
                                <span className="text-sm font-bold text-gray-900 mt-1">{f.temp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              ))}

              {/* Thinking State */}
              {isThinking && (
                <div className="flex justify-start animate-fade-in">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-sm border border-gray-100 bg-white">
                    <Bot size={18} style={{ color: 'var(--color-sage, #7a9779)' }} />
                  </div>
                  <div className="max-w-[85%] lg:max-w-[75%] space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      System Processing
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-white border p-4 shadow-sm" style={{ borderColor: 'var(--color-bone, #efe9e0)' }}>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Routing to agents...</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {activeThinkingAgents.map((agent, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100 animate-pulse">
                            <CheckCircle size={10} />
                            {agent}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Area (Fixed Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 lg:bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4 lg:pb-6 px-4 lg:px-6 z-20">
          <div className="max-w-3xl mx-auto mb-16 lg:mb-0">
            <div className="relative flex items-end shadow-lg rounded-2xl bg-white border" style={{ borderColor: 'var(--color-bone, #efe9e0)' }}>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-400 hover:text-gray-600 transition-colors ml-1"
                title="Upload photo"
              >
                <Camera size={22} />
              </button>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask in any language... (Type in Hindi, Tamil, Telugu too)"
                className="flex-1 max-h-32 min-h-[52px] py-3.5 px-2 bg-transparent resize-none outline-none text-gray-800 placeholder-gray-400"
                rows={1}
              />
              
              <div className="p-2 mr-1 flex items-center">
                {inputText.trim() && !isThinking ? (
                  <button 
                    id="send-btn"
                    onClick={() => handleSend()}
                    className="p-2 rounded-xl text-white shadow-md hover:shadow-lg transition-all"
                    style={{ backgroundColor: 'var(--color-honey-amber, #e8b672)' }}
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                ) : isThinking ? (
                  <button disabled className="p-2 rounded-xl text-white opacity-60 bg-gray-400 cursor-not-allowed">
                    <Send size={18} className="ml-0.5 animate-pulse" />
                  </button>
                ) : (
                  <button className="p-2 rounded-xl text-gray-400 hover:text-gray-600 transition-colors bg-gray-50">
                    <Mic size={18} />
                  </button>
                )}
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] font-medium tracking-wide" style={{ color: 'var(--color-bark, #96897b)' }}>
                Responses in English · हिंदी · বাংলা · தமிழ் · తెలుగు
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* MOBILE BOTTOM NAV (lg:hidden) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center px-2 z-50 pb-safe" style={{ borderColor: 'var(--color-bone, #efe9e0)' }}>
        {[
          { label: 'Home', icon: <Home size={20} />, active: false },
          { label: 'Diagnose', icon: <Activity size={20} />, active: false },
          { label: 'Market', icon: <TrendingUp size={20} />, active: false },
          { label: 'AI Chat', icon: <Bot size={20} />, active: true },
          { label: 'My Plots', icon: <Calendar size={20} />, active: false },
        ].map((item, i) => (
          <button 
            key={i} 
            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${item.active ? 'text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className={`${item.active ? 'bg-green-50 p-1.5 rounded-full' : 'p-1.5'}`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-semibold tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}

