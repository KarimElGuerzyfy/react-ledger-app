import PeriodFilter from '../components/PeriodFilter'
import PeriodSummary from '../components/PeriodSummary'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import type { Expense } from '../types'

const fakeExpenses: Expense[] = [
  {
    id: '1',
    description: 'Coffee',
    amount: 25.00,
    category: 'Food',
    createdAt: '2026-04-07T08:00:00.000Z'
  },
  {
    id: '2',
    description: 'Taxi',
    amount: 40.00,
    category: 'Transport',
    createdAt: '2026-04-07T09:00:00.000Z'
  },
  {
    id: '3',
    description: 'Netflix',
    amount: 120.00,
    category: 'Entertainment',
    createdAt: '2026-04-07T10:00:00.000Z'
  },
]

const fakeTotal = fakeExpenses.reduce((sum, e) => sum + e.amount, 0)

function Dashboard() {
  return (
    <div>
      <PeriodFilter activePeriod="Day" />
      <PeriodSummary total={fakeTotal} date="Monday, April 7 2026" />
      <ExpenseForm />
      <ExpenseList expenses={fakeExpenses} />
    </div>
  )
}

export default Dashboard