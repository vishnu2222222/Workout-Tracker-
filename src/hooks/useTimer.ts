import { useState, useEffect, useCallback, useRef } from 'react'
import {
  playDing,
  vibrate,
  startSilentLoop,
  stopSilentLoop,
  showTimerNotification,
} from '../utils/audio'

interface UseTimerReturn {
  timeRemaining: number
  isRunning: boolean
  start: (seconds: number) => void
  stop: () => void
  skip: () => void
  formatTime: (seconds: number) => string
}

/**
 * Timestamp-based timer that stays accurate even when the browser throttles
 * setInterval in the background. Instead of decrementing a counter each tick
 * we store the target end-time and compute the remaining seconds on every
 * tick (and when the app regains focus).
 */
export function useTimer(onComplete?: () => void): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // Refs so callbacks always see latest values without re-creating timers
  const endTimeRef = useRef<number>(0)
  const intervalRef = useRef<number | null>(null)
  const onCompleteRef = useRef(onComplete)
  const isRunningRef = useRef(false)
  const notificationTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // ------------------------------------------------------------------
  // Core tick – compute remaining from wall-clock
  // ------------------------------------------------------------------

  const tick = useCallback(() => {
    const remaining = Math.max(
      0,
      Math.round((endTimeRef.current - Date.now()) / 1000),
    )
    setTimeRemaining(remaining)

    if (remaining <= 0 && isRunningRef.current) {
      // Timer done!
      isRunningRef.current = false
      setIsRunning(false)

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      // Alert the user
      playDing()
      vibrate()
      stopSilentLoop()
      showTimerNotification()
      onCompleteRef.current?.()
    }
  }, [])

  // ------------------------------------------------------------------
  // Re-sync when the tab / PWA regains visibility
  // ------------------------------------------------------------------

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isRunningRef.current) {
        tick()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility)
  }, [tick])

  // ------------------------------------------------------------------
  // Public API
  // ------------------------------------------------------------------

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
      notificationTimeoutRef.current = null
    }
    isRunningRef.current = false
    setIsRunning(false)
    stopSilentLoop()
  }, [])

  const start = useCallback(
    (seconds: number) => {
      stop()

      const now = Date.now()
      endTimeRef.current = now + seconds * 1000

      setTimeRemaining(seconds)
      isRunningRef.current = true
      setIsRunning(true)

      // Start the silent audio loop to keep iOS audio session alive
      startSilentLoop()

      // Schedule a backup notification in case JS is fully suspended
      if ('Notification' in window && Notification.permission === 'granted') {
        notificationTimeoutRef.current = window.setTimeout(() => {
          if (isRunningRef.current) {
            showTimerNotification()
          }
        }, seconds * 1000)
      }

      // Tick every 250ms for smoother updates & faster background recovery
      intervalRef.current = window.setInterval(tick, 250)
    },
    [stop, tick],
  )

  const skip = useCallback(() => {
    stop()
    setTimeRemaining(0)
    onCompleteRef.current?.()
  }, [stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (notificationTimeoutRef.current)
        clearTimeout(notificationTimeoutRef.current)
      stopSilentLoop()
    }
  }, [])

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    timeRemaining,
    isRunning,
    start,
    stop,
    skip,
    formatTime,
  }
}
