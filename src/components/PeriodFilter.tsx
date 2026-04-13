type Period = 'Day' | 'Week' | 'Month' | 'Year'

type Props = {
  activePeriod: Period
  onPeriodChange: (period: Period) => void
}

function PeriodFilter({ activePeriod, onPeriodChange }: Props) {
  return (
    <div className="grid grid-cols-4 rounded-xl mb-6 p-1 bg-[#0F0E0D]">
      {(['Day', 'Week', 'Month', 'Year'] as Period[]).map((period) => (
        <button
          key={period}
          onClick={() => onPeriodChange(period)}
          className={`py-1.5 text-sm font-medium tracking-[0.08em] uppercase transition-colors duration-200 rounded-lg
            ${activePeriod === period
              ? 'bg-[#2e2e2e] text-white'
              : 'bg-transparent text-[#666666]'
            }`}
        >
          {period}
        </button>
      ))}
    </div>
  )
}

export default PeriodFilter