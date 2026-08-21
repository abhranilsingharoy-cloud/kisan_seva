'use client';

import React, { useState } from 'react';
import { Sprout, Search, Info } from 'lucide-react';

// ── All 28 States + 8 UTs ────────────────────────────────────────────────────
const ALL_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli', 'Daman & Diu',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// ── All major crops ──────────────────────────────────────────────────────────
const ALL_CROPS = [
  // Cereals
  'Wheat', 'Rice (Paddy)', 'Maize', 'Jowar (Sorghum)', 'Bajra (Pearl Millet)',
  'Ragi (Finger Millet)', 'Barley',
  // Pulses
  'Chickpea (Chana)', 'Pigeon Pea (Arhar/Tur)', 'Lentil (Masoor)',
  'Mung Bean (Moong)', 'Black Gram (Urad)', 'Kidney Bean (Rajma)',
  // Oilseeds
  'Groundnut', 'Mustard', 'Soybean', 'Sunflower', 'Sesame (Til)',
  'Linseed', 'Castor',
  // Cash Crops
  'Cotton', 'Sugarcane', 'Jute', 'Tobacco',
  // Vegetables
  'Tomato', 'Onion', 'Potato', 'Brinjal (Eggplant)', 'Cabbage', 'Cauliflower',
  'Peas', 'Okra (Bhindi)', 'Bitter Gourd', 'Bottle Gourd', 'Pumpkin',
  'Chilli', 'Capsicum', 'Spinach', 'Fenugreek (Methi)',
  // Fruits
  'Mango', 'Banana', 'Papaya', 'Guava', 'Pomegranate', 'Grape',
  'Orange', 'Lemon', 'Apple', 'Pineapple', 'Watermelon',
  // Spices & Plantation
  'Turmeric', 'Ginger', 'Garlic', 'Coriander', 'Cumin',
  'Cardamom', 'Pepper', 'Coconut', 'Arecanut',
];

// ── All irrigation types ─────────────────────────────────────────────────────
const IRRIGATION_TYPES = [
  'Rainfed (No Irrigation)',
  'Canal Irrigation',
  'Borewell / Tubewell',
  'Drip Irrigation',
  'Sprinkler Irrigation',
  'Tank / Pond Irrigation',
  'River Lift Irrigation',
  'Check Dam / Farm Pond',
  'Flood Irrigation',
  'Micro-irrigation',
];

// ── Comprehensive seed database ───────────────────────────────────────────────
// Keyed by crop name, each has varieties with suitableIrrigation and suitableStates arrays
interface SeedVariety {
  id: string;
  crop: string;
  variety: string;
  yieldQPerAcre: string;
  durationDays: string;
  traits: string[];
  costPerAcre: number;
  source: string;
  season: string;
  suitableIrrigation: string[]; // keywords to match
  notSuitableStates?: string[]; // states where this isn't recommended
  suitableStates?: string[];    // if filled, only recommended here
  irrigationNote?: string;
}

