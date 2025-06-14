import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Calendar, User, Trophy, Clock, Target, FileText, BarChart3, TrendingUp, TrendingDown, Eye, X, Filter, ChevronDown } from 'lucide-react';
import { Quiz } from '../../types';
import { mockQuizzes, mockQuestions } from '../../data/mockData';
import Pagination from '../Common/Pagination';

interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  studentName: string;
  studentEmail: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  passed: boolean;
  answers: { [questionIndex: number]: number };
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const AllResults: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuiz, setFilterQuiz] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name' | 'quiz'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  // Mock comprehensive results data
  const mockAllResults: QuizResult[] = [
    {
      id: '1',
      quizId: '1',
      quizTitle: 'Basic Traffic Signs',
      studentName: 'John Smith',
      studentEmail: 'john.smith@email.com',
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      timeSpent: 720,
      completedAt: new Date('2024-01-25T10:30:00'),
      passed: true,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2, 8: 0, 9: 1 },
      category: 'Traffic Signs',
      difficulty: 'easy'
    },
    {
      id: '2',
      quizId: '2',
      quizTitle: 'Road Rules Comprehensive',
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.j@email.com',
      score: 92,
      totalQuestions: 15,
      correctAnswers: 14,
      timeSpent: 1080,
      completedAt: new Date('2024-01-25T14:15:00'),
      passed: true,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2, 8: 0, 9: 1 },
      category: 'Road Rules',
      difficulty: 'medium'
    },
    {
      id: '3',
      quizId: '1',
      quizTitle: 'Basic Traffic Signs',
      studentName: 'Mike Davis',
      studentEmail: 'mike.davis@email.com',
      score: 65,
      totalQuestions: 10,
      correctAnswers: 6,
      timeSpent: 900,
      completedAt: new Date('2024-01-24T16:45:00'),
      passed: false,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2, 8: 0, 9: 1 },
      category: 'Traffic Signs',
      difficulty: 'easy'
    },
    {
      id: '4',
      quizId: '4',
      quizTitle: 'Emergency Response',
      studentName: 'Emily Wilson',
      studentEmail: 'emily.w@email.com',
      score: 78,
      totalQuestions: 8,
      correctAnswers: 6,
      timeSpent: 540,
      completedAt: new Date('2024-01-24T09:20:00'),
      passed: false,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2 },
      category: 'Emergency Situations',
      difficulty: 'hard'
    },
    {
      id: '5',
      quizId: '5',
      quizTitle: 'Parking Rules & Regulations',
      studentName: 'David Brown',
      studentEmail: 'david.brown@email.com',
      score: 88,
      totalQuestions: 12,
      correctAnswers: 10,
      timeSpent: 780,
      completedAt: new Date('2024-01-23T11:10:00'),
      passed: true,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2, 8: 0, 9: 1 },
      category: 'Parking',
      difficulty: 'medium'
    },
    {
      id: '6',
      quizId: '2',
      quizTitle: 'Road Rules Comprehensive',
      studentName: 'Lisa Anderson',
      studentEmail: 'lisa.a@email.com',
      score: 73,
      totalQuestions: 15,
      correctAnswers: 11,
      timeSpent: 1200,
      completedAt: new Date('2024-01-23T15:30:00'),
      passed: false,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2, 8: 0, 9: 1 },
      category: 'Road Rules',
      difficulty: 'medium'
    },
    {
      id: '7',
      quizId: '3',
      quizTitle: 'Vehicle Safety Essentials',
      studentName: 'Robert Taylor',
      studentEmail: 'robert.t@email.com',
      score: 95,
      totalQuestions: 6,
      correctAnswers: 6,
      timeSpent: 360,
      completedAt: new Date('2024-01-22T13:45:00'),
      passed: true,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0 },
      category: 'Vehicle Safety',
      difficulty: 'easy'
    },
    {
      id: '8',
      quizId: '4',
      quizTitle: 'Emergency Response',
      studentName: 'Jennifer Lee',
      studentEmail: 'jennifer.l@email.com',
      score: 82,
      totalQuestions: 8,
      correctAnswers: 7,
      timeSpent: 600,
      completedAt: new Date('2024-01-22T10:15:00'),
      passed: false,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2 },
      category: 'Emergency Situations',
      difficulty: 'hard'
    }
  ];

  useEffect(() => {
    setResults(mockAllResults);
  }, []);

  const filteredResults = results.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.quizTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuiz = !filterQuiz || result.quizId === filterQuiz;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'passed' && result.passed) ||
                         (filterStatus === 'failed' && !result.passed);
    const matchesCategory = !filterCategory || result.category === filterCategory;
    
    return matchesSearch && matchesQuiz && matchesStatus && matchesCategory;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.completedAt.getTime() - b.completedAt.getTime();
        break;
      case 'score':
        comparison = a.score - b.score;
        break;
      case 'name':
        comparison = a.studentName.localeCompare(b.studentName);
        break;
      case 'quiz':
        comparison = a.quizTitle.localeCompare(b.quizTitle);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = sortedResults.slice(startIndex, endIndex);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculateStats = () => {
    if (results.length === 0) return null;
    
    const totalAttempts = results.length;
    const passedAttempts = results.filter(r => r.passed).length;
    const averageScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalAttempts);
    const averageTime = Math.round(results.reduce((sum, r) => sum + r.timeSpent, 0) / totalAttempts);
    const passRate = Math.round((passedAttempts / totalAttempts) * 100);
    
    return {
      totalAttempts,
      passedAttempts,
      averageScore,
      averageTime,
      passRate
    };
  };

  const exportToCSV = () => {
    const headers = ['Student Name', 'Email', 'Quiz', 'Category', 'Score (%)', 'Correct Answers', 'Total Questions', 'Time Spent', 'Status', 'Completed At'];
    const csvData = [
      headers.join(','),
      ...sortedResults.map(result => [
        `"${result.studentName}"`,
        `"${result.studentEmail}"`,
        `"${result.quizTitle}"`,
        `"${result.category}"`,
        result.score,
        result.correctAnswers,
        result.totalQuestions,
        formatTime(result.timeSpent),
        result.passed ? 'Passed' : 'Failed',
        result.completedAt.toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-quiz-results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const viewStudentAnswers = (result: QuizResult) => {
    setSelectedResult(result);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const stats = calculateStats();
  const uniqueQuizzes = Array.from(new Set(results.map(r => r.quizId))).map(id => {
    const result = results.find(r => r.quizId === id);
    return { id, title: result?.quizTitle || '' };
  });
  const uniqueCategories = Array.from(new Set(results.map(r => r.category)));

  // Reset to first page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterQuiz, filterStatus, filterCategory]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Quiz Results</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive view of all quiz attempts and results</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              title="Export all results as CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Overall Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{stats.totalAttempts}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{stats.passRate}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{stats.averageScore}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatTime(stats.averageTime)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{stats.passedAttempts}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Passed</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students, quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as 'date' | 'score' | 'name' | 'quiz');
                setSortOrder(newSortOrder as 'asc' | 'desc');
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="quiz-asc">Quiz A-Z</option>
              <option value="quiz-desc">Quiz Z-A</option>
            </select>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quiz</label>
              <select
                value={filterQuiz}
                onChange={(e) => setFilterQuiz(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                <option value="">All Quizzes</option>
                {uniqueQuizzes.map(quiz => (
                  <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                ))}
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
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'passed' | 'failed')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                <option value="all">All Results</option>
                <option value="passed">Passed Only</option>
                <option value="failed">Failed Only</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterQuiz('');
                  setFilterCategory('');
                  setFilterStatus('all');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Student</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Quiz</th>
                <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Score</th>
                <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Correct</th>
                <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Time</th>
                <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Completed</th>
                <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedResults.map((result) => (
                <tr key={result.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{result.studentName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{result.studentEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{result.quizTitle}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{result.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(result.difficulty)}`}>
                          {result.difficulty}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`text-lg font-bold ${
                        result.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {result.score}%
                      </span>
                      {result.score >= 90 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : result.score < 60 ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : null}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-gray-900 dark:text-white">
                      {result.correctAnswers}/{result.totalQuestions}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatTime(result.timeSpent)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.passed 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                    }`}>
                      {result.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div>{result.completedAt.toLocaleDateString()}</div>
                      <div>{result.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => viewStudentAnswers(result)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="View student answers"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/quizzes/${result.quizId}/results`)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        title="View quiz results"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
        </div>
      </div>

      {/* Student Answers Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Answers</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedResult.studentName} - {selectedResult.quizTitle} - Score: {selectedResult.score}%
                  </p>
                </div>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Detailed Answer Review</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This feature would show the detailed breakdown of each question and the student's answers.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left max-w-md mx-auto">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Summary:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Score: {selectedResult.score}%</li>
                    <li>• Correct: {selectedResult.correctAnswers}/{selectedResult.totalQuestions}</li>
                    <li>• Time: {formatTime(selectedResult.timeSpent)}</li>
                    <li>• Status: {selectedResult.passed ? 'Passed' : 'Failed'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedResults.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || filterQuiz || filterStatus !== 'all' || filterCategory
              ? 'Try adjusting your search or filter criteria.'
              : 'No quiz results available yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AllResults;