import { SignInButton, SignUp } from '@clerk/nextjs'

import { Figtree } from 'next/font/google'
const figtree = Figtree({ subsets: ['latin'], weight: '600' })

export default function SignUpOrIn() {
  return (
    <div
      className={`${figtree.className} flex h-screen w-screen flex-col items-center justify-center gap-5 bg-slate-100 text-indigo-700`}
    >
      <span className="animate-[fadeIn_2s_forwards] text-center text-5xl opacity-0">
        🌱 We Made A Budget
      </span>
      <SignInButton mode="modal">
        <span className="animate-[fadeIn_1s_ease-in-out_1s_forwards] cursor-pointer rounded-lg bg-indigo-200 px-4 py-2 text-2xl opacity-0 transition-all duration-300 hover:bg-indigo-300">
          Sign in/up
        </span>
      </SignInButton>
    </div>
  )
}
