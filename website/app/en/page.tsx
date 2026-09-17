import type { Metadata } from 'next'
import StarField from '@/components/StarField'
import Nav from '@/components/en/Nav'
import Hero from '@/components/en/Hero'
import Concept from '@/components/en/Concept'
import Stats from '@/components/en/Stats'
import Architecture from '@/components/en/Architecture'
import DiagramZoom from '@/components/en/DiagramZoom'
import Kardashev from '@/components/en/Kardashev'
import Team from '@/components/en/Team'
import Footer from '@/components/en/Footer'

export const metadata: Metadata = {
  title: 'P.O.L.A.R.I.S. — Polaris Bears',
  description: 'Planetary Orbital Laser Array Relay Infrastructure System. A space-based energy system for a Kardashev Type 1 civilization.',
  alternates: {
    canonical: 'https://polaris-bears.ro/en',
  },
  openGraph: {
    title: 'P.O.L.A.R.I.S.',
    description: 'Energy from the cosmos for our planet.',
    images: ['/images/generated/Image%20C%20-%20Full%20System%20Panoramic.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ResearchProject',
  name: 'P.O.L.A.R.I.S.',
  alternateName: 'Planetary Orbital Laser Array Relay Infrastructure System',
  description: 'A space-based energy system using orbital mirrors, laser relay satellites and YBCO superconductors for the Kardashev 0.73 → 1.0 transition.',
  url: 'https://polaris-bears.ro/en',
  image: 'https://polaris-bears.ro/images/generated/Image%20C%20-%20Full%20System%20Panoramic.png',
  author: [
    {
      '@type': 'Person',
      name: 'Ioan Cristian CHELARU',
      url: 'https://iccjoc.me',
    },
    {
      '@type': 'Person',
      name: 'Albert David OLARIU',
    },
  ],
  funder: {
    '@type': 'Organization',
    name: 'ICHB — Liceul Teoretic Internațional de Informatică, București',
  },
}

export default function HomeEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StarField />
      <Nav />
      <main>
        <Hero />
        <Concept />
        <Stats />
        <Architecture />
        <DiagramZoom />
        <Kardashev />
        <Team />
      </main>
      <Footer />
    </>
  )
}
