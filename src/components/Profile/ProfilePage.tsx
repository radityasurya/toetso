import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../api';
import LoadingSpinner from '../Common/LoadingSpinner';
import UserProfileView from '../Users/UserProfileView';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would come from auth context or API
        const userEmail = localStorage.getItem('userEmail') || 'admin@quizmaster.com';
        const user = await usersApi.getUserByEmail(userEmail);
        
        if (user) {
          setCurrentUserId(user.id);
          setError(null);
        } else {
          setError('User profile not found. Please log in again.');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">User profile not found. Please log in again.</p>
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return <UserProfileView id={currentUserId} isProfilePage={true} />;
};

export default ProfilePage;