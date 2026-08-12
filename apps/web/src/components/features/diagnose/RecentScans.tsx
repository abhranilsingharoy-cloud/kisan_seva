const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  Healthy: { bg: '#dcfce7', color: '#16a34a' },
  'Action Required: Early Blight': { bg: '#fff7ed', color: '#ea580c' },
  'Monitoring: Thrips': { bg: '#fffbeb', color: '#d97706' },
}

export default function RecentScans() {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Recent Scans</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { crop: 'Wheat - Plot A', date: 'Oct 26, 2024', badge: 'Healthy', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&q=80' },
          { crop: 'Tomato - Field 2', date: 'Oct 24, 2024', badge: 'Action Required: Early Blight', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80' },
          { crop: 'Cotton - Plot C', date: 'Oct 22, 2024', badge: 'Monitoring: Thrips', img: 'https://images.unsplash.com/photo-1601329025664-e4e6e8e5543a?w=200&q=80' },
        ].map((scan, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ede7', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
            <div style={{ height: 80, background: '#f0f7ee', position: 'relative', overflow: 'hidden' }}>
              <img src={scan.img} alt={scan.crop} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: 3 }}>{scan.crop}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: 10 }}>{scan.date}</div>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 9999,
                background: BADGE_STYLES[scan.badge]?.bg ?? '#f3f4f6',
                color: BADGE_STYLES[scan.badge]?.color ?? '#374151',
              }}>{scan.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
