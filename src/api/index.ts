// This file serves as a central location for all API calls
// In a real application, these would connect to backend endpoints

import { 
  Question, 
  Quiz, 
  Category, 
  User, 
  QuizResult 
} from '../types';
import { 
  mockQuestions, 
  mockQuizzes, 
  categories as mockCategories, 
  mockUsers, 
  mockResults 
} from '../data/mockData';
import { 
  dashboardData, 
  analyticsData, 
  settingsData 
} from './mockData';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Questions API
export const questionsApi = {
  getAll: async (): Promise<Question[]> => {
    await delay(500);
    return [...mockQuestions];
  },
  
  getById: async (id: string): Promise<Question | null> => {
    await delay(300);
    return mockQuestions.find(q => q.id === id) || null;
  },
  
  create: async (question: Partial<Question>): Promise<Question> => {
    await delay(700);
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: question.question || '',
      type: question.type || 'multiple-choice',
      options: question.options || [],
      correctAnswer: question.correctAnswer,
      correctAnswers: question.correctAnswers,
      correctText: question.correctText,
      matchingPairs: question.matchingPairs,
      correctOrder: question.correctOrder,
      explanation: question.explanation || '',
      category: question.category || '',
      difficulty: question.difficulty || 'medium',
      image: question.image,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: question.createdBy,
      requiresManualGrading: question.requiresManualGrading,
      gradingCriteria: question.gradingCriteria,
      maxScore: question.maxScore
    };
    
    // In a real app, this would be saved to a database
    // mockQuestions.push(newQuestion);
    
    return newQuestion;
  },
  
  update: async (id: string, question: Partial<Question>): Promise<Question> => {
    await delay(700);
    const index = mockQuestions.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Question not found');
    
    const updatedQuestion = {
      ...mockQuestions[index],
      ...question,
      updatedAt: new Date()
    };
    
    // In a real app, this would update the database
    // mockQuestions[index] = updatedQuestion;
    
    return updatedQuestion;
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(500);
    // In a real app, this would delete from the database
    // const index = mockQuestions.findIndex(q => q.id === id);
    // if (index !== -1) mockQuestions.splice(index, 1);
  },
  
  getByCategory: async (categoryName: string): Promise<Question[]> => {
    await delay(400);
    return mockQuestions.filter(q => q.category === categoryName);
  }
};

// Quizzes API
export const quizzesApi = {
  getAll: async (): Promise<Quiz[]> => {
    await delay(500);
    return [...mockQuizzes];
  },
  
  getById: async (id: string): Promise<Quiz | null> => {
    await delay(300);
    return mockQuizzes.find(q => q.id === id) || null;
  },
  
  create: async (quiz: Partial<Quiz>): Promise<Quiz> => {
    await delay(700);
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title: quiz.title || '',
      description: quiz.description || '',
      category: quiz.category || '',
      questions: quiz.questions || [],
      timeLimit: quiz.timeLimit || 15,
      passingScore: quiz.passingScore || 70,
      difficulty: quiz.difficulty || 'medium',
      isActive: quiz.isActive !== undefined ? quiz.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: quiz.createdBy,
      requiresGrading: quiz.requiresGrading
    };
    
    // In a real app, this would be saved to a database
    // mockQuizzes.push(newQuiz);
    
    return newQuiz;
  },
  
  update: async (id: string, quiz: Partial<Quiz>): Promise<Quiz> => {
    await delay(700);
    const index = mockQuizzes.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quiz not found');
    
    const updatedQuiz = {
      ...mockQuizzes[index],
      ...quiz,
      updatedAt: new Date()
    };
    
    // In a real app, this would update the database
    // mockQuizzes[index] = updatedQuiz;
    
    return updatedQuiz;
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(500);
    // In a real app, this would delete from the database
    // const index = mockQuizzes.findIndex(q => q.id === id);
    // if (index !== -1) mockQuizzes.splice(index, 1);
  },
  
  getQuizQuestions: async (quizId: string): Promise<Question[]> => {
    await delay(400);
    const quiz = mockQuizzes.find(q => q.id === quizId);
    if (!quiz) return [];
    
    return mockQuestions.filter(q => quiz.questions.includes(q.id));
  }
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    await delay(400);
    return [...mockCategories];
  },
  
  getById: async (id: string): Promise<Category | null> => {
    await delay(200);
    return mockCategories.find(c => c.id === id) || null;
  },
  
  create: async (category: Partial<Category>): Promise<Category> => {
    await delay(500);
    const newCategory: Category = {
      id: Date.now().toString(),
      name: category.name || '',
      description: category.description || '',
      color: category.color || '#3B82F6',
      questionCount: 0
    };
    
    // In a real app, this would be saved to a database
    // mockCategories.push(newCategory);
    
    return newCategory;
  },
  
  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    await delay(500);
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const updatedCategory = {
      ...mockCategories[index],
      ...category
    };
    
    // In a real app, this would update the database
    // mockCategories[index] = updatedCategory;
    
    return updatedCategory;
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(400);
    // In a real app, this would delete from the database
    // const index = mockCategories.findIndex(c => c.id === id);
    // if (index !== -1) mockCategories.splice(index, 1);
  }
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    await delay(500);
    return [...mockUsers];
  },
  
  getById: async (id: string): Promise<User | null> => {
    await delay(300);
    return mockUsers.find(u => u.id === id) || null;
  },
  
  getUserByEmail: async (email: string): Promise<User | null> => {
    await delay(300);
    return mockUsers.find(u => u.email === email) || null;
  },
  
  create: async (user: Partial<User>): Promise<User> => {
    await delay(700);
    const newUser: User = {
      id: Date.now().toString(),
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      role: user.role || 'student',
      joinDate: new Date(),
      isActive: user.isActive !== undefined ? user.isActive : true,
      ...user
    };
    
    // In a real app, this would be saved to a database
    // mockUsers.push(newUser);
    
    return newUser;
  },
  
  update: async (id: string, user: Partial<User>): Promise<User> => {
    await delay(700);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    const updatedUser = {
      ...mockUsers[index],
      ...user
    };
    
    // In a real app, this would update the database
    // mockUsers[index] = updatedUser;
    
    return updatedUser;
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(500);
    // In a real app, this would delete from the database
    // const index = mockUsers.findIndex(u => u.id === id);
    // if (index !== -1) mockUsers.splice(index, 1);
  },
  
  login: async (email: string, password: string): Promise<User | null> => {
    await delay(800);
    // In a real app, this would verify credentials
    const user = mockUsers.find(u => u.email === email);
    if (!user) return null;
    
    // Update last login
    user.lastLogin = new Date();
    
    return user;
  },
  
  // Teacher-Student relationship methods
  getConnectedUsers: async (userId: string): Promise<User[]> => {
    await delay(600);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return [];
    
    // In a real app, this would query a relationship table
    // For now, return some mock users based on role
    if (user.role === 'teacher') {
      // Return students for this teacher
      return mockUsers.filter(u => u.role === 'student').slice(0, 3);
    } else if (user.role === 'student') {
      // Return teachers for this student
      return mockUsers.filter(u => u.role === 'teacher').slice(0, 2);
    }
    
    return [];
  },
  
  connectUser: async (userId: string, code: string): Promise<User | null> => {
    await delay(800);
    // In a real app, this would create a relationship between users
    // For now, return a mock user
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return null;
    
    if (user.role === 'teacher') {
      // Connect a student
      return mockUsers.find(u => u.role === 'student' && u.id !== userId) || null;
    } else {
      // Connect a teacher
      return mockUsers.find(u => u.role === 'teacher' && u.id !== userId) || null;
    }
  },
  
  disconnectUser: async (userId: string, targetId: string): Promise<boolean> => {
    await delay(500);
    // In a real app, this would remove a relationship between users
    return true;
  },
  
  // Role-specific methods
  getTeacherQuizzes: async (teacherId: string): Promise<Quiz[]> => {
    await delay(400);
    return mockQuizzes.filter(q => q.createdBy === teacherId);
  },
  
  getTeacherQuestions: async (teacherId: string): Promise<Question[]> => {
    await delay(400);
    return mockQuestions.filter(q => q.createdBy === teacherId);
  },
  
  getStudentResults: async (studentId: string): Promise<QuizResult[]> => {
    await delay(400);
    return mockResults.filter(r => r.studentId === studentId);
  }
};

