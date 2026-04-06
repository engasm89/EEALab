
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonContent {
  title: string;
  text: string;
  codeSnippet?: string;
  imageUrl?: string;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  lessons: LessonContent[];
  quiz: QuizQuestion[];
  isLocked: boolean;
}

export interface UserState {
  xp: number;
  unlockedLevels: number[]; // Array of level IDs that are unlocked
  completedLevels: number[]; // Array of level IDs that are fully completed
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export enum AppView {
  MAP = 'MAP',
  LESSON = 'LESSON',
}
