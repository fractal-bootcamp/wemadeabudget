import { useState } from "react";
import DropdownItem from "./DropdownItem";
import { ChevronDown, ChevronUp } from "lucide-react";
import DropdownSearch from "./DropdownSearch";
interface DropdownProps {
  options: string[];
  selected: string[];
  multiple?: boolean;
  disabled?: boolean;
  setSelected: (selected: string[]) => void;
}
const MAX_OPTION_LENGTH = 15;
const Dropdown = ({
  options, //list of selectable options
  selected, //array of current selection passed in from parent state
  multiple = false, //flag for multi/single selection
  disabled = false,
  setSelected //selected setter function to update parent state
}: DropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(false);
  const dropDownDisplayText = () => {
    if (selected.length === 0) {
      return "Select...";
    } else if (selected.length === 1) {
      return selected[0].length > MAX_OPTION_LENGTH
        ? selected[0].slice(0, MAX_OPTION_LENGTH) + "..."
        : selected[0];
    } else {
      return `${selected.length} selected`;
    }
  };
  const filteredOptions =
    searchTerm.length === 0
      ? options
      : options.filter(option =>
          option.toLowerCase().includes(searchTerm.toLowerCase())
        );
  const handleSelect = (value: string) => {
    //if multi-select, add/remove from selection array accordingly
    if (multiple) {
      if (selected.includes(value)) {
        setSelected(selected.filter(item => item !== value));
      } else {
        setSelected([...selected, value]);
      }
    }
    //if single-select, set selection to the value
    else {
      setSelected(selected[0] === value ? [] : [value]);
    }
  };
  return (
    <div
      className="text-xs cursor-pointer relative "
      // tabIndex makes the dropdown focusable so that onBlur can close it
      tabIndex={0}
      onBlur={() => setExpanded(false)}
    >
      {/* Dropdown header/unexpanded display */}
      <div
        className={`${selected.length === 0 ? "text-gray-400" : "text-black"} ${disabled ? "text-gray-400 bg-slate-200" : ""} flex justify-between items-center w-[150px] pl-4 pr-2 py-2 border border-slate-500 rounded-lg`}
        onClick={() => !disabled && setExpanded(!expanded)}
      >
        <div className="text-nowrap overflow-hidden ">
          {dropDownDisplayText()}
        </div>
        {expanded ? (
          <ChevronUp className="text-black ml-2 h-4 w-4 min-w-4" />
        ) : (
          <ChevronDown className="text-black ml-2 h-4 w-4 min-w-4" />
        )}
      </div>
      {/* Dropdown list */}
      <div
        className={`${expanded ? " max-h-[150px] opacity-100 " : " max-h-[0px] opacity-0"} absolute left-0  w-fit min-w-[100px] border overflow-y-auto border-slate-200 transition-all duration-500`}
      >
        <div className=" flex flex-col justify-between items-start">
          {/* Search bar */}
          <DropdownSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setExpanded={setExpanded}
          />
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <DropdownItem
                key={`${option}-${index.toString().padStart(3, "0")}`}
                value={option}
                handleSelect={handleSelect}
                selected={selected.includes(option)}
              />
            ))
          ) : (
            <div className="text-center px-4 py-2  text-gray-400 ">
              No matches
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dropdown;
