export type ExerciseCategory = 'primary' | 'secondary' | 'isolation'
export type WorkoutType = 'push' | 'pull'
export type MuscleGroup = 'chest' | 'shoulders' | 'triceps' | 'back' | 'biceps' | 'rear-delts'

export interface ExerciseTemplate {
  id: string
  name: string
  category: ExerciseCategory
  muscleGroups: MuscleGroup[]
  workoutType: WorkoutType
  defaultSets: number
  defaultReps: string
  defaultRpe: number
  defaultRest: number
}

// Complete library of all available exercises
export const exerciseLibrary: ExerciseTemplate[] = [
  // === PUSH EXERCISES ===

  // Chest - Primary
  {
    id: 'incline-barbell-press',
    name: 'Incline Barbell Press',
    category: 'primary',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    workoutType: 'push',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRpe: 8,
    defaultRest: 210
  },
  {
    id: 'flat-barbell-bench',
    name: 'Flat Barbell Bench Press',
    category: 'primary',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    workoutType: 'push',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRpe: 8,
    defaultRest: 210
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'primary',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    workoutType: 'push',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRpe: 8,
    defaultRest: 180
  },
  {
    id: 'flat-dumbbell-press',
    name: 'Flat Dumbbell Press',
    category: 'primary',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    workoutType: 'push',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRpe: 8,
    defaultRest: 180
  },

  // Chest - Secondary
  {
    id: 'dips',
    name: 'Dips',
    category: 'secondary',
    muscleGroups: ['chest', 'triceps'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRpe: 8,
    defaultRest: 180
  },
  {
    id: 'machine-chest-press',
    name: 'Machine Chest Press',
    category: 'secondary',
    muscleGroups: ['chest', 'triceps'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 120
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: 'secondary',
    muscleGroups: ['chest', 'triceps'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: 8,
    defaultRest: 90
  },

  // Chest - Isolation
  {
    id: 'cable-fly',
    name: 'Cable Fly',
    category: 'isolation',
    muscleGroups: ['chest'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 9,
    defaultRest: 105
  },
  {
    id: 'pec-deck',
    name: 'Pec Deck',
    category: 'isolation',
    muscleGroups: ['chest'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: 9,
    defaultRest: 90
  },
  {
    id: 'incline-cable-fly',
    name: 'Incline Cable Fly',
    category: 'isolation',
    muscleGroups: ['chest'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: 9,
    defaultRest: 90
  },

  // Shoulders - Primary/Secondary
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'primary',
    muscleGroups: ['shoulders', 'triceps'],
    workoutType: 'push',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRpe: 8,
    defaultRest: 180
  },
  {
    id: 'seated-dumbbell-press',
    name: 'Seated Dumbbell Press',
    category: 'secondary',
    muscleGroups: ['shoulders', 'triceps'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRpe: 8,
    defaultRest: 150
  },
  {
    id: 'machine-shoulder-press',
    name: 'Machine Shoulder Press',
    category: 'secondary',
    muscleGroups: ['shoulders', 'triceps'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 120
  },

  // Shoulders - Isolation
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    category: 'isolation',
    muscleGroups: ['shoulders'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: 9,
    defaultRest: 90
  },
  {
    id: 'cable-lateral-raise',
    name: 'Cable Lateral Raise',
    category: 'isolation',
    muscleGroups: ['shoulders'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: 9,
    defaultRest: 90
  },
  {
    id: 'front-raise',
    name: 'Front Raise',
    category: 'isolation',
    muscleGroups: ['shoulders'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: 8,
    defaultRest: 90
  },

  // Triceps - Isolation
  {
    id: 'overhead-tricep-extension',
    name: 'Overhead Tricep Extension',
    category: 'isolation',
    muscleGroups: ['triceps'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 105
  },
  {
    id: 'tricep-pushdown',
    name: 'Tricep Pushdown',
    category: 'isolation',
    muscleGroups: ['triceps'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 90
  },
  {
    id: 'skull-crushers',
    name: 'Skull Crushers',
    category: 'isolation',
    muscleGroups: ['triceps'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 105
  },
  {
    id: 'close-grip-bench',
    name: 'Close Grip Bench Press',
    category: 'secondary',
    muscleGroups: ['triceps', 'chest'],
    workoutType: 'push',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRpe: 8,
    defaultRest: 150
  },

  // === PULL EXERCISES ===

  // Back - Primary
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'primary',
    muscleGroups: ['back', 'biceps'],
    workoutType: 'pull',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRpe: 8,
    defaultRest: 180
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: 'primary',
    muscleGroups: ['back', 'biceps'],
    workoutType: 'pull',
    defaultSets: 4,
    defaultReps: '6-10',
    defaultRpe: 8,
    defaultRest: 180
  },
  {
    id: 'chin-ups',
    name: 'Chin-ups',
    category: 'primary',
    muscleGroups: ['back', 'biceps'],
    workoutType: 'pull',
    defaultSets: 4,
    defaultReps: '6-10',
    defaultRpe: 8,
    defaultRest: 180
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    category: 'primary',
    muscleGroups: ['back', 'biceps'],
    workoutType: 'pull',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRpe: 8,
    defaultRest: 180
  },

  // Back - Secondary
  {
    id: 'cable-row',
    name: 'Cable Row',
    category: 'secondary',
    muscleGroups: ['back', 'biceps'],
    workoutType: 'pull',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRpe: 8,
    defaultRest: 165
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Row',
    category: 'secondary',
    muscleGroups: ['back', 'biceps'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRpe: 8,
    defaultRest: 120
  },
  {
    id: 't-bar-row',
    name: 'T-Bar Row',
    category: 'secondary',
    muscleGroups: ['back', 'biceps'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRpe: 8,
    defaultRest: 150
  },
  {
    id: 'machine-row',
    name: 'Machine Row',
    category: 'secondary',
    muscleGroups: ['back', 'biceps'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 120
  },
  {
    id: 'close-grip-pulldown',
    name: 'Close Grip Pulldown',
    category: 'secondary',
    muscleGroups: ['back', 'biceps'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 120
  },

  // Rear Delts - Isolation
  {
    id: 'face-pull',
    name: 'Face Pull',
    category: 'isolation',
    muscleGroups: ['rear-delts', 'back'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: 8,
    defaultRest: 90
  },
  {
    id: 'rear-delt-fly',
    name: 'Rear Delt Fly',
    category: 'isolation',
    muscleGroups: ['rear-delts'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: 9,
    defaultRest: 90
  },
  {
    id: 'reverse-pec-deck',
    name: 'Reverse Pec Deck',
    category: 'isolation',
    muscleGroups: ['rear-delts'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRpe: 9,
    defaultRest: 90
  },

  // Biceps - Isolation
  {
    id: 'bayesian-curl',
    name: 'Bayesian Curl',
    category: 'isolation',
    muscleGroups: ['biceps'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 105
  },
  {
    id: 'barbell-curl',
    name: 'Barbell Curl',
    category: 'isolation',
    muscleGroups: ['biceps'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRpe: 8,
    defaultRest: 105
  },
  {
    id: 'dumbbell-curl',
    name: 'Dumbbell Curl',
    category: 'isolation',
    muscleGroups: ['biceps'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 90
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    category: 'isolation',
    muscleGroups: ['biceps'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 90
  },
  {
    id: 'preacher-curl',
    name: 'Preacher Curl',
    category: 'isolation',
    muscleGroups: ['biceps'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 90
  },
  {
    id: 'incline-dumbbell-curl',
    name: 'Incline Dumbbell Curl',
    category: 'isolation',
    muscleGroups: ['biceps'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 90
  },
  {
    id: 'cable-curl',
    name: 'Cable Curl',
    category: 'isolation',
    muscleGroups: ['biceps'],
    workoutType: 'pull',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRpe: 8,
    defaultRest: 90
  }
]

// Get exercises filtered by workout type
export function getExercisesByType(workoutType: WorkoutType): ExerciseTemplate[] {
  return exerciseLibrary.filter(e => e.workoutType === workoutType)
}

// Get exercise by ID
export function getExerciseById(id: string): ExerciseTemplate | undefined {
  return exerciseLibrary.find(e => e.id === id)
}

// Group exercises by muscle group for picker
export function getExercisesGroupedByMuscle(workoutType: WorkoutType): Record<string, ExerciseTemplate[]> {
  const exercises = getExercisesByType(workoutType)
  const grouped: Record<string, ExerciseTemplate[]> = {}

  const muscleGroupLabels: Record<MuscleGroup, string> = {
    'chest': 'Chest',
    'shoulders': 'Shoulders',
    'triceps': 'Triceps',
    'back': 'Back',
    'biceps': 'Biceps',
    'rear-delts': 'Rear Delts'
  }

  exercises.forEach(exercise => {
    const primaryMuscle = exercise.muscleGroups[0]
    const label = muscleGroupLabels[primaryMuscle]
    if (!grouped[label]) {
      grouped[label] = []
    }
    grouped[label].push(exercise)
  })

  return grouped
}

// Default workout routines
export const defaultPushWorkout = [
  'incline-barbell-press',
  'dips',
  'cable-fly',
  'lateral-raise',
  'overhead-tricep-extension'
]

export const defaultPullWorkout = [
  'lat-pulldown',
  'cable-row',
  'face-pull',
  'bayesian-curl'
]
