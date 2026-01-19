import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutContext } from '../context/WorkoutContext'
import { Button } from '../components/Button'

type FilterType = 'all' | 'push' | 'pull'

export default function HistoryScreen() {
  const navigate = useNavigate()
  const { workouts, historyLoading } = useWorkoutContext()
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredWorkouts = filter === 'all'
    ? workouts
    : workouts.filter(w => w.type === filter)

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
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
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
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
          <h1 className="text-xl font-bold">History</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Filter tabs */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex gap-2">
          <FilterButton
            label="All"
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          <FilterButton
            label="Push"
            active={filter === 'push'}
            onClick={() => setFilter('push')}
            color="amber"
          />
          <FilterButton
            label="Pull"
            active={filter === 'pull'}
            onClick={() => setFilter('pull')}
            color="emerald"
          />
        </div>
      </div>

      {/* Workout list */}
      <main className="flex-1 p-4 overflow-y-auto">
        {historyLoading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : filteredWorkouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No workouts yet</div>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
            >
              Start a Workout
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredWorkouts.map(workout => (
              <button
                key={workout.id}
                onClick={() => navigate(`/history/${workout.id}`)}
                className="w-full bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-750 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`font-semibold text-lg ${
                      workout.type === 'push' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {workout.type.toUpperCase()}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      {formatDate(workout.date)} at {formatTime(workout.startTime)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {formatDuration(workout.duration)}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {workout.completed ? 'Completed' : 'In progress'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="p-4 border-t border-gray-800">
        <div className="flex justify-around">
          <NavButton
            icon={<HomeIcon />}
            label="Home"
            onClick={() => navigate('/')}
          />
          <NavButton
            icon={<HistoryIcon />}
            label="History"
            active
          />
        </div>
      </nav>
    </div>
  )
}

function FilterButton({
  label,
  active,
  onClick,
  color
}: {
  label: string
  active: boolean
  onClick: () => void
  color?: 'amber' | 'emerald'
}) {
  const baseClasses = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors'

  if (active) {
    if (color === 'amber') {
      return (
        <button className={`${baseClasses} bg-amber-500 text-gray-900`} onClick={onClick}>
          {label}
        </button>
      )
    }
    if (color === 'emerald') {
      return (
        <button className={`${baseClasses} bg-emerald-500 text-white`} onClick={onClick}>
          {label}
        </button>
      )
    }
    return (
      <button className={`${baseClasses} bg-blue-600 text-white`} onClick={onClick}>
        {label}
      </button>
    )
  }

  return (
    <button
      className={`${baseClasses} bg-gray-700 text-gray-300 hover:bg-gray-600`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

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
      className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors
        ${active ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
    >
      {icon}
      <span className="text-xs">{label}</span>
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

function HistoryIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
