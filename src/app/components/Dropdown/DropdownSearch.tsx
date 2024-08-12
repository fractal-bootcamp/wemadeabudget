import { Search } from 'lucide-react'

interface DropdownSearchProps {
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  setExpanded: (expanded: boolean) => void
}
const DropdownSearch = ({
  searchTerm,
  setSearchTerm,
  setExpanded,
}: DropdownSearchProps) => {
  return (
    <div className={`relative w-full cursor-pointer bg-slate-50`}>
      <input
        type="text"
        className="bg-slate-200 px-4 py-2"
        placeholder="Search or Add"
        value={searchTerm}
        onFocus={() => setExpanded(true)}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute right-0 top-0 p-2 text-gray-400">
        <Search size={16} />
      </div>
    </div>
  )
}
export default DropdownSearch
