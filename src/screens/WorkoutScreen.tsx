import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkoutContext } from '../context/WorkoutContext'
import { useTimer } from '../hooks/useTimer'
import { Button } from '../components/Button'
import { SetInput } from '../components/SetInput'
import { Timer } from '../components/Timer'
import { WorkoutProgressBar, SetProgressDots } from '../components/ProgressBadge'
import { formatWarmupDisplay } from '../data/exercises'
import WorkoutSummary from './WorkoutSummary'

type WorkoutPhase = 'warmup' | 'working' | 'rest' | 'complete'

export default function WorkoutScreen() {
  const navigate = useNavigate()
  const { type } = useParams<{ type: 'push' | 'pull' }>()
  const {
    workout,
    currentSet,
    completedSetsCount,
    totalSets,
    isWorkoutComplete,
    workoutDuration,
    allSets,
    completeSet,
    setWeight,
    setReps,
    refreshHistory
  } = useWorkoutContext()

  const [phase, setPhase] = useState<WorkoutPhase>('warmup')
  const [warmupSetIndex, setWarmupSetIndex] = useState(0)
  const [showingWarmup, setShowingWarmup] = useState(true)
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null)

  const handleRestComplete = useCallback(() => {
    setPhase('warmup')
    setShowingWarmup(true)
    setWarmupSetIndex(0)
  }, [])

  const timer = useTimer(handleRestComplete)

  // Redirect if no workout
  useEffect(() => {
    if (!workout && type) {
      navigate('/')
    }
  }, [workout, type, navigate])

  // Handle workout completion
  useEffect(() => {
    if (isWorkoutComplete) {
      setPhase('complete')
      refreshHistory()
    }
  }, [isWorkoutComplete, refreshHistory])

  // Reset warmup when exercise changes
  useEffect(() => {
    if (currentSet?.exercise.id !== currentExerciseId) {
      setCurrentExerciseId(currentSet?.exercise.id || null)
      setShowingWarmup(true)
      setWarmupSetIndex(0)
      if (phase !== 'rest' && phase !== 'complete') {
        setPhase('warmup')
      }
    }
  }, [currentSet?.exercise.id, currentExerciseId, phase])

  if (!workout || !currentSet) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <WorkoutSummary
        workout={workout}
        sets={allSets}
        duration={workoutDuration}
        onClose={() => navigate('/')}
      />
    )
  }

  const handleCompleteSet = async () => {
    await completeSet(currentSet.weight, currentSet.reps)
    setPhase('rest')
    timer.start(currentSet.exercise.restSeconds)
  }

  const handleSkipRest = () => {
    timer.skip()
  }

  const handleSkipWarmup = () => {
    setShowingWarmup(false)
    setPhase('working')
  }

  const handleNextWarmupSet = () => {
    const warmups = getWarmupSets()
    if (warmupSetIndex < warmups.length - 1) {
      setWarmupSetIndex(prev => prev + 1)
    } else {
      setShowingWarmup(false)
      setPhase('working')
    }
  }

  const getWarmupSets = () => {
    if (!currentSet.lastSession) return []
    const weight = currentSet.lastSession.weight
    if (weight === 0) return []

    const category = currentSet.exercise.category
    const warmupText = formatWarmupDisplay(weight, category)
    return warmupText.split(', ')
  }

  const warmupSets = getWarmupSets()
  const showWarmupPhase = showingWarmup && warmupSets.length > 0 && currentSet.setNumber === 1

  // Format workout duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white p-2 -ml-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <div className={`text-sm font-semibold uppercase ${
              workout.type === 'push' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {workout.type} Day
            </div>
            <div className="text-gray-500 text-xs">{formatDuration(workoutDuration)}</div>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-4 py-2 bg-gray-850">
        <WorkoutProgressBar completed={completedSetsCount} total={totalSets} />
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 flex flex-col">
        {phase === 'rest' ? (
          <RestTimerView
            timeRemaining={timer.timeRemaining}
            nextExercise={currentSet.exercise.name}
            nextSetNumber={currentSet.setNumber}
            onSkip={handleSkipRest}
          />
        ) : showWarmupPhase ? (
          <WarmupView
            exerciseName={currentSet.exercise.name}
            warmupSets={warmupSets}
            currentIndex={warmupSetIndex}
            onNext={handleNextWarmupSet}
            onSkip={handleSkipWarmup}
          />
        ) : (
          <WorkingSetView
            currentSet={currentSet}
            onComplete={handleCompleteSet}
            onWeightChange={setWeight}
            onRepsChange={setReps}
          />
        )}
      </main>
    </div>
  )
}

