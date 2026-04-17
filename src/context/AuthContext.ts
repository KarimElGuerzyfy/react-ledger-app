import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'
 
export type Profile = {
  currency: string
  daily_limit: number
  monthly_limit: number | null
  display_name: string | null
  auto_logout: string
}
 
export type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  refreshProfile: () => void
}
 
export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: () => {},
})
 