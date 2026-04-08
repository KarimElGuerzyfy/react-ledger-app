function ExpenseForm() {
  return (
    <div>
      <input type="text" placeholder="Description" />
      <input type="number" placeholder="Amount" min="0" step="0.1" />
      <select>
        <option>🍔 Food</option>
        <option>🚗 Transport</option>
        <option>🎮 Entertainment</option>
        <option>🛍️ Shopping</option>
        <option>🏥 Health</option>
        <option>📄 Bills</option>
        <option>📦 Other</option>
      </select>
      <button type="button">Add</button>
    </div>
  )
}

export default ExpenseForm