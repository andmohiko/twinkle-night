'use client'

import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
/**
 * @description Mantineプロバイダーコンポーネント
 * アプリケーション全体にMantineのスタイリングを提供します
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {React.ReactNode} props.children - 子要素
 * @returns {React.ReactNode} MantineProviderでラップされた子要素
 */
export const Providers = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  return <MantineProvider>{children}</MantineProvider>
}
