// Categories
export type Category = 
| 'Food'
| 'Transport'
| 'Entertainment' 
| 'Shopping'
| 'Health'
| 'Bills'
| 'Other'

// Single expense
export type Expense = {
    id: string
    description: string
    amount: number
    category: Category
    createdAt: string
}

// A single day
export type Day ={
    id: string
    date: string
    totalSpent: number
    expenses: Expense[]
    isClosed: boolean
}

// A week (week 1-52)
export type Week = {
    id: string
    weekNumber: number
    year: number
    totalSpent: number
    days: Day[]
    isClosed: boolean
}

// A month
export type Month = {
    id: string
    monthNumber: number
    year: number
    totalSpent: number
    days: Day[]
    isClosed: boolean
}

// A year
export type Year = {
  id: string
  year: number
  totalSpent: number
  isClosed: boolean
}

// A user
export type User = {
    id: string
    email: string
    createdAt: string
}