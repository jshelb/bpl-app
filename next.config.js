/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            // Change for production backend path
            : 'http://flask-app:5328/api/:path*',
      },
    ]
  },
  output: "standalone",
}

module.exports = nextConfig
