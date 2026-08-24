import re

with open('apps/web/src/components/features/diagnose/ScanHeroCard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_jsx = '''          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <button onClick={() => fileRef.current?.click()} style={{ background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 40px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(45,106,39,0.35)' }}>
            Start Scan
          </button>'''

new_jsx = '''          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <input id="camera-input" type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => fileRef.current?.click()} style={{ background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 24px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(45,106,39,0.35)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload
            </button>
            <button onClick={() => document.getElementById('camera-input')?.click()} style={{ background: '#fff', color: '#2d6a27', border: '2px solid #2d6a27', borderRadius: 10, padding: '11px 24px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(45,106,39,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              Camera
            </button>
          </div>'''

if old_jsx in content:
    content = content.replace(old_jsx, new_jsx)
    with open('apps/web/src/components/features/diagnose/ScanHeroCard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced properly")
else:
    print("Not found precisely.")
