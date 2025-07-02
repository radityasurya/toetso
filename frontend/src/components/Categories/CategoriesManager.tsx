import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types';
import { categories as initialCategories, mockQuestions } from '../../data/mockData';
import ConfirmationModal from '../Common/ConfirmationModal';
import Pagination from '../Common/Pagination';
import CategoryGrid from './components/CategoryGrid';
import CategoryList from './components/CategoryList';
import CategoryStats from './components/CategoryStats';
import CategoryHeader from './components/CategoryHeader';
import EmptyCategoryState from './components/EmptyCategoryState';

const CategoriesManager: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    categoryId: string;
    categoryName: string;
    questionsInCategory?: number;
  }>({
    isOpen: false,
    categoryId: '',
    categoryName: '',
    questionsInCategory: 0,
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const handleEditCategory = (id: string) => {
    navigate(`/categories/${id}/edit`);
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    const questionsInCategory = mockQuestions.filter(q => q.category === category.name).length;
    setDeleteModal({
      isOpen: true,
      categoryId: id,
      categoryName: category.name,
      questionsInCategory,
    });
  };

  const confirmDelete = () => {
    setCategories(categories.filter(c => c.id !== deleteModal.categoryId));
    setDeleteModal({ isOpen: false, categoryId: '', categoryName: '', questionsInCategory: 0 });
    // Reset to first page if current page becomes empty
    const newFilteredCategories = categories.filter(c => c.id !== deleteModal.categoryId);
    const newTotalPages = Math.ceil(newFilteredCategories.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const getCategoryStats = (categoryName: string) => {
    const questionsInCategory = mockQuestions.filter(q => q.category === categoryName);
    const easyQuestions = questionsInCategory.filter(q => q.difficulty === 'easy').length;
    const mediumQuestions = questionsInCategory.filter(q => q.difficulty === 'medium').length;
    const hardQuestions = questionsInCategory.filter(q => q.difficulty === 'hard').length;
    
    return {
      total: questionsInCategory.length,
      easy: easyQuestions,
      medium: mediumQuestions,
      hard: hardQuestions,
    };
  };

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Category Management</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Organize your questions into categories for better structure
        </p>
      </div>

      {/* Page Navbar */}
      <CategoryHeader 
        onAddCategory={() => navigate('/categories/new')}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Category Statistics */}
      <CategoryStats 
        categories={categories}
        getCategoryStats={getCategoryStats}
      />

      {/* Categories Display */}
      {viewMode === 'grid' ? (
        <CategoryGrid 
          categories={paginatedCategories}
          getCategoryStats={getCategoryStats}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      ) : (
        <CategoryList 
          categories={paginatedCategories}
          getCategoryStats={getCategoryStats}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
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
              totalItems={filteredCategories.length}
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
      {filteredCategories.length === 0 && (
        <EmptyCategoryState 
          searchTerm={searchTerm}
          onAddCategory={() => navigate('/categories/new')}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: '', categoryName: '', questionsInCategory: 0 })}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteModal.categoryName}"? ${
          deleteModal.questionsInCategory && deleteModal.questionsInCategory > 0
            ? `This category contains ${deleteModal.questionsInCategory} questions. Deleting it will remove all associated questions. `
            : ''
        }This action cannot be undone.`}
        confirmText="Delete Category"
        type="danger"
      />
    </div>
  );
};

export default CategoriesManager;