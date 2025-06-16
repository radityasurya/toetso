import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu, Settings, LogOut, UserCircle, HelpCircle, ChevronDown, BookOpen, Sun, Moon, Monitor, ChevronRight, FileText, Tag, BarChart3 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onAddNew: () => void;
  onMenuClick: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'question' | 'quiz' | 'category';
  category?: string;
  description?: string;
  path: string;
}

const Header: React.FC<HeaderProps> = ({ onAddNew, onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, actualTheme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Quiz Completed',
      message: 'Student #1247 completed "Basic Traffic Signs" with 85% score',
      type: 'success',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      title: 'New Question Added',
      message: 'Question "What is the speed limit in school zones?" was added to Traffic Signs',
      type: 'info',
      time: '4 hours ago',
      read: false,
    },
    {
      id: '3',
      title: 'Low Performance Alert',
      message: 'Question "Parking regulations" has only 45% success rate',
      type: 'warning',
      time: '6 hours ago',
      read: true,
    },
    {
      id: '4',
      title: 'System Update',
      message: 'Quiz system has been updated to version 2.1.0',
      type: 'info',
      time: '1 day ago',
      read: true,
    },
    {
      id: '5',
      title: 'Backup Completed',
      message: 'Weekly backup completed successfully',
      type: 'success',
      time: '2 days ago',
      read: true,
    },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  const currentTheme = themes.find(t => t.value === theme);

  // Mock search results
  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      title: 'What does a red octagonal sign mean?',
      type: 'question',
      category: 'Traffic Signs',
      description: 'A red octagonal sign universally means "Stop"',
      path: '/questions/1/edit'
    },
    {
      id: '2',
      title: 'Basic Traffic Signs',
      type: 'quiz',
      category: 'Traffic Signs',
      description: 'Test your knowledge of common traffic signs',
      path: '/quizzes/1/edit'
    },
    {
      id: '3',
      title: 'Road Rules Comprehensive',
      type: 'quiz',
      category: 'Road Rules',
      description: 'Complete test of traffic laws and regulations',
      path: '/quizzes/2/edit'
    },
    {
      id: '4',
      title: 'Traffic Signs',
      type: 'category',
      description: 'Road signs and signals',
      path: '/categories'
    },
    {
      id: '5',
      title: 'Vehicle Safety',
      type: 'category',
      description: 'Safety equipment and procedures',
      path: '/categories'
    },
    {
      id: '6',
      title: 'Maximum speed limit in residential areas',
      type: 'question',
      category: 'Road Rules',
      description: 'In most residential areas, the speed limit is 25 mph',
      path: '/questions/2/edit'
    }
  ];

  const filteredSearchResults = searchQuery.trim() 
    ? mockSearchResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
        setShowThemeMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const handleUserMenuAction = (action: string) => {
    setShowUserMenu(false);
    setShowThemeMenu(false);
    switch (action) {
      case 'profile':
        navigate('/profile/me');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'help':
        window.open('/dashboard', '_blank');
        break;
      case 'logout':
        // Remove token/session and redirect to login
        localStorage.removeItem('access_token');
        navigate('/login');
        break;
    }
  };

  const handleThemeSelect = (newTheme: typeof theme) => {
    setTheme(newTheme);
    setShowThemeMenu(false);
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleSearchResultClick = (result: SearchResult) => {
    navigate(result.path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const getSearchResultIcon = (type: string) => {
    switch (type) {
      case 'question': return HelpCircle;
      case 'quiz': return FileText;
      case 'category': return Tag;
      default: return Search;
    }
  };

  const getSearchResultColor = (type: string) => {
    switch (type) {
      case 'question': return 'text-green-500';
      case 'quiz': return 'text-purple-500';
      case 'category': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 transition-colors h-16 flex items-center w-full">
      <div className="flex items-center justify-between w-full max-w-none">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Kuizzz</h1>
            </div>
          </button>
        </div>
        
        {/* Center - Search */}
        <div className="flex-1 max-w-2xl mx-8" ref={searchRef}>
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions, quizzes, categories..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && filteredSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">
                    Search Results ({filteredSearchResults.length})
                  </div>
                  {filteredSearchResults.map((result) => {
                    const Icon = getSearchResultIcon(result.type);
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                      >
                        <Icon className={`w-5 h-5 mt-0.5 ${getSearchResultColor(result.type)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {result.title}
                            </p>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              result.type === 'question' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                              result.type === 'quiz' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                              'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                            }`}>
                              {result.type}
                            </span>
                          </div>
                          {result.category && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                              {result.category}
                            </p>
                          )}
                          {result.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {searchQuery.trim() && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                    <button 
                      onClick={handleViewAllResults}
                      className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-center"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* No Results */}
            {showSearchResults && searchQuery.trim() && filteredSearchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-6 text-center">
                  <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    Try searching for questions, quizzes, or categories
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 border-l-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          getNotificationColor(notification.type)
                        } ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm hidden lg:block text-left">
                <p className="font-medium text-gray-900 dark:text-white">Admin User</p>
                <p className="text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">admin@quizmaster.com</p>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={() => handleUserMenuAction('profile')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <UserCircle className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                  
                  <button
                    onClick={() => handleUserMenuAction('settings')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  
                  {/* Theme Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowThemeMenu(!showThemeMenu)}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {currentTheme && <currentTheme.icon className="w-4 h-4" />}
                        <span>Theme</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${showThemeMenu ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {showThemeMenu && (
                      <div className="ml-4 mt-1 space-y-1">
                        {themes.map(({ value, icon: Icon, label }) => (
                          <button
                            key={value}
                            onClick={() => handleThemeSelect(value)}
                            className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded ${
                              theme === value
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                            {theme === value && (
                              <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleUserMenuAction('help')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Help & Support</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                  <button
                    onClick={() => handleUserMenuAction('logout')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;