import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ingredient Analyzer',
  description: 'Analyze food ingredients for nutritional information, allergens, and side effects.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
