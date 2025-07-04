import React from 'react';
import { UsersIcon, Plus } from 'lucide-react';

interface EmptyUserStateProps {
  hasFilters: boolean;
  onInviteUser: () => void;
}

const EmptyUserState: React.FC<EmptyUserStateProps> = ({ hasFilters, onInviteUser }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <UsersIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {hasFilters
          ? 'Try adjusting your search or filter criteria.'
          : 'Get started by inviting your first user.'}
      </p>
      {!hasFilters && (
        <button
          onClick={onInviteUser}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Your First User</span>
        </button>
      )}
    </div>
  );
};

export default EmptyUserState;