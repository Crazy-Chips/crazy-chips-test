import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Lilita_One } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import CookieBanner from '@/components/shared/CookieBanner'
import SessionProvider from '@/components/shared/SessionProvider'
import MobileBottomNav from '@/components/layout/MobileBottomNav'

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const lilita = Lilita_One({
  variable: '--font-lilita',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: "Crazy Chips — Derby's Best Chip Shop",
  description:
    'Order online from Crazy Chips, Derby UK. Fresh chips, burgers, sides and more. Fast delivery & collection.',
  keywords: 'chip shop, Derby, chips, burgers, fast food, order online',
  openGraph: {
    title: "Crazy Chips — Derby's Best Chip Shop",
    description: "Bold flavours. Fast service. Derby's crispiest chips.",
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${jakarta.variable} ${lilita.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jakarta)] bg-[#FFF8EE] text-[#3D2200]">
        <SessionProvider>
          {children}
          <Toaster richColors />
          <CookieBanner />
          <MobileBottomNav />
        </SessionProvider>
      </body>
    </html>
  )
}
