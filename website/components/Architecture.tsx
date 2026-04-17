'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './Architecture.module.css'

const TECH = [
  {
    id: 'dyson',
    num: '01',
    title: 'Roi Dyson de Oglinzi',
    subtitle: '30 oglinzi · Ø 1 km · 7M km de Soare',
    body: `La 7 milioane km de Soare, intensitatea radiației solare atinge 622.000 W/m² — de 457× față de suprafața Pământului. 30 de oglinzi orbitale de 1 km diametru concentrează această energie spre sateliții colectori, cu o reflectivitate de 90%.`,
    img: '/assets/nano-banana-uploads/upload_spg_geo.jpg',
    accent: '#ffe3b7',
  },
  {
    id: 'satellites',
    num: '02',
    title: 'Sateliți Colectori Laser',
    subtitle: '4 sateliți · η = 43% · Laser verde + albastru',
    body: `Cei 4 sateliți colectori convertesc energia solară concentrată în fascicule laser de mare putere (eficiență 43%), echipați cu sisteme de propulsie ionică pentru menținerea orbitei și transmițătoare laser direcționale spre nodurile Lagrange.`,
    img: '/assets/nano-banana-uploads/upload_system_diagram.png',
    accent: '#00e5ff',
  },
  {
    id: 'lagrange',
    num: '03',
    title: 'Noduri Lagrange L4/L5',
    subtitle: 'Echilibru gravitațional stabil · Transfer 2×800 GW',
    body: `Punctele Lagrange L4 și L5 sunt poziții de echilibru gravitațional stabil în sistemul Soare–Pământ. Nodurile energetice plasate aici primesc energia laser și o redistribuie spre stațiile polare YBCO de pe Pământ prin cabluri supraconductoare.`,
    img: '/assets/diagrams/diagram_lagrange.png',
    accent: '#bdf4ff',
  },
  {
    id: 'ybco',
    num: '04',
    title: 'Rețea Star Power Grid',
    subtitle: 'YBCO 77K · 800 GW per cablu · Distribuție HVDC globală',
    body: `Supraconductorii YBCO (YBa₂Cu₃O₇₋δ) operează la 77K cu azot lichid — față de 4K pentru NbTi clasic din magneții LHC. Inovația validată prin consultanță cu fizicieni CERN: masă specifică mult mai mică, criogenie 20× mai simplă, densitate de curent superioară.`,
    img: '/assets/diagrams/diagram_star_power_grid.png',
    accent: '#c9a84c',
  },
]

export default function Architecture() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const init = async () => {
      const mod = await import('gsap')
      const gsap = mod.gsap ?? mod.default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.from(card, {
          opacity: 0,
          x: i % 2 === 0 ? -60 : 60,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
          },
        })
      })

      // Diagram parallax
      const diagrams = sectionRef.current?.querySelectorAll('[data-parallax]')
      diagrams?.forEach(el => {
        gsap.to(el, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.' + styles.card),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }
    init()
  }, [])

  return (
    <section id="tech" ref={sectionRef} className={styles.section}>
      <div className={styles.header}>
        <p className={styles.label}>Arhitectura sistemului</p>
        <h2 className={styles.heading}>
          Patru module.<br />Un lanț energetic coerent.
        </h2>
      </div>

      <div className={styles.cards}>
        {TECH.map((t, i) => (
          <div
            key={t.id}
            ref={el => { cardsRef.current[i] = el }}
            className={`${styles.card} ${i % 2 !== 0 ? styles.cardReverse : ''}`}
            style={{ '--accent': t.accent } as React.CSSProperties}
          >
            <div className={styles.cardVisual}>
              <div data-parallax className={styles.imgWrap}>
                <Image
                  src={t.img}
                  alt={t.title}
                  fill
                  className={styles.img}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
              <div className={styles.imgOverlay} aria-hidden />
              <span className={styles.numBadge}>{t.num}</span>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.cardSub}>{t.subtitle}</p>
              <h3 className={styles.cardTitle}>{t.title}</h3>
              <p className={styles.cardText}>{t.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Energy flow diagram */}
      <div className={styles.flowWrap}>
        <p className={styles.flowLabel}>Lanțul energetic complet</p>
        <Image
          src="/assets/diagrams/diagram_energy_flow.png"
          alt="Diagrama fluxului energetic POLARIS"
          width={1000} height={220}
          className={styles.flowImg}
        />
      </div>
    </section>
  )
}
