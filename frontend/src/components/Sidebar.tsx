import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HelpCircle, 
  FileText, 
  BarChart3, 
  Settings,
  Tag,
  ClipboardList,
  Users,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { settingsApi } from '../api';

interface SidebarProps {
  onSidebarClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSidebarClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('admin');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsApi.getSettings();
        setSiteSettings(settings);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
    
    // Get user role from localStorage
    const role = localStorage.getItem('userRole') || 'admin';
    setUserRole(role);
  }, []);

  // Base menu items that everyone sees
  const baseMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-500' },
    { path: '/categories', icon: Tag, label: 'Categories', color: 'text-indigo-500' },
  ];
  
  // Admin-specific menu items
  const adminMenuItems = [
    { path: '/users', icon: Users, label: 'All Users', color: 'text-purple-500' },
  ];
  
  // Teacher-specific menu items
  const teacherMenuItems = [
    { path: '/users', icon: BookOpen, label: 'My Students', color: 'text-purple-500' },
  ];
  
  // Student-specific menu items
  const studentMenuItems = [
    { path: '/users', icon: GraduationCap, label: 'My Teachers', color: 'text-purple-500' },
  ];
  
  // Common menu items for the bottom of the list
  const commonMenuItems = [
    { path: '/questions', icon: HelpCircle, label: 'Questions', color: 'text-green-500' },
    { path: '/quizzes', icon: FileText, label: 'Quizzes', color: 'text-purple-500' },
    { path: '/results', icon: ClipboardList, label: 'All Results', color: 'text-cyan-500' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: 'text-orange-500' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'text-gray-500' },
  ];

  // Combine menu items based on user role
  let menuItems = [...baseMenuItems];
  
  if (userRole === 'admin') {
    menuItems = [...menuItems, ...adminMenuItems];
  } else if (userRole === 'teacher') {
    menuItems = [...menuItems, ...teacherMenuItems];
  } else if (userRole === 'student') {
    menuItems = [...menuItems, ...studentMenuItems];
  }
  
  // Add common items at the end
  menuItems = [...menuItems, ...commonMenuItems];

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
        <div 
          className="rounded-lg p-4 text-white"
          style={{ 
            background: `linear-gradient(to right, ${siteSettings?.primaryColor || '#3B82F6'}, ${siteSettings?.primaryColor ? adjustColor(siteSettings.primaryColor, 40) : '#8B5CF6'})` 
          }}
        >
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

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  // Remove the # if it exists
  color = color.replace('#', '');
  
  // Parse the color
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  
  // Adjust the color
  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default Sidebar;