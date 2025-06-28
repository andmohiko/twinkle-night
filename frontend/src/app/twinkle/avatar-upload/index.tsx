'use client'

import { FileInputWithCropper } from '@/components/inputs/file-input'
import styles from './style.module.css'
import { useState } from 'react'

export const AvatarUpload = (): React.ReactNode => {
  return (
    <div className={styles.avatarUpload}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>アバターを作成</h2>
        <p className={styles.description}>
          全身が写っている画像をアップロードしてね
        </p>
      </div>
      <div className={styles.uploaderContainer}>
        <Uploader />
        <Uploader />
        <Uploader />
      </div>
    </div>
  )
}

export const Uploader = (): React.ReactNode => {
  const [avatar, setAvatar] = useState<string>('')
  return (
    <div className={styles.uploader}>
      <FileInputWithCropper
        value={avatar}
        onChange={(file) => {
          if (file) {
            setAvatar(file)
          }
        }}
      />
    </div>
  )
}
