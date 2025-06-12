/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/admin/*', '/auth/*', '/account/*'],
      },
    ],
  },
  exclude: ['/api/*', '/admin/*', '/auth/*', '/account/*'],
  generateIndexSitemap: true,
  outDir: 'public',
  changefreq: 'daily',
  priority: 0.7,
  transform: async (config, path) => {
    // Custom transform function for sitemap items
    // Exclude paths that shouldn't be in sitemap
    if (
      path.startsWith('/api/') ||
      path.startsWith('/admin/') ||
      path.startsWith('/auth/') ||
      path.startsWith('/account/')
    ) {
      return null;
    }

    // Set custom priority for important pages
    let priority = config.priority;
    if (path === '/') {
      priority = 1.0;
    } else if (path.startsWith('/products/')) {
      priority = 0.8;
    } else if (path.startsWith('/categories/')) {
      priority = 0.8;
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
}; 