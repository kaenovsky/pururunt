'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({ theme: 'light', toggleTheme: () => {} })

export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // 1. Buscamos si el usuario YA eligió algo manualmente antes
    const savedTheme = localStorage.getItem('theme') as Theme
    
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      // 2. Si es la PRIMERA VEZ que entra (no hay nada guardado):
      // Forzamos 'light' explícitamente, ignorando la preferencia del sistema por ahora
      setTheme('light')
      document.documentElement.classList.remove('dark')
      
      // Opcional: Si quisieras respetar el sistema, usarías matchMedia aquí.
      // Pero como tu requisito es "Default Light", lo dejamos así.
    }
  }, [])

//   useEffect(() => {
//     setMounted(true)
//     // Chequear preferencia guardada o del sistema
//     const savedTheme = localStorage.getItem('theme') as Theme
//     if (savedTheme) {
//       setTheme(savedTheme)
//       if (savedTheme === 'dark') document.documentElement.classList.add('dark')
//     } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       // Opcional: si quieres respetar el sistema, descomenta esto.
//       // Por ahora forzamos light por defecto como pediste.
//       setTheme('light')
//     }
//   }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Evitar flash de contenido incorrecto
  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}