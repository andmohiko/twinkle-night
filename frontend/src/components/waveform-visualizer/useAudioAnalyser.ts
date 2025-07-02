/**
 * 音声解析カスタムフック
 *
 * @description
 * - Web Audio APIを使用して音声の周波数解析を実行
 * - HTMLAudioElementからAudioContextとAnalyserNodeを作成
 * - スペクトラムアナライザー用の周波数データを提供
 * - ブラウザの自動再生ポリシーに準拠した実装
 *
 * @features
 * - AudioContextの作成と管理
 * - AnalyserNodeの設定と制御
 * - 音声ソースとの接続処理
 * - リソースの適切なクリーンアップ
 * - エラーハンドリングと復旧処理
 *
 * @audio_processing
 * - サンプリングレート: 44.1kHz（標準）
 * - FFTサイズ: 2048（周波数分解能調整可能）
 * - スムージング定数: 0.8（波形の滑らかさ調整）
 * - 周波数ビン数: FFTサイズの半分（1024）
 *
 * @browser_compatibility
 * - AudioContext非対応ブラウザの検出
 * - webkitAudioContextへのフォールバック
 * - ユーザー操作後のAudioContext初期化
 *
 * @return_values
 * - analyserNode: AnalyserNode | null - 周波数解析用ノード
 * - isInitialized: boolean - 初期化完了状態
 * - error: string | null - エラーメッセージ
 * - initializeAnalyser: 初期化関数
 * - cleanup: クリーンアップ関数
 *
 * @usage_example
 * ```typescript
 * const { analyserNode, isInitialized, error, initializeAnalyser } = useAudioAnalyser()
 *
 * // 音声要素と接続
 * useEffect(() => {
 *   if (audioElement) {
 *     initializeAnalyser(audioElement)
 *   }
 * }, [audioElement])
 * ```
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { ANALYSER_CONFIG } from './config'

type AudioAnalyserState = {
  /** Web Audio APIのAnalyserNode（周波数解析用） */
  analyserNode: AnalyserNode | null
  /** AudioContextの初期化完了状態 */
  isInitialized: boolean
  /** エラーメッセージ（エラー発生時のみ） */
  error: string | null
}

type AudioAnalyserHook = AudioAnalyserState & {
  /** 音声解析の初期化を実行する関数 */
  initializeAnalyser: (audioElement: HTMLAudioElement) => Promise<void>
  /** リソースのクリーンアップを実行する関数 */
  cleanup: () => void
}

