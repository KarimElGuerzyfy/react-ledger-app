import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'

export type Profile = {
  currency: string
  daily_limit: number
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