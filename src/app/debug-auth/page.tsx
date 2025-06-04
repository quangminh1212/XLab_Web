'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function DebugAuth() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsError, setNotificationsError] = useState<string>('');

  useEffect(() => {
    // Test notifications API
    fetch('/api/notifications')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setNotifications(data.notifications || []);
        setNotificationsError('');
      })
      .catch((error) => {
        setNotificationsError(error.message);
        setNotifications([]);
      });
  }, [session]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debug Authentication</h1>

      <div className="space-y-6">
        {/* Authentication Status */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p>
              <strong>Status:</strong> {status}
            </p>
            <p>
              <strong>User Email:</strong> {session?.user?.email || 'Not logged in'}
            </p>
            <p>
              <strong>User Name:</strong> {session?.user?.name || 'N/A'}
            </p>
            <p>
              <strong>User Image:</strong> {session?.user?.image || 'N/A'}
            </p>
            <p>
              <strong>Is Admin:</strong> {session?.user?.isAdmin ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
            </p>
            <p>
              <strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL || 'Not set'}
            </p>
            <p>
              <strong>Has Google Client ID:</strong> {process.env.GOOGLE_CLIENT_ID ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Has NextAuth Secret:</strong> {process.env.NEXTAUTH_SECRET ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Login/Logout Controls */}
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          {!session ? (
            <div className="space-y-2">
              <button
                onClick={() => signIn('google')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign in with Google
              </button>
              <p className="text-sm text-gray-600">
                Note: You need valid Google OAuth credentials for this to work
              </p>
            </div>
          ) : (
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign out
            </button>
          )}
        </div>

        {/* Notifications API Test */}
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Notifications API Test</h2>
          {notificationsError ? (
            <div className="text-red-600">
              <p>
                <strong>Error:</strong> {notificationsError}
              </p>
            </div>
          ) : (
            <div>
              <p>
                <strong>Status:</strong> Success
              </p>
              <p>
                <strong>Notifications Count:</strong> {notifications.length}
              </p>
              {notifications.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">First Notification:</h3>
                  <pre className="text-xs bg-gray-200 p-2 rounded mt-2">
                    {JSON.stringify(notifications[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Raw Session Data */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Raw Session Data</h2>
          <pre className="text-xs bg-gray-200 p-2 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
