import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const INACTIVITY_LIMIT = 2 * 60 * 60 * 1000

export function useInactivityLogout() {
  const navigate = useNavigate()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      await supabase.auth.signOut()
      navigate('/')
    }, INACTIVITY_LIMIT)
  }, [navigate])

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(event => window.addEventListener(event, resetTimer))
    resetTimer()

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer))
      if (timer.current) clearTimeout(timer.current)
    }
  }, [resetTimer])
}