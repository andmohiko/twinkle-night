import styles from './style.module.css'

export const Lyrics = (): React.ReactNode => {
  return (
    <div className={styles.lyrics}>
      <div className={styles.lyricsInner}>
        <p className={styles.lyricsText}>Twinkle Night</p>
      </div>
    </div>
  )
}
