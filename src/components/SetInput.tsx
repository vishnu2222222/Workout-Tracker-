import { useState, useEffect } from 'react'

interface SetInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  unit?: string
}

export function SetInput({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = 999,
  unit
}: SetInputProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString())
    }
  }, [value, isEditing])

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step)
    onChange(newValue)
  }

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    const parsed = parseInt(inputValue, 10)
    if (!isNaN(parsed)) {
      onChange(Math.max(min, Math.min(max, parsed)))
    } else {
      setInputValue(value.toString())
    }
  }

  const handleInputFocus = () => {
    setIsEditing(true)
    setInputValue(value.toString())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-gray-400 text-sm mb-3 font-medium">{label}</div>
      <div className="flex items-center gap-3">
        {/* Frosted glass stepper button - */}
        <button
          onClick={handleDecrement}
          className="stepper-btn"
          disabled={value <= min}
        >
          -
        </button>

        {/* Input with inset shadow */}
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-32 h-[72px] text-white text-center text-4xl font-bold
                       rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50
                       transition-all duration-200"
            style={{
              background: 'linear-gradient(180deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
            }}
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
              {unit}
            </span>
          )}
        </div>

        {/* Frosted glass stepper button + */}
        <button
          onClick={handleIncrement}
          className="stepper-btn"
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  )
}
