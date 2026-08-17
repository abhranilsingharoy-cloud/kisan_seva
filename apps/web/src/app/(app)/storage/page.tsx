'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ThermometerSnowflake, 
  Package, 
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';

const PAGE_BG = { background: '#f9fafb', minHeight: '100vh', paddingBottom: 80 };

const MOCK_FACILITIES = [
  {
    id: 'cs1',
    name: 'Kisan Cold Storage & Warehouse',
    location: 'Bhopal Bypass, 12km',
    distance: 12.0,
    tempRange: '2°C to 8°C',
    capacityAvailable: 150, // tons
    pricePerTonPerDay: 45,
    tags: ['Potato', 'Onion', 'Fruits'],
    rating: 4.8,
    imageUrl: '/equipment/combine_harvester.jpg' // Using placeholder image available in repo
  },
  {
    id: 'cs2',
    name: 'AgriSafe Chilling Center',
    location: 'Sehore Road, 5km',
    distance: 5.0,
    tempRange: '-5°C to 4°C',
    capacityAvailable: 45,
    pricePerTonPerDay: 60,
    tags: ['Dairy', 'Vegetables', 'Fruits'],
    rating: 4.5,
    imageUrl: '/equipment/tractor_blue.jpg'
  },
  {
    id: 'cs3',
    name: 'Mandideep Bulk Storage',
    location: 'Mandideep Industrial Area, 18km',
    distance: 18.0,
    tempRange: '0°C to 10°C',
    capacityAvailable: 500,
    pricePerTonPerDay: 35,
    tags: ['Onion', 'Garlic', 'Grains'],
    rating: 4.2,
    imageUrl: '/equipment/rotavator.jpg'
  },
  {
    id: 'cs4',
    name: 'Freshly Frozen Logistics',
    location: 'Vidisha Highway, 25km',
    distance: 25.0,
    tempRange: '-18°C to -2°C',
    capacityAvailable: 80,
    pricePerTonPerDay: 90,
    tags: ['Meat', 'Peas', 'Processed'],
    rating: 4.9,
    imageUrl: '/equipment/combine_harvester.jpg'
  }
];

export default function ColdStorageScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [bookingTons, setBookingTons] = useState<number>(10);
  const [bookingDays, setBookingDays] = useState<number>(30);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [bookings, setBookings] = useState<any[]>([]);

  // Load past bookings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kisanseva_cold_storage_bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = {
      id: Date.now().toString(),
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      tons: bookingTons,
      days: bookingDays,
      totalCost: bookingTons * bookingDays * selectedFacility.pricePerTonPerDay,
      date: new Date().toISOString()
    };
    
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('kisanseva_cold_storage_bookings', JSON.stringify(updatedBookings));
    
    setShowSuccess(true);
  };

  const closeModals = () => {
    setSelectedFacility(null);
    setShowSuccess(false);
    setBookingTons(10);
    setBookingDays(30);
  };

  const filteredFacilities = MOCK_FACILITIES.filter(f => {
    if (activeFilter !== 'All' && !f.tags.includes(activeFilter)) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={PAGE_BG}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '32px 28px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 12px 0', letterSpacing: '-0.03em' }}>
            Cold Storage & Warehouses
          </h1>
          <p style={{ color: '#4b5563', margin: '0 0 24px 0', fontSize: '1.05rem' }}>
            Protect your harvest from price crashes. Find nearby storage for potatoes, onions, and perishables.
          </p>

          {/* Search Bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
              <input 
                type="text" 
                placeholder="Search facilities..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '14px 16px 14px 46px', borderRadius: 12, border: '1px solid #d1d5db', outline: 'none', fontSize: '1rem' }}
              />
            </div>
            <button style={{ padding: '0 20px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
              <Filter size={18} /> Filters
            </button>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {['All', 'Potato', 'Onion', 'Fruits', 'Vegetables'].map(tag => (
              <button 
                key={tag}
                onClick={() => setActiveFilter(tag)}
                style={{ 
                  padding: '8px 16px', borderRadius: 20, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', whiteSpace: 'nowrap', border: 'none',
                  background: activeFilter === tag ? '#2d6a27' : '#f3f4f6',
                  color: activeFilter === tag ? '#fff' : '#4b5563',
                  transition: 'all 0.2s'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        
        {/* Active Bookings Banner */}
        {bookings.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: 16 }}>Your Active Bookings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {bookings.map(b => (
                <div key={b.id} style={{ background: '#ecfdf5', border: '1px solid #34d399', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: '#065f46' }}>{b.facilityName}</span>
                    <span style={{ fontSize: '0.875rem', background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>Active</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#047857' }}>
                    {b.tons} Tons • {b.days} Days
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065f46', marginTop: 12 }}>
                    Total: ₹{b.totalCost.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: 16 }}>Available Facilities</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {filteredFacilities.map(facility => (
            <div key={facility.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e8ede7', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 160, background: '#f3f4f6', backgroundImage: `url(${facility.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  ⭐ {facility.rating}
                </div>
              </div>
              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>{facility.name}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: '0.875rem', marginBottom: 16 }}>
                  <MapPin size={16} /> {facility.location}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ background: '#f0fdf4', padding: 8, borderRadius: 8, color: '#16a34a' }}><ThermometerSnowflake size={18} /></div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Temp</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{facility.tempRange}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ background: '#fef3c7', padding: 8, borderRadius: 8, color: '#d97706' }}><Package size={18} /></div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Capacity</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{facility.capacityAvailable} Tons</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Price</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>₹{facility.pricePerTonPerDay}<span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}> /ton/day</span></div>
                  </div>
                  <button 
                    onClick={() => setSelectedFacility(facility)}
                    style={{ background: '#2d6a27', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Book Space
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedFacility && !showSuccess && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={closeModals} />
          <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 440, borderRadius: 20, padding: 30, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Book Cold Storage</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>{selectedFacility.name}</p>
              </div>
              <button type="button" onClick={closeModals} style={{ background: '#f3f4f6', border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Quantity (Tons)</label>
                <input 
                  type="number" 
                  min="1" 
                  max={selectedFacility.capacityAvailable} 
                  value={bookingTons}
                  onChange={e => setBookingTons(parseInt(e.target.value) || 1)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', fontSize: '1rem' }} 
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Duration (Days)</label>
                <input 
                  type="number" 
                  min="1" 
                  value={bookingDays}
                  onChange={e => setBookingDays(parseInt(e.target.value) || 1)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', fontSize: '1rem' }} 
                />
              </div>

              <div style={{ background: '#f9fafb', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem', color: '#4b5563' }}>
                  <span>Price per ton per day</span>
                  <span>₹{selectedFacility.pricePerTonPerDay}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', color: '#111827', borderTop: '1px solid #d1d5db', paddingTop: 12, marginTop: 4 }}>
                  <span>Total Cost</span>
                  <span>₹{(bookingTons * bookingDays * selectedFacility.pricePerTonPerDay).toLocaleString()}</span>
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', marginTop: 10 }}>
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={closeModals} />
          <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 400, borderRadius: 20, padding: '40px 30px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ width: 64, height: 64, background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 12px' }}>Booking Confirmed!</h3>
            <p style={{ color: '#4b5563', fontSize: '1rem', margin: '0 0 24px', lineHeight: 1.5 }}>
              Your space at <strong>{selectedFacility?.name}</strong> has been successfully reserved.
            </p>
            <button type="button" onClick={closeModals} style={{ width: '100%', padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
