'use client'
import TransactionRow from "./TransactionRow"
import { Bookmark } from "lucide-react";
import ResizableColumn from "./ResizableColumn";
import { useState } from "react";

const dummyRows = [
    {
        account: "Checking",
        date: "2023-01-01",
        payee: "Trader Joe",
        category: "Food",
        memo: "Groceries",
        outflow: 100,
        inflow: 0,
    },
    {
        account: "Savings",
        date: "2023-01-02",
        payee: "Amazon",
        category: "Shopping",
        memo: "Books",
        outflow: 50,
        inflow: 0,
    },
    {
        account: "Credit Card",
        date: "2023-01-03",
        payee: "Gas Station",
        category: "Transport",
        memo: "Fuel",
        outflow: 40,
        inflow: 0,
    },
    {
        account: "Checking",
        date: "2023-01-04",
        payee: "Starbucks",
        category: "Food",
        memo: "Coffee",
        outflow: 10,
        inflow: 0,
    },
    {
        account: "Savings",
        date: "2023-01-05",
        payee: "Netflix",
        category: "Entertainment",
        memo: "Subscription",
        outflow: 15,
        inflow: 0,
    },
    {
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
    const [columnWidths, setColumnWidths] = useState({
        checkbox: 40,
        flag: 40,
        account: 100,
        date: 100,
        payee: 150,
        category: 100,
        memo: 150,
        outflow: 100,
        inflow: 100,
      });
    
      const onResize = (column) => (event, { size }) => {
        setColumnWidths(prev => ({ ...prev, [column]: size.width }));
      };

    return (
        <div className="w-full overflow-x-auto">
        <div className="min-w-max">
        <div className="flex flex-row items-stretch text-gray-500 border-t border-l border-b border-gray-300">
            <ResizableColumn width={columnWidths.checkbox} onResize={onResize('checkbox')}>
                <div className="flex p-2">
                <div className="border rounded-sm border-gray-500 h-3 w-3"></div>
                </div>
            </ResizableColumn>
            <ResizableColumn width={columnWidths.flag} onResize={onResize('flag')}>
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
                <div className="flex p-2 border-r border-gray-300">INFLOW</div>
            </ResizableColumn>
            </div>
            </div>
            <div className="flex flex-col gap-4 w-full">
                {dummyRows.map((row) => (
                    <TransactionRow 
                        key={row.date}
                        {...row}
                        showAccount={true}
                        columnWidths={columnWidths}
                    />
                ))}
            </div>
        </div>
    );
}

export default AccountTable;
