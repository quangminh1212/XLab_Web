import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { LanguageProvider } from '@/contexts/LanguageContext'
import SessionProvider from '@/components/SessionProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </LanguageProvider>
  )
} 