'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './Hero.module.css'

const TITLE = 'P.O.L.A.R.I.S.'

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const satelliteRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let gsap: any
    let ScrollTrigger: any

    const init = async () => {
      const mod = await import('gsap')
      gsap = mod.gsap ?? mod.default
      const stMod = await import('gsap/ScrollTrigger')
      ScrollTrigger = stMod.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      const tl = gsap.timeline({ delay: 0.3 })

      // Letters reveal
      if (titleRef.current) {
        const spans = titleRef.current.querySelectorAll('span')
        gsap.set(spans, { opacity: 0, y: 40 })
        tl.to(spans, {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
        })
      }

      // Satellite float-in
      if (satelliteRef.current) {
        gsap.set(satelliteRef.current, { opacity: 0, scale: 0.88, y: 30 })
        tl.to(satelliteRef.current, {
          opacity: 1, scale: 1, y: 0,
          duration: 1.4, ease: 'power3.out',
        }, '-=0.4')
      }

      // Subtitle + meta
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { opacity: 0, y: 20 })
        tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.8')
      }
      if (metaRef.current) {
        gsap.set(metaRef.current, { opacity: 0 })
        tl.to(metaRef.current, { opacity: 1, duration: 0.6 }, '-=0.4')
      }

      // Satellite parallax on scroll
      if (satelliteRef.current) {
        gsap.to(satelliteRef.current, {
          yPercent: -22,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }
    init()
  }, [])

  return (
    <section id="hero" className={styles.hero}>
      {/* Radial glow */}
      <div className={styles.glow} aria-hidden />

      {/* Satellite exploded view */}
      <div ref={satelliteRef} className={styles.satellite}>
        <Image
          src="/assets/nano-banana-uploads/upload_system_diagram.png"
          alt="Vedere desfășurată satelit POLARIS"
          width={1100} height={620}
          priority
          className={styles.satelliteImg}
        />
        <div className={styles.satelliteOverlay} aria-hidden />
      </div>

      {/* Title block */}
      <div className={styles.content}>
        <h1 ref={titleRef} className={styles.title}>
          {TITLE.split('').map((ch, i) => (
            <span key={i} className={ch === '.' ? styles.dot : styles.letter}>{ch}</span>
          ))}
        </h1>

        <p ref={subtitleRef} className={styles.subtitle}>
          Platformă Orbitală Laser pentru<br />
          Alimentare și Recepție Inovativă Solară
        </p>

        <div ref={metaRef} className={styles.meta}>
          <span className={styles.metaTag}>ONCS 2026</span>
          <span className={styles.metaDivider}>·</span>
          <span className={styles.metaTag}>Secțiunea A — Științe Exacte</span>
          <span className={styles.metaDivider}>·</span>
          <span className={styles.metaTag}>Polaris Bears</span>
        </div>

        <a href="#concept" className={styles.scrollHint} aria-label="Scroll down">
          <span className={styles.scrollLine} />
          <span className={styles.scrollLabel}>Explorează</span>
        </a>
      </div>
    </section>
  )
}
