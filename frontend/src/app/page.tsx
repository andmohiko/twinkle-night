/**
 * メインページコンポーネント（サーバーコンポーネント）
 *
 * @description
 * - トゥインクルナイトのメイン画面を表示
 * - 背景画像、アバター、BGM自動再生機能を提供
 * - サーバーサイドレンダリングを活用しつつ、必要な部分のみクライアントコンポーネントを使用
 *
 * @features
 * - 背景アニメーション表示
 * - アバターのふわふわアニメーション
 * - BGM自動再生（専用コンポーネントで実装）
 *
 * @architecture
 * - サーバーコンポーネントとして実装
 * - BGM機能は専用のクライアントコンポーネントに分離
 */

import { Avatars } from './avatars'
import { Lyrics } from './lyrics'
import { BackgroundMusic } from '@/components/background-music'
import styles from './style.module.css'
import { InfiniteScroll } from '@/components/infinite-scroll'

export default function TwinklePage() {
  return (
    <div className={styles.container}>
      {/* BGM再生（クライアントコンポーネント） */}
      <BackgroundMusic
        src="/audio/twinkle_night.mp3"
        volume={0.5}
        loop={true}
      />

      {/* background */}
      <div className={styles.twinkle}>
        <InfiniteScroll>
          <div className={styles.city}></div>
        </InfiniteScroll>
        <Avatars />
        <Lyrics />
      </div>
    </div>
  )
}
