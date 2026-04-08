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
}

function HistorySection({ title, items, defaultCount, maxCount }: Props) {
  const [expanded, setExpanded] = useState(false)

  const visibleItems = expanded ? items.slice(0, maxCount) : items.slice(0, defaultCount)
  const canExpand = items.length > defaultCount

  return (
    <div>
      <h3>{title}</h3>
      {visibleItems.map(item => (
        <HistoryCard
          key={item.id}
          label={item.label}
          subtitle={item.subtitle}
          total={item.total}
        />
      ))}
      {canExpand && (
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}

export default HistorySection