type Period = 'Day' | 'Week' | 'Month' | 'Year'

type Props = {
  total: number
  period: Period
  currency: string
}

function PeriodSummary({ total, currency }: Props) {
  return (
    <div className="flex flex-col items-center mb-6 py-4">
      <p className="text-xs uppercase tracking-[0.15em] mb-2 text-white">
        Current Spending
      </p>
      <p className="text-5xl font-normal tracking-[-0.01em] text-white font-['Source_Sans_3'] tabular-nums">
        <span className="font-['IBM_Plex_Mono']">{total.toFixed(2)}</span>{' '}
        <span className="text-2xl text-white">{currency}</span>
      </p>
    </div>
  )
}

export default PeriodSummary