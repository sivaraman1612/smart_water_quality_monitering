
import React from 'react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, onLanguageChange }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex space-x-2 bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-slate-200">
      {(['en', 'ta', 'hi'] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onLanguageChange(lang)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            currentLang === lang 
              ? 'bg-sky-600 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ்' : 'हिंदी'}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
