
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AppTab, LanguageLevel, AppState, VocabularyWord } from './types';
import Navigation from './components/Navigation';
import VocabularyModule from './components/VocabularyModule';
import DailySentencesModule from './components/DailySentencesModule';
import GrammarModule from './components/GrammarModule';
import ReadingModule from './components/ReadingModule';
import DictationModule from './components/DictationModule';
import ExamModule from './components/ExamModule';
import HomeModule from './components/HomeModule';

const App = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Home);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('elan_state');
    return saved ? JSON.parse(saved) : {
      vocabulary: [],
      wrongWords: [],
      strengthenSet: [],
      completedExams: [],
      currentLevel: LanguageLevel.A1
    };
  });

  useEffect(() => {
    localStorage.setItem('elan_state', JSON.stringify(state));
  }, [state]);

  const updateLevel = (level: LanguageLevel) => {
    setState(prev => ({ ...prev, currentLevel: level }));
  };

  const handleVocabularyUpdate = (newWords: VocabularyWord[]) => {
    setState(prev => {
      const existingIds = new Set(prev.vocabulary.map(v => v.id));
      const filteredNew = newWords.filter(nw => !existingIds.has(nw.id));
      return { ...prev, vocabulary: [...prev.vocabulary, ...filteredNew] };
    });
  };

  const addToStrengthen = (wordId: string) => {
    setState(prev => ({
      ...prev,
      strengthenSet: prev.strengthenSet.includes(wordId) 
        ? prev.strengthenSet 
        : [...prev.strengthenSet, wordId]
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.Home:
        return <HomeModule state={state} onLevelChange={updateLevel} />;
      case AppTab.Vocabulary:
        return <VocabularyModule 
          level={state.currentLevel} 
          onStrengthen={addToStrengthen} 
          onWordsGenerated={handleVocabularyUpdate}
        />;
      case AppTab.DailySentences:
        return <DailySentencesModule />;
      case AppTab.Grammar:
        return <GrammarModule level={state.currentLevel} />;
      case AppTab.Reading:
        return <ReadingModule level={state.currentLevel} />;
      case AppTab.Dictation:
        return <DictationModule state={state} />;
      case AppTab.Exam:
        return <ExamModule level={state.currentLevel} />;
      default:
        return <HomeModule state={state} onLevelChange={updateLevel} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans antialiased text-slate-900">
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative border-x border-slate-100">
        {renderContent()}
        <Navigation currentTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
