import React from 'react';
import { CheckCircle, XCircle, Clock, Award } from 'lucide-react';

interface QuizResultsSummaryProps {
  score: number;
  passingScore: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  passed: boolean;
  autoSubmit?: boolean;
  requiresGrading?: boolean;
  gradingStatus?: 'pending' | 'completed';
  studentName?: string;
  studentEmail?: string;
}

const QuizResultsSummary: React.FC<QuizResultsSummaryProps> = ({
  score,
  passingScore,
  correctAnswers,
  totalQuestions,
  timeSpent,
  passed,
  autoSubmit = false,
  requiresGrading = false,
  gradingStatus = 'completed',
  studentName,
  studentEmail
}) => {
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

  const getGradeMessage = (passed: boolean, autoSubmit: boolean, requiresGrading: boolean) => {
    if (requiresGrading && gradingStatus === 'pending') {
      return "Your answers have been submitted. Some questions require manual grading and your final score will be available once grading is complete.";
    }
    
    if (autoSubmit) {
      return passed 
        ? "Congratulations! You passed even though time expired."
        : "Time expired, but don't worry - you can improve with practice.";
    }
    return passed 
      ? "Excellent work! You've successfully passed the quiz."
      : "Keep practicing! You're on the right track.";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6 transition-colors">
      {/* Student Info (if provided) */}
      {studentName && (
        <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {studentName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{studentName}</h2>
            {studentEmail && <p className="text-sm text-gray-600 dark:text-gray-400">{studentEmail}</p>}
          </div>
        </div>
      )}

      {/* Score Display */}
      <div className="text-center mb-8">
        {requiresGrading && gradingStatus === 'pending' ? (
          <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/20">
            <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        ) : (
          <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
          }`}>
            {passed ? (
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            )}
          </div>
        )}
        
        {requiresGrading && gradingStatus === 'pending' ? (
          <>
            <h3 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
              Pending
            </h3>
            <p className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
              AWAITING GRADING
            </p>
          </>
        ) : (
          <>
            <h3 className={`text-3xl font-bold mb-2 ${getScoreColor(score, passingScore)}`}>
              {score}%
            </h3>
            <p className={`text-lg font-semibold mb-2 ${
              passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {passed ? 'PASSED' : 'NOT PASSED'}
            </p>
          </>
        )}
        
        <p className="text-gray-600 dark:text-gray-400">
          {getGradeMessage(passed, autoSubmit, requiresGrading)}
        </p>

        {autoSubmit && (
          <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
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
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {requiresGrading && gradingStatus === 'pending' ? '—' : `${score}%`}
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-300">Final Score</div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center transition-colors">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {correctAnswers}/{totalQuestions}
          </div>
          <div className="text-sm text-green-800 dark:text-green-300">Correct Answers</div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center transition-colors">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{passingScore}%</div>
          <div className="text-sm text-purple-800 dark:text-purple-300">Required to Pass</div>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 text-center transition-colors">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {formatTime(timeSpent)}
          </div>
          <div className="text-sm text-orange-800 dark:text-orange-300">Time Spent</div>
        </div>
      </div>

      {/* Achievement Badge for passing */}
      {passed && !requiresGrading && (
        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white text-center">
          <Award className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
          <p className="text-green-100">You've successfully completed the quiz and earned your certificate.</p>
        </div>
      )}
    </div>
  );
};

export default QuizResultsSummary;