'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  Wifi,
  WifiOff,
  ExternalLink,
  RefreshCw,
  Signal,
} from 'lucide-react';

// ── Real live radio streams (Indian agri / public radio) ──────────────────────
const STATIONS = [
  {
    id: 'air-fm-gold',
    name: 'AIR FM Gold',
    tagline: 'All India Radio – News & Agriculture',
    frequency: '100.1 FM',
    language: 'Hindi / English',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/chunklist.m3u8',
    fallbackUrl: 'https://airfmgold.liveindianradio.com/;',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop',
    color: '#1e5631',
    badgeColor: '#16a34a',
    category: 'News & Agriculture',
    isLive: true,
  },
  {
    id: 'air-krishi',
    name: 'AIR Krishi Channel',
    tagline: 'Dedicated Farm Advisory – Doordarshan Kisan',
    frequency: 'Online',
    language: 'Hindi',
    streamUrl: 'https://stream.ddkisan.com/ddkisan/index.m3u8',
    fallbackUrl: 'https://stream.ddkisan.com/ddkisan/index.m3u8',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600&auto=format&fit=crop',
    color: '#365314',
    badgeColor: '#65a30d',
    category: 'Farm Advisory',
    isLive: true,
  },
  {
    id: 'air-national',
    name: 'AIR National Channel',
    tagline: 'All India Radio – National Programmes',
    frequency: 'National',
    language: 'Hindi / English',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio049/chunklist.m3u8',
    fallbackUrl: 'https://www.radioparadise.com/aac-128.m3u8',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=600&auto=format&fit=crop',
    color: '#7c2d12',
    badgeColor: '#ea580c',
    category: 'National',
    isLive: true,
  },
  {
    id: 'mann-ki-baat',
    name: 'Radio Udaan',
    tagline: 'Farm & Rural Development Stories',
    frequency: 'Online',
    language: 'Hindi',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio016/chunklist.m3u8',
    fallbackUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio016/chunklist.m3u8',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop',
    color: '#1e3a5f',
    badgeColor: '#2563eb',
    category: 'Rural Development',
    isLive: true,
  },
  {
    id: 'punjab-radio',
    name: 'AIR Amritsar',
    tagline: 'Punjab Agricultural Updates & Mandi Rates',
    frequency: 'Amritsar FM',
    language: 'Punjabi / Hindi',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio012/chunklist.m3u8',
    fallbackUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio012/chunklist.m3u8',
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=600&auto=format&fit=crop',
    color: '#5b21b6',
    badgeColor: '#7c3aed',
    category: 'Regional',
    isLive: true,
  },
  {
    id: 'mp-radio',
    name: 'AIR Bhopal',
    tagline: 'MP Farm Advisory & Soybean Mandi Prices',
    frequency: 'Bhopal FM',
    language: 'Hindi',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio019/chunklist.m3u8',
    fallbackUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio019/chunklist.m3u8',
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=600&auto=format&fit=crop',
    color: '#9f1239',
    badgeColor: '#e11d48',
    category: 'Regional',
    isLive: true,
  },
];

type StationStatus = 'idle' | 'loading' | 'playing' | 'error';

