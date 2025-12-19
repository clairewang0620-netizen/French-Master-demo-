
import React, { useState, useEffect } from 'react';
import { VocabularyWord, LanguageLevel } from '../types';
import { generateVocabulary, playAudio } from '../geminiService';

const PREDEFINED_A1_WORDS: Omit<VocabularyWord, 'id' | 'level' | 'known' | 'isStrengthen'>[] = [
  {
    word: "bonjour",
    phonetic: "bɔ̃.ʒuʁ",
    meaning: "你好",
    audioUrl: "https://ttsreader.com/player/mp3?text=bonjour&lang=fr",
    examples: [
      { 
        sentence: "Bonjour, comment ça va ?", 
        translation: "你好，你怎么样？",
        audioUrl: "https://ttsreader.com/player/mp3?text=Bonjour,%20comment%20ça%20va%20?&lang=fr"
      },
      { 
        sentence: "Je dis bonjour à mes voisins.", 
        translation: "我向邻居打招呼。",
        audioUrl: "https://ttsreader.com/player/mp3?text=Je%20dis%20bonjour%20à%20mes%20voisins.&lang=fr"
      }
    ]
  },
  {
    word: "merci",
    phonetic: "mɛʁ.si",
    meaning: "谢谢",
    audioUrl: "https://ttsreader.com/player/mp3?text=merci&lang=fr",
    examples: [
      { 
        sentence: "Merci pour votre aide.", 
        translation: "谢谢你的帮助。",
        audioUrl: "https://ttsreader.com/player/mp3?text=Merci%20pour%20votre%20aide.&lang=fr"
      }
    ]
  },
  {
    word: "pomme",
    phonetic: "pɔm",
    meaning: "苹果",
    audioUrl: "https://ttsreader.com/player/mp3?text=pomme&lang=fr",
    examples: [
      { 
        sentence: "Je mange une pomme.", 
        translation: "我吃一个苹果。",
        audioUrl: "https://ttsreader.com/player/mp3?text=Je%20mange%20une%20pomme.&lang=fr"
      }
    ]
  },
  {
    word: "chat",
    phonetic: "ʃa",
    meaning: "猫",
    audioUrl: "https://ttsreader.com/player/mp3?text=chat&lang=fr",
    examples: [
      { 
        sentence: "Le chat dort sur le canapé.", 
        translation: "猫在沙发上睡觉。",
        audioUrl: "https://ttsreader.com/player/mp3?text=Le%20chat%20dort%20sur%20le%20canapé.&lang=fr"
      }
    ]
  },
  {
    word: "chien",
    phonetic: "ʃjɛ̃",
    meaning: "狗",
    audioUrl: "https://ttsreader.com/player/mp3?text=chien&lang=fr",
    examples: [
      { 
        sentence: "Le chien court dans le jardin.", 
        translation: "狗在花园里跑。",
        audioUrl: "https://ttsreader.com/player/mp3?text=Le%20chien%20court%20dans%20le%20jardin.&lang=fr"
      }
    ]
  },
  {
    word: "maison",
    phonetic: "mɛ.zɔ̃",
    meaning: "房子",
    audioUrl: "https://ttsreader.com/player/mp3?text=maison&lang=fr",
    examples: [
      { 
        sentence: "Ma maison est grande.", 
        translation: "我的房子很大。",
        audioUrl: "https://ttsreader.com/player/mp3?text=Ma%20maison%20est%20grande.&lang=fr"
      }
    ]
  },
  {
    word: "eau",
    phonetic: "o",
    meaning: "水",
    audioUrl: "https://ttsreader.com/player/mp3?text=eau&lang=fr",
    examples: [
      { 
        sentence: "Je bois de l'eau.", 
        translation: "我喝水。",
        audioUrl: "https://ttsreader.com/player/mp3?text=Je%20bois%20de%20l'eau.&lang=fr"
      }
    ]
  },
  {
    word: "fromage",
    phonetic: "fʁɔ.maʒ",
    meaning: "奶酪",
    audioUrl: "https://ttsreader.com/player/mp3?text=fromage&lang=fr",
    examples: [
      { 
        sentence: "Le fromage est délicieux.", 
        translation: "奶酪很好吃。",
        audioUrl: "https://ttsreader.com/player/mp3?text=Le%20fromage%20est%20délicieux.&lang=fr"
      }
    ]
  },
  {
    word: "pain",
    phonetic: "pɛ̃",
    meaning: "面包",
    audioUrl: "https://ttsreader.com/player/mp3?text=pain&lang=fr",
    examples: [
      { 
        sentence: "Je mange du pain le matin.", 
        translation: "我早上吃面包。",
        audioUrl: "https://ttsreader.com/player/mp3?text=Je%20mange%20du%20pain%20le%20matin.&lang=fr"
      }
    ]
  },
  {
    word: "voiture",
    phonetic: "vwa.tyʁ",
    meaning: "汽车",
    audioUrl: "https://ttsreader.com/player/mp3?text=voiture&lang=fr",
    examples: [
      { 
        sentence: "La voiture est rouge.", 
        translation: "汽车是红色的。",
        audioUrl: "https://ttsreader.com/player/mp3?text=La%20voiture%20est%20rouge.&lang=fr"
      }
    ]
  }
];

