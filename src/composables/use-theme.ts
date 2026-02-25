import { computed, ref } from "vue"

export type ThemeMode = "light" | "dark" | "system"

const theme = ref<ThemeMode>("system")
let initialized = false
let mediaListenerBound = false

function applyTheme(mode: ThemeMode) {
  if (typeof window === "undefined") {
    return
  }

  const resolvedMode =
    mode === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : mode

  const root = document.documentElement
  root.classList.toggle("dark", resolvedMode === "dark")
}

function initTheme() {
  if (initialized || typeof window === "undefined") {
    return
  }

  const saved = localStorage.getItem("theme")
  if (saved === "light" || saved === "dark" || saved === "system") {
    theme.value = saved
  } else {
    theme.value = "system"
  }

  if (!mediaListenerBound) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (theme.value === "system") {
        applyTheme("system")
      }
    })
    mediaListenerBound = true
  }

  applyTheme(theme.value)
  initialized = true
}

export function useTheme() {
  initTheme()

  const setTheme = (mode: ThemeMode) => {
    theme.value = mode
    localStorage.setItem("theme", mode)
    applyTheme(mode)
  }

  const toggleTheme = () => {
    const isDark =
      theme.value === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : theme.value === "dark"
    setTheme(isDark ? "light" : "dark")
  }

  return {
    theme: computed(() => theme.value),
    resolvedTheme: computed(() =>
      theme.value === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme.value,
    ),
    setTheme,
    toggleTheme,
  }
}
