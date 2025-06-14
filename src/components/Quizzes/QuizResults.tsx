import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Search, Calendar, User, Trophy, Clock, Target, FileText, BarChart3, TrendingUp, TrendingDown, Eye, X } from 'lucide-react';
import { Quiz } from '../../types';
import { mockQuizzes, mockQuestions } from '../../data/mockData';
import Pagination from '../Common/Pagination';

interface QuizResult {
  id: string;
  studentName: string;
  studentEmail: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  passed: boolean;
  answers: { [questionIndex: number]: number };
}

const QuizResults: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Mock results data
  const mockResults: QuizResult[] = [
    {
      id: '1',
      studentName: 'John Smith',
      studentEmail: 'john.smith@email.com',
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      timeSpent: 720, // 12 minutes
      completedAt: new Date('2024-01-25T10:30:00'),
      passed: true,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2, 8: 0, 9: 1 }
    },
    {
      id: '2',
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.j@email.com',
      score: 92,
      totalQuestions: 10,
      correctAnswers: 9,
      timeSpent: 680, // 11.3 minutes
      completedAt: new Date('2024-01-25T14:15:00'),
      passed: true,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2, 8: 0, 9: 1 }
    },
    {
      id: '3',
      studentName: 'Mike Davis',
      studentEmail: 'mike.davis@email.com',
      score: 65,
      totalQuestions: 10,
      correctAnswers: 6,
      timeSpent: 900, // 15 minutes (time expired)
      completedAt: new Date('2024-01-24T16:45:00'),
      passed: false,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2, 8: 0, 9: 1 }
    },
    {
      id: '4',
      studentName: 'Emily Wilson',
      studentEmail: 'emily.w@email.com',
      score: 78,
      totalQuestions: 10,
      correctAnswers: 7,
      timeSpent: 540, // 9 minutes
      completedAt: new Date('2024-01-24T09:20:00'),
      passed: true,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2, 8: 0, 9: 1 }
    },
    {
      id: '5',
      studentName: 'David Brown',
      studentEmail: 'david.brown@email.com',
      score: 58,
      totalQuestions: 10,
      correctAnswers: 5,
      timeSpent: 780, // 13 minutes
      completedAt: new Date('2024-01-23T11:10:00'),
      passed: false,
      answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 2, 5: 0, 6: 1, 7: 2, 8: 0, 9: 1 }
    },
  ];

  useEffect(() => {
    if (id) {
      const foundQuiz = mockQuizzes.find(q => q.id === id);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setResults(mockResults);
      } else {
        navigate('/quizzes');
      }
    }
  }, [id, navigate]);

  const filteredResults = results.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'passed' && result.passed) ||
                         (filterStatus === 'failed' && !result.passed);
    
    return matchesSearch && matchesStatus;
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
    const headers = ['Student Name', 'Email', 'Score (%)', 'Correct Answers', 'Total Questions', 'Time Spent', 'Status', 'Completed At'];
    const csvData = [
      headers.join(','),
      ...sortedResults.map(result => [
        `"${result.studentName}"`,
        `"${result.studentEmail}"`,
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
    a.download = `${quiz?.title || 'quiz'}-results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // In a real application, you would use a library like jsPDF
    alert('PDF export functionality would be implemented here using a library like jsPDF');
  };

  const viewStudentAnswers = (result: QuizResult) => {
    setSelectedResult(result);
  };

  const stats = calculateStats();
  const quizQuestions = quiz ? mockQuestions.filter(q => quiz.questions.includes(q.id)) : [];

  // Reset to first page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Quiz not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Results</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Results and analytics for "{quiz.title}"
        </p>
      </div>

      {/* Quiz Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/quizzes')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Back to quizzes"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{quiz.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              title="Export results as CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              title="Export results as PDF"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{quiz.questions.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{quiz.timeLimit}m</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time Limit</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{quiz.passingScore}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Passing Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{quiz.difficulty}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Difficulty</div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAttempts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pass Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.passRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(stats.averageTime)}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Passed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.passedAttempts}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'passed' | 'failed')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="all">All Results</option>
            <option value="passed">Passed Only</option>
            <option value="failed">Failed Only</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy as 'date' | 'score' | 'name');
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
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Student</th>
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
                    <button
                      onClick={() => viewStudentAnswers(result)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="View student answers"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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
                    {selectedResult.studentName} - Score: {selectedResult.score}%
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
              <div className="space-y-6">
                {quizQuestions.map((question, index) => {
                  const studentAnswer = selectedResult.answers[index];
                  const isCorrect = studentAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCorrect ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">{question.question}</h4>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className={`p-2 rounded border ${
                                optionIndex === question.correctAnswer
                                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                  : optionIndex === studentAnswer && studentAnswer !== question.correctAnswer
                                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                              }`}>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  <span className="text-sm">{option}</span>
                                  {optionIndex === question.correctAnswer && (
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Correct</span>
                                  )}
                                  {optionIndex === studentAnswer && studentAnswer !== question.correctAnswer && (
                                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">✗ Student Answer</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                              <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No students have taken this quiz yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizResults;