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
    /* Parent container sets the color for everything inside */
    <div className="text-white">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase font-medium tracking-[0.12em]">
          Today's Expenses 
        </p>
        <p className="text-xs">
          <span className="font-['Platypi'] font-light">{today}</span>
        </p>
      </div>

      {expenses.length === 0 ? (
        <p className="text-center py-8 text-sm">
          No expenses today
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {expenses.map(expense => (
            <ExpenseCard 
              key={expense.id} 
              expense={expense} 
              onDelete={onDelete} 
              currency={currency} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ExpenseList