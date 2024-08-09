'use client'
import { Bookmark } from 'lucide-react'
const flagOnClick = (e: React.MouseEvent<HTMLInputElement>) => {
  const elem = e.currentTarget.querySelector(
    'input[name="flag"]'
  ) as HTMLInputElement
  elem.value = elem.value === 'false' ? 'true' : 'false'
  const bookmark = e.currentTarget.querySelector('#form-flag') as SVGSVGElement
  console.log(bookmark)
  bookmark.setAttribute('fill', elem.value === 'true' ? '#00DD00' : '#f0f0f0')
}
export default function FlagToggle() {
  return (
    <div onClick={flagOnClick}>
      <Bookmark
        className="rotate-[270deg] transform text-gray-400"
        id="form-flag"
        size={16}
        fill="#f0f0f0"
      />
      <input type="hidden" name="flag" value="false" />
    </div>
  )
}
