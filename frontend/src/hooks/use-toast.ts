import { useEffect, useState } from 'react'

interface Toast {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

let toastQueue: Toast[] = []
let listeners: Array<(toast: Toast) => void> = []

export function useToast() {
  const [, forceUpdate] = useState({})

  useEffect(() => {
    const listener = () => forceUpdate({})
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return {
    toast: (options: Toast) => {
      // Simple console implementation for now
      const prefix = options.variant === 'destructive' ? '❌' : '✅'
      console.log(`${prefix} ${options.title}${options.description ? ': ' + options.description : ''}`)
      
      toastQueue.push(options)
      listeners.forEach((listener) => listener(options))
      
      // Auto-clear after 3 seconds
      setTimeout(() => {
        toastQueue = toastQueue.filter((t) => t !== options)
        listeners.forEach((listener) => listener(options))
      }, 3000)
    },
    toasts: toastQueue,
  }
}
// Simple toast hook - logs to console for now, can be upgraded to UI toasts later
