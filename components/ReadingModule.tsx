
import React, { useState, useEffect } from 'react';
import { LanguageLevel, Article } from '../types';
import { generateArticle, playAudio } from '../geminiService';

const ReadingModule: React.FC<{ level: LanguageLevel }> = ({ level }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const data = await generateArticle(level);
      setArticle(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchArticle(); }, [level]);

  if (loading) return <div className="p-12 text-center text-slate-500 italic">Rédaction d'un texte pour vous...</div>;

  return (
    <div className="p-6">
      <header className="mb-6">
        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">{article?.title}</h2>
        <div className="flex space-x-2">
           <button 
            onClick={() => playAudio(article?.content || '')}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex justify-center items-center space-x-2"
          >
            <span>🔊 Écouter tout</span>
          </button>
          <button 
            onClick={() => setShowTranslation(!showTranslation)}
            className={`flex-1 py-3 rounded-xl font-bold border-2 transition-colors ${
              showTranslation ? 'bg-slate-900 text-white border-slate-900' : 'bg-transparent text-slate-900 border-slate-900'
            }`}
          >
            {showTranslation ? 'Masquer la trad.' : 'Voir la traduction'}
          </button>
        </div>
      </header>

      <article className="prose prose-slate mb-12">
        <div className="text-lg text-slate-800 leading-relaxed space-y-4">
          {article?.content.split('\n').map((p, i) => (
            <p key={i} className="mb-4">{p}</p>
          ))}
        </div>

        {showTranslation && (
          <div className="mt-8 pt-8 border-t border-slate-100 text-slate-500 italic text-base leading-relaxed animate-in fade-in duration-500">
            {article?.translation}
          </div>
        )}
      </article>

      <section className="bg-slate-50 rounded-2xl p-6">
        <h4 className="font-bold text-slate-900 mb-4 flex items-center">
          <span className="mr-2">🔑</span> Mots clés
        </h4>
        <div className="flex flex-wrap gap-2">
          {article?.keywords.map(kw => (
            <button 
              key={kw}
              onClick={() => playAudio(kw)}
              className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-blue-300"
            >
              {kw}
            </button>
          ))}
        </div>
      </section>
      
      <button onClick={fetchArticle} className="w-full mt-8 py-4 text-blue-600 font-bold border-2 border-dashed border-blue-200 rounded-2xl">
        Lire un autre article
      </button>
    </div>
  );
};

export default ReadingModule;
