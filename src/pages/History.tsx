import { useEffect, useState } from 'react'
import HistorySection from '../components/HistorySection'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

type DayRow = { id: string; date: string; total_spent: number }
type WeekRow = { id: string; week_number: number; year: number; total_spent: number }
type MonthRow = { id: string; month_number: number; year: number; total_spent: number }
type YearRow = { id: string; year: number; total_spent: number }

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function History() {
  const { user, profile } = useAuth()
  const CURRENCY = profile?.currency ?? 'MAD'
  const [days, setDays] = useState<DayRow[]>([])
  const [weeks, setWeeks] = useState<WeekRow[]>([])
  const [months, setMonths] = useState<MonthRow[]>([])
  const [years, setYears] = useState<YearRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchHistory() {
      const [daysRes, weeksRes, monthsRes, yearsRes] = await Promise.all([
        supabase
          .from('days')
          .select('id, date, total_spent')
          .eq('user_id', user!.id)
          .eq('is_closed', true)
          .order('date', { ascending: false }),
        supabase
          .from('weeks')
          .select('id, week_number, year, total_spent')
          .eq('user_id', user!.id)
          .eq('is_closed', true)
          .order('year', { ascending: false })
          .order('week_number', { ascending: false }),
        supabase
          .from('months')
          .select('id, month_number, year, total_spent')
          .eq('user_id', user!.id)
          .eq('is_closed', true)
          .order('year', { ascending: false })
          .order('month_number', { ascending: false }),
        supabase
          .from('years')
          .select('id, year, total_spent')
          .eq('user_id', user!.id)
          .eq('is_closed', true)
          .order('year', { ascending: false }),
      ])

      if (daysRes.data) setDays(daysRes.data)
      if (weeksRes.data) setWeeks(weeksRes.data)
      if (monthsRes.data) setMonths(monthsRes.data)
      if (yearsRes.data) setYears(yearsRes.data)
      setLoading(false)
    }

    fetchHistory()
  }, [user])

  if (loading) return <div className="min-h-screen" />

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 lg:px-10">
      <div className="w-full max-w-3xl mx-auto lg:max-w-6xl rounded-2xl p-6 bg-[#1e1e1e] border border-[#2e2e2e]">
        <HistorySection
          title="Days"
          currency={CURRENCY}
          items={days.map(d => ({
            id: d.id,
            label: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            }),
            subtitle: 'Closed day',
            total: d.total_spent,
          }))}
          defaultCount={7}
          maxCount={30}
        />
        <HistorySection
          title="Weeks"
          currency={CURRENCY}
          items={weeks.map(w => ({
            id: w.id,
            label: `Week ${w.week_number}`,
            subtitle: `${w.year}`,
            total: w.total_spent,
          }))}
          defaultCount={7}
          maxCount={30}
        />
        <HistorySection
          title="Months"
          currency={CURRENCY}
          items={months.map(m => ({
            id: m.id,
            label: MONTH_NAMES[m.month_number - 1],
            subtitle: `${m.year}`,
            total: m.total_spent,
          }))}
          defaultCount={7}
          maxCount={12}
        />
        <HistorySection
          title="Years"
          currency={CURRENCY}
          items={years.map(y => ({
            id: y.id,
            label: `${y.year}`,
            subtitle: 'Full year',
            total: y.total_spent,
          }))}
          defaultCount={years.length}
          maxCount={years.length}
        />
      </div>
    </div>
  )
}

export default History