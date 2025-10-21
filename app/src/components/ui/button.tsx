import * as React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  size?: 'default' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const base = 'inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed'
    const variants: Record<string, string> = {
      default: 'bg-blue-700 text-white hover:bg-yellow-400 hover:text-blue-800',
      outline: 'border bg-white text-blue-800 hover:bg-blue-100',
    }
    const sizes: Record<string, string> = {
      default: 'h-10 px-4',
      icon: 'h-10 w-10 p-0 justify-center',
    }

    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
    )
  }
)

Button.displayName = 'Button'
