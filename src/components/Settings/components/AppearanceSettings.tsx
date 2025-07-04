import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

interface AppearanceSettingsProps {
  settings: any;
  onChange: (key: string, value: any) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ settings, onChange }) => {
  // Predefined color schemes
  const colorSchemes = [
    { name: 'Blue (Default)', primary: '#3B82F6', secondary: '#1E40AF' },
    { name: 'Green', primary: '#10B981', secondary: '#047857' },
    { name: 'Purple', primary: '#8B5CF6', secondary: '#6D28D9' },
    { name: 'Red', primary: '#EF4444', secondary: '#B91C1C' },
    { name: 'Orange', primary: '#F59E0B', secondary: '#B45309' },
    { name: 'Teal', primary: '#14B8A6', secondary: '#0F766E' },
  ];

  // Font options
  const fontOptions = [
    { value: 'system', label: 'System Default' },
    { value: 'sans', label: 'Sans Serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'mono', label: 'Monospace' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color Mode</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onChange('theme', 'light')}
                className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                  settings.theme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Sun className={`w-6 h-6 mb-2 ${settings.theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                <span className={`text-sm font-medium ${settings.theme === 'light' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  Light
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => onChange('theme', 'dark')}
                className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                  settings.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Moon className={`w-6 h-6 mb-2 ${settings.theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                <span className={`text-sm font-medium ${settings.theme === 'dark' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  Dark
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => onChange('theme', 'auto')}
                className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                  settings.theme === 'auto'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Monitor className={`w-6 h-6 mb-2 ${settings.theme === 'auto' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                <span className={`text-sm font-medium ${settings.theme === 'auto' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  System
                </span>
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color Scheme</label>
            <div className="grid grid-cols-3 gap-3">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.name}
                  type="button"
                  onClick={() => onChange('primaryColor', scheme.primary)}
                  className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                    settings.primaryColor === scheme.primary
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-full mb-2"
                    style={{ backgroundColor: scheme.primary }}
                  ></div>
                  <span className={`text-xs font-medium ${settings.primaryColor === scheme.primary ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    {scheme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Family</label>
            <select
              value={settings.fontFamily || 'system'}
              onChange={(e) => onChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              {fontOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => onChange('fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Layout Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Compact Mode</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Reduce spacing for denser UI</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => onChange('compactMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rounded Corners</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Use rounded corners for UI elements</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.roundedCorners !== false}
                onChange={(e) => onChange('roundedCorners', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Animations</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Enable UI animations and transitions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showAnimations !== false}
                onChange={(e) => onChange('showAnimations', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Preview</h3>
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Sample Header</h4>
            <button 
              className="px-4 py-2 text-white rounded-lg" 
              style={{ backgroundColor: settings.primaryColor }}
            >
              Sample Button
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This is a sample text that shows how your content will look with the current theme settings.
          </p>
          <div className="flex space-x-2">
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">Tag 1</div>
            <div className="px-3 py-1 rounded-lg text-white" style={{ backgroundColor: settings.primaryColor }}>Tag 2</div>
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">Tag 3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;