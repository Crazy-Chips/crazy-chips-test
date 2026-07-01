'use client'

import { SessionProvider } from 'next-auth/react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth">
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        {children}
      </div>
    </SessionProvider>
  )
}
