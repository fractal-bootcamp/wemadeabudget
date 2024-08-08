import { Bookmark } from "lucide-react"


type TransactionFormProps = {
    columnWidths: { [key: string]: number },
    showAccount: boolean,
    onCancel: () => void,
    onSave: () => void,

}

function TransactionForm({columnWidths, showAccount, onCancel, onSave}: TransactionFormProps)  {
return(
    <form className="bg-indigo-100 flex flex-col text-xs">
    <div className="flex flex-row">
      <div className="flex items-center justify-center p-2" style={{ width: columnWidths.flag }}>
        <input type='checkbox' className="rounded" />
      </div>
      <div className="flex items-center justify-center p-2" style={{ width: columnWidths.flag }}>
        <Bookmark className="text-gray-400 transform rotate-[270deg]" size={16} />
      </div>
      {showAccount && <div style={{ width: columnWidths.account }} className="flex items-center p-2 text-xs truncate">
        <input type="text" placeholder="Account" className="rounded mb-1" />
      </div>}
      <div style={{ width: columnWidths.date }} className="flex items-center p-2 text-xs truncate">
        <input type="text" placeholder="Date" className="rounded mb-1" />
      </div>
      <div style={{ width: columnWidths.payee }} className="flex items-center p-2 text-xs truncate">
        <input type="text" placeholder="Payee" className="rounded mb-1" />
      </div>
      <div style={{ width: columnWidths.category }} className="flex items-center p-2 text-xs truncate">
        <input type="text" placeholder="Category" className="rounded mb-1" />
      </div>
      <div style={{ width: columnWidths.memo }} className="flex items-center p-2 text-xs truncate">
        <input type="text" placeholder="Memo" className="rounded mb-1" />
      </div>
      <div style={{ width: columnWidths.inflow }} className="flex items-center justify-end p-2 text-xs truncate">
        <input type="text" placeholder="Inflow" className="rounded mb-1" />
      </div>
      <div style={{ width: columnWidths.outflow }} className="flex items-center justify-end p-2 text-xs truncate">
        <input type="text" placeholder="Outflow" className="rounded mb-1" />
      </div>
      <button className="flex items-center justify-center p-2 w-[50px]">
        <div className={`rounded-full w-4 h-4 bg-white text-gray-600 border border-gray-400 text-bold text-xs text-center`}>
          C
        </div>
      </button>
    </div> 
    <div className="flex flex-row justify-end gap-2 mb-2 mr-16">
      <button className="rounded border border-indigo-600 text-indigo-600 px-2 py-1" type="button" onClick={onCancel}>Cancel</button>
      <button className="rounded bg-blue-600 text-white px-2 py-1 " onClick={onSave}>Save</button> 
    </div>
  </form>
)}

export default TransactionForm;
