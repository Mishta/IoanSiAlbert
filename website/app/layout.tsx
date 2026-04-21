import type { Metadata } from 'next'
import { Jost } from 'next/font/google'
import './globals.css'

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-jost',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://polaris-bears.ro'),
  icons: { icon: '/favicon.svg' },
  title: 'P.O.L.A.R.I.S. — Polaris Bears · ONCS 2026',
  description: 'Platformă Orbitală Laser pentru Alimentare și Recepție Inovativă Solară. Un sistem energetic spațial pentru civilizația de tip Kardashev 1.',
  alternates: {
    canonical: 'https://polaris-bears.ro',
  },
  openGraph: {
    title: 'P.O.L.A.R.I.S.',
    description: 'Energie din cosmos pentru planeta noastră.',
    images: ['/images/generated/Image%20C%20-%20Full%20System%20Panoramic.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={jost.variable}>
      <body>{children}</body>
    </html>
  )
}
