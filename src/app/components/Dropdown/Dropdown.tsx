import { useEffect, useRef, useState } from 'react'
import DropdownItem from './DropdownItem'
import { ChevronDown, ChevronUp } from 'lucide-react'
import DropdownSearch from './DropdownSearch'
import AddOptionDropdownRow from './AddOptionDropdownRow'
interface DropdownProps {
  options: string[]
  selected: string
  label?: string
  disabled?: boolean
  disabledText?: string
  searchable?: boolean
  addOptions?: boolean
  addOptionCallback?: (option: string) => void
  setSelected: (selected: string) => void
  className?: string
}
// const MAX_OPTION_LENGTH = 15
const Dropdown = ({
  options, //list of selectable options
  selected, //array of current selection passed in from parent state
  label,
  disabled = false,
  disabledText,
  searchable = true,
  addOptions = false,
  addOptionCallback = () => {},
  setSelected, //selected setter function to update parent state,
  className = '',
}: DropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expanded, setExpanded] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropDownDisplayText = () => {
    if (!selected) {
      return `${label ?? 'Select'}...`
    } else {
      // return selected.length > MAX_OPTION_LENGTH
      //   ? selected.slice(0, MAX_OPTION_LENGTH) + '...'
      //   : selected
      return selected
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
    setSelected(value)
    setExpanded(false)
  }
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (expanded) {
      timeout = setTimeout(() => searchInputRef.current?.focus(), 300)
    }
    return () => clearTimeout(timeout)
  }, [expanded])
  return (
    <div
      className={`w-full text-xs ${className}`}
      // tabIndex makes the dropdown focusable so that onBlur can close it
      tabIndex={0}
      onClick={(e) => e.stopPropagation()}
      onBlur={() => !searchable && setExpanded(false)} //if searchable, we do the onblur on the autofocused search input
    >
      {/* dropdown invisible underlay */}
      {expanded && (
        <div
          className={`fixed inset-0 z-10 h-full w-full bg-transparent`}
          onClick={() => setExpanded(false)}
        />
      )}
      {/* Dropdown header/unexpanded display */}
      <div
        className={` ${selected.length === 0 ? 'text-gray-400' : 'text-black'} ${disabled ? 'tooltip cursor-not-allowed bg-slate-200 text-gray-400' : 'cursor-pointer bg-white'} flex w-full items-center justify-between rounded-lg border border-blue-700 py-1 pl-2 pr-2`}
        onClick={() => !disabled && !expanded && setExpanded(true)}
        data-tip={disabledText}
      >
        <div className="truncate">{dropDownDisplayText()}</div>
        {expanded ? (
          <ChevronUp className="ml-2 h-4 w-4 min-w-4 text-black" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4 min-w-4 text-black" />
        )}
      </div>
      {/* Dropdown list */}
      <div
        className={`z-20 rounded-b-lg border border-slate-400 shadow-2xl ${expanded ? 'max-h-[250px] opacity-100' : 'max-h-[0px] opacity-0'} absolute w-fit min-w-[100px] max-w-[200px] overflow-x-auto overflow-y-auto border border-slate-200 transition-all duration-500`}
      >
        <div className="flex flex-col items-start justify-between">
          {/* Search bar */}
          {searchable && (
            <DropdownSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setExpanded={setExpanded}
              inputRef={searchInputRef}
            />
          )}
          {/* if anything has been entered into the search bar, display an option to add their query as a new option */}
          {addOptions &&
            searchTerm.length > 0 &&
            !options.some((option) => option === searchTerm) && (
              <AddOptionDropdownRow
                addOptionCallback={(searchTerm: string) => {
                  addOptionCallback(searchTerm)
                  setSearchTerm('')
                }}
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
            <div className="w-full bg-white px-4 py-2 text-center text-gray-400">
              No matches
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Dropdown
