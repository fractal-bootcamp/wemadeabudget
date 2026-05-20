'use client'

import { Figtree } from 'next/font/google'
import AppInfo from './AppInfo'

const figtree = Figtree({ subsets: ['latin'], weight: '600' })

export default function Splash({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      className={`${figtree.className} flex h-[100dvh] w-[100dvw] flex-col items-center justify-center gap-5 bg-slate-100 text-indigo-700`}
    >
      <span className="animate-[fadeIn_2s_forwards] text-center text-5xl opacity-0">
        🌱 We Made A Budget
      </span>
      <button
        onClick={onEnter}
        className="animate-[fadeIn_1s_ease-in-out_1s_forwards] cursor-pointer rounded-lg bg-indigo-200 px-4 py-2 text-2xl opacity-0 transition-all duration-300 hover:bg-indigo-300"
      >
        Enter
      </button>
      <div className="fixed bottom-0 right-0">
        <AppInfo colorMode="dark" />
      </div>
    </div>
  )
}
