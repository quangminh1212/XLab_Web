'use client'

import { useEffect } from 'react'
import { siteConfig } from '@/config/siteConfig'

export default function Analytics() {
  useEffect(() => {
    if (siteConfig.analytics.googleAnalyticsId) {
      // Google Analytics setup would go here
    }
    
    if (siteConfig.analytics.facebookPixelId) {
      // Facebook Pixel setup would go here
    }
  }, [])

  return null
} 