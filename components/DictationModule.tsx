
import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { playTTS } from '../geminiService';

const DictationModule: React.FC<{ state: AppState }> = ({ state }) => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [pool, setPool] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const list = state.vocabulary.filter(v => state.strengthenSet.includes(v.id));
    setPool(list);
  }, [state]);

  if (pool.length === 0) return (
    <div className="p-12 text-center flex flex-col items-center justify-center min-h-[50vh]">
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Liste de dictée vide</h3>
      <p className="text-slate-500">Ajoutez des mots "À renforcer" dans le module Vocabulaire pour pratiquer ici.</p>
    </div>
  );

  const word = pool[idx];

  const handleCheck = () => {
    if (input.trim().toLowerCase() === word.word.toLowerCase()) {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  };

  const handleNext = () => {
    setIdx((idx + 1) % pool.length);
    setInput('');
    setStatus('idle');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Dictée</h2>
      
      <div className="bg-slate-50 rounded-3xl p-8 text-center mb-8 border-2 border-dashed border-slate-200">
        <p className="text-slate-400 mb-4 uppercase tracking-widest text-xs font-bold">Indice</p>
        <p className="text-2xl font-bold text-slate-800 mb-8">{word.meaning}</p>
        
        <button 
          onClick={() => playTTS(word.word)}
          className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 mx-auto hover:scale-105 transition-transform"
        >
          <span className="text-3xl">🔊</span>
        </button>
      </div>

      <div className="mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setStatus('idle'); }}
          placeholder="Tapez ce que vous entendez..."
          className={`w-full p-6 text-center text-2xl font-bold rounded-2xl border-4 outline-none transition-all ${
            status === 'correct' ? 'border-green-500 bg-green-50' : 
            status === 'wrong' ? 'border-red-500 bg-red-50 animate-shake' : 
            'border-slate-100 bg-white focus:border-blue-400'
          }`}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        />
      </div>

      {status === 'correct' ? (
        <div className="space-y-4">
          <p className="text-center font-bold text-green-600 text-xl">Bravo ! ✨</p>
          <button onClick={handleNext} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">
            Mot suivant
          </button>
        </div>
      ) : (
        <button onClick={handleCheck} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl">
          Vérifier
        </button>
      )}

      <div className="mt-8 text-center">
        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Mot {idx + 1} sur {pool.length}</span>
      </div>
    </div>
  );
};

export default DictationModule;
