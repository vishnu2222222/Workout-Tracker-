import Dexie, { type EntityTable } from 'dexie'

export interface WorkoutSet {
  id?: number
  workoutId: string
  exerciseId: string
  setNumber: number
  weight: number
  reps: number
  completedAt: Date
}

export interface Workout {
  id: string
  type: 'push' | 'pull'
  date: Date
  startTime: Date
  endTime?: Date
  duration?: number // minutes
  completed: boolean
}

export interface CustomExercise {
  exerciseId: string
  sets: number
  targetReps: string
  rpe: number
  restSeconds: number
  order: number
}

export interface CustomWorkout {
  id: string // 'push' or 'pull'
  exercises: CustomExercise[]
  updatedAt: Date
}

const db = new Dexie('WorkoutTrackerDB') as Dexie & {
  workouts: EntityTable<Workout, 'id'>
  sets: EntityTable<WorkoutSet, 'id'>
  customWorkouts: EntityTable<CustomWorkout, 'id'>
}

db.version(1).stores({
  workouts: 'id, type, date, completed',
  sets: '++id, workoutId, exerciseId, [workoutId+exerciseId]'
})

db.version(2).stores({
  workouts: 'id, type, date, completed',
  sets: '++id, workoutId, exerciseId, [workoutId+exerciseId]',
  customWorkouts: 'id'
})

export { db }

// Helper functions
export async function createWorkout(type: 'push' | 'pull'): Promise<Workout> {
  const workout: Workout = {
    id: crypto.randomUUID(),
    type,
    date: new Date(),
    startTime: new Date(),
    completed: false
  }
  await db.workouts.add(workout)
  return workout
}

export async function completeWorkout(workoutId: string): Promise<void> {
  const endTime = new Date()
  const workout = await db.workouts.get(workoutId)
  if (workout) {
    const duration = Math.round((endTime.getTime() - workout.startTime.getTime()) / 60000)
    await db.workouts.update(workoutId, {
      endTime,
      duration,
      completed: true
    })
  }
}

export async function addSet(set: Omit<WorkoutSet, 'id'>): Promise<void> {
  await db.sets.add(set as WorkoutSet)
}

export async function getWorkoutSets(workoutId: string): Promise<WorkoutSet[]> {
  return db.sets.where('workoutId').equals(workoutId).toArray()
}

export async function getLastWorkoutByType(type: 'push' | 'pull'): Promise<Workout | undefined> {
  return db.workouts
    .where('type')
    .equals(type)
    .and(w => w.completed)
    .reverse()
    .sortBy('date')
    .then(workouts => workouts[0])
}

export async function getLastSetForExercise(exerciseId: string, excludeWorkoutId?: string): Promise<WorkoutSet | undefined> {
  // Get all completed workouts
  const allWorkouts = await db.workouts.toArray()
  const completedWorkouts = allWorkouts.filter(w => w.completed === true)

  // Filter and sort to get the most recent one that's not the current workout
  const filteredWorkouts = completedWorkouts
    .filter(w => w.id !== excludeWorkoutId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Find the most recent set for this exercise
  for (const workout of filteredWorkouts) {
    const sets = await db.sets
      .where('[workoutId+exerciseId]')
      .equals([workout.id, exerciseId])
      .toArray()

    if (sets.length > 0) {
      // Return the last set (highest set number)
      return sets.sort((a, b) => b.setNumber - a.setNumber)[0]
    }
  }

  return undefined
}

export async function getAllWorkouts(): Promise<Workout[]> {
  const allWorkouts = await db.workouts.toArray()
  return allWorkouts
    .filter(w => w.completed === true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getWorkoutById(id: string): Promise<Workout | undefined> {
  return db.workouts.get(id)
}

export async function deleteWorkout(id: string): Promise<void> {
  await db.sets.where('workoutId').equals(id).delete()
  await db.workouts.delete(id)
}

// Custom workout functions
export async function getCustomWorkout(type: 'push' | 'pull'): Promise<CustomWorkout | undefined> {
  return db.customWorkouts.get(type)
}

export async function saveCustomWorkout(type: 'push' | 'pull', exercises: CustomExercise[]): Promise<void> {
  const customWorkout: CustomWorkout = {
    id: type,
    exercises,
    updatedAt: new Date()
  }
  await db.customWorkouts.put(customWorkout)
}

export async function resetWorkoutToDefault(type: 'push' | 'pull'): Promise<void> {
  await db.customWorkouts.delete(type)
}
