import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MockUser {
  name: string
  email: string
  avatar: string
  memberSince: string
  phone: string
  newsletter: boolean
}

interface DemoCredential {
  name: string
  email: string
  salt: string
  verifier: string
  memberSince: string
}

interface AuthState {
  isAuthenticated: boolean
  user: MockUser | null
  credentials: Record<string, DemoCredential>
  loginOpen: boolean
  setLoginOpen: (open: boolean) => void
  registerAccount: (name: string, email: string, password: string) => Promise<boolean>
  authenticate: (email: string, password: string) => Promise<boolean>
  updateUser: (updates: Partial<MockUser>) => void
  logOut: () => void
  deleteAccount: () => void
}

const ITERATIONS = 210_000

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function deriveVerifier(password: string, salt: Uint8Array<ArrayBuffer>): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS },
    key,
    256,
  )
  return toHex(new Uint8Array(bits))
}

function createMockUser(name: string, email: string, memberSince = new Date().toISOString()): MockUser {
  const displayName = name.trim() || email.split('@')[0] || 'Serein Guest'
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .replace(/[^A-Z0-9]/g, '')
  const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#d7c1a1"/><text x="48" y="54" dominant-baseline="middle" text-anchor="middle" fill="#282521" font-family="sans-serif" font-size="32">${initials}</text></svg>`
  return {
    name: displayName,
    email,
    avatar: `data:image/svg+xml,${encodeURIComponent(avatarSvg)}`,
    memberSince,
    phone: '',
    newsletter: false,
  }
}

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      credentials: {},
      loginOpen: false,
      setLoginOpen: (loginOpen) => set({ loginOpen }),
      registerAccount: async (name, email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        if (get().credentials[normalizedEmail]) return false
        const salt = crypto.getRandomValues(new Uint8Array(new ArrayBuffer(16)))
        const memberSince = new Date().toISOString()
        const credential: DemoCredential = {
          name: name.trim(),
          email: normalizedEmail,
          salt: toHex(salt),
          verifier: await deriveVerifier(password, salt),
          memberSince,
        }
        set((state) => ({
          credentials: { ...state.credentials, [normalizedEmail]: credential },
        }))
        return true
      },
      authenticate: async (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        const credential = get().credentials[normalizedEmail]
        if (!credential) return false
        const salt = new Uint8Array(new ArrayBuffer(credential.salt.length / 2))
        for (let index = 0; index < salt.length; index += 1) {
          salt[index] = Number.parseInt(credential.salt.slice(index * 2, index * 2 + 2), 16)
        }
        const verifier = await deriveVerifier(password, salt)
        if (verifier !== credential.verifier) return false
        set({
          isAuthenticated: true,
          user: createMockUser(credential.name, credential.email, credential.memberSince),
          loginOpen: false,
        })
        return true
      },
      updateUser: (updates) =>
        set((state) => {
          if (!state.user) return {}
          const user = { ...state.user, ...updates }
          const credentials = { ...state.credentials }
          const previousEmail = state.user.email.toLowerCase()
          const nextEmail = user.email.toLowerCase()
          const credential = credentials[previousEmail]
          if (credential) {
            delete credentials[previousEmail]
            credentials[nextEmail] = { ...credential, name: user.name, email: nextEmail }
          }
          return { user, credentials }
        }),
      logOut: () => set({ isAuthenticated: false, user: null, loginOpen: false }),
      deleteAccount: () =>
        set((state) => {
          const credentials = { ...state.credentials }
          if (state.user) delete credentials[state.user.email.toLowerCase()]
          return { credentials, isAuthenticated: false, user: null, loginOpen: false }
        }),
    }),
    {
      name: 'serein-auth',
      partialize: ({ isAuthenticated, user, credentials }) => ({
        isAuthenticated,
        user,
        credentials,
      }),
    },
  ),
)
