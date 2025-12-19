
import React from 'react';
import { AppTab } from '../types';

interface NavigationProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: AppTab.Home, icon: '🏠', label: 'Home' },
    { id: AppTab.Vocabulary, icon: '📚', label: 'Vocab' },
    { id: AppTab.DailySentences, icon: '💬', label: 'Daily' },
    { id: AppTab.Grammar, icon: '⚖️', label: 'Gram' },
    { id: AppTab.Reading, icon: '📖', label: 'Read' },
    { id: AppTab.Dictation, icon: '✍️', label: 'Dict' },
    { id: AppTab.Exam, icon: '🎓', label: 'Exam' },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[32px] px-3 py-2 flex justify-between items-center z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`relative flex flex-col items-center py-2 px-1 flex-1 transition-all duration-300 ${
            currentTab === item.id ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <span className={`text-xl mb-1 transition-transform ${currentTab === item.id ? 'scale-110 -translate-y-1' : ''}`}>{item.icon}</span>
          <span className={`text-[9px] font-black uppercase tracking-tighter ${currentTab === item.id ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
          {currentTab === item.id && (
            <div className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
