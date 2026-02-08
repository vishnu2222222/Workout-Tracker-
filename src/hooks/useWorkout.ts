import { useState, useEffect, useCallback } from 'react'
import { type Exercise, getExercises } from '../data/exercises'
import {
  type Workout,
  type WorkoutSet,
  type CustomExercise,
  createWorkout,
  completeWorkout,
  addSet,
  getWorkoutSets,
  getLastSetForExercise,
  getCustomWorkout
} from '../data/database'
import { getExerciseById } from '../data/exerciseLibrary'

export interface CurrentSet {
  exercise: Exercise
  setNumber: number
  weight: number
  reps: number
  lastSession?: { weight: number; reps: number }
}

interface UseWorkoutReturn {
  workout: Workout | null
  currentSet: CurrentSet | null
  completedSetsCount: number
  totalSets: number
  isLoading: boolean
  isWorkoutComplete: boolean
  workoutDuration: number
  allSets: WorkoutSet[]
  startWorkout: (type: 'push' | 'pull') => Promise<void>
  completeSet: (weight: number, reps: number) => Promise<void>
  setWeight: (weight: number) => void
  setReps: (reps: number) => void
}

// Convert custom exercise from DB to Exercise type
function customToExercise(custom: CustomExercise): Exercise | null {
  const template = getExerciseById(custom.exerciseId)
  if (!template) return null

  return {
    id: template.id,
    name: template.name,
    sets: custom.sets,
    targetReps: custom.targetReps,
    rpe: custom.rpe,
    restSeconds: custom.restSeconds,
    category: template.category
  }
}

// Get exercises for a workout type, using customizations if available
async function getWorkoutExercises(type: 'push' | 'pull'): Promise<Exercise[]> {
  const customWorkout = await getCustomWorkout(type)

  if (customWorkout && customWorkout.exercises.length > 0) {
    const exercises = customWorkout.exercises
      .sort((a, b) => a.order - b.order)
      .map(customToExercise)
      .filter((e): e is Exercise => e !== null)

    if (exercises.length > 0) {
      return exercises
    }
  }

  // Fall back to default exercises
  return getExercises(type)
}

// Calculate total sets for custom exercises
function calculateTotalSets(exercises: Exercise[]): number {
  return exercises.reduce((total, ex) => total + ex.sets, 0)
}

export function useWorkout(): UseWorkoutReturn {
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetNumber, setCurrentSetNumber] = useState(1)
  const [currentWeight, setCurrentWeight] = useState(0)
  const [currentReps, setCurrentReps] = useState(0)
  const [lastSessionData, setLastSessionData] = useState<{ weight: number; reps: number } | undefined>()
  const [completedSetsCount, setCompletedSetsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false)
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null)
  const [workoutDuration, setWorkoutDuration] = useState(0)
  const [allSets, setAllSets] = useState<WorkoutSet[]>([])

  const currentExercise = exercises[currentExerciseIndex]
  const totalSets = calculateTotalSets(exercises)

  // Load last session data for current exercise
  useEffect(() => {
    async function loadLastSession() {
      if (!currentExercise || !workout) return

      const lastSet = await getLastSetForExercise(currentExercise.id, workout.id)
      if (lastSet) {
        setLastSessionData({ weight: lastSet.weight, reps: lastSet.reps })
        // Pre-fill with last session values
        if (currentSetNumber === 1) {
          setCurrentWeight(lastSet.weight)
          setCurrentReps(lastSet.reps)
        }
      } else {
        setLastSessionData(undefined)
        // Default values for new exercises
        if (currentSetNumber === 1) {
          setCurrentWeight(0)
          setCurrentReps(parseInt(currentExercise.targetReps.split('-')[0]) || 8)
        }
      }
    }

    loadLastSession()
  }, [currentExercise, workout, currentSetNumber])

  // Update workout duration every second
  useEffect(() => {
    if (!workoutStartTime || isWorkoutComplete) return

    const interval = setInterval(() => {
      setWorkoutDuration(Math.floor((Date.now() - workoutStartTime.getTime()) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [workoutStartTime, isWorkoutComplete])

  const startWorkout = useCallback(async (type: 'push' | 'pull') => {
    setIsLoading(true)
    try {
      const newWorkout = await createWorkout(type)
      const workoutExercises = await getWorkoutExercises(type)

      setWorkout(newWorkout)
      setExercises(workoutExercises)
      setCurrentExerciseIndex(0)
      setCurrentSetNumber(1)
      setCompletedSetsCount(0)
      setIsWorkoutComplete(false)
      setWorkoutStartTime(new Date())
      setAllSets([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const completeSet = useCallback(async (weight: number, reps: number) => {
    if (!workout || !currentExercise) return

    const newSet: Omit<WorkoutSet, 'id'> = {
      workoutId: workout.id,
      exerciseId: currentExercise.id,
      setNumber: currentSetNumber,
      weight,
      reps,
      completedAt: new Date()
    }

    await addSet(newSet)

    // Update all sets for summary
    const updatedSets = await getWorkoutSets(workout.id)
    setAllSets(updatedSets)

    setCompletedSetsCount(prev => prev + 1)

    // Move to next set or next exercise
    if (currentSetNumber < currentExercise.sets) {
      setCurrentSetNumber(prev => prev + 1)
    } else if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setCurrentSetNumber(1)
    } else {
      // Workout complete
      await completeWorkout(workout.id)
      setIsWorkoutComplete(true)
    }
  }, [workout, currentExercise, currentSetNumber, currentExerciseIndex, exercises.length])

  const setWeight = useCallback((weight: number) => {
    setCurrentWeight(Math.max(0, weight))
  }, [])

  const setReps = useCallback((reps: number) => {
    setCurrentReps(Math.max(0, reps))
  }, [])

  const currentSet: CurrentSet | null = currentExercise ? {
    exercise: currentExercise,
    setNumber: currentSetNumber,
    weight: currentWeight,
    reps: currentReps,
    lastSession: lastSessionData
  } : null

  return {
    workout,
    currentSet,
    completedSetsCount,
    totalSets,
    isLoading,
    isWorkoutComplete,
    workoutDuration,
    allSets,
    startWorkout,
    completeSet,
    setWeight,
    setReps
  }
}
