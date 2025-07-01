/**
 * 歌詞表示コンポーネント
 *
 * @description
 * - 指定されたタイミングで歌詞を自動的に切り替え表示
 * - 各歌詞のshowMsに基づいてタイマー制御
 * - 最後の歌詞まで表示したら終了する
 * - isPlayingがtrueの時のみ歌詞表示を開始
 *
 * @features
 * - タイミング制御による歌詞表示
 * - 自動的な歌詞切り替え
 * - メモリリーク防止のタイマークリーンアップ
 * - 再生状態に連動した歌詞表示制御
 *
 * @timing
 * - 各歌詞は配列で定義されたshowMs（ミリ秒）で表示開始
 * - 前の歌詞からの差分時間でタイマーを設定
 * - isPlayingがfalseの時は最初の歌詞で停止
 */

'use client'

import { useEffect, useState } from 'react'
import styles from './style.module.css'
import { lyrics } from './types'

type Props = {
  isPlaying: boolean
}

export const Lyrics = ({ isPlaying }: Props): React.ReactNode => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0)

  /**
   * 歌詞表示タイマーの設定
   * isPlayingがtrueの時のみ各歌詞のshowMsに基づいて自動切り替えを実行
   */
  useEffect(() => {
    // 再生中でない場合は最初の歌詞インデックスに戻す
    if (!isPlaying) {
      setCurrentLyricIndex(0)
      console.log('Lyrics: 再生停止により歌詞を初期化しました')
      return
    }

    const timers: NodeJS.Timeout[] = []

    // 再生開始時のログ
    console.log('Lyrics: 歌詞表示タイマーを開始します')

    // 各歌詞のタイマーを設定
    lyrics.forEach((lyric, index) => {
      const timer = setTimeout(() => {
        setCurrentLyricIndex(index)
        console.log(
          `Lyrics: 歌詞表示 ${index + 1}/${lyrics.length} - "${lyric.text}"`,
        )
      }, lyric.showMs + 500)

      timers.push(timer)
    })

    // クリーンアップ関数でタイマーを削除
    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer)
      })
      console.log('Lyrics: タイマーをクリーンアップしました')
    }
  }, [isPlaying])

  /**
   * 現在表示する歌詞テキストを取得
   */
  const getCurrentLyricText = (): string => {
    if (currentLyricIndex >= 0 && currentLyricIndex < lyrics.length) {
      return lyrics[currentLyricIndex].text
    }
    return lyrics[0].text // フォールバック
  }

  return (
    <div className={styles.lyrics}>
      <div className={styles.lyricsInner}>
        <p className={styles.lyricsText}>{getCurrentLyricText()}</p>
      </div>
    </div>
  )
}
