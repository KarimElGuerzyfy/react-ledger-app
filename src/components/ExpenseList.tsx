import ExpenseCard from './ExpenseCard'
import type { Expense } from '../types'

type Props = {
  expenses: Expense[]
  onDelete: (id: string) => void
}

function ExpenseList({ expenses, onDelete }: Props) {
  return (
    <div>
      {expenses.map(expense => (
        <ExpenseCard key={expense.id} expense={expense} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default ExpenseList