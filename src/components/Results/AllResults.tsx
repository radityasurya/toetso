import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Filter, ChevronDown } from 'lucide-react';
import { Quiz } from '../../types';
import { mockQuizzes, mockQuestions } from '../../data/mockData';
import Pagination from '../Common/Pagination';
import GradingStatusBadge from '../Common/QuizComponents/GradingStatusBadge';
import ResultsHeader from './components/ResultsHeader';
import ResultsFilters from './components/ResultsFilters';
import ResultsTable from './components/ResultsTable';
import ResultsStats from './components/ResultsStats';
import EmptyResultsState from './components/EmptyResultsState';

interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  studentName: string;
  studentEmail: string;
  score: number | null;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  status: 'needs_grading' | 'partially_graded' | 'graded' | 'passed' | 'failed';
  answers: { [questionIndex: number]: any };
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  feedback?: { [questionIndex: number]: string };
  manualScores?: { [questionIndex: number]: number };
  generalFeedback?: string;
}

const AllResults: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuiz, setFilterQuiz] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed' | 'needs_grading'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name' | 'quiz'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  // Generate mock comprehensive results data
  useEffect(() => {
    const mockAllResults: QuizResult[] = [];
    
    // Generate 30 mock results
    for (let i = 1; i <= 30; i++) {
      const quizIndex = Math.floor(Math.random() * mockQuizzes.length);
      const quiz = mockQuizzes[quizIndex];
      const quizQuestions = mockQuestions.filter(q => quiz.questions.includes(q.id));
      
      const score = Math.floor(Math.random() * 41) + 60; // Random score between 60-100
      const correctAnswers = Math.floor((score / 100) * quizQuestions.length);
      const answers: { [questionIndex: number]: any } = {};
      
      // Generate random answers for each question
      quizQuestions.forEach((question, index) => {
        if (question.type === 'multiple-choice') {
          answers[index] = Math.floor(Math.random() * (question.options?.length || 4));
        } else if (question.type === 'multiple-answer') {
          const numOptions = question.options?.length || 4;
          const numAnswers = Math.floor(Math.random() * numOptions) + 1;
          const selectedAnswers = [];
          for (let j = 0; j < numAnswers; j++) {
            selectedAnswers.push(Math.floor(Math.random() * numOptions));
          }
          answers[index] = [...new Set(selectedAnswers)]; // Remove duplicates
        } else if (question.type === 'fill-in-blank') {
          answers[index] = question.correctText || 'Sample answer';
        } else if (question.type === 'long-answer') {
          answers[index] = 'This is a sample long answer response that would require manual grading. The student has provided a detailed explanation that addresses some of the key points in the grading criteria, but may not be complete or fully accurate.';
        } else if (question.type === 'matching') {
          const matchingPairs = question.matchingPairs || [];
          const userMatches: { [key: string]: string } = {};
          matchingPairs.forEach(pair => {
            userMatches[pair.left] = pair.right; // For simplicity, correct answers
          });
          answers[index] = userMatches;
        } else if (question.type === 'ordering') {
          answers[index] = [...(question.correctOrder || [])]; // For simplicity, correct order
        }
      });
      
      // Determine submission status
      let status: 'needs_grading' | 'partially_graded' | 'graded' | 'passed' | 'failed';
      
      // Check if quiz has long answer questions
      const hasLongAnswerQuestions = quizQuestions.some(q => q.type === 'long-answer');
      
      if (hasLongAnswerQuestions && i % 5 === 0) {
        status = 'needs_grading';
      } else if (hasLongAnswerQuestions && i % 7 === 0) {
        status = 'partially_graded';
      } else if (score >= quiz.passingScore) {
        status = 'passed';
      } else {
        status = 'failed';
      }
      
      // Add feedback for some results
      const feedback: { [key: number]: string } = {};
      const manualScores: { [key: number]: number } = {};
      
      if (status !== 'needs_grading') {
        quizQuestions.forEach((question, index) => {
          if (question.type === 'long-answer' && (status !== 'partially_graded' || Math.random() > 0.5)) {
            feedback[index] = 'Good answer that covers most of the key points. You could improve by adding more specific examples.';
            manualScores[index] = Math.floor(Math.random() * 3) + 3; // Score between 3-5
          }
        });
      }
      
      // Add general feedback for some results
      const generalFeedback = i % 3 === 0 ? 
        "Overall good work. You've shown a solid understanding of the core concepts. Keep practicing the areas where you made mistakes." : 
        undefined;
      
      mockAllResults.push({
        id: `result-${i}`,
        quizId: quiz.id,
        quizTitle: quiz.title,
        studentName: `Student ${i}`,
        studentEmail: `student${i}@example.com`,
        score: status === 'needs_grading' ? null : score,
        totalQuestions: quizQuestions.length,
        correctAnswers,
        timeSpent: Math.floor(Math.random() * (quiz.timeLimit * 60 * 0.8)) + (quiz.timeLimit * 60 * 0.2), // Between 20%-100% of time limit
        completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last month
        status,
        answers,
        category: quiz.category,
        difficulty: quiz.difficulty,
        feedback,
        manualScores,
        generalFeedback
      });
    }
    
    // Sort by date (newest first)
    mockAllResults.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    
    setResults(mockAllResults);
  }, []);

  const filteredResults = results.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.quizTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuiz = !filterQuiz || result.quizId === filterQuiz;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'passed' && result.status === 'passed') ||
                         (filterStatus === 'failed' && result.status === 'failed') ||
                         (filterStatus === 'needs_grading' && (result.status === 'needs_grading' || result.status === 'partially_graded'));
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
        // Handle null scores (for needs_grading)
        if (a.score === null && b.score === null) comparison = 0;
        else if (a.score === null) comparison = 1;
        else if (b.score === null) comparison = -1;
        else comparison = a.score - b.score;
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
    const passedAttempts = results.filter(r => r.status === 'passed').length;
    const averageScore = Math.round(results.filter(r => r.score !== null).reduce((sum, r) => sum + (r.score || 0), 0) / results.filter(r => r.score !== null).length);
    const averageTime = Math.round(results.reduce((sum, r) => sum + r.timeSpent, 0) / totalAttempts);
    const passRate = Math.round((passedAttempts / totalAttempts) * 100);
    const needsGrading = results.filter(r => r.status === 'needs_grading' || r.status === 'partially_graded').length;
    
    return {
      totalAttempts,
      passedAttempts,
      averageScore,
      averageTime,
      passRate,
      needsGrading
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
        result.score !== null ? result.score : 'Pending',
        result.correctAnswers,
        result.totalQuestions,
        formatTime(result.timeSpent),
        result.status,
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
    // Navigate to the quiz results page with the specific student submission
    navigate(`/quizzes/${result.quizId}/results`, { 
      state: { 
        selectedSubmissionId: result.id,
        studentName: result.studentName,
        studentEmail: result.studentEmail
      } 
    });
  };

  const getDifficultyColor = (difficulty?: string) => {
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
      <ResultsHeader 
        title="All Quiz Results"
        subtitle="Comprehensive view of all quiz attempts and results"
        onExport={exportToCSV}
      />

      {/* Overall Statistics */}
      {stats && <ResultsStats stats={stats} formatTime={formatTime} />}

      {/* Filters and Search */}
      <ResultsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filterQuiz={filterQuiz}
        onFilterQuizChange={setFilterQuiz}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(newSortBy, newSortOrder) => {
          setSortBy(newSortBy as 'date' | 'score' | 'name' | 'quiz');
          setSortOrder(newSortOrder as 'asc' | 'desc');
        }}
        onClearFilters={() => {
          setFilterQuiz('');
          setFilterCategory('');
          setFilterStatus('all');
          setSearchTerm('');
        }}
        uniqueQuizzes={uniqueQuizzes}
        uniqueCategories={uniqueCategories}
      />

      {/* Results Table */}
      {sortedResults.length > 0 ? (
        <ResultsTable
          results={paginatedResults}
          onViewResult={viewStudentAnswers}
          getDifficultyColor={getDifficultyColor}
          formatTime={formatTime}
        />
      ) : (
        <EmptyResultsState 
          hasFilters={!!searchTerm || filterQuiz !== '' || filterStatus !== 'all' || filterCategory !== ''}
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
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
        </div>
      </div>
    </div>
  );
};

export default AllResults;