import React, { useState } from 'react';
import { Search, ShoppingCart, Leaf, Filter, Star, Plus, Check } from 'lucide-react';

const FERTILISERS = [
  { id: 'f1', name: 'Neem Coated Urea', category: 'Nitrogenous', composition: '46% N', price: 266, weight: '45 kg', rating: 4.8, type: 'Chemical', color: '#38bdf8' },
  { id: 'f2', name: 'DAP (Di-ammonium Phosphate)', category: 'Phosphatic', composition: '18% N, 46% P', price: 1350, weight: '50 kg', rating: 4.9, type: 'Chemical', color: '#818cf8' },
  { id: 'f3', name: 'MOP (Muriate of Potash)', category: 'Potassic', composition: '60% K', price: 1700, weight: '50 kg', rating: 4.7, type: 'Chemical', color: '#f472b6' },
  { id: 'f4', name: 'NPK 12:32:16', category: 'Complex', composition: '12% N, 32% P, 16% K', price: 1470, weight: '50 kg', rating: 4.8, type: 'Chemical', color: '#c084fc' },
  { id: 'f5', name: 'NPK 10:26:26', category: 'Complex', composition: '10% N, 26% P, 26% K', price: 1440, weight: '50 kg', rating: 4.7, type: 'Chemical', color: '#a78bfa' },
  { id: 'f6', name: 'Single Super Phosphate (SSP)', category: 'Phosphatic', composition: '16% P, 11% S', price: 450, weight: '50 kg', rating: 4.5, type: 'Chemical', color: '#60a5fa' },
  { id: 'f7', name: 'Zinc Sulphate', category: 'Micro-nutrient', composition: '21% Zn, 10% S', price: 850, weight: '10 kg', rating: 4.6, type: 'Chemical', color: '#fb923c' },
  { id: 'f8', name: 'Premium Vermicompost', category: 'Organic', composition: 'Organic Carbon', price: 350, weight: '50 kg', rating: 4.9, type: 'Organic', color: '#4ade80' },
  { id: 'f9', name: 'Calcium Nitrate', category: 'Micro-nutrient', composition: '15.5% N, 18.8% Ca', price: 1200, weight: '25 kg', rating: 4.5, type: 'Chemical', color: '#fbbf24' },
  { id: 'f10', name: 'Mycorrhiza Bio-Fertilizer', category: 'Organic', composition: 'Fungal Spores', price: 600, weight: '4 kg', rating: 4.8, type: 'Organic', color: '#2dd4bf' },
  { id: 'f11', name: 'Azotobacter Culture', category: 'Organic', composition: 'N-fixing bacteria', price: 250, weight: '1 L', rating: 4.6, type: 'Organic', color: '#14b8a6' },
  { id: 'f12', name: 'Ammonium Sulphate', category: 'Nitrogenous', composition: '21% N, 24% S', price: 950, weight: '50 kg', rating: 4.4, type: 'Chemical', color: '#38bdf8' }
];

const CATEGORIES = ['All', 'Nitrogenous', 'Phosphatic', 'Potassic', 'Complex', 'Micro-nutrient', 'Organic'];

export function FertiliserTab() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});

  const filtered = FERTILISERS.filter(f => 
    (activeCategory === 'All' || f.category === activeCategory) &&
    (f.name.toLowerCase().includes(search.toLowerCase()) || f.composition.toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const cartTotal = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
        
        {/* Top Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-xl w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name, composition (e.g., Urea, NPK, Organic...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 ring-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 bg-white"
            />
          </div>
          
          <button className="relative flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold shadow-md hover:bg-slate-800 transition-colors">
            <ShoppingCart size={18} />
            View Cart
            {cartTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
                {cartTotal}
              </span>
            )}
          </button>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-all ${
                activeCategory === cat 
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(f => {
            const inCart = cart[f.id] || 0;
            return (
              <div key={f.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
                {/* Product Image Area */}
                <div className="h-40 relative flex items-center justify-center" style={{ backgroundColor: `${f.color}15` }}>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${f.type === 'Organic' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {f.type}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {f.rating}
                  </div>
                  
                  {/* Icon Representation of Bag */}
                  <div className="w-20 h-24 rounded-lg flex flex-col items-center justify-center shadow-inner relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${f.color} 0%, ${f.color}dd 100%)` }}>
                    <div className="absolute top-0 w-full h-3 bg-white/20 border-b border-white/30 border-dashed" />
                    <Leaf size={28} className="text-white opacity-90 mb-1" />
                    <span className="text-white font-black text-sm tracking-tight">{f.weight}</span>
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{f.category}</div>
                  <h3 className="text-lg font-black text-gray-800 leading-tight mb-2">{f.name}</h3>
                  <div className="text-sm font-medium text-gray-600 mb-4 bg-gray-50 px-3 py-1.5 rounded-lg inline-block self-start">
                    {f.composition}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Price per bag</div>
                      <div className="text-xl font-black text-green-600">₹{f.price}</div>
                    </div>
                    
                    {inCart > 0 ? (
                      <div className="flex items-center gap-3 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
                        <button onClick={() => setCart(p => ({...p, [f.id]: Math.max(0, p[f.id] - 1)}))} className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-green-600 font-bold shadow-sm">-</button>
                        <span className="font-black text-green-700 w-4 text-center">{inCart}</span>
                        <button onClick={() => addToCart(f.id)} className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white font-bold shadow-sm">+</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => addToCart(f.id)}
                        className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm"
                      >
                        <Plus size={16} /> Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No fertilisers found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter.</p>
          </div>
        )}

      </div>
    </div>
  );
}
