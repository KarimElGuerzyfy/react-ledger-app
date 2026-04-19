import HistoryCard from './HistoryCard'
 
type Item = {
  id: string
  label: string
  subtitle: string
  total: number
}
 
type Props = {
  title: string
  items: Item[]
  currency?: string
  hasMore: boolean
  loadingMore?: boolean
  onLoadMore: () => void
}
 
function HistorySection({ title, items, currency, hasMore, loadingMore, onLoadMore }: Props) {
  if (items.length === 0) return null
 
  return (
    <div className="mb-8">
      {/* Section title — dark pill */}
      <div className="w-full md:w-1/4 bg-[#2e2e2e] rounded-lg px-4 py-2 mb-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-widest text-left">
          {title}
        </h3>
      </div>
 
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <HistoryCard
            key={item.id}
            label={item.label}
            subtitle={item.subtitle}
            total={item.total}
            currency={currency}
          />
        ))}
      </div>
 
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loadingMore}
          className="mt-3 text-xs text-[#666666] hover:text-white transition-colors duration-150 tracking-widest uppercase disabled:opacity-50"
        >
          {loadingMore ? 'Loading...' : 'Show more'}
        </button>
      )}
    </div>
  )
}
 
export default HistorySection