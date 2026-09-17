'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from '../Architecture.module.css'

const TECH = [
  {
    id: 'dyson',
    num: '01',
    title: 'Dyson Ring of Mirrors',
    subtitle: '30 mirrors · Ø 1 km · 7 million km from the Sun',
    body: `At 7 million km from the Sun, solar radiation intensity reaches 622,000 W/m² — 457× that at Earth's surface. 30 orbital mirrors, 1 km in diameter, concentrate this energy toward the collector satellites, with 90% reflectivity.`,
    img: '/images/generated/Image%20K%20-%20Solar%20Mirror%20Dyson.jpg',
    videoId: null,
    videoBg: '/videos/Image%20B%20-%20Mirror%20and%20Sun%20-%20Video.mp4',
    videoLocal: '/videos/Image%20K%20-%20Solar%20Mirror%20Dyson%20-%20Video.mp4',
    accent: '#ffe3b7',
    stats: [
      { val: 30,      unit: '',        label: 'orbital mirrors' },
      { val: 1,       unit: ' km',     label: 'mirror diameter' },
      { val: 622000,  unit: ' W/m²',   label: 'solar intensity' },
      { val: 90,      unit: '%',       label: 'reflectivity' },
    ],
    details: `The Dyson Ring is not a complete sphere — it is a swarm of 30 flat mirrors in a shared orbital plane, 7 million km from the Sun. Each mirror has a surface area of ≈0.785 km² and can be oriented independently via electrostatic actuators. Reflective material: aluminum deposited on an ultra-thin polymer substrate (5 μm), total mass per mirror < 1 tonne. Propulsion system: solar radiation pressure acting as "solar sails" for orbital corrections. Estimated lifespan: 25 years.`,
  },
  {
    id: 'satellites',
    num: '02',
    title: 'Laser Collector Satellites',
    subtitle: '4 satellites · η = 43% · Green + blue laser',
    body: `The 4 collector satellites convert concentrated solar energy into high-power laser beams (43% efficiency), equipped with ion propulsion systems to maintain orbit and directional laser transmitters aimed at the Lagrange nodes.`,
    img: '/images/generated/Image%20L%20-%20Collector%20Satellite%20Laser.jpg',
    videoId: null,
    videoLocal: '/videos/Image%20L%20-%20Collector%20Satellite%20Laser%20-%20Video.mp4',
    accent: '#00e5ff',
    stats: [
      { val: 4,   unit: '',    label: 'collector satellites' },
      { val: 43,  unit: '%',   label: 'light→laser efficiency' },
      { val: 532, unit: ' nm', label: 'wavelength (green)' },
      { val: 450, unit: ' nm', label: 'wavelength (blue)' },
    ],
    details: `Each collector satellite receives concentrated light from 7-8 mirrors of the Dyson Ring. Conversion is performed by multi-junction photovoltaic cells (43% efficiency) that power the solid-state laser. The lasers emit in green (532 nm) toward the L4/L5 nodes and in blue (450 nm) toward Earth. Cooling system: thermal radiators on the shaded face. Ion propulsion: xenon, Isp = 3000 s, to maintain orbit relative to the Dyson Ring.`,
  },
  {
    id: 'lagrange',
    num: '03',
    title: 'Lagrange L4/L5 Nodes',
    subtitle: 'Stable gravitational equilibrium · 2×800 GW transfer',
    body: `The L4 and L5 Lagrange points are positions of stable gravitational equilibrium in the Sun–Earth system. The energy nodes placed here receive the laser energy and redistribute it to the YBCO polar stations on Earth.`,
    img: '/images/generated/Image%20M%20-%20Lagrange%20Relay%20Node.jpg',
    videoId: null,
    videoLocal: '/videos/Image%20M%20-%20Lagrange%20Relay%20Node%20-%20Video.mp4',
    accent: '#bdf4ff',
    stats: [
      { val: 2,    unit: ' nodes', label: 'L4 + L5' },
      { val: 800,  unit: ' GW',     label: 'transfer per node' },
      { val: 47,   unit: '%',       label: 'energy used' },
      { val: 53,   unit: '%',       label: 'Star Power Grid surplus' },
    ],
    details: `The L4 and L5 points sit at 60° ahead of and behind Earth on its solar orbit, at ~150 million km from the Sun. Their gravitational stability makes them ideal for permanent infrastructure with no fuel consumption. Each node receives 2.83 × 10¹² W available — of which 47% (800 GW) is redirected to the terrestrial polar stations. The remaining 53% surplus powers the Star Power Grid for global distribution.`,
  },
  {
    id: 'ybco',
    num: '04',
    title: 'Star Power Grid Network',
    subtitle: 'YBCO 77K · 800 GW per cable · Global HVDC distribution',
    body: `YBCO superconductors (YBa₂Cu₃O₇₋δ) operate at 77K with liquid nitrogen — compared to 4K for classic NbTi used in the LHC magnets. An innovation validated through consultation with CERN physicists.`,
    img: '/images/generated/Image%20I%20-%20Star%20Power%20Grid%20GEO.jpg',
    videoId: null,
    videoLocal: '/videos/Image%20I%20-%20Star%20Power%20Grid%20GEO%20-%20Video.mp4',
    accent: '#c9a84c',
    stats: [
      { val: 77,  unit: ' K',   label: 'YBCO critical temperature' },
      { val: 800, unit: ' GW',  label: 'capacity per cable' },
      { val: 20,  unit: '×',    label: 'simpler cryogenics vs NbTi' },
      { val: 0,   unit: '%',    label: 'electrical resistance' },
    ],
    details: `YBCO (YBa₂Cu₃O₇₋δ) is a high critical-temperature superconductor (Tc = 93K), cooled with liquid nitrogen at 77K. Compared to the NbTi used in the LHC magnets (Tc = 10K, operating at 4K with liquid helium), YBCO offers: 20× simpler cryogenics, lower specific mass, and superior critical current density. Submarine and terrestrial superconducting cables form the Star Power Grid — a global HVDC (High Voltage Direct Current) distribution network with near-zero losses.`,
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
              ? Math.round(obj.v).toLocaleString('en-US')
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
        <p className={styles.label}>System Architecture</p>
        <h2 className={styles.heading}>
          Four modules.<br />One coherent energy chain.
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
              <span className={styles.playHint} aria-hidden>▶ Details</span>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.cardSub}>{tech.subtitle}</p>
              <h3 className={styles.cardTitle}>{tech.title}</h3>
              <p className={styles.cardText}>{tech.body}</p>
              <span className={styles.detailsBtn}>Technical details →</span>
            </div>
          </div>
        ))}
      </div>

    </section>

    {/* POPUP MODAL */}
    {popup !== null && t && (
      <div ref={popupRef} className={styles.popupOverlay} onClick={closePopup}>
        <div data-panel className={styles.popupPanel} onClick={closePopup}>
          <button className={styles.popupClose} onClick={closePopup} aria-label="Close">✕</button>

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
