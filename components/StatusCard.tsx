
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SafetyLevel, TranslationSchema } from '../types';

interface StatusCardProps {
  level: SafetyLevel;
  t: TranslationSchema;
  timestamp: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ level, t, timestamp }) => {
  const getStatusConfig = () => {
    switch (level) {
      case SafetyLevel.SAFE:
        return { 
          color: 'from-emerald-400 to-teal-500', 
          shadow: 'shadow-emerald-200', 
          text: t.safe, 
          accent: '#10b981',
          bg: 'bg-emerald-50'
        };
      case SafetyLevel.LOW_RISK:
        return { 
          color: 'from-amber-400 to-orange-500', 
          shadow: 'shadow-amber-200', 
          text: t.lowRisk, 
          accent: '#f59e0b',
          bg: 'bg-amber-50'
        };
      case SafetyLevel.HIGH_RISK:
        return { 
          color: 'from-rose-500 to-red-600', 
          shadow: 'shadow-rose-200', 
          text: t.highRisk, 
          accent: '#f43f5e',
          bg: 'bg-rose-50'
        };
      case SafetyLevel.CRITICAL:
        return { 
          color: 'from-slate-800 to-slate-900', 
          shadow: 'shadow-slate-300', 
          text: t.critical, 
          accent: '#1e293b',
          bg: 'bg-slate-100'
        };
      default:
        return { 
          color: 'from-sky-400 to-sky-500', 
          shadow: 'shadow-sky-100', 
          text: 'UNKNOWN', 
          accent: '#0ea5e9',
          bg: 'bg-sky-50'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-white/80 flex flex-col items-center text-center relative overflow-hidden group h-full justify-between">
      {/* Dynamic Background Fluid */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 blur-3xl ${config.bg}`}
      />
      
      <div className="z-10 w-full">
        <h2 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">{t.safetyStatus}</h2>
        
        <div className="relative mb-10 inline-block">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`absolute inset-0 rounded-full blur-3xl bg-gradient-to-tr ${config.color}`}
          />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative w-48 h-48 rounded-full flex items-center justify-center p-1 bg-white shadow-2xl`}
          >
            <div className={`w-full h-full rounded-full bg-gradient-to-br ${config.color} flex flex-col items-center justify-center text-white shadow-inner`}>
               <motion.div
                 animate={{ y: [0, -5, 0] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               >
                 <span className="text-sm font-black tracking-[0.25em] uppercase drop-shadow-md">
                   {config.text}
                 </span>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="z-10 w-full">
        <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs font-bold mb-1">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse`} style={{ backgroundColor: config.accent }} />
          <span>{t.lastUpdated}</span>
        </div>
        <p className="text-slate-800 text-lg font-black tracking-tight">{timestamp}</p>
      </div>
    </div>
  );
};

export default StatusCard;
