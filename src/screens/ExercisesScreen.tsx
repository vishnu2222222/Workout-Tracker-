import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExercises, type CustomizedExercise } from '../hooks/useExercises'
import { getExercisesGroupedByMuscle, type ExerciseTemplate, type WorkoutType } from '../data/exerciseLibrary'
import { Button } from '../components/Button'

type TabType = 'push' | 'pull'

export default function ExercisesScreen() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('push')
  const [editingExercise, setEditingExercise] = useState<{ exercise: CustomizedExercise; index: number } | null>(null)
  const [showPicker, setShowPicker] = useState<{ afterIndex?: number; replaceIndex?: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    exercises,
    isLoading,
    resetToDefault,
    addExercise,
    removeExercise,
    updateExercise,
    reorderExercises
  } = useExercises(activeTab)

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderExercises(index, index - 1)
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < exercises.length - 1) {
      reorderExercises(index, index + 1)
    }
  }

  const handleSelectExercise = async (template: ExerciseTemplate) => {
    if (showPicker?.replaceIndex !== undefined) {
      // Replace existing exercise
      await updateExercise(showPicker.replaceIndex, {
        id: template.id,
        name: template.name,
        sets: template.defaultSets,
        targetReps: template.defaultReps,
        rpe: template.defaultRpe,
        restSeconds: template.defaultRest,
        category: template.category
      })
    } else {
      // Add new exercise
      await addExercise(template.id, showPicker?.afterIndex)
    }
    setShowPicker(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Frosted glass header */}
      <header className="sticky top-0 z-10 glass-header p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Exercises</h1>
          <button
            onClick={() => resetToDefault()}
            className="text-blue-400 text-sm font-medium px-3 py-1.5 rounded-lg
                       hover:bg-blue-500/10 active:bg-blue-500/20 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mt-4">
          <TabButton
            label="Push"
            active={activeTab === 'push'}
            onClick={() => setActiveTab('push')}
            color="amber"
          />
          <TabButton
            label="Pull"
            active={activeTab === 'pull'}
            onClick={() => setActiveTab('pull')}
            color="emerald"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : (
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={`${exercise.id}-${index}`}
                exercise={exercise}
                index={index}
                totalCount={exercises.length}
                onEdit={() => setEditingExercise({ exercise, index })}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
              />
            ))}

            {/* Add Exercise button */}
            <button
              onClick={() => setShowPicker({ afterIndex: exercises.length - 1 })}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-700
                         text-gray-400 font-medium hover:border-gray-600 hover:text-gray-300
                         transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon />
              Add Exercise
            </button>
          </div>
        )}
      </main>

      {/* Frosted glass bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-nav p-4 safe-bottom">
        <div className="flex justify-around">
          <NavButton
            icon={<HomeIcon />}
            label="Home"
            onClick={() => navigate('/')}
          />
          <NavButton
            icon={<DumbbellIcon />}
            label="Exercises"
            active
          />
          <NavButton
            icon={<HistoryIcon />}
            label="History"
            onClick={() => navigate('/history')}
          />
        </div>
      </nav>

      {/* Exercise Editor Modal */}
      {editingExercise && (
        <ExerciseEditorModal
          exercise={editingExercise.exercise}
          onSave={(updates) => {
            updateExercise(editingExercise.index, updates)
            setEditingExercise(null)
          }}
          onDelete={() => {
            removeExercise(editingExercise.index)
            setEditingExercise(null)
          }}
          onChangeExercise={() => {
            setShowPicker({ replaceIndex: editingExercise.index })
            setEditingExercise(null)
          }}
          onClose={() => setEditingExercise(null)}
        />
      )}

      {/* Exercise Picker Modal */}
      {showPicker && (
        <ExercisePickerModal
          workoutType={activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelect={handleSelectExercise}
          onClose={() => {
            setShowPicker(null)
            setSearchQuery('')
          }}
          currentExerciseIds={exercises.map(e => e.id)}
        />
      )}
    </div>
  )
}

