type Props = {
  currency: string
  onCurrencyChange: (currency: string) => void
}
 
function CurrencySelector({ currency, onCurrencyChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-black font-semibold">Currency</label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="w-full bg-[#F4F4F4] shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] border border-transparent rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:border-[#E59898] transition-colors duration-200"
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