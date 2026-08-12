'use client'

import React, { useState, useEffect } from 'react';
import { 
  CloudSun, Droplets, Wind, Thermometer, ArrowLeft, 
  Bell, BellOff, CheckSquare, Square, ChevronRight, 
  AlertCircle, Beaker, Info, Cloud, CloudRain, Sun,
  Home, Activity, TrendingUp, Calendar, BellRing,
  RefreshCw, MapPin, Loader2
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

  const forecasts = [
    { day: 'Mon', temp: '32°', icon: <CloudSun size={16} /> },
    { day: 'Tue', temp: '31°', icon: <Cloud size={16} /> },
    { day: 'Wed', temp: '29°', icon: <CloudRain size={16} /> },
    { day: 'Thu', temp: '30°', icon: <Sun size={16} /> },
    { day: 'Fri', temp: '33°', icon: <Sun size={16} /> },
  ];

  return (
    <div className="page-container" style={{ minHeight: '100vh', paddingBottom: '80px', backgroundColor: 'var(--color-parchment)' }}>
      {/* 1. Sticky top nav */}
      <div className="top-nav" style={{ 
        position: 'sticky', top: 0, zIndex: 50, 
        backgroundColor: 'var(--color-parchment)', 
        borderBottom: '1px solid var(--color-bone)',
        padding: '16px', display: 'flex', alignItems: 'center', gap: '16px'
      }}>
        <button className="btn-icon" aria-label="Back" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={24} color="var(--color-ink)" />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontWeight: 600 }}>Smart Advisory Schedule</h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-bark)', fontFamily: 'var(--font-sans)' }}>Personalised for your plots</p>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 2. PLOT SELECTOR */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '8px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          {plots.map(plot => (
            <button 
              key={plot.id}
              onClick={() => setActivePlot(plot.id)}
              style={{
                background: 'none', border: 'none', padding: '8px 4px',
                borderBottom: activePlot === plot.id ? '2px solid var(--color-honey-amber)' : '2px solid transparent',
                color: activePlot === plot.id ? 'var(--color-ink)' : 'var(--color-bark)',
                fontFamily: 'var(--font-sans)', fontWeight: activePlot === plot.id ? 600 : 500,
                whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {plot.name} - {plot.crop} ({plot.area})
            </button>
          ))}
        </div>

        {/* 3. WEATHER BANNER */}
        <div className="panel-dark" style={{ 
          background: 'linear-gradient(135deg, var(--color-charcoal-olive) 0%, #1a1e19 100%)',
          borderRadius: 'var(--radius-md)', padding: '20px', color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {weatherLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.7 }}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} color="var(--color-honey-amber)" />
              <span>Loading live weather for {activePlotData.city}...</span>
            </div>
          ) : weatherError ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', opacity: 0.8 }}>
              <AlertCircle size={18} color="#f87171" />
              <span style={{ fontSize: '0.875rem' }}>{weatherError}</span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '2rem' }}>{weather?.current?.icon ? owIconToEmoji(weather.current.icon) : '⛅'}</span>
                    <span style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 600, lineHeight: 1 }}>
                      {weather?.current?.temp ?? 32}°C
                    </span>
                  </div>
                  <p style={{ margin: '8px 0 4px', fontSize: '1rem', opacity: 0.9, textTransform: 'capitalize' }}>
                    {weather?.current?.description ?? 'Partly Cloudy'}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} />
                    {weather?.location?.name ?? activePlotData.city} · Today
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Droplets size={18} color="var(--color-honey-amber)" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Humidity</div>
                    <div style={{ fontWeight: 600 }}>{weather?.current?.humidity ?? 68}%</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Wind size={18} color="var(--color-honey-amber)" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Wind</div>
                    <div style={{ fontWeight: 600 }}>{weather?.current?.windSpeed ?? 12} km/h</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <CloudRain size={18} color="var(--color-honey-amber)" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Rain</div>
                    <div style={{ fontWeight: 600 }}>{weather?.current?.rainfall24h ?? 0}mm</div>
                  </div>
                </div>
              </div>

              {/* Disease alert if fungal risk is high */}
              {weather?.advisory?.diseaseAlert && (
                <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: 'rgba(248,113,113,0.15)', borderRadius: '6px', borderLeft: '3px solid #f87171', fontSize: '0.8rem' }}>
                  {weather.advisory.diseaseAlert}
                </div>
              )}
            </>
          )}

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
            {(weather?.daily?.slice(0,5) ?? []).map((f: any, i: number) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{f.dayName}</span>
                <span style={{ fontSize: '1.1rem' }}>{owIconToEmoji(f.icon)}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{f.maxTemp}°</span>
                {f.rainfall > 0 && <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{f.rainfall}mm</span>}
              </div>
            ))}
          </div>

          </div>
        </div>

        {/* 4. TODAY'S ADVISORY CARDS */}
        <div>
          <h2 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)', color: 'var(--color-ink)', marginBottom: '12px' }}>Today's Advisories</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div className="rec-card rec-card-urgent" style={{ 
              backgroundColor: 'var(--color-bone)', borderRadius: 'var(--radius-md)', padding: '16px',
              borderLeft: '4px solid var(--color-danger)'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: '#fef2f2', padding: '8px', borderRadius: '50%' }}>
                  <Droplets size={20} color="var(--color-danger)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-ink)', fontWeight: 600 }}>🚿 Irrigate 28mm Today</h3>
                    <span className="badge badge-danger" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#fef2f2', color: 'var(--color-danger)', fontWeight: 600 }}>Urgent</span>
                  </div>
                  <p style={{ margin: '4px 0 12px', fontSize: '0.875rem', color: 'var(--color-saddle)' }}>Soil moisture is down to 42%. High temperature requires immediate watering to prevent heat stress.</p>
                  <button className="btn btn-primary" style={{ 
                    backgroundColor: 'var(--color-honey-amber)', color: 'var(--color-ink)', 
                    border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                    fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem'
                  }}>Mark as Done</button>
                </div>
              </div>
            </div>

            <div className="rec-card rec-card-high" style={{ 
              backgroundColor: 'var(--color-bone)', borderRadius: 'var(--radius-md)', padding: '16px',
              borderLeft: '4px solid var(--color-warning)'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: '#fffbeb', padding: '8px', borderRadius: '50%' }}>
                  <Beaker size={20} color="var(--color-warning)" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-ink)', fontWeight: 600 }}>🌿 Apply DAP Fertilizer</h3>
                    <span className="badge badge-warning" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#fffbeb', color: 'var(--color-warning)', fontWeight: 600 }}>High Priority</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-saddle)' }}>5kg DAP per acre. Apply near root zone during evening hours.</p>
                </div>
              </div>
            </div>

            <div className="rec-card rec-card-normal" style={{ 
              backgroundColor: 'var(--color-bone)', borderRadius: 'var(--radius-md)', padding: '16px',
              borderLeft: '4px solid var(--color-sage)'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: '#f0fdf4', padding: '8px', borderRadius: '50%' }}>
                  <AlertCircle size={20} color="var(--color-sage)" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-ink)', fontWeight: 600 }}>🧪 Foliar Spray Recommended</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-saddle)' }}>Prepare for micronutrient spray later this week based on leaf color.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 5. WEEKLY SCHEDULE TABLE */}
        <div>
          <h2 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)', color: 'var(--color-ink)', marginBottom: '12px' }}>Weekly Schedule</h2>
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-bone)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead style={{ backgroundColor: 'var(--color-bone)', color: 'var(--color-saddle)' }}>
                <tr>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Day</th>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Action</th>
                  <th style={{ padding: '12px', fontWeight: 600, textAlign: 'center' }}>Done</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, idx) => (
                  <tr key={idx} style={{ 
                    borderBottom: '1px solid var(--color-bone)',
                    borderLeft: item.today ? '4px solid var(--color-honey-amber)' : '4px solid transparent',
                    backgroundColor: item.today ? '#fffbeb' : 'transparent'
                  }}>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: item.today ? 600 : 500, color: 'var(--color-ink)' }}>{item.day}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-bark)' }}>{item.date}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {item.irrigation !== '-' && <div style={{ color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: '4px' }}><Droplets size={14} color="#3b82f6" /> {item.irrigation}</div>}
                        {item.fert !== '-' && <div style={{ color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: '4px' }}><Beaker size={14} color="var(--color-sage)" /> {item.fert}</div>}
                        {(item.irrigation === '-' && item.fert === '-') && <div style={{ color: 'var(--color-bark)' }}>No primary action</div>}
                        {item.notes !== '-' && <div style={{ fontSize: '0.75rem', color: 'var(--color-saddle)', marginTop: '4px' }}>Note: {item.notes}</div>}
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <button 
                        onClick={() => toggleTask(idx)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.completed ? 'var(--color-success)' : 'var(--color-bark)', padding: 0 }}
                        aria-label="Toggle completion"
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

        {/* 6. SOIL HEALTH CARD */}
        <div className="card" style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--color-bone)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)', color: 'var(--color-ink)', margin: 0 }}>Soil Health Status</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-bark)' }}>Updated 2w ago</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-saddle)' }}>Nitrogen (N) - Low</span>
                <span style={{ fontWeight: 600 }}>120 kg/ha</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--color-bone)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '35%', height: '100%', backgroundColor: 'var(--color-warning)' }}></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-saddle)' }}>Phosphorus (P) - Optimal</span>
                <span style={{ fontWeight: 600 }}>22 kg/ha</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--color-bone)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', backgroundColor: 'var(--color-success)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-saddle)' }}>Potassium (K) - High</span>
                <span style={{ fontWeight: 600 }}>310 kg/ha</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--color-bone)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', backgroundColor: 'var(--color-sage)' }}></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'var(--color-parchment)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-saddle)', marginBottom: '4px' }}>pH Level</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink)' }}>6.8 <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-success)' }}>(Optimal)</span></div>
            </div>
            <div style={{ backgroundColor: 'var(--color-parchment)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-saddle)', marginBottom: '4px' }}>Organic Carbon</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink)' }}>0.4%</div>
            </div>
          </div>

          <button className="btn btn-ghost" style={{ 
            width: '100%', padding: '10px', backgroundColor: 'transparent',
            border: '1px solid var(--color-bark)', color: 'var(--color-ink)',
            borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
          }}>
            Update from Soil Card Portal
          </button>
        </div>

        {/* 7. CROP STAGE TRACKER */}
        <div className="card" style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--color-bone)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)', color: 'var(--color-ink)', margin: 0 }}>Crop Lifecycle</h2>
            <div style={{ backgroundColor: '#fffbeb', color: 'var(--color-warning)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600 }}>
              42 days to harvest
            </div>
          </div>

          <div style={{ position: 'relative', paddingLeft: '16px' }}>
            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '19px', width: '2px', backgroundColor: 'var(--color-bone)' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cropStages.map((stage, idx) => (
                <div key={stage.name} style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                  <div style={{ 
                    width: '12px', height: '12px', borderRadius: '50%', zIndex: 2, marginLeft: '-2px',
                    backgroundColor: stage.current ? 'var(--color-honey-amber)' : stage.completed ? 'var(--color-success)' : 'var(--color-bone)',
                    border: stage.current ? '2px solid white' : 'none',
                    boxShadow: stage.current ? '0 0 0 2px var(--color-honey-amber)' : 'none'
                  }}></div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: stage.current ? 600 : 400,
                    color: stage.current ? 'var(--color-ink)' : stage.completed ? 'var(--color-saddle)' : 'var(--color-bark)'
                  }}>
                    {stage.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 8. NOTIFICATION SETTINGS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bone)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {notifications ? <Bell size={20} color="var(--color-ink)" /> : <BellOff size={20} color="var(--color-bark)" />}
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: '0.875rem' }}>Advisory Alerts</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-saddle)' }}>For {plots.find(p => p.id === activePlot)?.name}</div>
            </div>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            style={{ 
              width: '44px', height: '24px', borderRadius: '12px', border: 'none', position: 'relative',
              backgroundColor: notifications ? 'var(--color-success)' : 'var(--color-bone)', cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            aria-label="Toggle notifications"
          >
            <div style={{ 
              position: 'absolute', top: '2px', left: notifications ? '22px' : '2px',
              width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}></div>
          </button>
        </div>
      </div>

      {/* 9. Bottom Nav (Mobile Only) */}
      <div className="bottom-nav lg:hidden" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: 'white', borderTop: '1px solid var(--color-bone)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '12px 0', paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-bark)', cursor: 'pointer' }}>
          <Home size={24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 500 }}>Home</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-bark)', cursor: 'pointer' }}>
          <Activity size={24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 500 }}>Diagnose</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-bark)', cursor: 'pointer' }}>
          <TrendingUp size={24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 500 }}>Market</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-honey-amber)', cursor: 'pointer' }}>
          <Calendar size={24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Schedule</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-bark)', cursor: 'pointer' }}>
          <BellRing size={24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 500 }}>Alerts</span>
        </div>
      </div>
    </div>
  );
}
