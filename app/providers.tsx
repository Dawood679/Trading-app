'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1f2e',
            color: '#fff',
            border: '1px solid #1f2937',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#00d395', secondary: '#1a1f2e' },
          },
          error: {
            iconTheme: { primary: '#ff4444', secondary: '#1a1f2e' },
          },
        }}
      />
    </SessionProvider>
  )
}
