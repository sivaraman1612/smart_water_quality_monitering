
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Droplets, ShieldCheck, User, ArrowRight, Lock, Mail, UserPlus } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  lang: Language;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, lang }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const t = TRANSLATIONS[lang];

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter your credentials');
      return;
    }
    if (isRegistering && !formData.name) {
      setError('Name is required for registration');
      return;
    }

    // Unified login logic: allows any email/password for both roles
    if (!isRegistering) {
      // In a real app, you'd verify against a database here.
      // For this implementation, we just proceed with the selected role.
      if (selectedRole) {
        onLogin(selectedRole);
      }
    } else {
      // Mock account creation success
      setIsRegistering(false);
      setError('');
      alert('Account created successfully! You can now log in.');
    }
  };

  const resetState = () => {
    setSelectedRole(null);
    setIsRegistering(false);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!selectedRole ? (
          <motion.div
            key="role-selection"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            className="bg-white/40 backdrop-blur-3xl p-12 rounded-[4rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white/60 max-w-xl w-full text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400" />
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-br from-sky-400 to-blue-600 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-sky-200"
            >
              <Droplets className="text-white w-12 h-12" />
            </motion.div>
            
            <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tighter leading-tight">{t.title}</h1>
            <p className="text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed mb-10">{t.subtitle}</p>
            
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.loginAs}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button 
                  onClick={() => setSelectedRole('SMART_USER')}
                  className="group relative bg-white/60 hover:bg-white p-8 rounded-[2.5rem] border border-white shadow-lg transition-all duration-500 flex flex-col items-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ShieldCheck className="w-8 h-8 text-sky-500 mb-4 relative z-10 transition-transform group-hover:rotate-12" />
                  <span className="font-extrabold text-slate-800 relative z-10 uppercase tracking-wider text-sm">Smart User</span>
                </button>
                <button 
                  onClick={() => setSelectedRole('STANDARD_USER')}
                  className="group relative bg-white/60 hover:bg-white p-8 rounded-[2.5rem] border border-white shadow-lg transition-all duration-500 flex flex-col items-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <User className="w-8 h-8 text-blue-500 mb-4 relative z-10 transition-transform group-hover:scale-110" />
                  <span className="font-extrabold text-slate-800 relative z-10 uppercase tracking-wider text-sm">Standard User</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/40 backdrop-blur-3xl p-12 rounded-[4rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white/60 max-w-md w-full relative overflow-hidden"
          >
            <button 
              onClick={resetState}
              className="absolute top-8 left-8 text-slate-400 hover:text-sky-600 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              ← Back
            </button>

            <div className="text-center mt-4 mb-8">
              <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${selectedRole === 'SMART_USER' ? 'bg-sky-100 text-sky-600' : 'bg-blue-100 text-blue-600'}`}>
                {selectedRole === 'SMART_USER' ? <ShieldCheck className="w-8 h-8" /> : <User className="w-8 h-8" />}
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {isRegistering ? 'New Account' : 'Welcome Back'}
              </h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                {selectedRole === 'SMART_USER' ? 'Smart Portal' : 'Standard Portal'}
              </p>
            </div>

            <form onSubmit={handleAction} className="space-y-4">
              {isRegistering && (
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none transition-all font-bold text-slate-800"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="Email ID" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-6 py-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none transition-all font-bold text-slate-800"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-6 py-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none transition-all font-bold text-slate-800"
                />
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-xs font-bold text-center">
                  {error}
                </motion.p>
              )}

              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-black text-white p-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center space-x-2 group"
              >
                <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center space-y-3">
              <button 
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                className="text-xs font-black text-sky-600 hover:text-sky-700 uppercase tracking-[0.1em] transition-colors"
              >
                {isRegistering ? 'Back to Login' : "Don't have an account? Create one"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
