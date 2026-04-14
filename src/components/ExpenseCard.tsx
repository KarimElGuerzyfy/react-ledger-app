import { 
  Utensils, 
  Car, 
  Gamepad2, 
  ShoppingBag, 
  Stethoscope, 
  Receipt, 
  Box,
  X,
} from 'lucide-react';
import type { Expense, Category } from '../types';
 
type Props = {
  expense: Expense
  onDelete: (id: string) => void
  currency: string
}
 
const CATEGORY_ICONS: Record<Category, React.ElementType> = {
  Food: Utensils,
  Transport: Car,
  Entertainment: Gamepad2,
  Shopping: ShoppingBag,
  Health: Stethoscope,
  Bills: Receipt,
  Other: Box,
};
 
function ExpenseCard({ expense, onDelete, currency }: Props) {
  const Icon = CATEGORY_ICONS[expense.category];
 
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 bg-[#252525] border border-[#2e2e2e]">
      
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#989898]/15 text-white">
        <Icon size={16} strokeWidth={2} />
      </div>
 
      {/* Name + category */}
      <div className="flex-1 min-w-0">
        <p className="text-md font-medium truncate text-white">
          {expense.description}
        </p>
        <p className="text-xs tracking-wider text-[#E8CD9B] leading-none mt-1 font-bold">
          {expense.category}
        </p>
      </div>
 
      {/* Amount */}
      <div className="text-sm font-light shrink-0 text-white font-['Platypi']">
        {expense.amount.toFixed(2)} <span className="text-sm text-white">{currency}</span>
      </div>
 
      {/* Delete */}
      <button
        onClick={() => onDelete(expense.id)}
        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 text-white hover:text-red-400 hover:bg-red-400/10"
        aria-label="Delete expense"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
    </div>
  )
}
 
export default ExpenseCard