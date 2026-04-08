import HistorySection from '../components/HistorySection'
import type { Day, Week, Month, Year } from '../types'

const fakeDays: Day[] = [
  { id: '1', date: '2026-04-06', totalSpent: 210.00, expenses: [], isClosed: true },
  { id: '2', date: '2026-04-05', totalSpent: 95.00, expenses: [], isClosed: true },
  { id: '3', date: '2026-04-04', totalSpent: 340.00, expenses: [], isClosed: true },
  { id: '4', date: '2026-04-03', totalSpent: 180.00, expenses: [], isClosed: true },
  { id: '5', date: '2026-04-02', totalSpent: 260.00, expenses: [], isClosed: true },
  { id: '6', date: '2026-04-01', totalSpent: 120.00, expenses: [], isClosed: true },
  { id: '7', date: '2026-03-31', totalSpent: 450.00, expenses: [], isClosed: true },
  { id: '8', date: '2026-03-30', totalSpent: 310.00, expenses: [], isClosed: true },
]

const fakeWeeks: Week[] = [
  { id: '1', weekNumber: 14, year: 2026, totalSpent: 1200.00, days: [], isClosed: true },
  { id: '2', weekNumber: 13, year: 2026, totalSpent: 980.00, days: [], isClosed: true },
  { id: '3', weekNumber: 12, year: 2026, totalSpent: 1450.00, days: [], isClosed: true },
  { id: '4', weekNumber: 11, year: 2026, totalSpent: 870.00, days: [], isClosed: true },
  { id: '5', weekNumber: 10, year: 2026, totalSpent: 1100.00, days: [], isClosed: true },
  { id: '6', weekNumber: 9, year: 2026, totalSpent: 990.00, days: [], isClosed: true },
  { id: '7', weekNumber: 8, year: 2026, totalSpent: 1320.00, days: [], isClosed: true },
  { id: '8', weekNumber: 7, year: 2026, totalSpent: 760.00, days: [], isClosed: true },
]

const fakeMonths: Month[] = [
  { id: '1', monthNumber: 3, year: 2026, totalSpent: 4200.00, days: [], isClosed: true },
  { id: '2', monthNumber: 2, year: 2026, totalSpent: 3800.00, days: [], isClosed: true },
  { id: '3', monthNumber: 1, year: 2026, totalSpent: 4100.00, days: [], isClosed: true },
  { id: '4', monthNumber: 12, year: 2025, totalSpent: 5200.00, days: [], isClosed: true },
  { id: '5', monthNumber: 11, year: 2025, totalSpent: 3900.00, days: [], isClosed: true },
  { id: '6', monthNumber: 10, year: 2025, totalSpent: 4400.00, days: [], isClosed: true },
  { id: '7', monthNumber: 9, year: 2025, totalSpent: 3600.00, days: [], isClosed: true },
  { id: '8', monthNumber: 8, year: 2025, totalSpent: 4800.00, days: [], isClosed: true },
]

const fakeYears: Year[] = [
  { id: '1', year: 2025, totalSpent: 42000.00, isClosed: true },
  { id: '2', year: 2024, totalSpent: 38000.00, isClosed: true },
]

function History() {
  return (
    <div>
      <h2>History</h2>
      <HistorySection
        title="Days"
        items={fakeDays.map(d => ({
          id: d.id,
          label: d.date,
          subtitle: 'Closed day',
          total: d.totalSpent,
        }))}
        defaultCount={7}
        maxCount={30}
      />
      <HistorySection
        title="Weeks"
        items={fakeWeeks.map(w => ({
          id: w.id,
          label: `Week ${w.weekNumber}`,
          subtitle: `${w.year}`,
          total: w.totalSpent,
        }))}
        defaultCount={7}
        maxCount={30}
      />
      <HistorySection
        title="Months"
        items={fakeMonths.map(m => ({
          id: m.id,
          label: `Month ${m.monthNumber}`,
          subtitle: `${m.year}`,
          total: m.totalSpent,
        }))}
        defaultCount={7}
        maxCount={12}
      />
      <HistorySection
        title="Years"
        items={fakeYears.map(y => ({
          id: y.id,
          label: `${y.year}`,
          subtitle: 'Full year',
          total: y.totalSpent,
        }))}
        defaultCount={fakeYears.length}
        maxCount={fakeYears.length}
      />
    </div>
  )
}

export default History