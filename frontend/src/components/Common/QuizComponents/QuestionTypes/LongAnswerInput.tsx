import React from 'react';
import { AlignLeft } from 'lucide-react';
import { Question } from '../../../../types';
import Editor from 'react-simple-wysiwyg';

interface LongAnswerInputProps {
  question: Question;
  userAnswer?: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
  showHints?: boolean;
}

const LongAnswerInput: React.FC<LongAnswerInputProps> = ({
  question,
  userAnswer = '',
  onAnswerChange,
  disabled = false,
  showHints = true
}) => {
  const handleLongAnswerChange = (e: any) => {
    if (disabled) return;
    onAnswerChange(e.target.value);
  };

  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2 mb-4">
          <AlignLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">Long Answer Question</span>
        </div>
        
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Answer:
        </label>
        <Editor
          value={userAnswer}
          onChange={handleLongAnswerChange}
          disabled={disabled}
          containerProps={{
            className: `w-full min-h-[200px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 dark:border-gray-600'
            }`
          }}
          placeholder="Type your detailed answer here..."
        />
        {showHints && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Provide a detailed response to the question. This answer will be manually graded.
          </p>
        )}
      </div>
    </div>
  );
};

export default LongAnswerInput;