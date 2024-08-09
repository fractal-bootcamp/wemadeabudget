interface DropdownItemProps {
  value: string
  handleSelect: (value: string) => void
  selected: boolean
}
const DropdownItem = ({ value, handleSelect, selected }: DropdownItemProps) => {
  const classes = {
    selected: 'bg-indigo-700 hover:bg-indigo-800 text-white',
    unselected: 'bg-slate-50 text-gray-900 hover:bg-slate-200',
  }

  return (
    <div
      className={`${classes[selected ? 'selected' : 'unselected']} w-full transform cursor-pointer px-4 py-2 transition-all duration-200`}
      onClick={() => handleSelect(value)}
    >
      {value}
    </div>
  )
}
export default DropdownItem
