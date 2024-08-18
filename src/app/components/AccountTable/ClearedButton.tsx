'use client'

interface ClearedButtonProps {
  onToggle: () => void
  cleared: boolean
}
export default function ClearedButton({
  onToggle,
  cleared,
}: ClearedButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`h-4 w-4 rounded-full ${cleared ? 'bg-green-600 text-white' : 'border border-gray-400 bg-white text-gray-600'} text-bold text-center text-xs`}
    >
      C
      <input type="hidden" name="cleared" value="false" />
    </button>
  )
}
