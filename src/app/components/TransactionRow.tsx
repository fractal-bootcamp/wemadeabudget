'use client'
import { Bookmark } from "lucide-react";
import { useState } from "react";


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
  const [formData, setFormData] = useState({account, date, payee, category, memo, cents, cleared});
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave();
  }

  return (
      isEditing ? (
        //ugh i should def make this a component but i don't want to figure that out right now

        <form className="bg-indigo-100 transaction-row flex flex-col text-xs" onSubmit={onSubmit}>
          <div className="flex flex-row">
            <div className="flex items-center justify-center p-2" style={{ width: columnWidths.flag }}>
              <input 
                type='checkbox' 
                className="rounded" 
                checked={isSelected} 
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
              />
            </div>
            <div className="flex items-center justify-center p-2" style={{ width: columnWidths.flag }}>
              <Bookmark className="text-gray-400 transform rotate-[270deg]" size={16} />
            </div>
            {showAccount && <div style={{ width: columnWidths.account }} className="flex items-center p-2 text-xs truncate">
              <input type="text" value={formData.account} placeholder={account} className="rounded mb-1" onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
            </div>}
            <div style={{ width: columnWidths.date }} className="flex items-center p-2 text-xs truncate">
              <input type="text" value={formData.date} placeholder={date} className="rounded mb-1" onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div style={{ width: columnWidths.payee }} className="flex items-center p-2 text-xs truncate">
              <input type="text" value={formData.payee} placeholder={payee} className="rounded mb-1" onChange={(e) => setFormData({ ...formData, payee: e.target.value })} />
            </div>
            <div style={{ width: columnWidths.category }} className="flex items-center p-2 text-xs truncate">
              <input type="text" value={formData.category} placeholder={category} className="rounded mb-1" onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            </div>
            <div style={{ width: columnWidths.memo }} className="flex items-center p-2 text-xs truncate">
              <input type="text" value={formData.memo} placeholder={memo} className="rounded mb-1" onChange={(e) => setFormData({ ...formData, memo: e.target.value })} />
            </div>
            <div style={{ width: columnWidths.inflow }} className="flex items-center justify-end p-2 text-xs truncate">
              <input type="text" value={formData.cents > 0 ? `$${(formData.cents / 100).toFixed(2)}` : ''} placeholder={cents > 0 ? `$${(cents / 100).toFixed(2)}` : ''} className="rounded mb-1" onChange={(e) => setFormData({ ...formData, cents: parseFloat(e.target.value.replace(/[^0-9.-]+/g,"")) * 100 })} />
            </div>
            <div style={{ width: columnWidths.outflow }} className="flex items-center justify-end p-2 text-xs truncate">
              <input type="text" value={formData.cents < 0 ? `$${(Math.abs(formData.cents) / 100).toFixed(2)}` : ''} placeholder={cents < 0 ? `$${(Math.abs(cents) / 100).toFixed(2)}` : ''} className="rounded mb-1" onChange={(e) => setFormData({ ...formData, cents: parseFloat(e.target.value.replace(/[^0-9.-]+/g,"")) * -100 })} />
            </div>
            <button onClick={toggleCleared} className="flex items-center justify-center p-2 w-[50px]">
              <div className={`rounded-full w-4 h-4 ${isCleared ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-400'} text-bold text-xs text-center`}> C
              </div>
            </button>
          </div> 
          <div className="flex flex-row justify-end gap-2 mb-2 mr-16">
            <button className="rounded border border-indigo-600 text-indigo-600 px-2 py-1" onClick={onCancel} type="button">Cancel</button>
            <button className="rounded bg-blue-600 text-white px-2 py-1 " type="submit" >Save</button> 
          </div>
        </form>
      ) : (
        <div className={`flex transaction-row ${isSelected ? "bg-indigo-100" : ""}`} onClick={onClick}>
        <div className="flex flex-row items-center justify-center p-2" style={{ width: columnWidths.flag }}>
          <input 
            type='checkbox' 
            className="rounded" 
            checked={isSelected} 
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onClick={(e) => e.stopPropagation()} // Prevent row click when checkbox is clicked
          />
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
