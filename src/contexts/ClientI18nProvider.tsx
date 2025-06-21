'use client';

import React from 'react';
import { I18nProvider } from './I18nContext';

interface ClientI18nProviderProps {
  children: React.ReactNode;
}

// This component ensures the I18nProvider is only used on the client side
// to prevent "NextRouter was not mounted" errors during server-side rendering
const ClientI18nProvider: React.FC<ClientI18nProviderProps> = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // During server-side rendering or initial hydration, we don't want to render
  // the I18nProvider because it uses the NextRouter which is only available on the client
  if (!mounted) {
    return <>{children}</>;
  }

  // Once the component is mounted on the client, we can safely use the I18nProvider
  return <I18nProvider>{children}</I18nProvider>;
};

export default ClientI18nProvider; 