export const useAudioAnalyser = (): AudioAnalyserHook => {
  const [state, setState] = useState<AudioAnalyserState>({
    analyserNode: null,
    isInitialized: false,
    error: null,
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)

  /**
   * AudioContextの作成と初期化
   * ブラウザ互換性を考慮したAudioContext作成処理
   *
   * @returns Promise<AudioContext> 作成されたAudioContext
   * @throws Error AudioContext作成に失敗した場合
   */
  const createAudioContext = async (): Promise<AudioContext> => {
    try {
      // AudioContext対応状況の確認
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext

      if (!AudioContextClass) {
        throw new Error('AudioContext is not supported in this browser')
      }

      // AudioContextの作成
      const audioContext = new AudioContextClass()
      console.log('useAudioAnalyser: AudioContext作成完了', {
        state: audioContext.state,
        sampleRate: audioContext.sampleRate,
      })

      // suspended状態の場合はresume実行
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
        console.log('useAudioAnalyser: AudioContext resumed')
      }

      return audioContext
    } catch (error) {
      console.error('useAudioAnalyser: AudioContext作成エラー', error)
      throw error
    }
  }

  /**
   * AnalyserNodeの作成と設定
   * スペクトラムアナライザー用の最適な設定を適用
   *
   * @param audioContext 作成済みのAudioContext
   * @returns AnalyserNode 設定済みのAnalyserNode
   */
  const createAnalyserNode = (audioContext: AudioContext): AnalyserNode => {
    try {
      // AnalyserNodeの作成
      const analyserNode = audioContext.createAnalyser()

      // 最適化設定の適用
      analyserNode.fftSize = ANALYSER_CONFIG.fftSize
      analyserNode.smoothingTimeConstant = ANALYSER_CONFIG.smoothingTimeConstant
      analyserNode.minDecibels = ANALYSER_CONFIG.minDecibels
      analyserNode.maxDecibels = ANALYSER_CONFIG.maxDecibels

      console.log('useAudioAnalyser: AnalyserNode作成完了', {
        fftSize: analyserNode.fftSize,
        frequencyBinCount: analyserNode.frequencyBinCount,
        smoothingTimeConstant: analyserNode.smoothingTimeConstant,
      })

      return analyserNode
    } catch (error) {
      console.error('useAudioAnalyser: AnalyserNode作成エラー', error)
      throw error
    }
  }

  /**
   * 音声ソースとAnalyserNodeの接続
   * HTMLAudioElementからMediaElementAudioSourceNodeを作成し接続
   *
   * @param audioElement 音声要素
   * @param audioContext AudioContext
   * @param analyserNode AnalyserNode
   * @returns MediaElementAudioSourceNode 作成されたソースノード
   */
  const connectAudioSource = (
    audioElement: HTMLAudioElement,
    audioContext: AudioContext,
    analyserNode: AnalyserNode,
  ): MediaElementAudioSourceNode => {
    try {
      // 重複接続の防止チェック
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect()
      }

      // MediaElementAudioSourceNodeの作成
      const sourceNode = audioContext.createMediaElementSource(audioElement)

      // source -> analyser -> destination の接続
      sourceNode.connect(analyserNode)
      analyserNode.connect(audioContext.destination)

      // 参照を保存
      sourceNodeRef.current = sourceNode

      console.log('useAudioAnalyser: 音声ソース接続完了')
      return sourceNode
    } catch (error) {
      console.error('useAudioAnalyser: 音声ソース接続エラー', error)
      throw error
    }
  }

  /**
   * 音声解析の初期化メイン処理
   * AudioContext、AnalyserNode、音声ソースの作成と接続を実行
   *
   * @param audioElement 解析対象の音声要素
   */
  const initializeAnalyser = useCallback(
    async (audioElement: HTMLAudioElement): Promise<void> => {
      try {
        console.log('useAudioAnalyser: 音声解析初期化開始')

        // 既存リソースのクリーンアップ
        cleanup()

        // AudioContextの作成
        const audioContext = await createAudioContext()
        audioContextRef.current = audioContext

        // AnalyserNodeの作成と設定
        const analyserNode = createAnalyserNode(audioContext)

        // 音声ソースとの接続
        connectAudioSource(audioElement, audioContext, analyserNode)

        // 状態の更新（初期化完了）
        setState({
          analyserNode,
          isInitialized: true,
          error: null,
        })

        console.log('useAudioAnalyser: 音声解析初期化完了')
      } catch (error) {
        // エラー状態の設定
        setState({
          analyserNode: null,
          isInitialized: false,
          error:
            error instanceof Error
              ? error.message
              : '不明なエラーが発生しました',
        })

        console.error('useAudioAnalyser: 初期化エラー', error)
      }
    },
    [],
  )

  /**
   * リソースのクリーンアップ処理
   * AudioContext、AnalyserNode、接続の解放
   */
  const cleanup = useCallback((): void => {
    console.log('useAudioAnalyser: リソースクリーンアップ開始')

    // SourceNodeの切断
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect()
      } catch (error) {
        console.warn('useAudioAnalyser: SourceNode切断エラー', error)
      }
      sourceNodeRef.current = null
    }

    // AudioContextのクローズ
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close()
      } catch (error) {
        console.warn('useAudioAnalyser: AudioContext終了エラー', error)
      }
      audioContextRef.current = null
    }

    // 状態のリセット
    setState({
      analyserNode: null,
      isInitialized: false,
      error: null,
    })

    console.log('useAudioAnalyser: リソースクリーンアップ完了')
  }, [])

  /**
   * コンポーネントアンマウント時のクリーンアップ
   */
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    ...state,
    initializeAnalyser,
    cleanup,
  }
}