// Quiz Results API
export const resultsApi = {
  getAll: async (): Promise<QuizResult[]> => {
    await delay(600);
    return [...mockResults];
  },
  
  getById: async (id: string): Promise<QuizResult | null> => {
    await delay(300);
    return mockResults.find(r => r.id === id) || null;
  },
  
  getByQuizId: async (quizId: string): Promise<QuizResult[]> => {
    await delay(400);
    return mockResults.filter(r => r.quizId === quizId);
  },
  
  getByStudentId: async (studentId: string): Promise<QuizResult[]> => {
    await delay(400);
    return mockResults.filter(r => r.studentId === studentId);
  },
  
  create: async (result: Partial<QuizResult>): Promise<QuizResult> => {
    await delay(700);
    const newResult: QuizResult = {
      id: Date.now().toString(),
      quizId: result.quizId || '',
      studentId: result.studentId || '',
      score: result.score || 0,
      totalQuestions: result.totalQuestions || 0,
      correctAnswers: result.correctAnswers || 0,
      timeSpent: result.timeSpent || 0,
      completedAt: new Date(),
      answers: result.answers || {}
    };
    
    // In a real app, this would be saved to a database
    // mockResults.push(newResult);
    
    return newResult;
  },
  
  updateGrading: async (id: string, feedback: { [key: number]: string }, manualScores: { [key: number]: number }, generalFeedback?: string): Promise<QuizResult> => {
    await delay(600);
    const index = mockResults.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Result not found');
    
    const updatedResult = {
      ...mockResults[index],
      feedback: { ...mockResults[index].feedback, ...feedback },
      manualScores: { ...mockResults[index].manualScores, ...manualScores },
      generalFeedback: generalFeedback || mockResults[index].generalFeedback
    };
    
    // In a real app, this would update the database
    // mockResults[index] = updatedResult;
    
    return updatedResult;
  }
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<any> => {
    await delay(500);
    return dashboardData;
  },
  
  getAnalytics: async (): Promise<any> => {
    await delay(700);
    return analyticsData;
  }
};

// Settings API
export const settingsApi = {
  getSettings: async (): Promise<any> => {
    await delay(600);
    return { ...settingsData };
  },
  
  updateSettings: async (settings: any): Promise<any> => {
    await delay(800);
    // In a real app, this would update the database
    return { ...settings };
  },
  
  getDefaultSettings: async (): Promise<any> => {
    await delay(400);
    return { ...settingsData };
  }
};