interface Props {
  level: LanguageLevel;
  onStrengthen: (wordId: string) => void;
  onWordsGenerated: (words: VocabularyWord[]) => void;
}

const VocabularyModule: React.FC<Props> = ({ level, onStrengthen, onWordsGenerated }) => {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  const fetchWords = async (forceAi = false) => {
    if (!forceAi && level === LanguageLevel.A1) {
      const formatted = PREDEFINED_A1_WORDS.map((w, idx) => ({
        ...w,
        id: `static-a1-${idx}`,
        level: LanguageLevel.A1,
        known: false,
        isStrengthen: false
      })) as VocabularyWord[];
      setWords(formatted);
      onWordsGenerated(formatted);
      return;
    }

    setLoading(true);
    try {
      const data = await generateVocabulary(level);
      const formattedWords = data.map((w: any, idx: number) => ({
        ...w,
        id: `${level}-${Date.now()}-${idx}`,
        level,
        known: false,
        isStrengthen: false
      }));
      setWords(formattedWords);
      onWordsGenerated(formattedWords);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [level]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-6">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-100 border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600">FR</div>
      </div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Génération AI...</p>
    </div>
  );

  return (
    <div className="p-5 animate-in fade-in duration-500">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vocabulaire</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">{level}</span>
        </div>
        <p className="text-slate-500">Apprenez les mots essentiels.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {words.map((word) => (
          <div 
            key={word.id}
            onClick={() => setSelectedWord(word)}
            className="group p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{word.word}</h3>
              <p className="text-sm text-slate-400 font-medium">{word.phonetic}</p>
            </div>
            <div className="bg-slate-50 group-hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors">
              <p className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{word.meaning}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => fetchWords(true)}
        className="w-full mt-8 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:text-blue-600 hover:border-blue-200 transition-all"
      >
        + Charger plus de mots via AI
      </button>

      {selectedWord && (
        <div className="fixed inset-0 bg-white z-[60] p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <button 
            onClick={() => setSelectedWord(null)}
            className="self-start mb-10 bg-slate-100 p-3 rounded-full hover:bg-slate-200 transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="text-center mb-10">
              <h1 className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">{selectedWord.word}</h1>
              <p className="text-2xl text-slate-300 font-medium mb-8">{selectedWord.phonetic}</p>
              
              <button 
                onClick={() => playAudio(selectedWord.word, selectedWord.audioUrl)}
                className="inline-flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-blue-200 active:scale-95 transition-all"
              >
                <span className="text-xl">🔊</span>
                <span>ÉCOUTER</span>
              </button>
            </div>

            <div className="bg-blue-50/50 rounded-3xl p-8 mb-10 text-center border border-blue-100">
              <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Signification</p>
              <p className="text-3xl font-black text-blue-700">{selectedWord.meaning}</p>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-3">Exemples en contexte</h4>
              {selectedWord.examples.map((ex, i) => (
                <div key={i} className="group bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all">
                  <p className="font-bold text-slate-800 text-lg mb-2 leading-snug">{ex.sentence}</p>
                  <p className="text-slate-500 mb-4">{ex.translation}</p>
                  <button 
                    onClick={() => playAudio(ex.sentence, ex.audioUrl)}
                    className="flex items-center space-x-2 text-xs font-black text-blue-600 uppercase tracking-wider"
                  >
                    <span>▶️ Lire la phrase</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 grid grid-cols-2 gap-4 border-t border-slate-100 mt-4">
            <button 
              onClick={() => {
                onStrengthen(selectedWord.id);
                setSelectedWord(null);
              }}
              className="py-5 bg-orange-100 text-orange-700 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-orange-200 transition-colors shadow-sm"
            >
              À renforcer
            </button>
            <button 
              onClick={() => setSelectedWord(null)}
              className="py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
            >
              Je connais
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyModule;
