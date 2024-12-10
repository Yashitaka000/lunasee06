import React, { useState } from 'react';
import { CreditCard, X } from 'lucide-react';

interface PremiumModalProps {
  userId: string;
  onClose: () => void;
  onSubscribe: () => void;
}

export function PremiumModal({ userId, onClose, onSubscribe }: PremiumModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);
    try {
      onSubscribe();
    } catch (err) {
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            プレミアムプランにアップグレード
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-yellow-500">
            <CreditCard className="w-6 h-6" />
            <span className="text-lg font-semibold">月額1,000円</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">
              プレミアム特典
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                ✓ 無制限の女性登録と閲覧
              </li>
              <li className="flex items-center gap-2">
                ✓ 30日間有効
              </li>
            </ul>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="pt-4 space-y-3">
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '処理中...' : 'プレミアムに登録する'}
            </button>
            <p className="mt-2 text-sm text-gray-500 text-center">
              ※ いつでもキャンセル可能です
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}