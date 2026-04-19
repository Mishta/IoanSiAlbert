'use client'
import { useEffect, useRef } from 'react'
import styles from './Stats.module.css'

const STATS = [
  { value: 1.6,   decimals: 1, suffix: ' TW',  label: 'putere livrată',           sub: '≈ 48% din electricitatea globală' },
  { value: 48,    decimals: 0, suffix: '%',     label: 'din electricitatea globală', sub: 'pentru civilizația Kardashev 1' },
  { value: 800,   decimals: 0, suffix: ' GW',   label: 'per cablu YBCO',            sub: 'superconductor la 77K — azot lichid' },
  { value: 30,    decimals: 0, suffix: '',       label: 'oglinzi Dyson',             sub: 'Ø 1 km · la 7 milioane km de Soare' },
  { value: 4,     decimals: 0, suffix: '',       label: 'sateliți colectori',        sub: 'eficiență laser 43% · orbită solară' },
  { value: 622000,decimals: 0, suffix: ' W/m²', label: 'intensitate solară',        sub: 'de 457× față de suprafața Pământului' },
]

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const numRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const init = async () => {
      const mod = await import('gsap')
      const gsap = mod.gsap ?? mod.default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Section reveal
      gsap.from(sectionRef.current?.querySelector('[data-header]'), {
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })

      // Cards stagger
      const cards = sectionRef.current?.querySelectorAll('[data-stat]') ?? []
      gsap.from(cards, {
        opacity: 0, y: 60, scale: 0.92,
        duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      // Counter animation per card
      STATS.forEach((stat, i) => {
        const el = numRefs.current[i]
        if (!el) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: stat.value,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate() {
            const v = stat.decimals > 0
              ? obj.val.toFixed(stat.decimals)
              : Math.round(obj.val).toLocaleString('ro-RO')
            el.textContent = v + stat.suffix
          },
        })
      })

      // Pulse glow on each card
      cards.forEach((card, i) => {
        gsap.to(card.querySelector('[data-glow]'), {
          opacity: 0.6,
          duration: 1.8 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        })
      })
    }
    init()
  }, [])

  return (
    <section id="numbers" ref={sectionRef} className={styles.section}>
      <div className={styles.bgLines} aria-hidden />

      <div data-header className={styles.header}>
        <p className={styles.label}>Date cheie</p>
        <h2 className={styles.heading}>Cifrele care contează</h2>
      </div>

      <div className={styles.grid}>
        {STATS.map((stat, i) => (
          <div key={i} data-stat className={styles.card}>
            <div data-glow className={styles.cardGlow} aria-hidden />
            <span
              ref={el => { numRefs.current[i] = el }}
              className={styles.value}
            >
              0{stat.suffix}
            </span>
            <p className={styles.cardLabel}>{stat.label}</p>
            <p className={styles.cardSub}>{stat.sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
