type Props = {
  total: number
  limit: number
  currency: string
}
 
function MonthlyWarning({ total, limit, currency }: Props) {
  const percentage = Math.min((total / limit) * 100, 100)
  const remaining = Math.max(limit - total, 0)
  const isOver = total >= limit
 
  // Only render when approaching or over the limit
  if (percentage < 80) return null
 
  return (
    <div className="rounded-xl px-4 py-3 mb-6 bg-[#1C1B1A] border border-[#e07070]/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] mb-0.5 text-[#e07070]">
            Monthly Limit
          </p>
          <p className="text-sm text-white font-['Source_Sans_3'] tabular-nums">
            <span className="font-['Platypi'] font-light">{total.toFixed(2)}</span>
            <span className="text-[#888] mx-1">/</span>
            <span className="font-['Platypi'] font-light">{limit.toFixed(2)}</span>
            {' '}{currency}
          </p>
        </div>
        <p className={`text-xs font-medium ${isOver ? 'text-[#e05555]' : 'text-[#e07070]'}`}>
          {isOver
            ? 'Over limit'
            : `${Math.round(percentage)}% used`}
        </p>
      </div>
 
      {/* Slim progress bar */}
      <div className="relative h-1 rounded-full mt-3 bg-[#333333]">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: isOver ? '#e05555' : '#e07070',
          }}
        />
      </div>
 
      <p className="text-xs text-center mt-2 text-[#888] font-['Source_Sans_3'] tabular-nums">
        {isOver
          ? <><span className="font-['Platypi'] font-light text-[#e05555]">{(total - limit).toFixed(2)}</span> {currency} over monthly limit</>
          : <><span className="font-['Platypi'] font-light text-white">{remaining.toFixed(2)}</span> {currency} remaining this month</>}
      </p>
    </div>
  )
}
 
export default MonthlyWarning