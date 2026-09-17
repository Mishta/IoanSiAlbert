'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from '../Concept.module.css'

export default function Concept() {
  const sectionRef = useRef<HTMLElement>(null)
  const panoramicRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const mod = await import('gsap')
      const gsap = mod.gsap ?? mod.default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Panoramic parallax
      if (panoramicRef.current) {
        gsap.to(panoramicRef.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Text reveal
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          opacity: 0, y: 50,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
          },
        })
      }

      // Stats count up
      if (statsRef.current) {
        const counters = statsRef.current.querySelectorAll('[data-count]')
        counters.forEach(el => {
          const target = parseFloat(el.getAttribute('data-count') || '0')
          const isFloat = !Number.isInteger(target)
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => {
              gsap.fromTo({ val: 0 }, { val: target }, {
                duration: 2.2,
                ease: 'power2.out',
                onUpdate: function() {
                  el.textContent = isFloat
                    ? this.targets()[0].val.toFixed(2)
                    : Math.round(this.targets()[0].val).toLocaleString('ro')
                }
              })
            },
            once: true,
          })
        })
      }
    }
    init()
  }, [])

  return (
    <section id="concept" ref={sectionRef} className={styles.section}>
      {/* Parallax background — panoramic render */}
      <div className={styles.bgWrap} aria-hidden>
        <div ref={panoramicRef} className={styles.bgInner}>
          <Image
            src="/images/generated/Imagine%20NB-1%20-%20panoramic.jpg"
            alt=""
            fill
            className={styles.bgImg}
          />
        </div>
        <iframe
          className={styles.ytBgIframe}
          src="https://www.youtube-nocookie.com/embed/dUgsGDiooXc?autoplay=1&mute=1&loop=1&playlist=dUgsGDiooXc&controls=0&rel=0&playsinline=1&modestbranding=1"
          allow="autoplay; encrypted-media"
          title=""
        />
        <div className={styles.bgOverlay} />
      </div>

      <div className={styles.inner}>
        <div ref={textRef} className={styles.text}>
          <p className={styles.label}>The Problem</p>
          <h2 className={styles.heading}>
            Our planet consumes<br />
            <em>26,000&nbsp;TWh</em> per year.
          </h2>
          <p className={styles.body}>
            Terrestrial solar energy loses ~30% to atmospheric absorption,
            and is limited by the day-night cycle and seasonality.
            <strong> P.O.L.A.R.I.S.</strong> proposes capturing energy directly from space —
            where the Sun shines 24/7, at an intensity <em>457×</em> greater
            than at Earth&apos;s surface.
          </p>
          <a href="#tech" className={styles.btnOutline}>Discover the architecture →</a>
        </div>

        <div ref={statsRef} className={styles.stats}>
          {[
            { value: '457',    unit: '×',    label: 'Solar intensity at 7M km' },
            { value: '1600',   unit: 'GW',   label: 'Power delivered continuously' },
            { value: '47',     unit: '%',    label: 'Of global 2023 consumption' },
            { value: '92',     unit: 'K',    label: 'YBCO critical temperature' },
          ].map(s => (
            <div key={s.label} className={styles.stat}>
              <div className={styles.statVal}>
                <span data-count={s.value} className={styles.statNum}>{s.value}</span>
                <span className={styles.statUnit}>{s.unit}</span>
              </div>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
