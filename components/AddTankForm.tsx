
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Droplet, Send } from 'lucide-react';
import { WaterSource } from '../types';

interface AddTankFormProps {
  onAdd: (tank: Partial<WaterSource>) => void;
}

const AddTankForm: React.FC<AddTankFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Salem');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd({
      name,
      district,
      lastUpdated: new Date().toLocaleTimeString(),
      sourceType: 'MANUAL',
      params: { ph: 7.0, temp: 25, turbidity: 0, tds: 100 },
      location: { lat: 11.0, lng: 77.0 } // Mock location
    });
    setName('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl space-y-4"
    >
      <div className="flex items-center space-x-2">
        <Plus className="w-4 h-4 text-sky-500" />
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Register New Tank</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            placeholder="Tank Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sm text-slate-800"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sm text-slate-800"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-sky-100 flex items-center justify-center space-x-2 transition-all"
        >
          <Send className="w-3 h-3" />
          <span>Add Source</span>
        </button>
      </form>
    </motion.div>
  );
};

export default AddTankForm;
