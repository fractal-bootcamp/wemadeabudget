'use client'
import TransactionRow from "./TransactionRow"
import { Bookmark, LucideSearch, LucideUndo, LucideRedo, FileIcon, PlusCircle } from "lucide-react";
import ResizableColumn from "./ResizableColumn";
import { useState } from "react";
const dummyRows = [
    {
        id: "1",
        account: "Checking",
        date: "2023-01-01",
        payee: "Trader Joe",
        category: "Food",
        memo: "Groceries",
        outflow: 100,
        inflow: 0,
    },
    {
        id: "2",
        account: "Savings",
        date: "2023-01-02",
        payee: "Amazon",
        category: "Shopping",
        memo: "Books",
        outflow: 50,
        inflow: 0,
    },
    {
        id: "3",
        account: "Credit Card",
        date: "2023-01-03",
        payee: "Gas Station",
        category: "Transport",
        memo: "Fuel",
        outflow: 40,
        inflow: 0,
    },
    {
        id: "4",
        account: "Checking",
        date: "2023-01-04",
        payee: "Starbucks",
        category: "Food",
        memo: "Coffee",
        outflow: 10,
        inflow: 0,
    },
    {
        id: "5",
        account: "Savings",
        date: "2023-01-05",
        payee: "Netflix",
        category: "Entertainment",
        memo: "Subscription",
        outflow: 15,
        inflow: 0,
    },
    {
        id: "6",
        account: "Checking",
        date: "2023-01-06",
        payee: "Local Market",
        category: "Food",
        memo: "Fruits",
        outflow: 30,
        inflow: 0,
    },
]



//truncate to prevent overflow

function AccountTable() {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [editingRow, setEditingRow] = useState<string | null>(null);

    const [columnWidths, setColumnWidths] = useState({
        flag: 40,
        account: 100,
        date: 100,
        payee: 150,
        category: 100,
        memo: 150,
        outflow: 100,
        inflow: 100,
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

    return (
        // i think this code is very redundant and might simplify later, but works
        <div className="w-full overflow-x-auto">
        <div className="min-w-max">
            <div className="flex flex-row text-indigo-600 p-3 justify-between text-sm">
                <button className="flex gap-1"> <PlusCircle /> Add Transaction</button>
                <button className="flex gap-1"> <FileIcon /> File Import </button>
                <button className="flex gap-1"> Undo </button>
                <button className="flex gap-1"> Redo </button>
                <button className="flex gap-1"> View </button>
                <input type="text" placeholder="Search" />
            </div>
        <div className="flex flex-row items-stretch text-gray-500 border-t border-l border-b border-gray-300">
            <div className="flex p-2 w-[40px] border-r border-gray-300 items-center justify-center">
                <div className="border rounded-sm border-gray-500 h-[10px] w-[10px]"></div>
            </div>
            <ResizableColumn width={columnWidths.flag} minWidth={50} onResize={onResize('flag')}>
                <div className="flex p-2">
                <Bookmark className="text-gray-500 transform rotate-[270deg]" size={16} />
                </div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.account} onResize={onResize('account')}>
                <div className="flex p-2">ACCOUNTS</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.date} onResize={onResize('date')}>
                <div className="flex p-2">DATE</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.payee} onResize={onResize('payee')}>
                <div className="flex p-2">PAYEE</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.category} onResize={onResize('category')}>
                <div className="flex p-2">CATEGORY</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.memo} onResize={onResize('memo')}>
                <div className="flex p-2">MEMO</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.outflow} onResize={onResize('outflow')}>
                <div className="flex p-2">OUTFLOW</div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.inflow} onResize={onResize('inflow')}>
                <div className="flex p-2 border-gray-300">INFLOW</div>
            </ResizableColumn>
            </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
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


                    />
                ))}
            </div>
        </div>
    );
}

export default AccountTable;
