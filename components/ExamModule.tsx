
import React, { useState, useEffect } from 'react';
import { LanguageLevel } from '../types';
import { generateExam } from '../geminiService';

interface Question {
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

const ExamModule: React.FC<{ level: LanguageLevel }> = ({ level }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const startExam = async () => {
    setLoading(true);
    try {
      const data = await generateExam(level);
      setQuestions(data);
      setCurrentIdx(0);
      setScore(0);
      setFinished(false);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { startExam(); }, [level]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[currentIdx].answerIndex) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Génération de l'examen...</div>;

  if (finished) return (
    <div className="p-8 text-center h-full flex flex-col justify-center items-center">
      <div className="text-6xl mb-6">🎓</div>
      <h2 className="text-3xl font-black text-slate-900 mb-2">Examen terminé</h2>
      <p className="text-xl text-slate-600 mb-8">Votre score : <span className="text-blue-600 font-bold">{score} / {questions.length}</span></p>
      <button onClick={startExam} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200">
        Recommencer
      </button>
    </div>
  );

  const q = questions[currentIdx];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {currentIdx + 1}/{questions.length}</span>
        <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-8 leading-snug">{q.question}</h3>

      <div className="space-y-3 mb-8">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={`w-full p-5 rounded-2xl text-left font-medium transition-all flex justify-between items-center ${
              selected === i 
                ? (i === q.answerIndex ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800')
                : (selected !== null && i === q.answerIndex ? 'bg-green-100 border-green-500 text-green-800' : 'bg-slate-50 border-transparent text-slate-700')
            } border-2`}
          >
            <span>{opt}</span>
            {selected !== null && i === q.answerIndex && <span>✅</span>}
            {selected === i && i !== q.answerIndex && <span>❌</span>}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h4 className="text-blue-800 font-bold text-sm mb-2 uppercase">Explication</h4>
          <p className="text-blue-900 text-sm leading-relaxed">{q.explanation || "Bonne réponse !"}</p>
        </div>
      )}

      {selected !== null && (
        <button 
          onClick={nextQuestion}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl"
        >
          {currentIdx + 1 === questions.length ? "Voir le résultat" : "Suivant"}
        </button>
      )}
    </div>
  );
};

export default ExamModule;
