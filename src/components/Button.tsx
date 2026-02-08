import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'push' | 'pull' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const variantStyles = {
  primary: `
    bg-gradient-to-b from-blue-500 to-blue-600 text-white
    shadow-[0_2px_12px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]
    hover:from-blue-400 hover:to-blue-500
    active:from-blue-600 active:to-blue-700
  `,
  secondary: `
    bg-gradient-to-b from-gray-600/90 to-gray-700/90 text-white
    backdrop-blur-md
    shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
    hover:from-gray-500/90 hover:to-gray-600/90
    active:from-gray-700/90 active:to-gray-800/90
  `,
  push: `
    bg-gradient-to-b from-amber-400 to-amber-500 text-gray-900 font-bold
    shadow-[0_2px_16px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]
    hover:from-amber-300 hover:to-amber-400
    active:from-amber-500 active:to-amber-600
  `,
  pull: `
    bg-gradient-to-b from-emerald-400 to-emerald-500 text-white font-bold
    shadow-[0_2px_16px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]
    hover:from-emerald-300 hover:to-emerald-400
    active:from-emerald-500 active:to-emerald-600
  `,
  success: `
    bg-gradient-to-b from-green-500 to-green-600 text-white
    shadow-[0_2px_12px_rgba(34,197,94,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]
    hover:from-green-400 hover:to-green-500
    active:from-green-600 active:to-green-700
  `,
  danger: `
    bg-gradient-to-b from-red-500 to-red-600 text-white
    shadow-[0_2px_12px_rgba(239,68,68,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]
    hover:from-red-400 hover:to-red-500
    active:from-red-600 active:to-red-700
  `
}

const sizeStyles = {
  sm: 'px-4 py-2.5 text-sm rounded-xl',
  md: 'px-5 py-3.5 text-base rounded-2xl',
  lg: 'px-6 py-4 text-lg rounded-2xl',
  xl: 'px-8 py-6 text-2xl rounded-3xl'
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
        transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
