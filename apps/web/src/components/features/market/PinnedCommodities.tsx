interface PinnedCommoditiesProps {
  selectedCrop: string
  setSelectedCrop: (crop: string) => void
}

export default function PinnedCommodities({ selectedCrop, setSelectedCrop }: PinnedCommoditiesProps) {
  const commodities = [
    { name: 'Wheat', price: '₹2,850', change: '+2.5% (+₹70)', isUp: true, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&q=80', bg: '#fef3c7' },
    { name: 'Rice', price: '₹4,100', change: '-1.2% (-₹50)', isUp: false, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&q=80', bg: '#e0f2fe' },
    { name: 'Tomato', price: '₹1,500', change: '+5.0% (+₹75)', isUp: true, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&q=80', bg: '#fee2e2' },
    { name: 'Onion', price: '₹2,200', change: '-0.5% (-₹10)', isUp: false, img: 'https://images.unsplash.com/photo-1620574387735-3624d75b2dfc?w=100&q=80', bg: '#f3e8ff' },
    { name: 'Potato', price: '₹1,100', change: '+1.5% (+₹15)', isUp: true, img: 'https://images.unsplash.com/photo-1518977956812-cd3bdadaad31?w=100&q=80', bg: '#ffedd5' },
    { name: 'Cotton', price: '₹6,500', change: '+3.2% (+₹200)', isUp: true, img: 'https://images.unsplash.com/photo-1601329025664-e4e6e8e5543a?w=100&q=80', bg: '#f1f5f9' },
    { name: 'Soybean', price: '₹4,800', change: '-2.1% (-₹100)', isUp: false, img: 'https://images.unsplash.com/photo-1620601614798-75b293126fdb?w=100&q=80', bg: '#fef9c3' },
  ]

  return (
    <div className="hide-scroll" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
      {commodities.map(item => (
        <div 
          key={item.name} 
          className="card" 
          onClick={() => setSelectedCrop(item.name)}
          style={{ flex: '0 0 200px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', border: selectedCrop === item.name ? '2px solid var(--color-honey-amber)' : '1px solid transparent', transition: 'all 0.2s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: item.bg, overflow: 'hidden' }}>
              <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</span>
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{item.price} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-bark)' }}>/ Qtl</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.75rem', color: item.isUp ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>{item.change}</span>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '24px' }}>
              {[40, 60, 50, 80, 100].map((h, i) => (
                <div key={i} style={{ width: '4px', height: `${h}%`, backgroundColor: item.isUp ? '#22c55e' : '#ef4444', opacity: 0.5 + (i * 0.1) }} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
