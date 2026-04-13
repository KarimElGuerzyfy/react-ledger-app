import { useState } from 'react'
import type { Expense, Category } from '../types'

type Props = {
  onAdd: (expense: Expense) => void
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'Food', label: 'Food' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Health', label: 'Health' },
  { value: 'Bills', label: 'Bills' },
  { value: 'Other', label: 'Other' },
]

function ExpenseForm({ onAdd }: Props) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Food')

  function handleAdd() {
    if (!description.trim() || !amount) return
    onAdd({
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      createdAt: new Date().toISOString(),
    })
    setDescription('')
    setAmount('')
    setCategory('Food')
  }

  const inputClasses = 'bg-[#252525] border border-[#2e2e2e] text-white outline-none placeholder:text-[#444444] px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 w-full'

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
      {/* Description */}
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputClasses}
      />

      {/* Amount */}
      <input
        type="number"
        placeholder="Amount"
        min="0"
        step="0.1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={`${inputClasses} font-['IBM_Plex_Mono']`}
        style={{
          MozAppearance: 'textfield',
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
      />
      
      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        className={inputClasses}
      >
        {CATEGORIES.map(c => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      {/* CTA */}
      <button
        type="button"
        onClick={handleAdd}
        className="bg-[#c4956a] text-[#1a1108] px-3 py-2.5 rounded-lg text-sm font-semibold tracking-[0.08em] uppercase transition-opacity duration-200 hover:opacity-90 active:opacity-75 w-full whitespace-nowrap"
      >
        Record Expense
      </button>
    </div>
  )
}

export default ExpenseForm