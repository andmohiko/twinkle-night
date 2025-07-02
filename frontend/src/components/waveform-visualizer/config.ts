/**
 * 音声解析・波形表示設定定数
 *
 * @description
 * - Web Audio APIの設定値を一元管理
 * - スペクトラムアナライザーの最適化設定
 * - 波形表示のデザイン設定
 * - パフォーマンス調整用の設定値
 *
 * @sections
 * - ANALYSER_CONFIG: AnalyserNodeの設定
 * - WAVEFORM_STYLE: 波形表示のスタイル
 * - ANIMATION_CONFIG: アニメーション設定
 * - PERFORMANCE_CONFIG: パフォーマンス設定
 *
 * @optimization
 * - FFTサイズは2048で音質と処理負荷のバランスを取る
 * - スムージング定数0.8で滑らかな波形表示
 * - 60FPSでスムーズなアニメーション
 */

import type { AnalyserSettings, WaveformStyle, AnimationConfig } from './types'

/**
 * AnalyserNode用の最適化設定
 * スペクトラムアナライザーの音質と処理負荷のバランスを考慮
 */
export const ANALYSER_CONFIG: AnalyserSettings = {
  /** FFTサイズ: 2048 (音質と処理負荷のバランス) */
  fftSize: 2048,

  /** 周波数ビン数: FFTサイズの半分 */
  frequencyBinCount: 1024,

  /** スムージング定数: 0.8 (滑らかな波形表示) */
  smoothingTimeConstant: 0.8,

  /** 最小デシベル値: -90dB (静音レベル) */
  minDecibels: -90,

  /** 最大デシベル値: -10dB (最大音量レベル) */
  maxDecibels: -10,
}

/**
 * 波形表示の黄色系スタイル設定
 * twinkle nightの世界観に合わせた配色
 */
export const WAVEFORM_STYLE: WaveformStyle = {
  /** 背景色: 透明 */
  backgroundColor: 'transparent',

  /** バーの基本色: 黄色 */
  barColor: '#B2C090',

  /** グラデーション終了色: オレンジ */
  gradientEndColor: '#FFA500',

  /** バー間のスペース: 2px */
  barSpacing: 2,

  /** バーの最小高さ: 2px */
  minBarHeight: 2,

  /** バーの最大高さ: 390px */
  maxBarHeight: 390,
}

/**
 * アニメーション設定
 * 60FPSでスムーズな描画を実現
 */
export const ANIMATION_CONFIG: AnimationConfig = {
  /** フレームレート: 60FPS */
  frameRate: 60,

  /** フェードイン時間: 500ms */
  fadeInDuration: 500,

  /** フェードアウト時間: 300ms */
  fadeOutDuration: 300,

  /** アニメーション開始遅延: 100ms */
  startDelay: 100,
}

/**
 * Canvas描画設定
 * レスポンシブ対応とパフォーマンス最適化
 */
export const CANVAS_CONFIG = {
  /** デフォルト高さ: 300px */
  defaultHeight: 300,

  /** 最小幅: 320px (モバイル対応) */
  minWidth: 320,

  /** 最大幅: 1920px (デスクトップ対応) */
  maxWidth: 1920,

  /** デバイスピクセル比の上限: 2 (高DPI対応) */
  maxDevicePixelRatio: 2,
} as const

/**
 * パフォーマンス関連設定
 * メモリ使用量と描画負荷の最適化
 */
export const PERFORMANCE_CONFIG = {
  /** 周波数データ更新間隔: 16ms (約60FPS) */
  dataUpdateInterval: 16,

  /** Canvas描画の最適化間引き: 1 (全フレーム描画) */
  renderSkipFrames: 1,

  /** メモリ使用量監視閾値: 50MB */
  memoryThreshold: 50 * 1024 * 1024,

  /** アニメーション停止時のクリーンアップ遅延: 1000ms */
  cleanupDelay: 1000,
} as const

/**
 * エラーメッセージ定数
 * 一貫したエラーハンドリング用
 */
export const ERROR_MESSAGES = {
  /** AudioContext非対応 */
  AUDIO_CONTEXT_NOT_SUPPORTED:
    'お使いのブラウザはWeb Audio APIに対応していません',

  /** AudioContext初期化失敗 */
  AUDIO_CONTEXT_INIT_FAILED: 'オーディオコンテキストの初期化に失敗しました',

  /** AnalyserNode作成失敗 */
  ANALYSER_NODE_CREATION_FAILED: '音声解析ノードの作成に失敗しました',

  /** 音声ソース接続失敗 */
  AUDIO_SOURCE_CONNECTION_FAILED: '音声ソースとの接続に失敗しました',

  /** Canvas要素取得失敗 */
  CANVAS_ELEMENT_NOT_FOUND: 'Canvas要素が見つかりません',

  /** 描画コンテキスト取得失敗 */
  CANVAS_CONTEXT_NOT_AVAILABLE: 'Canvas描画コンテキストが利用できません',
} as const

/**
 * デバッグ用設定
 * 開発時のログ出力制御
 */
export const DEBUG_CONFIG = {
  /** 詳細ログ出力: 開発環境でのみ有効 */
  verboseLogging: process.env.NODE_ENV === 'development',

  /** パフォーマンス測定: 開発環境でのみ有効 */
  performanceTracking: process.env.NODE_ENV === 'development',

  /** Web Audio API状態ログ: 開発環境でのみ有効 */
  audioStateLogging: process.env.NODE_ENV === 'development',
} as const
