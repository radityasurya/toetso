import React, { useState } from 'react';
import { UserCircle, Save, X, Edit2, Info, List } from 'lucide-react';
import { updateCurrentUser } from '../../api/users';

const initialUser = {
  name: 'Admin User',
  role: 'Administrator',
  email: 'admin@quizmaster.com',
  bio: 'Transforming the way you learn and master quizzes.',
  joined: 'March 2023',
};

const tabs = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'about', label: 'About', icon: Info },
  { id: 'activity', label: 'Activity', icon: List },
];

const ProfilePage = () => {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState<'profile'|'about'|'activity'>('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...initialUser });
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit logic
  const handleEdit = () => setEditing(true);
  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setChanged(true);
    setFormError(null);
  };
  const handleCancel = () => {
    setEditing(false);
    setChanged(false);
    setForm({ ...user });
    setFormError(null);
  };
  const handleSave = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const updated = await updateCurrentUser(form);
      setUser(updated);
      setChanged(false);
      setEditing(false);
    } catch (e: any) {
      setFormError(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const renderProfileForm = () => (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
        {editing ? (
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={form.name}
            onChange={e => handleFormChange('name', e.target.value)}
            disabled={saving}
            maxLength={64}
          />
        ) : (
          <div className="text-gray-900 dark:text-white font-medium">{user.name}</div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
        {editing ? (
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={form.email}
            onChange={e => handleFormChange('email', e.target.value)}
            disabled={saving}
            maxLength={120}
          />
        ) : (
          <div className="text-gray-900 dark:text-white font-medium">{user.email}</div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
        {editing ? (
          <textarea
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={2}
            value={form.bio}
            onChange={e => handleFormChange('bio', e.target.value)}
            disabled={saving}
            maxLength={140}
          />
        ) : (
          <div className="text-gray-500 dark:text-gray-400">{user.bio}</div>
        )}
      </div>
      {editing && (
        <div className="flex space-x-3 pt-4 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition"
            disabled={saving}
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition ${(!changed || saving) ? 'opacity-60 pointer-events-none' : ''}`}
            disabled={!changed || saving}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      )}
    </form>
  );

  const renderAbout = () => (
    <div className="space-y-2">
      <div className="text-gray-900 dark:text-white text-lg font-bold">About</div>
      <div className="text-gray-500 dark:text-gray-400">
        Member since <span className="font-medium">{user.joined}</span>
      </div>
      <div className="text-gray-500 dark:text-gray-400">
        Role: <span className="text-blue-600 dark:text-blue-300 font-medium">{user.role}</span>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-4">
      <div className="text-gray-900 dark:text-white text-lg font-bold">Recent Activity</div>
      <div className="rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center space-x-3">
        <span className="w-3 h-3 rounded-full bg-blue-400 block" />
        <span className="text-gray-700 dark:text-gray-200">You completed the quiz "Basic Traffic Signs" with 85% score. <span className="ml-3 text-xs text-gray-400">2 hours ago</span></span>
      </div>
      <div className="rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center space-x-3">
        <span className="w-3 h-3 rounded-full bg-green-400 block" />
        <span className="text-gray-700 dark:text-gray-200">You edited category "Parking Regulations." <span className="ml-3 text-xs text-gray-400">4 hours ago</span></span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Facebook-style Banner & Avatar */}
      <div className="relative w-full h-48 lg:h-56 flex items-end bg-gradient-to-br from-blue-600/80 to-purple-600/80 rounded-xl">
        <div className="max-w-6xl mx-auto flex flex-row items-end w-full px-8 pb-3">
          <div className="relative -mb-20 md:-mb-24">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white flex items-center justify-center border-4 border-blue-600 shadow-xl overflow-hidden">
              <UserCircle className="w-28 h-28 md:w-36 md:h-36 text-blue-600" />
            </div>
          </div>
          <div className="ml-6 mt-8">
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <span className="px-2 ml-1 py-0.5 rounded bg-blue-100 bg-opacity-70 text-blue-900 font-semibold text-xs tracking-widest uppercase shadow">
              {user.role}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors">
            <nav className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setEditing(false); setFormError(null); setChanged(false); setForm({ ...user }); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-500'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            {formError && (
              <div className="bg-red-100 border border-red-400 p-2 rounded text-red-700 text-sm mb-4 text-center">
                {formError}
              </div>
            )}
            {activeTab === 'profile' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Info</h3>
                  {!editing && (
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
                {renderProfileForm()}
              </>
            )}
            {activeTab === 'about' && renderAbout()}
            {activeTab === 'activity' && renderActivity()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
