import { createContext, useContext, type ReactNode } from 'react'
import { useWorkout, type CurrentSet } from '../hooks/useWorkout'
import { useHistory } from '../hooks/useHistory'
import type { Workout, WorkoutSet } from '../data/database'

interface WorkoutContextType {
  // Workout state
  workout: Workout | null
  currentSet: CurrentSet | null
  completedSetsCount: number
  totalSets: number
  isLoading: boolean
  isWorkoutComplete: boolean
  workoutDuration: number
  allSets: WorkoutSet[]

  // Workout actions
  startWorkout: (type: 'push' | 'pull') => Promise<void>
  completeSet: (weight: number, reps: number) => Promise<void>
  setWeight: (weight: number) => void
  setReps: (reps: number) => void

  // History state
  workouts: Workout[]
  historyLoading: boolean
  lastPushDate: Date | null
  lastPullDate: Date | null

  // History actions
  refreshHistory: () => Promise<void>
  getWorkoutDetails: (id: string) => Promise<{ workout: Workout; sets: WorkoutSet[] } | null>
  removeWorkout: (id: string) => Promise<void>
}

const WorkoutContext = createContext<WorkoutContextType | null>(null)

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const workoutHook = useWorkout()
  const historyHook = useHistory()

  const value: WorkoutContextType = {
    // Workout
    workout: workoutHook.workout,
    currentSet: workoutHook.currentSet,
    completedSetsCount: workoutHook.completedSetsCount,
    totalSets: workoutHook.totalSets,
    isLoading: workoutHook.isLoading,
    isWorkoutComplete: workoutHook.isWorkoutComplete,
    workoutDuration: workoutHook.workoutDuration,
    allSets: workoutHook.allSets,
    startWorkout: workoutHook.startWorkout,
    completeSet: workoutHook.completeSet,
    setWeight: workoutHook.setWeight,
    setReps: workoutHook.setReps,

    // History
    workouts: historyHook.workouts,
    historyLoading: historyHook.isLoading,
    lastPushDate: historyHook.lastPushDate,
    lastPullDate: historyHook.lastPullDate,
    refreshHistory: historyHook.refreshHistory,
    getWorkoutDetails: historyHook.getWorkoutDetails,
    removeWorkout: historyHook.removeWorkout
  }

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkoutContext(): WorkoutContextType {
  const context = useContext(WorkoutContext)
  if (!context) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider')
  }
  return context
}
