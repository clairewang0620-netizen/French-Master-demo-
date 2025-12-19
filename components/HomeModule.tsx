
import React from 'react';
import { AppState, LanguageLevel } from '../types';

interface Props {
  state: AppState;
  onLevelChange: (level: LanguageLevel) => void;
}

const HomeModule: React.FC<Props> = ({ state, onLevelChange }) => {
  const levels = Object.values(LanguageLevel);

  return (
    <div className="p-8 animate-in fade-in slide-in-from-top duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Salut ! 🇫🇷</h1>
        <p className="text-slate-500 font-medium leading-relaxed">Continuez votre voyage vers la maîtrise du français.</p>
      </header>

      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white mb-10 shadow-2xl shadow-blue-200">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
        
        <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-6">NIVEAU ACTUEL</h3>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-7xl font-black tracking-tighter leading-none">{state.currentLevel}</span>
          <div className="text-right">
            <p className="text-[10px] font-black opacity-60 uppercase mb-1">Mots à renforcer</p>
            <p className="text-4xl font-black">{state.strengthenSet.length}</p>
          </div>
        </div>
      </div>

      <section className="mb-10">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Objectif</h3>
        <div className="grid grid-cols-5 gap-3">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => onLevelChange(lvl)}
              className={`py-4 rounded-2xl font-black transition-all active:scale-90 ${
                state.currentLevel === lvl
                  ? 'bg-slate-900 text-white shadow-xl scale-110'
                  : 'bg-white border border-slate-100 text-slate-400 hover:border-blue-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Activités rapides</h3>
        
        <div className="group bg-white border border-slate-100 p-6 rounded-[24px] flex items-center space-x-5 hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer">
          <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🎯</div>
          <div className="flex-1">
            <h4 className="font-black text-slate-800 text-lg">Dictée quotidienne</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Focus sur {state.strengthenSet.length} mots difficiles</p>
          </div>
          <div className="text-slate-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>

        <div className="group bg-white border border-slate-100 p-6 rounded-[24px] flex items-center space-x-5 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer">
          <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🎓</div>
          <div className="flex-1">
            <h4 className="font-black text-slate-800 text-lg">Examen Rapide</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Testez votre grammaire {state.currentLevel}</p>
          </div>
          <div className="text-slate-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeModule;
