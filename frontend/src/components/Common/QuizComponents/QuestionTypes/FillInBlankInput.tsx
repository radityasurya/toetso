import React from 'react';
import { Question } from '../../../../types';

interface FillInBlankInputProps {
  question: Question;
  userAnswer?: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
  showHints?: boolean;
}

const FillInBlankInput: React.FC<FillInBlankInputProps> = ({
  question,
  userAnswer = '',
  onAnswerChange,
  disabled = false,
  showHints = true
}) => {
  const handleTextAnswerChange = (value: string) => {
    if (disabled) return;
    onAnswerChange(value);
  };

  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Answer:
        </label>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => handleTextAnswerChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Type your answer here..."
        />
        {showHints && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Fill in the blank with the correct answer.
          </p>
        )}
      </div>
    </div>
  );
};

export default FillInBlankInput;