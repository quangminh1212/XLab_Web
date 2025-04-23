'use client';

import React, { useEffect, useState } from 'react';
import { getWeb3, waitForWeb3 } from '@/lib/web3-browser';

// Định nghĩa kiểu dữ liệu cho props
interface Web3Props {
  web3: any;
  isWeb3Ready: boolean;
}

export default function withWeb3<P extends object>(
  Component: React.ComponentType<P & Web3Props>
) {
  // Tạo component bọc
  const WithWeb3Wrapper = (props: P) => {
    const [web3State, setWeb3State] = useState<{
      web3: any;
      isReady: boolean;
    }>({
      web3: null,
      isReady: false,
    });

    useEffect(() => {
      let isMounted = true;

      const initWeb3 = async () => {
        try {
          // Đợi cho web3 sẵn sàng
          const web3Instance = await waitForWeb3();
          
          if (isMounted) {
            setWeb3State({
              web3: web3Instance,
              isReady: !!web3Instance,
            });
          }
        } catch (error) {
          console.error('Error initializing web3:', error);
          if (isMounted) {
            setWeb3State({
              web3: null,
              isReady: false,
            });
          }
        }
      };

      initWeb3();

      return () => {
        isMounted = false;
      };
    }, []);

    // Truyền props xuống component gốc cùng với web3
    return (
      <Component
        {...props}
        web3={web3State.web3}
        isWeb3Ready={web3State.isReady}
      />
    );
  };

  // Gán tên display name
  const displayName = Component.displayName || Component.name || 'Component';
  WithWeb3Wrapper.displayName = `WithWeb3(${displayName})`;

  return WithWeb3Wrapper;
} 