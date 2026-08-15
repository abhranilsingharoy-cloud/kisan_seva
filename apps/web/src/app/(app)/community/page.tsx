'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, Heart, Share2, Image as ImageIcon, 
  Send, Sparkles, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reply {
  id: string;
  authorName: string;
  authorType: 'farmer' | 'expert' | 'ai';
  content: string;
  timestamp: string;
  likes: number;
}

interface Post {
  id: string;
  authorName: string;
  authorLocation: string;
  avatarColor: string;
  content: string;
  timestamp: string;
  likes: number;
  tags: string[];
  replies: Reply[];
  isAITyping?: boolean; // Frontend only state for animation
}

export default function KisanSabha() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/v1/community');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // In a real app we might use websockets or polling here for live updates.
    const poll = setInterval(fetchPosts, 15000); 
    return () => clearInterval(poll);
  }, []);

  const handlePost = async () => {
    if (!newPostContent.trim()) return;
    setIsSubmitting(true);
    
    const isQuestion = newPostContent.includes('?');
    
    try {
      // 1. Save post to database
      const res = await fetch('/api/v1/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_post', content: newPostContent, isQuestion })
      });
      const data = await res.json();
      
      if (data.success) {
        setNewPostContent('');
        
        // Refetch to get the new post with its ID
        await fetchPosts();

        if (isQuestion) {
          triggerAIExpertResponse(data.postId, newPostContent);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerAIExpertResponse = async (postId: string, question: string) => {
    // 1. Enable frontend typing animation immediately
    setPosts(current => current.map(p => p.id === postId ? { ...p, isAITyping: true } : p));
    
    // Simulate natural delay for typing
    const thinkingTime = Math.random() * 2000 + 2000;
    
    setTimeout(async () => {
      try {
        // 2. Call Backend AI to generate and save the reply
        await fetch('/api/v1/community/ai-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, question })
        });
        
        // 3. Refetch to get the new AI reply from DB
        await fetchPosts();
      } catch (err) {
        console.error(err);
      }
    }, thinkingTime);
  };

  const handleLike = async (id: string, type: 'post' | 'reply') => {
    // Optimistic UI update
    if (type === 'post') {
      setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    }
    
    try {
      await fetch('/api/v1/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', targetId: id, type })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-parchment)', minHeight: '100%', fontFamily: 'var(--font-sans)', color: 'var(--color-ink)' }}>
      <main style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
            <Users size={200} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Users className="w-6 h-6 text-emerald-50" />
              </div>
              <h1 className="text-3xl font-bold">Kisan Sabha</h1>
            </div>
            <p className="text-emerald-100 max-w-lg text-lg">
              The digital village square. Share stories, ask questions, and get verified answers from the AI Expert and fellow farmers.
            </p>
          </div>
        </div>

        {/* Composer */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm text-white font-bold text-lg">
              Y
            </div>
            <div className="flex-1">
              <textarea 
                placeholder="What's happening on your farm? Ask a question with '?' to trigger the AI Expert..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none h-28 transition-all"
              />
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Attach Photo">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                    <Sparkles className="w-3.5 h-3.5" /> AI Expert Active
                  </div>
                </div>
                
                <button 
                  onClick={handlePost}
                  disabled={isSubmitting || !newPostContent.trim()}
                  className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                    isSubmitting || !newPostContent.trim() 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Post Update</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-6">
          <AnimatePresence>
            {loading && (
              <div className="flex flex-col items-center justify-center text-slate-500 py-12">
                 <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p>Loading community feed from server...</p>
              </div>
            )}
          
            {!loading && posts.map((post) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Post Content */}
                <div className="p-5 md:p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className={`w-12 h-12 rounded-full ${post.avatarColor} flex items-center justify-center shrink-0 shadow-sm text-white font-bold text-lg`}>
                        {post.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900">{post.authorName}</h3>
                          {post.authorName.includes('You') && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">You</span>}
                        </div>
                        <div className="text-sm text-slate-500 font-medium">
                          {post.authorLocation} • {post.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                  
                  {post.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interaction Bar */}
                <div className="px-6 py-3 border-y border-slate-100 bg-slate-50 flex items-center gap-6">
                  <button onClick={() => handleLike(post.id, 'post')} className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 font-medium transition-colors group">
                    <Heart className="w-5 h-5 group-hover:fill-rose-500 transition-colors" /> 
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                    <MessageSquare className="w-5 h-5" /> 
                    <span>{post.replies.length}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 font-medium transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Replies Section */}
                {(post.replies.length > 0 || post.isAITyping) && (
                  <div className="p-4 md:p-6 bg-slate-50/50 flex flex-col gap-4">
                    {post.replies.map(reply => (
                      <div key={reply.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm text-white font-bold text-sm ${
                          reply.authorType === 'ai' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-slate-400'
                        }`}>
                          {reply.authorType === 'ai' ? <Sparkles className="w-4 h-4" /> : reply.authorName.charAt(0)}
                        </div>
                        
                        <div className={`flex-1 rounded-2xl p-4 ${
                          reply.authorType === 'ai' 
                          ? 'bg-indigo-50 border border-indigo-100/50 rounded-tl-none shadow-sm' 
                          : 'bg-white border border-slate-200 rounded-tl-none shadow-sm'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold text-sm ${reply.authorType === 'ai' ? 'text-indigo-900' : 'text-slate-900'}`}>
                                {reply.authorName}
                              </span>
                              {reply.authorType === 'ai' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400 font-medium">{reply.timestamp}</span>
                            </div>
                          </div>
                          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${reply.authorType === 'ai' ? 'text-indigo-800' : 'text-slate-700'}`}>
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* AI Typing Indicator */}
                    {post.isAITyping && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm text-white bg-gradient-to-br from-indigo-500 to-purple-600">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="bg-indigo-50 border border-indigo-100/50 rounded-2xl rounded-tl-none shadow-sm p-4 w-32 flex items-center gap-1">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
