import ExpenseCard from './ExpenseCard'
import type { Expense } from '../types'

type Props = {
  expenses: Expense[]
  onDelete: (id: string) => void
  currency: string
}

function ExpenseList({ expenses, onDelete, currency }: Props) {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: '#888888', letterSpacing: '0.12em' }}>
          Today's Transactions
        </p>
        <p className="text-xs" style={{ color: '#555555' }}><span className="font-['IBM_Plex_Mono']">{today}</span></p>
      </div>

      {expenses.length === 0 ? (
        <p className="text-center py-8 text-sm" style={{ color: '#444444' }}>
          No expenses today
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {expenses.map(expense => (
            <ExpenseCard key={expense.id} expense={expense} onDelete={onDelete} currency={currency} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ExpenseList