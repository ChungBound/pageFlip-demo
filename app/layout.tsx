import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Neural-Flip-Reader',
  description: 'Created with LY1',
  generator: 'LY1',
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
