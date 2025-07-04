import React from 'react';
import { Question } from '../../../../types';

interface MultipleChoiceInputProps {
  question: Question;
  userAnswer?: number;
  onAnswerChange: (answer: number) => void;
  disabled?: boolean;
}

const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  disabled = false
}) => {
  const handleSingleAnswerSelect = (answerIndex: number) => {
    if (disabled) return;
    onAnswerChange(answerIndex);
  };

  return (
    <div className="space-y-3">
      {question.options?.map((option, index) => (
        <button
          key={index}
          onClick={() => handleSingleAnswerSelect(index)}
          disabled={disabled}
          className={`w-full p-4 text-left rounded-lg border transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' :
            userAnswer === index
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              userAnswer === index
                ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {userAnswer === index && (
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
  );
};

export default MultipleChoiceInput;