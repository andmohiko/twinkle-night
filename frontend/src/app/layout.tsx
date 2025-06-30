import type { Metadata } from 'next'
import { Geist, Geist_Mono, DotGothic16 } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const dotGothic16 = DotGothic16({
  variable: '--font-dot-gothic-16',
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'twinkle night',
  description: 'twinkle nightをwebで再現してみた',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dotGothic16.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