const SEED_DB: SeedVariety[] = [
  // ── WHEAT ──────────────────────────────────────────────────────────────────
  { id: 'w1', crop: 'Wheat', variety: 'HD-3086 (Pusa Wheat)', yieldQPerAcre: '20-24', durationDays: '150-155', traits: ['High Yield', 'Rust Resistant', 'Good Bread Quality'], costPerAcre: 1800, source: 'ICAR-IARI', season: 'Rabi', suitableIrrigation: ['canal', 'borewell', 'tubewell', 'drip', 'sprinkler', 'flood', 'irrigation'] },
  { id: 'w2', crop: 'Wheat', variety: 'DBW-187 (Karunā)', yieldQPerAcre: '22-26', durationDays: '143-150', traits: ['Very High Yield', 'Lodging Resistant', 'Short Duration'], costPerAcre: 2000, source: 'ICAR-IIWR', season: 'Rabi', suitableIrrigation: ['canal', 'borewell', 'tubewell', 'drip', 'sprinkler', 'flood', 'irrigation'] },
  { id: 'w3', crop: 'Wheat', variety: 'GW-496 (Gujarat)', yieldQPerAcre: '18-22', durationDays: '110-115', traits: ['Early Maturity', 'Heat Tolerant', 'Drought Tolerant'], costPerAcre: 1500, source: 'Gujarat AU', season: 'Rabi', suitableIrrigation: ['rainfed', 'canal', 'borewell', 'tubewell', 'river', 'tank'] },
  { id: 'w4', crop: 'Wheat', variety: 'HD-2781 (Shreshtha)', yieldQPerAcre: '18-20', durationDays: '145-150', traits: ['Rust Resistant', 'Good for Peninsular India'], costPerAcre: 1600, source: 'ICAR-IARI', season: 'Rabi', suitableIrrigation: ['rainfed', 'canal', 'borewell'], suitableStates: ['Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Madhya Pradesh', 'Chhattisgarh'] },
  { id: 'w5', crop: 'Wheat', variety: 'K-307 (Malviya)', yieldQPerAcre: '16-20', durationDays: '130-140', traits: ['Rainfed Adapted', 'Drought Tolerant', 'Late Sowing'], costPerAcre: 1400, source: 'BHU Varanasi', season: 'Rabi', suitableIrrigation: ['rainfed', 'canal', 'tank', 'check dam'], suitableStates: ['Uttar Pradesh', 'Bihar', 'Jharkhand', 'West Bengal'] },
  { id: 'w6', crop: 'Wheat', variety: 'PBW-752 (Punjab)', yieldQPerAcre: '22-24', durationDays: '155-160', traits: ['High Yield', 'Late Sown', 'Pest Resistant'], costPerAcre: 1900, source: 'PAU Ludhiana', season: 'Rabi', suitableIrrigation: ['canal', 'borewell', 'tubewell', 'flood', 'sprinkler'], suitableStates: ['Punjab', 'Haryana', 'Delhi', 'Chandigarh'] },

  // ── RICE ───────────────────────────────────────────────────────────────────
  { id: 'r1', crop: 'Rice (Paddy)', variety: 'Swarna (MTU-7029)', yieldQPerAcre: '25-30', durationDays: '145-150', traits: ['Water Logging Tolerant', 'High Yield', 'Popular Variety'], costPerAcre: 1200, source: 'AICIP', season: 'Kharif', suitableIrrigation: ['canal', 'flood', 'river', 'borewell', 'tank', 'rain'] },
  { id: 'r2', crop: 'Rice (Paddy)', variety: 'Pusa Basmati 1121', yieldQPerAcre: '16-20', durationDays: '135-145', traits: ['Long Grain', 'Premium Aroma', 'Export Quality'], costPerAcre: 2500, source: 'ICAR-IARI', season: 'Kharif', suitableIrrigation: ['canal', 'borewell', 'drip', 'sprinkler', 'flood'] },
  { id: 'r3', crop: 'Rice (Paddy)', variety: 'DRR Dhan-44', yieldQPerAcre: '28-32', durationDays: '125-130', traits: ['Early Maturity', 'High Yield', 'Drought Tolerant'], costPerAcre: 1400, source: 'ICAR-IIRR', season: 'Kharif', suitableIrrigation: ['rainfed', 'canal', 'tank', 'river'] },
  { id: 'r4', crop: 'Rice (Paddy)', variety: 'Sahbhagi Dhan', yieldQPerAcre: '12-18', durationDays: '105-115', traits: ['Drought Tolerant', 'Rainfed Suitable', 'Low Input'], costPerAcre: 1000, source: 'ICAR-IIRR', season: 'Kharif', suitableIrrigation: ['rainfed', 'tank', 'check dam', 'rain'] },
  { id: 'r5', crop: 'Rice (Paddy)', variety: 'BPT-5204 (Samba Mahsuri)', yieldQPerAcre: '20-24', durationDays: '155-165', traits: ['Excellent Cooking Quality', 'Soft Texture', 'Popular South India'], costPerAcre: 1800, source: 'ANGRAU', season: 'Kharif', suitableIrrigation: ['canal', 'river', 'borewell', 'tank', 'flood'] },
  { id: 'r6', crop: 'Rice (Paddy)', variety: 'PR-126 (Punjab)', yieldQPerAcre: '22-26', durationDays: '123-128', traits: ['Short Duration', 'Water Saving', 'Direct Seeding'], costPerAcre: 1500, source: 'PAU Ludhiana', season: 'Kharif', suitableIrrigation: ['canal', 'borewell', 'drip', 'sprinkler', 'micro'] },

  // ── MAIZE ──────────────────────────────────────────────────────────────────
  { id: 'm1', crop: 'Maize', variety: 'DHM-117 (Rakshak)', yieldQPerAcre: '28-35', durationDays: '95-100', traits: ['High Yield', 'Lodging Resistant', 'Downy Mildew Resistant'], costPerAcre: 2200, source: 'ICAR-IIMR', season: 'Kharif', suitableIrrigation: ['canal', 'borewell', 'drip', 'sprinkler', 'rain', 'river'] },
  { id: 'm2', crop: 'Maize', variety: 'Vivek QPM-9', yieldQPerAcre: '20-26', durationDays: '85-90', traits: ['High Protein', 'Early Maturing', 'Hilly Areas'], costPerAcre: 2000, source: 'VPKAS Almora', season: 'Kharif', suitableIrrigation: ['rainfed', 'rain', 'canal', 'sprinkler'] },
  { id: 'm3', crop: 'Maize', variety: 'HQPM-1', yieldQPerAcre: '24-30', durationDays: '90-95', traits: ['Quality Protein', 'High Lysine', 'Good for Poultry Feed'], costPerAcre: 2400, source: 'ICAR', season: 'Kharif', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell', 'flood'] },

  // ── COTTON ─────────────────────────────────────────────────────────────────
  { id: 'c1', crop: 'Cotton', variety: 'Bunny Bt (BGII)', yieldQPerAcre: '10-14', durationDays: '160-175', traits: ['Bollworm Resistant', 'High Yield', 'Good Fibre Quality'], costPerAcre: 3500, source: 'Nuziveedu Seeds', season: 'Kharif', suitableIrrigation: ['canal', 'drip', 'borewell', 'flood', 'micro'] },
  { id: 'c2', crop: 'Cotton', variety: 'RCH-2 BGII', yieldQPerAcre: '9-13', durationDays: '155-165', traits: ['Early Maturity', 'Medium Staple', 'Widely Adapted'], costPerAcre: 3200, source: 'Rasi Seeds', season: 'Kharif', suitableIrrigation: ['rainfed', 'canal', 'borewell', 'flood'] },
  { id: 'c3', crop: 'Cotton', variety: 'LD-230 (Desi)', yieldQPerAcre: '6-9', durationDays: '170-185', traits: ['Drought Tolerant', 'Desi Variety', 'No BT Fee'], costPerAcre: 1200, source: 'Punjab AU', season: 'Kharif', suitableIrrigation: ['rainfed', 'canal', 'tank', 'check dam'] },

  // ── SOYBEAN ────────────────────────────────────────────────────────────────
  { id: 'sb1', crop: 'Soybean', variety: 'JS-335', yieldQPerAcre: '10-14', durationDays: '95-100', traits: ['High Yield', 'Lodging Resistant', 'Widely Adapted'], costPerAcre: 2200, source: 'JNKVV', season: 'Kharif', suitableIrrigation: ['rainfed', 'canal', 'borewell', 'sprinkler', 'rain'] },
  { id: 'sb2', crop: 'Soybean', variety: 'NRC-7', yieldQPerAcre: '10-12', durationDays: '90-95', traits: ['Early Maturing', 'Drought Tolerant', 'MYMV Resistant'], costPerAcre: 2000, source: 'ICAR-IISR', season: 'Kharif', suitableIrrigation: ['rainfed', 'drip', 'sprinkler', 'rain'] },

  // ── GROUNDNUT ──────────────────────────────────────────────────────────────
  { id: 'gn1', crop: 'Groundnut', variety: 'GG-20', yieldQPerAcre: '12-15', durationDays: '110-115', traits: ['High Oil Content', 'Medium Bold', 'Drought Tolerant'], costPerAcre: 3800, source: 'Gujarat AU', season: 'Kharif', suitableIrrigation: ['rainfed', 'canal', 'borewell', 'drip', 'sprinkler'] },
  { id: 'gn2', crop: 'Groundnut', variety: 'TAG-24', yieldQPerAcre: '10-13', durationDays: '105-110', traits: ['Early Maturity', 'Rainfed Suitable', 'Drought Tolerant'], costPerAcre: 3200, source: 'TNAU', season: 'Kharif', suitableIrrigation: ['rainfed', 'canal', 'tank', 'rain'] },

  // ── MUSTARD ────────────────────────────────────────────────────────────────
  { id: 'mu1', crop: 'Mustard', variety: 'Pusa Bold (T-59)', yieldQPerAcre: '8-10', durationDays: '115-125', traits: ['High Oil', 'Widely Adapted', 'Aphid Tolerant'], costPerAcre: 1600, source: 'ICAR-IARI', season: 'Rabi', suitableIrrigation: ['rainfed', 'canal', 'borewell', 'flood', 'sprinkler'] },
  { id: 'mu2', crop: 'Mustard', variety: 'NRCHB-506', yieldQPerAcre: '9-12', durationDays: '120-130', traits: ['Very High Yield', 'High Erucic Free', 'Alternaria Resistant'], costPerAcre: 1800, source: 'NRRI Bharatpur', season: 'Rabi', suitableIrrigation: ['canal', 'borewell', 'drip', 'sprinkler', 'flood'] },

  // ── CHICKPEA ───────────────────────────────────────────────────────────────
  { id: 'cp1', crop: 'Chickpea (Chana)', variety: 'JG-14 (Jawaharlal)', yieldQPerAcre: '6-9', durationDays: '95-100', traits: ['Early Maturity', 'Wilt Resistant', 'Rainfed Suitable'], costPerAcre: 2800, source: 'JNKVV', season: 'Rabi', suitableIrrigation: ['rainfed', 'canal', 'borewell', 'rain', 'check dam'] },
  { id: 'cp2', crop: 'Chickpea (Chana)', variety: 'Pusa 372', yieldQPerAcre: '7-10', durationDays: '105-115', traits: ['High Yield', 'Drought Tolerant', 'Good Seed Size'], costPerAcre: 2600, source: 'ICAR-IARI', season: 'Rabi', suitableIrrigation: ['rainfed', 'canal', 'borewell', 'flood', 'river'] },

  // ── TOMATO ─────────────────────────────────────────────────────────────────
  { id: 't1', crop: 'Tomato', variety: 'Arka Vikas', yieldQPerAcre: '140-160', durationDays: '110-120', traits: ['Drought Tolerant', 'Good Shelf Life', 'High Lycopene'], costPerAcre: 4500, source: 'ICAR-IIHR', season: 'Kharif/Rabi', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell', 'micro'] },
  { id: 't2', crop: 'Tomato', variety: 'Pusa Ruby', yieldQPerAcre: '120-140', durationDays: '100-110', traits: ['Round Fruit', 'Good for Processing', 'Widely Adapted'], costPerAcre: 4000, source: 'ICAR-IARI', season: 'Kharif/Rabi', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell', 'river'] },
  { id: 't3', crop: 'Tomato', variety: 'Heemsohna (H-86)', yieldQPerAcre: '100-120', durationDays: '90-100', traits: ['Cold Tolerant', 'Hilly Areas', 'Firm Fruit'], costPerAcre: 5000, source: 'PAU Ludhiana', season: 'Summer', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell'] },

  // ── ONION ──────────────────────────────────────────────────────────────────
  { id: 'on1', crop: 'Onion', variety: 'Agrifound Dark Red', yieldQPerAcre: '100-120', durationDays: '110-120', traits: ['Dark Red Bulb', 'Good Storage', 'High Yield'], costPerAcre: 6000, source: 'NHRDF', season: 'Rabi', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell', 'flood'] },
  { id: 'on2', crop: 'Onion', variety: 'Nasik Red (N-2-4-1)', yieldQPerAcre: '90-110', durationDays: '115-125', traits: ['Export Quality', 'Pungent', 'Long Storage'], costPerAcre: 5500, source: 'DOGR Nasik', season: 'Rabi', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell', 'river'] },

  // ── POTATO ─────────────────────────────────────────────────────────────────
  { id: 'po1', crop: 'Potato', variety: 'Kufri Jyoti', yieldQPerAcre: '60-80', durationDays: '80-90', traits: ['High Yield', 'Late Blight Tolerant', 'Good Table Quality'], costPerAcre: 12000, source: 'ICAR-CPRI', season: 'Rabi', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell', 'flood', 'river'] },
  { id: 'po2', crop: 'Potato', variety: 'Kufri Bahar', yieldQPerAcre: '70-90', durationDays: '90-100', traits: ['High Yield', 'Chips Quality', 'Early Maturity'], costPerAcre: 13000, source: 'ICAR-CPRI', season: 'Rabi', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell', 'micro'] },

  // ── SUGARCANE ──────────────────────────────────────────────────────────────
  { id: 'sc1', crop: 'Sugarcane', variety: 'Co-238', yieldQPerAcre: '350-400', durationDays: '360-365', traits: ['High Sugar Recovery', 'Drought Tolerant', 'Widely Adapted'], costPerAcre: 8000, source: 'ICAR-IISR', season: 'Annual', suitableIrrigation: ['canal', 'drip', 'flood', 'borewell', 'river', 'micro'] },
  { id: 'sc2', crop: 'Sugarcane', variety: 'CoJ-64 (Punjab)', yieldQPerAcre: '320-380', durationDays: '360-365', traits: ['Cold Tolerant', 'High Yield', 'Early Season'], costPerAcre: 7500, source: 'PAU Ludhiana', season: 'Annual', suitableIrrigation: ['canal', 'flood', 'drip', 'borewell', 'river'] },

  // ── TURMERIC ───────────────────────────────────────────────────────────────
  { id: 'tu1', crop: 'Turmeric', variety: 'Pragati', yieldQPerAcre: '60-75', durationDays: '210-225', traits: ['High Curcumin', 'High Yield', 'Rhizome Rot Tolerant'], costPerAcre: 18000, source: 'ICAR-IISR', season: 'Kharif', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell', 'rain', 'micro'] },

  // ── CHILLI ─────────────────────────────────────────────────────────────────
  { id: 'ch1', crop: 'Chilli', variety: 'Pusa Jwala', yieldQPerAcre: '15-20', durationDays: '130-145', traits: ['Very Pungent', 'Red Ripe Fruit', 'Widely Adapted'], costPerAcre: 5000, source: 'ICAR-IARI', season: 'Kharif/Rabi', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell', 'micro'] },
  { id: 'ch2', crop: 'Chilli', variety: 'Bydagi Kaddi', yieldQPerAcre: '18-22', durationDays: '140-150', traits: ['Colour Grade', 'Low Pungency', 'Export Quality'], costPerAcre: 5500, source: 'UAS Dharwad', season: 'Kharif', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell'] },

  // ── PIGEON PEA ─────────────────────────────────────────────────────────────
  { id: 'pp1', crop: 'Pigeon Pea (Arhar/Tur)', variety: 'ICPH-2671 (ICRISAT)', yieldQPerAcre: '8-12', durationDays: '120-130', traits: ['Hybrid', 'High Yield', 'Sterility Mosaic Resistant'], costPerAcre: 3500, source: 'ICRISAT', season: 'Kharif', suitableIrrigation: ['rainfed', 'canal', 'borewell', 'rain', 'check dam'] },
  { id: 'pp2', crop: 'Pigeon Pea (Arhar/Tur)', variety: 'Asha (ICPL-87119)', yieldQPerAcre: '7-10', durationDays: '180-200', traits: ['Wilt Resistant', 'Long Duration', 'Stable Yield'], costPerAcre: 2800, source: 'ICRISAT', season: 'Kharif', suitableIrrigation: ['rainfed', 'canal', 'borewell', 'tank', 'rain'] },

  // ── MUNG BEAN ──────────────────────────────────────────────────────────────
  { id: 'mb1', crop: 'Mung Bean (Moong)', variety: 'ML-818', yieldQPerAcre: '5-7', durationDays: '60-65', traits: ['Early Maturity', 'Summer/Spring', 'High Yield'], costPerAcre: 2500, source: 'PAU Ludhiana', season: 'Zaid', suitableIrrigation: ['canal', 'borewell', 'drip', 'flood', 'river'] },

  // ── SUNFLOWER ──────────────────────────────────────────────────────────────
  { id: 'sf1', crop: 'Sunflower', variety: 'KBSH-44', yieldQPerAcre: '6-8', durationDays: '90-95', traits: ['High Oil', 'Hybrid', 'Drought Tolerant'], costPerAcre: 3000, source: 'UAS Dharwad', season: 'Rabi/Kharif', suitableIrrigation: ['drip', 'sprinkler', 'canal', 'borewell', 'rainfed'] },

  // ── BAJRA ──────────────────────────────────────────────────────────────────
  { id: 'ba1', crop: 'Bajra (Pearl Millet)', variety: 'HHB-67 (Improved)', yieldQPerAcre: '8-12', durationDays: '60-65', traits: ['Downy Mildew Resistant', 'Drought Tolerant', 'High Yield'], costPerAcre: 1800, source: 'CCSHAU', season: 'Kharif', suitableIrrigation: ['rainfed', 'canal', 'borewell', 'check dam', 'rain'] },
  { id: 'ba2', crop: 'Bajra (Pearl Millet)', variety: 'Pusa Composite 612', yieldQPerAcre: '7-10', durationDays: '75-80', traits: ['Open Pollinated', 'Farmer Friendly', 'Low Cost'], costPerAcre: 1200, source: 'ICAR-IARI', season: 'Kharif', suitableIrrigation: ['rainfed', 'canal', 'tank', 'rain', 'check dam'] },

  // ── JOWAR ──────────────────────────────────────────────────────────────────
  { id: 'jo1', crop: 'Jowar (Sorghum)', variety: 'CSH-16 R', yieldQPerAcre: '10-14', durationDays: '110-115', traits: ['Dual Purpose', 'Drought Resistant', 'Sweet Stalk'], costPerAcre: 1500, source: 'ICAR-ICRISAT', season: 'Kharif', suitableIrrigation: ['rainfed', 'canal', 'borewell', 'check dam', 'rain'] },
];

// ── Filter logic ──────────────────────────────────────────────────────────────
function scoreVariety(seed: SeedVariety, irrigation: string): number {
  const irr = irrigation.toLowerCase();
  let score = 0;
  for (const key of seed.suitableIrrigation) {
    if (irr.includes(key) || key.includes(irr.split(' ')[0])) {
      score += 2;
    }
  }
  return score;
}

function getRecommendations(crop: string, state: string, irrigation: string): SeedVariety[] {
  const matches = SEED_DB
    .filter(s => s.crop === crop)
    .filter(s => {
      if (s.suitableStates && s.suitableStates.length > 0) {
        return s.suitableStates.includes(state);
      }
      if (s.notSuitableStates && s.notSuitableStates.includes(state)) {
        return false;
      }
      return true;
    })
    .map(s => ({ ...s, _score: scoreVariety(s, irrigation) }))
    .sort((a, b) => (b as any)._score - (a as any)._score);

  return matches.length > 0 ? matches : SEED_DB.filter(s => s.crop === crop);
}

const TRAIT_COLORS: Record<string, string> = {
  'High Yield': '#166534',
  'Very High Yield': '#14532d',
  'Drought Tolerant': '#92400e',
  'Rainfed': '#78350f',
  'Rainfed Suitable': '#78350f',
  'Rust Resistant': '#1e3a5f',
  'Wilt Resistant': '#1e3a5f',
  'Early Maturity': '#5b21b6',
  'Export Quality': '#9f1239',
  'High Oil': '#b45309',
};
function traitColor(t: string) {
  return TRAIT_COLORS[t] ?? '#1d4ed8';
}

// ─────────────────────────────────────────────────────────────────────────────
export default function SeedsPage() {
  const [state, setState] = useState('');
  const [crop, setCrop] = useState('');
  const [irrigation, setIrrigation] = useState('');
  const [results, setResults] = useState<SeedVariety[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !crop || !irrigation) return;
    const recs = getRecommendations(crop, state, irrigation);
    setResults(recs);
    setSearched(true);
  };

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    borderRadius: 10, border: '1px solid #d1d5db',
    fontSize: '0.95rem', outline: 'none',
    background: '#fff', color: '#111827',
    appearance: 'auto',
  };

  return (
    <div style={{ background: '#f0f4f0', minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '28px 24px 20px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2d6a27', marginBottom: 4 }}>
            <Sprout size={20} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              All India Seed Database
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
            Seed & Variety Recommender
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0 }}>
            Select your state, crop and irrigation source — we'll show the best-matched varieties from ICAR, state universities & ICRISAT.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        {/* Filter Form */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '24px', marginBottom: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <form onSubmit={handleSearch}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 20 }}>
              {/* State */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  State / UT
                </label>
                <select value={state} onChange={e => setState(e.target.value)} style={selectStyle} required>
                  <option value="">Select State…</option>
                  {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Crop */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  Crop Type
                </label>
                <select value={crop} onChange={e => setCrop(e.target.value)} style={selectStyle} required>
                  <option value="">Select Crop…</option>
                  {ALL_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Irrigation */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  Irrigation Source
                </label>
                <select value={irrigation} onChange={e => setIrrigation(e.target.value)} style={selectStyle} required>
                  <option value="">Select Irrigation…</option>
                  {IRRIGATION_TYPES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!state || !crop || !irrigation}
              style={{
                width: '100%', padding: '14px', background: (!state || !crop || !irrigation) ? '#9ca3af' : '#2d6a27',
                color: '#fff', border: 'none', borderRadius: 10,
                fontWeight: 700, fontSize: '1rem', cursor: (!state || !crop || !irrigation) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'background 0.2s'
              }}
            >
              <Search size={20} /> Find Best Seed Varieties
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: 16 }}>
              {results.length > 0
                ? `${results.length} varieties recommended for ${crop} in ${state}`
                : `No varieties found for ${crop} in our database yet`}
            </h2>

            {results.length === 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '40px 24px', textAlign: 'center' }}>
                <Sprout size={48} style={{ color: '#d1d5db', margin: '0 auto 16px', display: 'block' }} />
                <p style={{ color: '#6b7280' }}>
                  We don't have specific varieties for this crop yet. Please consult your local <strong>KVK (Krishi Vigyan Kendra)</strong> or state agriculture department.
                </p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {results.map((seed, idx) => (
                <div
                  key={seed.id}
                  style={{
                    background: '#fff', borderRadius: 16, overflow: 'hidden',
                    border: `2px solid ${idx === 0 ? '#16a34a' : '#e5e7eb'}`,
                    boxShadow: idx === 0 ? '0 4px 20px rgba(22,163,74,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                    position: 'relative',
                  }}
                >
                  {idx === 0 && (
                    <div style={{ background: '#16a34a', color: '#fff', padding: '5px 14px', fontSize: '0.72rem', fontWeight: 800, position: 'absolute', top: 0, right: 0, borderBottomLeftRadius: 12, letterSpacing: '0.05em' }}>
                      BEST MATCH
                    </div>
                  )}
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, background: idx === 0 ? '#dcfce7' : '#f3f4f6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: idx === 0 ? '#166534' : '#6b7280', flexShrink: 0 }}>
                        <Sprout size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 3px', fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>{seed.variety}</h3>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 }}>
                          {seed.source} · {seed.season}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                      <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: 8 }}>
                        <div style={{ fontSize: '0.68rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Expected Yield</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>{seed.yieldQPerAcre} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#6b7280' }}>q/acre</span></div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: 8 }}>
                        <div style={{ fontSize: '0.68rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Duration</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>{seed.durationDays} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#6b7280' }}>days</span></div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {seed.traits.map(t => (
                        <span key={t} style={{
                          display: 'inline-block',
                          background: traitColor(t) + '18',
                          color: traitColor(t),
                          padding: '3px 9px', borderRadius: 6,
                          fontSize: '0.72rem', fontWeight: 700,
                        }}>{t}</span>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 14 }}>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, marginBottom: 2 }}>ESTIMATED SEED COST</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                        ₹{seed.costPerAcre.toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>/acre</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info note */}
            <div style={{ marginTop: 24, background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 12, padding: '14px 20px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Info size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e', lineHeight: 1.5 }}>
                Variety recommendations are based on ICAR, state agriculture university, and ICRISAT data. Actual yield depends on local soil, climate, and farm management. Consult your nearest <strong>KVK</strong> for seed availability and certified sources.
              </p>
            </div>
          </>
        )}

        {/* Idle state */}
        {!searched && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Sprout size={36} style={{ color: '#2d6a27' }} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: 10 }}>
              Select Your Crop & Location
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 440, margin: '0 auto' }}>
              Choose your state, crop type, and irrigation source above. We'll match the best government-recommended seed varieties suited to your conditions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
