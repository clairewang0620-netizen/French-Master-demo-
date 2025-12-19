
export enum LanguageLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1'
}

export interface Example {
  sentence: string;
  translation: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  examples: Example[];
  level: LanguageLevel;
  known: boolean;
  isStrengthen: boolean;
}

export interface DailySentence {
  id: string;
  sentence: string;
  phonetic: string;
  meaning: string;
  category: string;
}

export interface GrammarPoint {
  title: string;
  explanation: string;
  examples: Example[];
  level: LanguageLevel;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  translation: string;
  keywords: string[];
}

export interface AppState {
  vocabulary: VocabularyWord[];
  wrongWords: string[]; // IDs
  strengthenSet: string[]; // IDs
  completedExams: string[];
  currentLevel: LanguageLevel;
}

export enum AppTab {
  Home = 'home',
  Vocabulary = 'vocabulary',
  DailySentences = 'daily',
  Grammar = 'grammar',
  Reading = 'reading',
  Dictation = 'dictation',
  Exam = 'exam'
}
