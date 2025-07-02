import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../api';
import GeneralSettings from './components/GeneralSettings';
import QuizSettings from './components/QuizSettings';
import UserSettings from './components/UserSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import AppearanceSettings from './components/AppearanceSettings';
import BackupSettings from './components/BackupSettings';
import MembershipSettings from './components/MembershipSettings';
import SettingsSidebar from './components/SettingsSidebar';
import SettingsHeader from './components/SettingsHeader';
import LoadingSpinner from '../Common/LoadingSpinner';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<any>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await settingsApi.getSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        setError('Failed to load settings. Please try again later.');
        console.error('Error fetching settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaveStatus('saving');
    setUnsavedChanges(false);
    
    try {
      await settingsApi.updateSettings(settings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSaveStatus('error');
      setUnsavedChanges(true);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      settingsApi.getDefaultSettings().then(defaultSettings => {
        setSettings(defaultSettings);
        setUnsavedChanges(true);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Error Loading Settings</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No settings available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Configure system-wide preferences and options
        </p>
      </div>

      {/* Header with Save Status */}
      <SettingsHeader 
        unsavedChanges={unsavedChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <SettingsSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            {activeTab === 'general' && (
              <GeneralSettings 
                settings={settings}
                onChange={handleSettingChange}
              />
            )}
            
            {activeTab === 'quiz' && (
              <QuizSettings 
                settings={settings}
                onChange={handleSettingChange}
              />
            )}
            
            {activeTab === 'users' && (
              <UserSettings 
                settings={settings}
                onChange={handleSettingChange}
              />
            )}
            
            {activeTab === 'notifications' && (
              <NotificationSettings 
                settings={settings}
                onChange={handleSettingChange}
              />
            )}
            
            {activeTab === 'security' && (
              <SecuritySettings 
                settings={settings}
                onChange={handleSettingChange}
              />
            )}
            
            {activeTab === 'appearance' && (
              <AppearanceSettings 
                settings={settings}
                onChange={handleSettingChange}
              />
            )}
            
            {activeTab === 'backup' && (
              <BackupSettings 
                settings={settings}
                onChange={handleSettingChange}
                onReset={handleReset}
              />
            )}
            
            {activeTab === 'membership' && (
              <MembershipSettings 
                settings={settings}
                onChange={handleSettingChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;