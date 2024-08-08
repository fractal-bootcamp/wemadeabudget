import { useState } from "react";

const defaultCategories = [
    { name: "Restaurants", assigned: 0, activity: 0, available: 0 },
    { name: "Rent", assigned: 1200000, activity: -20000, available: 0 }, // 1200.00
    { name: "Utilities", assigned: 300000, activity: -5000, available: 0 }, // 300.00
    { name: "Renters Insurance", assigned: 150000, activity: 0, available: -10000 }, // 150.00
    { name: "Phone", assigned: 60000, activity: 0, available: -2000 }, // 60.00
    { name: "Internet", assigned: 70000, activity: 0, available: 0 }, // 70.00
    { name: "Music", assigned: 12000, activity: -3000, available: 0 }, // 12.00
    { name: "Groceries", assigned: 400000, activity: 0, available: -5000 }, // 400.00
    { name: "Train/Bus Fare", assigned: 50000, activity: 0, available: 0 }, // 50.00
    { name: "Personal Care", assigned: 80000, activity: -1000, available: 0 }, // 80.00
    { name: "Stuff I Forgot to Budget For", assigned: 100000, activity: 0, available: 0 }, // 100.00
    { name: "Celebrations", assigned: 200000, activity: 0, available: -15000 } // 200.00
];


function BudgetTable() {
    const [categories, setCategories] = useState(defaultCategories);
    const [selectedCategories, setSelectedCategories] = useState(new Set());


    const toggleCategory = (category: string) => () => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    }

    return (
        <div className="flex flex-col text-xs w-full">
             <div className="flex flex-row items-stretch text-gray-500 border-t border-l border-b border-gray-300">
                <div className="flex p-2 w-[40px] border-r border-gray-300 items-center justify-center">
                    <div className="border rounded-sm border-gray-500 h-[10px] w-[10px]"></div>
                </div>
                <div className="flex p-2 w-[55%]">CATEGORY</div>
                <div className="flex p-2 w-[15%] justify-end pr-3">ASSIGNED</div>
                <div className="flex p-2 w-[15%] justify-end pr-3">ACTIVITY</div>
                <div className="flex p-2 w-[15%] justify-end pr-3">AVAILABLE</div>
             </div>

            {categories.map((category, index) => (
                <div key={index} className="flex border-b border-gray-300 py-2 pr-4 items-stretch">
                    <div className="flex items-center justify-center w-[40px]">
                        <input type="checkbox" className="h-3 w-3" checked={selectedCategories.has(category.name)} onChange={toggleCategory(category.name)} />
                    </div>
                    <div className="w-[55%] truncate"> {category.name} </div>
                    <div className="w-[15%] truncate text-right"> {category.assigned >= 0 ? `$${(category.assigned / 100).toFixed(2)}` : `-$${(-category.assigned / 100).toFixed(2)}`} </div>
                    <div className="w-[15%] truncate text-right"> {category.activity >= 0 ? `$${(category.activity / 100).toFixed(2)}` : `-$${(-category.activity / 100).toFixed(2)}`} </div>
                    <div className="w-[15%] truncate text-right"> {category.available >= 0 ? `$${(category.available / 100).toFixed(2)}` : `-$${(-category.available / 100).toFixed(2)}`} </div>
                </div>
        ))}
        </div>
    )

}

export default BudgetTable;