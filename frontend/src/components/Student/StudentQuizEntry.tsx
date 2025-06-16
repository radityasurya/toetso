import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, BookOpen, Clock, Target, Users, AlertCircle, CheckCircle, Play } from 'lucide-react';
import { Quiz } from '../../types';
import { mockQuizzes } from '../../data/mockData';

const StudentQuizEntry: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundQuiz = mockQuizzes.find(q => q.id === id);
      if (foundQuiz && foundQuiz.isActive) {
        setQuiz(foundQuiz);
      } else {
        // Quiz not found or not active
        setQuiz(null);
      }
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!studentInfo.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (studentInfo.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (studentInfo.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    // Email validation
    if (!studentInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(studentInfo.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setStudentInfo({ ...studentInfo, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call to save student info and start quiz
      setTimeout(() => {
        // Store student info in localStorage for the quiz session
        localStorage.setItem('studentInfo', JSON.stringify(studentInfo));
        localStorage.setItem('quizStartTime', new Date().toISOString());
        
        // Navigate to quiz taking interface
        navigate(`/quiz/${id}/take`);
      }, 1000);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center transition-colors">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Quiz Not Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This quiz is either not found or currently unavailable. Please check with your instructor for the correct link.
          </p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Kuizzz</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Theory Exam Platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quiz Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-3 py-1 text-sm rounded-full border ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-sm rounded-full">
                {quiz.category}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{quiz.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{quiz.description}</p>

            {/* Quiz Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Questions</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.questions.length} questions to answer</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                <Clock className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Time Limit</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.timeLimit} minutes to complete</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                <Target className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Passing Score</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.passingScore}% required to pass</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Instructions</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Read each question carefully before answering</li>
                <li>• You can navigate between questions using the Next/Previous buttons</li>
                <li>• Make sure to answer all questions before submitting</li>
                <li>• Your progress will be saved automatically</li>
                <li>• Once submitted, you cannot change your answers</li>
              </ul>
            </div>
          </div>

          {/* Student Information Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Enter Your Information</h3>
            
            <form onSubmit={handleStartQuiz} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                      errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your full name"
                    maxLength={50}
                  />
                </div>
                {errors.name && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    value={studentInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                      errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  </div>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Privacy Notice</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Your information will only be used to track your quiz progress and provide results. 
                      We do not share your data with third parties.
                    </p>
                  </div>
                </div>
              </div>

              {/* Start Quiz Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Starting Quiz...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start Quiz</span>
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help? Contact your instructor or administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQuizEntry;