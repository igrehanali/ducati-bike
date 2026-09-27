import { useSyncExternalStore } from "react"

/**
 * A tiny external store persisted to localStorage.
 * Server renders use `initial`; the client hydrates from storage on first read
 * and stays in sync across tabs via the `storage` event.
 */
export function createLocalStore<T>(key: string, initial: T) {
  let value = initial
  let hydrated = false
  const listeners = new Set<() => void>()

  function read(): T {
    if (!hydrated && typeof window !== "undefined") {
      hydrated = true
      try {
        const raw = window.localStorage.getItem(key)
        if (raw) value = JSON.parse(raw) as T
      } catch {
        // Unavailable or corrupt storage: keep the initial value.
      }
      window.addEventListener("storage", (event) => {
        if (event.key !== key) return
        try {
          value = event.newValue ? (JSON.parse(event.newValue) as T) : initial
        } catch {
          value = initial
        }
        listeners.forEach((listener) => listener())
      })
    }
    return value
  }

  function set(next: T | ((previous: T) => T)) {
    value = typeof next === "function" ? (next as (previous: T) => T)(read()) : next
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be unavailable (private mode); the in-memory value still works.
    }
    listeners.forEach((listener) => listener())
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  function useValue(): T {
    return useSyncExternalStore(subscribe, read, () => initial)
  }

  return { get: read, set, subscribe, useValue }
}
