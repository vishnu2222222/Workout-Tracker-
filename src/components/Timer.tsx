interface TimerProps {
  seconds: number
  size?: 'sm' | 'lg'
  label?: string
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function Timer({ seconds, size = 'lg', label }: TimerProps) {
  const sizeStyles = {
    sm: 'text-lg',
    lg: 'text-6xl font-bold'
  }

  return (
    <div className="text-center">
      {label && <div className="text-gray-400 text-sm mb-1">{label}</div>}
      <div className={`${sizeStyles[size]} tabular-nums`}>
        {formatTime(seconds)}
      </div>
    </div>
  )
}
