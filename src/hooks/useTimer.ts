import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTimerReturn {
  timeRemaining: number
  isRunning: boolean
  start: (seconds: number) => void
  stop: () => void
  skip: () => void
  formatTime: (seconds: number) => string
}

// Audio context for timer alert
let audioContext: AudioContext | null = null

function playAlertSound() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)

    // Play 3 beeps
    setTimeout(() => {
      const osc2 = audioContext!.createOscillator()
      const gain2 = audioContext!.createGain()
      osc2.connect(gain2)
      gain2.connect(audioContext!.destination)
      osc2.frequency.value = 800
      osc2.type = 'sine'
      gain2.gain.setValueAtTime(0.3, audioContext!.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext!.currentTime + 0.5)
      osc2.start(audioContext!.currentTime)
      osc2.stop(audioContext!.currentTime + 0.5)
    }, 200)

    setTimeout(() => {
      const osc3 = audioContext!.createOscillator()
      const gain3 = audioContext!.createGain()
      osc3.connect(gain3)
      gain3.connect(audioContext!.destination)
      osc3.frequency.value = 1000
      osc3.type = 'sine'
      gain3.gain.setValueAtTime(0.3, audioContext!.currentTime)
      gain3.gain.exponentialRampToValueAtTime(0.01, audioContext!.currentTime + 0.8)
      osc3.start(audioContext!.currentTime)
      osc3.stop(audioContext!.currentTime + 0.8)
    }, 400)
  } catch (e) {
    console.warn('Could not play alert sound:', e)
  }
}

function vibrate() {
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200, 100, 400])
  }
}

export function useTimer(onComplete?: () => void): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const onCompleteRef = useRef(onComplete)

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }, [])

  const start = useCallback((seconds: number) => {
    stop()
    setTimeRemaining(seconds)
    setIsRunning(true)

    intervalRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          stop()
          playAlertSound()
          vibrate()
          onCompleteRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [stop])

  const skip = useCallback(() => {
    stop()
    setTimeRemaining(0)
    onCompleteRef.current?.()
  }, [stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
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
    formatTime
  }
}
