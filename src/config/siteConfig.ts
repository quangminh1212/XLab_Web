/**
 * Website Configuration
 * This file contains personal information and general configuration for XLab website
 */

export const siteConfig = {
  // Basic information
  name: 'XLab',
  description: 'Optimize efficiency, minimize costs!',
  url: 'https://xlab.vn',

  // Contact information
  contact: {
    email: 'xlab.rnd@gmail.com',
    phone: '+84 866 528 014', // Change to real phone number
    address: 'Long Bien, Hanoi',
    workingHours: ' 24/7',
  },

  // Social media
  social: {
    facebook: 'https://facebook.com/xlabvn',
    twitter: 'https://twitter.com/xlabvn',
    github: 'https://github.com/xlabvn',
    linkedin: 'https://linkedin.com/company/xlabvn',
  },

  // Legal configuration
  legal: {
    companyName: 'XLab Technologies',
    taxId: '0123456789', // Change to real tax ID
    registrationNumber: 'REG123456789', // Change to real business registration number
    termsLastUpdated: '28/03/2025',
    privacyLastUpdated: '28/03/2025',
  },

  // SEO configuration
  seo: {
    titleTemplate: '%s | XLab',
    defaultTitle: 'XLab - Optimize efficiency, minimize costs!',
    defaultDescription:
      'XLab provides high-quality applications and software for individuals and businesses.',
    twitterHandle: '@xlabvn',
    ogImage: '/images/og-image.jpg',
  },

  // Payment configuration
  payment: {
    currency: 'VND',
    supportedMethods: ['visa', 'mastercard', 'momo', 'zalopay', 'banking'],
    vatRate: 10, // VAT rate in percentage
  },

  // Partner and tracking codes
  analytics: {
    googleAnalyticsId: '', // Add Google Analytics ID
    facebookPixelId: '', // Add Facebook Pixel ID
  },
};

// List of pages in footer
export const footerLinks = [
  {
    title: 'Products',
    links: [
      { name: 'All Products', href: '/products' },
      { name: 'New Releases', href: '/products?sort=newest' },
      { name: 'Most Popular', href: '/products?sort=popular' },
      { name: 'On Sale', href: '/products?onSale=true' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'User Guides', href: '/guides' },
      { name: 'Report Bug', href: '/support' },
    ],
  },
  {
    title: 'About Us',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Partners', href: '/partners' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Refund Policy', href: '/refund-policy' },
      { name: 'Intellectual Property', href: '/ip-rights' },
    ],
  },
];

// Newsletter subscription configuration
export const newsletterConfig = {
  title: 'Subscribe to our newsletter',
  description: 'Receive information about new products, promotions, and updates from XLab',
  privacyText: 'We respect your privacy. See our Privacy Policy.',
};
