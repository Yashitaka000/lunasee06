import React from 'react';
import { Moon, Home, LogOut } from 'lucide-react';
import { getCurrentDate } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onHome?: () => void;
  showHomeButton?: boolean;
}

export function Header({ onHome, showHomeButton = false }: HeaderProps) {
  const { user, logout } = useAuth();
  const currentDate = getCurrentDate();
  const formattedDate = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(currentDate);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Moon className="w-10 h-10 text-indigo-500" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            ルナシー
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {showHomeButton && (
            <button
              onClick={onHome}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
            >
              <Home size={20} />
              <span>ホーム</span>
            </button>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
              <span>ログアウト</span>
            </button>
          )}
        </div>
      </div>
      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
        {formattedDate}
      </div>
    </div>
  );
}