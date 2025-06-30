'use client'

import { BackgroundMusic } from '@/components/background-music'
import { useState } from 'react'
import styles from './style.module.css'

export const Music = (): React.ReactNode => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <>
      {/* BGM再生（クライアントコンポーネント） */}
      <BackgroundMusic
        src="/audio/twinkle_night.mp3"
        volume={0.5}
        loop={true}
        isPlaying={isPlaying}
      />

      {/* 音の再生の同意をとる */}
      {isPlaying ? null : (
        <div className={styles.permission}>
          <span className={styles.permissionText}>音を鳴らしてもいい？</span>
          <button
            className={styles.permissionButton}
            onClick={() => {
              handlePlay()
            }}
          >
            いいよ！
          </button>
        </div>
      )}
    </>
  )
}
