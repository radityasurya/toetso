import React from 'react';
import { Search, Plus, List, CheckSquare, Type, AlignLeft, MoveHorizontal, ArrowUpDown } from 'lucide-react';
import { Question } from '../../../types';
import { categories } from '../../../data/mockData';

interface AvailableQuestionListProps {
  availableQuestions: Question[];
  onAddQuestion: (questionId: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
}

const AvailableQuestionList: React.FC<AvailableQuestionListProps> = ({
  availableQuestions,
  onAddQuestion,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange
}) => {
  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return List;
      case 'multiple-answer': return CheckSquare;
      case 'fill-in-blank': return Type;
      case 'long-answer': return AlignLeft;
      case 'matching': return MoveHorizontal;
      case 'ordering': return ArrowUpDown;
      default: return List;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'multiple-answer': return 'Multiple Answer';
      case 'fill-in-blank': return 'Fill in Blank';
      case 'long-answer': return 'Long Answer';
      case 'matching': return 'Matching';
      case 'ordering': return 'Ordering';
      default: return 'Multiple Choice';
    }
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
        >
          <option value="">All Types</option>
          <option value="multiple-choice">Multiple Choice</option>
          <option value="multiple-answer">Multiple Answer</option>
          <option value="fill-in-blank">Fill in Blank</option>
          <option value="long-answer">Long Answer</option>
          <option value="matching">Matching</option>
          <option value="ordering">Ordering</option>
        </select>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-2">
        {availableQuestions.map(question => {
          const TypeIcon = getQuestionTypeIcon(question.type);
          
          return (
            <div 
              key={question.id} 
              onClick={() => onAddQuestion(question.id)}
              className="flex items-start justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <TypeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{getQuestionTypeLabel(question.type)}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{question.category}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{question.difficulty}</span>
                </div>
                <div 
                  className="text-sm font-medium text-gray-900 dark:text-white truncate"
                  dangerouslySetInnerHTML={{ __html: question.question }}
                />
              </div>
              <div className="ml-2 p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          );
        })}
        {availableQuestions.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No questions available</p>
        )}
      </div>
    </div>
  );
};

export default AvailableQuestionList;