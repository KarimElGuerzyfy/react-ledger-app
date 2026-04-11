import { useState } from 'react'
import PeriodFilter from '../components/PeriodFilter'
import PeriodSummary from '../components/PeriodSummary'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import type { Expense } from '../types'

type Period = 'Day' | 'Week' | 'Month' | 'Year'

const initialExpenses: Expense[] = [
  { id: '1', description: 'Coffee', amount: 25.00, category: 'Food', createdAt: '2026-04-07T08:00:00.000Z' },
  { id: '2', description: 'Taxi', amount: 40.00, category: 'Transport', createdAt: '2026-04-07T09:00:00.000Z' },
  { id: '3', description: 'Netflix', amount: 120.00, category: 'Entertainment', createdAt: '2026-04-07T10:00:00.000Z' },
]

const fakeTotals: Record<Period, number> = {
  Day: 185.00,
  Week: 1200.00,
  Month: 4200.00,
  Year: 42000.00,
}

function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [activePeriod, setActivePeriod] = useState<Period>('Day')

  const dayTotal = expenses.reduce((sum, e) => sum + e.amount, 0)

  const displayTotal = activePeriod === 'Day' ? dayTotal : fakeTotals[activePeriod]

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <PeriodFilter activePeriod={activePeriod} onPeriodChange={setActivePeriod} />
      <PeriodSummary total={displayTotal} period={activePeriod} />
      <ExpenseForm onAdd={(expense) => setExpenses([...expenses, expense])} />
      <ExpenseList expenses={expenses} onDelete={(id) => setExpenses(expenses.filter(e => e.id !== id))} />
    </div>
  )
}

export default Dashboard