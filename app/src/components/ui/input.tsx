import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`h-10 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-colors focus:ring-2 ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
