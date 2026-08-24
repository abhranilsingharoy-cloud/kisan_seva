import re

with open('apps/web/src/app/(app)/soil-health/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_jsx = '''                    <button style={{ backgroundColor: '#65a30d', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 32px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileImage size={18} /> Choose Image
                    </button>
                  </div>'''

new_jsx = '''                    <input id="camera-input" type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} style={{ backgroundColor: '#65a30d', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileImage size={18} /> Upload Image
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); document.getElementById('camera-input')?.click(); }} style={{ backgroundColor: '#fff', color: '#65a30d', border: '2px solid #65a30d', borderRadius: '8px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> Take Photo
                      </button>
                    </div>
                  </div>'''

if old_jsx in content:
    content = content.replace(old_jsx, new_jsx)
    with open('apps/web/src/app/(app)/soil-health/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced properly")
else:
    print("Not found precisely.")
