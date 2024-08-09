import { CirclePlus } from 'lucide-react'

interface AddOptionDropdownRowProps {
  addOptionCallback: (option: string) => void
  searchTerm: string
}
export default function AddOptionDropdownRow({
  addOptionCallback,
  searchTerm,
}: AddOptionDropdownRowProps) {
  return (
    //TODO: add label option to say e.g. "add category" or "add payee"
    <button
      className="flex w-full transform cursor-pointer items-center justify-start gap-1 bg-slate-50 px-4 py-2 text-gray-900 transition-all duration-200 hover:bg-slate-200"
      onClick={() => addOptionCallback(searchTerm)}
    >
      <CirclePlus size={12} /> {searchTerm}
    </button>
  )
}
