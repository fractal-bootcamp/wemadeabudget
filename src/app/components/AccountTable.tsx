'use client'
import TransactionRow from "./TransactionRow"
import { Bookmark, LucideSearch, LucideUndo, LucideRedo, FileIcon, PlusCircle, SearchIcon, ChevronDown } from "lucide-react";
import ResizableColumn from "./ResizableColumn";
import TransactionForm from "./TransactionForm";
import { useState } from "react";

const defaultCategories= [
    "Restaurants", "Rent", "Utilities", "Renters Insurance", "Phone", "Internet", "Music", "Groceries", "Train/Bus Fare", "Personal Care", "Stuff I Forgot to Budget For", "Celebrations"]
  

const dummyRows = [
    {
        id: "1",
        account: "Checking",
        date: "2023-01-01",
        payee: "Trader Joe",
        category: "Food",
        memo: "Groceries",
        cents: -1000,
        cleared: true,
    },
    {
        id: "2",
        account: "Savings",
        date: "2023-01-02",
        payee: "Amazon",
        category: "Shopping",
        memo: "Books",
        cents: -500,
        cleared: false,
    },
    {
        id: "3",
        account: "Credit Card",
        date: "2023-01-03",
        payee: "Gas Station",
        category: "Transport",
        memo: "Fuel",
        cents: -400,
        cleared: true,
    },
    {
        id: "4",
        account: "Checking",
        date: "2023-01-04",
        payee: "Starbucks",
        category: "Food",
        memo: "Coffee",
        cents: -100,
        cleared: false,
    },
    {
        id: "5",
        account: "Savings",
        date: "2023-01-05",
        payee: "Netflix",
        category: "Entertainment",
        memo: "Subscription",
        cents: -150,
        cleared: true,
    },
    {
        id: "6",
        account: "Checking",
        date: "2023-01-06",
        payee: "Local Market",
        category: "Food",
        memo: "Fruits",
        cents: -300,
        cleared: false,
    },
    {
        id: "7",
        account: "Checking",
        date: "2023-01-07",
        payee: "Payroll",
        category: "Income",
        memo: "Salary",
        cents: 5000,
        cleared: true,
    },
    {
        id: "8",
        account: "Savings",
        date: "2023-01-08",
        payee: "Interest",
        category: "Interest",
        memo: "Interest Payment",
        cents: 200,
        cleared: true,
    },
]

function ActionBar({onAddTransaction}: {onAddTransaction: () => void}) {      
    return (
        <div className="flex flex-row text-indigo-600 p-3 justify-between text-sm">
            <div className="flex flex-row gap-2">
                <button className="flex items-center gap-1" onClick={onAddTransaction}>
                    <PlusCircle className="h-4 w-4" /> 
                    <span>Add Transaction</span>
                </button>
                <button className="flex items-center gap-1">
                    <FileIcon className="h-4 w-4" /> 
                    <span>File Import</span>
                </button>
                <button className="flex items-center gap-1">
                    <LucideUndo className="h-4 w-4" /> 
                    <span>Undo</span>
                </button>
                <button className="flex items-center gap-1">
                    <LucideRedo className="h-4 w-4" /> 
                    <span>Redo</span>
                </button>
            </div>
            <div className="flex flex-row gap-2">
                <button className="flex gap-1"> View <ChevronDown className="h-4 w-4" /></button>
                <div className="flex items-center">
                    <SearchIcon className="h-5 w-5 mr-2" />
                    <input type="text" placeholder="Search" />
                </div>
            </div>
        </div>
    )
}



//truncate to prevent overflow

