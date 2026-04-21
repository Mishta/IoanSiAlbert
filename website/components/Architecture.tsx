'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './Architecture.module.css'

const TECH = [
  {
    id: 'dyson',
    num: '01',
    title: 'Inel Dyson de Oglinzi',
    subtitle: '30 oglinzi · Ø 1 km · 7 milioane km de Soare',
    body: `La 7 milioane km de Soare, intensitatea radiației solare atinge 622.000 W/m² — de 457× față de suprafața Pământului. 30 de oglinzi orbitale de 1 km diametru concentrează această energie spre sateliții colectori, cu o reflectivitate de 90%.`,
    img: '/images/generated/Image%20K%20-%20Solar%20Mirror%20Dyson.jpg',
    videoId: null,
    videoBg: '/videos/Image%20B%20-%20Mirror%20and%20Sun%20-%20Video.mp4',
    videoLocal: '/videos/Image%20K%20-%20Solar%20Mirror%20Dyson%20-%20Video.mp4',
    accent: '#ffe3b7',
    stats: [
      { val: 30,      unit: '',        label: 'oglinzi orbitale' },
      { val: 1,       unit: ' km',     label: 'diametru oglindă' },
      { val: 622000,  unit: ' W/m²',   label: 'intensitate solară' },
      { val: 90,      unit: '%',       label: 'reflectivitate' },
    ],
    details: `Inelul Dyson nu este o sferă completă — este un roi de 30 de oglinzi plate în plan orbital comun, la 7 milioane km față de Soare. Fiecare oglindă are suprafață de ≈0.785 km² și poate fi orientată independent prin actuatoare electrostatice. Materialul reflectant: aluminiu depus pe substrat polimer ultra-subțire (5 μm), masă totală per oglindă < 1 tonă. Sistemul de propulsie: presiunea radiației solare ca "pânze solare" pentru corecții orbitale. Durată de viață estimată: 25 de ani.`,
  },
  {
    id: 'satellites',
    num: '02',
    title: 'Sateliți Colectori Laser',
    subtitle: '4 sateliți · η = 43% · Laser verde + albastru',
    body: `Cei 4 sateliți colectori convertesc energia solară concentrată în fascicule laser de mare putere (eficiență 43%), echipați cu sisteme de propulsie ionică pentru menținerea orbitei și transmițătoare laser direcționale spre nodurile Lagrange.`,
    img: '/images/generated/Image%20L%20-%20Collector%20Satellite%20Laser.jpg',
    videoId: null,
    videoLocal: '/videos/Image%20L%20-%20Collector%20Satellite%20Laser%20-%20Video.mp4',
    accent: '#00e5ff',
    stats: [
      { val: 4,   unit: '',    label: 'sateliți colectori' },
      { val: 43,  unit: '%',   label: 'eficiență lumină→laser' },
      { val: 532, unit: ' nm', label: 'lungime de undă (verde)' },
      { val: 450, unit: ' nm', label: 'lungime de undă (albastru)' },
    ],
    details: `Fiecare satelit colector primește lumina concentrată de 7-8 oglinzi din inelul Dyson. Conversia se face prin celule fotovoltaice multi-joncțiune (eficiență 43%) care alimentează laserul cu stare solidă. Laserele emit în verde (532 nm) spre nodurile L4/L5 și în albastru (450 nm) spre Pământ. Sistemul de răcire: radiatoare termice pe fața în umbră. Propulsie ionică: xenon, Isp = 3000 s, pentru menținerea orbitei față de inelul Dyson.`,
  },
  {
    id: 'lagrange',
    num: '03',
    title: 'Noduri Lagrange L4/L5',
    subtitle: 'Echilibru gravitațional stabil · Transfer 2×800 GW',
    body: `Punctele Lagrange L4 și L5 sunt poziții de echilibru gravitațional stabil în sistemul Soare–Pământ. Nodurile energetice plasate aici primesc energia laser și o redistribuie spre stațiile polare YBCO de pe Pământ.`,
    img: '/images/generated/Image%20M%20-%20Lagrange%20Relay%20Node.jpg',
    videoId: null,
    videoLocal: '/videos/Image%20M%20-%20Lagrange%20Relay%20Node%20-%20Video.mp4',
    accent: '#bdf4ff',
    stats: [
      { val: 2,    unit: ' noduri', label: 'L4 + L5' },
      { val: 800,  unit: ' GW',     label: 'transfer per nod' },
      { val: 47,   unit: '%',       label: 'energie utilizată' },
      { val: 53,   unit: '%',       label: 'surplus Star Power Grid' },
    ],
    details: `Punctele L4 și L5 se află la 60° în fața și în spatele Pământului pe orbita sa solară, la ~150 milioane km de Soare. Stabilitatea gravitațională le face ideale pentru infrastructură permanentă fără consum de combustibil. Fiecare nod primește 2,83 × 10¹² W disponibili — din care 47% (800 GW) este redirecționat spre centralele polare terestre. Surplusul de 53% alimentează rețeaua Star Power Grid pentru distribuție globală.`,
  },
  {
    id: 'ybco',
    num: '04',
    title: 'Rețea Star Power Grid',
    subtitle: 'YBCO 77K · 800 GW per cablu · Distribuție HVDC globală',
    body: `Supraconductorii YBCO (YBa₂Cu₃O₇₋δ) operează la 77K cu azot lichid — față de 4K pentru NbTi clasic din magneții LHC. Inovație validată prin consultanță cu fizicieni CERN.`,
    img: '/images/generated/Image%20I%20-%20Star%20Power%20Grid%20GEO.jpg',
    videoId: null,
    videoLocal: '/videos/Image%20I%20-%20Star%20Power%20Grid%20GEO%20-%20Video.mp4',
    accent: '#c9a84c',
    stats: [
      { val: 77,  unit: ' K',   label: 'temperatură critică YBCO' },
      { val: 800, unit: ' GW',  label: 'capacitate per cablu' },
      { val: 20,  unit: '×',    label: 'criogenie mai simplă vs NbTi' },
      { val: 0,   unit: '%',    label: 'rezistență electrică' },
    ],
    details: `YBCO (YBa₂Cu₃O₇₋δ) este un supraconductor de înaltă temperatură critică (Tc = 93K), răcit cu azot lichid la 77K. Comparativ cu NbTi din magneții LHC (Tc = 10K, operare la 4K cu heliu lichid), YBCO oferă: criogenie de 20× mai simplă, masă specifică mai mică, densitate de curent critic superioară. Cablurile supraconductoare submarine și terestre formează rețeaua Star Power Grid — o distribuție HVDC (High Voltage Direct Current) globală cu pierderi aproape nule.`,
  },
]

