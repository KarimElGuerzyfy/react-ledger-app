import { useState } from 'react'
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
  defaultCount: number
  maxCount: number
  currency?: string
}

function HistorySection({ title, items, defaultCount, maxCount, currency }: Props) {
  const [expanded, setExpanded] = useState(false)

  const visibleItems = expanded ? items.slice(0, maxCount) : items.slice(0, defaultCount)
  const canExpand = items.length > defaultCount

  if (items.length === 0) return null

  return (
    <div className="mb-8">
      <h3 className="text-xs uppercase tracking-[0.15em] text-[#666666] mb-3 font-medium">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {visibleItems.map(item => (
          <HistoryCard
            key={item.id}
            label={item.label}
            subtitle={item.subtitle}
            total={item.total}
            currency={currency}
          />
        ))}
      </div>
      {canExpand && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-[#666666] hover:text-white transition-colors duration-150 tracking-widest uppercase"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}

export default HistorySection