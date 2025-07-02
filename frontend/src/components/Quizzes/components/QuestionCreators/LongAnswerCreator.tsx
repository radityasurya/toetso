import React from 'react';
import Editor from 'react-simple-wysiwyg';

interface LongAnswerCreatorProps {
  gradingCriteria: string;
  maxScore: number;
  onGradingCriteriaChange: (gradingCriteria: string) => void;
  onMaxScoreChange: (maxScore: number) => void;
}

const LongAnswerCreator: React.FC<LongAnswerCreatorProps> = ({
  gradingCriteria,
  maxScore,
  onGradingCriteriaChange,
  onMaxScoreChange
}) => {
  const handleGradingCriteriaChange = (e: any) => {
    onGradingCriteriaChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <span className="font-medium">Long Answer Question</span>
          <p className="text-xs mt-1">Requires manual grading</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Grading Criteria *
        </label>
        <Editor
          value={gradingCriteria}
          onChange={handleGradingCriteriaChange}
          containerProps={{
            className: "w-full min-h-[100px] border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          }}
          placeholder="Enter criteria for grading this question..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Describe what you're looking for in a good answer to help with consistent grading.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Maximum Score *
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={maxScore}
          onChange={(e) => onMaxScoreChange(parseInt(e.target.value) || 5)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
        />
      </div>
    </div>
  );
};

export default LongAnswerCreator;