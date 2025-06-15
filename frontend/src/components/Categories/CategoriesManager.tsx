import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Tag, BarChart3, Eye, EyeOff } from 'lucide-react';
import type { Category } from 'shared/types/category';
import { fetchCategories } from '../../api/categories';
import { mockQuestions } from '../../data/mockData';
import ConfirmationModal from '../Common/ConfirmationModal';
import Pagination from '../Common/Pagination';

const CategoriesManager: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch from API on mount
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(e => console.error(e));
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; categoryId: string; categoryName: string }>({
    isOpen: false,
    categoryId: '',
    categoryName: ''
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
    
    let message = 'This action cannot be undone.';
    if (questionsInCategory > 0) {
      message = `This category contains ${questionsInCategory} questions. Deleting it will remove all associated questions. This action cannot be undone.`;
    }

    setDeleteModal({
      isOpen: true,
      categoryId: id,
      categoryName: category.name
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(deleteModal.categoryId);
      // Refresh categories from API
      const updated = await fetchCategories();
      setCategories(updated);
      setDeleteModal({ isOpen: false, categoryId: '', categoryName: '' });

      // Reset to first page if current page becomes empty
      const newTotalPages = Math.ceil(updated.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete category.');
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left side - Add button and search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/categories/new')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            title="Add new category"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
          
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>
        
        {/* Right side - View toggle */}
        <div className="flex items-center space-x-4">
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

      {/* Category Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.reduce((acc, cat) => acc + getCategoryStats(cat.name).total, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Questions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.length > 0 
                  ? Math.round(categories.reduce((acc, cat) => acc + getCategoryStats(cat.name).total, 0) / categories.length)
                  : 0
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Empty Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.filter(cat => getCategoryStats(cat.name).total === 0).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <EyeOff className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCategories.map((category) => {
            const stats = getCategoryStats(category.name);
            const isActive = stats.total > 0; // Categories with questions are considered "active"
            
            return (
              <div 
                key={category.id} 
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden card-hover flex flex-col ${
                  !isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Category Header */}
                <div className="p-6 pb-4 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{category.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{category.description}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Grouped */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 ml-3">
                      <button
                        onClick={() => handleEditCategory(category.id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Category Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Questions</p>
                    </div>
                    <div>
                      <div className="flex justify-center space-x-1 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" title={`${stats.easy} Easy`}></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" title={`${stats.medium} Medium`}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full" title={`${stats.hard} Hard`}></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Difficulty Mix</p>
                    </div>
                  </div>

                  {/* Difficulty Breakdown */}
                  {stats.total > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600 dark:text-green-400">Easy ({stats.easy})</span>
                        <span className="text-gray-500 dark:text-gray-400">{Math.round((stats.easy / stats.total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <div 
                          className="bg-green-500 h-1 rounded-full transition-all"
                          style={{ width: `${(stats.easy / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-yellow-600 dark:text-yellow-400">Medium ({stats.medium})</span>
                        <span className="text-gray-500 dark:text-gray-400">{Math.round((stats.medium / stats.total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <div 
                          className="bg-yellow-500 h-1 rounded-full transition-all"
                          style={{ width: `${(stats.medium / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-red-600 dark:text-red-400">Hard ({stats.hard})</span>
                        <span className="text-gray-500 dark:text-gray-400">{Math.round((stats.hard / stats.total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <div 
                          className="bg-red-500 h-1 rounded-full transition-all"
                          style={{ width: `${(stats.hard / stats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Empty State - Stick to bottom */}
                {stats.total === 0 && (
                  <div className="px-6 pb-4 mt-auto">
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No questions yet</p>
                    </div>
                  </div>
                )}
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
                  <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Category</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Description</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Questions</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Easy</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Medium</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Hard</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((category) => {
                  const stats = getCategoryStats(category.name);
                  const isActive = stats.total > 0;
                  
                  return (
                    <tr 
                      key={category.id} 
                      className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        !isActive ? 'opacity-60' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-semibold text-gray-900 dark:text-white">{stats.total}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-green-600 dark:text-green-400 font-medium">{stats.easy}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-yellow-600 dark:text-yellow-400 font-medium">{stats.medium}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-red-600 dark:text-red-400 font-medium">{stats.hard}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                            <button
                              onClick={() => handleEditCategory(category.id)}
                              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                              title="Edit Category"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                              title="Delete Category"
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
              onClick={() => navigate('/categories/new')}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Category</span>
            </button>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: '', categoryName: '' })}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteModal.categoryName}"? ${
          categories.find(c => c.id === deleteModal.categoryId) && 
          getCategoryStats(categories.find(c => c.id === deleteModal.categoryId)!.name).total > 0
            ? `This category contains ${getCategoryStats(categories.find(c => c.id === deleteModal.categoryId)!.name).total} questions. Deleting it will remove all associated questions. `
            : ''
        }This action cannot be undone.`}
        confirmText="Delete Category"
        type="danger"
      />
    </div>
  );
};

export default CategoriesManager;