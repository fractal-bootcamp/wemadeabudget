import Image from 'next/image'
import github from '@/public/github.svg'
import { GithubLogo } from './GithubLogo'

type AppInfoProps = {
  colorMode: 'light' | 'dark'
}
export default function AppInfo({ colorMode }: AppInfoProps) {
  const textColorClass =
    colorMode === 'light' ? 'text-slate-200' : 'text-slate-700'
  const linkColorClass = `${colorMode === 'light' ? 'text-blue-400' : 'text-blue-600'} text-opacity-40 hover:text-opacity-100`
  return (
    <div
      className={`flex gap-1 p-2 text-xs ${textColorClass} text-opacity-40 transition-all duration-200`}
    >
      <a
        className="shrink-0 self-center"
        href="https://github.com/fractal-bootcamp/wemadeabudget"
      >
        <GithubLogo className="h-4 w-4" />
      </a>
      <span>
        Clone of{' '}
        <a className={`${linkColorClass}`} href="https://app.ynab.com">
          YNAB
        </a>{' '}
        made by{' '}
        <a
          className={`${linkColorClass}`}
          href="https://github.com/hyperdiscogirl"
        >
          Disco
        </a>{' '}
        and{' '}
        <a
          className={`${linkColorClass}`}
          href="https://github.com/briansmiley"
        >
          Smiley
        </a>
      </span>
    </div>
  )
}
