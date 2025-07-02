import React from 'react';
import { X, Plus } from 'lucide-react';

interface MultipleAnswerCreatorProps {
  options: string[];
  correctAnswers: number[];
  onOptionsChange: (options: string[]) => void;
  onCorrectAnswersChange: (correctAnswers: number[]) => void;
}

const MultipleAnswerCreator: React.FC<MultipleAnswerCreatorProps> = ({
  options,
  correctAnswers,
  onOptionsChange,
  onCorrectAnswersChange
}) => {
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onOptionsChange(newOptions);
  };

  const handleMultipleAnswerChange = (index: number, checked: boolean) => {
    const newCorrectAnswers = checked 
      ? [...correctAnswers, index]
      : correctAnswers.filter(i => i !== index);
    
    onCorrectAnswersChange(newCorrectAnswers);
  };

  const addOption = () => {
    if (options.length < 6) {
      onOptionsChange([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      onOptionsChange(newOptions);
      
      // Update correct answers
      const newCorrectAnswers = correctAnswers
        .filter(answerIndex => answerIndex !== index)
        .map(answerIndex => answerIndex > index ? answerIndex - 1 : answerIndex);
      
      onCorrectAnswersChange(newCorrectAnswers);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={correctAnswers.includes(index)}
            onChange={(e) => handleMultipleAnswerChange(index, e.target.checked)}
            className="w-3 h-3 text-green-600 focus:ring-green-500"
          />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-4">
            {String.fromCharCode(65 + index)}.
          </span>
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${String.fromCharCode(65 + index)}`}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            required
          />
          {options.length > 2 && (
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
      {options.length < 6 && (
        <button
          type="button"
          onClick={addOption}
          className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center space-x-1"
        >
          <Plus className="w-3 h-3" />
          <span>Add Option</span>
        </button>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Select all options that should be correct answers.
      </p>
    </div>
  );
};

export default MultipleAnswerCreator;