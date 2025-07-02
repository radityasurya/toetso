import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, User, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Quiz, Question } from '../../types';
import { mockQuizzes, mockQuestions } from '../../data/mockData';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../Auth/components/ThemeToggle';

// Import shared components
import QuestionInput from '../Common/QuizComponents/QuestionInput';
import QuizProgressBar from '../Common/QuizComponents/QuizProgressBar';
import QuizTimer from '../Common/QuizComponents/QuizTimer';
import QuizNavigation from '../Common/QuizComponents/QuizNavigation';
import QuestionNavigator from '../Common/QuizComponents/QuestionNavigator';
import ConfirmSubmitModal from '../Common/QuizComponents/ConfirmSubmitModal';
import QuestionDisplay from '../Common/QuizComponents/QuestionDisplay';

const StudentQuizTaking: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    // Get student info from localStorage
    const storedStudentInfo = localStorage.getItem('studentInfo');
    if (!storedStudentInfo) {
      navigate(`/quiz/${id}`);
      return;
    }
    setStudentInfo(JSON.parse(storedStudentInfo));

    // Get quiz data
    if (id) {
      const foundQuiz = mockQuizzes.find(q => q.id === id);
      if (foundQuiz && foundQuiz.isActive) {
        setQuiz(foundQuiz);
        const quizQuestions = mockQuestions.filter(q => foundQuiz.questions.includes(q.id));
        setQuestions(quizQuestions);
        setTimeRemaining(foundQuiz.timeLimit * 60); // Convert to seconds
      } else {
        navigate(`/quiz/${id}`);
      }
    }
  }, [id, navigate]);

  const handleAnswerChange = (answer: any) => {
    if (timeExpired) return;
    
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAutoSubmit = () => {
    setIsSubmitting(true);
    setTimeExpired(true);
    submitQuiz(true);
  };

  const handleSubmitQuiz = () => {
    // Make sure the current question's answer is included
    // This fixes the issue where the last question's answer might not be submitted
    const currentAnswer = answers[currentQuestionIndex];
    if (currentAnswer !== undefined) {
      setAnswers(prev => ({
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

  const submitQuiz = (autoSubmit: boolean) => {
    // Calculate results
    let correctAnswers = 0;
    let requiresGrading = false;
    
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      
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
      } else if (question.type === 'long-answer') {
        // Long answer questions require manual grading
        requiresGrading = true;
      }
    });
    
    // Calculate preliminary score (excluding long answer questions)
    const scorableQuestions = questions.filter(q => q.type !== 'long-answer').length;
    const preliminaryScore = scorableQuestions > 0 
      ? Math.round((correctAnswers / scorableQuestions) * 100)
      : 0;
    
    // For quizzes with only long answer questions, set a placeholder score
    const score = scorableQuestions > 0 ? preliminaryScore : 0;
    
    // Determine if the quiz is passed based on the preliminary score
    // Note: Final pass/fail status may change after manual grading
    const passed = quiz ? score >= quiz.passingScore : false;
    const timeSpent = quiz ? (quiz.timeLimit * 60) - timeRemaining : 0;

    // Store results
    const results = {
      studentInfo,
      quiz: quiz?.title,
      score,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent,
      passed,
      autoSubmit,
      completedAt: new Date().toISOString(),
      answers: answers,
      requiresGrading,
      gradingStatus: requiresGrading ? 'pending' : 'completed'
    };

    localStorage.setItem('quizResults', JSON.stringify(results));
    
    // Navigate to results page
    setTimeout(() => {
      navigate(`/quiz/${id}/results`);
    }, 1000);
  };

  const isQuestionAnswered = (index: number) => {
    const answer = answers[index];
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
    questions.map((_, index) => [index, isQuestionAnswered(index)])
  );

  const currentQuestion = questions[currentQuestionIndex];

  const toggleReview = () => {
    setShowReview(!showReview);
  };

  if (!quiz || !currentQuestion || !studentInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Student Info */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{studentInfo.name}</span>
              </div>

              {/* Timer */}
              <QuizTimer 
                initialTime={quiz.timeLimit * 60} 
                onTimeExpired={handleAutoSubmit}
                isPaused={showSubmitConfirm}
              />

              {/* Progress */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Object.values(answeredQuestions).filter(Boolean).length}/{questions.length} answered
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <QuizProgressBar 
              currentQuestionIndex={currentQuestionIndex} 
              totalQuestions={questions.length} 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Review Questions Button */}
        <div className="mb-6">
          <button
            onClick={toggleReview}
            className="w-full flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-700 dark:text-blue-300">
                {showReview ? 'Hide Answer Review' : 'Review Your Answers'}
              </span>
            </div>
            {showReview ? 
              <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : 
              <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            }
          </button>
        </div>

        {/* Review Panel */}
        {showReview && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Answers</h3>
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {questions.map((question, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Question {index + 1}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isQuestionAnswered(index) 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {isQuestionAnswered(index) ? 'Answered' : 'Not Answered'}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{question.question}</p>
                  
                  {isQuestionAnswered(index) ? (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Your Answer:</p>
                      <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        {renderAnswerPreview(question, answers[index])}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        You haven't answered this question yet.
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setCurrentQuestionIndex(index)}
                    className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Go to this question
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={toggleReview}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Continue Quiz
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator - Left Sidebar */}
          <div className="lg:col-span-1">
            <QuestionNavigator 
              questions={questions}
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
                totalQuestions={questions.length} 
              />

              {/* Current Question */}
              <div className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-sm rounded-full">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                    {currentQuestion.category}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{currentQuestion.question}</h2>
                
                <div className="mb-8">
                  <QuestionInput 
                    question={currentQuestion}
                    userAnswer={answers[currentQuestionIndex]}
                    onAnswerChange={handleAnswerChange}
                    disabled={timeExpired}
                  />
                </div>

                {/* Navigation */}
                <QuizNavigation 
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={questions.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onFinish={handleSubmitQuiz}
                  isLastQuestion={currentQuestionIndex === questions.length - 1}
                  isDisabled={timeExpired}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <ConfirmSubmitModal 
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={confirmSubmit}
        answeredCount={Object.values(answeredQuestions).filter(Boolean).length}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        isSubmitting={isSubmitting}
      />

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
};

// Helper function to render a preview of the user's answer
const renderAnswerPreview = (question: Question, answer: any): React.ReactNode => {
  if (!answer) return "No answer provided";
  
  switch (question.type) {
    case 'multiple-choice':
      const optionIndex = answer as number;
      return question.options?.[optionIndex] || "Invalid option";
      
    case 'multiple-answer':
      const selectedIndices = answer as number[];
      return (
        <ul className="list-disc list-inside">
          {selectedIndices.map(index => (
            <li key={index}>{question.options?.[index] || "Invalid option"}</li>
          ))}
        </ul>
      );
      
    case 'fill-in-blank':
      return answer as string;
      
    case 'long-answer':
      return <div dangerouslySetInnerHTML={{ __html: answer as string }} />;
      
    case 'matching':
      const matches = answer as { [key: string]: string };
      return (
        <ul className="list-disc list-inside">
          {Object.entries(matches).map(([left, right], index) => (
            <li key={index}>
              <span className="font-medium">{left}</span> → {right}
            </li>
          ))}
        </ul>
      );
      
    case 'ordering':
      const orderedItems = answer as string[];
      return (
        <ol className="list-decimal list-inside">
          {orderedItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      );
      
    default:
      return "Answer format not supported";
  }
};

export default StudentQuizTaking;