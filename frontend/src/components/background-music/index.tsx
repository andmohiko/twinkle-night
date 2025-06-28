/**
 * BGM再生同意コンポーネント
 *
 * @description
 * - ユーザーの同意を得てからBGMを再生する
 * - 同意ボタンを表示し、クリック後に音声再生を開始
 * - ブラウザの自動再生ポリシーに準拠した設計
 *
 * @features
 * - 同意ボタンUI表示
 * - ユーザー操作による再生開始
 * - ループ再生
 * - 音量調整
 * - エラーハンドリング
 * - 音声ファイル読み込み状況の監視
 *
 * @ui_components
 * - 同意確認メッセージ「音を鳴らしてもいい？」
 * - 同意ボタン「いいよ！」
 * - 非表示のaudio要素
 *
 * @user_flow
 * 1. ページロード時に同意確認UIを表示
 * 2. ユーザーが「いいよ！」ボタンをクリック
 * 3. BGM再生開始
 */

'use client'

import { useEffect, useRef, useState } from 'react'

import styles from './style.module.css'

type BackgroundMusicProps = {
  /** 音声ファイルのパス */
  src: string
  /** 音量（0.0 - 1.0） */
  volume?: number
  /** ループ再生するかどうか */
  loop?: boolean
}

export function BackgroundMusic({
  src,
  volume = 0.5,
  loop = true,
}: BackgroundMusicProps) {
  const [isPermitted, setIsPermitted] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  /**
   * コンポーネントマウント時の処理
   * 音量設定のみ行う（再生は同意ボタンで行う）
   */
  useEffect(() => {
    if (audioRef.current) {
      // 音量を設定
      audioRef.current.volume = volume
      console.log('BackgroundMusic: 音量設定完了 -', volume)
    }
  }, [volume])

  /**
   * オーディオエラーハンドリング
   * 音声ファイルの読み込みエラーを処理
   */
  const handleAudioError = (
    error: React.SyntheticEvent<HTMLAudioElement, Event>,
  ) => {
    console.error('BackgroundMusic: 音声ファイルの読み込みに失敗しました:', {
      error: error.currentTarget.error,
      src: error.currentTarget.src,
      readyState: error.currentTarget.readyState,
      networkState: error.currentTarget.networkState,
    })
  }

  /**
   * オーディオ読み込み完了時の処理
   */
  const handleAudioLoaded = () => {
    console.log('BackgroundMusic: 音声ファイルの読み込みが完了しました -', src)
  }

  return (
    <>
      {/* 音の再生の同意をとる */}
      {isPermitted ? null : (
        <div className={styles.permission}>
          <span className={styles.permissionText}>音を鳴らしてもいい？</span>
          <button
            className={styles.permissionButton}
            onClick={() => {
              setIsPermitted(true)
              audioRef.current?.play()
            }}
          >
            いいよ！
          </button>
        </div>
      )}
      {/* 音の再生 */}
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        controls={false}
        preload="auto"
        onError={handleAudioError}
        onLoadedData={handleAudioLoaded}
        style={{ display: 'none' }}
      />
    </>
  )
}
