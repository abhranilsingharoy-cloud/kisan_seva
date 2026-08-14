import React from 'react';
import { Leaf, Search } from 'lucide-react';

export default function DiseaseLibraryPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-12 max-w-[1400px] mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <Leaf className="w-10 h-10 text-[#2A854B]" />
            Crop Disease Library
          </h1>
          <p className="text-lg text-slate-600">
            A comprehensive, AI-curated database of agricultural diseases, pests, and treatments.
          </p>
        </div>

        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search for a crop, disease, or symptom..." 
            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A854B] focus:border-transparent text-slate-900"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Mock Disease Cards */}
          {[
            { crop: "Wheat", disease: "Yellow Rust", severity: "High", treatment: "Fungicide application within 48 hours." },
            { crop: "Cotton", disease: "Pink Bollworm", severity: "Critical", treatment: "Pheromone traps and bio-pesticides." },
            { crop: "Potato", disease: "Late Blight", severity: "Medium", treatment: "Copper-based fungicides and proper drainage." },
            { crop: "Rice", disease: "Stem Borer", severity: "High", treatment: "Systemic insecticides and field sanitation." }
          ].map((item, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-semibold text-[#2A854B] mb-1">{item.crop}</div>
                  <h3 className="text-xl font-bold text-slate-900">{item.disease}</h3>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.severity === 'Critical' || item.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {item.severity} Risk
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                <strong>Recommended Treatment:</strong> {item.treatment}
              </p>
              <button className="text-sm font-semibold text-sky-600 hover:text-sky-700">View Full Guide &rarr;</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
