'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Microscope, 
  Camera, 
  Leaf, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Loader2, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  ShoppingCart, 
  Cpu, 
  Upload,
  Home,
  CloudLightning,
  Map as MapIcon,
  ShoppingBag,
  Users
} from 'lucide-react';

export default function DiagnosePage() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      processImage();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      processImage();
    }
  };

  const processImage = () => {
    setStatus('uploading');
    setTimeout(() => {
      setStatus('processing');
      setTimeout(() => {
        setStatus('done');
      }, 2300);
    }, 1200);
  };

  const resetForm = () => {
    setStatus('idle');
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="layout-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside className="ks-sidebar">
        <div className="brand" style={{ padding: '24px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-act)' }}>
          KisanSeva
        </div>
        <nav className="nav-menu">
          <Link href="/dashboard" className="nav-item">
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/weather" className="nav-item">
            <CloudLightning size={20} />
            <span>Weather & Soil</span>
          </Link>
          <Link href="/diagnose" className="nav-item active">
            <Leaf size={20} />
            <span>Crop Health</span>
          </Link>
          <Link href="/market" className="nav-item">
            <ShoppingBag size={20} />
            <span>Marketplace</span>
          </Link>
          <Link href="/community" className="nav-item">
            <Users size={20} />
            <span>Community</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ks-main" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto', backgroundColor: 'var(--color-bg)' }}>
        {/* Page Header */}
        <header className="page-header" style={{ backgroundColor: '#fff', borderBottom: '1px solid var(--color-border)', padding: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 8px 0' }}>
            Crop Health Diagnosis
          </h1>
          <p style={{ margin: 0, color: 'var(--color-ink-soft)', fontSize: '0.95rem' }}>
            Upload a photo of your crop to identify diseases and get treatment recommendations.
          </p>
        </header>

        {/* Content Area */}
        <div className="content-area" style={{ padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          
          {/* Left Panel */}
          <div className="left-panel" style={{ flex: '1', minWidth: '300px', maxWidth: '480px' }}>
            {status === 'idle' && (
              <div 
                className="upload-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                style={{
                  border: '2px dashed var(--color-border)',
                  borderRadius: '16px',
                  padding: '40px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Microscope size={48} style={{ color: 'var(--color-primary-act)', marginBottom: '16px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Drag & drop a leaf photo</h3>
                <p style={{ margin: '0 0 24px 0', color: 'var(--color-ink-soft)', fontSize: '0.9rem' }}>
                  or tap to browse your gallery
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                
                <button 
                  className="btn btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Camera size={18} />
                  Take Photo
                </button>

                <div className="tip-box" style={{
                  backgroundColor: 'rgba(50,107,0,0.08)',
                  borderLeft: '3px solid var(--color-primary-act)',
                  padding: '10px 14px',
                  borderRadius: '0 8px 8px 0',
                  textAlign: 'left',
                  width: '100%',
                  fontSize: '0.85rem',
                  color: 'var(--color-ink)'
                }}>
                  <strong>Tip:</strong> Good lighting gives 40% better accuracy
                </div>
              </div>
            )}

            {status === 'uploading' && (
              <div 
                className="upload-zone uploading"
                style={{
                  border: '2px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '40px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: '#fff'
                }}
              >
                <Loader2 size={48} className="animate-spin" style={{ color: 'var(--color-primary-act)', marginBottom: '16px' }} />
                <h3 style={{ margin: '0 0 24px 0', fontSize: '1.1rem' }}>Uploading photo...</h3>
                <div className="progress" style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-low)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div className="progress-fill" style={{ width: '60%', height: '100%', backgroundColor: 'var(--color-primary-act)', transition: 'width 0.3s ease' }}></div>
                </div>
              </div>
            )}

            {status === 'processing' && (
              <div 
                className="dark-panel"
                style={{
                  borderRadius: '16px',
                  padding: '40px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  border: '1px solid #333',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Green ring animation placeholder */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '2px solid rgba(50, 205, 50, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  animation: 'pulse 1.5s infinite'
                }}>
                  <Cpu size={40} style={{ color: '#32cd32' }} />
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#fff' }}>
                  AI Analysing
                  <span className="animated-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                </h3>
                <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem' }}>
                  Running MobileNetV3 disease classifier
                </p>
                <style>{`
                  @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(50, 205, 50, 0.4); }
                    70% { box-shadow: 0 0 0 20px rgba(50, 205, 50, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(50, 205, 50, 0); }
                  }
                  @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
                  .animated-dots span { animation-name: blink; animation-duration: 1.4s; animation-iteration-count: infinite; animation-fill-mode: both; }
                  .animated-dots span:nth-child(2) { animation-delay: 0.2s; }
                  .animated-dots span:nth-child(3) { animation-delay: 0.4s; }
                `}</style>
              </div>
            )}

            {status === 'done' && imagePreview && (
              <div className="preview-container" style={{ position: 'relative' }}>
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <img 
                    src={imagePreview} 
                    alt="Crop upload" 
                    style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', display: 'block' }} 
                  />
                  {/* Bounding box overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '30%',
                    width: '40%',
                    height: '50%',
                    border: '2px solid var(--color-amber)',
                    borderRadius: '4px',
                    pointerEvents: 'none'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '-2px',
                      backgroundColor: 'var(--color-amber)',
                      color: '#000',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '2px',
                      fontFamily: 'monospace'
                    }}>
                      DETECTED
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)', fontFamily: 'monospace' }}>
                    {file?.name || 'rice_leaf_scan_001.jpg'}
                  </div>
                  <button 
                    onClick={resetForm}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--color-ink-soft)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}
                    className="hover-bg-surface-low"
                  >
                    <RotateCcw size={14} />
                    Retake
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="right-panel" style={{ flex: '1', minWidth: '320px' }}>
            {(status === 'idle' || status === 'uploading' || status === 'processing') ? (
              <div 
                className="empty-state-card"
                style={{
                  height: '100%',
                  minHeight: '400px',
                  border: '1px dashed var(--color-border)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--color-surface-low)',
                  color: 'var(--color-ink-soft)'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(50,107,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Leaf size={32} style={{ color: 'var(--color-primary-act)' }} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-ink)' }}>
                  {status === 'processing' ? 'Analysing...' : 'Ready to Diagnose'}
                </h3>
              </div>
            ) : (
              <div 
                className="card results-card"
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  borderLeft: '4px solid var(--color-amber)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '24px' }}>
                  {/* Alert Row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                    <AlertTriangle size={24} style={{ color: 'var(--color-amber)', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <h2 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                        Early Stage Rice Blast Detected
                      </h2>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="badge badge-warning" style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                          92% Confidence
                        </span>
                        <span className="badge badge-neutral" style={{ backgroundColor: 'var(--color-surface-low)', color: 'var(--color-ink)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                          Crop: Rice
                        </span>
                        <span className="badge badge-warning" style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                          Severity: Moderate
                        </span>
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: '0 0 20px 0', color: 'var(--color-ink)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    The uploaded image shows characteristic diamond-shaped lesions indicative of Magnaporthe oryzae infection. Immediate action recommended.
                  </p>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '20px 0' }} />

                  {/* Action Plan */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink-soft)', letterSpacing: '0.05em', marginBottom: '12px', fontFamily: 'monospace' }}>
                      RECOMMENDED ACTION PLAN
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { title: 'Apply Fungicide X', desc: 'Spray affected areas immediately during early morning or late afternoon.' },
                        { title: 'Reduce Standing Water', desc: 'Lower water levels in the paddy to decrease humidity around the plants.' },
                        { title: 'Notify Neighbor Farmers', desc: 'Spores travel by wind; alerting nearby farms helps prevent regional outbreak.' }
                      ].map((step, idx) => (
                        <div key={idx} style={{ 
                          backgroundColor: 'var(--color-surface-low)', 
                          border: '1px solid var(--color-border)', 
                          borderRadius: '8px', 
                          padding: '14px 16px',
                          display: 'flex',
                          gap: '12px'
                        }}>
                          <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--color-primary-act)', 
                            color: '#fff', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '0.8rem', 
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {idx + 1}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-ink)', marginBottom: '4px' }}>
                              {step.title}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)', lineHeight: '1.4' }}>
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '20px 0' }} />

                  {/* Expandable Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <button 
                      onClick={() => setExpanded(!expanded)}
                      style={{ 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        background: 'none', 
                        border: 'none', 
                        padding: '8px 0', 
                        cursor: 'pointer',
                        color: 'var(--color-ink)',
                        fontWeight: 600,
                        fontSize: '0.95rem'
                      }}
                    >
                      Prevention & Organic Alternatives
                      {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expanded && (
                      <div style={{ padding: '12px 0', fontSize: '0.9rem', color: 'var(--color-ink-soft)', lineHeight: '1.5' }}>
                        Spray neem oil extract (5ml/L) weekly as organic preventive. Ensure proper row spacing for airflow.
                      </div>
                    )}
                  </div>

                  {/* Feedback */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface-low)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)', fontWeight: 500 }}>Was this helpful?</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer' }}>Yes</button>
                      <button style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer' }}>No</button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'var(--color-primary)', color: '#fff', fontWeight: 600 }}>
                      <ShoppingCart size={18} />
                      Buy Recommended Supplies
                    </button>
                    <button className="btn btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--color-ink)', fontWeight: 600 }}>
                      <Share2 size={18} />
                      Share with Community
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="ks-bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'none', backgroundColor: '#fff', borderTop: '1px solid var(--color-border)' }}>
        <Link href="/dashboard" className="nav-item">
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link href="/diagnose" className="nav-item active">
          <Leaf size={24} />
          <span>Crops</span>
        </Link>
        <Link href="/market" className="nav-item">
          <ShoppingBag size={24} />
          <span>Market</span>
        </Link>
        <Link href="/community" className="nav-item">
          <Users size={24} />
          <span>Forum</span>
        </Link>
      </nav>
      
      <style>{`
        @media (max-width: 768px) {
          .ks-sidebar { display: none !important; }
          .ks-bottom-nav { display: flex !important; justify-content: space-around; padding: 12px 0; }
          .ks-main { padding-bottom: 70px; }
        }
        .ks-sidebar { width: 250px; border-right: 1px solid var(--color-border); background-color: #fff; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: var(--color-ink-soft); text-decoration: none; font-weight: 500; }
        .nav-item:hover { background-color: var(--color-surface-low); }
        .nav-item.active { background-color: rgba(50,107,0,0.08); color: var(--color-primary-act); border-right: 3px solid var(--color-primary-act); }
        .btn { transition: all 0.2s ease; }
        .btn:hover { opacity: 0.9; }
        .hover-bg-surface-low:hover { background-color: var(--color-surface-low) !important; }
      `}</style>
    </div>
  );
}
