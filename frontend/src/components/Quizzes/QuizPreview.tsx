import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Target, Users, Play, Eye, CheckCircle, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { Quiz, Question } from '../../types';
import { mockQuestions, mockQuizzes } from '../../data/mockData';

const QuizPreview: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

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

  useEffect(() => {
    document.title = 'Quiz Preview | Kuizzz';
  }, []);

  const quizQuestions = quiz ? mockQuestions.filter(q => quiz.questions.includes(q.id)) : [];
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (quizStarted && !isPreviewMode && !showResults && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimeExpired(true);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [quizStarted, isPreviewMode, showResults, timeRemaining]);

  const handleTimeExpired = () => {
    setShowResults(true);
    setQuizStarted(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (!quiz) return 'text-blue-600 bg-blue-50 border-blue-200';
    const percentage = (timeRemaining / (quiz.timeLimit * 60)) * 100;
    if (percentage <= 10) return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
    if (percentage <= 25) return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800';
    return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800';
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isPreviewMode || timeExpired) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex
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
    setShowResults(true);
    setQuizStarted(false);
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
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
    setQuizStarted(true);
    setTimeRemaining(quiz ? quiz.timeLimit * 60 : 0);
    setTimeExpired(false);
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
            {/* Results Summary */}
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                results.passed ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {results.passed ? (
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                )}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                results.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {results.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {results.passed 
                  ? `You passed the quiz with a score of ${results.score}%`
                  : `You scored ${results.score}%. You need ${quiz.passingScore}% to pass.`
                }
              </p>
              {timeExpired && (
                <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                  Quiz was automatically submitted when time expired.
                </p>
              )}
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center transition-colors">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{results.score}%</div>
                <div className="text-sm text-blue-800 dark:text-blue-300">Final Score</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center transition-colors">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {results.correctAnswers}/{quizQuestions.length}
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">Correct Answers</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center transition-colors">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{quiz.passingScore}%</div>
                <div className="text-sm text-purple-800 dark:text-purple-300">Required to Pass</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 text-center transition-colors">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {formatTime((quiz.timeLimit * 60) - timeRemaining)}
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">Time Used</div>
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
    <div className="max-w-4xl mx-auto">
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
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getTimeColor()}`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
                </div>
              )}
              <span className={`px-3 py-1 text-sm rounded-full border ${getDifficultyColor(quiz.difficulty)}`}>
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
                <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{question.question}</h4>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className={`p-3 rounded-lg border transition-colors ${
                            optionIndex === question.correctAnswer 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <span className="w-6 h-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              <span className="text-gray-900 dark:text-white">{option}</span>
                              {optionIndex === question.correctAnswer && (
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 ml-auto" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Mode - Show one question at a time */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{currentQuestion.question}</h3>
            
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={timeExpired}
                  className={`w-full p-4 text-left rounded-lg border transition-colors ${
                    timeExpired ? 'opacity-50 cursor-not-allowed' :
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedAnswers[currentQuestionIndex] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || timeExpired}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {currentQuestionIndex === quizQuestions.length - 1 ? (
                <button
                  onClick={handleFinishQuiz}
                  disabled={!timeExpired && selectedAnswers[currentQuestionIndex] === undefined}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Finish Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!timeExpired && selectedAnswers[currentQuestionIndex] === undefined}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPreview;
