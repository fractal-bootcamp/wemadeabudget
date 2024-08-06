import { Sprout, Landmark, Inbox, ChartNoAxesCombined, ChevronDown, CirclePlus } from "lucide-react";

function Sidebar() {
  return (
    <div className="w-[300px] bg-blue-950 flex flex-col text-white font-light gap-4 h-screen pt-4">
        <div className="flex flex-row gap-2 items-center hover:bg-blue-800 rounded-md p-2 mx-2">
            <Sprout className="h-[30px] w-[30px]" />
            <div className="flex flex-col">
                <div className="font-semibold"> sarah's Budget</div>
                <div className="text-xs"> sarahebicknell@gmail.com </div>
            </div>
            <ChevronDown className="h-3 w-3" />
        </div>
        <div className="flex flex-row gap-3 hover:bg-blue-800 rounded-md p-2 mx-2"> 
            <Inbox  />
            <div> Budget</div>
        </div>
        <div className="flex flex-row gap-3  hover:bg-blue-800 rounded-md p-2 mx-2">
            <ChartNoAxesCombined  />
            <div> Reflect</div>
        </div>
        <div className="flex flex-row gap-3  hover:bg-blue-800 rounded-md p-2 mx-2">
            <Landmark  />
            <div> All Accounts</div>
        </div>
        <div className="flex flex-row text-sm gap-2 mx-4">
            <ChevronDown  />
            <div> BUDGET </div>
        </div>
        <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex flex-row items-center justify-center gap-2 p-2 ml-4 w-[150px] text-sm"> <CirclePlus className="h-3 w-3 "/> Add Account </button>
    </div>
  )
}

export default Sidebar;