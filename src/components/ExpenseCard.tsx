import type { Expense, Category } from '../types'

type Props = {
  expense: Expense
  onDelete: (id: string) => void
  currency: string
}

const CATEGORY_ICONS: Record<Category, string> = {
  Food: '🍔',
  Transport: '🚗',
  Entertainment: '🎮',
  Shopping: '🛍️',
  Health: '🏥',
  Bills: '📄',
  Other: '📦',
}

function ExpenseCard({ expense, onDelete, currency }: Props) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150"
      style={{ background: '#252525', border: '1px solid #2e2e2e' }}
    >
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
        style={{ background: '#1e1e1e' }}
      >
        {CATEGORY_ICONS[expense.category]}
      </div>

      {/* Name + category */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: '#ffffff' }}>
          {expense.description}
        </p>
        <p className="text-xs uppercase tracking-wider" style={{ color: '#555555', letterSpacing: '0.1em' }}>
          {expense.category}
        </p>
      </div>

      {/* Amount */}
      <p className="text-sm font-medium shrink-0" style={{ color: '#ffffff' }}>
        <span className="font-['IBM_Plex_Mono']">{expense.amount.toFixed(2)}</span> {currency}
      </p>

      {/* Delete */}
      <button
        onClick={() => onDelete(expense.id)}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-150 hover:opacity-70"
        style={{ color: '#555555' }}
        aria-label="Delete expense"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1" />
          <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

export default ExpenseCard