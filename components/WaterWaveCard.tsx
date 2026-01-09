
import React from 'react';
import { motion } from 'framer-motion';

interface WaterWaveCardProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  color: string;
}

const WaterWaveCard: React.FC<WaterWaveCardProps> = ({ label, value, unit, min, max, color }) => {
  const percentage = Math.min(Math.max(((value - (min - 2)) / ((max + 2) - (min - 2))) * 100, 15), 85);
  const isOutOfRange = value < min || value > max;

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative overflow-hidden bg-white/60 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-xl border border-white/50 h-52 flex flex-col justify-between group cursor-default"
    >
      <div className="z-20 relative">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</h3>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className={`text-4xl font-extrabold transition-colors duration-500 ${isOutOfRange ? 'text-rose-500' : 'text-slate-800'}`}>
            {value}
          </span>
          <span className="text-slate-400 font-bold text-xs">{unit}</span>
        </div>
      </div>

      <div 
        className="absolute bottom-0 left-0 w-full transition-all duration-[2000ms] ease-out pointer-events-none" 
        style={{ height: `${percentage}%`, background: `linear-gradient(to top, ${color}20, ${color}05)` }}
      >
        <motion.div
          animate={{ x: [-200, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[400%] h-8 -mt-6 opacity-40"
          style={{ 
            backgroundImage: `url('https://raw.githubusercontent.com/yannick-cw/wave-animation/master/wave.svg')`,
            backgroundSize: '800px 32px',
            filter: `drop-shadow(0 2px 2px ${color}40)`
            // Fix: Removed 'tintColor' property which does not exist in React's MotionStyle
          }}
        />
        <motion.div
          animate={{ x: [0, -200] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[400%] h-8 -mt-4 opacity-20"
          style={{ 
            backgroundImage: `url('https://raw.githubusercontent.com/yannick-cw/wave-animation/master/wave.svg')`,
            backgroundSize: '600px 24px',
            filter: `drop-shadow(0 1px 1px ${color}20)`
          }}
        />
      </div>

      <div className="z-20 flex justify-between items-center">
        <div className="flex space-x-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <div className="flex flex-col">
            <span className="opacity-50">MIN</span>
            <span className="text-slate-500">{min}</span>
          </div>
          <div className="flex flex-col">
            <span className="opacity-50">MAX</span>
            <span className="text-slate-500">{max}</span>
          </div>
        </div>
        {isOutOfRange && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" 
          />
        )}
      </div>
    </motion.div>
  );
};

export default WaterWaveCard;
