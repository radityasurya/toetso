import React, { useState } from 'react';
import { CheckCircle, Save, AlertTriangle } from 'lucide-react';

interface GradingInterfaceProps {
  questionId: string;
  questionText: string;
  studentAnswer: string;
  gradingCriteria?: string;
  maxScore: number;
  currentScore?: number;
  currentFeedback?: string;
  onSaveGrade: (score: number, feedback: string) => void;
  isSaving?: boolean;
}

const GradingInterface: React.FC<GradingInterfaceProps> = ({
  questionId,
  questionText,
  studentAnswer,
  gradingCriteria = '',
  maxScore = 5,
  currentScore,
  currentFeedback = '',
  onSaveGrade,
  isSaving = false
}) => {
  const [score, setScore] = useState(currentScore || 0);
  const [feedback, setFeedback] = useState(currentFeedback);
  const [errors, setErrors] = useState<{ score?: string; feedback?: string }>({});

  const validateForm = () => {
    const newErrors: { score?: string; feedback?: string } = {};
    
    if (score < 0 || score > maxScore) {
      newErrors.score = `Score must be between 0 and ${maxScore}`;
    }
    
    if (!feedback.trim()) {
      newErrors.feedback = 'Please provide feedback for the student';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSaveGrade(score, feedback);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Long Answer Response</h3>
      
      <div className="space-y-6">
        {/* Question */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question:</h4>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-900 dark:text-white">{questionText}</p>
          </div>
        </div>
        
        {/* Student Answer */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student's Answer:</h4>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-900 dark:text-white whitespace-pre-line">{studentAnswer || '(No answer provided)'}</p>
          </div>
        </div>
        
        {/* Grading Criteria */}
        {gradingCriteria && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grading Criteria:</h4>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300">{gradingCriteria}</p>
            </div>
          </div>
        )}
        
        {/* Score Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Score:</h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">Maximum: {maxScore} points</span>
          </div>
          <input
            type="number"
            min="0"
            max={maxScore}
            value={score}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setScore(isNaN(value) ? 0 : value);
              if (errors.score) setErrors({ ...errors, score: undefined });
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
              errors.score ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.score && (
            <div className="flex items-center space-x-1 mt-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{errors.score}</p>
            </div>
          )}
        </div>
        
        {/* Feedback Input */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Feedback for Student:</h4>
          <textarea
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              if (errors.feedback) setErrors({ ...errors, feedback: undefined });
            }}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
              errors.feedback ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Provide constructive feedback to the student..."
          />
          {errors.feedback && (
            <div className="flex items-center space-x-1 mt-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{errors.feedback}</p>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Grade</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradingInterface;