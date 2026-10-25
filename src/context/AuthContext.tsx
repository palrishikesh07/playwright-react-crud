import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '../types'

interface AuthContextValue {
  user: Omit<User, 'password'> | null
  register: (name: string, email: string, password: string) => { ok: boolean; message: string }
  login: (email: string, password: string) => { ok: boolean; message: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const USERS_KEY = 'shopease_users'
const SESSION_KEY = 'shopease_session'

function readUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[]
  } catch {
    return []
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') as Omit<User, 'password'> | null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  }, [user])

  const value = useMemo<Omit<AuthContextValue, 'user'>>(() => ({
    register(name, email, password) {
      const normalizedEmail = email.trim().toLowerCase()
      if (name.trim().length < 2) return { ok: false, message: 'Name must be at least 2 characters.' }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return { ok: false, message: 'Enter a valid email address.' }
      if (password.length < 8) return { ok: false, message: 'Password must be at least 8 characters.' }
      const users = readUsers()
      if (users.some((item) => item.email === normalizedEmail)) return { ok: false, message: 'An account with this email already exists.' }
      users.push({ name: name.trim(), email: normalizedEmail, password })
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
      setUser({ name: name.trim(), email: normalizedEmail })
      return { ok: true, message: 'Account created successfully.' }
    },
    login(email, password) {
      const normalizedEmail = email.trim().toLowerCase()
      const found = readUsers().find((item) => item.email === normalizedEmail && item.password === password)
      if (!found) return { ok: false, message: 'Email or password is incorrect.' }
      setUser({ name: found.name, email: found.email })
      return { ok: true, message: 'Welcome back!' }
    },
    logout() {
      setUser(null)
    },
  }), [])

  return <AuthContext.Provider value={{ ...value, user }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}