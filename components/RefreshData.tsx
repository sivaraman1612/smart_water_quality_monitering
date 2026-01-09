
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';

interface RefreshDataProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const RefreshData: React.FC<RefreshDataProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onRefresh}
      disabled={isRefreshing}
      className={`w-full flex items-center justify-center space-x-3 px-6 py-5 rounded-[2rem] font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl border border-white/40 ${
        isRefreshing ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white/60 hover:bg-white text-sky-600'
      }`}
    >
      <RefreshCcw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
      <span>{isRefreshing ? 'Syncing...' : 'Refresh Live Data'}</span>
    </motion.button>
  );
};

export default RefreshData;
