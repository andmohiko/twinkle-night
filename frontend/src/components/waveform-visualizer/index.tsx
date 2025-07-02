/**
 * スペクトラムアナライザー波形表示コンポーネント
 *
 * @description
 * - 音楽再生中にリアルタイムで周波数スペクトラムを視覚化
 * - スペクトラムアナライザー形式で縦バーでの表示
 * - Canvas APIを使用した高性能な描画処理
 * - 画面下部に固定配置で表示
 *
 * @features
 * - リアルタイム周波数解析データの受信
 * - スペクトラムアナライザー形式の縦バー表示
 * - 黄色系グラデーションでの描画
 * - レスポンシブ対応（画面幅に応じた表示調整）
 * - アニメーションフレームによるスムーズな更新
 * - 音楽停止時の波形フェードアウト
 *
 * @canvas_rendering
 * - 周波数データを縦バーとして描画
 * - バーの高さは周波数の強度に比例
 * - 黄色からオレンジのグラデーション適用
 * - バー間にスペースを設けて視認性向上
 *
 * @performance
 * - requestAnimationFrame使用で60FPS描画
 * - 不要な再描画を防ぐ最適化
 * - Canvas要素のサイズ最適化
 *
 * @props
 * - analyserNode: Web Audio APIのAnalyserNode（周波数データ取得用）
 * - isPlaying: 音楽再生状態（波形表示の制御用）
 * - height: 波形表示エリアの高さ（px）
 */

'use client'

import { useEffect, useRef } from 'react'
import styles from './style.module.css'
import { WAVEFORM_STYLE, CANVAS_CONFIG } from './config'

type WaveformVisualizerProps = {
  /** Web Audio APIのAnalyserNode（周波数データ取得に使用） */
  analyserNode: AnalyserNode | null
  /** 音楽の再生状態（trueの時のみ波形を表示） */
  isPlaying: boolean
  /** 波形表示エリアの高さ（デフォルト: 100px） */
  height?: number
}

export const WaveformVisualizer = ({
  analyserNode,
  isPlaying,
  height = 100,
}: WaveformVisualizerProps): React.ReactNode => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | null>(null)

  /**
   * Canvas要素の初期設定
   * レスポンシブ対応のサイズ設定と描画コンテキストの準備
   */
  const initializeCanvas = (): void => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('WaveformVisualizer: Canvas要素が見つかりません')
      return
    }

    // 親要素の横幅を取得（1200px固定）
    const parentElement = canvas.parentElement
    const screenWidth = parentElement ? parentElement.offsetWidth : 1500

    // デバイスピクセル比を取得（上限設定）
    const devicePixelRatio = Math.min(
      window.devicePixelRatio || 1,
      CANVAS_CONFIG.maxDevicePixelRatio,
    )

    // Canvas要素のサイズ設定
    canvas.width = screenWidth * devicePixelRatio
    canvas.height = height * devicePixelRatio
    canvas.style.width = `${screenWidth}px`
    canvas.style.height = `${height}px`

    // 描画コンテキストの取得と設定
    const context = canvas.getContext('2d')
    if (context) {
      context.scale(devicePixelRatio, devicePixelRatio)
      context.imageSmoothingEnabled = true
    }

    console.log('WaveformVisualizer: Canvas初期化完了', {
      width: screenWidth,
      height: height,
      devicePixelRatio: devicePixelRatio,
    })
  }

  /**
   * スペクトラム描画処理
   * AnalyserNodeから周波数データを取得してスペクトラムアナライザー形式で描画
   */
  const drawSpectrum = (): void => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context || !analyserNode) {
      return
    }

    // 周波数データを取得
    const frequencyData = new Uint8Array(analyserNode.frequencyBinCount)
    analyserNode.getByteFrequencyData(frequencyData)

    // Canvas背景をクリア
    context.clearRect(0, 0, canvas.width, canvas.height)

    // バーの設定
    const canvasWidth = canvas.offsetWidth
    const barCount = Math.min(frequencyData.length / 2, 256) // 表示バー数を制限
    const barWidth =
      (canvasWidth - WAVEFORM_STYLE.barSpacing * (barCount - 1)) / barCount

    // 黄色系グラデーションの作成
    const gradient = context.createLinearGradient(0, height, 0, 0)
    gradient.addColorStop(0, WAVEFORM_STYLE.barColor) // 黄色（底部）
    gradient.addColorStop(1, WAVEFORM_STYLE.gradientEndColor) // オレンジ（頂部）

    // 各バーを描画
    for (let i = 0; i < barCount; i++) {
      // データインデックス（低周波数を強調）
      const dataIndex = Math.floor((i * (frequencyData.length / 4)) / barCount)
      const amplitude = frequencyData[dataIndex] / 255

      // バーの高さ計算（最小・最大高さを保証）
      const barHeight = Math.max(
        Math.min(amplitude * height, WAVEFORM_STYLE.maxBarHeight),
        WAVEFORM_STYLE.minBarHeight,
      )

      // バーの位置計算
      const x = i * (barWidth + WAVEFORM_STYLE.barSpacing)
      const y = height - barHeight

      // バーを描画
      context.fillStyle = gradient
      context.fillRect(x, y, barWidth, barHeight)
    }
  }

  /**
   * アニメーションループ処理
   * requestAnimationFrameを使用した連続描画更新
   */
  const animationLoop = (): void => {
    // 再生状態チェック
    if (!isPlaying || !analyserNode) {
      return
    }

    // スペクトラム描画関数の呼び出し
    drawSpectrum()

    // 次のフレームのスケジューリング
    animationIdRef.current = requestAnimationFrame(animationLoop)
  }

  /**
   * アニメーション開始処理
   * 音楽再生開始時にアニメーションループを開始
   */
  const startAnimation = (): void => {
    // 既存のアニメーション停止
    stopAnimation()

    // アニメーションループの開始
    if (analyserNode && isPlaying) {
      console.log('WaveformVisualizer: アニメーション開始')
      animationLoop()
    }
  }

  /**
   * アニメーション停止処理
   * 音楽停止時にアニメーションを停止し、リソースを解放
   */
  const stopAnimation = (): void => {
    // アニメーションフレームのキャンセル
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = null
    }

    // Canvas画面のクリア
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    console.log('WaveformVisualizer: アニメーション停止')
  }

  /**
   * リサイズハンドリング
   * ウィンドウサイズ変更時のCanvas要素サイズ調整
   */
  const handleResize = (): void => {
    console.log('WaveformVisualizer: リサイズ処理開始')

    // Canvas要素の再初期化
    initializeCanvas()

    // 描画の更新（再生中の場合）
    if (isPlaying && analyserNode) {
      drawSpectrum()
    }
  }

  /**
   * コンポーネントマウント時の初期化処理
   */
  useEffect(() => {
    initializeCanvas()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      stopAnimation()
    }
  }, [])

  /**
   * 再生状態とAnalyserNode変更時の処理
   */
  useEffect(() => {
    if (isPlaying && analyserNode) {
      startAnimation()
    } else {
      stopAnimation()
    }
  }, [isPlaying, analyserNode])

  return (
    <canvas
      ref={canvasRef}
      className={styles.waveformCanvas}
      style={{ height: `${height}px` }}
    />
  )
}
