'use client'
import { Bookmark } from "lucide-react";


interface ColumnWidths {
    flag: number;
    account: number;
    date: number;
    payee: number;
    category: number;
    memo: number;
    outflow: number;
    inflow: number;
}
interface TransactionRowProps {
    account: string;
    date: string;
    payee: string;
    category: string;
    memo: string;
    cents: number;
    cleared: boolean;
    showAccount: boolean;
    columnWidths: ColumnWidths;
    isSelected: boolean;
    isEditing: boolean;
    onSelect: () => void;
    onClick: () => void;
    onCancel: () => void;
    onSave: () => void;
    toggleCleared: () => void;
    isCleared: boolean;
}

function TransactionRow({ account, date, payee, category, memo, cents, cleared, showAccount, columnWidths, isEditing, isSelected, onSelect, onClick, onCancel, onSave, toggleCleared, isCleared }: TransactionRowProps) {    
  //editing form needs to display the checkbox and flag   
  return (
      isEditing ? (
        //ugh i should def make this a component but i don't want to figure that out right now
        //oops shit i need to add an onchange handler to the inputs 
        <form className="bg-indigo-100 flex flex-col text-xs">
          <div className="flex flex-row">
            <div className="flex items-center justify-center p-2" style={{ width: columnWidths.flag }}>
              <input type='checkbox' className="rounded" checked={isSelected} onChange={onSelect} />
            </div>
            <div className="flex items-center justify-center p-2" style={{ width: columnWidths.flag }}>
              <Bookmark className="text-gray-400 transform rotate-[270deg]" size={16} />
            </div>
            {showAccount && <div style={{ width: columnWidths.account }} className="flex items-center p-2 text-xs truncate">
              <input type="text" value={account} placeholder="Account" className="rounded mb-1" />
            </div>}
            <div style={{ width: columnWidths.date }} className="flex items-center p-2 text-xs truncate">
              <input type="text" placeholder="Date" value={date} className="rounded mb-1" />
            </div>
            <div style={{ width: columnWidths.payee }} className="flex items-center p-2 text-xs truncate">
              <input type="text" placeholder="Payee" value={payee} className="rounded mb-1" />
            </div>
            <div style={{ width: columnWidths.category }} className="flex items-center p-2 text-xs truncate">
              <input type="text" placeholder="Category" value={category} className="rounded mb-1" />
            </div>
            <div style={{ width: columnWidths.memo }} className="flex items-center p-2 text-xs truncate">
              <input type="text" placeholder="Memo" value={memo} className="rounded mb-1" />
            </div>
            <div style={{ width: columnWidths.inflow }} className="flex items-center justify-end p-2 text-xs truncate">
              <input type="text" placeholder="Inflow" value={cents > 0 ? `$${cents.toFixed(2)}` : ''} className="rounded mb-1" />
            </div>
            <div style={{ width: columnWidths.outflow }} className="flex items-center justify-end p-2 text-xs truncate">
              <input type="text" placeholder="Outflow" value={cents < 0 ? `$${cents.toFixed(2)}` : ''} className="rounded mb-1" />
            </div>
            <button onClick={toggleCleared} className="flex items-center justify-center p-2 w-[50px]">
              <div className={`rounded-full w-4 h-4 ${isCleared ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-400'} text-bold text-xs text-center`}>
                C
              </div>
            </button>
          </div> 
          <div className="flex flex-row justify-end gap-2 mb-2 mr-16">
            <button className="rounded border border-indigo-600 text-indigo-600 px-2 py-1" onClick={onCancel} type="button">Cancel</button>
            <button className="rounded bg-blue-600 text-white px-2 py-1 " onClick={onSave} >Save</button> 
            {/* something is wrong with the save button, it closes but seems to refresh the whole console in browser */}
            {/* oh shit, i need to use onsubmit instead of onclick */}
          </div>
        </form>
      ) : (
        <div className={`flex flex-row items-stretch w-full border-b border-gray-300 ${isSelected ? "bg-indigo-100" : "" }`} onClick={onClick}
        >
          <div className="flex items-center justify-center p-2 w-[40px] border-r ">
            <input type='checkbox' className="h-3 w-3" checked={isSelected} onChange={onSelect} />
          </div>
          <div style={{ width: columnWidths.flag }} className="flex items-center justify-center p-2">
            <Bookmark className="text-gray-400 transform rotate-[270deg]" size={16} />
          </div>
          {showAccount && <div style={{ width: columnWidths.account }} className="flex items-center p-2 text-sm truncate ">
            <div className="truncate">{account}</div>
          </div>}
          <div style={{ width: columnWidths.date }} className="flex items-center p-2 text-sm truncate ">
            <div className="truncate">{date}</div>
          </div>
          <div style={{ width: columnWidths.payee }} className="flex items-center p-2 text-sm truncate ">
            <div className="truncate">{payee}</div>
          </div>
          <div style={{ width: columnWidths.category }} className="flex items-center p-2 text-sm truncate ">
            <div className="truncate">{category}</div>
          </div>
          <div style={{ width: columnWidths.memo }} className="flex items-center p-2 text-sm truncate ">
            <div className="truncate">{memo}</div>
          </div>
          <div style={{ width: columnWidths.outflow }} className="flex items-center justify-end p-2 text-sm truncate ">
            <div className="truncate">{cents < 0 ? `-$${Math.abs(cents / 100).toFixed(2)}` : ''}</div>
          </div>
          <div style={{ width: columnWidths.inflow }} className="flex items-center justify-end p-2 text-sm truncate ">
            <div className="truncate">{cents > 0 ? `$${(cents / 100).toFixed(2)}` : ''}</div>
          </div>
        <button onClick={(e) => {e.stopPropagation(), toggleCleared()}} className="flex items-center justify-center p-2 w-[50px]">
          <div className={`rounded-full w-4 h-4 ${isCleared ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-400'} text-bold text-xs text-center`}>
            C
          </div>
        </button>
        </div>
      )
    )
  }

export default TransactionRow;
