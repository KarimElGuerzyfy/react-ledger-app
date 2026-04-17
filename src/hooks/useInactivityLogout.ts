import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
 
const CHECK_INTERVAL = 30000
 
// Converts the auto_logout string stored in the profile to milliseconds.
// Returns null if the user has chosen "never".
function getInactivityLimit(autoLogout: string): number | null {
  if (autoLogout === 'never') return null
  const minutes = parseInt(autoLogout, 10)
  if (isNaN(minutes)) return null
  return minutes * 60 * 1000
}
 
export function useInactivityLogout(autoLogout: string = '15') {
  const navigate = useNavigate()
  const lastActivity = useRef<number>(0)
 
  useEffect(() => {
    const limit = getInactivityLimit(autoLogout)
 
    // If the user chose "never", don't set up any logout logic
    if (limit === null) return
 
    // Set initial activity timestamp inside the effect, not at ref init
    lastActivity.current = Date.now()
 
    const controller = new AbortController()
    const { signal } = controller
 
    let throttleTimer: ReturnType<typeof setTimeout> | null = null
 
    const handleActivity = () => {
      // Throttle to fire at most once every 3 seconds to avoid
      // hundreds of clearTimeout/setTimeout calls per second
      if (throttleTimer) return
      throttleTimer = setTimeout(() => {
        lastActivity.current = Date.now()
        throttleTimer = null
      }, 3000)
    }
 
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
 
    events.forEach(event => {
      window.addEventListener(event, handleActivity, {
        signal,
        passive: true,
      })
    })
 
    const interval = setInterval(async () => {
      const elapsed = Date.now() - lastActivity.current
      if (elapsed >= limit) {
        clearInterval(interval)
        await supabase.auth.signOut()
        navigate('/')
      }
    }, CHECK_INTERVAL)
 
    return () => {
      controller.abort()
      clearInterval(interval)
      if (throttleTimer) clearTimeout(throttleTimer)
    }
  }, [navigate, autoLogout])
}