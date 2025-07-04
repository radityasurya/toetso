import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  RotateCcw, 
  Home, 
  ChevronDown, 
  ChevronUp, 
  Eye,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { mockQuestions, mockQuizzes } from '../../data/mockData';

// Import shared components
import QuestionDisplay from '../Common/QuizComponents/QuestionDisplay';
import QuizResultsSummary from '../Common/QuizComponents/QuizResultsSummary';

const StudentQuizResults: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<any>(null);
  const [showReview, setShowReview] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  useEffect(() => {
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      setResults(parsedResults);
      
      // Get the quiz questions for review
      if (id) {
        const quiz = mockQuizzes.find(q => q.id === id);
        if (quiz) {
          const questions = mockQuestions.filter(q => quiz.questions.includes(q.id));
          setQuizQuestions(questions);
        }
      }
    } else {
      // No results found, redirect to quiz entry
      navigate(`/quiz/${id}`);
    }
  }, [id, navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

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
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Results</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{results.quiz}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Results Summary */}
        <QuizResultsSummary 
          score={results.score}
          passingScore={70} // This should ideally come from the quiz data
          correctAnswers={results.correctAnswers}
          totalQuestions={results.totalQuestions}
          timeSpent={results.timeSpent}
          passed={results.passed}
          autoSubmit={results.autoSubmit}
          requiresGrading={results.requiresGrading}
          gradingStatus={results.gradingStatus}
          studentName={results.studentInfo.name}
          studentEmail={results.studentInfo.email}
        />

        {/* Review Questions Button */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors">
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
              {quizQuestions.map((question, index) => {
                const userAnswer = results.answers[index];
                const isPendingGrading = question.type === 'long-answer';
                const feedback = results.feedback?.[index];
                const manualScore = results.manualScores?.[index];
                
                return (
                  <QuestionDisplay 
                    key={question.id}
                    question={question}
                    userAnswer={userAnswer}
                    showCorrectAnswers={true}
                    isReview={true}
                    isPendingGrading={isPendingGrading}
                    feedback={feedback}
                    manualScore={manualScore}
                    gradingStatus={results.gradingStatus}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* General Feedback */}
        {results.generalFeedback && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Instructor Feedback</h3>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300">{results.generalFeedback}</p>
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
                    style={{ width: `${(Object.keys(results.answers).length / results.totalQuestions) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {Math.round((Object.keys(results.answers).length / results.totalQuestions) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What's Next?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!results.passed && !results.requiresGrading && (
              <button
                onClick={() => {
                  localStorage.removeItem('quizResults');
                  localStorage.removeItem('studentInfo');
                  navigate(`/quiz/${id}`);
                }}
                className="flex items-center justify-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-700 dark:text-blue-300">Retake Quiz</span>
              </button>
            )}
            
            <button
              onClick={() => {
                localStorage.removeItem('quizResults');
                localStorage.removeItem('studentInfo');
                window.close();
              }}
              className="flex items-center justify-center space-x-2 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Close</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quiz completed on {new Date(results.completedAt).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Results have been saved and sent to your instructor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentQuizResults;