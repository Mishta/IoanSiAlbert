import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'P.O.L.A.R.I.S. – Polaris Bears',
  description: 'Proiect ONCS 2026: sistem energetic solar bazat pe sateliti colectori si retea HVDC',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  )
}
