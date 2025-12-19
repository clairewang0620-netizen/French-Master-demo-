
import React, { useState, useEffect } from 'react';
import { AppState, VocabularyWord } from '../types';
import { playTTS } from '../geminiService';

const DictationModule: React.FC<{ state: AppState }> = ({ state }) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [pool, setPool] = useState<VocabularyWord[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const list = state.vocabulary.filter(v => state.strengthenSet.includes(v.id));
    setPool(list);
  }, [state.vocabulary, state.strengthenSet]);

  if (pool.length === 0) return (
    <div className="p-12 text-center flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-5xl mb-6 grayscale opacity-50">📝</div>
      <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Liste de dictée vide</h3>
      <p className="text-slate-500 max-w-[200px] text-sm font-medium leading-relaxed">Ajoutez des mots "À renforcer" dans le module Vocabulaire pour pratiquer ici.</p>
    </div>
  );

  const word = pool[idx];

  const handleCheck = () => {
    if (input.trim().toLowerCase() === word.word.toLowerCase()) {
      setStatus('correct');
    } else {
      setStatus('wrong');
      // Briefly reset status to idle after shake to allow reshake
      setTimeout(() => setStatus('idle'), 500);
    }
  };

  const handleNext = () => {
    setIdx((idx + 1) % pool.length);
    setInput('');
    setStatus('idle');
  };

  return (
    <div className="p-6 animate-in slide-in-from-right duration-300">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dictée</h2>
        <p className="text-slate-500 font-medium">Écoutez et écrivez le mot.</p>
      </header>
      
      <div className="bg-slate-50 rounded-[32px] p-10 text-center mb-10 border-2 border-dashed border-slate-200">
        <p className="text-slate-400 mb-6 uppercase tracking-widest text-[10px] font-black">Indice de traduction</p>
        <p className="text-3xl font-black text-slate-800 mb-10">{word.meaning}</p>
        
        <button 
          onClick={() => playTTS(word.word)}
          className="bg-blue-600 text-white w-24 h-24 rounded-full flex items-center justify-center shadow-2xl shadow-blue-300 mx-auto hover:scale-110 active:scale-95 transition-all"
        >
          <span className="text-4xl">🔊</span>
        </button>
      </div>

      <div className="mb-10">
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (status === 'wrong') setStatus('idle'); }}
          placeholder="Tapez ici..."
          autoFocus
          spellCheck={false}
          autoComplete="off"
          className={`w-full p-8 text-center text-3xl font-black rounded-3xl border-4 outline-none transition-all ${
            status === 'correct' ? 'border-green-500 bg-green-50 text-green-700' : 
            status === 'wrong' ? 'border-red-500 bg-red-50 text-red-700 animate-shake' : 
            'border-slate-100 bg-white focus:border-blue-500 shadow-inner'
          }`}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        />
      </div>

      {status === 'correct' ? (
        <div className="space-y-4 animate-in zoom-in duration-300">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <span className="text-2xl">✨</span>
            <p className="font-black text-xl uppercase tracking-widest">Excellent !</p>
          </div>
          <button onClick={handleNext} className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
            Mot suivant
          </button>
        </div>
      ) : (
        <button onClick={handleCheck} className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 active:scale-95 transition-all">
          Vérifier
        </button>
      )}

      <div className="mt-12 text-center">
        <div className="inline-block px-4 py-1 bg-slate-100 rounded-full">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progression: {idx + 1} / {pool.length}</span>
        </div>
      </div>
    </div>
  );
};

export default DictationModule;
