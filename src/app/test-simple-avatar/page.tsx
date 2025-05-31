'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Avatar from '@/components/common/Avatar';

const TestSimpleAvatarPage = () => {
  const { data: session } = useSession();
  const [directImageLoaded, setDirectImageLoaded] = useState(false);
  const [directImageError, setDirectImageError] = useState(false);

  const googleImageUrl = "https://lh3.googleusercontent.com/a/ACg8ocJClU3-7WgpDY2Q3_bvnD7NxBZr4ncLn8pQgjgCVlPY1k-QGDk=s96-c";

  useEffect(() => {
    console.log('=== SIMPLE AVATAR TEST ===');
    console.log('Session:', session);
    console.log('User Image:', session?.user?.image);
    console.log('Fixed Google Image:', googleImageUrl);
    
    // Test loading image via JavaScript
    if (session?.user?.image) {
      const testImg = new Image();
      testImg.onload = () => {
        console.log('✅ Session image can be loaded via JS');
        setDirectImageLoaded(true);
      };
      testImg.onerror = (e) => {
        console.log('❌ Session image failed via JS:', e);
        setDirectImageError(true);
      };
      testImg.src = session.user.image;
    }
  }, [session]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">🔧 Simple Avatar Test</h1>
      
      {/* Debug Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <h3 className="font-bold mb-2">🔍 Debug Info</h3>
        <div className="text-sm space-y-1">
          <p><strong>Session exists:</strong> {session ? '✅ Yes' : '❌ No'}</p>
          <p><strong>User name:</strong> {session?.user?.name || 'N/A'}</p>
          <p><strong>User email:</strong> {session?.user?.email || 'N/A'}</p>
          <p><strong>Image URL:</strong> {session?.user?.image || 'N/A'}</p>
          <p><strong>JS test result:</strong> {directImageLoaded ? '✅ Success' : directImageError ? '❌ Failed' : '⏳ Testing...'}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Test với Avatar Component */}
        <div className="bg-yellow-50 p-6 rounded-lg shadow border-4 border-yellow-400">
          <h2 className="text-xl font-semibold mb-4">🎯 AVATAR COMPONENT TEST (Background-image approach)</h2>
          <div className="flex items-center space-x-4">
            <Avatar
              src={session?.user?.image}
              alt={session?.user?.name || "User"}
              size="xl"
            />
            <div>
              <p><strong>Approach:</strong> Background-image CSS</p>
              <p><strong>Source:</strong> {session?.user?.image || 'N/A'}</p>
              <p><strong>Expected:</strong> Should show avatar or placeholder</p>
            </div>
          </div>
        </div>

        {/* Test 1: Direct img tag với session image */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test 1: Session Image với img tag</h2>
          <div className="flex items-center space-x-4">
            {session?.user?.image ? (
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-green-500">
                <img
                  src={session.user.image}
                  alt="Session Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('❌ Session img tag failed:', e);
                  }}
                  onLoad={() => {
                    console.log('✅ Session img tag loaded');
                  }}
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-red-200 flex items-center justify-center">
                No Session
              </div>
            )}
            <p>Session image với img tag trực tiếp</p>
          </div>
        </div>

        {/* Test 2: Background-image approach */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test 2: Background-image approach</h2>
          <div className="flex items-center space-x-4">
            {session?.user?.image && (
              <div 
                className="w-24 h-24 rounded-full bg-gray-100 border-4 border-cyan-500"
                style={{
                  backgroundImage: `url(${session.user.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
                title="Background image test"
              />
            )}
            <p>Session image với CSS background-image</p>
          </div>
        </div>

        {/* Test 3: Direct img tag với fixed URL */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test 3: Fixed Google URL với img tag</h2>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-blue-500">
              <img
                src={googleImageUrl}
                alt="Fixed Google Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('❌ Fixed img tag failed:', e);
                }}
                onLoad={() => {
                  console.log('✅ Fixed img tag loaded');
                }}
              />
            </div>
            <p>Fixed Google URL với img tag</p>
          </div>
        </div>

        {/* Test 4: img với referrerPolicy */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test 4: Với referrerPolicy="no-referrer"</h2>
          <div className="flex items-center space-x-4">
            {session?.user?.image && (
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-purple-500">
                <img
                  src={session.user.image}
                  alt="Session Avatar with referrer policy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    console.log('❌ Referrer policy img failed:', e);
                  }}
                  onLoad={() => {
                    console.log('✅ Referrer policy img loaded');
                  }}
                />
              </div>
            )}
            <p>Session image với referrerPolicy="no-referrer"</p>
          </div>
        </div>

        {/* Test 5: img với crossOrigin */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test 5: Với crossOrigin="anonymous"</h2>
          <div className="flex items-center space-x-4">
            {session?.user?.image && (
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-orange-500">
                <img
                  src={session.user.image}
                  alt="Session Avatar with crossOrigin"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.log('❌ CrossOrigin img failed:', e);
                  }}
                  onLoad={() => {
                    console.log('✅ CrossOrigin img loaded');
                  }}
                />
              </div>
            )}
            <p>Session image với crossOrigin="anonymous"</p>
          </div>
        </div>

        {/* Test 6: Placeholder test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test 6: Placeholder</h2>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-500 flex items-center justify-center">
              <svg 
                className="w-2/3 h-2/3 text-gray-400" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <p>Fallback placeholder SVG</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSimpleAvatarPage; 