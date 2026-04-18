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
 
const DAYS_PAGE = 7
const WEEKS_PAGE = 4
const MONTHS_PAGE = 3
 
function History() {
  const { user, profile } = useAuth()
  const CURRENCY = profile?.currency ?? 'MAD'
 
  const [days, setDays] = useState<DayRow[]>([])
  const [weeks, setWeeks] = useState<WeekRow[]>([])
  const [months, setMonths] = useState<MonthRow[]>([])
  const [years, setYears] = useState<YearRow[]>([])
 
  // Track how many are currently loaded per section
  const [daysLimit, setDaysLimit] = useState(DAYS_PAGE)
  const [weeksLimit, setWeeksLimit] = useState(WEEKS_PAGE)
  const [monthsLimit, setMonthsLimit] = useState(MONTHS_PAGE)
 
  // Track whether there are more to load per section
  const [hasMoreDays, setHasMoreDays] = useState(false)
  const [hasMoreWeeks, setHasMoreWeeks] = useState(false)
  const [hasMoreMonths, setHasMoreMonths] = useState(false)
 
  // Track loading state per section for the button
  const [loadingDays, setLoadingDays] = useState(false)
  const [loadingWeeks, setLoadingWeeks] = useState(false)
  const [loadingMonths, setLoadingMonths] = useState(false)
 
  const [loading, setLoading] = useState(!!user)
 
  // Fetch days with a given limit — we fetch limit+1 to know if there are more
  async function fetchDays(limit: number, userId: string) {
    const { data } = await supabase
      .from('days')
      .select('id, date, total_spent')
      .eq('user_id', userId)
      .eq('is_closed', true)
      .order('date', { ascending: false })
      .limit(limit + 1)
 
    if (!data) return
    setHasMoreDays(data.length > limit)
    setDays(data.slice(0, limit))
  }
 
  async function fetchWeeks(limit: number, userId: string) {
    const { data } = await supabase
      .from('weeks')
      .select('id, week_number, year, total_spent')
      .eq('user_id', userId)
      .eq('is_closed', true)
      .order('year', { ascending: false })
      .order('week_number', { ascending: false })
      .limit(limit + 1)
 
    if (!data) return
    setHasMoreWeeks(data.length > limit)
    setWeeks(data.slice(0, limit))
  }
 
  async function fetchMonths(limit: number, userId: string) {
    const { data } = await supabase
      .from('months')
      .select('id, month_number, year, total_spent')
      .eq('user_id', userId)
      .eq('is_closed', true)
      .order('year', { ascending: false })
      .order('month_number', { ascending: false })
      .limit(limit + 1)
 
    if (!data) return
    setHasMoreMonths(data.length > limit)
    setMonths(data.slice(0, limit))
  }
 
  // Initial load — all sections in parallel
  useEffect(() => {
    if (!user) return
 
    async function fetchAll() {
      await Promise.all([
        fetchDays(DAYS_PAGE, user!.id),
        fetchWeeks(WEEKS_PAGE, user!.id),
        fetchMonths(MONTHS_PAGE, user!.id),
        supabase
          .from('years')
          .select('id, year, total_spent')
          .eq('user_id', user!.id)
          .eq('is_closed', true)
          .order('year', { ascending: false })
          .then(({ data }) => { if (data) setYears(data) }),
      ])
      setLoading(false)
    }
 
    fetchAll()
  }, [user])
 
  async function handleLoadMoreDays() {
    if (!user) return
    setLoadingDays(true)
    const newLimit = daysLimit + DAYS_PAGE
    await fetchDays(newLimit, user.id)
    setDaysLimit(newLimit)
    setLoadingDays(false)
  }
 
  async function handleLoadMoreWeeks() {
    if (!user) return
    setLoadingWeeks(true)
    const newLimit = weeksLimit + WEEKS_PAGE
    await fetchWeeks(newLimit, user.id)
    setWeeksLimit(newLimit)
    setLoadingWeeks(false)
  }
 
  async function handleLoadMoreMonths() {
    if (!user) return
    setLoadingMonths(true)
    const newLimit = monthsLimit + MONTHS_PAGE
    await fetchMonths(newLimit, user.id)
    setMonthsLimit(newLimit)
    setLoadingMonths(false)
  }
 
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
          hasMore={hasMoreDays}
          loadingMore={loadingDays}
          onLoadMore={handleLoadMoreDays}
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
          hasMore={hasMoreWeeks}
          loadingMore={loadingWeeks}
          onLoadMore={handleLoadMoreWeeks}
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
          hasMore={hasMoreMonths}
          loadingMore={loadingMonths}
          onLoadMore={handleLoadMoreMonths}
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
          hasMore={false}
          onLoadMore={() => {}}
        />
      </div>
    </div>
  )
}
 
export default History