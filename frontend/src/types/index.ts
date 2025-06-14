export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: string[]; // Question IDs
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizResult {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  questionCount: number;
}

export type ViewType = 'dashboard' | 'categories' | 'questions' | 'quizzes' | 'analytics' | 'settings';