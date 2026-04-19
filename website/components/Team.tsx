'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './Team.module.css'

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const init = async () => {
      const mod = await import('gsap')
      const gsap = mod.gsap ?? mod.default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const { TextPlugin } = await import('gsap/TextPlugin')
      gsap.registerPlugin(ScrollTrigger, TextPlugin)

      const reveals = sectionRef.current?.querySelectorAll('[data-reveal]') ?? []
      reveals.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 60,
          duration: 1,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })

      // Slogan typewriter
      const sloganEl = sectionRef.current?.querySelector('[data-typewriter]')
      if (sloganEl) {
        gsap.from(sloganEl, {
          opacity: 0,
          duration: 0.3,
          scrollTrigger: {
            trigger: sloganEl,
            start: 'top 85%',
            onEnter: () => {
              const text = sloganEl.textContent || ''
              sloganEl.textContent = ''
              ;(sloganEl as HTMLElement).style.opacity = '1'
              gsap.to(sloganEl, {
                duration: text.length * 0.045,
                text: { value: text, delimiter: '' },
                ease: 'none',
              })
            },
          },
        })
      }

      // Member cards stagger + float
      const cards = sectionRef.current?.querySelectorAll('[data-card]') ?? []
      cards.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 80,
          rotateY: 15,
          duration: 1.1,
          delay: i * 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%' },
        })
        // Continuous float
        gsap.to(card, {
          y: -8,
          duration: 2.5 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.5,
        })
      })

      // Logo pulse
      const logoEl = sectionRef.current?.querySelector('[data-logo]')
      if (logoEl) {
        gsap.from(logoEl, {
          opacity: 0, scale: 0.6, rotation: -20,
          duration: 1.2, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: logoEl, start: 'top 85%' },
        })
        gsap.to(logoEl, {
          scale: 1.04,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.5,
        })
      }

      // Badge shimmer
      const badges = sectionRef.current?.querySelectorAll('[data-badge]') ?? []
      badges.forEach((badge, i) => {
        gsap.from(badge, {
          opacity: 0, x: -30, duration: 0.6,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: badge, start: 'top 90%' },
        })
      })
    }
    init()
  }, [])

  return (
    <section id="team" ref={sectionRef} className={styles.section}>
      {/* Background glow */}
      <div className={styles.bgGlow} aria-hidden />

      <div className={styles.inner}>

        {/* Logo echipă */}
        <div data-logo className={styles.logoWrap}>
          <Image
            src="/assets/logo-no-ONCS-text-bright-highrez.png"
            alt="Polaris Bears"
            width={180} height={180}
            className={styles.logoImg}
          />
        </div>

        <p data-reveal className={styles.label}>Echipa</p>
        <h2 data-reveal className={styles.heading}>Polaris Bears</h2>

        {/* Slogan */}
        <p data-typewriter className={styles.slogan}>
          Inovăm prezentul. Alimentăm viitorul.
        </p>

        {/* Badge olimpici */}
        <div data-reveal className={styles.olympicBadge}>
          <span className={styles.olympicIcon}>★</span>
          <span>Olimpici Naționali Medaliați — Astronomie &amp; Astrofizică</span>
        </div>

        {/* Carduri membri */}
        <div className={styles.members}>
          {[
            { name: 'Albert OLARIU',  role: 'Cercetător · Clasa VIII-a', side: 'stânga' },
            { name: 'Ioan CHELARU',   role: 'Cercetător · Clasa VIII-a', side: 'dreapta' },
          ].map((m, i) => (
            <div key={m.name} data-card className={styles.memberCard}>
              <div className={styles.cardGlow} aria-hidden />
              <div className={styles.cardContent}>
                <div className={styles.memberInitial}>{m.name[0]}</div>
                <p className={styles.memberName}>{m.name}</p>
                <p className={styles.memberRole}>{m.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Foto echipă */}
        <div data-reveal className={styles.heroImg}>
          <Image
            src="/assets/team-hero.jpeg"
            alt="Albert OLARIU și Ioan CHELARU — Polaris Bears"
            fill
            className={styles.heroImgEl}
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <div className={styles.heroImgOverlay} />
          <div className={styles.heroImgCaption}>
            <span>Albert OLARIU</span>
            <span className={styles.captionDivider}>·</span>
            <span>Ioan CHELARU</span>
          </div>
        </div>

        {/* Badge-uri */}
        <div className={styles.badges}>
          {[
            'ONCS 2026',
            'Secțiunea A',
            'Științe Fundamentale',
            'Clasa VIII-a',
            'Olimpici Naționali',
          ].map(b => (
            <span key={b} data-badge className={styles.badge}>{b}</span>
          ))}
        </div>

      </div>
    </section>
  )
}
