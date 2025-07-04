export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'multiple-answer' | 'fill-in-blank' | 'long-answer' | 'matching' | 'ordering';
  options?: string[]; // For multiple choice and multiple answer
  correctAnswer?: number; // For single multiple choice
  correctAnswers?: number[]; // For multiple answer
  correctText?: string; // For fill in the blank
  matchingPairs?: { left: string; right: string }[]; // For matching questions
  correctOrder?: string[]; // For ordering questions
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // Teacher ID who created the question
  requiresManualGrading?: boolean; // For long answer questions
  gradingCriteria?: string; // For long answer questions
  maxScore?: number; // For long answer questions
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
  createdBy?: string; // Teacher ID who created the quiz
  requiresGrading?: boolean; // If any questions require manual grading
}

export interface QuizResult {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  answers: { [questionIndex: number]: number | number[] | string | { [key: string]: string } | string[] }; // Support different answer types
  gradingStatus?: 'pending' | 'completed'; // For quizzes with manual grading
  feedback?: { [questionIndex: number]: string }; // Feedback for each question
  manualScores?: { [questionIndex: number]: number }; // Scores for manually graded questions
  generalFeedback?: string; // Overall feedback for the quiz
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  questionCount: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  jobTitle?: string;
  department?: string;
  joinDate: Date;
  isActive: boolean;
  lastLogin?: Date;
  // Teacher specific
  specializations?: string[];
  yearsExperience?: number;
  // Student specific
  studentId?: string;
  enrollmentDate?: Date;
  grade?: string;
  // Relationship fields
  teacherIds?: string[]; // For students - IDs of connected teachers
  studentIds?: string[]; // For teachers - IDs of connected students
  // Membership
  membershipPlan?: string;
  membershipExpiry?: Date;
}

export type ViewType = 'dashboard' | 'categories' | 'questions' | 'quizzes' | 'analytics' | 'settings' | 'users';