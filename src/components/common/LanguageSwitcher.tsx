'use client';

import React from 'react';
import dynamic from 'next/dynamic';

<<<<<<< HEAD
interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý click bên ngoài dropdown để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (lang: 'vi' | 'en') => {
    if (lang === language) {
      setIsOpen(false);
      return;
    }
    
    setLanguage(lang);
    setIsOpen(false);
  };
=======
// Use a simpler client-only implementation with no SSR
const NoSSRLanguageSwitcher = dynamic(
  () => import('./NoHydrationLanguageSwitcher'),
  { 
    ssr: false,
    loading: () => <div className="h-8 w-16 bg-gray-100 rounded"></div>
  }
);
>>>>>>> 062098a9c758cf94a27183b5874dd22c4d66a9f2

// This component is intentionally simple to avoid hydration mismatches
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <NoSSRLanguageSwitcher />
    </div>
  );
} 