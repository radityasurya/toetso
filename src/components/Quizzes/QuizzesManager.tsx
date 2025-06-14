import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Play, Users, Clock, Target, Eye, Copy, Share2, BarChart3 } from 'lucide-react';
import { Quiz } from '../../types';
import { mockQuizzes, categories } from '../../data/mockData';
import ConfirmationModal from '../Common/ConfirmationModal';
import Pagination from '../Common/Pagination';

const QuizzesManager: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; quizId: string; quizTitle: string }>({
    isOpen: false,
    quizId: '',
    quizTitle: ''
  });

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || quiz.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || quiz.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuizzes = filteredQuizzes.slice(startIndex, endIndex);

  const handleEditQuiz = (id: string) => {
    navigate(`/quizzes/${id}/edit`);
  };

  const handlePreviewQuiz = (id: string) => {
    navigate(`/quizzes/${id}/preview`);
  };

  const handleShareQuiz = (id: string) => {
    navigate(`/quizzes/${id}/share`);
  };

  const handleViewResults = (id: string) => {
    navigate(`/quizzes/${id}/results`);
  };

  const handleDeleteQuiz = (id: string) => {
    const quiz = quizzes.find(q => q.id === id);
    if (!quiz) return;

    setDeleteModal({
      isOpen: true,
      quizId: id,
      quizTitle: quiz.title
    });
  };

  const confirmDelete = () => {
    setQuizzes(quizzes.filter(q => q.id !== deleteModal.quizId));
    setDeleteModal({ isOpen: false, quizId: '', quizTitle: '' });
    
    // Reset to first page if current page becomes empty
    const newFilteredQuizzes = quizzes.filter(q => q.id !== deleteModal.quizId);
    const newTotalPages = Math.ceil(newFilteredQuizzes.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleDuplicateQuiz = (quiz: Quiz) => {
    const duplicatedQuiz: Quiz = {
      ...quiz,
      id: Date.now().toString(),
      title: `${quiz.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setQuizzes([...quizzes, duplicatedQuiz]);
  };

  const toggleQuizStatus = (id: string) => {
    setQuizzes(quizzes.map(quiz => 
      quiz.id === id ? { ...quiz, isActive: !quiz.isActive, updatedAt: new Date() } : quiz
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#6B7280';
  };

  // Reset to first page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Management</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Create, manage, and monitor your driving theory quizzes
        </p>
      </div>

      {/* Page Navbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left side - Add button and search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/quizzes/new')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            title="Create new quiz"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quiz</span>
          </button>
          
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>
        
        {/* Right side - Filters and view toggle */}
        <div className="flex items-center space-x-4">
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

      {/* Quiz Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Quizzes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.filter(q => q.isActive).length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Questions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {quizzes.length > 0 ? Math.round(quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0) / quizzes.length) : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Time Limit</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {quizzes.length > 0 ? Math.round(quizzes.reduce((acc, quiz) => acc + quiz.timeLimit, 0) / quizzes.length) : 0}m
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedQuizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden card-hover flex flex-col ${
                !quiz.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Quiz Header */}
              <div className="p-6 pb-4 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(quiz.category) }}
                      ></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{quiz.category}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{quiz.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{quiz.description}</p>
                  </div>
                  
                  {/* Action Buttons - Grouped */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 ml-3">
                    <button
                      onClick={() => handleEditQuiz(quiz.id)}
                      className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                      title="Edit quiz"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateQuiz(quiz)}
                      className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                      title="Duplicate Quiz"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                      title="Delete quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quiz Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{quiz.questions.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Questions</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{quiz.timeLimit}m</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Time Limit</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{quiz.passingScore}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pass Score</p>
                  </div>
                </div>
              </div>

              {/* Quiz Actions - Stick to bottom */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 transition-colors mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShareQuiz(quiz.id)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      title="Share Quiz"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleViewResults(quiz.id)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      title="View Results"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handlePreviewQuiz(quiz.id)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Preview Quiz"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                    <button 
                      onClick={() => handlePreviewQuiz(quiz.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      title="Start Quiz"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quiz Footer with dates - Stick to bottom */}
              <div className="px-6 py-3 rounded-b-lg transition-colors">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Created {quiz.createdAt.toLocaleDateString()}</span>
                  <span>Updated {quiz.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Quiz</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Category</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Difficulty</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Questions</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Time</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Pass %</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Created</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedQuizzes.map((quiz) => (
                  <tr 
                    key={quiz.id} 
                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !quiz.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{quiz.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{quiz.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getCategoryColor(quiz.category) }}
                        ></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{quiz.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-semibold text-gray-900 dark:text-white">{quiz.questions.length}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-gray-600 dark:text-gray-400">{quiz.timeLimit}m</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-gray-600 dark:text-gray-400">{quiz.passingScore}%</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{quiz.createdAt.toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                          <button
                            onClick={() => handleEditQuiz(quiz.id)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                            title="Edit Quiz"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShareQuiz(quiz.id)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                            title="Share Quiz"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewResults(quiz.id)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                            title="View Results"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePreviewQuiz(quiz.id)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                            title="Preview Quiz"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateQuiz(quiz)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                            title="Duplicate Quiz"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                            title="Delete Quiz"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
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
              totalItems={filteredQuizzes.length}
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

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No quizzes found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm || selectedCategory || selectedDifficulty 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first quiz.'}
          </p>
          {!searchTerm && !selectedCategory && !selectedDifficulty && (
            <button
              onClick={() => navigate('/quizzes/new')}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Quiz</span>
            </button>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, quizId: '', quizTitle: '' })}
        onConfirm={confirmDelete}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${deleteModal.quizTitle}"? This action cannot be undone and will remove all associated quiz data.`}
        confirmText="Delete Quiz"
        type="danger"
      />
    </div>
  );
};

export default QuizzesManager;