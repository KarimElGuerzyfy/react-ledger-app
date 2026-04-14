type Props = {
  currency: string
  onCurrencyChange: (currency: string) => void
}

function CurrencySelector({ currency, onCurrencyChange }: Props) {
  return (
    <div className="text-white">
      <label htmlFor="currency">Currency</label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
      >
        <option value="MAD">MAD</option>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
        <option value="GBP">GBP</option>
        <option value="AED">AED</option>
      </select>
    </div>
  )
}

export default CurrencySelector