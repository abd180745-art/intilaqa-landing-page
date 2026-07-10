"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "@phosphor-icons/react"

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setDark(isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
      className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-sm transition-all duration-300 hover:scale-[1.05] hover:text-foreground"
    >
      {dark ? <Sun size={20} weight="duotone" /> : <Moon size={20} weight="duotone" />}
    </button>
  )
}
