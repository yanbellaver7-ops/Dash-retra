'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ThemeContextType {
  dark: boolean
  setDark: (v: boolean) => void
}

const ThemeContext = createContext<ThemeContextType>({ dark: true, setDark: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true)

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <div
        className={dark ? '' : 'light-mode'}
        style={{
          background: dark ? '#000000' : '#f0f0f5',
          color: dark ? '#ffffff' : '#111111',
          minHeight: '100vh',
          transition: 'background 0.3s, color 0.3s',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