function AccountTable() {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [clearedRows, setClearedRows] = useState<Set<string>>(new Set());
    const [editingRow, setEditingRow] = useState<string | null>(null);
    const [showAddTransactionRow, setShowAddTransactionRow] = useState(false);

    const [columnWidths, setColumnWidths] = useState({
        flag: 50,
        account: 100,
        date: 100,
        payee: 120,
        category: 120,
        memo: 210,
        outflow: 80,
        inflow: 80,
        cleared: 50
      });
    
      const onResize = (column: string) => (event: React.SyntheticEvent<Element, Event>, data: { size: { width: number; height: number } })  => {
        setColumnWidths(prev => ({ ...prev, [column]: data.size.width }));
      };

    function toggleRowSelect(rowId: string) {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
            } else {
                newSet.add(rowId);
            }
            return newSet;
        });
    }


    function handleRowClick(id: string) {
        if (selectedRows.has(id)) {
            setEditingRow(id);
        } else {
            setSelectedRows(prev => new Set(prev).add(id));
        }
    }

    function toggleCleared(id: string) {
        //this has gotta changed something in the db 
        //but rn i'll change it locally
        setClearedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet; // Return the updated set
        });
    }

    function toggleAddTransactionRow() {
        setShowAddTransactionRow(prev => !prev);
        console.log("toggled");
    }

    function handleCancel() {
        setEditingRow(null);
    }

    function handleSave() {
        console.log("Saved edited transaction!");
        //post to db
    }

    function handleCancelAddTransaction() {
        setShowAddTransactionRow(false);
    }

    function handleSaveAddTransaction() {
        console.log("Saved new transaction!");
        //post to db
    }



    return (
        // i think this code is very redundant and might simplify later, but works
        <div className="w-full overflow-x-auto">
        <div className="min-w-max">
            <ActionBar onAddTransaction={toggleAddTransactionRow} />
        <div className="flex flex-row items-stretch text-gray-500 text-xs border-t border-l border-b border-gray-300">
            <div className="flex p-2 w-[40px] border-r border-gray-300 items-center justify-center">
                <div className="border rounded-sm border-gray-500 h-[10px] w-[10px]"></div>
            </div>
            <ResizableColumn width={columnWidths.flag} minWidth={50} onResize={onResize('flag')}>
                <div className="flex p-2">
                <Bookmark className="text-gray-500 transform rotate-[270deg]" size={16} />
                </div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.account} onResize={onResize('account')}>
                <div className="flex pt-2">ACCOUNTS</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.date} onResize={onResize('date')}>
                <div className="flex pt-2">DATE</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.payee} onResize={onResize('payee')}>
                <div className="flex pt-2">PAYEE</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.category} onResize={onResize('category')}>
                <div className="flex pt-2">CATEGORY</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.memo} onResize={onResize('memo')}>
                <div className="flex pt-2">MEMO</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.outflow} onResize={onResize('outflow')}>
                <div className="flex pt-2">OUTFLOW</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.inflow} onResize={onResize('inflow')}>
                <div className="flex pt-2 border-gray-300">INFLOW</div>
            </ResizableColumn>
            <div className={`flex p-2 border-gray-300 w-[${columnWidths.cleared}px] items-center justify-center`}>
                <div className="rounded-full w-4 h-4 bg-green-600 text-white text-bold text-center"> C </div>
            </div>
            </div>
            </div>
            {showAddTransactionRow && <TransactionForm columnWidths={columnWidths} showAccount={true} onCancel={handleCancelAddTransaction} onSave={handleSaveAddTransaction} />}
            <div className="flex flex-col w-full">
                {dummyRows.map((row) => (
                    <TransactionRow 
                        key={row.id}
                        {...row}
                        showAccount={true}
                        columnWidths={columnWidths}
                        isSelected={selectedRows.has(row.id)}
                        isEditing={editingRow === row.id}
                        onSelect={() => toggleRowSelect(row.id)}
                        onClick={() => handleRowClick(row.id)}
                        onCancel={handleCancel}
                        onSave={handleSave}
                        toggleCleared={() => toggleCleared(row.id)}
                        isCleared={clearedRows.has(row.id)}


                    />
                ))}
            </div>
        </div>
    );
}

export default AccountTable;
