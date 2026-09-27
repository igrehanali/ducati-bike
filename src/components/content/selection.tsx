"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

/* Lets a "Book" button elsewhere on the page preselect an option in a booking form and scroll to it. */

type Selection = { value: string; setValue: (value: string) => void }

const SelectionContext = createContext<Selection | null>(null)

export function SelectionProvider({ initial = "", children }: { initial?: string; children: ReactNode }) {
  const [value, setValue] = useState(initial)
  return <SelectionContext.Provider value={{ value, setValue }}>{children}</SelectionContext.Provider>
}

export function useSelection() {
  const context = useContext(SelectionContext)
  if (!context) throw new Error("useSelection must be used within <SelectionProvider>")
  return context
}

export function SelectAndScrollButton({
  value,
  target,
  focusId,
  children,
  className,
  disabled,
  label,
}: {
  value: string
  /** id of the element to scroll to */
  target: string
  /** id of the control to focus once scrolled */
  focusId?: string
  children: ReactNode
  className?: string
  disabled?: boolean
  label?: string
}) {
  const { setValue } = useSelection()

  function select() {
    setValue(value)
    const element = document.getElementById(target)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    element?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
    if (focusId) window.setTimeout(() => document.getElementById(focusId)?.focus({ preventScroll: true }), reduce ? 0 : 450)
  }

  return (
    <button type="button" onClick={select} disabled={disabled} aria-label={label} className={cn(className)}>
      {children}
    </button>
  )
}
