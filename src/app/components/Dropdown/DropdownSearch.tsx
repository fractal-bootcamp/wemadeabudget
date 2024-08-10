interface DropdownSearchProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  setExpanded: (expanded: boolean) => void;
}
const DropdownSearch = ({
  searchTerm,
  setSearchTerm,
  setExpanded
}: DropdownSearchProps) => {
  return (
    <div className={`bg-slate-50 w-full cursor-pointer`}>
      <input
        type="text"
        className="bg-slate-200 px-4 py-2 "
        placeholder="Search..."
        value={searchTerm}
        onFocus={() => setExpanded(true)}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
export default DropdownSearch;
