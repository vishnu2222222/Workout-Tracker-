import { useState, useEffect, useCallback } from 'react'
import {
  type Workout,
  type WorkoutSet,
  getAllWorkouts,
  getWorkoutById,
  getWorkoutSets,
  getLastWorkoutByType,
  deleteWorkout
} from '../data/database'

interface UseHistoryReturn {
  workouts: Workout[]
  isLoading: boolean
  lastPushDate: Date | null
  lastPullDate: Date | null
  refreshHistory: () => Promise<void>
  getWorkoutDetails: (id: string) => Promise<{ workout: Workout; sets: WorkoutSet[] } | null>
  removeWorkout: (id: string) => Promise<void>
}

export function useHistory(): UseHistoryReturn {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastPushDate, setLastPushDate] = useState<Date | null>(null)
  const [lastPullDate, setLastPullDate] = useState<Date | null>(null)

  const refreshHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const [allWorkouts, lastPush, lastPull] = await Promise.all([
        getAllWorkouts(),
        getLastWorkoutByType('push'),
        getLastWorkoutByType('pull')
      ])

      setWorkouts(allWorkouts)
      setLastPushDate(lastPush?.date ?? null)
      setLastPullDate(lastPull?.date ?? null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshHistory()
  }, [refreshHistory])

  const getWorkoutDetails = useCallback(async (id: string): Promise<{ workout: Workout; sets: WorkoutSet[] } | null> => {
    const workout = await getWorkoutById(id)
    if (!workout) return null

    const sets = await getWorkoutSets(id)
    return { workout, sets }
  }, [])

  const removeWorkout = useCallback(async (id: string) => {
    await deleteWorkout(id)
    await refreshHistory()
  }, [refreshHistory])

  return {
    workouts,
    isLoading,
    lastPushDate,
    lastPullDate,
    refreshHistory,
    getWorkoutDetails,
    removeWorkout
  }
}
