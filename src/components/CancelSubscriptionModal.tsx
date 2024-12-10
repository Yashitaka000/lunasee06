import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface CancelSubscriptionModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelSubscriptionModal({ onConfirm, onClose }: CancelSubscriptionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              プレミアムプランの解約
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            プレミアムプランを解約しますか？
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg space-y-2">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ※ 3人目以降の登録データは保持されますが、新規登録はできなくなります。
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ※ 3人目以降の女性のカレンダーも閲覧できなくなります。
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-all"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              解約する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}