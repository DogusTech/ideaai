import type { ReactNode } from 'react'
import { NewsNavbar } from './news-navbar'

export default function NewsLayout({ children }: { children: ReactNode }) {
  return <><NewsNavbar />{children}</>
}
