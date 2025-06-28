/* eslint-disable @next/next/no-img-element */
import styles from './style.module.css'

export default function TwinklePage() {
  return (
    <div className={styles.container}>
      {/* background */}
      <div className={styles.twinkle}>
        <div className={styles.city}></div>
        <img src="/images/avatar.png" alt="avatar" className={styles.avatar} />
      </div>
    </div>
  )
}