// Tab Button Component
function TabButton({
  label,
  active,
  onClick,
  color
}: {
  label: string
  active: boolean
  onClick: () => void
  color: 'amber' | 'emerald'
}) {
  const activeStyles = color === 'amber'
    ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-gray-900 shadow-[0_2px_12px_rgba(245,158,11,0.3)]'
    : 'bg-gradient-to-b from-emerald-400 to-emerald-500 text-white shadow-[0_2px_12px_rgba(16,185,129,0.3)]'

  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-2xl font-semibold transition-all duration-200 ${
        active
          ? activeStyles
          : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60'
      }`}
    >
      {label}
    </button>
  )
}

// Exercise Card Component
function ExerciseCard({
  exercise,
  index,
  totalCount,
  onEdit,
  onMoveUp,
  onMoveDown
}: {
  exercise: CustomizedExercise
  index: number
  totalCount: number
  onEdit: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const formatRestTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (secs === 0) return `${mins}m`
    return `${mins}m ${secs}s`
  }

  return (
    <div className="glass-card flex items-center gap-3">
      {/* Reorder buttons */}
      <div className="flex flex-col gap-1">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     text-gray-400 hover:text-white hover:bg-white/10
                     disabled:opacity-30 disabled:hover:bg-transparent
                     transition-colors"
        >
          <ChevronUpIcon />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === totalCount - 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     text-gray-400 hover:text-white hover:bg-white/10
                     disabled:opacity-30 disabled:hover:bg-transparent
                     transition-colors"
        >
          <ChevronDownIcon />
        </button>
      </div>

      {/* Exercise info */}
      <button
        onClick={onEdit}
        className="flex-1 text-left"
      >
        <div className="font-semibold text-white">{exercise.name}</div>
        <div className="text-sm text-gray-400 mt-1">
          {exercise.sets} sets × {exercise.targetReps} · {formatRestTime(exercise.restSeconds)} rest
        </div>
      </button>

      {/* Edit indicator */}
      <ChevronRightIcon className="text-gray-500" />
    </div>
  )
}

// Exercise Editor Modal
function ExerciseEditorModal({
  exercise,
  onSave,
  onDelete,
  onChangeExercise,
  onClose
}: {
  exercise: CustomizedExercise
  onSave: (updates: Partial<CustomizedExercise>) => void
  onDelete: () => void
  onChangeExercise: () => void
  onClose: () => void
}) {
  const [sets, setSets] = useState(exercise.sets)
  const [targetReps, setTargetReps] = useState(exercise.targetReps)
  const [rpe, setRpe] = useState(exercise.rpe)
  const [restMinutes, setRestMinutes] = useState(Math.floor(exercise.restSeconds / 60))
  const [restSeconds, setRestSeconds] = useState(exercise.restSeconds % 60)

  const handleSave = () => {
    onSave({
      sets,
      targetReps,
      rpe,
      restSeconds: restMinutes * 60 + restSeconds
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gray-900 rounded-t-3xl p-6 pb-8 safe-bottom
                      border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{exercise.name}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center
                       hover:bg-gray-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Change Exercise button */}
        <button
          onClick={onChangeExercise}
          className="w-full py-3 mb-6 rounded-xl border border-blue-500/50 text-blue-400
                     font-medium hover:bg-blue-500/10 transition-colors"
        >
          Change Exercise
        </button>

        {/* Form fields */}
        <div className="space-y-5">
          {/* Sets */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-medium">Sets</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSets(Math.max(1, sets - 1))}
                className="w-10 h-10 rounded-xl bg-gray-800 text-xl font-bold
                           hover:bg-gray-700 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-xl font-bold">{sets}</span>
              <button
                onClick={() => setSets(Math.min(10, sets + 1))}
                className="w-10 h-10 rounded-xl bg-gray-800 text-xl font-bold
                           hover:bg-gray-700 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Target Reps */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-medium">Target Reps</span>
            <input
              type="text"
              value={targetReps}
              onChange={(e) => setTargetReps(e.target.value)}
              className="w-24 py-2 px-3 rounded-xl bg-gray-800 text-center text-lg font-semibold
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* RPE */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-medium">RPE</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRpe(Math.max(5, rpe - 0.5))}
                className="w-10 h-10 rounded-xl bg-gray-800 text-xl font-bold
                           hover:bg-gray-700 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-xl font-bold">{rpe}</span>
              <button
                onClick={() => setRpe(Math.min(10, rpe + 0.5))}
                className="w-10 h-10 rounded-xl bg-gray-800 text-xl font-bold
                           hover:bg-gray-700 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Rest Time */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-medium">Rest Time</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={restMinutes}
                onChange={(e) => setRestMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-14 py-2 px-2 rounded-xl bg-gray-800 text-center text-lg font-semibold
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <span className="text-gray-400">m</span>
              <input
                type="number"
                value={restSeconds}
                onChange={(e) => setRestSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-14 py-2 px-2 rounded-xl bg-gray-800 text-center text-lg font-semibold
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <span className="text-gray-400">s</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            variant="danger"
            size="lg"
            onClick={onDelete}
            className="flex-1"
          >
            Delete
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            className="flex-1"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

// Exercise Picker Modal
function ExercisePickerModal({
  workoutType,
  searchQuery,
  onSearchChange,
  onSelect,
  onClose,
  currentExerciseIds
}: {
  workoutType: WorkoutType
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelect: (exercise: ExerciseTemplate) => void
  onClose: () => void
  currentExerciseIds: string[]
}) {
  const groupedExercises = getExercisesGroupedByMuscle(workoutType)

  const filteredGroups = Object.entries(groupedExercises).reduce((acc, [group, exercises]) => {
    const filtered = exercises.filter(e =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.muscleGroups.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    if (filtered.length > 0) {
      acc[group] = filtered
    }
    return acc
  }, {} as Record<string, ExerciseTemplate[]>)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
      {/* Header */}
      <header className="glass-header p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center
                       hover:bg-gray-700 transition-colors"
          >
            <CloseIcon />
          </button>
          <h2 className="text-xl font-bold">Choose Exercise</h2>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-3 pl-12 pr-4 rounded-xl bg-gray-800 text-white
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </header>

      {/* Exercise list */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(filteredGroups).map(([group, exercises]) => (
          <div key={group}>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {group}
            </h3>
            <div className="space-y-2">
              {exercises.map(exercise => {
                const isAlreadyAdded = currentExerciseIds.includes(exercise.id)
                return (
                  <button
                    key={exercise.id}
                    onClick={() => onSelect(exercise)}
                    className={`w-full p-4 rounded-2xl text-left transition-colors ${
                      isAlreadyAdded
                        ? 'bg-blue-500/10 border border-blue-500/30'
                        : 'bg-gray-800/60 hover:bg-gray-700/60'
                    }`}
                  >
                    <div className="font-semibold text-white">{exercise.name}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {exercise.defaultSets} sets × {exercise.defaultReps}
                      {isAlreadyAdded && (
                        <span className="ml-2 text-blue-400">• In routine</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

// Icons
function NavButton({
  icon,
  label,
  active = false,
  onClick
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-200
        ${active
          ? 'text-blue-400'
          : 'text-gray-500 hover:text-gray-300 active:scale-95'
        }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

function HomeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function DumbbellIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 10h2v4H4a1 1 0 01-1-1v-2a1 1 0 011-1zm16 0h-2v4h2a1 1 0 001-1v-2a1 1 0 00-1-1zM6 8h2v8H6a1 1 0 01-1-1V9a1 1 0 011-1zm12 0h-2v8h2a1 1 0 001-1V9a1 1 0 00-1-1zM8 11h8v2H8z" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ChevronRightIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}
