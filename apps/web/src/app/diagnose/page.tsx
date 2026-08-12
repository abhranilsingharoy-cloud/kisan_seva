'use client';

import React, { useState, useRef } from 'react';
import {
  ArrowLeft, Upload, Camera, Leaf, AlertTriangle, Clock,
  Info, ChevronDown, ChevronUp, RotateCcw, Share2, Loader2,
  Home, Activity, TrendingUp, Calendar, Bell
} from 'lucide-react';
import Link from 'next/link';

type Status = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

export default function DiagnosePage() {
  const [status, setStatus] = useState<Status>('idle');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      startDiagnosis();
    };
    reader.readAsDataURL(file);
  };

  const startDiagnosis = () => {
    setStatus('uploading');
    setTimeout(() => {
      setStatus('processing');
      setTimeout(() => {
        setStatus('done');
      }, 2300);
    }, 1200);
  };

  const resetDiagnosis = () => {
    setStatus('idle');
    setImagePreview(null);
    setShowAlternatives(false);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Activity, label: 'Diagnose', href: '/diagnose', active: true },
    { icon: TrendingUp, label: 'Market', href: '/market' },
    { icon: Calendar, label: 'Schedule', href: '/schedule' },
    { icon: Bell, label: 'Alerts', href: '/alerts' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-parchment)', paddingBottom: '80px' }}>
      {/* Sticky Top Nav */}
      <header className="top-nav" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'var(--color-parchment)', borderBottom: '1px solid var(--color-bone)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" className="btn-icon" style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bone)' }} aria-label="Go back">
            <ArrowLeft size={24} color="var(--color-ink)" />
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontWeight: 600 }}>Crop Disease Detection</h1>
            <p style={{ margin: 0, fontSize: '0.875rem', fontFamily: 'var(--font-sans)', color: 'var(--color-sage)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Powered by AI · Results in &lt;5 seconds
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="page-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          {/* LEFT: Image Upload / Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div 
              onDragOver={onDragOver}
              onDrop={onDrop}
              style={{ 
                border: '2px dashed var(--color-bone)',
                borderRadius: 'var(--radius-md)',
                padding: '32px',
                textAlign: 'center',
                backgroundColor: 'var(--color-parchment)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '350px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: status === 'idle' ? 'pointer' : 'default',
                transition: 'border-color 0.2s ease-in-out'
              }}
              onClick={() => status === 'idle' && fileInputRef.current?.click()}
            >
              {status === 'idle' && !imagePreview && (
                <>
                  <Upload size={48} color="var(--color-sage)" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '1.25rem', marginBottom: '8px' }}>Drag & Drop Leaf Image</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-bark)', fontSize: '0.875rem', marginBottom: '24px' }}>or click to browse from your device</p>
                  
                  <button 
                    className="btn btn-primary"
                    style={{ backgroundColor: 'var(--color-honey-amber)', color: 'var(--color-ink)', padding: '12px 24px', borderRadius: 'var(--radius-sm)', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                  >
                    <Camera size={20} /> Take Photo
                  </button>
                </>
              )}
              
              {imagePreview && (
                <img src={imagePreview} alt="Crop Leaf" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: status === 'idle' || status === 'done' ? 1 : 0.4 }} />
              )}
              
              {(status === 'uploading' || status === 'processing') && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(252, 250, 241, 0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 className="animate-spin" size={48} color="var(--color-sage)" />
                  <p style={{ marginTop: '16px', fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontWeight: 600, fontSize: '1.125rem' }}>
                    {status === 'uploading' ? 'Uploading Image...' : 'Analyzing with AI...'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Hidden file inputs */}
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} aria-label="Upload leaf image" id="file-upload" />
            <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} style={{ display: 'none' }} aria-label="Take photo of leaf" id="camera-upload" />

            {status === 'done' && (
              <button 
                className="btn btn-ghost animate-fade-in"
                style={{ padding: '12px', border: '1px solid var(--color-bone)', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', color: 'var(--color-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer', width: '100%' }}
                onClick={resetDiagnosis}
              >
                <RotateCcw size={20} /> New Diagnosis
              </button>
            )}

            <div className="alert alert-info" style={{ backgroundColor: '#e0f2fe', borderLeft: '4px solid #0284c7', padding: '16px', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '12px', marginTop: '8px' }}>
              <Info size={24} color="#0284c7" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: 0, color: '#0c4a6e', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'var(--font-sans)' }}>Tip for best results</h4>
                <p style={{ margin: 0, marginTop: '4px', color: '#0c4a6e', fontSize: '0.875rem', fontFamily: 'var(--font-sans)', lineHeight: 1.5 }}>
                  Ensure the leaf is in focus, well-lit, and fills most of the frame. Include both healthy and affected areas if possible.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Results Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {status === 'idle' && (
              <div className="card" style={{ backgroundColor: 'var(--color-bone)', borderRadius: 'var(--radius-md)', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '350px' }}>
                <div style={{ backgroundColor: 'var(--color-parchment)', padding: '24px', borderRadius: '50%', marginBottom: '24px' }}>
                  <Leaf size={48} color="var(--color-sage)" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '1.5rem', marginBottom: '12px' }}>Ready to Diagnose</h2>
                <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-saddle)', maxWidth: '300px', lineHeight: 1.5 }}>
                  Upload or snap a photo of a crop leaf to instantly identify diseases and get actionable treatment plans.
                </p>
              </div>
            )}

            {(status === 'uploading' || status === 'processing') && (
              <div className="card" style={{ backgroundColor: 'var(--color-bone)', borderRadius: 'var(--radius-md)', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '350px' }}>
                <div className="animate-pulse-ring" style={{ backgroundColor: 'var(--color-sage)', padding: '24px', borderRadius: '50%', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={48} color="var(--color-parchment)" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '1.5rem', marginBottom: '12px' }}>Analyzing...</h2>
                <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-saddle)', maxWidth: '300px', lineHeight: 1.5 }}>
                  Our AI is scanning your leaf against a database of over 400 potential issues.
                </p>
              </div>
            )}

            {status === 'done' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card" style={{ backgroundColor: 'var(--color-parchment)', border: '1px solid var(--color-bone)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  
                  {/* Title & Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <span className="eyebrow eyebrow-amber" style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analysis Complete</span>
                      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '1.75rem', margin: '4px 0 12px 0' }}>Early Blight (Alternaria Solani)</h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <span className="badge badge-neutral" style={{ backgroundColor: 'var(--color-bone)', color: 'var(--color-ink)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500 }}>Crop: Tomato</span>
                        <span className="badge badge-success" style={{ backgroundColor: '#dcfce7', color: 'var(--color-success)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500 }}>Confidence: 91%</span>
                        <span className="badge badge-warning" style={{ backgroundColor: '#fef3c7', color: 'var(--color-warning)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500 }}>Severity: Moderate</span>
                      </div>
                    </div>
                    <AlertTriangle size={32} color="var(--color-warning)" style={{ flexShrink: 0 }} />
                  </div>
                  
                  {/* Description */}
                  <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-saddle)', lineHeight: 1.6, fontSize: '0.9375rem', marginBottom: '24px' }}>
                    Early blight is a fungal disease that causes characteristic "bullseye" spots on lower leaves. Left untreated, it can spread to the fruit and cause significant yield loss. Immediate intervention is recommended.
                  </p>

                  {/* Treatment Steps */}
                  <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '1.25rem', marginBottom: '16px' }}>Recommended Treatment</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      'Prune and safely dispose of all infected lower leaves immediately.',
                      'Apply a copper-based fungicide or chlorothalonil to prevent further spread.',
                      'Ensure proper spacing between plants to improve air circulation.',
                      'Water at the base of plants avoiding wet foliage, preferably in the morning.'
                    ].map((step, idx) => (
                      <div key={idx} className="rec-card" style={{ display: 'flex', gap: '16px', padding: '16px', backgroundColor: 'var(--color-bone)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-parchment)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: '0.875rem' }}>
                          {idx + 1}
                        </div>
                        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', color: 'var(--color-ink)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Section */}
                  <div style={{ marginTop: '24px', borderTop: '1px solid var(--color-bone)', paddingTop: '16px' }}>
                    <button 
                      onClick={() => setShowAlternatives(!showAlternatives)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer', fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '1.125rem', fontWeight: 600 }}
                      aria-expanded={showAlternatives}
                    >
                      Prevention & Organic Alternatives
                      {showAlternatives ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    
                    {showAlternatives && (
                      <div className="animate-fade-in" style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-sm)', marginTop: '12px', borderLeft: '4px solid var(--color-success)' }}>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-saddle)', fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                          <li style={{ marginBottom: '8px' }}>Use neem oil extract as a natural preventative spray.</li>
                          <li style={{ marginBottom: '8px' }}>Practice 3-year crop rotation with non-solanaceous crops.</li>
                          <li>Apply organic compost mulch to prevent soil spores from splashing onto leaves.</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Feedback and Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--color-bone)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', color: 'var(--color-saddle)', fontSize: '0.875rem', marginBottom: '8px' }}>Was this diagnosis helpful?</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-ghost" style={{ padding: '6px 16px', border: '1px solid var(--color-bone)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-parchment)', color: 'var(--color-ink)', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>Yes</button>
                          <button className="btn btn-ghost" style={{ padding: '6px 16px', border: '1px solid var(--color-bone)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-parchment)', color: 'var(--color-ink)', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>No</button>
                        </div>
                      </div>
                      
                      <button className="btn btn-sage" style={{ padding: '10px 20px', backgroundColor: 'var(--color-sage)', color: 'var(--color-parchment)', border: 'none', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer' }}>
                        <Share2 size={18} /> Share Report
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav for Mobile */}
      <nav className="bottom-nav lg:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--color-parchment)', borderTop: '1px solid var(--color-bone)', display: 'flex', justifyContent: 'space-around', padding: '12px 16px', zIndex: 50 }}>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link 
              href={item.href} 
              key={idx} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: item.active ? 'var(--color-sage)' : 'var(--color-bark)', minWidth: '44px' }}
            >
              <Icon size={24} />
              <span style={{ fontSize: '0.7rem', fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
