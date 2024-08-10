import Image from 'next/image'

export default function Reflect() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        Reflect on your finances...
        <div className="flex items-end justify-center">
          <Image src="/lotus.svg" alt="lotus" width={100} height={100} />
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute left-1/2 top-2 -translate-x-1/2">
              <span className="relative flex h-10 w-10 items-center justify-center">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex h-1 w-1 rounded-full bg-black"></span>
              </span>
            </div>

            <Image src="/reflect.svg" alt="reflect" width={200} height={200} />
          </div>
          <Image src="/lotus.svg" alt="lotus" width={100} height={100} />
        </div>
      </div>
    </div>
  )
}
