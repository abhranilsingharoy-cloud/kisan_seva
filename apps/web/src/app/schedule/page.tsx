'use client'

import React, { useState, useEffect } from 'react';
import { 
  CloudSun, Droplets, Wind, ArrowLeft, MapPin, AlertCircle, Loader2, Bell, CheckSquare, Square, ChevronRight, Beaker, Cloud, CloudRain, Sun, Calendar, BellRing, RefreshCw, Home, Activity, TrendingUp
} from 'lucide-react';

function owIconToEmoji(icon: string): string {
  const map: Record<string, string> = {
    '01d':'☀️','01n':'🌙','02d':'⛅','02n':'⛅','03d':'☁️','03n':'☁️',
    '04d':'☁️','04n':'☁️','09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌧️',
    '11d':'⛈️','11n':'⛈️','13d':'❄️','13n':'❄️','50d':'🌫️','50n':'🌫️',
  };
  return map[icon] ?? '🌤️';
}

export default function SchedulePage() {
  const [activePlot, setActivePlot] = useState('plot2a');
  const [notifications, setNotifications] = useState(true);
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const plots = [
    { id: 'plot2a', name: 'Plot 2A', crop: 'Tomato', area: '1.2 ac', city: 'Vidisha' },
    { id: 'plot3b', name: 'Plot 3B', crop: 'Wheat',  area: '0.8 ac', city: 'Bhopal'  },
    { id: 'plot1c', name: 'Plot 1C', crop: 'Rice',   area: '1.5 ac', city: 'Jabalpur' },
  ];

  const activePlotData = plots.find(p => p.id === activePlot)!;

  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true);
      setWeatherError(null);
      try {
        const resp = await fetch(
          `/api/weather?city=${encodeURIComponent(activePlotData.city)}&crop=${activePlotData.crop}&stage=flowering`
        );
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const data = await resp.json();
        setWeather(data);
      } catch (err: any) {
        setWeatherError('Could not load live weather.');
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [activePlot]);

  const weeklySchedule = [
    { day: 'Mon', date: 'Oct 12', irrigation: '28mm', fert: 'DAP 5kg', notes: 'Apply at root zone', completed: false, today: true },
    { day: 'Tue', date: 'Oct 13', irrigation: '-', fert: '-', notes: '-', completed: false, today: false },
    { day: 'Wed', date: 'Oct 14', irrigation: '15mm', fert: 'Urea 2kg', notes: 'Top dressing', completed: false, today: false },
    { day: 'Thu', date: 'Oct 15', irrigation: '-', fert: '-', notes: '-', completed: false, today: false },
    { day: 'Fri', date: 'Oct 16', irrigation: '20mm', fert: '-', notes: 'Evening only', completed: false, today: false },
    { day: 'Sat', date: 'Oct 17', irrigation: '-', fert: 'Foliar Spray', notes: 'Micronutrients', completed: false, today: false },
    { day: 'Sun', date: 'Oct 18', irrigation: '-', fert: '-', notes: 'Field scouting', completed: false, today: false },
  ];

  const [schedule, setSchedule] = useState(weeklySchedule);

  const toggleTask = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].completed = !newSchedule[index].completed;
    setSchedule(newSchedule);
  };

  const cropStages = [
    { name: 'Sowing', completed: true },
    { name: 'Germination', completed: true },
    { name: 'Vegetative', completed: true },
    { name: 'Flowering', completed: false, current: true },
    { name: 'Fruiting', completed: false },
    { name: 'Harvest', completed: false },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-parchment)', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'var(--font-sans)', color: 'var(--color-ink)' }}>
      {/* Top Nav */}
      <div className="page-header" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'var(--color-parchment)', borderBottom: '1px solid var(--color-bone)', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => window.location.href = '/dashboard'}>
          <ArrowLeft size={24} color="var(--color-ink)" />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Smart Advisory Schedule</h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-bark)' }}>Personalised for your plots</p>
        </div>
      </div>

      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Plot Selector */}
        <div className="scroll-x" style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '8px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', borderBottom: '1px solid var(--color-bone)' }}>
          {plots.map(plot => (
            <button 
              key={plot.id}
              className="plot-tab"
              onClick={() => setActivePlot(plot.id)}
              style={{
                background: 'none', border: 'none', padding: '8px 4px',
                borderBottom: activePlot === plot.id ? '2px solid var(--color-honey-amber)' : '2px solid transparent',
                color: activePlot === plot.id ? 'var(--color-ink)' : 'var(--color-bark)',
                fontWeight: activePlot === plot.id ? 600 : 500,
                whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s',
                fontSize: '1rem'
              }}
            >
              {plot.name} - {plot.crop} ({plot.area})
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: '1 1 50%' }}>
            {/* Weather Banner */}
            <div style={{ background: 'linear-gradient(135deg, #1a2e16 0%, #0f1a0d 100%)', borderRadius: '20px', padding: '24px', color: 'white' }}>
              {weatherLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.7 }}>
                  <Loader2 size={24} className="spin" color="var(--color-honey-amber)" />
                  <span>Loading live weather...</span>
                </div>
              ) : weatherError ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', opacity: 0.8 }}>
                  <AlertCircle size={18} color="#f87171" />
                  <span>{weatherError}</span>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '2.5rem' }}>{weather?.current?.icon ? owIconToEmoji(weather.current.icon) : '⛅'}</span>
                        <span style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', fontWeight: 600, lineHeight: 1 }}>{weather?.current?.temp ?? 32}°C</span>
                      </div>
                      <p style={{ margin: '8px 0 4px', fontSize: '1rem', textTransform: 'capitalize' }}>{weather?.current?.description ?? 'Partly Cloudy'}</p>
                      <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {weather?.location?.name ?? activePlotData.city}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <Droplets size={20} color="var(--color-honey-amber)" style={{ margin: '0 auto 4px' }} />
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Humidity</div>
                        <div style={{ fontWeight: 600 }}>{weather?.current?.humidity ?? 68}%</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Wind size={20} color="var(--color-honey-amber)" style={{ margin: '0 auto 4px' }} />
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Wind</div>
                        <div style={{ fontWeight: 600 }}>{weather?.current?.windSpeed ?? 12} km/h</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <CloudRain size={20} color="var(--color-honey-amber)" style={{ margin: '0 auto 4px' }} />
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Rain</div>
                        <div style={{ fontWeight: 600 }}>{weather?.current?.rainfall24h ?? 0}mm</div>
                      </div>
                    </div>
                  </div>

                  {weather?.advisory?.diseaseAlert && (
                    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'rgba(248,113,113,0.15)', borderRadius: '8px', borderLeft: '4px solid #f87171', fontSize: '0.875rem' }}>
                      {weather.advisory.diseaseAlert}
                    </div>
                  )}

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                    {(weather?.daily?.slice(0,5) ?? []).map((f: any, i: number) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{f.dayName}</span>
                        <span style={{ fontSize: '1.25rem' }}>{owIconToEmoji(f.icon)}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{f.maxTemp}°</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Today's Advisory Cards */}
            <div>
              <h2 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)', marginBottom: '16px' }}>Today's Advisories</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="card" style={{ borderLeft: '4px solid #ef4444', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>🚧 Irrigate 28mm Today</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-saddle)' }}>Reason: ET₀ demand exceeds soil moisture threshold. No rain forecast for 48 hours.</p>
                  <div><button className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '8px 16px' }}>Schedule Irrigation</button></div>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--color-amber)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>🌿 Apply DAP Fertilizer</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-saddle)' }}>Plot 2A: 50 kg/acre recommended before rain window Thursday.</p>
                  <div><button className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '8px 16px' }}>View Details</button></div>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--color-primary-act)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>🧪 Foliar Spray</h3>
                    <span className="badge badge-neutral">Low Priority</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-saddle)' }}>Wind &lt; 8 km/h tomorrow morning. Good window for pesticide application.</p>
                </div>
              </div>
            </div>

            {/* Weekly Schedule Table */}
            <div className="card">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-bone)' }}>
                <h2 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)', margin: 0 }}>Weekly Schedule</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="ks-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead style={{ backgroundColor: 'var(--color-parchment)' }}>
                    <tr>
                      <th style={{ padding: '12px 20px' }}>Day</th>
                      <th style={{ padding: '12px 20px' }}>Irrigation (mm)</th>
                      <th style={{ padding: '12px 20px' }}>Fertilizer</th>
                      <th style={{ padding: '12px 20px' }}>Notes</th>
                      <th style={{ padding: '12px 20px', textAlign: 'center' }}>Done</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item, idx) => (
                      <tr key={idx} style={{ 
                        borderBottom: '1px solid var(--color-bone)',
                        borderLeft: item.today ? '4px solid var(--color-honey-amber)' : '4px solid transparent',
                        backgroundColor: item.today ? 'rgba(217, 119, 6, 0.05)' : 'transparent'
                      }}>
                        <td style={{ padding: '12px 20px' }}>
                          <div style={{ fontWeight: item.today ? 600 : 500 }}>{item.day}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-bark)' }}>{item.date}</div>
                        </td>
                        <td style={{ padding: '12px 20px' }}>{item.irrigation}</td>
                        <td style={{ padding: '12px 20px' }}>{item.fert}</td>
                        <td style={{ padding: '12px 20px', color: 'var(--color-saddle)' }}>{item.notes}</td>
                        <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                          <button 
                            onClick={() => toggleTask(idx)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.completed ? 'var(--color-success)' : 'var(--color-bark)' }}
                          >
                            {item.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: '1 1 35%' }}>
            {/* Soil Health Card */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)', margin: 0 }}>Soil Health — {activePlotData.name}</h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-bark)' }}>Updated 2w ago</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                    <span>Nitrogen (N)</span><span style={{ fontWeight: 600 }}>72%</span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: '72%', backgroundColor: '#22c55e' }} /></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                    <span>Phosphorus (P)</span><span style={{ fontWeight: 600 }}>45%</span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: '45%', backgroundColor: 'var(--color-amber)' }} /></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                    <span>Potassium (K)</span><span style={{ fontWeight: 600 }}>28%</span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: '28%', backgroundColor: '#ef4444' }} /></div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                <span className="badge badge-success">pH 6.8</span>
                <span className="badge badge-warning">Organic Carbon 0.4%</span>
                <span className="badge badge-neutral" style={{ backgroundColor: 'var(--color-bone)' }}>Moisture 42%</span>
              </div>

              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary-act)', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}>
                Update from Soil Card Portal <ChevronRight size={16} />
              </a>
            </div>

            {/* Crop Stage Tracker */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)', margin: 0 }}>Crop Stage Tracker</h2>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>42 days remaining to harvest</div>
                <div className="progress" style={{ height: '8px' }}><div className="progress-fill" style={{ width: '70%', backgroundColor: 'var(--color-success)' }} /></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '12px', left: '10px', right: '10px', height: '2px', backgroundColor: 'var(--color-bone)', zIndex: 1 }} />
                
                {cropStages.map((stage, idx) => (
                  <div key={stage.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '50%', 
                      backgroundColor: stage.current ? 'var(--color-amber)' : stage.completed ? '#22c55e' : 'var(--color-bone)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {stage.current && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff' }} />}
                    </div>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: stage.current ? 600 : 400,
                      color: stage.current ? 'var(--color-ink)' : 'var(--color-bark)',
                      whiteSpace: 'nowrap'
                    }}>
                      {stage.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="ks-bottom-nav lg:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTop: '1px solid var(--color-bone)', display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 50 }}>
        <a href="/dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-bark)', textDecoration: 'none', gap: '4px' }}>
          <Home size={24} />
          <span style={{ fontSize: '0.65rem' }}>Home</span>
        </a>
        <a href="/schedule" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-success)', textDecoration: 'none', gap: '4px' }}>
          <Calendar size={24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Schedule</span>
        </a>
      </nav>
    </div>
  );
}
