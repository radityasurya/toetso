import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Target, User, BookOpen, RotateCcw, Home, Award, AlertTriangle } from 'lucide-react';

const StudentQuizResults: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // No results found, redirect to quiz entry
      navigate(`/quiz/${id}`);
    }
  }, [id, navigate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score: number, passingScore: number) => {
    if (score >= passingScore) {
      return 'text-green-600 dark:text-green-400';
    }
    return 'text-red-600 dark:text-red-400';
  };

  const getGradeMessage = (passed: boolean, autoSubmit: boolean) => {
    if (autoSubmit) {
      return passed 
        ? "Congratulations! You passed even though time expired."
        : "Time expired, but don't worry - you can improve with practice.";
    }
    return passed 
      ? "Excellent work! You've successfully passed the quiz."
      : "Keep practicing! You're on the right track.";
  };

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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6 transition-colors">
          {/* Student Info */}
          <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{results.studentInfo.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{results.studentInfo.email}</p>
            </div>
          </div>

          {/* Score Display */}
          <div className="text-center mb-8">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
              results.passed ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              {results.passed ? (
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
              )}
            </div>
            
            <h3 className={`text-3xl font-bold mb-2 ${getScoreColor(results.score, 70)}`}>
              {results.score}%
            </h3>
            
            <p className={`text-lg font-semibold mb-2 ${
              results.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {results.passed ? 'PASSED' : 'NOT PASSED'}
            </p>
            
            <p className="text-gray-600 dark:text-gray-400">
              {getGradeMessage(results.passed, results.autoSubmit)}
            </p>

            {results.autoSubmit && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm text-orange-800 dark:text-orange-300">
                    Quiz was automatically submitted when time expired
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center transition-colors">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{results.score}%</div>
              <div className="text-sm text-blue-800 dark:text-blue-300">Final Score</div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center transition-colors">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {results.correctAnswers}/{results.totalQuestions}
              </div>
              <div className="text-sm text-green-800 dark:text-green-300">Correct Answers</div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center transition-colors">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">70%</div>
              <div className="text-sm text-purple-800 dark:text-purple-300">Required to Pass</div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 text-center transition-colors">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {formatTime(results.timeSpent)}
              </div>
              <div className="text-sm text-orange-800 dark:text-orange-300">Time Spent</div>
            </div>
          </div>
        </div>

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

        {/* Achievement Badge */}
        {results.passed && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 mb-6 text-white text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
            <p className="text-green-100">You've successfully completed the quiz and earned your certificate.</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What's Next?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!results.passed && (
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