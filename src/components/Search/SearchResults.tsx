import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { mockQuestions, mockQuizzes, categories } from '../../data/mockData';
import Pagination from '../Common/Pagination';
import SearchHeader from './components/SearchHeader';
import SearchFilters from './components/SearchFilters';
import SearchResultsList from './components/SearchResultsList';
import EmptySearchState from './components/EmptySearchState';

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
      <SearchHeader 
        query={query}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onGoBack={() => navigate(-1)}
        resultCount={sortedResults.length}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />

      {/* Filters */}
      {showFilters && (
        <SearchFilters 
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          filterCategory={filterCategory}
          onFilterCategoryChange={setFilterCategory}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onClearFilters={() => {
            setFilterType('all');
            setFilterCategory('');
            setSortBy('relevance');
          }}
          categories={categories}
        />
      )}

      {/* Results */}
      {sortedResults.length > 0 ? (
        <SearchResultsList results={paginatedResults} />
      ) : (
        <EmptySearchState 
          searchTerm={searchTerm}
          onClearSearch={() => {
            setSearchTerm('');
            setFilterType('all');
            setFilterCategory('');
          }}
        />
      )}

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
    </div>
  );
};

export default SearchResults;