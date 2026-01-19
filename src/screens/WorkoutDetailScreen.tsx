import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkoutContext } from '../context/WorkoutContext'
import { Button } from '../components/Button'
import { getExercises, type Exercise } from '../data/exercises'
import type { Workout, WorkoutSet } from '../data/database'

interface ExerciseSummary {
  exercise: Exercise
  sets: {
    setNumber: number
    weight: number
    reps: number
  }[]
  totalVolume: number
}

export default function WorkoutDetailScreen() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getWorkoutDetails, removeWorkout } = useWorkoutContext()

  const [workout, setWorkout] = useState<Workout | null>(null)
  const [sets, setSets] = useState<WorkoutSet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    async function loadWorkout() {
      if (!id) return
      setIsLoading(true)
      const details = await getWorkoutDetails(id)
      if (details) {
        setWorkout(details.workout)
        setSets(details.sets)
      }
      setIsLoading(false)
    }
    loadWorkout()
  }, [id, getWorkoutDetails])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4">
        <div className="text-gray-400">Workout not found</div>
        <Button variant="primary" onClick={() => navigate('/history')}>
          Back to History
        </Button>
      </div>
    )
  }

  const exercises = getExercises(workout.type)

  const summaryData: ExerciseSummary[] = exercises
    .map(exercise => {
      const exerciseSets = sets
        .filter(s => s.exerciseId === exercise.id)
        .sort((a, b) => a.setNumber - b.setNumber)
        .map(s => ({
          setNumber: s.setNumber,
          weight: s.weight,
          reps: s.reps
        }))

      const totalVolume = exerciseSets.reduce((sum, s) => sum + s.weight * s.reps, 0)

      return {
        exercise,
        sets: exerciseSets,
        totalVolume
      }
    })
    .filter(s => s.sets.length > 0)

  const totalVolume = summaryData.reduce((sum, s) => sum + s.totalVolume, 0)
  const totalSets = sets.length

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return '-'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handleDelete = async () => {
    if (!id) return
    await removeWorkout(id)
    navigate('/history')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/history')}
            className="text-gray-400 hover:text-white p-2 -ml-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <h1 className={`text-xl font-bold ${
              workout.type === 'push' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {workout.type.toUpperCase()} Day
            </h1>
            <div className="text-gray-500 text-sm">{formatDate(workout.date)}</div>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-400 hover:text-red-300 p-2 -mr-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Stats overview */}
      <div className="p-4">
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{totalSets}</div>
              <div className="text-gray-500 text-sm">Sets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {formatDuration(workout.duration)}
              </div>
              <div className="text-gray-500 text-sm">Duration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {totalVolume.toLocaleString()}
              </div>
              <div className="text-gray-500 text-sm">Volume (lbs)</div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-3 pt-3 border-t border-gray-700">
            Started at {formatTime(workout.startTime)}
          </div>
        </div>
      </div>

      {/* Exercise breakdown */}
      <main className="flex-1 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-400 mb-3">Exercises</h2>
        <div className="space-y-4">
          {summaryData.map(({ exercise, sets: exerciseSets, totalVolume }) => (
            <div key={exercise.id} className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-white">{exercise.name}</div>
                  <div className="text-gray-500 text-sm">{exerciseSets.length} sets</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">Volume</div>
                  <div className="font-semibold text-white">
                    {totalVolume.toLocaleString()} lbs
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {exerciseSets.map((set, i) => (
                  <div
                    key={i}
                    className="bg-gray-700 rounded-lg px-3 py-1 text-sm"
                  >
                    <span className="text-gray-400">#{set.setNumber}</span>
                    <span className="text-white ml-2">{set.weight} x {set.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-2">Delete Workout?</h3>
            <p className="text-gray-400 mb-6">
              This will permanently delete this workout and all its data.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
