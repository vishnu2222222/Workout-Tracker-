interface ProgressBadgeProps {
  current: number
  previous?: number
  unit?: string
  label?: string
}

export function ProgressBadge({ current, previous, unit = 'lbs', label }: ProgressBadgeProps) {
  if (previous === undefined) {
    return null
  }

  const diff = current - previous
  const indicator = diff > 0 ? '\u2191' : diff < 0 ? '\u2193' : '='
  const color = diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-gray-400'

  return (
    <div className="flex items-center gap-2 text-sm">
      {label && <span className="text-gray-500">{label}:</span>}
      <span className="text-gray-400">
        {previous} {unit}
      </span>
      <span className={`font-bold ${color}`}>{indicator}</span>
    </div>
  )
}

interface SetProgressDotsProps {
  total: number
  completed: number
  current: number
}

export function SetProgressDots({ total, completed, current }: SetProgressDotsProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const setNum = i + 1
        let status: 'completed' | 'current' | 'pending'
        if (setNum <= completed) {
          status = 'completed'
        } else if (setNum === current) {
          status = 'current'
        } else {
          status = 'pending'
        }

        return (
          <div
            key={i}
            className={`
              w-3 h-3 rounded-full transition-all
              ${status === 'completed' ? 'bg-green-500' : ''}
              ${status === 'current' ? 'bg-blue-500 ring-2 ring-blue-300' : ''}
              ${status === 'pending' ? 'bg-gray-600' : ''}
            `}
          />
        )
      })}
    </div>
  )
}

interface WorkoutProgressBarProps {
  completed: number
  total: number
}

export function WorkoutProgressBar({ completed, total }: WorkoutProgressBarProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>{completed} / {total} sets</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
