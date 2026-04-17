'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './Nav.module.css'

const links = [
  { href: '#concept',  label: 'Concept' },
  { href: '#tech',     label: 'Tehnologie' },
  { href: '#numbers',  label: 'Date' },
  { href: '#team',     label: 'Echipă' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#hero" className={styles.logo}>
        <Image
          src="/assets/logo-no-ONCS-text-bright.jpeg"
          alt="POLARIS logo"
          width={36} height={36}
          className={styles.logoImg}
        />
        <span className={styles.logoText}>P.O.L.A.R.I.S.</span>
      </a>
      <ul className={styles.links}>
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href} className={styles.link}>{l.label}</a>
          </li>
        ))}
      </ul>
      <a href="#team" className={styles.cta}>ONCS 2026</a>
    </nav>
  )
}
