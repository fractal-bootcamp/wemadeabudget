const AccountsHeader = () => {
  return (
    //TODO make these numbers dynamic
    <div className="flex flex-col">
      <div className="mx-4 my-2 text-xl font-semibold"> All Accounts</div>
      <div className="flex w-full border-b border-t border-gray-300 p-2">
        <div className="flex flex-col px-2">
          <div> -$1400.00 </div>
          <div className="flex items-center gap-1 text-[10px]">
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-gray-800 font-bold text-white">
              C
            </div>
            Cleared Balance
          </div>
        </div>
        <div className="px-2"> + </div>
        <div className="flex flex-col px-2">
          <div className="text-green-600"> $1400.00 </div>
          <div className="flex items-center gap-1 text-[10px]">
            <div className="flex h-3 w-3 items-center justify-center rounded-full border border-gray-500 font-bold text-gray-500">
              C
            </div>
            Uncleared Balance
          </div>
        </div>
        <div className="px-2"> = </div>
        <div className="flex flex-col px-2">
          <div> $1400.00 </div>
          <div className="text-[10px]"> Working Balance </div>
        </div>
      </div>
    </div>
  )
}
export default AccountsHeader
