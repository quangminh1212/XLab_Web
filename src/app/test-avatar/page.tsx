'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Avatar from '@/components/common/Avatar';

const TestAvatarPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log('=== AVATAR DEBUG INFO ===');
    console.log('Session:', session);
    console.log('User Image URL:', session?.user?.image);
    console.log('Image exists:', !!session?.user?.image);
    if (session?.user?.image) {
      console.log('Trying to load image:', session.user.image);
      // Test if image is accessible
      const testImg = new Image();
      testImg.onload = () => console.log('✅ Image loads successfully via JS');
      testImg.onerror = (e) => console.log('❌ Image failed to load via JS:', e);
      testImg.src = session.user.image;
    }
  }, [session]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Avatar Component</h1>
      
      {/* Debug Info */}
      <div className="bg-yellow-100 p-4 rounded-lg mb-8">
        <h3 className="font-bold mb-2">🔍 Debug Information</h3>
        <div className="text-sm space-y-1">
          <p><strong>Session Status:</strong> {session ? 'Loaded' : 'Loading...'}</p>
          <p><strong>User Name:</strong> {session?.user?.name || 'N/A'}</p>
          <p><strong>User Email:</strong> {session?.user?.email || 'N/A'}</p>
          <p><strong>Image URL:</strong> {session?.user?.image || 'N/A'}</p>
          <p><strong>Image Length:</strong> {session?.user?.image?.length || 0} characters</p>
          <p><strong>Starts with https:</strong> {session?.user?.image?.startsWith('https') ? 'Yes' : 'No'}</p>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Test với session user */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Avatar từ Google OAuth</h2>
          <div className="flex items-center space-x-4">
            <Avatar
              src={session?.user?.image}
              alt={session?.user?.name || "User"}
              size="xl"
            />
            <div>
              <p><strong>Name:</strong> {session?.user?.name || 'Not logged in'}</p>
              <p><strong>Email:</strong> {session?.user?.email || 'Not logged in'}</p>
              <p><strong>Image URL:</strong> {session?.user?.image || 'No image'}</p>
            </div>
          </div>
        </div>

        {/* Test với img tag trực tiếp */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test với img tag trực tiếp</h2>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-green-500">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Direct img test"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('❌ Direct img failed:', e);
                    console.log('Failed URL:', session.user.image);
                  }}
                  onLoad={() => {
                    console.log('✅ Direct img loaded successfully');
                    console.log('Loaded URL:', session.user.image);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <p>Test với img tag thuần để xem có load được không (green border)</p>
          </div>
        </div>

        {/* Test với URL tĩnh từ Google */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Avatar với URL Google cố định</h2>
          <div className="flex items-center space-x-4">
            <Avatar
              src="https://lh3.googleusercontent.com/a/ACg8ocJClU3-7WgpDY2Q3_bvnD7NxBZr4ncLn8pQgjgCVlPY1k-QGDk=s96-c"
              alt="Test Google Avatar"
              size="xl"
            />
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-blue-500">
              <img
                src="https://lh3.googleusercontent.com/a/ACg8ocJClU3-7WgpDY2Q3_bvnD7NxBZr4ncLn8pQgjgCVlPY1k-QGDk=s96-c"
                alt="Direct img test 2"
                className="w-full h-full object-cover"
                onError={(e) => console.log('❌ Direct img 2 failed:', e)}
                onLoad={() => console.log('✅ Direct img 2 loaded successfully')}
              />
            </div>
            <p>So sánh Avatar component vs img tag trực tiếp (blue border)</p>
          </div>
        </div>

        {/* Test với URL không hợp lệ */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Avatar với URL không hợp lệ</h2>
          <div className="flex items-center space-x-4">
            <Avatar
              src="https://invalid-url.com/image.jpg"
              alt="Invalid URL Test"
              size="xl"
            />
            <p>URL không hợp lệ - sẽ hiển thị placeholder</p>
          </div>
        </div>

        {/* Test với src null */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Avatar với src null</h2>
          <div className="flex items-center space-x-4">
            <Avatar
              src={null}
              alt="No Image Test"
              size="xl"
            />
            <p>Src null - sẽ hiển thị placeholder</p>
          </div>
        </div>

        {/* Test các kích thước khác nhau */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test các kích thước</h2>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <Avatar
                src={session?.user?.image}
                alt="Small"
                size="sm"
              />
              <p className="text-sm mt-2">Small</p>
            </div>
            <div className="text-center">
              <Avatar
                src={session?.user?.image}
                alt="Medium"
                size="md"
              />
              <p className="text-sm mt-2">Medium</p>
            </div>
            <div className="text-center">
              <Avatar
                src={session?.user?.image}
                alt="Large"
                size="lg"
              />
              <p className="text-sm mt-2">Large</p>
            </div>
            <div className="text-center">
              <Avatar
                src={session?.user?.image}
                alt="Extra Large"
                size="xl"
              />
              <p className="text-sm mt-2">Extra Large</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAvatarPage; 