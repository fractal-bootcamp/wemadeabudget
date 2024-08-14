type BulkActionsModalProps = {
  selectedIds: Set<string>
  clearSelection: () => void
}
export default function BulkActionsModal({
  selectedIds,
  clearSelection,
}: BulkActionsModalProps) {
  const ids = Array.from(selectedIds)
  const handleApplyActions = () => {
    // Logic to apply bulk actions
  }

  return (
    <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 transform items-center justify-between rounded-lg bg-indigo-900 p-4 text-slate-100">
      Bulk Action Bar
    </div>
  )
}
