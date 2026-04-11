import type { Expense } from '../types'

type Props = {
  expense: Expense
  onDelete: (id: string) => void
  currency: string
}

function ExpenseCard({ expense, onDelete, currency }: Props) {
  return (
    <div>
      <p>{expense.description}</p>
      <p>{expense.category}</p>
      <p>{expense.amount.toFixed(2)} {currency}</p>
      <button onClick={() => onDelete(expense.id)}>Delete</button>
    </div>
  )
}

export default ExpenseCard