import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Auth } from './Auth';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { CycleAdjustmentForm } from './CycleAdjustmentForm';
import { Calendar } from './Calendar';
import { CycleEducation } from './CycleEducation';
import { PremiumModal } from './PremiumModal';
import { CancelSubscriptionModal } from './CancelSubscriptionModal';
import { User, UserProfile } from '../types';
import { calculateCycleDays } from '../utils/cycleCalculations';
import { getTrackedUsers, saveUser, deleteUser, updateSubscription, cancelSubscription, getUserProfile } from '../services/userService';
import { getCurrentDate } from '../utils/dateUtils';

export function MainContent() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showAuth, setShowAuth] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAdjustment, setShowAdjustment] = useState<string | null>(null);
  const [showPremium, setShowPremium] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPremiumActive, setIsPremiumActive] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      loadUsers();
      checkSubscriptionStatus();
    }
  }, [user]);

  const loadUsers = async () => {
    if (!user) return;
    const loadedUsers = await getTrackedUsers(user.uid);
    setUsers(loadedUsers);
  };

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    const profile = await getUserProfile(user.uid);
    setUserProfile(profile);
    const now = getCurrentDate();
    setIsPremiumActive(
      profile?.subscriptionEndDate ? profile.subscriptionEndDate > now : false
    );
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const selectedUserIndex = selectedUser ? users.indexOf(selectedUser) : -1;
  const canViewCalendar = isPremiumActive || selectedUserIndex < 2;

  const calendarDays = selectedUser && canViewCalendar
    ? calculateCycleDays(
        selectedUser.lastPeriodStart,
        selectedUser.cycleLength,
        selectedUser.periodLength
      )
    : [];

  const handleSelectUser = (userId: string) => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex >= 2 && !isPremiumActive) {
      setShowPremium(true);
      return;
    }
    setSelectedUserId(userId);
  };

  const handleAddUser = () => {
    if (users.length >= 2 && !isPremiumActive) {
      setShowPremium(true);
    } else {
      setShowForm(true);
    }
  };

  const handleSaveUser = async (userData: Omit<User, 'id'>) => {
    if (!user) return;
    try {
      const newUser: User = {
        ...userData,
        id: crypto.randomUUID()
      };
      await saveUser(user.uid, newUser);
      await loadUsers();
      setShowForm(false);
    } catch (error: any) {
      if (error.message === 'premium_required') {
        setShowPremium(true);
        setShowForm(false);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!user) return;
    if (!window.confirm('本当に削除しますか？')) return;
    
    try {
      await deleteUser(user.uid, userId);
      await loadUsers();
      if (selectedUserId === userId) {
        setSelectedUserId('');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAdjustCycle = (userId: string) => {
    if (users.indexOf(users.find(u => u.id === userId)!) >= 2 && !isPremiumActive) {
      setShowPremium(true);
    } else {
      setShowAdjustment(userId);
    }
  };

  const handleSaveAdjustment = async (userId: string, updates: Partial<User>) => {
    if (!user) return;
    try {
      const targetUser = users.find(u => u.id === userId);
      if (!targetUser) return;
      
      await saveUser(user.uid, { ...targetUser, ...updates });
      await loadUsers();
      setShowAdjustment(null);
    } catch (error: any) {
      if (error.message === 'premium_required') {
        setShowPremium(true);
        setShowAdjustment(null);
      }
    }
  };

  const handleSubscribe = async () => {
    if (!user) return;
    try {
      await updateSubscription(user.uid, 'premium');
      await checkSubscriptionStatus();
      setShowPremium(false);
      await loadUsers();
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    try {
      await cancelSubscription(user.uid);
      await checkSubscriptionStatus();
      setShowCancelModal(false);
      // 3人目以降を選択中の場合、選択を解除
      if (selectedUserIndex >= 2) {
        setSelectedUserId('');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <button
          onClick={() => setShowAuth(true)}
          className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
        >
          ログインして始める
        </button>
        {showAuth && <Auth onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  return (
    <>
      <UserList
        users={users}
        selectedUserId={selectedUserId}
        isPremiumActive={isPremiumActive}
        userProfile={userProfile}
        onSelectUser={handleSelectUser}
        onAddUser={handleAddUser}
        onAdjustCycle={handleAdjustCycle}
        onDeleteUser={handleDeleteUser}
        onPremiumClick={() => setShowPremium(true)}
        onCancelSubscription={() => setShowCancelModal(true)}
      />

      {showForm && (
        <UserForm
          onSave={handleSaveUser}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showAdjustment && (
        <CycleAdjustmentForm
          user={users.find(u => u.id === showAdjustment)!}
          onSave={handleSaveAdjustment}
          onCancel={() => setShowAdjustment(null)}
        />
      )}

      {showPremium && (
        <PremiumModal
          userId={user.uid}
          onClose={() => setShowPremium(false)}
          onSubscribe={handleSubscribe}
        />
      )}

      {showCancelModal && (
        <CancelSubscriptionModal
          onConfirm={handleCancelSubscription}
          onClose={() => setShowCancelModal(false)}
        />
      )}

      {selectedUser ? (
        canViewCalendar ? (
          <Calendar days={calendarDays} />
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl">
            <p>3人目以降の女性のカレンダーを閲覧するには、プレミアムプランへの登録が必要です。</p>
            <button
              onClick={() => setShowPremium(true)}
              className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
            >
              プレミアムプランを見る
            </button>
          </div>
        )
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl">
          <p>女性を選択するか新しく追加してください</p>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            ※生理周期はズレていくので、できれば毎回最近の生理開始日を記録してください
          </p>
        </div>
      )}

      <CycleEducation />
    </>
  );
}