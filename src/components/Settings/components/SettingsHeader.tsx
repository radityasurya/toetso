import React from 'react';
import { Save, Info, CheckCircle } from 'lucide-react';

interface SettingsHeaderProps {
  unsavedChanges: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onSave: () => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ 
  unsavedChanges, 
  saveStatus, 
  onSave 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Configuration</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage all aspects of your quiz platform</p>
        </div>
        
        {/* Save Status */}
        <div className="flex items-center space-x-4">
          {unsavedChanges && (
            <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
              <Info className="w-4 h-4" />
              <span className="text-sm">Unsaved changes</span>
            </div>
          )}
          
          {saveStatus === 'saved' && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Settings saved</span>
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <Info className="w-4 h-4" />
              <span className="text-sm">Error saving settings</span>
            </div>
          )}
          
          <button
            onClick={onSave}
            disabled={!unsavedChanges || saveStatus === 'saving'}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;