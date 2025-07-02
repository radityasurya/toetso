import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { Quiz } from '../../types';
import { mockQuizzes, categories } from '../../data/mockData';
import ConfirmationModal from '../Common/ConfirmationModal';
import Pagination from '../Common/Pagination';
import QuizCard from './components/QuizCard';
import QuizList from './components/QuizList';
import QuizStats from './components/QuizStats';
import QuizFilters from './components/QuizFilters';
import EmptyQuizState from './components/EmptyQuizState';

const QuizzesManager: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedGradingStatus, setSelectedGradingStatus] = useState<'all' | 'requires' | 'none'>('all');
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
    const matchesGrading = selectedGradingStatus === 'all' || 
                          (selectedGradingStatus === 'requires' && quiz.requiresGrading) ||
                          (selectedGradingStatus === 'none' && !quiz.requiresGrading);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesGrading;
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
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedGradingStatus]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Management</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Create, manage, and monitor your driving theory quizzes
        </p>
      </div>

      {/* Quiz Statistics */}
      <QuizStats quizzes={quizzes} />

      {/* Page Navbar */}
      <QuizFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        selectedGradingStatus={selectedGradingStatus}
        onGradingStatusChange={setSelectedGradingStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddQuiz={() => navigate('/quizzes/new')}
        categories={categories}
      />

      {/* Quizzes Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onEdit={handleEditQuiz}
              onPreview={handlePreviewQuiz}
              onShare={handleShareQuiz}
              onViewResults={handleViewResults}
              onDelete={handleDeleteQuiz}
              onDuplicate={handleDuplicateQuiz}
              getCategoryColor={getCategoryColor}
              getDifficultyColor={getDifficultyColor}
            />
          ))}
        </div>
      ) : (
        <QuizList
          quizzes={paginatedQuizzes}
          onEdit={handleEditQuiz}
          onPreview={handlePreviewQuiz}
          onShare={handleShareQuiz}
          onViewResults={handleViewResults}
          onDelete={handleDeleteQuiz}
          onDuplicate={handleDuplicateQuiz}
          getCategoryColor={getCategoryColor}
          getDifficultyColor={getDifficultyColor}
          toggleStatus={toggleQuizStatus}
        />
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
        <EmptyQuizState
          hasFilters={!!searchTerm || !!selectedCategory || !!selectedDifficulty || selectedGradingStatus !== 'all'}
          onAddQuiz={() => navigate('/quizzes/new')}
        />
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