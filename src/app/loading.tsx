export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
      <span className="loading loading-infinity loading-lg"></span>
      <div className="flex items-center gap-5">
        <span className="loading loading-infinity loading-lg"></span>
        <div className="flex items-end gap-[2px]">
          Fetching transactions
          <span className="loading loading-dots loading-xs"></span>
        </div>
        <span className="loading loading-infinity loading-lg"></span>
      </div>
      <span className="loading loading-infinity loading-lg"></span>
    </div>
  )
}
