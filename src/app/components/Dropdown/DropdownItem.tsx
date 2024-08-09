interface DropdownItemProps {
  value: string;
  handleSelect: (value: string) => void;
  selected: boolean;
}
const DropdownItem = ({ value, handleSelect, selected }: DropdownItemProps) => {
  const classes = {
    selected: "bg-teal-500 hover:bg-teal-600 text-white",
    unselected: "bg-slate-50 text-gray-900 hover:bg-slate-200"
  };

  return (
    <div
      className={`${classes[selected ? "selected" : "unselected"]} transform transition-all duration-200 px-4 py-2 w-full cursor-pointer`}
      onClick={() => handleSelect(value)}
    >
      {value}
    </div>
  );
};
export default DropdownItem;
