import ExpenseCard from './ExpenseCard'
import type { Expense } from '../types'

type Props = {
  expenses: Expense[]
}

function ExpenseList({ expenses }: Props) {
  return (
    <div>
      {expenses.map(expense => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  )
}

export default ExpenseList