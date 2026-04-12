import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const INACTIVITY_LIMIT = 2 * 60 * 60 * 1000
const CHECK_INTERVAL = 30000

export function useInactivityLogout() {
  const navigate = useNavigate()
  const lastActivity = useRef<number>(0)

  useEffect(() => {
    lastActivity.current = Date.now()

    const controller = new AbortController()
    const { signal } = controller

    const handleActivity = () => {
      lastActivity.current = Date.now()
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']

    events.forEach(event => {
      window.addEventListener(event, handleActivity, {
        signal,
        passive: true
      })
    })

    const interval = setInterval(async () => {
      const elapsed = Date.now() - lastActivity.current
      if (elapsed >= INACTIVITY_LIMIT) {
        clearInterval(interval)
        await supabase.auth.signOut()
        navigate('/')
      }
    }, CHECK_INTERVAL)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [navigate])
}