
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserRole, 
  Language, 
  SafetyLevel, 
  WaterParameters,
} from './types';
import { 
  TRANSLATIONS, 
  TAMIL_NADU_DISTRICTS, 
  WATER_SOURCES_BY_DISTRICT, 
  INITIAL_WATER_DATA 
} from './constants';
import LanguageSwitcher from './components/LanguageSwitcher';
import StatusCard from './components/StatusCard';
import WaterWaveCard from './components/WaterWaveCard';
import LoginPage from './components/LoginPage';
import RefreshData from './components/RefreshData';
import ManualEntryForm from './components/ManualEntryForm';
import BluetoothScanner from './components/BluetoothScanner';
import AddTankForm from './components/AddTankForm';
import MapPanel from './components/MapPanel';
import { getDiseasePrediction } from './services/geminiService';
import { 
  AlertCircle, 
  Map as MapIcon, 
  Activity, 
  Info,
  ChevronRight,
  ShieldCheck,
  Search,
  Waves,
  LogOut,
  Bluetooth
} from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Salem');
  const [selectedSource, setSelectedSource] = useState<string>('Mettur Dam');
  const [waterData, setWaterData] = useState<Record<string, any>>(INITIAL_WATER_DATA);
  const [prediction, setPrediction] = useState<any>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [iotDevice, setIotDevice] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  const currentWater = useMemo(() => waterData[selectedSource] || {
    ph: 7.0, temp: 25, turbidity: 0, tds: 100, lastUpdated: 'N/A', sourceType: 'MANUAL', location: { lat: 11.0, lng: 77.0 }
  }, [waterData, selectedSource]);

  const safetyLevel = useMemo(() => {
    const { ph, turbidity, tds } = currentWater;
    if (ph < 5 || ph > 9 || turbidity > 20 || tds > 1000) return SafetyLevel.CRITICAL;
    if (ph < 6.5 || ph > 8.5 || turbidity > 5 || tds > 500) return SafetyLevel.HIGH_RISK;
    if (turbidity > 2 || tds > 300) return SafetyLevel.LOW_RISK;
    return SafetyLevel.SAFE;
  }, [currentWater]);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoadingPrediction(true);
      const params: WaterParameters = {
        ph: currentWater.ph,
        temp: currentWater.temp,
        turbidity: currentWater.turbidity,
        tds: currentWater.tds
      };
      const res = await getDiseasePrediction(params, lang);
      setPrediction(res);
      setLoadingPrediction(false);
    };
    fetchPrediction();
  }, [currentWater, lang]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const refreshed = {
        ...currentWater,
        ph: Number((6.5 + Math.random() * 2).toFixed(1)),
        temp: Number((24 + Math.random() * 8).toFixed(1)),
        turbidity: Number((Math.random() * 10).toFixed(1)),
        tds: Math.floor(100 + Math.random() * 600),
        lastUpdated: new Date().toLocaleTimeString()
      };
      setWaterData(prev => ({ ...prev, [selectedSource]: refreshed }));
      setIsRefreshing(false);
    }, 1500);
  };

  const handleManualSave = (params: WaterParameters) => {
    const updated = {
      ...currentWater,
      ...params,
      lastUpdated: new Date().toLocaleTimeString()
    };
    setWaterData(prev => ({ ...prev, [selectedSource]: updated }));
  };

  const handleAddTank = (tank: any) => {
    const id = tank.name.replace(/\s+/g, '-');
    setWaterData(prev => ({
      ...prev,
      [tank.name]: {
        ...tank,
        id
      }
    }));
    setSelectedDistrict(tank.district);
    setSelectedSource(tank.name);
  };

  if (!role) {
    return (
      <>
        <div className="wave-bg">
          <div className="ocean">
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div>
        <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
        <LoginPage onLogin={setRole} lang={lang} />
      </>
    );
  }

  const mapTanks = Object.values(waterData).map((d: any) => ({
    name: d.name || 'Unknown Tank',
    lat: d.location?.lat || 11.0,
    lng: d.location?.lng || 77.0,
    status: safetyLevel // Simplified status for map markers
  }));

  return (
    <div className="min-h-screen pb-24 pt-32 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="wave-bg">
        <div className="ocean">
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      </div>
      
      <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 space-y-8 lg:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
             <div className="bg-sky-500/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-sky-500/20">
                <span className="text-sky-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  {role === 'SMART_USER' ? 'SMART USER' : 'STANDARD USER'} • TN WATER AUTHORITY
                </span>
             </div>
             {iotDevice && (
               <div className="bg-emerald-500/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-emerald-500/20 flex items-center space-x-2">
                 <Bluetooth className="w-3 h-3 text-emerald-600" />
                 <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                   {iotDevice} Connected
                 </span>
               </div>
             )}
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-700">Analytics</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setRole(null); setIotDevice(null); }} 
            className="flex items-center space-x-3 bg-white/80 hover:bg-white px-8 py-4 rounded-[1.5rem] shadow-xl border border-white transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-rose-50 transition-colors">
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500" />
            </div>
            <span className="font-extrabold text-slate-700">Logout</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sidebar (Selectors & Form) */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[3.5rem] border border-white shadow-xl space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Control Terminal</h3>
            
            <div className="space-y-4">
              <div className="bg-white/60 p-4 rounded-3xl border border-white shadow-sm flex items-center space-x-4">
                <Search className="w-5 h-5 text-sky-600" />
                <div className="flex-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Select District</label>
                  <select 
                    className="w-full bg-transparent border-none font-extrabold text-slate-800 outline-none cursor-pointer text-sm"
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      const sources = WATER_SOURCES_BY_DISTRICT[e.target.value] || [];
                      const firstSource = sources[0] || '';
                      if (firstSource) setSelectedSource(firstSource);
                    }}
                  >
                    {TAMIL_NADU_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-white/60 p-4 rounded-3xl border border-white shadow-sm flex items-center space-x-4">
                <Waves className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Select Source</label>
                  <select 
                    className="w-full bg-transparent border-none font-extrabold text-slate-800 outline-none cursor-pointer text-sm"
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                  >
                    {/* Dynamic sources based on state */}
                    {Object.values(waterData)
                      .filter((s: any) => s.district === selectedDistrict)
                      .map((s: any) => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <RefreshData onRefresh={handleRefresh} isRefreshing={isRefreshing} />

            {role === 'SMART_USER' && (
              <ManualEntryForm 
                currentParams={{
                  ph: currentWater.ph,
                  temp: currentWater.temp,
                  turbidity: currentWater.turbidity,
                  tds: currentWater.tds
                }} 
                onSave={handleManualSave} 
              />
            )}
          </div>

          {role === 'SMART_USER' && (
            <BluetoothScanner onDeviceConnect={setIotDevice} />
          )}

          {role === 'SMART_USER' && (
            <AddTankForm onAdd={handleAddTank} />
          )}

          <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[3.5rem] shadow-xl border border-slate-100">
             <div className="flex items-center space-x-4 mb-6">
                <MapIcon className="text-emerald-600 w-5 h-5" />
                <h2 className="text-lg font-black text-slate-800 tracking-tight">Active Tanks</h2>
             </div>
             <div className="space-y-3">
               {Object.values(waterData).slice(0, 3).map((tank: any, i: number) => (
                 <div key={i} className="p-4 bg-white/60 rounded-2xl border border-white shadow-sm flex items-center justify-between">
                   <div>
                     <p className="text-xs font-black text-slate-800">{tank.name}</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">{tank.district}</p>
                   </div>
                   <ChevronRight className="w-4 h-4 text-slate-300" />
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="lg:col-span-9 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
             {/* Gauge */}
             <div className="md:col-span-5 h-full">
               <StatusCard level={safetyLevel} t={t} timestamp={currentWater.lastUpdated} />
             </div>

             {/* Metric Cards (pH, Turbidity, TDS, Temp) */}
             <div className="md:col-span-7 grid grid-cols-2 gap-6 h-full items-stretch">
                <WaterWaveCard label={t.params.ph} value={currentWater.ph} unit="" min={6.5} max={8.5} color="#0ea5e9" />
                <WaterWaveCard label={t.params.turbidity} value={currentWater.turbidity} unit="NTU" min={0} max={5} color="#10b981" />
                <WaterWaveCard label={t.params.tds} value={currentWater.tds} unit="ppm" min={0} max={500} color="#6366f1" />
                <WaterWaveCard label={t.params.temp} value={currentWater.temp} unit="°C" min={15} max={35} color="#f59e0b" />
             </div>
          </div>

          {/* AI Risk Engine */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-2xl p-10 rounded-[3.5rem] shadow-2xl border border-white/80 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-4 md:space-y-0 relative z-10">
              <div className="flex items-center space-x-5">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-purple-200">
                  <Activity className="text-white w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.aiPrediction}</h2>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">GEMINI MULTIMODAL DIAGNOSTICS</p>
                </div>
              </div>
              
              <AnimatePresence>
                {prediction && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl border border-slate-700 flex items-center space-x-3 shadow-2xl"
                  >
                    <ShieldCheck className="w-5 h-5 text-sky-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Confidence: {prediction.confidence}%</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {loadingPrediction ? (
               <div className="flex flex-col items-center justify-center py-20 space-y-6">
                 <div className="relative">
                    <div className="w-20 h-20 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
                 </div>
                 <div className="text-center">
                    <p className="text-slate-800 font-black text-lg">Cross-Referencing Waterborne Pathogens...</p>
                 </div>
               </div>
            ) : prediction ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-rose-500" />
                    {t.possibleDiseases}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {prediction.diseases.map((d: string) => (
                      <motion.div 
                        key={d} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-rose-50 text-rose-700 px-6 py-4 rounded-[1.5rem] text-sm font-black shadow-sm border border-rose-100 flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span>{d}</span>
                      </motion.div>
                    ))}
                    {prediction.diseases.length === 0 && (
                      <div className="text-emerald-600 font-black bg-emerald-50 px-8 py-5 rounded-[2rem] border border-emerald-100 text-lg flex items-center space-x-3">
                        <ShieldCheck className="w-6 h-6" />
                        <span>Safe from identified waterborne pathogens.</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                    <Info className="w-4 h-4 mr-2 text-sky-500" />
                    {t.recommendations}
                  </h3>
                  <div className="bg-slate-900/5 p-8 rounded-[2.5rem] border border-slate-200 relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500" />
                    <p className="text-slate-700 font-bold leading-relaxed text-lg">
                      {prediction.recommendations}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>

          <MapPanel center={currentWater.location} tanks={mapTanks} />
        </div>
      </div>

      <footer className="mt-32">
        <div className="max-w-4xl mx-auto p-12 bg-white/30 backdrop-blur-xl rounded-[4rem] border border-white/40 text-center relative overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-sky-500/20 rounded-full" />
           <p className="text-slate-500 text-[10px] font-bold leading-relaxed max-w-2xl mx-auto uppercase tracking-wider opacity-60">
             {t.disclaimer}
           </p>
           <div className="mt-10 pt-10 border-t border-white/20 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">© 2025 SmartWater TN</span>
              <div className="h-1.5 w-1.5 rounded-full bg-sky-300" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Govt. Certified Dashboard</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
