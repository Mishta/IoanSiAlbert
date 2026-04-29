'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './Team.module.css'

const COLLABORATORS = [
  {
    name: 'Prof. Dr. Francisc Dionisie AARON',
    role: 'Mentor · Coordonator',
    institution: 'ICHB — Liceul Teoretic Internațional de Informatică, București',
    contribution: 'Coordonarea proiectului și îndrumarea echipei POLARIS Bears',
    initial: 'A',
    accent: 'var(--gold)',
  },
  {
    name: 'Prof. Univ. Dr. Valentin BARNA',
    role: 'Colaborator științific',
    institution: 'Facultatea de Fizică, Universitatea din București · Optică & Fotonică',
    contribution: 'Consultanță: principii de fotonică și conversie radiație solară → LASER',
    initial: 'B',
    accent: 'var(--cyan)',
  },
  {
    name: 'Carlo Emilio MONTANARI',
    role: 'Colaborator — Fizician aplicat',
    institution: 'Doctorand Dinamica Fasciculelor, CERN / Univ. Bologna',
    contribution: 'Consultanță: dinamica fasciculelor de înaltă precizie (LHC → POLARIS)',
    initial: 'M',
    accent: 'var(--cyan)',
  },
  {
    name: 'Daniel-Justinian ZELENSCHI',
    role: 'Colaborator — PhD(c) AI',
    institution: 'Raiffeisen AI · UCL + Univ. Melbourne · NASA Ames — Premiul II',
    contribution: 'Consultanță: algoritmi AI pentru controlul autonom al swarm-ului orbital',
    initial: 'Z',
    accent: 'var(--cyan)',
  },
]

const OLYMPIADS = [
  { label: 'Astronomie & Astrofizică', icon: '★' },
  { label: 'Informatică', icon: '★' },
  { label: 'ONIA — Inteligență Artificială', icon: '★' },
]

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
          opacity: 0, y: 60, duration: 1, delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })

      // Slogan typewriter
      const sloganEl = sectionRef.current?.querySelector('[data-typewriter]')
      if (sloganEl) {
        gsap.from(sloganEl, {
          opacity: 0, duration: 0.3,
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

      // Member cards float
      const cards = sectionRef.current?.querySelectorAll('[data-card]') ?? []
      cards.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 80, rotateY: 15, duration: 1.1, delay: i * 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%' },
        })
        gsap.to(card, {
          y: -8, duration: 2.5 + i * 0.4, repeat: -1, yoyo: true,
          ease: 'sine.inOut', delay: i * 0.5,
        })
      })

      // Logo pulse
      const logoEl = sectionRef.current?.querySelector('[data-logo]')
      if (logoEl) {
        gsap.from(logoEl, {
          opacity: 0, scale: 0.6, rotation: -20, duration: 1.2,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: logoEl, start: 'top 85%' },
        })
        gsap.to(logoEl, {
          scale: 1.04, duration: 3, repeat: -1, yoyo: true,
          ease: 'sine.inOut', delay: 1.5,
        })
      }

      // Collaborator cards stagger
      const collabCards = sectionRef.current?.querySelectorAll('[data-collab]') ?? []
      collabCards.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 40, duration: 0.8, delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 88%' },
        })
      })

      // Badge shimmer
      const badges = sectionRef.current?.querySelectorAll('[data-badge]') ?? []
      badges.forEach((badge, i) => {
        gsap.from(badge, {
          opacity: 0, x: -30, duration: 0.6, delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: badge, start: 'top 90%' },
        })
      })
    }
    init()
  }, [])

  return (
    <section id="team" ref={sectionRef} className={styles.section}>
      <div className={styles.bgGlow} aria-hidden />

      <div className={styles.inner}>

        {/* Logo echipă */}
        <div data-logo className={styles.logoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-white.svg"
            alt="POLARIS Bears"
            width={180} height={180}
            className={styles.logoImg}
          />
        </div>

        <p data-reveal className={styles.label}>Echipa</p>
        <h2 data-reveal className={styles.heading}>POLARIS Bears</h2>

        <p data-typewriter className={styles.slogan}>
          Inovăm prezentul. Alimentăm viitorul.
        </p>

        {/* Badge olimpici — toate trei olimpiadele */}
        <div data-reveal className={styles.olympicWrap}>
          <p className={styles.olympicTitle}>
            <span className={styles.olympicIcon}>★</span>
            Olimpici Naționali Medaliați
          </p>
          <div className={styles.olympicList}>
            {OLYMPIADS.map(o => (
              <span key={o.label} className={styles.olympicItem}>
                {o.icon} {o.label}
              </span>
            ))}
          </div>
        </div>

        {/* Carduri membri */}
        <div className={styles.members}>
          {[
            { name: 'Albert OLARIU', role: 'Cercetător · Clasa VIII-a' },
            { name: 'Ioan CHELARU',  role: 'Cercetător · Clasa VIII-a' },
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
            src="/assets/team-hero.jpg"
            alt="Albert OLARIU și Ioan CHELARU — POLARIS Bears"
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
            'Juniori',
            'Științe Fundamentale',
            'Clasa VIII-a',
            'Olimpici Naționali',
          ].map(b => (
            <span key={b} data-badge className={styles.badge}>{b}</span>
          ))}
        </div>

        {/* Colaboratori */}
        <div data-reveal className={styles.collabSection}>
          <p className={styles.collabLabel}>Colaboratori</p>
          <div className={styles.collabGrid}>
            {COLLABORATORS.map((c, i) => (
              <div key={c.name} data-collab className={styles.collabCard} style={{ '--caccent': c.accent } as React.CSSProperties}>
                <div className={styles.collabInitial}>{c.initial}</div>
                <div className={styles.collabInfo}>
                  <p className={styles.collabName}>{c.name}</p>
                  <p className={styles.collabRole}>{c.role}</p>
                  <p className={styles.collabInstitution}>{c.institution}</p>
                  <p className={styles.collabContrib}>{c.contribution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
