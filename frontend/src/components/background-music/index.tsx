/**
 * BGM再生同意コンポーネント
 *
 * @description
 * - ユーザーの同意を得てからBGMを再生する
 * - 同意ボタンを表示し、クリック後に音声再生を開始
 * - ブラウザの自動再生ポリシーに準拠した設計
 * - Web Audio API統合により波形表示に対応
 *
 * @features
 * - 同意ボタンUI表示
 * - ユーザー操作による再生開始
 * - 音量調整
 * - エラーハンドリング
 * - 音声ファイル読み込み状況の監視
 * - Web Audio API連携（波形表示用）
 *
 * @ui_components
 * - 同意確認メッセージ「音を鳴らしてもいい？」
 * - 同意ボタン「いいよ！」
 * - 非表示のaudio要素
 * - 波形表示コンポーネント
 *
 * @user_flow
 * 1. ページロード時に同意確認UIを表示
 * 2. ユーザーが「いいよ！」ボタンをクリック
 * 3. BGM再生開始
 * 4. Web Audio API初期化
 * 5. 波形表示開始
 *
 * @audio_integration
 * - HTMLAudioElementとWeb Audio APIの連携
 * - 音声解析用AnalyserNodeの提供
 * - 波形表示コンポーネントとの連動
 */

'use client'

import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from 'react-icons/hi2'
import { SiYoutube } from 'react-icons/si'
import { useEffect, useRef, useState } from 'react'
import styles from './style.module.css'
import { IconButton } from '../buttons/icon-button'
import { WaveformVisualizer } from '../waveform-visualizer'
import { useAudioAnalyser } from '../waveform-visualizer/useAudioAnalyser'

type BackgroundMusicProps = {
  /** 音声ファイルのパス */
  src: string
  /** 音量（0.0 - 1.0） */
  volume?: number
  /** ループ再生するかどうか（デフォルト: false） */
  loop?: boolean
  /** 再生するかどうか */
  isPlaying?: boolean
}

export function BackgroundMusic({
  src,
  volume = 0.5,
  loop = false,
  isPlaying = false,
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  // Web Audio API統合
  const { analyserNode, isInitialized, initializeAnalyser } = useAudioAnalyser()

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

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play()
      // Web Audio APIの初期化
      if (audioRef.current && !isInitialized) {
        initializeAnalyser(audioRef.current)
      }
    }
  }, [isPlaying, isInitialized, initializeAnalyser])

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

  const toggleMute = () => {
    console.log('toggleMute', isMuted, audioRef.current?.volume)
    if (isMuted) {
      audioRef.current!.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current!.volume = 0
      setIsMuted(true)
    }
  }

  /**
   * オーディオ読み込み完了時の処理
   */
  const handleAudioLoaded = () => {
    console.log('BackgroundMusic: 音声ファイルの読み込みが完了しました -', src)
  }

  return (
    <>
      <div className={styles.controller}>
        <a
          href="https://www.youtube.com/watch?v=uUvthLpSHrQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiYoutube size={32} color="white" />
        </a>
        <div className={styles.mute}>
          {isMuted ? (
            <IconButton
              importance="primary"
              icon={<HiOutlineSpeakerXMark size={24} />}
              onClick={toggleMute}
              size="lg"
            />
          ) : (
            <IconButton
              importance="primary"
              icon={<HiOutlineSpeakerWave size={24} />}
              onClick={toggleMute}
              size="lg"
            />
          )}
        </div>
      </div>
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
      <div className={styles.waveformWrapper}>
        <WaveformVisualizer
          analyserNode={analyserNode}
          isPlaying={isPlaying}
          height={500}
        />
      </div>
    </>
  )
}
