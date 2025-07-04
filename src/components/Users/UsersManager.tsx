import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '../../types';
import { usersApi } from '../../api';
import ConfirmationModal from '../Common/ConfirmationModal';
import Pagination from '../Common/Pagination';
import UserStats from './components/UserStats';
import UserFilters from './components/UserFilters';
import UserGrid from './components/UserGrid';
import UserList from './components/UserList';
import EmptyUserState from './components/EmptyUserState';
import InviteUserModal from './components/InviteUserModal';

const UsersManager: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'teacher' | 'student'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string; userName: string }>({
    isOpen: false,
    userId: '',
    userName: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await usersApi.getAll();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError('Failed to load users. Please try again.');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && user.isActive) ||
                         (selectedStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleViewUser = (id: string) => {
    navigate(`/users/${id}`);
  };

  const handleEditUser = (id: string) => {
    navigate(`/users/${id}/edit`);
  };

  const handleDeleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    setDeleteModal({
      isOpen: true,
      userId: id,
      userName: `${user.firstName} ${user.lastName}`
    });
  };

  const confirmDelete = async () => {
    try {
      await usersApi.delete(deleteModal.userId);
      const newUsers = users.filter(u => u.id !== deleteModal.userId);
      setUsers(newUsers);

      const newTotalPages = Math.ceil(newUsers.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      setDeleteModal({ isOpen: false, userId: '', userName: '' });
    }
  };

  const handleInviteUser = async (userData: Partial<UserType>) => {
    try {
      const newUser = await usersApi.create(userData);
      setUsers([...users, newUser]);
      setShowInviteModal(false);
      return true;
    } catch (err) {
      console.error('Error inviting user:', err);
      return false;
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus]);

  return (
    <>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage administrators, teachers, and students
          </p>
        </div>

        {/* User Statistics */}
        <UserStats users={users} />

        {/* Filters and Search */}
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onInviteUser={() => setShowInviteModal(true)}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={() => {
            setSearchTerm('');
            setSelectedRole('all');
            setSelectedStatus('all');
          }}
        />

        {/* Users Display */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <UserGrid
            users={paginatedUsers}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ) : (
          <UserList
            users={paginatedUsers}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredUsers.length}
              />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-sm"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
            <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
          </div>
        </div>

        {/* Empty State */}
        {!isLoading && !error && filteredUsers.length === 0 && (
          <EmptyUserState
            hasFilters={searchTerm !== '' || selectedRole !== 'all' || selectedStatus !== 'all'}
            onInviteUser={() => setShowInviteModal(true)}
          />
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, userId: '', userName: '' })}
          onConfirm={confirmDelete}
          title="Delete User"
          message={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone and will remove all associated user data.`}
          confirmText="Delete User"
          type="danger"
        />
      </div>

      {/* Invite User Modal - moved outside space-y-6 */}
      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteUser}
      />
    </>
  );
};

export default UsersManager;
