import { ref } from 'vue'
import { formatDateKey } from '~/composables/dateHelpers'

// Sharing state is stored as a JSON array of YYYY-MM-DD strings in localStorage.
// Module-level ref so state is shared across all component instances.
const STORAGE_KEY = 'isf-shared-actions'
const sharedKeys = ref<Set<string>>(new Set())
let initialized = false

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const keys: string[] = raw ? JSON.parse(raw) : []
    sharedKeys.value = new Set(keys)
  }
  catch {
    sharedKeys.value = new Set()
  }
  initialized = true
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...sharedKeys.value]))
  }
  catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

export function useActionSharing() {
  if (!initialized && typeof localStorage !== 'undefined') {
    load()
  }

  const isShared = (date: Date): boolean =>
    sharedKeys.value.has(formatDateKey(date))

  const markShared = (date: Date) => {
    const key = formatDateKey(date)
    if (!sharedKeys.value.has(key)) {
      sharedKeys.value.add(key)
      sharedKeys.value = new Set(sharedKeys.value)
      save()
    }
  }

  const toggleShared = (date: Date) => {
    const key = formatDateKey(date)
    if (sharedKeys.value.has(key)) {
      sharedKeys.value.delete(key)
    }
    else {
      sharedKeys.value.add(key)
    }
    sharedKeys.value = new Set(sharedKeys.value)
    save()
  }

  return { sharedKeys, isShared, markShared, toggleShared }
}
