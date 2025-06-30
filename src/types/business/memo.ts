// 记忆卡业务相关类型定义
import type {
  MemoDeck,
  MemoCard,
  MemoCardSubmitData,
  MemoCardOperateData,
  MemoQueryParams
} from '../api';

// 重新导出基础类型
export type {
  MemoDeck,
  MemoCard,
  MemoCardSubmitData,
  MemoCardOperateData,
  MemoQueryParams
};

// ============= 记忆卡状态类型 =============
export interface MemoState {
  currentDeck: MemoDeck | null;
  deckList: MemoDeck[];
  cardList: MemoCard[];
  currentCard: MemoCard | null;
  studySession: StudySession | null;
  loading: boolean;
  error: string | null;
}

// ============= 学习会话类型 =============
export interface StudySession {
  deckId: number;
  deckName: string;
  cards: MemoCard[];
  currentIndex: number;
  startTime: number;
  studiedCards: number;
  correctCards: number;
  wrongCards: number;
  isCompleted: boolean;
}

// ============= 记忆卡操作类型 =============
export enum MemoCardAction {
  STUDY = 1,
  REVIEW = 2,
  SKIP = 3
}

export interface MemoCardResult {
  cardId: number;
  action: MemoCardAction;
  timeSpent: number;
  isCorrect: boolean;
  difficulty: number; // 1-5
  timestamp: number;
}

// ============= 学习统计类型 =============
export interface MemoStats {
  totalCards: number;
  studiedCards: number;
  masteredCards: number;
  difficultCards: number;
  studyTime: number;
  studyStreak: number;
  lastStudyDate: string;
}

export interface DeckStats extends MemoStats {
  deckId: number;
  deckName: string;
  createdDate: string;
  lastStudiedDate?: string;
}

// ============= 学习计划类型 =============
export interface StudyPlan {
  deckId: number;
  dailyGoal: number;
  reminderTime?: string;
  autoReview: boolean;
  difficultyWeight: boolean;
}

// ============= 记忆算法类型 =============
export interface SpacedRepetitionData {
  cardId: number;
  easinessFactor: number;
  repetitions: number;
  interval: number;
  nextReviewDate: string;
  quality: number; // 0-5
}

// ============= 学习模式类型 =============
export enum StudyMode {
  NORMAL = 'normal',
  REVIEW = 'review',
  DIFFICULT = 'difficult',
  RANDOM = 'random'
}

export interface StudySettings {
  mode: StudyMode;
  showAnswer: boolean;
  autoFlip: boolean;
  autoNext: boolean;
  shuffleCards: boolean;
  studyLimit?: number;
} 