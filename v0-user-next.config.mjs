/** @type {import('next').NextConfig} */
// Now your requests to /api/pdf-gen/generate-pdf will be automatically proxied to http://localhost:8000/generate-pdf
// This is useful when you want to run your backend server on a different port during development.
const userConfig = {
  async rewrites() {
    return [
      {
        source: '/api/pdf-gen/:path*',
        destination: 'http://localhost:8000/:path*'
      }
    ]
  }
}

export default userConfig