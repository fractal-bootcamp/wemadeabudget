'use client'
import { Bookmark } from "lucide-react";

const dummyRow = {
    account: "Checking",
    date: "2023-01-01",
    payee: "Trader Joe",
    category: "Food",
    memo: "Groceries",
    outflow: 100,
    inflow: 0,
}
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
    outflow: number;
    inflow: number;
    showAccount: boolean;
    columnWidths: ColumnWidths;
    isSelected: boolean;
    isEditing: boolean;
    onSelect: () => void;
    onClick: () => void;
}

function TransactionRow({ account, date, payee, category, memo, outflow, inflow, showAccount, columnWidths, isEditing, isSelected, onSelect, onClick }: TransactionRowProps) {    
  //editing form needs to display the checkbox and flag   
  return (
      isEditing ? (
        <form className="bg-indigo-300 flex flex-col text-xs">
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
              <input type="text" placeholder="Inflow" value={inflow} className="rounded mb-1" />
            </div>
            <div style={{ width: columnWidths.outflow }} className="flex items-center justify-end p-2 text-xs truncate">
              <input type="text" placeholder="Outflow" value={outflow} className="rounded mb-1" />
            </div>
          </div> 
          <div className="flex flex-row justify-end gap-2 mb-2 mr-16">
            <button className="rounded border border-indigo-600 text-indigo-600 px-2 py-1" type="button">Cancel</button>
            <button className="rounded bg-blue-600 text-white px-2 py-1 " type="submit">Save</button> 
          </div>
        </form>
      ) : (
        <div className={`flex flex-row items-stretch w-full border-b border-gray-300 ${isSelected ? "bg-indigo-300" : "" }`} onClick={onClick}
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
            <div className="truncate">{outflow > 0 ? `-$${outflow.toFixed(2)}` : ''}</div>
          </div>
          <div style={{ width: columnWidths.inflow }} className="flex items-center justify-end p-2 text-sm truncate ">
            <div className="truncate">{inflow > 0 ? `$${inflow.toFixed(2)}` : ''}</div>
          </div>
        </div>
      )
    )
  }

export default TransactionRow;
