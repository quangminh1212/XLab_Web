module.exports = {
  extends: 'lighthouse:default',
  settings: {
    emulatedFormFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    skipAudits: [
      'uses-http2',
      'redirects-http',
      'uses-long-cache-ttl',
      'canonical',
      'is-crawlable',
    ],
  },
  audits: [
    {
      path: 'metrics/first-contentful-paint',
      options: {
        scorePODR: 800,
        scoreMedian: 1600,
      },
    },
    {
      path: 'metrics/speed-index',
      options: {
        scorePODR: 1100,
        scoreMedian: 2300,
      },
    },
    {
      path: 'metrics/interactive',
      options: {
        scorePODR: 2500,
        scoreMedian: 4500,
      },
    },
    {
      path: 'metrics/first-meaningful-paint',
      options: {
        scorePODR: 800,
        scoreMedian: 1800,
      },
    },
  ],
  categories: {
    performance: {
      name: 'Performance',
      description: 'These encapsulate your web app\'s current performance.',
      auditRefs: [
        {id: 'first-contentful-paint', weight: 15, group: 'metrics'},
        {id: 'speed-index', weight: 15, group: 'metrics'},
        {id: 'largest-contentful-paint', weight: 25, group: 'metrics'},
        {id: 'interactive', weight: 15, group: 'metrics'},
        {id: 'total-blocking-time', weight: 25, group: 'metrics'},
        {id: 'cumulative-layout-shift', weight: 5, group: 'metrics'},
      ],
    },
  },
}; 