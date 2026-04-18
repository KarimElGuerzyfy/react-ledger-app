import { useState, useEffect } from 'react'
import PeriodFilter from '../components/PeriodFilter'
import PeriodSummary from '../components/PeriodSummary'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import SpendingWarning from '../components/SpendingWarning'
import MonthlyWarning from '../components/MonthlyWarning'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { Expense } from '../types'
 
type Period = 'Day' | 'Week' | 'Month' | 'Year'
 
type ExpenseInput = {
  description: string
  amount: number
  category: string
}
 
// Returns the date string (YYYY-MM-DD) of the most recent Monday
function getStartOfWeek(today: Date): string {
  const day = today.getDay() // 0 = Sunday, 1 = Monday, ...
  // If today is Sunday (0), go back 6 days to get Monday
  const daysFromMonday = day === 0 ? 6 : day - 1
  const monday = new Date(today)
  monday.setDate(today.getDate() - daysFromMonday)
  return monday.toISOString().split('T')[0]
}
 
function Dashboard() {
  const { user, profile } = useAuth()
  const DAILY_LIMIT = profile?.daily_limit ?? 300
  const MONTHLY_LIMIT = profile?.monthly_limit ?? null
  const CURRENCY = profile?.currency ?? 'MAD'
 
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [weekClosedTotal, setWeekClosedTotal] = useState(0)
  const [monthClosedTotal, setMonthClosedTotal] = useState(0)
  const [yearClosedTotal, setYearClosedTotal] = useState(0)
  const [activePeriod, setActivePeriod] = useState<Period>('Day')
  const [loading, setLoading] = useState(!!user)
  const [fetchError, setFetchError] = useState(false)
 
  useEffect(() => {
    if (!user) return
 
    async function fetchData() {
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      const weekStart = getStartOfWeek(today)
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString().split('T')[0]
      const yearStart = `${today.getFullYear()}-01-01`
 
      // Fetch today's live expenses
      const { data: todayExpenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user!.id)
        .gte('created_at', `${todayStr}T00:00:00`)
        .lte('created_at', `${todayStr}T23:59:59`)
        .order('created_at', { ascending: false })
 
      if (expensesError) {
        console.error(expensesError)
        setFetchError(true)
        setLoading(false)
        return
      }
 
      // Fetch all closed days from the start of the year up to (not including) today
      // One query covers week, month, and year — we filter in JS
      const { data: closedDays, error: daysError } = await supabase
        .from('days')
        .select('date, total_spent')
        .eq('user_id', user!.id)
        .eq('is_closed', true)
        .gte('date', yearStart)
        .lt('date', todayStr)
 
      if (daysError) {
        console.error(daysError)
        setFetchError(true)
        setLoading(false)
        return
      }
 
      const days = closedDays ?? []
 
      // Filter closed days per period and sum total_spent
      const weekTotal = days
        .filter(d => d.date >= weekStart)
        .reduce((sum: number, d: { total_spent: number }) => sum + d.total_spent, 0)
 
      const monthTotal = days
        .filter(d => d.date >= monthStart)
        .reduce((sum: number, d: { total_spent: number }) => sum + d.total_spent, 0)
 
      const yearTotal = days
        .reduce((sum: number, d: { total_spent: number }) => sum + d.total_spent, 0)
 
      setExpenses(todayExpenses ?? [])
      setWeekClosedTotal(weekTotal)
      setMonthClosedTotal(monthTotal)
      setYearClosedTotal(yearTotal)
      setLoading(false)
    }
 
    fetchData()
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
 
    setExpenses(prev => [data, ...prev])
    // Today's expense feeds into all period totals live
    setWeekClosedTotal(prev => prev + data.amount)
    setMonthClosedTotal(prev => prev + data.amount)
    setYearClosedTotal(prev => prev + data.amount)
  }
 
  async function handleDelete(id: string) {
    const deleted = expenses.find(e => e.id === id)
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) { console.error(error); return }
 
    setExpenses(prev => prev.filter(e => e.id !== id))
    if (deleted) {
      setWeekClosedTotal(prev => prev - deleted.amount)
      setMonthClosedTotal(prev => prev - deleted.amount)
      setYearClosedTotal(prev => prev - deleted.amount)
    }
  }
 
  // Today's live total
  const dayTotal = expenses.reduce((sum, e) => sum + e.amount, 0)
 
  // Each period = its closed days total + today's live expenses
  const periodTotals: Record<Period, number> = {
    Day: dayTotal,
    Week: weekClosedTotal + dayTotal,
    Month: monthClosedTotal + dayTotal,
    Year: yearClosedTotal + dayTotal,
  }
 
  const displayTotal = periodTotals[activePeriod]
 
  if (loading) return <div className="min-h-screen" />
 
  if (fetchError) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <p className="text-white text-sm">Something went wrong loading your data.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-[#E8CD9B] underline underline-offset-4 hover:opacity-80 transition-opacity"
        >
          Refresh the page
        </button>
      </div>
    </div>
  )
 
  return (
    <div className="min-h-screen px-4 py-6 md:px-8 lg:px-10">
      <div className="w-full max-w-3xl mx-auto lg:max-w-6xl">
        <PeriodFilter activePeriod={activePeriod} onPeriodChange={setActivePeriod} />
        <PeriodSummary total={displayTotal} period={activePeriod} currency={CURRENCY} />
        <SpendingWarning total={dayTotal} limit={DAILY_LIMIT} currency={CURRENCY} />
        {MONTHLY_LIMIT && (
          <MonthlyWarning
            total={monthClosedTotal + dayTotal}
            limit={MONTHLY_LIMIT}
            currency={CURRENCY}
          />
        )}
        <ExpenseForm onAdd={handleAdd} />
        <ExpenseList expenses={expenses} onDelete={handleDelete} currency={CURRENCY} />
      </div>
    </div>
  )
}
 
export default Dashboard