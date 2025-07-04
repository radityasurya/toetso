import React from 'react';

interface FillInBlankCreatorProps {
  correctText: string;
  onCorrectTextChange: (correctText: string) => void;
}

const FillInBlankCreator: React.FC<FillInBlankCreatorProps> = ({
  correctText,
  onCorrectTextChange
}) => {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        Correct Answer:
      </label>
      <input
        type="text"
        value={correctText}
        onChange={(e) => onCorrectTextChange(e.target.value)}
        placeholder="Enter the correct answer..."
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
        required
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Students will need to type this exact answer (case-insensitive).
      </p>
    </div>
  );
};

export default FillInBlankCreator;