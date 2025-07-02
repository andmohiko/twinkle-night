/**
 * 音声解析・波形表示関連の型定義
 *
 * @description
 * - Web Audio APIに関連する型定義
 * - スペクトラムアナライザー用の設定値
 * - 波形表示コンポーネント用のプロパティ型
 * - エラーハンドリング用の型定義
 *
 * @audio_context_types
 * - AudioContextState: AudioContextの状態管理用
 * - AnalyserSettings: AnalyserNodeの設定値
 * - FrequencyData: 周波数データの型
 *
 * @visualization_types
 * - WaveformStyle: 波形表示スタイル設定
 * - SpectrumBarConfig: スペクトラムバーの設定
 * - AnimationConfig: アニメーション設定
 *
 * @error_types
 * - AudioError: 音声関連エラーの型
 * - InitializationError: 初期化エラーの詳細
 */

/**
 * AudioContextの状態を管理する型
 */
export type AudioContextState = {
  /** AudioContextの現在の状態 */
  state: 'closed' | 'running' | 'suspended'
  /** サンプリングレート（Hz） */
  sampleRate: number
  /** 作成日時 */
  createdAt: Date
}

/**
 * AnalyserNodeの設定値
 */
export type AnalyserSettings = {
  /** FFTサイズ（2の累乗値、1024-32768） */
  fftSize: number
  /** 周波数ビン数（FFTサイズの半分） */
  frequencyBinCount: number
  /** スムージング定数（0.0-1.0） */
  smoothingTimeConstant: number
  /** 最小デシベル値 */
  minDecibels: number
  /** 最大デシベル値 */
  maxDecibels: number
}

/**
 * 周波数解析データの型
 */
export type FrequencyData = {
  /** 周波数強度データ（0-255の配列） */
  frequencyData: Uint8Array
  /** タイムドメインデータ（波形データ） */
  timeDomainData: Uint8Array
  /** データ取得時刻 */
  timestamp: number
}

/**
 * 波形表示スタイル設定
 */
export type WaveformStyle = {
  /** 背景色（透明度含む） */
  backgroundColor: string
  /** バーの基本色 */
  barColor: string
  /** グラデーション終了色 */
  gradientEndColor: string
  /** バー間のスペース（px） */
  barSpacing: number
  /** バーの最小高さ（px） */
  minBarHeight: number
  /** バーの最大高さ（px） */
  maxBarHeight: number
}

/**
 * スペクトラムバーの個別設定
 */
export type SpectrumBarConfig = {
  /** バーのインデックス */
  index: number
  /** 周波数値（Hz） */
  frequency: number
  /** バーの幅（px） */
  width: number
  /** バーの高さ（px） */
  height: number
  /** バーのX座標 */
  x: number
  /** バーのY座標 */
  y: number
}

/**
 * アニメーション設定
 */
export type AnimationConfig = {
  /** フレームレート（FPS） */
  frameRate: number
  /** フェードイン時間（ms） */
  fadeInDuration: number
  /** フェードアウト時間（ms） */
  fadeOutDuration: number
  /** アニメーション開始遅延（ms） */
  startDelay: number
}

/**
 * 音声関連エラーの基底型
 */
export type AudioError = {
  /** エラーコード */
  code: string
  /** エラーメッセージ */
  message: string
  /** エラー発生時刻 */
  timestamp: Date
  /** 追加の詳細情報 */
  details?: Record<string, unknown>
}

/**
 * AudioContext初期化エラー
 */
export type AudioContextError = AudioError & {
  /** エラーの種類 */
  type: 'AUDIO_CONTEXT_ERROR'
  /** ブラウザサポート状況 */
  browserSupport: boolean
  /** 自動再生ポリシー関連か */
  isAutoplayRelated: boolean
}

/**
 * AnalyserNode初期化エラー
 */
export type AnalyserError = AudioError & {
  /** エラーの種類 */
  type: 'ANALYSER_ERROR'
  /** 設定値 */
  settings: Partial<AnalyserSettings>
}

/**
 * 音声ソース接続エラー
 */
export type AudioSourceError = AudioError & {
  /** エラーの種類 */
  type: 'AUDIO_SOURCE_ERROR'
  /** 音声要素の状態 */
  audioElementState: string
  /** ネットワーク状態 */
  networkState: number
}

/**
 * 音声解析の初期化結果
 */
export type AudioAnalyserInitResult = {
  /** 初期化成功フラグ */
  success: boolean
  /** AnalyserNode（成功時のみ） */
  analyserNode?: AnalyserNode
  /** エラー情報（失敗時のみ） */
  error?: AudioContextError | AnalyserError | AudioSourceError
  /** 初期化にかかった時間（ms） */
  initializationTime: number
}

/**
 * 波形表示の描画設定
 */
export type RenderingConfig = {
  /** Canvas要素のサイズ */
  canvasSize: {
    width: number
    height: number
  }
  /** デバイスピクセル比 */
  devicePixelRatio: number
  /** 描画品質設定 */
  quality: 'low' | 'medium' | 'high'
  /** アンチエイリアス有効化 */
  antiAlias: boolean
}
