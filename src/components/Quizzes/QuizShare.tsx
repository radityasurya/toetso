import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Copy, Link, QrCode, Eye, Users, Clock, Target, CheckCircle, XCircle } from 'lucide-react';
import { Quiz } from '../../types';
import { mockQuizzes } from '../../data/mockData';

const QuizShare: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareStats, setShareStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    completionRate: 0,
    lastAttempt: null as Date | null,
  });

  useEffect(() => {
    if (id) {
      const foundQuiz = mockQuizzes.find(q => q.id === id);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        // Generate share URL
        const baseUrl = window.location.origin;
        setShareUrl(`${baseUrl}/quiz/${id}`);
        
        // Mock share statistics
        setShareStats({
          totalAttempts: Math.floor(Math.random() * 100) + 20,
          averageScore: Math.floor(Math.random() * 30) + 65,
          completionRate: Math.floor(Math.random() * 20) + 75,
          lastAttempt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        });
      } else {
        navigate('/quizzes');
      }
    }
  }, [id, navigate]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleToggleQuizStatus = () => {
    if (quiz) {
      const updatedQuiz = { ...quiz, isActive: !quiz.isActive };
      setQuiz(updatedQuiz);
      // Here you would typically update the backend
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Quiz not found</p>
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Quiz</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Make your quiz accessible to students</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-sm rounded-full border ${getDifficultyColor(quiz.difficulty)}`}>
              {quiz.difficulty}
            </span>
            <button
              onClick={handleToggleQuizStatus}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                quiz.isActive 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {quiz.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>{quiz.isActive ? 'Published' : 'Unpublished'}</span>
            </button>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{quiz.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{quiz.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{quiz.category}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{quiz.questions.length} Questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{quiz.timeLimit} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{quiz.passingScore}% to pass</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Share Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share Options</span>
          </h3>

          {/* Share URL */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quiz URL
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <Link className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleCopyUrl}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    copied 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QR Code
              </label>
              <div className="flex items-center justify-center w-32 h-32 bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="text-center">
                  <QrCode className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">QR Code</p>
                </div>
              </div>
              <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Download QR Code
              </button>
            </div>

            {/* Share Settings */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Share Settings</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300">Require Student Information</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Students must enter name/email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300">Show Results Immediately</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Display score after completion</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300">Allow Multiple Attempts</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Students can retake the quiz</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Share Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share Statistics</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 transition-colors">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{shareStats.totalAttempts}</div>
                <div className="text-sm text-blue-800 dark:text-blue-300">Total Attempts</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 transition-colors">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{shareStats.averageScore}%</div>
                <div className="text-sm text-green-800 dark:text-green-300">Average Score</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 transition-colors">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{shareStats.completionRate}%</div>
                <div className="text-sm text-purple-800 dark:text-purple-300">Completion Rate</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 transition-colors">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {shareStats.lastAttempt ? shareStats.lastAttempt.toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">Last Attempt</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Activity</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Student completed quiz</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Quiz shared via link</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Quiz published</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(`/quizzes/${id}/preview`)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Preview Quiz</span>
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/quizzes/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Edit Quiz
          </button>
          <button
            onClick={() => window.open(shareUrl, '_blank')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Open Student View
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizShare;