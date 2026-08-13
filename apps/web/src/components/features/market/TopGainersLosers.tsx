interface TopGainersLosersProps {
  marketData: any;
}

export default function TopGainersLosers({ marketData }: TopGainersLosersProps) {
  let gainers: any[] = [];
  let losers: any[] = [];

  if (marketData && marketData.mandis && marketData.mandis.length > 0) {
    // Sort mandis by vsAveragePct
    const sorted = [...marketData.mandis].sort((a, b) => b.vsAveragePct - a.vsAveragePct);
    gainers = sorted.filter(m => m.vsAveragePct > 0).slice(0, 3);
    // For losers, we want the lowest vsAveragePct, so reverse the sorted array
    losers = [...sorted].reverse().filter(m => m.vsAveragePct < 0).slice(0, 3);
  }

  return (
    <div className="card" style={{ padding: '24px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 20px 0', fontSize: '1.125rem' }}>
        Top Mandis vs Average (Today)
      </h2>
      
      <div style={{ marginBottom: '24px' }}>
        <span className="badge badge-success" style={{ marginBottom: '12px', display: 'inline-block' }}>HIGHEST PAYING</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {gainers.length > 0 ? gainers.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>{m.name} <span style={{ fontSize: '0.7rem', color: 'var(--color-bark)' }}>({m.district})</span></span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '0.875rem' }}>
                ₹{m.modal?.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>(+{m.vsAveragePct}%)</span>
              </span>
            </div>
          )) : (
            <div style={{ fontSize: '0.875rem', color: 'var(--color-bark)' }}>No significant premium mandis found today.</div>
          )}
        </div>
      </div>

      <div>
        <span className="badge badge-danger" style={{ marginBottom: '12px', display: 'inline-block' }}>LOWEST PAYING</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {losers.length > 0 ? losers.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>{m.name} <span style={{ fontSize: '0.7rem', color: 'var(--color-bark)' }}>({m.district})</span></span>
              <span style={{ color: 'var(--color-danger)', fontWeight: 600, fontSize: '0.875rem' }}>
                ₹{m.modal?.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>({m.vsAveragePct}%)</span>
              </span>
            </div>
          )) : (
            <div style={{ fontSize: '0.875rem', color: 'var(--color-bark)' }}>No significant discounted mandis found today.</div>
          )}
        </div>
      </div>
    </div>
  )
}
