import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HelpCircle, 
  FileText, 
  BarChart3, 
  Settings,
  Tag,
  ClipboardList
} from 'lucide-react';

interface SidebarProps {
  onSidebarClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSidebarClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-500' },
    { path: '/categories', icon: Tag, label: 'Categories', color: 'text-indigo-500' },
    { path: '/questions', icon: HelpCircle, label: 'Questions', color: 'text-green-500' },
    { path: '/quizzes', icon: FileText, label: 'Quizzes', color: 'text-purple-500' },
    { path: '/results', icon: ClipboardList, label: 'All Results', color: 'text-cyan-500' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: 'text-orange-500' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'text-gray-500' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onSidebarClose(); // Close sidebar on mobile when navigating
  };

  const isActiveRoute = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-full flex flex-col transition-colors border-r border-gray-200 dark:border-gray-700">
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-500' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
          <h3 className="font-semibold text-sm">Need Help?</h3>
          <p className="text-xs opacity-90 mt-1">Check our documentation</p>
          <button className="mt-2 text-xs bg-white bg-opacity-20 px-3 py-1 rounded hover:bg-opacity-30 transition-all">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;