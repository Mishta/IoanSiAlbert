import StarField from '@/components/StarField'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Concept from '@/components/Concept'
import Stats from '@/components/Stats'
import Architecture from '@/components/Architecture'
import Kardashev from '@/components/Kardashev'
import Team from '@/components/Team'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <StarField />
      <Nav />
      <main>
        <Hero />
        <Concept />
        <Stats />
        <Architecture />
        <Kardashev />
        <Team />
      </main>
      <Footer />
    </>
  )
}
