const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
    
   
  
  // disable:true
  // runtimeCaching: [],
  // publicExcludes: ['!**/*'], // like this
  // buildExcludes: [() => true],
  // fallbacks: false,
  // cacheStartUrl: false,
  // navigateBypass: ['/live-data', 'ap']
});

const nextConfig = {
  reactStrictMode: true,
  env:{
    DBURL:process.env.MONGODB_URI,
    // BACKEND_URI:process.env.BACKEND_URI
  },
  experimental: {
    instrumentationHook: true,
},

}
module.exports = withPWA(nextConfig);