export type ExerciseCategory = 'primary' | 'secondary' | 'isolation'

export interface Exercise {
  id: string
  name: string
  sets: number
  targetReps: string
  rpe: number
  restSeconds: number
  category: ExerciseCategory
}

export interface WarmupSet {
  percentage: number
  reps: string
}

// Warm-up schemes by exercise category
export const warmupSchemes: Record<ExerciseCategory, WarmupSet[]> = {
  primary: [
    { percentage: 40, reps: '8' },
    { percentage: 60, reps: '5' },
    { percentage: 80, reps: '2-3' }
  ],
  secondary: [
    { percentage: 50, reps: '5' },
    { percentage: 75, reps: '3' }
  ],
  isolation: [
    { percentage: 50, reps: '10-12' }
  ]
}

export const pushExercises: Exercise[] = [
  {
    id: 'incline-barbell-press',
    name: 'Incline Barbell Press',
    sets: 4,
    targetReps: '6-8',
    rpe: 8,
    restSeconds: 210, // 3-4 min, using 3.5 min avg
    category: 'primary'
  },
  {
    id: 'dips',
    name: 'Dips',
    sets: 3,
    targetReps: '8-10',
    rpe: 8,
    restSeconds: 180, // 3 min
    category: 'secondary'
  },
  {
    id: 'cable-fly',
    name: 'Cable Fly',
    sets: 3,
    targetReps: '10-12',
    rpe: 9,
    restSeconds: 105, // 90-120 sec avg
    category: 'isolation'
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    sets: 3,
    targetReps: '12-15',
    rpe: 9,
    restSeconds: 90,
    category: 'isolation'
  },
  {
    id: 'overhead-tricep-extension',
    name: 'Overhead Tricep Extension',
    sets: 3,
    targetReps: '10-12',
    rpe: 8,
    restSeconds: 105, // 90-120 sec avg
    category: 'isolation'
  }
]

export const pullExercises: Exercise[] = [
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    sets: 4,
    targetReps: '8-10',
    rpe: 8,
    restSeconds: 180, // 3 min
    category: 'primary'
  },
  {
    id: 'cable-row',
    name: 'Cable Row',
    sets: 4,
    targetReps: '8-10',
    rpe: 8,
    restSeconds: 165, // 2.5-3 min avg
    category: 'secondary'
  },
  {
    id: 'face-pull',
    name: 'Face Pull',
    sets: 3,
    targetReps: '12-15',
    rpe: 8,
    restSeconds: 90,
    category: 'isolation'
  },
  {
    id: 'bayesian-curl',
    name: 'Bayesian Curl',
    sets: 3,
    targetReps: '10-12',
    rpe: 8,
    restSeconds: 105, // 90-120 sec avg
    category: 'isolation'
  }
]

export function getExercises(type: 'push' | 'pull'): Exercise[] {
  return type === 'push' ? pushExercises : pullExercises
}

export function getTotalSets(type: 'push' | 'pull'): number {
  const exercises = getExercises(type)
  return exercises.reduce((total, ex) => total + ex.sets, 0)
}

export function calculateWarmupWeights(workingWeight: number, category: ExerciseCategory): { weight: number; reps: string }[] {
  const scheme = warmupSchemes[category]
  return scheme.map(s => ({
    weight: Math.round((workingWeight * s.percentage) / 100 / 5) * 5, // Round to nearest 5
    reps: s.reps
  }))
}

export function formatWarmupDisplay(workingWeight: number, category: ExerciseCategory): string {
  const warmups = calculateWarmupWeights(workingWeight, category)
  return warmups.map(w => `${w.weight} lbs × ${w.reps}`).join(', ')
}
