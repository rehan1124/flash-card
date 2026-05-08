import type { UUID } from '../types'

export const createId = (): UUID => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const shuffle = <T>(input: T[]): T[] => {
  const array = [...input]

  for (let i = array.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const current = array[i]
    array[i] = array[randomIndex]
    array[randomIndex] = current
  }

  return array
}
