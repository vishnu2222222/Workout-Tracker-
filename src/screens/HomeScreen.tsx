import { useNavigate } from 'react-router-dom'
import { useWorkoutContext } from '../context/WorkoutContext'
import { Button } from '../components/Button'

function formatRelativeDate(date: Date | null): string {
  if (!date) return 'Never'

  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  return `${Math.floor(diffDays / 7)} weeks ago`
}

export default function HomeScreen() {
  const navigate = useNavigate()
  const { lastPushDate, lastPullDate, startWorkout, historyLoading } = useWorkoutContext()

  const handleStartWorkout = async (type: 'push' | 'pull') => {
    await startWorkout(type)
    navigate(`/workout/${type}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-center">Workout Tracker</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* Workout selection */}
        <section className="flex-1 flex flex-col gap-4">
          <h2 className="text-lg text-gray-400 font-medium">Start Workout</h2>

          <Button
            variant="push"
            size="xl"
            className="w-full flex-1 min-h-[140px] flex flex-col items-center justify-center gap-2"
            onClick={() => handleStartWorkout('push')}
            disabled={historyLoading}
          >
            <span className="text-3xl font-bold">PUSH</span>
            <span className="text-base opacity-80">
              Last: {formatRelativeDate(lastPushDate)}
            </span>
            <span className="text-sm opacity-60">
              Chest, Shoulders, Triceps
            </span>
          </Button>

          <Button
            variant="pull"
            size="xl"
            className="w-full flex-1 min-h-[140px] flex flex-col items-center justify-center gap-2"
            onClick={() => handleStartWorkout('pull')}
            disabled={historyLoading}
          >
            <span className="text-3xl font-bold">PULL</span>
            <span className="text-base opacity-80">
              Last: {formatRelativeDate(lastPullDate)}
            </span>
            <span className="text-sm opacity-60">
              Back, Biceps
            </span>
          </Button>
        </section>

        {/* Quick stats */}
        <section className="bg-gray-800 rounded-2xl p-4">
          <h2 className="text-lg text-gray-400 font-medium mb-3">This Week</h2>
          <div className="flex justify-around">
            <WorkoutStat
              label="Push"
              date={lastPushDate}
            />
            <div className="w-px bg-gray-700" />
            <WorkoutStat
              label="Pull"
              date={lastPullDate}
            />
          </div>
        </section>
      </main>

      {/* Bottom navigation */}
      <nav className="p-4 border-t border-gray-800">
        <div className="flex justify-around">
          <NavButton
            icon={<HomeIcon />}
            label="Home"
            active
          />
          <NavButton
            icon={<HistoryIcon />}
            label="History"
            onClick={() => navigate('/history')}
          />
        </div>
      </nav>
    </div>
  )
}

function WorkoutStat({ label, date }: { label: string; date: Date | null }) {
  const isRecent = date && (new Date().getTime() - new Date(date).getTime()) < 7 * 24 * 60 * 60 * 1000

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={`text-lg font-semibold ${isRecent ? 'text-green-400' : 'text-gray-500'}`}>
        {isRecent ? '\u2713' : '-'}
      </span>
    </div>
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
