import { Search } from 'lucide-react'

interface DropdownSearchProps {
  searchTerm: string
  inputRef: React.RefObject<HTMLInputElement>
  setSearchTerm: (searchTerm: string) => void
  setExpanded: (expanded: boolean) => void
}
const DropdownSearch = ({
  searchTerm,
  inputRef,
  setSearchTerm,
  setExpanded,
}: DropdownSearchProps) => {
  return (
    <div className={`relative w-full cursor-pointer rounded-lg bg-slate-50`}>
      <input
        type="text"
        className="w-full bg-slate-200 py-2 pl-4 pr-6"
        placeholder="Search or Add"
        value={searchTerm}
        ref={inputRef}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-400">
        <Search size={16} />
      </div>
    </div>
  )
}
export default DropdownSearch
