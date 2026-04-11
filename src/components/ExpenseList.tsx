import ExpenseCard from './ExpenseCard'
import type { Expense } from '../types'

type Props = {
  expenses: Expense[]
  onDelete: (id: string) => void
  currency: string
}

function ExpenseList({ expenses, onDelete, currency }: Props) {
  return (
    <div>
      {expenses.map(expense => (
        <ExpenseCard key={expense.id} expense={expense} onDelete={onDelete} currency={currency} />
      ))}
    </div>
  )
}

export default ExpenseList