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
      <div className="text-gray-400 text-sm mb-2">{label}</div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrement}
          className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-gray-500
                     rounded-xl text-2xl font-bold transition-colors active:scale-95"
          disabled={value <= min}
        >
          -
        </button>
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
            className="w-28 h-16 bg-gray-800 text-white text-center text-3xl font-bold
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500
                       border-2 border-gray-700"
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              {unit}
            </span>
          )}
        </div>
        <button
          onClick={handleIncrement}
          className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-gray-500
                     rounded-xl text-2xl font-bold transition-colors active:scale-95"
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  )
}
