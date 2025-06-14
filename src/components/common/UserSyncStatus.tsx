'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SyncStatus {
  hasUserFile: boolean;
  lastUpdated: string;
  version: string;
  cartItems: number;
  balance: number;
  transactionCount: number;
}

interface SyncResponse {
  email: string;
  syncStatus: SyncStatus;
  recommendations: string[];
}

export default function UserSyncStatus() {
  const { data: session } = useSession();
  const [syncStatus, setSyncStatus] = useState<SyncResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const { t } = useLanguage();

  const checkSyncStatus = async () => {
    if (!session?.user?.email) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/sync');
      if (response.ok) {
        const data = await response.json();
        setSyncStatus(data);
      }
    } catch (error) {
      console.error('Error checking sync status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const forceSyncData = async () => {
    if (!session?.user?.email) return;

    setIsSyncing(true);
    try {
      const response = await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLastSyncTime(data.syncTime);
        await checkSyncStatus(); // Refresh status after sync
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      checkSyncStatus();
    }
  }, [session?.user?.email]);

  if (!session?.user?.email) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    if (!syncStatus?.syncStatus.hasUserFile) return 'text-red-600 bg-red-50';
    if (syncStatus.recommendations.length > 0) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = () => {
    if (!syncStatus?.syncStatus.hasUserFile) return t('user.sync.notSynced');
    if (syncStatus.recommendations.length > 0) return t('user.sync.needsUpdate');
    return t('user.sync.synced');
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('common.userData.title')}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {syncStatus && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">{t('common.userData.email')}</span>
              <span className="ml-2 font-medium">{syncStatus.email}</span>
            </div>
            <div>
              <span className="text-gray-500">{t('common.userData.balance')}</span>
              <span className="ml-2 font-medium">
                {syncStatus.syncStatus.balance.toLocaleString('vi-VN')} VND
              </span>
            </div>
            <div>
              <span className="text-gray-500">{t('common.userData.cartItems')}</span>
              <span className="ml-2 font-medium">{syncStatus.syncStatus.cartItems}</span>
            </div>
            <div>
              <span className="text-gray-500">{t('common.userData.transactions')}</span>
              <span className="ml-2 font-medium">{syncStatus.syncStatus.transactionCount}</span>
            </div>
          </div>

          {syncStatus.syncStatus.lastUpdated && (
            <div className="text-sm">
              <span className="text-gray-500">{t('common.userData.lastUpdate')}</span>
              <span className="ml-2 font-medium">
                {new Date(syncStatus.syncStatus.lastUpdated).toLocaleString('vi-VN')}
              </span>
            </div>
          )}

          {lastSyncTime && (
            <div className="text-sm">
              <span className="text-gray-500">{t('common.userData.lastSync')}</span>
              <span className="ml-2 font-medium text-green-600">
                {new Date(lastSyncTime).toLocaleString('vi-VN')}
              </span>
            </div>
          )}

          {syncStatus.recommendations.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">{t('common.userData.recommendation')}</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {syncStatus.recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2 pt-3 border-t">
            <button
              onClick={checkSyncStatus}
              disabled={isLoading}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              {isLoading ? t('user.sync.checking') : t('user.sync.checkAgain')}
            </button>
            <button
              onClick={forceSyncData}
              disabled={isSyncing}
              className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSyncing ? t('user.sync.syncing') : t('user.sync.syncNow')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
