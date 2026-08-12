export default function TopGainersLosers() {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 20px 0', fontSize: '1.125rem' }}>Top Gainers & Losers (Today)</h2>
      
      <div style={{ marginBottom: '24px' }}>
        <span className="badge badge-success" style={{ marginBottom: '12px', display: 'inline-block' }}>GAINERS</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cotton</span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>₹6,500 (+5.2%)</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Soybean</span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>₹4,800 (+3.8%)</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tur Dal</span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>₹9,200 (+2.1%)</span></div>
        </div>
      </div>

      <div>
        <span className="badge badge-danger" style={{ marginBottom: '12px', display: 'inline-block' }}>LOSERS</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Potato</span><span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>₹1,100 (-3.5%)</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Garlic</span><span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>₹8,500 (-2.8%)</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Maize</span><span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>₹1,950 (-1.9%)</span></div>
        </div>
      </div>
    </div>
  )
}
