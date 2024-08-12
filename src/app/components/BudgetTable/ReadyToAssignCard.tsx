import { CircleCheckBig, CircleDollarSign, ThumbsDown } from 'lucide-react'
import useBudgetStore from '../../stores/transactionStore'
import { formatCentsToDollarString } from '../../util/utils'

export const ReadyToAssignCard = () => {
  const { netBalanceCents, totalAssigned, getBalanceByCategory } =
    useBudgetStore()
  const totalAssignableCents = getBalanceByCategory('Ready to Assign')

  const amount = totalAssignableCents - totalAssigned()
  const details = (() => {
    switch (true) {
      case amount === 0:
        return {
          classes: 'bg-[#edf1f5] text-[#6e7a88]',
          message: 'All money assigned',
          icon: <CircleCheckBig size={36} />,
        }
      case amount > 0:
        return {
          classes: 'bg-[#c1ee9f] text-black',
          message: 'Ready to assign',
          icon: <CircleDollarSign size={36} />,
        }
      default:
        return {
          classes: 'bg-[#faada5] text-black',
          message: 'Overassigned',
          icon: <ThumbsDown size={36} />,
        }
    }
  })()
  return (
    <div
      className={`flex min-w-[200px] items-center justify-between rounded-xl px-4 pb-3 pt-2 ${details.classes}`}
    >
      <div className="flex flex-col items-start">
        <div className="text-lg font-bold">
          {formatCentsToDollarString(amount)}
        </div>
        {details.message}
      </div>
      <div className="text-sm">{details.icon}</div>
    </div>
  )
}
