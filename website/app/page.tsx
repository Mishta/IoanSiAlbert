import StarField from '@/components/StarField'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Concept from '@/components/Concept'
import Stats from '@/components/Stats'
import Architecture from '@/components/Architecture'
import DiagramZoom from '@/components/DiagramZoom'
import Kardashev from '@/components/Kardashev'
import Team from '@/components/Team'
import Footer from '@/components/Footer'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ResearchProject',
  name: 'P.O.L.A.R.I.S.',
  alternateName: 'Platformă Orbitală Laser pentru Alimentare și Recepție Inovativă Solară',
  description: 'Un sistem energetic spațial bazat pe oglinzi orbitale, sateliți laser și supraconductori YBCO pentru tranziția Kardashev 0.73 → 1.0.',
  url: 'https://polaris-bears.ro',
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

export default function Home() {
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
