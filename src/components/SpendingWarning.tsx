type Props = {
  total: number
  limit: number
  currency: string
}

function SpendingWarning({ total, limit, currency }: Props) {
  const percentage = Math.min((total / limit) * 100, 100)
  const remaining = Math.max(limit - total, 0)
  const isOver = total >= limit
  const isWarning = percentage >= 80

  const barColor = isOver ? '#e05555' : isWarning ? '#e07070' : '#c4956a'

  return (
    <div className="rounded-xl p-4 mb-6 bg-[#1C1B1A] font-[Poppins]">
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] mb-1 text-white">
            Daily Limit
          </p>
          <p className="text-2xl font-medium text-white tracking-[-0.01em] font-['Source_Sans_3'] tabular-nums">
            <span className="font-['IBM_Plex_Mono']">{limit.toFixed(2)}</span> {currency}
          </p>
        </div>
        <p className={`text-xs ${isOver ? 'text-[#e05555]' : 'text-white'}`}>
          <span className="font-['IBM_Plex_Mono']">{Math.round(percentage)}%</span> Used
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 rounded-full my-3 bg-[#333333]">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: barColor }}
        />
      </div>

      <p className="text-sm text-center text-white font-['Source_Sans_3'] tabular-nums">
        {isOver
          ? <><span className="font-['IBM_Plex_Mono']">{(total - limit).toFixed(2)}</span> {currency} over limit</>
          : <><span className="font-['IBM_Plex_Mono']">{remaining.toFixed(2)}</span> {currency} remaining for today</>}
      </p>
    </div>
  )
}

export default SpendingWarning