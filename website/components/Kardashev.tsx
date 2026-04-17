'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './Kardashev.module.css'

export default function Kardashev() {
  const sectionRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const mod = await import('gsap')
      const gsap = mod.gsap ?? mod.default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Parallax bg
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Bar animate
      if (barRef.current) {
        gsap.from(barRef.current, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: barRef.current,
            start: 'top 85%',
          },
        })
      }

      // Content reveal
      gsap.from(sectionRef.current?.querySelectorAll('[data-reveal]') ?? [], {
        opacity: 0, y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    }
    init()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgWrap} aria-hidden>
        <div ref={bgRef} className={styles.bgInner}>
          <Image
            src="/assets/diagrams/diagram_kardashev.png"
            alt=""
            fill
            className={styles.bgImg}
          />
        </div>
        <div className={styles.bgOverlay} />
      </div>

      <div className={styles.inner}>
        <p data-reveal className={styles.label}>Viziunea civilizațională</p>
        <h2 data-reveal className={styles.heading}>
          Tranziția<br />
          <span className={styles.highlight}>Kardashev 0.73 → 1.0</span>
        </h2>
        <p data-reveal className={styles.body}>
          Prima civilizație care stăpânește integral energia propriei planete.
          P.O.L.A.R.I.S. nu este un simplu calcul de inginerie —
          este o viziune despre destinul uman.
        </p>

        <div data-reveal className={styles.scaleWrap}>
          <div className={styles.scaleTrack}>
            <div ref={barRef} className={styles.scaleFill} />
            <div className={styles.markerNow} style={{ left: '73%' }}>
              <span className={styles.markerLabel}>Acum 0.73</span>
              <div className={styles.markerLine} />
            </div>
            <div className={styles.markerTarget} style={{ left: '100%' }}>
              <span className={styles.markerLabel}>Tipul 1</span>
              <div className={styles.markerLine} />
            </div>
          </div>
          <div className={styles.scaleLegend}>
            <span>Tipul 0</span>
            <span>Tipul 1</span>
          </div>
        </div>
      </div>
    </section>
  )
}
