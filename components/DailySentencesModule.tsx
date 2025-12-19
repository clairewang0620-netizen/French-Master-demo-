
import React, { useState, useEffect } from 'react';
import { DailySentence } from '../types';
import { generateDailySentences, playAudio } from '../geminiService';

const categories = [
  "self-intro", 
  "daily-life", 
  "transport", 
  "travel", 
  "food", 
  "restaurant", 
  "emergency", 
  "cultural-exchange", 
  "technology"
];

const categoryLabels: Record<string, string> = {
  "self-intro": "Présentation",
  "daily-life": "Vie quotidienne",
  "transport": "Transport",
  "travel": "Voyage",
  "food": "Nourriture",
  "restaurant": "Restaurant",
  "emergency": "Urgence",
  "cultural-exchange": "Échange culturel",
  "technology": "Technologie"
};

const DailySentencesModule: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [sentences, setSentences] = useState<DailySentence[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSentences = async () => {
    setLoading(true);
    try {
      const data = await generateDailySentences(selectedCategory);
      setSentences(data.map((s: any, i: number) => ({ ...s, id: i.toString() })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSentences(); }, [selectedCategory]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Phrases du jour</h2>
      
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-colors ${
              selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="space-y-4">
          {sentences.map((s) => (
            <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4">
              <button onClick={() => playAudio(s.sentence)} className="mt-1 bg-blue-50 text-blue-600 p-3 rounded-full">
                🔊
              </button>
              <div className="flex-1">
                <p className="text-lg font-bold text-slate-800 leading-tight mb-1">{s.sentence}</p>
                <p className="text-xs text-slate-400 mb-2 italic">{s.phonetic}</p>
                <p className="text-sm font-medium text-slate-600 border-l-2 border-blue-200 pl-3 py-1 bg-blue-50/50 rounded-r-lg">
                  {s.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailySentencesModule;
