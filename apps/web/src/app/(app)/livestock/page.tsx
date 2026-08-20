'use client';

import React, { useState } from 'react';
import { Heart, Activity, Calendar, Plus, Syringe, Milk, Weight, ChevronDown, ChevronUp, X } from 'lucide-react';

const PAGE_BG = { background: '#f9fafb', minHeight: '100vh', paddingBottom: 100 };

type Animal = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  lastVaccine: string;
  milkPerDay: string;
  status: 'Healthy' | 'Sick' | 'Pregnant';
};

const DEFAULT_ANIMALS: Animal[] = [
  { id: 'a1', name: 'Gauri', type: 'Cow', breed: 'Gir', age: '4 years', weight: '350', lastVaccine: '2026-05-10', milkPerDay: '12', status: 'Healthy' },
  { id: 'a2', name: 'Kali', type: 'Buffalo', breed: 'Murrah', age: '5 years', weight: '420', lastVaccine: '2026-04-22', milkPerDay: '10', status: 'Pregnant' },
  { id: 'a3', name: 'Moti', type: 'Goat', breed: 'Sirohi', age: '2 years', weight: '28', lastVaccine: '2026-03-15', milkPerDay: '2', status: 'Healthy' },
];

const VACCINES = ['FMD', 'HS (Haemorrhagic Septicaemia)', 'BQ (Black Quarter)', 'Brucellosis', 'Anthrax', 'Rabies', 'PPR (Goats/Sheep)'];

export default function LivestockPage() {
  const [animals, setAnimals] = useState<Animal[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_ANIMALS;
    try {
      const saved = localStorage.getItem('kisanseva_livestock');
      return saved ? JSON.parse(saved) : DEFAULT_ANIMALS;
    } catch { return DEFAULT_ANIMALS; }
  });

  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: 'Cow', breed: '', age: '', weight: '', milkPerDay: '', lastVaccine: '', status: 'Healthy' as Animal['status'] });

  const saveAnimals = (updated: Animal[]) => {
    setAnimals(updated);
    localStorage.setItem('kisanseva_livestock', JSON.stringify(updated));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnimal: Animal = { ...form, id: Date.now().toString() };
    saveAnimals([...animals, newAnimal]);
    setShowModal(false);
    setForm({ name: '', type: 'Cow', breed: '', age: '', weight: '', milkPerDay: '', lastVaccine: '', status: 'Healthy' });
  };

  const handleDelete = (id: string) => saveAnimals(animals.filter(a => a.id !== id));

  const totalMilk = animals.reduce((sum, a) => sum + parseFloat(a.milkPerDay || '0'), 0);
  const statusColor = (s: Animal['status']) => s === 'Healthy' ? '#16a34a' : s === 'Pregnant' ? '#d97706' : '#dc2626';
  const statusBg = (s: Animal['status']) => s === 'Healthy' ? '#f0fdf4' : s === 'Pregnant' ? '#fffbeb' : '#fef2f2';

  return (
    <div style={PAGE_BG}>
      <div style={{ background: '#fff', padding: '32px 28px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.03em' }}>🐄 Livestock & Animals</h1>
            <p style={{ color: '#4b5563', margin: 0 }}>Track health, milk, vaccination schedules for your cattle.</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ background: '#2d6a27', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={18} /> Add Animal
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Animals', value: animals.length, icon: '🐄', color: '#2d6a27', bg: '#f0fdf4' },
            { label: 'Total Milk/Day', value: `${totalMilk} L`, icon: '🥛', color: '#1d4ed8', bg: '#eff6ff' },
            { label: 'Healthy', value: animals.filter(a => a.status === 'Healthy').length, icon: '✅', color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Need Attention', value: animals.filter(a => a.status !== 'Healthy').length, icon: '⚠️', color: '#d97706', bg: '#fffbeb' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ede7', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Vaccine Due Alert */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
          <Syringe size={20} color="#d97706" />
          <div>
            <strong style={{ color: '#92400e' }}>Vaccination Reminder:</strong>
            <span style={{ color: '#78350f', marginLeft: 8 }}>FMD booster due for Gauri & Kali within 30 days. Contact your local veterinarian.</span>
          </div>
        </div>

        {/* Animal List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {animals.map(animal => (
            <div key={animal.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ede7', overflow: 'hidden' }}>
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpanded(expanded === animal.id ? null : animal.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: '2.5rem' }}>{animal.type === 'Cow' ? '🐄' : animal.type === 'Buffalo' ? '🐃' : animal.type === 'Goat' ? '🐐' : '🐑'}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>{animal.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{animal.type} · {animal.breed} · {animal.age}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ background: statusBg(animal.status), color: statusColor(animal.status), padding: '4px 12px', borderRadius: 20, fontSize: '0.8125rem', fontWeight: 700 }}>{animal.status}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1d4ed8', fontSize: '0.875rem', fontWeight: 600 }}><Milk size={16} /> {animal.milkPerDay} L/day</div>
                  {expanded === animal.id ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#6b7280" />}
                </div>
              </div>

              {expanded === animal.id && (
                <div style={{ borderTop: '1px solid #f3f4f6', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Health Info</div>
                    <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 2 }}>
                      <div>⚖️ Weight: <strong>{animal.weight} kg</strong></div>
                      <div>💉 Last Vaccine: <strong>{animal.lastVaccine}</strong></div>
                      <div>🥛 Daily Milk: <strong>{animal.milkPerDay} L</strong></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Upcoming Vaccines</div>
                    {VACCINES.slice(0, 3).map(v => (
                      <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Syringe size={14} color="#6b7280" />
                        <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 8 }}>
                    <button onClick={() => handleDelete(animal.id)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', padding: '8px 14px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>Remove</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)} />
          <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 480, borderRadius: 20, padding: 28, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Add New Animal</h3>
              <button onClick={() => setShowModal(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Animal Name', key: 'name', placeholder: 'e.g., Gauri', type: 'text' },
                { label: 'Breed', key: 'breed', placeholder: 'e.g., Gir, Murrah', type: 'text' },
                { label: 'Age', key: 'age', placeholder: 'e.g., 3 years', type: 'text' },
                { label: 'Weight (kg)', key: 'weight', placeholder: '350', type: 'number' },
                { label: 'Milk per Day (Litres)', key: 'milkPerDay', placeholder: '10', type: 'number' },
                { label: 'Last Vaccination Date', key: 'lastVaccine', placeholder: '', type: 'date' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>{field.label}</label>
                  <input required type={field.type} value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', fontSize: '1rem' }} />
                </div>
              ))}
              {[
                { label: 'Animal Type', key: 'type', options: ['Cow', 'Buffalo', 'Goat', 'Sheep', 'Pig', 'Poultry'] },
                { label: 'Health Status', key: 'status', options: ['Healthy', 'Sick', 'Pregnant'] },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>{field.label}</label>
                  <select value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value as any })} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', fontSize: '1rem' }}>
                    {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <button type="submit" style={{ width: '100%', padding: '14px', background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', marginTop: 8 }}>Add Animal</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
