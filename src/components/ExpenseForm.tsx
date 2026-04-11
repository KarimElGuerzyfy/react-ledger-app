import { useState } from 'react'
import type { Expense, Category } from '../types'

type Props = {
  onAdd: (expense: Expense) => void
}

function ExpenseForm({ onAdd }: Props) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Food')

  function handleAdd() {
    if (!description.trim() || !amount) return

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      createdAt: new Date().toISOString(),
    }

    onAdd(newExpense)
    setDescription('')
    setAmount('')
    setCategory('Food')
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-stone-900 mb-4">Add Expense</h3>
      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
        <input
          type="number"
          placeholder="Amount"
          min="0"
          step="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full md:w-24 px-3 py-2 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="flex-2 px-3 py-2 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-900 focus:outline-none focus:border-stone-400"
          >
            <option value="Food">🍔 Food</option>
            <option value="Transport">🚗 Transport</option>
            <option value="Entertainment">🎮 Entertainment</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Health">🏥 Health</option>
            <option value="Bills">📄 Bills</option>
            <option value="Other">📦 Other</option>
          </select>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 px-6 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 active:bg-stone-800 transition-colors duration-200"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExpenseForm