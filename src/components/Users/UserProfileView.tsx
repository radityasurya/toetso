import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen,
  FileText,
  BarChart3,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  GraduationCap,
  Users,
  Edit,
  MessageCircle,
  Plus,
  AlertCircle,
  Settings,
  HelpCircle,
  Bell,
  Camera,
  Save,
  X,
  Image,
  Upload,
  Link,
  ChevronDown,
  ChevronRight,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { User as UserType, QuizResult, Quiz, Question } from '../../types';
import { usersApi } from '../../api';

interface UserProfileViewProps {
  id?: string; // Optional prop for direct usage
  isProfilePage?: boolean; // Flag to indicate if this is the profile page
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ id: propId, isProfilePage = false }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [userResults, setUserResults] = useState<QuizResult[]>([]);
  const [userQuizzes, setUserQuizzes] = useState<Quiz[]>([]);
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [activityTimeline, setActivityTimeline] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserType>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<UserType[]>([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectCode, setConnectCode] = useState('');

  // Use either the prop ID or the param ID
  const id = propId || paramId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        if (!id) {
          setError('User ID not provided');
          return;
        }
        
        // Fetch user data
        const userData = await usersApi.getById(id);
        if (!userData) {
          setError('User not found');
          return;
        }
        
        setUser(userData);
        setEditData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone || '',
          location: userData.location || '',
          bio: userData.bio || '',
          jobTitle: userData.jobTitle || '',
          department: userData.department || '',
        });
        
        // Fetch connected users (teachers or students)
        const connected = await usersApi.getConnectedUsers(id);
        setConnectedUsers(connected);
        
        // Get user-specific data based on role
        if (userData.role === 'student') {
          const results = await usersApi.getStudentResults(id);
          setUserResults(results);
        } else if (userData.role === 'teacher') {
          const quizzes = await usersApi.getTeacherQuizzes(id);
          const questions = await usersApi.getTeacherQuestions(id);
          setUserQuizzes(quizzes);
          setUserQuestions(questions);
        }

        // Generate activity timeline
        generateActivityTimeline(userData);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const generateActivityTimeline = (user: UserType) => {
    const timeline = [];
    
    // Add login activity
    if (user.lastLogin) {
      timeline.push({
        id: 'login-1',
        type: 'login',
        title: 'Logged in',
        description: 'User logged into the system',
        date: user.lastLogin,
        icon: User,
        status: 'info'
      });
    }

    // Add quiz results for students
    if (user.role === 'student') {
      userResults.forEach(result => {
        const quiz = userQuizzes.find(q => q.id === result.quizId);
        timeline.push({
          id: `quiz-${result.id}`,
          type: 'quiz-completion',
          title: `Completed "${quiz?.title || 'Quiz'}"`,
          description: `Score: ${result.score}% (${result.correctAnswers}/${result.totalQuestions})`,
          date: result.completedAt,
          icon: result.score >= 70 ? CheckCircle : XCircle,
          status: result.score >= 70 ? 'success' : 'error'
        });
      });
    }

    // Add content creation for teachers
    if (user.role === 'teacher' || user.role === 'admin') {
      // Add quiz creation events
      userQuizzes.forEach(quiz => {
        timeline.push({
          id: `quiz-create-${quiz.id}`,
          type: 'quiz-creation',
          title: `Created quiz "${quiz.title}"`,
          description: `${quiz.questions.length} questions, ${quiz.difficulty} difficulty`,
          date: quiz.createdAt,
          icon: FileText,
          status: 'info'
        });
      });

      // Add question creation events
      userQuestions.forEach(question => {
        timeline.push({
          id: `question-create-${question.id}`,
          type: 'question-creation',
          title: `Created question`,
          description: question.question.length > 60 ? question.question.substring(0, 60) + '...' : question.question,
          date: question.createdAt,
          icon: HelpCircle,
          status: 'info'
        });
      });
    }

    // Add system events for admins
    if (user.role === 'admin') {
      timeline.push({
        id: 'system-1',
        type: 'system',
        title: 'System settings updated',
        description: 'Updated quiz time limits and passing scores',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        icon: Settings,
        status: 'warning'
      });
      
      timeline.push({
        id: 'system-2',
        type: 'system',
        title: 'New user approved',
        description: 'Approved teacher account for Emily Wilson',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        icon: Users,
        status: 'success'
      });
    }

    // Sort by date (newest first)
    timeline.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    setActivityTimeline(timeline);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'teacher': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'student': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'error': return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'info': 
      default: return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  const calculateStudentStats = () => {
    if (userResults.length === 0) return null;
    
    const totalQuizzes = userResults.length;
    const passedQuizzes = userResults.filter(r => r.score >= 70).length; // Assuming 70% is passing
    const averageScore = Math.round(userResults.reduce((sum, r) => sum + r.score, 0) / totalQuizzes);
    const totalTimeSpent = userResults.reduce((sum, r) => sum + r.timeSpent, 0);
    const bestScore = Math.max(...userResults.map(r => r.score));
    
    return {
      totalQuizzes,
      passedQuizzes,
      averageScore,
      totalTimeSpent,
      bestScore,
      passRate: Math.round((passedQuizzes / totalQuizzes) * 100)
    };
  };

  const calculateTeacherStats = () => {
    const totalQuizzes = userQuizzes.length;
    const totalQuestions = userQuestions.length;
    const activeQuizzes = userQuizzes.filter(q => q.isActive).length;
    const totalStudents = connectedUsers.length;
    
    // Calculate total attempts across all teacher's quizzes
    const totalAttempts = userResults.filter(r => 
      userQuizzes.some(q => q.id === r.quizId)
    ).length;
    
    return {
      totalQuizzes,
      totalQuestions,
      activeQuizzes,
      totalAttempts,
      totalStudents
    };
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaveStatus('saving');
    
    try {
      const updatedUser = await usersApi.update(user.id, editData);
      setUser(updatedUser);
      setIsEditing(false);
      setSaveStatus('saved');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveStatus('error');
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        jobTitle: user.jobTitle || '',
        department: user.department || '',
      });
    }
    setIsEditing(false);
  };

  const handleConnectUser = async () => {
    if (!connectCode.trim() || !user) return;
    
    try {
      const connected = await usersApi.connectUser(user.id, connectCode);
      if (connected) {
        setConnectedUsers([...connectedUsers, connected]);
        setConnectCode('');
        setShowConnectModal(false);
      }
    } catch (err) {
      console.error('Error connecting user:', err);
      // Show error message
    }
  };

  const handleDisconnectUser = async (userId: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to remove this connection?')) {
      try {
        await usersApi.disconnectUser(user.id, userId);
        setConnectedUsers(connectedUsers.filter(u => u.id !== userId));
      } catch (err) {
        console.error('Error disconnecting user:', err);
        // Show error message
      }
    }
  };

  const renderStudentContent = () => {
    const stats = calculateStudentStats();
    
    return (
      <div className="space-y-6">
        {/* Student Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Quizzes Taken</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.totalQuizzes}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">{stats.passRate}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Average Score</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{stats.averageScore}%</p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Best Score</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{stats.bestScore}%</p>
                </div>
                <Award className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Study Time</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">{formatTime(stats.totalTimeSpent)}</p>
                </div>
                <Clock className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
          </div>
        )}

        {/* Teachers Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Teachers</h3>
            <button 
              onClick={() => setShowConnectModal(true)}
              className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <UserPlus className="w-4 h-4" />
              <span>Connect with Teacher</span>
            </button>
          </div>
          <div className="p-6">
            {connectedUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectedUsers.map(teacher => (
                  <div key={teacher.id} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">{teacher.firstName} {teacher.lastName}</h4>
                        <button 
                          onClick={() => handleDisconnectUser(teacher.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Remove connection"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.jobTitle || 'Teacher'}</p>
                      <div className="mt-2 flex space-x-2">
                        <button className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                          View Profile
                        </button>
                        <button className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <GraduationCap className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">You're not connected to any teachers yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Connect with a teacher to access their premium content and get personalized feedback
                </p>
                <button 
                  onClick={() => setShowConnectModal(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Connect with a Teacher
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Timeline</h3>
            <button 
              onClick={() => setShowAllActivity(!showAllActivity)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
            >
              {showAllActivity ? 'Show Less' : 'Show More'}
              <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${showAllActivity ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className="p-6">
            {renderActivityTimeline()}
          </div>
        </div>

        {/* Quiz Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quiz Results</h3>
          </div>
          <div className="p-6">
            {userResults.length > 0 ? (
              <div className="space-y-4">
                {userResults.map((result) => {
                  const quiz = userQuizzes.find(q => q.id === result.quizId);
                  const passed = result.score >= 70; // Assuming 70% is passing
                  
                  return (
                    <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{quiz?.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz?.difficulty || 'medium')}`}>
                            {quiz?.difficulty}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            passed ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>Score: {result.score}%</span>
                          <span>Correct: {result.correctAnswers}/{result.totalQuestions}</span>
                          <span>Time: {formatTime(result.timeSpent)}</span>
                          <span>Completed: {result.completedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {result.score >= 90 ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : result.score < 60 ? (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        ) : null}
                        <span className={`text-2xl font-bold ${
                          passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {result.score}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No quiz results yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTeacherContent = () => {
    const stats = calculateTeacherStats();
    
    return (
      <div className="space-y-6">
        {/* Teacher Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Quizzes</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.totalQuizzes}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Questions</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">{stats.totalQuestions}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Active Quizzes</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{stats.activeQuizzes}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Attempts</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{stats.totalAttempts}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Students</p>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">{stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Students</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowConnectModal(true)}
                className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
              <button className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <ChevronRight className="w-4 h-4" />
                <span>View All</span>
              </button>
            </div>
          </div>
          <div className="p-6">
            {connectedUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {connectedUsers.map(student => {
                      // Calculate random progress for demo
                      const progress = Math.floor(Math.random() * 60) + 40; // 40-100%
                      
                      return (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {student.firstName} {student.lastName}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {student.grade || 'Beginner'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {student.joinDate.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                              </div>
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View</button>
                              <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Message</button>
                              <button 
                                onClick={() => handleDisconnectUser(student.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">You don't have any students yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Invite students to join your class and track their progress
                </p>
                <button 
                  onClick={() => setShowConnectModal(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Add Students
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Timeline</h3>
            <button 
              onClick={() => setShowAllActivity(!showAllActivity)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
            >
              {showAllActivity ? 'Show Less' : 'Show More'}
              <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${showAllActivity ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className="p-6">
            {renderActivityTimeline()}
          </div>
        </div>

        {/* Specializations */}
        {user?.specializations && user.specializations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Specializations</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {user.specializations.map((spec, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Created Quizzes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Created Quizzes</h3>
          </div>
          <div className="p-6">
            {userQuizzes.length > 0 ? (
              <div className="space-y-4">
                {userQuizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{quiz.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          quiz.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {quiz.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{quiz.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Category: {quiz.category}</span>
                        <span>Questions: {quiz.questions.length}</span>
                        <span>Time: {quiz.timeLimit}m</span>
                        <span>Pass: {quiz.passingScore}%</span>
                        <span>Created: {quiz.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Edit Quiz"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No quizzes created yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Created Questions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Created Questions</h3>
          </div>
          <div className="p-6">
            {userQuestions.length > 0 ? (
              <div className="space-y-4">
                {userQuestions.slice(0, 5).map((question) => (
                  <div key={question.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{question.category}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{question.question}</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Created: {question.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/questions/${question.id}/edit`)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Edit Question"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {userQuestions.length > 5 && (
                  <div className="text-center">
                    <button
                      onClick={() => navigate('/questions')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View all {userQuestions.length} questions →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No questions created yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAdminContent = () => (
    <div className="space-y-6">
      {/* Activity Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Timeline</h3>
          <button 
            onClick={() => setShowAllActivity(!showAllActivity)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
          >
            {showAllActivity ? 'Show Less' : 'Show More'}
            <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${showAllActivity ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div className="p-6">
          {renderActivityTimeline()}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Administration</h3>
        <p className="text-gray-600 dark:text-gray-400">
          As a system administrator, this user has full access to all platform features including user management, 
          system settings, analytics, and content moderation.
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 transition-colors">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-purple-500" />
              <div>
                <p className="font-medium text-purple-900 dark:text-purple-300">User Management</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">Full access to all users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 transition-colors">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-300">Analytics</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">System-wide reports</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 transition-colors">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-300">Content Control</p>
                <p className="text-sm text-green-600 dark:text-green-400">Manage all content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityTimeline = () => {
    if (activityTimeline.length === 0) {
      return (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No activity recorded yet</p>
        </div>
      );
    }

    // Show only first 3 activities if not expanded
    const displayedActivities = showAllActivity 
      ? activityTimeline 
      : activityTimeline.slice(0, 3);

    return (
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        
        <div className="space-y-6">
          {displayedActivities.map((activity, index) => {
            const Icon = activity.icon;
            const statusColor = getActivityStatusColor(activity.status || 'info');
            
            return (
              <div key={activity.id} className="relative pl-14">
                {/* Icon */}
                <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${statusColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                {/* Content */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.date.toLocaleDateString()} {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {!showAllActivity && activityTimeline.length > 3 && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => setShowAllActivity(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              Show All Activities
              <ChevronDown className="ml-2 w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderEditForm = () => {
    if (!user) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={editData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={editData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>
            </div>
          </div>
          
          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Information</h3>
            <div className="space-y-4">
              {(user.role === 'teacher' || user.role === 'admin') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={editData.jobTitle || ''}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={editData.department || ''}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={editData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === 'saving'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Connect Modal
  const renderConnectModal = () => {
    if (!showConnectModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.role === 'teacher' ? 'Add Student' : 'Connect with Teacher'}
            </h3>
            <button
              onClick={() => setShowConnectModal(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {user?.role === 'teacher' 
                ? 'Enter the student\'s email or connection code to add them to your class.'
                : 'Enter your teacher\'s connection code to join their class.'}
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Connection Code
              </label>
              <input
                type="text"
                value={connectCode}
                onChange={(e) => setConnectCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Enter connection code"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectUser}
                disabled={!connectCode.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Connect
              </button>
            </div>
          </div>
          
          {user?.role === 'teacher' && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Connection Code</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                  TEACH-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                </span>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Share this code with your students so they can connect to your class
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-2 text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cover Photo */}
      <div className="relative h-64 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600"></div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Profile Actions - Top Right */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {isProfilePage && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-lg transition-colors shadow-md"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          )}
          
          {!isProfilePage && (
            <button
              onClick={() => navigate('/users')}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-lg transition-colors shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Users</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Header - Overlapping Cover Photo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 -mt-20 relative z-10 transition-colors">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
          {/* Avatar */}
          <div className="relative -mt-20 mb-4 md:mb-0">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-white dark:bg-gray-800 p-2 shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
            </div>
            {isEditing && (
              <button
                className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                title="Change avatar"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">{user.jobTitle}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{user.department}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Save Status */}
            {saveStatus === 'saved' && (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mt-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Profile updated successfully</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {!isEditing && user.bio && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
          </div>
        )}

        {/* Contact Information */}
        {!isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{user.phone}</span>
                </div>
              )}
              
              {user.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{user.location}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Joined {user.joinDate.toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Student/Teacher specific info */}
            <div className="mt-4 flex flex-wrap gap-4">
              {user.role === 'student' && user.studentId && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <GraduationCap className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Student ID: {user.studentId}</span>
                </div>
              )}
              
              {user.grade && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Award className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Grade: {user.grade}</span>
                </div>
              )}

              {user.role === 'teacher' && user.yearsExperience && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Award className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {user.yearsExperience} years of experience
                  </span>
                </div>
              )}

              {user.lastLogin && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Last login: {user.lastLogin.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isEditing && !isProfilePage && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </button>
            
            {user.role === 'student' && (
              <button 
                onClick={() => setShowConnectModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add to My Class</span>
              </button>
            )}
            
            {user.role === 'teacher' && (
              <button 
                onClick={() => setShowConnectModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Connect as Student</span>
              </button>
            )}
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Form or Role-specific Content */}
      {isEditing ? (
        renderEditForm()
      ) : (
        <>
          {user.role === 'student' && renderStudentContent()}
          {user.role === 'teacher' && renderTeacherContent()}
          {user.role === 'admin' && renderAdminContent()}
        </>
      )}

      {/* Connect Modal */}
      {renderConnectModal()}
    </div>
  );
};

export default UserProfileView;