'use client'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import styles from './Nav.module.css'

const LINKS = [
  { href: '#concept',  label: 'Concept' },
  { href: '#tech',     label: 'Tehnologie' },
  { href: '#numbers',  label: 'Date' },
  { href: '#team',     label: 'Echipă' },
]

export default function Nav() {
  const [scrolled, setScrolled]   = useState(false)
  const [open, setOpen]           = useState(false)
  const [active, setActive]       = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)

      // Active section detection
      const sections = LINKS.map(l => document.querySelector(l.href))
      let current = ''
      sections.forEach((s, i) => {
        if (s && s.getBoundingClientRect().top <= 120) current = LINKS[i].href
      })
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLink = useCallback((href: string) => {
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#hero" className={styles.logo} onClick={e => { e.preventDefault(); handleLink('#hero') }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-white.svg"
            alt="POLARIS Bears"
            width={38} height={38}
            className={styles.logoImg}
          />
          <span className={styles.logoText}>P.O.L.A.R.I.S.</span>
        </a>

        <ul className={styles.links}>
          {LINKS.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`${styles.link} ${active === l.href ? styles.linkActive : ''}`}
                onClick={e => { e.preventDefault(); handleLink(l.href) }}
              >
                {l.label}
                {active === l.href && <span className={styles.linkDot} aria-hidden />}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#team"
          className={styles.cta}
          onClick={e => { e.preventDefault(); handleLink('#team') }}
        >
          ONCS 2026
        </a>

        {/* Hamburger */}
        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Meniu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <ul className={styles.drawerLinks}>
          {LINKS.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`${styles.drawerLink} ${active === l.href ? styles.drawerLinkActive : ''}`}
                onClick={e => { e.preventDefault(); handleLink(l.href) }}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#team" className={styles.drawerCta} onClick={e => { e.preventDefault(); handleLink('#team') }}>
              ONCS 2026
            </a>
          </li>
        </ul>
      </div>
      {open && <div className={styles.drawerOverlay} onClick={() => setOpen(false)} />}
    </>
  )
}
