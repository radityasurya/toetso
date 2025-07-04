import { Users, Award, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';

// Dashboard mock data
export const dashboardData = {
  totalQuestions: 152,
  totalQuizzes: 8,
  totalUsers: 5,
  totalAttempts: 1247,
  activeQuizzes: 6,
  avgSuccessRate: 78,
  recentActivity: [
    { action: 'New question added', category: 'Traffic Signs', time: '2 hours ago', type: 'success' },
    { action: 'Quiz "Basic Rules" completed', user: 'Student #1247', time: '4 hours ago', type: 'info' },
    { action: 'Question updated', category: 'Parking Rules', time: '6 hours ago', type: 'warning' },
    { action: 'New quiz created', category: 'Emergency Situations', time: '1 day ago', type: 'success' },
  ],
  topCategories: [
    { name: 'Traffic Signs', questions: 45, successRate: 82, color: 'bg-blue-500' },
    { name: 'Road Rules', questions: 38, successRate: 75, color: 'bg-green-500' },
    { name: 'Vehicle Safety', questions: 29, successRate: 79, color: 'bg-yellow-500' },
    { name: 'Parking', questions: 22, successRate: 71, color: 'bg-red-500' },
  ]
};

// Analytics mock data
export const analyticsData = {
  performanceMetrics: [
    { label: 'Total Quiz Attempts', value: '1,247', change: '+18%', trend: 'up', icon: Users },
    { label: 'Average Score', value: '78.5%', change: '+5.2%', trend: 'up', icon: Target },
    { label: 'Completion Rate', value: '92.3%', change: '+2.1%', trend: 'up', icon: CheckCircle },
    { label: 'Avg. Time per Quiz', value: '8.5 min', change: '-1.2%', trend: 'down', icon: Clock },
  ],
  categoryPerformance: [
    { name: 'Traffic Signs', attempts: 456, avgScore: 82.1, difficulty: 'Easy', trend: 'up' },
    { name: 'Road Rules', attempts: 398, avgScore: 75.3, difficulty: 'Medium', trend: 'up' },
    { name: 'Vehicle Safety', attempts: 287, avgScore: 79.8, difficulty: 'Easy', trend: 'down' },
    { name: 'Parking', attempts: 234, avgScore: 71.2, difficulty: 'Hard', trend: 'up' },
    { name: 'Emergency Situations', attempts: 187, avgScore: 68.9, difficulty: 'Hard', trend: 'down' },
  ],
  difficultQuestions: [
    { question: 'What is the proper following distance in heavy rain?', category: 'Vehicle Safety', successRate: 45.2, attempts: 128 },
    { question: 'When can you legally park in a handicap space?', category: 'Parking', successRate: 52.1, attempts: 98 },
    { question: 'What should you do if your brakes fail?', category: 'Emergency Situations', successRate: 48.7, attempts: 87 },
    { question: 'How do you handle a tire blowout?', category: 'Emergency Situations', successRate: 41.3, attempts: 76 },
  ],
  recentTrends: [
    { period: 'This Week', quizzes: 89, avgScore: 79.2, improvement: '+3.1%' },
    { period: 'Last Week', quizzes: 76, avgScore: 76.8, improvement: '+1.9%' },
    { period: 'Two Weeks Ago', quizzes: 82, avgScore: 75.4, improvement: '-2.3%' },
    { period: 'Three Weeks Ago', quizzes: 94, avgScore: 77.2, improvement: '+4.7%' },
  ]
};

// Settings mock data
export const settingsData = {
  // General Settings
  siteName: 'Kuizzz',
  siteDescription: 'Professional Theory Exam Platform',
  defaultLanguage: 'en',
  timezone: 'America/New_York',
  supportEmail: 'support@kuizzz.com',
  organizationName: 'Driving Education Institute',
  
  // Quiz Settings
  defaultTimeLimit: 30,
  defaultPassingScore: 75,
  allowRetakes: true,
  showCorrectAnswers: true,
  randomizeQuestions: true,
  randomizeOptions: true,
  
  // User Settings
  requireEmail: true,
  allowAnonymous: false,
  collectStatistics: true,
  
  // Notification Settings
  emailNotifications: true,
  quizCompletionNotifications: true,
  newQuestionNotifications: true,
  systemAlerts: true,
  
  // Security Settings
  enableCaptcha: true,
  sessionTimeout: 60,
  maxAttempts: 5,
  ipRestriction: false,
  
  // Appearance Settings
  theme: 'system',
  primaryColor: '#3B82F6',
  fontSize: 'medium',
  compactMode: false,
  fontFamily: 'system',
  roundedCorners: true,
  showAnimations: true,
  
  // Backup Settings
  autoBackup: true,
  backupFrequency: 'daily',
  retentionPeriod: 30,
  
  // Membership Settings
  membershipEnabled: true,
  membershipPlans: [
    {
      id: 'monthly',
      name: '1 Month',
      price: 9.99,
      description: 'Access to all quizzes for 1 month',
      features: [
        'Unlimited quiz attempts',
        'Access to all categories',
        'Performance tracking',
        'Email support'
      ],
      popular: false,
      billingPeriod: 'month'
    },
    {
      id: 'biannual',
      name: '6 Months',
      price: 49.99,
      description: 'Access to all quizzes for 6 months',
      features: [
        'Unlimited quiz attempts',
        'Access to all categories',
        'Performance tracking',
        'Priority email support',
        'Downloadable study materials'
      ],
      popular: true,
      billingPeriod: '6 months',
      discount: '17%'
    },
    {
      id: 'annual',
      name: '12 Months',
      price: 89.99,
      description: 'Access to all quizzes for 12 months',
      features: [
        'Unlimited quiz attempts',
        'Access to all categories',
        'Performance tracking',
        'Priority email support',
        'Downloadable study materials',
        'One-on-one coaching session'
      ],
      popular: false,
      billingPeriod: 'year',
      discount: '25%'
    }
  ],
  trialPeriod: 7,
  offerFreeTrial: true
};