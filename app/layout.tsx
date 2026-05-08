import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wonder Earth',
  description:
    'An interactive mystical 3D Earth discovery platform. Rotate, explore, and uncover the hidden mysteries of our planet.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-black">
      <body className="h-screen w-screen overflow-hidden">{children}</body>
    </html>
  )
}
