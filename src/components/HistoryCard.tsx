type Props = {
  label: string
  subtitle: string
  total: number
  currency?: string
}
 
function HistoryCard({ label, subtitle, total, currency = 'MAD' }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4 rounded-lg bg-[#363433]">
      <p className="text-sm text-white">
        {label}
        <span className="text-[#797373]"> — </span>
        <span className="text-[#797373] font-semibold">{subtitle}</span>
      </p>
      <p className="font-['Platypi'] font-light text-sm text-white sm:shrink-0 sm:ml-4 mt-1 sm:mt-0">
        {total.toFixed(2)} <span className="text-white">{currency}</span>
      </p>
    </div>
  )
}
 
export default HistoryCard
 