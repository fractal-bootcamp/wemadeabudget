import { useState } from 'react'
import DropdownItem from './DropdownItem'
import { ChevronDown, ChevronUp } from 'lucide-react'
import DropdownSearch from './DropdownSearch'
import AddOptionDropdownRow from './AddOptionDropdownRow'
interface DropdownProps {
  options: string[]
  selected: string
  disabled?: boolean
  addOptions?: boolean
  addOptionCallback?: (option: string) => void
  setSelected: (selected: string) => void
}
const MAX_OPTION_LENGTH = 15
const Dropdown = ({
  options, //list of selectable options
  selected, //array of current selection passed in from parent state
  disabled = false,
  addOptions = false,
  addOptionCallback = () => {},
  setSelected, //selected setter function to update parent state
}: DropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expanded, setExpanded] = useState(false)
  const dropDownDisplayText = () => {
    if (!selected) {
      return 'Select...'
    } else {
      return selected.length > MAX_OPTION_LENGTH
        ? selected.slice(0, MAX_OPTION_LENGTH) + '...'
        : selected
    }
  }
  const filteredOptions =
    searchTerm.length === 0
      ? options
      : options.filter((option) =>
          option.toLowerCase().includes(searchTerm.toLowerCase())
        )
  const handleSelect = (value: string) => {
    //if multi-select, add/remove from selection array accordingly
    setSelected(selected === value ? '' : value)
  }
  return (
    <div
      className="cursor-pointer text-xs"
      // tabIndex makes the dropdown focusable so that onBlur can close it
      tabIndex={0}
      onBlur={() => setExpanded(false)}
    >
      {/* Dropdown header/unexpanded display */}
      <div
        className={`${selected.length === 0 ? 'text-gray-400' : 'text-black'} ${disabled ? 'bg-slate-200 text-gray-400' : 'bg-white'} flex w-[150px] items-center justify-between rounded-lg border border-slate-500 py-2 pl-4 pr-2`}
        onClick={() => !disabled && setExpanded(!expanded)}
      >
        <div className="overflow-hidden text-nowrap">
          {dropDownDisplayText()}
        </div>
        {expanded ? (
          <ChevronUp className="ml-2 h-4 w-4 min-w-4 text-black" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4 min-w-4 text-black" />
        )}
      </div>
      {/* Dropdown list */}
      <div
        className={`rounded-lg border border-slate-400 shadow-2xl ${expanded ? 'max-h-[150px] opacity-100' : 'max-h-[0px] opacity-0'} absolute w-fit min-w-[100px] overflow-y-auto border border-slate-200 transition-all duration-500`}
      >
        <div className="flex flex-col items-start justify-between">
          {/* Search bar */}
          <DropdownSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setExpanded={setExpanded}
          />
          {/* if anything has been entered into the search bar, display an option to add their query as a new option */}
          {addOptions &&
            searchTerm.length > 0 &&
            !options.some((option) => option === searchTerm) && (
              <AddOptionDropdownRow
                addOptionCallback={addOptionCallback}
                searchTerm={searchTerm}
              />
            )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <DropdownItem
                key={`${option}-${index.toString().padStart(3, '0')}`}
                value={option}
                handleSelect={handleSelect}
                selected={selected.includes(option)}
              />
            ))
          ) : (
            <div className="px-4 py-2 text-center text-gray-400">
              No matches
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Dropdown
