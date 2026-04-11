type Period = 'Day' | 'Week' | 'Month' | 'Year'

type Props = {
  total: number
  period: Period
}

function PeriodSummary({ total, period }: Props) {
  const now = new Date()

  const getLabel = () => {
    switch (period) {
      case 'Day':
        return now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      case 'Week': {
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        const days = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000)
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
        return `Week ${weekNumber}`
      }
      case 'Month':
        return now.toLocaleDateString('en-US', { month: 'long' })
      case 'Year':
        return now.getFullYear().toString()
    }
  }

  return (
    <div className="flex flex-col items-center bg-white border border-stone-200 rounded-lg p-6 mb-6">
      <p className="text-sm text-stone-600 mb-1">{getLabel()}</p>
      <p className="text-3xl font-semibold text-stone-900">
        {total.toFixed(2)} <span className="text-lg">MAD</span>
      </p>
    </div>
  )
}

export default PeriodSummary