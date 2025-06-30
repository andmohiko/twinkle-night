import { FC, ReactNode } from 'react'
import styles from './style.module.css'

type Props = {
  children: ReactNode
}

export const InfiniteScroll: FC<Props> = ({ children }) => {
  return (
    <>
      <div className={styles.scrollContainer}>
        {[...Array(2)].map((_v, i) => (
          <div key={i.toString()} className={styles.scrollItem}>
            {children}
          </div>
        ))}
      </div>
    </>
  )
}
