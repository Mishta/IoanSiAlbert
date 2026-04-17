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
      gsap.registerPlugin(ScrollTrigger)

      gsap.from(sectionRef.current?.querySelectorAll('[data-reveal]') ?? [], {
        opacity: 0, y: 50,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      })
    }
    init()
  }, [])

  return (
    <section id="team" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <p data-reveal className={styles.label}>Echipa</p>
        <h2 data-reveal className={styles.heading}>Polaris Bears</h2>

        <div data-reveal className={styles.members}>
          {['Ioan CHELARU', 'Albert OLARIU'].map(name => (
            <div key={name} className={styles.member}>
              <div className={styles.avatar}>
                <span className={styles.avatarLetter}>{name[0]}</span>
              </div>
              <p className={styles.memberName}>{name}</p>
              <p className={styles.memberRole}>Cercetător · Clasa VIII-a</p>
            </div>
          ))}
        </div>

        <div data-reveal className={styles.badges}>
          {[
            'Olimpici Informatică',
            'ONCS 2026',
            'Secțiunea A',
            'Științe Exacte',
          ].map(b => (
            <span key={b} className={styles.badge}>{b}</span>
          ))}
        </div>

        <div data-reveal className={styles.heroImg}>
          <Image
            src="/assets/team-hero.jpeg"
            alt="Polaris Bears"
            fill
            className={styles.heroImgEl}
          />
          <div className={styles.heroImgOverlay} />
        </div>
      </div>
    </section>
  )
}
