import type { Expense } from '../types'

type Props = {
  expense: Expense
  onDelete: (id: string) => void
}

function ExpenseCard({ expense, onDelete }: Props) {
  return (
    <div>
      <p>{expense.description}</p>
      <p>{expense.category}</p>
      <p>{expense.amount.toFixed(2)} MAD</p>
      <button onClick={() => onDelete(expense.id)}>Delete</button>
    </div>
  )
}

export default ExpenseCard