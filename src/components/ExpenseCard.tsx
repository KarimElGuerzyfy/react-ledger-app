import type { Expense } from '../types'

type Props = {
  expense: Expense
}

function ExpenseCard({ expense }: Props) {
  return (
    <div>
      <p>{expense.description}</p>
      <p>{expense.category}</p>
      <p>{expense.amount.toFixed(2)} MAD</p>
      <button>Delete</button>
    </div>
  )
}

export default ExpenseCard