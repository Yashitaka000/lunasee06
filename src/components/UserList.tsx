import React from 'react';
import { User, UserProfile } from '../types';
import { UserPlus, Calendar, Trash2, Crown } from 'lucide-react';

interface UserListProps {
  users: User[];
  selectedUserId: string;
  isPremiumActive: boolean;
  userProfile?: UserProfile | null;
  onSelectUser: (userId: string) => void;
  onAddUser: () => void;
  onAdjustCycle: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onPremiumClick: () => void;
  onCancelSubscription: () => void;
}

export function UserList({ 
  users, 
  selectedUserId, 
  isPremiumActive,
  userProfile,
  onSelectUser, 
  onAddUser, 
  onAdjustCycle, 
  onDeleteUser,
  onPremiumClick,
  onCancelSubscription
}: UserListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const isScheduledForCancellation = userProfile?.subscriptionStatus === 'free' && userProfile?.subscriptionEndDate;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">登録者一覧</h2>
        
        <div className="flex flex-col gap-2">
          {isPremiumActive ? (
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm rounded-full">
                  <Crown size={16} className="text-yellow-600 dark:text-yellow-400" />
                  {isScheduledForCancellation
                    ? 'プレミアムプラン（次回解約予定）'
                    : 'プレミアムプラン（自動継続）'}
                </span>
                {!isScheduledForCancellation && (
                  <button
                    onClick={onCancelSubscription}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    解約する
                  </button>
                )}
              </div>
              {userProfile?.subscriptionEndDate && (
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  有効期間: {formatDate(userProfile.subscriptionEndDate)}まで
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={onPremiumClick}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-fit"
            >
              <Crown size={16} />
              無料プラン
            </button>
          )}
        </div>

        <button
          onClick={onAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:hover:bg-indigo-500 w-fit"
          disabled={users.length >= 2 && !isPremiumActive}
        >
          <UserPlus size={18} />
          {users.length >= 2 && !isPremiumActive ? 'プレミアムプランで追加可能' : '女性を追加'}
        </button>
      </div>

      {users.length >= 2 && !isPremiumActive && (
        <div className="my-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            3人目以降の登録にはプレミアムプランへの登録が必要です。
            <button
              onClick={onPremiumClick}
              className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              プレミアムプランを見る
            </button>
          </p>
        </div>
      )}

      <div className="space-y-3 mt-4">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <button
              onClick={() => onSelectUser(user.id)}
              className={`flex-1 text-left px-4 py-2 rounded-lg transition-all ${
                selectedUserId === user.id
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {user.name}
              {index >= 2 && !isPremiumActive && (
                <span className="ml-2 text-xs text-yellow-500">
                  （プレミアム登録が必要）
                </span>
              )}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAdjustCycle(user.id)}
                className={`p-2 rounded-lg transition-all ${
                  index >= 2 && !isPremiumActive
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-gray-700'
                }`}
                title="周期を調整"
                disabled={index >= 2 && !isPremiumActive}
              >
                <Calendar size={18} />
              </button>
              <button
                onClick={() => onDeleteUser(user.id)}
                className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                title="削除"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}