'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Heart,
  Share2,
  ListMusic,
  Radio,
  Clock
} from 'lucide-react';

const PAGE_BG = { background: '#f4f4f5', minHeight: '100vh', paddingBottom: 100 };

const PLAYLIST = [
  {
    id: '1',
    title: 'Daily Mandi Price Updates',
    artist: 'Krishi News Network',
    duration: 184, // seconds
    imageUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=600&auto=format&fit=crop', // market
    category: 'News'
  },
  {
    id: '2',
    title: 'Weather Forecast: Kharif Season',
    artist: 'Met Department India',
    duration: 312,
    imageUrl: 'https://images.unsplash.com/photo-1561553543-e4c7b608b98d?q=80&w=600&auto=format&fit=crop', // weather/clouds
    category: 'Weather'
  },
  {
    id: '3',
    title: 'Expert Interview: Pest Management in Cotton',
    artist: 'Dr. R.K. Sharma',
    duration: 540,
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f296d1130d2?q=80&w=600&auto=format&fit=crop', // cotton
    category: 'Interview'
  },
  {
    id: '4',
    title: 'Govt Subsidy: PM-Kisan Yojana Explained',
    artist: 'Policy Insights',
    duration: 425,
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop', // finance
    category: 'Schemes'
  }
];

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function KrishiRadioScreen() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // in seconds
  const [isLiked, setIsLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const track = PLAYLIST[currentTrackIndex];

  // Simulated playback logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= track.duration) {
            handleNext();
            return 0;
          }
          return p + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, track.duration, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setProgress(0);
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  return (
    <div style={PAGE_BG}>
      
      {/* Header */}
      <div style={{ padding: '32px 28px 10px', maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2d6a27', marginBottom: 4 }}>
            <Radio size={24} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live On-Air</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.04em' }}>
            Krishi Radio
          </h1>
        </div>
        
        <button 
          onClick={() => setShowQueue(!showQueue)}
          style={{ background: '#fff', border: '1px solid #d1d5db', padding: '10px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#374151', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
        >
          <ListMusic size={20} /> Queue
        </button>
      </div>

      <div style={{ maxWidth: 1000, margin: '20px auto 0', padding: '0 24px', display: 'grid', gridTemplateColumns: showQueue ? '1.5fr 1fr' : '1fr', gap: 40, transition: 'all 0.3s ease' }}>
        
        {/* Main Player Area */}
        <div style={{ background: '#fff', borderRadius: 32, padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Album Art (Vinyl Style / Modern Square) */}
          <div style={{ 
            width: '100%', 
            maxWidth: 400, 
            aspectRatio: '1/1', 
            borderRadius: 24, 
            overflow: 'hidden', 
            boxShadow: isPlaying ? '0 30px 60px -15px rgba(45,106,39,0.4)' : '0 10px 30px -10px rgba(0,0,0,0.2)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isPlaying ? 'scale(1.02)' : 'scale(1)',
            position: 'relative'
          }}>
            <img 
              src={track.imageUrl} 
              alt={track.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            {/* Overlay Gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: 20, color: '#fff', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {track.category}
            </div>
          </div>

          {/* Track Info */}
          <div style={{ width: '100%', maxWidth: 400, marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 6px', lineHeight: 1.2 }}>{track.title}</h2>
              <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0, fontWeight: 500 }}>{track.artist}</p>
            </div>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              style={{ background: 'none', border: 'none', color: isLiked ? '#ef4444' : '#9ca3af', cursor: 'pointer', transition: 'all 0.2s', padding: 8 }}
            >
              <Heart size={28} fill={isLiked ? '#ef4444' : 'none'} />
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', maxWidth: 400, marginTop: 30 }}>
            <input 
              type="range" 
              min="0" 
              max={track.duration} 
              value={progress} 
              onChange={handleSeek}
              style={{ 
                width: '100%', 
                accentColor: '#2d6a27', 
                height: 6, 
                borderRadius: 4, 
                appearance: 'none', 
                background: '#e5e7eb',
                cursor: 'pointer'
              }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: '0.8125rem', color: '#6b7280', fontWeight: 600 }}>
              <span>{formatTime(progress)}</span>
              <span>{formatTime(track.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginTop: 20 }}>
            <button onClick={handlePrev} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: 10 }}><SkipBack size={32} fill="currentColor" /></button>
            <button 
              onClick={handlePlayPause}
              style={{ 
                width: 80, height: 80, borderRadius: '50%', background: '#2d6a27', color: '#fff', border: 'none', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isPlaying ? '0 10px 25px -5px rgba(45,106,39,0.5)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" style={{ marginLeft: 6 }} />}
            </button>
            <button onClick={handleNext} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: 10 }}><SkipForward size={32} fill="currentColor" /></button>
          </div>

          {/* Footer Controls (Volume, Share) */}
          <div style={{ width: '100%', maxWidth: 400, marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px', color: '#9ca3af' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Volume2 size={20} />
              <input type="range" min="0" max="100" defaultValue="70" style={{ width: 80, accentColor: '#9ca3af', height: 4 }} />
            </div>
            <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><Share2 size={20} /></button>
          </div>
        </div>

        {/* Up Next / Queue (Conditional) */}
        {showQueue && (
          <div style={{ background: '#fff', borderRadius: 32, padding: '30px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 24px' }}>Up Next</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {PLAYLIST.map((t, idx) => (
                <div 
                  key={t.id} 
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 16, padding: '12px', borderRadius: 16, cursor: 'pointer',
                    background: currentTrackIndex === idx ? '#f0fdf4' : 'transparent',
                    border: `1px solid ${currentTrackIndex === idx ? '#bbf7d0' : 'transparent'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <img src={t.imageUrl} alt="" style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: currentTrackIndex === idx ? '#166534' : '#111827', marginBottom: 4 }}>{t.title}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{t.artist}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ca3af', fontSize: '0.8125rem', fontWeight: 600 }}>
                    <Clock size={14} /> {formatTime(t.duration)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
