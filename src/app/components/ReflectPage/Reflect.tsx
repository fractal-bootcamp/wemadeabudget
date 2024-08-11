import Image from 'next/image'
import { Figtree } from 'next/font/google'
const figtree = Figtree({ subsets: ['latin'], weight: '600' })
export default function Reflect() {
  return (
    <div className="flex w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-4">
        <span
          className={`${figtree.className} animate-[fadeIn_3s_ease-in-out_5s_forwards] opacity-0`}
        >
          Reflect on your finances...
        </span>
        <div className="flex items-end justify-center">
          <Image
            className="animate-[fadeIn_2s_ease-in-out_2s_forwards] opacity-0"
            src="/lotus.svg"
            alt="lotus"
            width={100}
            height={100}
          />
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute left-1/2 top-2 -translate-x-1/2">
              <span className="relative flex h-10 w-10 animate-[fadeIn_0s_ease-in-out_7s_forwards] items-center justify-center opacity-0">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-black opacity-75 transition delay-[9000ms]"></span>
                <span className="relative inline-flex h-1 w-1 rounded-full bg-black"></span>
              </span>
            </div>

            <Image
              className="animate-[fadeIn_2s_ease-in-out_.1s_forwards] opacity-0"
              src="/reflect.svg"
              alt="reflect"
              width={200}
              height={200}
            />
          </div>
          <Image
            className="animate-[fadeIn_2s_ease-in-out_2s_forwards] opacity-0"
            src="/lotus.svg"
            alt="lotus"
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  )
}
