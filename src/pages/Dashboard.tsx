import { useState, useEffect } from 'react'
import PeriodFilter from '../components/PeriodFilter'
import PeriodSummary from '../components/PeriodSummary'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import SpendingWarning from '../components/SpendingWarning'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { Expense } from '../types'
 
type Period = 'Day' | 'Week' | 'Month' | 'Year'
 
const fakeTotals: Record<Period, number> = {
  Day: 0,
  Week: 1200.00,
  Month: 4200.00,
  Year: 42000.00,
}
 
type ExpenseInput = {
  description: string
  amount: number
  category: string
}
 
function Dashboard() {
  const { user, profile } = useAuth()
  const DAILY_LIMIT = profile?.daily_limit ?? 300
  const CURRENCY = profile?.currency ?? 'MAD'
 
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [activePeriod, setActivePeriod] = useState<Period>('Day')
  // Initialize loading as true only if user already exists.
  // If user is null (auth hasn't resolved yet or logged out),
  // there is nothing to fetch so loading starts as false.
  const [loading, setLoading] = useState(!!user)
 
  useEffect(() => {
    if (!user) return
 
    async function fetchTodayExpenses() {
      // Date range is derived from the user's local clock.
      // Supabase stores timestamps in UTC, so this filter is timezone-aware
      // as long as the user's device clock is correct. A server-side
      // timezone solution can be added later if needed.
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user!.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false })
 
      if (error) { console.error(error); return }
      setExpenses(data)
      setLoading(false)
    }
 
    fetchTodayExpenses()
  }, [user])
 
  async function handleAdd(expense: ExpenseInput) {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user!.id,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
      })
      .select()
      .single()
 
    if (error) { console.error(error); return }
    setExpenses([data, ...expenses])
  }
 
  async function handleDelete(id: string) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) { console.error(error); return }
    setExpenses(expenses.filter(e => e.id !== id))
  }
 
  const dayTotal = expenses.reduce((sum, e) => sum + e.amount, 0)
  const displayTotal = activePeriod === 'Day' ? dayTotal : fakeTotals[activePeriod]
 
  if (loading) return <div className="min-h-screen" />
 
  return (
    <div className="min-h-screen px-4 py-6 md:px-8 lg:px-10">
      <div className="w-full max-w-3xl mx-auto lg:max-w-6xl">
        <PeriodFilter activePeriod={activePeriod} onPeriodChange={setActivePeriod} />
        <PeriodSummary total={displayTotal} period={activePeriod} currency={CURRENCY} />
        <SpendingWarning total={dayTotal} limit={DAILY_LIMIT} currency={CURRENCY} />
        <ExpenseForm onAdd={handleAdd} />
        <ExpenseList expenses={expenses} onDelete={handleDelete} currency={CURRENCY} />
      </div>
    </div>
  )
}
 
export default Dashboard