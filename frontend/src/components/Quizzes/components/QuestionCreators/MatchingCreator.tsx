import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface MatchingCreatorProps {
  matchingPairs: { left: string; right: string }[];
  onMatchingPairsChange: (matchingPairs: { left: string; right: string }[]) => void;
}

const MatchingCreator: React.FC<MatchingCreatorProps> = ({
  matchingPairs,
  onMatchingPairsChange
}) => {
  const handlePairChange = (index: number, side: 'left' | 'right', value: string) => {
    const newPairs = [...matchingPairs];
    newPairs[index] = { 
      ...newPairs[index], 
      [side]: value 
    };
    onMatchingPairsChange(newPairs);
  };

  const addPair = () => {
    onMatchingPairsChange([...matchingPairs, { left: '', right: '' }]);
  };

  const removePair = (index: number) => {
    if (matchingPairs.length > 1) {
      onMatchingPairsChange(matchingPairs.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
          Matching Pairs *
        </label>
        <button
          type="button"
          onClick={addPair}
          className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          title="Add another pair"
        >
          <Plus className="w-3 h-3" />
          <span>Add Pair</span>
        </button>
      </div>
      
      <div className="space-y-2">
        {matchingPairs.map((pair, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div>
              <input
                type="text"
                value={pair.left}
                onChange={(e) => handlePairChange(index, 'left', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Left item"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={pair.right}
                onChange={(e) => handlePairChange(index, 'right', e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Right item"
                required
              />
              {matchingPairs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePair(index)}
                  className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Create pairs of items that students will need to match correctly.
      </p>
    </div>
  );
};

export default MatchingCreator;