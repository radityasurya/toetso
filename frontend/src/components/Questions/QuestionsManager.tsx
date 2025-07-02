import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Edit, Trash2, Eye, List, CheckSquare, Type, AlignLeft, MoveHorizontal, ArrowUpDown } from 'lucide-react';
import { Question } from '../../types';
import { mockQuestions, categories } from '../../data/mockData';
import ConfirmationModal from '../Common/ConfirmationModal';
import Pagination from '../Common/Pagination';

const QuestionsManager: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; questionId: string; questionText: string }>({
    isOpen: false,
    questionId: '',
    questionText: ''
  });

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || question.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty;
    const matchesType = !selectedType || question.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  const handleEditQuestion = (id: string) => {
    navigate(`/questions/${id}/edit`);
  };

  const handleDeleteQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (!question) return;

    setDeleteModal({
      isOpen: true,
      questionId: id,
      questionText: question.question
    });
  };

  const confirmDelete = () => {
    setQuestions(questions.filter(q => q.id !== deleteModal.questionId));
    setDeleteModal({ isOpen: false, questionId: '', questionText: '' });
    
    // Reset to first page if current page becomes empty
    const newFilteredQuestions = questions.filter(q => q.id !== deleteModal.questionId);
    const newTotalPages = Math.ceil(newFilteredQuestions.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'multiple-answer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'fill-in-blank': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'long-answer': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'matching': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'ordering': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
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

  const getTypeLabel = (type: string) => {
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

  // Reset to first page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedType]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Question Management</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Create and manage questions for your driving theory exams
        </p>
      </div>

      {/* Page Navbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left side - Add button and search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/questions/new')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            title="Add new question"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
          
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>
        
        {/* Right side - Filters and view toggle */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="">All Types</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="multiple-answer">Multiple Answer</option>
            <option value="fill-in-blank">Fill in Blank</option>
            <option value="long-answer">Long Answer</option>
            <option value="matching">Matching</option>
            <option value="ordering">Ordering</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1 transition-colors">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title="Grid view"
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title="List view"
            >
              <div className="w-4 h-4 flex flex-col space-y-1">
                <div className="h-0.5 bg-current rounded"></div>
                <div className="h-0.5 bg-current rounded"></div>
                <div className="h-0.5 bg-current rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Questions Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginatedQuestions.map((question) => {
            const TypeIcon = getTypeIcon(question.type);
            
            return (
              <div key={question.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 card-hover flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">{question.question}</h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{question.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        <div className="flex items-center space-x-1">
                          <TypeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                            {getTypeLabel(question.type)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Grouped */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 ml-4">
                      <button
                        onClick={() => handleEditQuestion(question.id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                        title="Edit question"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Question Content Preview */}
                  {question.type === 'multiple-choice' || question.type === 'multiple-answer' ? (
                    <div className="space-y-2 mb-4">
                      {question.options?.slice(0, 3).map((option, index) => (
                        <div key={index} className={`p-2 rounded transition-colors ${
                          question.type === 'multiple-choice' && index === question.correctAnswer
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                            : question.type === 'multiple-answer' && question.correctAnswers?.includes(index)
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                            : 'bg-gray-50 dark:bg-gray-700'
                        }`}>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {String.fromCharCode(65 + index)}. {option}
                          </span>
                          {((question.type === 'multiple-choice' && index === question.correctAnswer) ||
                            (question.type === 'multiple-answer' && question.correctAnswers?.includes(index))) && (
                            <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-medium">✓ Correct</span>
                          )}
                        </div>
                      ))}
                      {question.options && question.options.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{question.options.length - 3} more options
                        </div>
                      )}
                    </div>
                  ) : question.type === 'fill-in-blank' ? (
                    <div className="mb-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Correct Answer: {question.correctText}
                        </span>
                      </div>
                    </div>
                  ) : question.type === 'long-answer' ? (
                    <div className="mb-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Requires manual grading • Max score: {question.maxScore || 5}
                        </span>
                      </div>
                    </div>
                  ) : question.type === 'matching' ? (
                    <div className="mb-4">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                        <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                          {question.matchingPairs?.length || 0} matching pairs
                        </span>
                      </div>
                    </div>
                  ) : question.type === 'ordering' ? (
                    <div className="mb-4">
                      <div className="p-3 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg">
                        <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
                          {question.correctOrder?.length || 0} items to order
                        </span>
                      </div>
                    </div>
                  ) : null}
                  
                  {question.explanation && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 transition-colors mb-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Question Footer with dates - Stick to bottom */}
                <div className="px-6 py-3 rounded-b-lg transition-colors mt-auto">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Created {question.createdAt.toLocaleDateString()}</span>
                    <span>Updated {question.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Question</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Category</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Difficulty</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Created</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedQuestions.map((question) => {
                  const TypeIcon = getTypeIcon(question.type);
                  
                  return (
                    <tr key={question.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="max-w-md">
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-2">{question.question}</p>
                          {question.explanation && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1">
                          <TypeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                            {getTypeLabel(question.type)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{question.category}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{question.createdAt.toLocaleDateString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                            <button
                              onClick={() => handleEditQuestion(question.id)}
                              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                              title="Edit Question"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                              title="Delete Question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination - After cards */}
      <div className="flex justify-between items-center">
        {/* Left side - Pagination */}
        <div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredQuestions.length}
            />
          )}
        </div>
        
        {/* Right side - Items per page selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-sm"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
        </div>
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm || selectedCategory || selectedDifficulty || selectedType
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first question.'}
          </p>
          {!searchTerm && !selectedCategory && !selectedDifficulty && !selectedType && (
            <button
              onClick={() => navigate('/questions/new')}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Question</span>
            </button>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, questionId: '', questionText: '' })}
        onConfirm={confirmDelete}
        title="Delete Question"
        message={`Are you sure you want to delete this question: "${deleteModal.questionText.substring(0, 100)}${deleteModal.questionText.length > 100 ? '...' : ''}"? This action cannot be undone.`}
        confirmText="Delete Question"
        type="danger"
      />
    </div>
  );
};

export default QuestionsManager;