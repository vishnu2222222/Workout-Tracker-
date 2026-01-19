import { useMemo } from 'react'
import { Button } from '../components/Button'
import { getExercises, type Exercise } from '../data/exercises'
import type { Workout, WorkoutSet } from '../data/database'

interface WorkoutSummaryProps {
  workout: Workout
  sets: WorkoutSet[]
  duration: number
  onClose: () => void
}

interface ExerciseSummary {
  exercise: Exercise
  sets: {
    setNumber: number
    weight: number
    reps: number
  }[]
  totalVolume: number
}

export default function WorkoutSummary({ workout, sets, duration, onClose }: WorkoutSummaryProps) {
  const exercises = getExercises(workout.type)

  const summaryData = useMemo(() => {
    const summaries: ExerciseSummary[] = []

    for (const exercise of exercises) {
      const exerciseSets = sets
        .filter(s => s.exerciseId === exercise.id)
        .sort((a, b) => a.setNumber - b.setNumber)
        .map(s => ({
          setNumber: s.setNumber,
          weight: s.weight,
          reps: s.reps
        }))

      const totalVolume = exerciseSets.reduce((sum, s) => sum + s.weight * s.reps, 0)

      if (exerciseSets.length > 0) {
        summaries.push({
          exercise,
          sets: exerciseSets,
          totalVolume
        })
      }
    }

    return summaries
  }, [exercises, sets])

  const totalVolume = summaryData.reduce((sum, s) => sum + s.totalVolume, 0)
  const totalSets = sets.length

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    if (mins < 60) {
      return `${mins} min`
    }
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    return `${hours}h ${remainingMins}m`
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 text-center">
        <div className="text-green-400 text-lg font-semibold">Workout Complete!</div>
        <h1 className={`text-2xl font-bold mt-1 ${
          workout.type === 'push' ? 'text-amber-400' : 'text-emerald-400'
        }`}>
          {workout.type.toUpperCase()} Day
        </h1>
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
              <div className="text-2xl font-bold text-white">{formatDuration(duration)}</div>
              <div className="text-gray-500 text-sm">Duration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalVolume.toLocaleString()}</div>
              <div className="text-gray-500 text-sm">Volume (lbs)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise breakdown */}
      <main className="flex-1 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-400 mb-3">Exercise Breakdown</h2>
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
                  <div className="font-semibold text-white">{totalVolume.toLocaleString()} lbs</div>
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

      {/* Done button */}
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="primary"
          size="lg"
          onClick={onClose}
          className="w-full"
        >
          Done
        </Button>
      </div>
    </div>
  )
}
