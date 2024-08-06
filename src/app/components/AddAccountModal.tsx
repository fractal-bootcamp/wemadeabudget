import { X } from "lucide-react";

const ACCOUNT_TYPES = ["Checking", "Cash", "Credit Card", "Line of Credit"];

interface AddAccountModalProps {
    toggle: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ toggle }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex flex-col items-center font-semibold justify-center text-black">
            <div className="relative bg-white w-[300px] h-[400px] shadow-2xl text-sm flex flex-col rounded">
                <div className="p-2 border-b border-gray-300 ">
                    <h1 className="text-center text-lg font-semibold pb-4"> Add Account </h1>
                    <button 
                        onClick={toggle} 
                        className="absolute top-3 right-3 text-indigo-700 hover:text-gray-800"> <X /> 
                    </button>
                </div> 
                <form className="flex flex-col gap-4 p-4">
                    <label> Let's go!</label>
                    <label> Give it a nickname</label>
                    <input type="text" placeholder="Account Name" />
                    <label htmlFor="accountType">What type of account are you adding?</label>
                    <select id="accountType" name="accountType" >
                        {ACCOUNT_TYPES.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                    <label>What is your current account balance?</label>
                    <input type="text" placeholder="Balance" />
                </form>
                <div className="flex justify-center p-4 border-t border-gray-300">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg "> Add Account </button>
                </div>
            </div> 
        </div>
    )
}

export default AddAccountModal;