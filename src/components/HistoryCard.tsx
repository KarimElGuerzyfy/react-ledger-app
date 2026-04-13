type Props = {
  label: string
  subtitle: string
  total: number
  currency?: string
}

function HistoryCard({ label, subtitle, total, currency = 'MAD' }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#252525] border border-[#2e2e2e]">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-[#666666] uppercase tracking-widest mt-0.5">{subtitle}</p>
      </div>
      <p className="font-['DM_Mono'] text-sm font-medium text-white">
        {total.toFixed(2)} <span className="text-[#666666]">{currency}</span>
      </p>
    </div>
  )
}

export default HistoryCard