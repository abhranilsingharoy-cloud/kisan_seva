import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts'

interface PriceChartCardProps {
  selectedCrop: string
  selectedState: string
  chartData: any[]
}

export default function PriceChartCard({ selectedCrop, selectedState, chartData }: PriceChartCardProps) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.25rem' }}>Price Trends (Last 30 Days) - {selectedCrop} in {selectedState || 'All States'}</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-sm" style={{ backgroundColor: 'var(--color-bone)' }}>All Dates</button>
          <button className="btn btn-sm" style={{ backgroundColor: 'var(--color-bone)' }}>My Gainers</button>
        </div>
      </div>

      <div style={{ height: '300px', width: '100%', marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorModal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              tickLine={false} 
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(val) => `₹${val}`}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              formatter={(value: any, name: any) => [`₹${value}`, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
            />
            <Area type="monotone" dataKey="max" stroke="#ef4444" fill="none" strokeDasharray="5 5" />
            <Area type="monotone" dataKey="min" stroke="#3b82f6" fill="none" strokeDasharray="5 5" />
            <Area type="monotone" dataKey="modal" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorModal)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginTop: '16px', fontSize: '0.875rem', color: 'var(--color-saddle)', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '2px', backgroundColor: '#3b82f6', borderTop: '2px dashed #3b82f6' }} /> Minimum</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '4px', backgroundColor: '#22c55e' }} /> Modal Average</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '2px', backgroundColor: '#ef4444', borderTop: '2px dashed #ef4444' }} /> Maximum</div>
      </div>
    </div>
  )
}
