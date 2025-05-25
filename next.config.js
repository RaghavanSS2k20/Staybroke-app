const withPWA = require('@ducanh2912/next-pwa').default;

const nextConfig = {
  reactStrictMode: true,
  env: {
    DBURL: process.env.MONGODB_URI,
    // BACKEND_URI: process.env.BACKEND_URI
  },
  experimental: {
    instrumentationHook: true,
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    workboxOptions: {
      swSrc: 'custom-sw.js',
      swDest: 'sw.js',
      // Additional InjectManifest options can go here
    },
    // disable: true,
    // runtimeCaching: [],
    // publicExcludes: ['!**/*'], // like this
    // buildExcludes: [() => true],
    // fallbacks: false,
    // cacheStartUrl: false,
    // navigateBypass: ['/live-data', 'ap'],
  }
};

module.exports = withPWA(nextConfig);
