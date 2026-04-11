type Props = {
  total: number
  limit: number
  currency: string
}

function SpendingWarning({ total, limit, currency }: Props) {
  const percentage = (total / limit) * 100

  if (percentage < 80) return null

  const isOver = percentage >= 100

  return (
    <div className={`rounded-lg px-4 py-3 text-sm font-medium ${isOver ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
      {isOver
        ? `You have exceeded your daily limit of ${limit.toFixed(2)} ${currency}`
        : `You are at ${Math.round(percentage)}% of your daily limit of ${limit.toFixed(2)} ${currency}`
      }
    </div>
  )
}

export default SpendingWarning