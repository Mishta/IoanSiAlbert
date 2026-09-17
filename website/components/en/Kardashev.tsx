'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from '../Kardashev.module.css'

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
        <p data-reveal className={styles.label}>Civilizational vision</p>
        <h2 data-reveal className={styles.heading}>
          The Transition<br />
          <span className={styles.highlight}>Kardashev 0.73 → 1.0</span>
        </h2>
        <p data-reveal className={styles.body}>
          The first civilization to fully master its own planet&apos;s energy.
          P.O.L.A.R.I.S. is not a simple engineering calculation —
          it is a vision of humanity&apos;s destiny.
        </p>

        <div data-reveal className={styles.scaleWrap}>
          <div className={styles.scaleTrack}>
            <div ref={barRef} className={styles.scaleFill} />
            <div className={styles.markerNow} style={{ left: '73%' }}>
              <span className={styles.markerLabel}>Now 0.73</span>
              <div className={styles.markerLine} />
            </div>
            <div className={styles.markerTarget} style={{ left: '100%' }}>
              <span className={styles.markerLabel}>Type 1</span>
              <div className={styles.markerLine} />
            </div>
          </div>
          <div className={styles.scaleLegend}>
            <span>Type 0</span>
            <span>Type 1</span>
          </div>
        </div>

        {/* Video comparison: before / after */}
        <div data-reveal className={styles.videoGrid}>
          <div className={styles.videoCard}>
            <div className={styles.videoWrap}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/hl1aYw9btMs?autoplay=1&mute=1&loop=1&playlist=hl1aYw9btMs&controls=0&rel=0&modestbranding=1"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className={styles.videoIframe}
                title="Earth today — Kardashev 0.73"
              />
            </div>
            <p className={styles.videoLabel}>
              <span className={styles.videoBadgeWarm}>Now · Kardashev 0.73</span>
              Earth today — fragmented energy, dependent on fossil fuels
            </p>
          </div>

          <div className={styles.videoCard}>
            <div className={styles.videoWrap}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/MGKxNI-l_BY?autoplay=1&mute=1&loop=1&playlist=MGKxNI-l_BY&controls=0&rel=0&modestbranding=1"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className={styles.videoIframe}
                title="Earth with P.O.L.A.R.I.S. — Kardashev 1.0"
              />
            </div>
            <p className={styles.videoLabel}>
              <span className={styles.videoBadgeCyan}>P.O.L.A.R.I.S. · Kardashev 1.0</span>
              1.6 TW delivered continuously — the first Type 1 civilization
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
