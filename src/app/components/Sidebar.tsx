import { Sprout, Landmark, Inbox, ChartNoAxesCombined, ChevronDown, ChevronRight, CirclePlus, Pen } from "lucide-react";
import { useState } from "react";
import AddAccountModal from "./AddAccountModal";

const accounts = [
    { name: "Checking", balance: 1000 },
    { name: "Savings", balance: 2000 },
    { name: "Credit Card", balance: -500 }
];


function Sidebar() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAddAccountModal, setShowAddAccountModal] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    const toggleAddAccountModal = () => {
        setShowAddAccountModal(prev => !prev);
    }

  return (
    <div className="w-[300px] bg-[#2c396a] flex flex-col font-sans text-white font-light gap-4 h-screen pt-4">
        <div className="flex flex-row gap-2 items-center hover:bg-[#374D9B] rounded-md p-2 mx-2">
            <Sprout className="h-[30px] w-[30px]" />
            <div className="flex flex-col">
                <div className="font-semibold"> sarah's Budget</div>
                <div className="text-xs"> sarahebicknell@gmail.com </div>
            </div>
            <ChevronDown className="h-3 w-3" />
        </div>
        <div className="flex flex-row gap-3 hover:bg-[#374D9B] rounded-md p-2 mx-2"> 
            <Inbox  />
            <div> Budget</div>
        </div>
        <div className="flex flex-row gap-3  hover:bg-[#374D9B] rounded-md p-2 mx-2">
            <ChartNoAxesCombined  />
            <div> Reflect</div>
        </div>
        <div className="flex flex-row gap-3  hover:bg-[#374D9B] rounded-md p-2 mx-2">
            <Landmark  />
            <div> All Accounts</div>
        </div>
        <div>
            <button className="flex flex- text-[12px] rounded-md p-2 w-full text-xs justify-between" onClick={toggleDropdown}>
                <div className="flex flex-row gap-2 items-center">
                    {showDropdown ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    <div> BUDGET </div>
                </div>
                <div className="pr-6"> $baltotal</div>
            </button>
            {showDropdown && (
                accounts.map((account, index) => (
                <div className="text-xs flex flex-row hover:bg-[#374D9B] rounded-md mr-2 py-1 ml-2" key={index}> 
                    <div className="flex flex-row w-full justify-between pr-6 text-xs relative group"> 
                        <Pen className="h-3 w-3 mr-2 absolute left-2 top-1/2 transform -translate-y-1/2 hidden group-hover:block" />
                        <button className="flex flex-row w-full justify-between pl-7 text-xs">  
                            <div> {account.name} </div>
                            <div className="px-1 flex" style={account.balance > 0 ? {color: "white"} : {color: "#d10000", backgroundColor: "white", borderRadius: 20, opacity: 0.8}}> 
                                {account.balance > 0? "$" : "-$"} {account.balance > 0 ? account.balance : account.balance.toString().slice(1)} 
                            </div>
                        </button>
                    </div>
                </div>
                )))}
        </div>
        <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex flex-row items-center justify-center gap-2 p-2 ml-4 w-[150px] text-xs" onClick={toggleAddAccountModal}> <CirclePlus className="h-3 w-3 "/> Add Account </button>
        {showAddAccountModal && <AddAccountModal toggle={toggleAddAccountModal} />}
    </div>
  )
}

export default Sidebar;