import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowLeft, HelpCircle, FileText, Tag, Filter, ChevronDown } from 'lucide-react';
import { mockQuestions, mockQuizzes, categories } from '../../data/mockData';
import Pagination from '../Common/Pagination';

interface SearchResult {
  id: string;
  title: string;
  type: 'question' | 'quiz' | 'category';
  category?: string;
  description?: string;
  path: string;
  difficulty?: string;
  createdAt?: Date;
}

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [filterType, setFilterType] = useState<'all' | 'question' | 'quiz' | 'category'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  // Generate comprehensive search results
  const generateSearchResults = (): SearchResult[] => {
    const results: SearchResult[] = [];

    // Add questions
    mockQuestions.forEach(question => {
      results.push({
        id: question.id,
        title: question.question,
        type: 'question',
        category: question.category,
        description: question.explanation,
        path: `/questions/${question.id}/edit`,
        difficulty: question.difficulty,
        createdAt: question.createdAt
      });
    });

    // Add quizzes
    mockQuizzes.forEach(quiz => {
      results.push({
        id: quiz.id,
        title: quiz.title,
        type: 'quiz',
        category: quiz.category,
        description: quiz.description,
        path: `/quizzes/${quiz.id}/edit`,
        difficulty: quiz.difficulty,
        createdAt: quiz.createdAt
      });
    });

    // Add categories
    categories.forEach(category => {
      results.push({
        id: category.id,
        title: category.name,
        type: 'category',
        description: category.description,
        path: '/categories'
      });
    });

    return results;
  };

  const allResults = generateSearchResults();

  const filteredResults = allResults.filter(result => {
    const matchesSearch = !searchTerm || 
      result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || result.type === filterType;
    const matchesCategory = !filterCategory || result.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'relevance':
      default:
        // Simple relevance scoring based on search term position
        if (!searchTerm) return 0;
        const aScore = a.title.toLowerCase().indexOf(searchTerm.toLowerCase());
        const bScore = b.title.toLowerCase().indexOf(searchTerm.toLowerCase());
        if (aScore === -1 && bScore === -1) return 0;
        if (aScore === -1) return 1;
        if (bScore === -1) return -1;
        return aScore - bScore;
    }
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = sortedResults.slice(startIndex, endIndex);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'question': return HelpCircle;
      case 'quiz': return FileText;
      case 'category': return Tag;
      default: return Search;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'question': return 'text-green-500';
      case 'quiz': return 'text-purple-500';
      case 'category': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterCategory]);

  // Update search term when URL changes
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search Results</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {query ? `Results for "${query}"` : 'Browse all content'}
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions, quizzes, categories..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </form>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Found <span className="font-medium">{sortedResults.length}</span> results
            {searchTerm && <span> for "{searchTerm}"</span>}
          </p>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'question' | 'quiz' | 'category')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                <option value="all">All Types</option>
                <option value="question">Questions</option>
                <option value="quiz">Quizzes</option>
                <option value="category">Categories</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'title')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date Created</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterCategory('');
                  setSortBy('relevance');
                }}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="p-6">
          <div className="space-y-4">
            {paginatedResults.map((result) => {
              const Icon = getResultIcon(result.type);
              return (
                <div
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                >
                  <Icon className={`w-6 h-6 mt-1 ${getResultColor(result.type)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        result.type === 'question' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        result.type === 'quiz' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                      }`}>
                        {result.type}
                      </span>
                      {result.difficulty && (
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(result.difficulty)}`}>
                          {result.difficulty}
                        </span>
                      )}
                    </div>
                    
                    {result.category && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                        {result.category}
                      </p>
                    )}
                    
                    {result.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {result.description}
                      </p>
                    )}
                    
                    {result.createdAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Created {result.createdAt.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        {/* Left side - Pagination */}
        <div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={sortedResults.length}
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
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
        </div>
      </div>

      {/* Empty State */}
      {sortedResults.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors">
          <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm 
              ? `No results found for "${searchTerm}". Try adjusting your search terms or filters.`
              : 'Try searching for questions, quizzes, or categories.'
            }
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterCategory('');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;