export default function Architecture() {
  const sectionRef  = useRef<HTMLElement>(null)
  const cardsRef    = useRef<(HTMLDivElement | null)[]>([])
  const [popup, setPopup] = useState<number | null>(null)
  const popupRef    = useRef<HTMLDivElement>(null)

  // Card + parallax animations
  useEffect(() => {
    const init = async () => {
      const mod = await import('gsap')
      const gsap = mod.gsap ?? mod.default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Header reveal
      const headerEl = sectionRef.current?.querySelector('[data-header]')
      if (headerEl) gsap.from(headerEl, {
        opacity: 0, y: 50, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.from(card, {
          opacity: 0,
          x: i % 2 === 0 ? -80 : 80,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 82%' },
        })

        // Parallax on image
        gsap.to(card.querySelector('[data-parallax]'), {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      // Flow diagram draw-on
      const flowEl = sectionRef.current?.querySelector('[data-flow]')
      if (flowEl) {
        gsap.from(flowEl, {
          opacity: 0, scaleX: 0, transformOrigin: 'left center',
          duration: 1.5, ease: 'power3.out',
          scrollTrigger: { trigger: flowEl, start: 'top 85%' },
        })
      }
    }
    init()
  }, [])

  // Popup open animation
  useEffect(() => {
    if (popup === null) return
    const init = async () => {
      const mod = await import('gsap')
      const gsap = mod.gsap ?? mod.default
      if (!popupRef.current) return

      const tl = gsap.timeline()
      tl.from(popupRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' })
      tl.from(popupRef.current.querySelector('[data-panel]'), {
        opacity: 0, y: 60, scale: 0.96,
        duration: 0.5, ease: 'power3.out',
      }, '-=0.1')
      tl.from(popupRef.current.querySelectorAll('[data-pop-item]'), {
        opacity: 0, y: 20, stagger: 0.08, duration: 0.5, ease: 'power2.out',
      }, '-=0.3')

      // Stat counters inside popup
      TECH[popup].stats.forEach((stat, i) => {
        const el = popupRef.current?.querySelectorAll('[data-stat-val]')[i]
        if (!el) return
        const obj = { v: 0 }
        gsap.to(obj, {
          v: stat.val, duration: 1.5, ease: 'power2.out', delay: 0.4 + i * 0.1,
          onUpdate() {
            el.textContent = (stat.val % 1 === 0
              ? Math.round(obj.v).toLocaleString('ro-RO')
              : obj.v.toFixed(1)) + stat.unit
          },
        })
      })
    }
    init()
  }, [popup])

  const closePopup = async () => {
    const mod = await import('gsap')
    const gsap = mod.gsap ?? mod.default
    if (!popupRef.current) return setPopup(null)
    gsap.to(popupRef.current, {
      opacity: 0, duration: 0.2, ease: 'power2.in',
      onComplete: () => setPopup(null),
    })
  }

  // ESC key to close
  useEffect(() => {
    if (popup === null) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePopup() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [popup])

  const t = popup !== null ? TECH[popup] : null

  return (
    <>
    <section id="tech" ref={sectionRef} className={styles.section}>
      <div data-header className={styles.header}>
        <p className={styles.label}>Arhitectura sistemului</p>
        <h2 className={styles.heading}>
          Patru module.<br />Un lanț energetic coerent.
        </h2>
      </div>

      <div className={styles.cards}>
        {TECH.map((tech, i) => (
          <div
            key={tech.id}
            ref={el => { cardsRef.current[i] = el }}
            className={`${styles.card} ${i % 2 !== 0 ? styles.cardReverse : ''}`}
            style={{ '--accent': tech.accent } as React.CSSProperties}
            onClick={() => setPopup(i)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setPopup(i)}
          >
            <div className={styles.cardVisual}>
              <div data-parallax className={styles.imgWrap}>
                {(tech.videoBg ?? tech.videoLocal) ? (
                  <video
                    autoPlay muted loop playsInline
                    className={styles.cardVideo}
                    poster={tech.img}
                  >
                    <source src={(tech.videoBg ?? tech.videoLocal)!} type="video/mp4" />
                  </video>
                ) : (
                  <Image src={tech.img} alt={tech.title} fill className={styles.img}
                    sizes="(max-width: 900px) 100vw, 50vw" />
                )}
              </div>
              <div className={styles.imgOverlay} aria-hidden />
              <span className={styles.numBadge}>{tech.num}</span>
              <span className={styles.playHint} aria-hidden>▶ Detalii</span>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.cardSub}>{tech.subtitle}</p>
              <h3 className={styles.cardTitle}>{tech.title}</h3>
              <p className={styles.cardText}>{tech.body}</p>
              <span className={styles.detailsBtn}>Detalii tehnice →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Energy flow diagram */}
      <div className={styles.flowWrap}>
        <p className={styles.flowLabel}>Lanțul energetic complet</p>
        <Image
          data-flow
          src="/assets/diagrams/diagram_energy_flow.png"
          alt="Diagrama fluxului energetic POLARIS"
          width={1000} height={220}
          className={styles.flowImg}
        />
      </div>
    </section>

    {/* POPUP MODAL */}
    {popup !== null && t && (
      <div ref={popupRef} className={styles.popupOverlay} onClick={closePopup}>
        <div data-panel className={styles.popupPanel} onClick={closePopup}>
          <button className={styles.popupClose} onClick={closePopup} aria-label="Închide">✕</button>

          {/* Video — stop propagation so clicking video doesn't close */}
          <div data-pop-item className={styles.popupVideo} onClick={e => e.stopPropagation()}>
            {t.videoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${t.videoId}?autoplay=1&mute=1&loop=1&playlist=${t.videoId}&controls=1&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className={styles.popupIframe}
              />
            ) : t.videoLocal ? (
              <video autoPlay muted loop playsInline className={styles.popupIframe}>
                <source src={t.videoLocal} type="video/mp4" />
              </video>
            ) : null}
          </div>

          <div className={styles.popupContent}>
            <div data-pop-item className={styles.popupMeta}>
              <span className={styles.popupNum}>{t.num}</span>
              <span className={styles.popupAccent} style={{ color: t.accent }}>{t.subtitle}</span>
            </div>
            <h2 data-pop-item className={styles.popupTitle}>{t.title}</h2>

            {/* Stats counters */}
            <div data-pop-item className={styles.popupStats}>
              {t.stats.map((s, i) => (
                <div key={i} className={styles.popupStat}>
                  <span data-stat-val className={styles.popupStatVal}>0{s.unit}</span>
                  <span className={styles.popupStatLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            <p data-pop-item className={styles.popupDetails}>{t.details}</p>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
