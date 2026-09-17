import styles from '../Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.line} />
      <div className={styles.inner}>
        <p className={styles.title}>P.O.L.A.R.I.S.</p>
        <p className={styles.sub}>
          Planetary Orbital Laser Array Relay Infrastructure System
        </p>
        <div className={styles.row}>
          <span>POLARIS Bears · Ioan CHELARU &amp; Albert OLARIU</span>
          <span>·</span>
          <span>Fundamental Sciences</span>
        </div>
      </div>
    </footer>
  )
}
