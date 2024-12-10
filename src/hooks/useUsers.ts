import { useState, useEffect } from 'react';
import { User, UserProfile } from '../types';
import { saveUser, getTrackedUsers, deleteUser } from '../services/userService';
import { getCurrentDate } from '../utils/dateUtils';

export function useUsers(userId: string | undefined, userProfile: UserProfile | null) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showAdjustment, setShowAdjustment] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadUsers();
    } else {
      setUsers([]);
      setSelectedUserId('');
    }
  }, [userId]);

  const loadUsers = async () => {
    if (!userId) return;
    const loadedUsers = await getTrackedUsers(userId);
    setUsers(loadedUsers);
  };

  const handleSelectUser = (id: string) => {
    setSelectedUserId(id);
  };

  const handleAddUser = () => {
    setShowForm(true);
  };

  const handleAdjustCycle = (userId: string) => {
    const now = getCurrentDate();
    const isPremiumValid = userProfile?.subscriptionEndDate && userProfile.subscriptionEndDate > now;
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 2 && !isPremiumValid) {
      return;
    }
    
    setShowAdjustment(userId);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('本当に削除しますか？')) return;
    if (!userId) return;
    await deleteUser(userId, userId);
    await loadUsers();
    if (selectedUserId === userId) {
      setSelectedUserId('');
    }
  };

  const handleSaveUser = async (userData: Omit<User, 'id'>) => {
    if (!userId) return;
    try {
      await saveUser(userId, { ...userData, id: crypto.randomUUID() });
      await loadUsers();
      setShowForm(false);
    } catch (error: any) {
      if (error.message === 'premium_required') {
        setShowForm(false);
      }
    }
  };

  const handleSaveAdjustment = async (userId: string, updates: Partial<User>) => {
    if (!userId) return;
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      await saveUser(userId, { ...user, ...updates });
      await loadUsers();
      setShowAdjustment(null);
    } catch (error: any) {
      if (error.message === 'premium_required') {
        setShowAdjustment(null);
      }
    }
  };

  return {
    users,
    selectedUserId,
    showForm,
    showAdjustment,
    handleAddUser,
    handleSelectUser,
    handleAdjustCycle,
    handleDeleteUser,
    handleSaveUser,
    handleSaveAdjustment,
    setShowForm,
    setShowAdjustment,
  };
}