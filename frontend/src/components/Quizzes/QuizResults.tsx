import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  Filter, 
  ChevronDown
} from 'lucide-react';
import { Quiz, Question } from '../../types';
import { mockQuizzes, mockQuestions } from '../../data/mockData';

// Import shared components
import SubmissionList from '../Common/QuizComponents/SubmissionList';
import SubmissionDetails from './components/SubmissionDetails';
import EmptySubmissionState from './components/EmptySubmissionState';

// Mock quiz results
interface QuizSubmission {
  id: string;
  studentName: string;
  studentEmail: string;
  submittedAt: Date;
  score: number | null;
  status: 'needs_grading' | 'partially_graded' | 'graded' | 'passed' | 'failed';
  answers: { [questionIndex: number]: any };
  timeSpent: number;
  feedback?: { [questionIndex: number]: string };
  manualScores?: { [questionIndex: number]: number };
  gradingStatus: 'pending' | 'completed' | 'partial';
  generalFeedback?: string;
}

const QuizResults: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed' | 'needs_grading'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  
  // Grading state
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  // Get the selected submission ID from location state (if coming from AllResults)
  const selectedSubmissionId = location.state?.selectedSubmissionId;
  const studentNameFromState = location.state?.studentName;
  const studentEmailFromState = location.state?.studentEmail;

  // Generate mock submissions
  useEffect(() => {
    if (id) {
      const foundQuiz = mockQuizzes.find(q => q.id === id);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        const quizQuestions = mockQuestions.filter(q => foundQuiz.questions.includes(q.id));
        setQuestions(quizQuestions);
        
        // Generate mock submissions
        const mockSubmissions: QuizSubmission[] = [];
        
        // Check if quiz has long answer questions that need grading
        const hasLongAnswerQuestions = quizQuestions.some(q => q.type === 'long-answer');
        
        // Generate 15 mock submissions
        for (let i = 1; i <= 15; i++) {
          const score = Math.floor(Math.random() * 41) + 60; // Random score between 60-100
          const answers: { [key: number]: any } = {};
          
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
          let gradingStatus: 'pending' | 'completed' | 'partial';
          
          if (score >= foundQuiz.passingScore) {
            status = 'passed';
            gradingStatus = 'completed';
          } else {
            status = 'failed';
            gradingStatus = 'completed';
          }
          
          // For some submissions, set needs_grading status if there are long answer questions
          if (hasLongAnswerQuestions && i % 3 === 0) {
            status = 'needs_grading';
            gradingStatus = 'pending';
          } else if (hasLongAnswerQuestions && i % 5 === 0) {
            status = 'partially_graded';
            gradingStatus = 'partial';
          }
          
          // Add feedback and scores for graded submissions
          const feedback: { [key: number]: string } = {};
          const manualScores: { [key: number]: number } = {};
          
          if (gradingStatus === 'completed' || gradingStatus === 'partial') {
            quizQuestions.forEach((question, index) => {
              if (question.type === 'long-answer') {
                if (gradingStatus === 'completed' || Math.random() > 0.5) {
                  feedback[index] = 'Good answer that covers most of the key points. You could improve by adding more specific examples.';
                  manualScores[index] = Math.floor(Math.random() * 3) + 3; // Score between 3-5
                }
              }
            });
          }
          
          // Add general feedback for some submissions
          const generalFeedback = i % 4 === 0 ? 
            "Overall good work. You've shown a solid understanding of the core concepts. Keep practicing the areas where you made mistakes." : 
            undefined;
          
          // Create a submission with the student name/email from state if this is the first one and we have state data
          const studentName = i === 1 && studentNameFromState ? studentNameFromState : `Student ${i}`;
          const studentEmail = i === 1 && studentEmailFromState ? studentEmailFromState : `student${i}@example.com`;
          const submissionId = i === 1 && selectedSubmissionId ? selectedSubmissionId : `submission-${i}`;
          
          mockSubmissions.push({
            id: submissionId,
            studentName,
            studentEmail,
            submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
            score,
            status,
            answers,
            timeSpent: Math.floor(Math.random() * (foundQuiz.timeLimit * 60 * 0.8)) + (foundQuiz.timeLimit * 60 * 0.2), // Between 20%-100% of time limit
            feedback,
            manualScores,
            gradingStatus,
            generalFeedback
          });
        }
        
        // Sort by date (newest first)
        mockSubmissions.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
        
        setSubmissions(mockSubmissions);
        
        // If we have a selected submission ID from state, find and select that submission
        if (selectedSubmissionId) {
          const submission = mockSubmissions.find(s => s.id === selectedSubmissionId);
          if (submission) {
            setSelectedSubmission(submission);
          }
        }
      } else {
        navigate('/quizzes');
      }
    }
  }, [id, navigate, selectedSubmissionId, studentNameFromState, studentEmailFromState]);

  // Filter and sort submissions
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'passed' && submission.status === 'passed') ||
                         (statusFilter === 'failed' && submission.status === 'failed') ||
                         (statusFilter === 'needs_grading' && (submission.status === 'needs_grading' || submission.status === 'partially_graded'));
    
    return matchesSearch && matchesStatus;
  });

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.submittedAt.getTime() - b.submittedAt.getTime();
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
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubmissions = sortedSubmissions.slice(startIndex, endIndex);

  const exportToCSV = () => {
    if (!quiz) return;
    
    const headers = ['Student Name', 'Email', 'Submission Date', 'Score', 'Status', 'Time Spent'];
    const csvData = [
      headers.join(','),
      ...sortedSubmissions.map(submission => [
        `"${submission.studentName}"`,
        `"${submission.studentEmail}"`,
        submission.submittedAt.toLocaleString(),
        submission.score !== null ? submission.score : 'Pending',
        submission.status,
        formatTime(submission.timeSpent)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title.replace(/\s+/g, '_')}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleViewSubmission = (submission: QuizSubmission) => {
    setSelectedSubmission(submission);
  };

  const handleSaveGrade = (questionIndex: number, score: number, feedback: string) => {
    if (!selectedSubmission) return;
    
    setIsSavingGrade(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update the submission with the new grade and feedback
      const updatedSubmission = { ...selectedSubmission };
      
      // Initialize feedback and manualScores objects if they don't exist
      if (!updatedSubmission.feedback) updatedSubmission.feedback = {};
      if (!updatedSubmission.manualScores) updatedSubmission.manualScores = {};
      
      // Add the new grade and feedback
      updatedSubmission.feedback[questionIndex] = feedback;
      updatedSubmission.manualScores[questionIndex] = score;
      
      // Check if all long answer questions are graded
      const longAnswerQuestions = questions.filter(q => q.type === 'long-answer');
      const longAnswerIndices = longAnswerQuestions.map(q => 
        questions.findIndex(question => question.id === q.id)
      );
      
      const allGraded = longAnswerIndices.every(index => 
        updatedSubmission.manualScores && updatedSubmission.manualScores[index] !== undefined
      );
      
      // Update grading status
      if (allGraded) {
        updatedSubmission.gradingStatus = 'completed';
        updatedSubmission.status = 'passed'; // This should be calculated based on the new total score
      } else {
        updatedSubmission.gradingStatus = 'partial';
        updatedSubmission.status = 'partially_graded';
      }
      
      // Recalculate the score
      let totalPoints = 0;
      let earnedPoints = 0;
      
      questions.forEach((question, index) => {
        const userAnswer = updatedSubmission.answers[index];
        
        if (question.type === 'long-answer') {
          // For long answer questions, use the manual score if available
          if (updatedSubmission.manualScores && updatedSubmission.manualScores[index] !== undefined) {
            const maxScore = question.maxScore || 5;
            totalPoints += maxScore;
            earnedPoints += updatedSubmission.manualScores[index];
          }
        } else {
          // For other question types, each question is worth 1 point
          totalPoints += 1;
          
          // Check if the answer is correct
          if (question.type === 'multiple-choice') {
            if (userAnswer === question.correctAnswer) {
              earnedPoints += 1;
            }
          } else if (question.type === 'multiple-answer') {
            const userAnswerArray = userAnswer as number[] || [];
            const correctAnswerArray = question.correctAnswers || [];
            
            if (userAnswerArray.length === correctAnswerArray.length && 
                userAnswerArray.every(val => correctAnswerArray.includes(val))) {
              earnedPoints += 1;
            }
          } else if (question.type === 'fill-in-blank') {
            const userText = (userAnswer as string || '').trim().toLowerCase();
            const correctText = (question.correctText || '').trim().toLowerCase();
            
            if (userText === correctText) {
              earnedPoints += 1;
            }
          } else if (question.type === 'matching') {
            const userMatches = userAnswer as { [key: string]: string } || {};
            const correctMatches = question.matchingPairs || [];
            
            if (correctMatches.every(pair => userMatches[pair.left] === pair.right) &&
                Object.keys(userMatches).length === correctMatches.length) {
              earnedPoints += 1;
            }
          } else if (question.type === 'ordering') {
            const userOrder = userAnswer as string[] || [];
            const correctOrder = question.correctOrder || [];
            
            if (userOrder.length === correctOrder.length && 
                userOrder.every((val, i) => val === correctOrder[i])) {
              earnedPoints += 1;
            }
          }
        }
      });
      
      // Calculate the new score
      const newScore = Math.round((earnedPoints / totalPoints) * 100);
      updatedSubmission.score = newScore;
      
      // Update the status based on the new score
      if (quiz && updatedSubmission.gradingStatus === 'completed') {
        updatedSubmission.status = newScore >= quiz.passingScore ? 'passed' : 'failed';
      }
      
      // Update the submissions array
      const updatedSubmissions = submissions.map(sub => 
        sub.id === updatedSubmission.id ? updatedSubmission : sub
      );
      
      setSubmissions(updatedSubmissions);
      setSelectedSubmission(updatedSubmission);
      setIsSavingGrade(false);
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleSaveGeneralFeedback = (feedback: string) => {
    if (!selectedSubmission) return;
    
    setIsSavingFeedback(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update the submission with the new feedback
      const updatedSubmission = { 
        ...selectedSubmission,
        generalFeedback: feedback
      };
      
      // Update the submissions array
      const updatedSubmissions = submissions.map(sub => 
        sub.id === updatedSubmission.id ? updatedSubmission : sub
      );
      
      setSubmissions(updatedSubmissions);
      setSelectedSubmission(updatedSubmission);
      setIsSavingFeedback(false);
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  const hasLongAnswerQuestions = questions.some(q => q.type === 'long-answer');
  const hasNeedsGradingSubmissions = submissions.some(s => s.status === 'needs_grading' || s.status === 'partially_graded');

  const handleFilterNeedsGrading = () => {
    setStatusFilter('needs_grading');
  };

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Loading quiz results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/quizzes')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{quiz.title} - Results</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {submissions.length} submissions • {quiz.questions.length} questions • {quiz.passingScore}% to pass
              </p>
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
          </div>
        </div>

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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'passed' | 'failed' | 'needs_grading')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="all">All Submissions</option>
              <option value="passed">Passed Only</option>
              <option value="failed">Failed Only</option>
              {hasLongAnswerQuestions && <option value="needs_grading">Needs Grading</option>}
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

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Score Range</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  <option value="all">All Scores</option>
                  <option value="90-100">90-100%</option>
                  <option value="80-89">80-89%</option>
                  <option value="70-79">70-79%</option>
                  <option value="0-69">Below 70%</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchTerm('');
                    setSortBy('date');
                    setSortOrder('desc');
                  }}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1">
          <SubmissionList 
            submissions={paginatedSubmissions
              .filter(sub => sub != null)
              .map(sub => ({
                id: sub.id,
                studentName: sub.studentName,
                studentEmail: sub.studentEmail,
                submittedAt: sub.submittedAt,
                score: sub.status === 'needs_grading' || sub.status === 'partially_graded' ? null : sub.score,
                status: sub.status
              }))}
            selectedSubmissionId={selectedSubmission?.id || null}
            onSelectSubmission={handleViewSubmission}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={sortedSubmissions.length}
          />
        </div>

        {/* Submission Details */}
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <SubmissionDetails
              submission={selectedSubmission}
              questions={questions}
              onSaveGrade={handleSaveGrade}
              onSaveGeneralFeedback={handleSaveGeneralFeedback}
              isSavingGrade={isSavingGrade}
              isSavingFeedback={isSavingFeedback}
              saveSuccess={saveSuccess}
            />
          ) : (
            <EmptySubmissionState
              hasNeedsGrading={hasNeedsGradingSubmissions}
              statusFilter={statusFilter}
              onFilterChange={handleFilterNeedsGrading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;