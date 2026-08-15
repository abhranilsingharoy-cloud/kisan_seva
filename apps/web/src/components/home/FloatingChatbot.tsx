"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Maximize2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'agent', text: 'Namaste! I am your KisanSeva AI. How can I help you with your farming today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setInputText('');
    setIsTyping(true);

    try {
      const resp = await fetch('/api/v1/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userText,
          language: 'en',
          user_id: 'demo-farmer-home',
          context: {},
        }),
      });

      if (!resp.ok) throw new Error('API Error');
      const data = await resp.json();
      
      let agentReply = data?.result?.text || 'Analysis complete. Please visit the Agent page for full details.';
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: agentReply,
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: 'Sorry, I am having trouble connecting right now. Please try again later.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Chat Button */}
      {!isOpen && (
        <div className="relative animate-float">
          {/* Glowing ping ring behind the button */}
          <div className="absolute inset-0 bg-[#166534] rounded-full animate-ping opacity-25"></div>
          
          <button 
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-[#166534] hover:bg-[#14532d] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group z-10"
          >
            <MessageSquare size={24} className="group-hover:scale-110 transition-transform duration-300" />
            {/* Notification Dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
            
            {/* Tooltip */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-sm font-semibold py-2 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-100">
              Chat with AI
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-r border-t border-gray-100"></div>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[380px] h-[520px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-[#166534] text-white px-4 py-3 flex items-center justify-between shadow-sm relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-[15px] leading-tight">KisanSeva AI</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-[10px] text-green-100 uppercase tracking-wider font-semibold">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/agent" className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/80 hover:text-white" title="Open full agent">
                <Maximize2 size={16} />
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc] space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'agent' && (
                  <div className="w-6 h-6 rounded-full bg-[#166534] text-white flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <Bot size={12} />
                  </div>
                )}
                <div 
                  className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#166534] text-white rounded-br-sm shadow-sm' 
                      : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100 shadow-sm whitespace-pre-wrap leading-relaxed'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-[#166534] text-white flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Bot size={12} />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-100 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 relative z-10">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your crops..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className={`absolute right-1 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  inputText.trim() && !isTyping 
                    ? 'bg-[#166534] text-white shadow-sm hover:bg-[#14532d]' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isTyping ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="ml-0.5" />}
              </button>
            </div>
          </div>

        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.25s ease-out forwards;
          transform-origin: bottom right;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