interface RestTimerViewProps {
  timeRemaining: number
  nextExercise: string
  nextSetNumber: number
  onSkip: () => void
}

function RestTimerView({ timeRemaining, nextExercise, nextSetNumber, onSkip }: RestTimerViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8">
      <div className="text-gray-400 text-lg">Rest</div>

      <Timer seconds={timeRemaining} size="lg" />

      <div className="text-center text-gray-500">
        <div className="text-sm">Next up:</div>
        <div className="text-white font-medium">{nextExercise}</div>
        <div className="text-sm">Set {nextSetNumber}</div>
      </div>

      <Button
        variant="secondary"
        size="lg"
        onClick={onSkip}
        className="min-w-[200px]"
      >
        Skip Rest
      </Button>
    </div>
  )
}

interface WarmupViewProps {
  exerciseName: string
  warmupSets: string[]
  currentIndex: number
  onNext: () => void
  onSkip: () => void
}

function WarmupView({ exerciseName, warmupSets, currentIndex, onNext, onSkip }: WarmupViewProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">{exerciseName}</h2>
        <div className="text-blue-400 text-lg mt-1">Warm-up</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
          <div className="text-gray-400 text-sm mb-2 text-center">
            Warm-up {currentIndex + 1} of {warmupSets.length}
          </div>
          <div className="text-3xl font-bold text-center text-white">
            {warmupSets[currentIndex]}
          </div>
        </div>

        {/* Warm-up progress dots */}
        <div className="flex gap-2">
          {warmupSets.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < currentIndex ? 'bg-blue-500' :
                i === currentIndex ? 'bg-blue-400 ring-2 ring-blue-300' :
                'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="text-gray-500 text-sm text-center px-4">
          Warm-up sets are not logged. Tap through or skip to working sets.
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          variant="secondary"
          size="lg"
          onClick={onSkip}
          className="flex-1"
        >
          Skip All
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          className="flex-1"
        >
          {currentIndex < warmupSets.length - 1 ? 'Next' : 'Start Working Sets'}
        </Button>
      </div>
    </div>
  )
}

interface WorkingSetViewProps {
  currentSet: {
    exercise: {
      id: string
      name: string
      sets: number
      targetReps: string
      rpe: number
    }
    setNumber: number
    weight: number
    reps: number
    lastSession?: { weight: number; reps: number }
  }
  onComplete: () => void
  onWeightChange: (weight: number) => void
  onRepsChange: (reps: number) => void
}

function WorkingSetView({ currentSet, onComplete, onWeightChange, onRepsChange }: WorkingSetViewProps) {
  const { exercise, setNumber, weight, reps, lastSession } = currentSet
  const completedSets = setNumber - 1

  return (
    <div className="flex-1 flex flex-col">
      {/* Exercise info */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
        <div className="text-gray-400 mt-1">
          Set {setNumber} of {exercise.sets}
        </div>
        <div className="flex justify-center mt-2">
          <SetProgressDots
            total={exercise.sets}
            completed={completedSets}
            current={setNumber}
          />
        </div>
      </div>

      {/* Target info */}
      <div className="bg-gray-800 rounded-xl p-4 mb-4">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-gray-500 text-xs">Target Reps</div>
            <div className="text-white font-semibold">{exercise.targetReps}</div>
          </div>
          <div className="w-px bg-gray-700" />
          <div>
            <div className="text-gray-500 text-xs">RPE</div>
            <div className="text-white font-semibold">{exercise.rpe}</div>
          </div>
        </div>
      </div>

      {/* Last session reference */}
      {lastSession && lastSession.weight > 0 && (
        <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-4 mb-6 text-center">
          <div className="text-blue-400 text-sm mb-1">Last time</div>
          <div className="text-xl font-bold text-white">
            {lastSession.weight} lbs x {lastSession.reps} reps
          </div>
        </div>
      )}

      {/* Weight and Reps inputs */}
      <div className="flex-1 flex flex-col justify-center gap-8">
        <SetInput
          label="Weight"
          value={weight}
          onChange={onWeightChange}
          step={5}
          unit="lbs"
        />

        <SetInput
          label="Reps"
          value={reps}
          onChange={onRepsChange}
          step={1}
          min={0}
          max={50}
        />
      </div>

      {/* Complete button */}
      <Button
        variant="success"
        size="xl"
        onClick={onComplete}
        className="w-full mt-6"
        disabled={weight === 0}
      >
        COMPLETE SET
      </Button>
    </div>
  )
}
