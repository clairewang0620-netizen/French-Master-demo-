
import React, { useState, useEffect } from 'react';
import { LanguageLevel, GrammarPoint } from '../types';
import { generateGrammar, playTTS } from '../geminiService';

const GrammarModule: React.FC<{ level: LanguageLevel }> = ({ level }) => {
  const [points, setPoints] = useState<GrammarPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGrammar = async () => {
    setLoading(true);
    try {
      const data = await generateGrammar(level);
      setPoints(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchGrammar(); }, [level]);

  if (loading) return <div className="p-12 text-center text-slate-500">Analyse de la grammaire...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-black text-slate-900 mb-8">Grammaire {level}</h2>
      
      <div className="space-y-8">
        {points.map((p, i) => (
          <section key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-extrabold text-blue-600 mb-4">{p.title}</h3>
            <p className="text-slate-600 mb-6 leading-relaxed whitespace-pre-wrap">{p.explanation}</p>
            
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Exemples</h4>
              {p.examples.map((ex, j) => (
                <div key={j} className="bg-slate-50 p-4 rounded-xl flex items-start space-x-3">
                  <button onClick={() => playTTS(ex.sentence)} className="text-blue-600 mt-1">▶️</button>
                  <div>
                    <p className="font-bold text-slate-800">{ex.sentence}</p>
                    <p className="text-sm text-slate-500">{ex.translation}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default GrammarModule;
