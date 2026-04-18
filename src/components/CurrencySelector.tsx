type Props = {
  currency: string
  onCurrencyChange: (currency: string) => void
}
 
function CurrencySelector({ currency, onCurrencyChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Currency</label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="w-full bg-[#252525] border border-[#2e2e2e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8CD9B] transition-colors duration-200"
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