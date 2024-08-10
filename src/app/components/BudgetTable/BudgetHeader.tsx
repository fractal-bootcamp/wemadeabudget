import { useState } from 'react'
export default function BudgetHeader() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(1) // Add state for selected month

  return (
    //TODO make this actually change the view based on the month
    <div className="mx-4 my-2 flex flex-col justify-center">
      <div className="ml-4 font-sans text-xl font-semibold">
        {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        })}
      </div>
      <div className="flex">
        <select
          id="monthSelector"
          className="rounded border p-1"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, index) => {
            const month = new Date(0, index).toLocaleString('default', {
              month: 'long',
            })
            return (
              <option key={index} value={index + 1}>
                {month}
              </option>
            )
          })}
        </select>
        <select
          id="yearSelector"
          className="rounded border p-1"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, index) => {
            const year = new Date().getFullYear() - index
            return (
              <option key={year} value={year}>
                {year}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}
