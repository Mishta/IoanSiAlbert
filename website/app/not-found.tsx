'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  const codeRef  = useRef<HTMLSpanElement>(null)
  const msgRef   = useRef<HTMLParagraphElement>(null)
  const btnRef   = useRef<HTMLAnchorElement>(null)
  const glitchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const mod = await import('gsap')
      const gsap = mod.gsap ?? mod.default
      const { TextPlugin } = await import('gsap/TextPlugin')
      gsap.registerPlugin(TextPlugin)

      const tl = gsap.timeline({ delay: 0.3 })

      // Glitch reveal for 404
      if (glitchRef.current) {
        gsap.set(glitchRef.current, { opacity: 0, scale: 1.15 })
        tl.to(glitchRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
      }

      if (codeRef.current) {
        const el = codeRef.current
        const original = el.textContent || ''
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%'
        let iter = 0
        const interval = setInterval(() => {
          el.textContent = original.split('').map((ch, i) => {
            if (i < iter) return ch
            return chars[Math.floor(Math.random() * chars.length)]
          }).join('')
          if (iter >= original.length) clearInterval(interval)
          iter += 0.4
        }, 40)
        tl.add(() => {}, '+=0.1')
      }

      if (msgRef.current) {
        gsap.set(msgRef.current, { opacity: 0, y: 30 })
        tl.to(msgRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
      }
      if (btnRef.current) {
        gsap.set(btnRef.current, { opacity: 0, y: 20 })
        tl.to(btnRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      }
    }
    init()
  }, [])

  return (
    <div className={styles.page}>
      {/* Landscape background — desktop */}
      <div className={styles.bgLandscape}>
        <Image
          src="/images/generated/404-landscape.jpg"
          alt=""
          fill
          className={styles.bgImg}
          priority
        />
      </div>
      {/* Portrait background — mobile */}
      <div className={styles.bgPortrait}>
        <Image
          src="/images/generated/404-portrait.jpg"
          alt=""
          fill
          className={styles.bgImg}
          priority
        />
      </div>
      <div className={styles.overlay} aria-hidden />

      <div className={styles.content}>
        <div ref={glitchRef} className={styles.glitchWrap}>
          <span ref={codeRef} className={styles.code404}>404</span>
        </div>
        <p ref={msgRef} className={styles.message}>
          Ați zburat prea departe de orbită...<br />
          <em>dar călătoria continuă!</em>
        </p>
        <Link ref={btnRef} href="/" className={styles.btn}>
          ← Navigheați înapoi spre bază
        </Link>
      </div>
    </div>
  )
}
