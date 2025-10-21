import * as React from 'react'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
    }

    return (
      <input
        ref={ref}
        type="checkbox"
        className={`h-5 w-5 rounded border-2 outline-none transition-colors ${className}`}
        checked={!!checked}
        onChange={handleChange}
        {...props}
      />
    )
  }
)

Checkbox.displayName = 'Checkbox'
