{
  // Vercel configuration version
  "version": 2,
  "builds": [
    {
      // Main Next.js application build
      "src": "package.json",
      "use": "@vercel/next"
    },
    {
      // Python API route for PDF generation
      "src": "app/api/pdf-gen/route.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      // Route all PDF generation API requests to the Python handler
      "src": "/api/pdf-gen/(.*)",
      "dest": "/app/api/pdf-gen/route.py"
    }
  ]
}