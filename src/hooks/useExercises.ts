import { useState, useEffect, useCallback } from 'react'
import {
  type CustomExercise,
  getCustomWorkout,
  saveCustomWorkout,
  resetWorkoutToDefault
} from '../data/database'
import {
  type ExerciseTemplate,
  type WorkoutType,
  getExerciseById,
  defaultPushWorkout,
  defaultPullWorkout
} from '../data/exerciseLibrary'
import { type Exercise } from '../data/exercises'

export interface CustomizedExercise extends Exercise {
  isCustomized: boolean
}

interface UseExercisesReturn {
  exercises: CustomizedExercise[]
  isLoading: boolean
  saveExercises: (exercises: CustomizedExercise[]) => Promise<void>
  resetToDefault: () => Promise<void>
  addExercise: (exerciseId: string, afterIndex?: number) => Promise<void>
  removeExercise: (index: number) => Promise<void>
  updateExercise: (index: number, updates: Partial<CustomizedExercise>) => Promise<void>
  reorderExercises: (fromIndex: number, toIndex: number) => Promise<void>
}

function getDefaultExerciseIds(type: WorkoutType): string[] {
  return type === 'push' ? defaultPushWorkout : defaultPullWorkout
}

function templateToCustomized(template: ExerciseTemplate, isCustomized: boolean): CustomizedExercise {
  return {
    id: template.id,
    name: template.name,
    sets: template.defaultSets,
    targetReps: template.defaultReps,
    rpe: template.defaultRpe,
    restSeconds: template.defaultRest,
    category: template.category,
    isCustomized
  }
}

function customExerciseToCustomized(custom: CustomExercise): CustomizedExercise | null {
  const template = getExerciseById(custom.exerciseId)
  if (!template) return null

  return {
    id: template.id,
    name: template.name,
    sets: custom.sets,
    targetReps: custom.targetReps,
    rpe: custom.rpe,
    restSeconds: custom.restSeconds,
    category: template.category,
    isCustomized: true
  }
}

function customizedToCustomExercise(exercise: CustomizedExercise, order: number): CustomExercise {
  return {
    exerciseId: exercise.id,
    sets: exercise.sets,
    targetReps: exercise.targetReps,
    rpe: exercise.rpe,
    restSeconds: exercise.restSeconds,
    order
  }
}

export function useExercises(type: WorkoutType): UseExercisesReturn {
  const [exercises, setExercises] = useState<CustomizedExercise[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load exercises from database or use defaults
  useEffect(() => {
    async function loadExercises() {
      setIsLoading(true)
      try {
        const customWorkout = await getCustomWorkout(type)

        if (customWorkout && customWorkout.exercises.length > 0) {
          // Load customized exercises
          const customizedExercises = customWorkout.exercises
            .sort((a, b) => a.order - b.order)
            .map(customExerciseToCustomized)
            .filter((e): e is CustomizedExercise => e !== null)

          setExercises(customizedExercises)
        } else {
          // Load default exercises
          const defaultIds = getDefaultExerciseIds(type)
          const defaultExercises = defaultIds
            .map(id => getExerciseById(id))
            .filter((t): t is ExerciseTemplate => t !== undefined)
            .map(t => templateToCustomized(t, false))

          setExercises(defaultExercises)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadExercises()
  }, [type])

  const saveExercises = useCallback(async (newExercises: CustomizedExercise[]) => {
    const customExercises = newExercises.map((e, i) => customizedToCustomExercise(e, i))
    await saveCustomWorkout(type, customExercises)
    setExercises(newExercises.map(e => ({ ...e, isCustomized: true })))
  }, [type])

  const resetToDefault = useCallback(async () => {
    await resetWorkoutToDefault(type)

    // Load defaults
    const defaultIds = getDefaultExerciseIds(type)
    const defaultExercises = defaultIds
      .map(id => getExerciseById(id))
      .filter((t): t is ExerciseTemplate => t !== undefined)
      .map(t => templateToCustomized(t, false))

    setExercises(defaultExercises)
  }, [type])

  const addExercise = useCallback(async (exerciseId: string, afterIndex?: number) => {
    const template = getExerciseById(exerciseId)
    if (!template) return

    const newExercise = templateToCustomized(template, true)
    const newExercises = [...exercises]

    if (afterIndex !== undefined && afterIndex >= 0) {
      newExercises.splice(afterIndex + 1, 0, newExercise)
    } else {
      newExercises.push(newExercise)
    }

    await saveExercises(newExercises)
  }, [exercises, saveExercises])

  const removeExercise = useCallback(async (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index)
    await saveExercises(newExercises)
  }, [exercises, saveExercises])

  const updateExercise = useCallback(async (index: number, updates: Partial<CustomizedExercise>) => {
    const newExercises = exercises.map((e, i) =>
      i === index ? { ...e, ...updates, isCustomized: true } : e
    )
    await saveExercises(newExercises)
  }, [exercises, saveExercises])

  const reorderExercises = useCallback(async (fromIndex: number, toIndex: number) => {
    const newExercises = [...exercises]
    const [moved] = newExercises.splice(fromIndex, 1)
    newExercises.splice(toIndex, 0, moved)
    await saveExercises(newExercises)
  }, [exercises, saveExercises])

  return {
    exercises,
    isLoading,
    saveExercises,
    resetToDefault,
    addExercise,
    removeExercise,
    updateExercise,
    reorderExercises
  }
}

// Hook to get exercises for workout (compatible with existing useWorkout)
export function useWorkoutExercises(type: WorkoutType): Exercise[] {
  const { exercises } = useExercises(type)

  // Strip out isCustomized to match Exercise type
  return exercises.map(({ isCustomized, ...rest }) => rest)
}
