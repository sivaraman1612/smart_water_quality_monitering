
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Droplet, Thermometer, Activity, Zap } from 'lucide-react';
import { WaterParameters } from '../types';

interface ManualEntryFormProps {
  currentParams: WaterParameters;
  onSave: (params: WaterParameters) => void;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ currentParams, onSave }) => {
  const [params, setParams] = useState<WaterParameters>(currentParams);

  // Sync state if external params change (e.g., source selection change)
  useEffect(() => {
    setParams(currentParams);
  }, [currentParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(params);
  };

  const inputClass = "w-full bg-white/50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all placeholder:text-slate-300";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-6 border-t border-slate-200 space-y-4"
    >
      <div className="flex items-center space-x-2 mb-2">
        <Activity className="w-4 h-4 text-sky-500" />
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Manual Data Entry</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="flex items-center text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <Droplet className="w-3 h-3 mr-1 text-sky-400" /> pH Value
            </label>
            <input 
              type="number" 
              step="0.1" 
              min="0" 
              max="14"
              value={params.ph}
              onChange={(e) => setParams({ ...params, ph: parseFloat(e.target.value) || 0 })}
              className={inputClass}
              placeholder="e.g. 7.2"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <Zap className="w-3 h-3 mr-1 text-emerald-400" /> Turbidity (NTU)
            </label>
            <input 
              type="number" 
              step="0.1"
              value={params.turbidity}
              onChange={(e) => setParams({ ...params, turbidity: parseFloat(e.target.value) || 0 })}
              className={inputClass}
              placeholder="e.g. 3.5"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <Activity className="w-3 h-3 mr-1 text-indigo-400" /> TDS (PPM)
            </label>
            <input 
              type="number"
              value={params.tds}
              onChange={(e) => setParams({ ...params, tds: parseInt(e.target.value) || 0 })}
              className={inputClass}
              placeholder="e.g. 180"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <Thermometer className="w-3 h-3 mr-1 text-orange-400" /> Temperature (°C)
            </label>
            <input 
              type="number" 
              step="0.1"
              value={params.temp}
              onChange={(e) => setParams({ ...params, temp: parseFloat(e.target.value) || 0 })}
              className={inputClass}
              placeholder="e.g. 28.5"
            />
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-slate-900 hover:bg-black text-white p-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Manual Record</span>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ManualEntryForm;
