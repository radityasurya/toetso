import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Target, Users, Play, Eye, CheckCircle, XCircle, RotateCcw, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { Quiz, Question } from '../../types';
import { mockQuestions, mockQuizzes } from '../../data/mockData';

// Import shared components
import QuestionDisplay from '../Common/QuizComponents/QuestionDisplay';
import QuestionInput from '../Common/QuizComponents/QuestionInput';
import QuizProgressBar from '../Common/QuizComponents/QuizProgressBar';
import QuizTimer from '../Common/QuizComponents/QuizTimer';
import QuizNavigation from '../Common/QuizComponents/QuizNavigation';
import QuestionNavigator from '../Common/QuizComponents/QuestionNavigator';
import QuizResultsSummary from '../Common/QuizComponents/QuizResultsSummary';
import ConfirmSubmitModal from '../Common/QuizComponents/ConfirmSubmitModal';

const QuizPreview: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: any }>({});
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundQuiz = mockQuizzes.find(q => q.id === id);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setTimeRemaining(foundQuiz.timeLimit * 60);
      } else {
        navigate('/quizzes');
      }
    }
  }, [id, navigate]);

  const quizQuestions = quiz ? mockQuestions.filter(q => quiz.questions.includes(q.id)) : [];

  const handleAnswerChange = (answer: any) => {
    if (isPreviewMode || timeExpired) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishQuiz = () => {
    // Make sure the current question's answer is included
    const currentAnswer = selectedAnswers[currentQuestionIndex];
    if (currentAnswer !== undefined) {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: currentAnswer
      }));
    }
    
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    setIsSubmitting(true);
    setShowSubmitConfirm(false);
    submitQuiz(false);
  };

  const handleTimeExpired = () => {
    setTimeExpired(true);
    setShowResults(true);
    setQuizStarted(false);
  };

  const submitQuiz = (autoSubmit: boolean) => {
    setShowResults(true);
    setQuizStarted(false);
    setIsSubmitting(false);
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    quizQuestions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      
      if (question.type === 'multiple-choice') {
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      } else if (question.type === 'multiple-answer') {
        const userAnswerArray = userAnswer as number[] || [];
        const correctAnswerArray = question.correctAnswers || [];
        
        // Check if arrays have the same elements (order doesn't matter)
        if (userAnswerArray.length === correctAnswerArray.length && 
            userAnswerArray.every(val => correctAnswerArray.includes(val))) {
          correctAnswers++;
        }
      } else if (question.type === 'fill-in-blank') {
        const userText = (userAnswer as string || '').trim().toLowerCase();
        const correctText = (question.correctText || '').trim().toLowerCase();
        
        if (userText === correctText) {
          correctAnswers++;
        }
      } else if (question.type === 'matching') {
        const userMatches = userAnswer as { [key: string]: string } || {};
        const correctMatches = question.matchingPairs || [];
        
        // Check if all pairs are matched correctly
        const allCorrect = correctMatches.every(pair => 
          userMatches[pair.left] === pair.right
        );
        
        if (allCorrect && Object.keys(userMatches).length === correctMatches.length) {
          correctAnswers++;
        }
      } else if (question.type === 'ordering') {
        const userOrder = userAnswer as string[] || [];
        const correctOrder = question.correctOrder || [];
        
        // Check if arrays have the same elements in the same order
        const isCorrect = userOrder.length === correctOrder.length && 
                         userOrder.every((val, i) => val === correctOrder[i]);
        
        if (isCorrect) {
          correctAnswers++;
        }
      }
    });
    
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);
    const passed = quiz ? score >= quiz.passingScore : false;
    
    return { correctAnswers, score, passed };
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowReview(false);
    setIsPreviewMode(true);
    setQuizStarted(false);
    setTimeRemaining(quiz ? quiz.timeLimit * 60 : 0);
    setTimeExpired(false);
  };

  const startActualQuiz = () => {
    setIsPreviewMode(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowReview(false);
    setQuizStarted(true);
    setTimeRemaining(quiz ? quiz.timeLimit * 60 : 0);
    setTimeExpired(false);
  };

  const isQuestionAnswered = (index: number) => {
    const answer = selectedAnswers[index];
    if (answer === undefined) return false;
    
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    
    if (typeof answer === 'string') {
      return answer.trim() !== '';
    }
    
    if (typeof answer === 'object' && answer !== null) {
      return Object.keys(answer).length > 0;
    }
    
    return true;
  };

  const answeredQuestions = Object.fromEntries(
    quizQuestions.map((_, index) => [index, isQuestionAnswered(index)])
  );

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Quiz not found</p>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/quizzes')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quiz Results</h2>
              </div>
              {timeExpired && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-full text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Time Expired</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            <QuizResultsSummary 
              score={results.score}
              passingScore={quiz.passingScore}
              correctAnswers={results.correctAnswers}
              totalQuestions={quizQuestions.length}
              timeSpent={(quiz.timeLimit * 60) - timeRemaining}
              passed={results.passed}
              autoSubmit={timeExpired}
            />

            {/* Review Questions Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowReview(!showReview)}
                className="w-full flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    {showReview ? 'Hide Question Review' : 'Review All Questions'}
                  </span>
                </div>
                {showReview ? 
                  <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : 
                  <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                }
              </button>
            </div>

            {/* Question Review Section */}
            {showReview && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Question Review</h3>
                
                <div className="space-y-8">
                  {quizQuestions.map((question, index) => (
                    <QuestionDisplay 
                      key={question.id}
                      question={question}
                      userAnswer={selectedAnswers[index]}
                      showCorrectAnswers={true}
                      isReview={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Performance Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Breakdown</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Accuracy Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${results.passed ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${results.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{results.score}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(Object.keys(selectedAnswers).length / quizQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Math.round((Object.keys(selectedAnswers).length / quizQuestions.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetQuiz}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => navigate('/quizzes')}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Quizzes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Quiz Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-colors">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/quizzes')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{quiz.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isPreviewMode && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-sm rounded-full">
                  Preview Mode
                </span>
              )}
              {quizStarted && !isPreviewMode && (
                <QuizTimer 
                  initialTime={quiz.timeLimit * 60}
                  onTimeExpired={handleTimeExpired}
                  isPaused={showSubmitConfirm}
                />
              )}
              <span className={`px-3 py-1 text-sm rounded-full border ${
                quiz.difficulty === 'easy' 
                  ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                  : quiz.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                  : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
              }`}>
                {quiz.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{quiz.category}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{quizQuestions.length} Questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{quiz.timeLimit} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{quiz.passingScore}% to pass</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      {isPreviewMode ? (
        /* Preview Mode - Show all questions */
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quiz Preview</h3>
              <button
                onClick={startActualQuiz}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Start Quiz</span>
              </button>
            </div>
            
            <div className="space-y-8">
              {quizQuestions.map((question, index) => (
                <QuestionDisplay 
                  key={question.id}
                  question={question}
                  showCorrectAnswers={true}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Mode - Show one question at a time */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator - Left Sidebar */}
          <div className="lg:col-span-1">
            <QuestionNavigator 
              questions={quizQuestions}
              currentQuestionIndex={currentQuestionIndex}
              answeredQuestions={answeredQuestions}
              onQuestionSelect={setCurrentQuestionIndex}
              disabled={timeExpired}
            />
          </div>

          {/* Current Question */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              {/* Progress Bar */}
              <QuizProgressBar 
                currentQuestionIndex={currentQuestionIndex} 
                totalQuestions={quizQuestions.length} 
              />

              {/* Current Question */}
              <div className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-sm rounded-full">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                    {quizQuestions[currentQuestionIndex].category}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {quizQuestions[currentQuestionIndex].question}
                </h3>
                
                <div className="mb-8">
                  <QuestionInput 
                    question={quizQuestions[currentQuestionIndex]}
                    userAnswer={selectedAnswers[currentQuestionIndex]}
                    onAnswerChange={handleAnswerChange}
                    disabled={timeExpired}
                  />
                </div>

                {/* Navigation */}
                <QuizNavigation 
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={quizQuestions.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onFinish={handleFinishQuiz}
                  isLastQuestion={currentQuestionIndex === quizQuestions.length - 1}
                  isDisabled={timeExpired}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      <ConfirmSubmitModal 
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={confirmSubmit}
        answeredCount={Object.values(answeredQuestions).filter(Boolean).length}
        totalQuestions={quizQuestions.length}
        timeRemaining={timeRemaining}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default QuizPreview;