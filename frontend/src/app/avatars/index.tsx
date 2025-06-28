/* eslint-disable @next/next/no-img-element */
import styles from './style.module.css'

export const Avatars = (): React.ReactNode => {
  return (
    <div className={styles.avatars}>
      <img src="/images/avatar.png" alt="avatar" className={styles.avatar1} />
      <img src="/images/avatar2.png" alt="avatar" className={styles.avatar2} />
      <img src="/images/avatar3.png" alt="avatar" className={styles.avatar3} />
    </div>
  )
}
