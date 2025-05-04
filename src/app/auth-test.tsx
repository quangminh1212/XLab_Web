'use client';

import { useEffect, useState } from 'react';

export default function AuthTest() {
  const [routes, setRoutes] = useState<string[]>([]);

  useEffect(() => {
    // Kiểm tra một số routes của NextAuth
    const authRoutes = [
      '/api/auth/signin',
      '/api/auth/signin/google',
      '/api/auth/callback/google',
      '/api/auth/session',
      '/api/auth/csrf'
    ];

    const fetchRoutes = async () => {
      const results = await Promise.all(
        authRoutes.map(async (route) => {
          try {
            const res = await fetch(route, { method: 'HEAD' });
            return { route, status: res.status };
          } catch (error) {
            return { route, status: 'Error', error };
          }
        })
      );
      
      setRoutes(results.map(r => `${r.route}: ${r.status}`));
    };

    fetchRoutes();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">NextAuth Routes Test</h1>
      <ul className="list-disc pl-5">
        {routes.map((route, idx) => (
          <li key={idx}>{route}</li>
        ))}
      </ul>
    </div>
  );
} 