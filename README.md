# twinkle night

## 概要

**twinkle night feat.somunia - nyankobrq & yaca**

https://www.youtube.com/watch?v=uUvthLpSHrQ

の世界に入り込めるWebサイト

自分のアバターをアップロードすると、MVのようにアバターが上下にふわふわしながらtwinkle nightの街を動く

## 機能

- 自分の画像のアップロード
    - 最大3枚までアップロード可能
- 画像を加工
    - 背景を除去
    - 横を向いた画像を生成
    - ドット絵風に変換
- twinkle nightの世界に画像を表示
    - 背景の夜の街は横スクロールで無限に回る
    - アップロードしたドット絵が上下にふわふわ動く
    - BGMにtwinkle nightが再生

## 技術スタック

- フロントエンド
    - Next.js App Router
    - TypeScript
    - Mantine
    - Canvas
- バックエンド
    - Python
    - FastAPI
- インフラ
    - フロントエンド：Vercel
    - バックエンド：Cloud Run
    - オブジェクトストレージ：Cloud Storage for Firebase
