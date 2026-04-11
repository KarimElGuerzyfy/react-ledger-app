type Period = 'Day' | 'Week' | 'Month' | 'Year'

type Props = {
  activePeriod: Period
  onPeriodChange: (period: Period) => void
}

function PeriodFilter({ activePeriod, onPeriodChange }: Props) {
  return (
    <div className="flex gap-2 mb-6 mt-4 justify-center">
      {(['Day', 'Week', 'Month', 'Year'] as Period[]).map(period => (
        <button
          key={period}
          onClick={() => onPeriodChange(period)}
          className={`px-4 py-1 text-sm font-medium rounded-lg border transition-colors ${
            activePeriod === period
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-900'
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  )
}

export default PeriodFilter