export default function KrishiRadioPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, StationStatus>>({});
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const setStatus = (id: string, status: StationStatus) => {
    setStatusMap(prev => ({ ...prev, [id]: status }));
  };

  const playStation = (station: typeof STATIONS[0]) => {
    // Stop any currently playing station
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    // If clicking the same station, toggle off
    if (activeId === station.id) {
      setActiveId(null);
      return;
    }

    setActiveId(station.id);
    setStatus(station.id, 'loading');

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.volume = muted ? 0 : volume / 100;
    audio.preload = 'none';

    audio.oncanplay = () => {
      setStatus(station.id, 'playing');
      audio.play().catch(() => setStatus(station.id, 'error'));
    };

    audio.onerror = () => {
      // Try fallback URL
      if (audio.src !== station.fallbackUrl) {
        audio.src = station.fallbackUrl;
        audio.load();
      } else {
        setStatus(station.id, 'error');
        setActiveId(null);
      }
    };

    audio.src = station.streamUrl;
    audio.load();
    audioRef.current = audio;
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val / 100;
    if (val > 0) setMuted(false);
  };

  const toggleMute = () => {
    setMuted(m => {
      if (audioRef.current) audioRef.current.volume = m ? volume / 100 : 0;
      return !m;
    });
  };

  const retryStation = (station: typeof STATIONS[0]) => {
    setStatus(station.id, 'idle');
    setTimeout(() => playStation(station), 100);
  };

  const activeStation = STATIONS.find(s => s.id === activeId);

  return (
    <div style={{ background: '#f0f4f0', minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '32px 24px 10px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#2d6a27', marginBottom: 6 }}>
          <Radio size={22} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Streaming</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.03em' }}>
          Krishi Radio
        </h1>
        <p style={{ color: '#6b7280', marginTop: 6, fontSize: '0.95rem' }}>
          Live Indian agricultural radio — tap any station to play instantly
        </p>
      </div>

      {/* Now Playing Bar (sticky at top when playing) */}
      {activeStation && (
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: activeStation.color,
          color: '#fff',
          padding: '14px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
            <img src={activeStation.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeStation.name}
            </div>
            <div style={{ fontSize: '0.78rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: 6 }}>
              {statusMap[activeStation.id] === 'loading' ? (
                <><RefreshCw size={12} className="animate-spin" /> Connecting…</>
              ) : statusMap[activeStation.id] === 'playing' ? (
                <><Signal size={12} /> LIVE — {activeStation.language}</>
              ) : (
                <><WifiOff size={12} /> Connection failed</>
              )}
            </div>
          </div>
          {/* Volume */}
          <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.9 }}>
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range" min={0} max={100} value={muted ? 0 : volume}
            onChange={e => handleVolumeChange(Number(e.target.value))}
            style={{ width: 80, accentColor: '#fff', cursor: 'pointer' }}
          />
          {/* Stop */}
          <button
            onClick={() => playStation(activeStation)}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
              width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer', flexShrink: 0
            }}
          >
            <Pause size={20} fill="currentColor" />
          </button>
        </div>
      )}

      {/* Station Grid */}
      <div style={{ maxWidth: 1000, margin: '24px auto 0', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {STATIONS.map(station => {
          const status = statusMap[station.id] ?? 'idle';
          const isActive = activeId === station.id;

          return (
            <div
              key={station.id}
              style={{
                background: '#fff',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: isActive
                  ? `0 8px 32px -8px ${station.color}80`
                  : '0 2px 12px rgba(0,0,0,0.06)',
                border: isActive ? `2px solid ${station.badgeColor}` : '2px solid transparent',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                cursor: 'pointer',
              }}
              onClick={() => status !== 'loading' && playStation(station)}
            >
              {/* Station Image */}
              <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                <img
                  src={station.imageUrl}
                  alt={station.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: isActive ? 'scale(1.05)' : 'scale(1)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${station.color}cc 0%, transparent 50%)` }} />

                {/* LIVE badge */}
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: isActive && status === 'playing' ? '#ef4444' : 'rgba(0,0,0,0.5)',
                  color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '3px 10px', borderRadius: 20,
                  display: 'flex', alignItems: 'center', gap: 4,
                  transition: 'background 0.3s'
                }}>
                  {isActive && status === 'playing' && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                  )}
                  {isActive && status === 'playing' ? 'ON AIR' : 'LIVE'}
                </div>

                {/* Category badge */}
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  background: station.badgeColor, color: '#fff',
                  fontSize: '0.65rem', fontWeight: 700,
                  padding: '3px 10px', borderRadius: 20
                }}>
                  {station.category}
                </div>

                {/* Play button overlay */}
                <div style={{
                  position: 'absolute', bottom: 12, right: 12,
                  width: 44, height: 44, borderRadius: '50%',
                  background: isActive ? station.badgeColor : 'rgba(255,255,255,0.9)',
                  color: isActive ? '#fff' : station.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s'
                }}>
                  {status === 'loading' && isActive ? (
                    <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : isActive && status === 'playing' ? (
                    <Pause size={20} fill="currentColor" />
                  ) : status === 'error' && isActive ? (
                    <WifiOff size={18} />
                  ) : (
                    <Play size={20} fill="currentColor" style={{ marginLeft: 3 }} />
                  )}
                </div>
              </div>

              {/* Station Info */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
                      {station.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>
                      {station.tagline}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Wifi size={12} /> {station.frequency}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af' }}>
                    🌐 {station.language}
                  </span>
                </div>

                {/* Error state with retry */}
                {status === 'error' && isActive && (
                  <button
                    onClick={(e) => { e.stopPropagation(); retryStation(station); }}
                    style={{
                      marginTop: 12, width: '100%', padding: '8px 0',
                      background: '#fef2f2', border: '1px solid #fecaca',
                      borderRadius: 10, color: '#dc2626', fontWeight: 700,
                      fontSize: '0.8rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <RefreshCw size={14} /> Stream unavailable — Tap to retry
                  </button>
                )}

                {/* Status indicator when playing */}
                {isActive && status === 'playing' && (
                  <div style={{
                    marginTop: 12, padding: '8px 12px',
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
                      {[6, 10, 8, 12, 7].map((h, i) => (
                        <div key={i} style={{
                          width: 3, height: h, borderRadius: 2,
                          background: station.badgeColor,
                          animation: `bar${i % 3} 0.8s ease-in-out infinite alternate`,
                          animationDelay: `${i * 0.1}s`
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#166534' }}>
                      Streaming Live
                    </span>
                    <a
                      href={station.streamUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ marginLeft: 'auto', color: '#9ca3af', display: 'flex' }}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Footer */}
      <div style={{ maxWidth: 1000, margin: '32px auto 0', padding: '0 24px 24px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, color: '#6b7280', fontSize: '0.82rem' }}>
          <Radio size={16} style={{ color: '#2d6a27', flexShrink: 0 }} />
          <span>
            All streams are from <strong>All India Radio (AIR)</strong> public broadcast infrastructure. If a stream fails, check your internet connection or try another station.
          </span>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes bar0 { from { height: 4px; } to { height: 14px; } }
        @keyframes bar1 { from { height: 8px; } to { height: 4px; } }
        @keyframes bar2 { from { height: 4px; } to { height: 12px; } }
      `}</style>
    </div>
  );
}
