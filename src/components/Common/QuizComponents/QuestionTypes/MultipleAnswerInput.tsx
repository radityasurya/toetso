import React from 'react';
import { CheckSquare } from 'lucide-react';
import { Question } from '../../../../types';

interface MultipleAnswerInputProps {
  question: Question;
  userAnswer?: number[];
  onAnswerChange: (answer: number[]) => void;
  disabled?: boolean;
  showHints?: boolean;
}

const MultipleAnswerInput: React.FC<MultipleAnswerInputProps> = ({
  question,
  userAnswer = [],
  onAnswerChange,
  disabled = false,
  showHints = true
}) => {
  const handleMultipleAnswerSelect = (index: number, checked: boolean) => {
    if (disabled) return;
    
    const currentAnswers = [...userAnswer];
    
    // Toggle the selection
    const newAnswers = checked 
      ? [...currentAnswers, index]
      : currentAnswers.filter(i => i !== index);
    
    onAnswerChange(newAnswers);
  };

  return (
    <div className="space-y-3">
      {question.options?.map((option, index) => {
        const isSelected = userAnswer.includes(index);
        
        return (
          <button
            key={index}
            onClick={() => handleMultipleAnswerSelect(index, !isSelected)}
            disabled={disabled}
            className={`w-full p-4 text-left rounded-lg border transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' :
              isSelected
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                isSelected
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {isSelected && (
                  <CheckSquare className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="text-gray-900 dark:text-white">{option}</span>
            </div>
          </button>
        );
      })}
      {showHints && (
        <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
          <span className="font-medium">Note:</span> Select all correct answers that apply.
        </div>
      )}
    </div>
  );
};

export default MultipleAnswerInput;