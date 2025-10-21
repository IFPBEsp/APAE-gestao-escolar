import * as React from 'react'

type SelectContextType = {
  value?: string
  setValue: (v?: string) => void
  registerItem: (item: { value: string; label: string }) => void
  items: { value: string; label: string }[]
  onValueChange?: (v: string) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

export function Select({ value, onValueChange, children }: {
  value?: string
  onValueChange?: (v: string) => void
  children: React.ReactNode
}) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(value)
  const [items, setItems] = React.useState<{ value: string; label: string }[]>([])

  React.useEffect(() => {
    setInternalValue(value)
  }, [value])

  const setValue = (v?: string) => {
    setInternalValue(v)
    onValueChange?.(v ?? '')
  }

  const registerItem = React.useCallback((item: { value: string; label: string }) => {
    setItems((prev) => (prev.some((i) => i.value === item.value) ? prev : [...prev, item]))
  }, [])

  return (
    <SelectContext.Provider value={{ value: internalValue, setValue, registerItem, items, onValueChange }}>
      {children}
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ id, className, children }: React.HTMLAttributes<HTMLDivElement> & { id?: string }) {
  const ctx = React.useContext(SelectContext)
  if (!ctx) return null

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    ctx.setValue(e.target.value)
  }

  return (
    <div id={id} className={className}>
      <select className="w-full bg-white outline-none" value={ctx.value} onChange={handleChange}>
        {!ctx.value && <option value="" disabled hidden></option>}
        {ctx.items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {children}
    </div>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  // No-op visual component in this minimal implementation
  return null
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  // No-op container just to mount items via context
  return <>{children}</>
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(SelectContext)
  React.useEffect(() => {
    if (ctx) {
      ctx.registerItem({ value, label: String(children) })
    }
  }, [ctx, value, children])
  // No visible output; items are rendered by SelectTrigger as native options
  return null
}
