import { X } from 'lucide-react'

const ACCOUNT_TYPES = ['Checking', 'Cash', 'Credit Card', 'Line of Credit']

interface AddAccountModalProps {
  toggle: () => void
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ toggle }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-20 font-semibold text-black">
      <div className="relative flex h-[400px] w-[300px] flex-col rounded bg-white text-sm shadow-2xl">
        <div className="border-b border-gray-300 p-2">
          <h1 className="pb-4 text-center text-lg font-semibold">
            {' '}
            Add Account{' '}
          </h1>
          <button
            onClick={toggle}
            className="absolute right-3 top-3 text-indigo-700 hover:text-gray-800"
          >
            {' '}
            <X />
          </button>
        </div>
        <form className="flex flex-col gap-4 p-4">
          <label> Let's go!</label>
          <label> Give it a nickname</label>
          <input type="text" placeholder="Account Name" />
          <label htmlFor="accountType">
            What type of account are you adding?
          </label>
          <select id="accountType" name="accountType">
            {ACCOUNT_TYPES.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label>What is your current account balance?</label>
          <input type="text" placeholder="Balance" />
        </form>
        <div className="flex justify-center border-t border-gray-300 p-4">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-800"
          >
            {' '}
            Add Account{' '}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddAccountModal
