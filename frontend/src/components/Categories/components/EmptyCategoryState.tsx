import React from 'react';
import { Tag, Plus } from 'lucide-react';

interface EmptyCategoryStateProps {
  searchTerm: string;
  onAddCategory: () => void;
}

const EmptyCategoryState: React.FC<EmptyCategoryStateProps> = ({ searchTerm, onAddCategory }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <Tag className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {searchTerm 
          ? 'Try adjusting your search criteria.' 
          : 'Get started by creating your first category.'}
      </p>
      {!searchTerm && (
        <button
          onClick={onAddCategory}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Your First Category</span>
        </button>
      )}
    </div>
  );
};

export default EmptyCategoryState;