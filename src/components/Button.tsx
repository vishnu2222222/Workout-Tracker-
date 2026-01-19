import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'push' | 'pull' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white',
  secondary: 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white',
  push: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-gray-900 font-bold',
  pull: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold',
  success: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white',
  danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
}

const sizeStyles = {
  sm: 'px-3 py-2 text-sm rounded-lg',
  md: 'px-4 py-3 text-base rounded-xl',
  lg: 'px-6 py-4 text-lg rounded-xl',
  xl: 'px-8 py-6 text-2xl rounded-2xl'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        font-semibold
        transition-all duration-150
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
