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
    <div className="min-h-screen flex flex-col">
      {/* Frosted glass header */}
      <header className="sticky top-0 z-10 glass-header p-4">
        <h1 className="text-xl font-bold text-center">History</h1>

        {/* Pill-style filter tabs */}
        <div className="flex gap-2 mt-4">
          <FilterPill
            label="All"
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          <FilterPill
            label="Push"
            active={filter === 'push'}
            onClick={() => setFilter('push')}
            color="amber"
          />
          <FilterPill
            label="Pull"
            active={filter === 'pull'}
            onClick={() => setFilter('pull')}
            color="emerald"
          />
        </div>
      </header>

      {/* Workout list */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
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
                className="w-full glass-card text-left hover:bg-white/[0.06] transition-colors"
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
            onClick={() => navigate('/exercises')}
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

function FilterPill({
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
  let activeStyles = 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_2px_12px_rgba(59,130,246,0.3)]'

  if (active && color === 'amber') {
    activeStyles = 'bg-gradient-to-b from-amber-400 to-amber-500 text-gray-900 shadow-[0_2px_12px_rgba(245,158,11,0.3)]'
  } else if (active && color === 'emerald') {
    activeStyles = 'bg-gradient-to-b from-emerald-400 to-emerald-500 text-white shadow-[0_2px_12px_rgba(16,185,129,0.3)]'
  }

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
        active
          ? activeStyles
          : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60'
      }`}
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
