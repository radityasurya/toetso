import React from 'react';
import { Download, Upload, RefreshCw, AlertTriangle } from 'lucide-react';

interface BackupSettingsProps {
  settings: any;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ settings, onChange, onReset }) => {
  const handleExportData = () => {
    // Simulate data export
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Automatic Backup</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Auto Backup</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Automatically backup data at regular intervals</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => onChange('autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Backup Frequency</label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => onChange('backupFrequency', e.target.value)}
                disabled={!settings.autoBackup}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-50"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Retention Period (days)</label>
              <input
                type="number"
                min="7"
                max="365"
                value={settings.retentionPeriod}
                onChange={(e) => onChange('retentionPeriod', parseInt(e.target.value))}
                disabled={!settings.autoBackup}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Manual Backup & Restore</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
          </button>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Danger Zone</h4>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">These actions cannot be undone. Please be careful.</p>
            <div className="mt-4 space-y-2">
              <button
                onClick={onReset}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset All Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;