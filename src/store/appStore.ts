import { create } from 'zustand'
import type { Tab, Theme } from '../types'

export type UserProfile = {
  displayName: string
  /** Handle without leading @ */
  username: string
  bio: string
  avatarUrl: string
}

const defaultUserProfile: UserProfile = {
  displayName: 'Vincenzo K',
  username: 'VINCENZO_K',
  bio: '',
  avatarUrl:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
}

type AppState = {
  userProfile: UserProfile
  tab: Tab
  theme: Theme
  activeEventId: string | null
  showGigHistory: boolean
  showBuzzPoints: boolean
  showSettings: boolean
  showLanguage: boolean
  showPrivacySafety: boolean
  showFeedback: boolean
  showEmailLogin: boolean
  showEditProfile: boolean
  setTab: (tab: Tab) => void
  setTheme: (theme: Theme) => void
  openEvent: (eventId: string) => void
  closeEvent: () => void
  openGigHistory: () => void
  closeGigHistory: () => void
  openBuzzPoints: () => void
  closeBuzzPoints: () => void
  openSettings: () => void
  closeSettings: () => void
  openLanguage: () => void
  closeLanguage: () => void
  openPrivacySafety: () => void
  closePrivacySafety: () => void
  openFeedback: () => void
  closeFeedback: () => void
  openEmailLogin: () => void
  closeEmailLogin: () => void
  openEditProfile: () => void
  closeEditProfile: () => void
  setUserProfile: (patch: Partial<UserProfile>) => void
}

export const useAppState = create<AppState>((set) => ({
  userProfile: defaultUserProfile,
  tab: 'feed',
  theme: 'dark',
  activeEventId: null,
  showGigHistory: false,
  showBuzzPoints: false,
  showSettings: false,
  showLanguage: false,
  showPrivacySafety: false,
  showFeedback: false,
  showEmailLogin: false,
  showEditProfile: false,
  setTab: (tab) => set({ tab }),
  setTheme: (theme) => set({ theme }),
  openEvent: (eventId) => set({ activeEventId: eventId }),
  closeEvent: () => set({ activeEventId: null }),
  openGigHistory: () => set({ showGigHistory: true }),
  closeGigHistory: () => set({ showGigHistory: false }),
  openBuzzPoints: () => set({ showBuzzPoints: true }),
  closeBuzzPoints: () => set({ showBuzzPoints: false }),
  openSettings: () => set({ showSettings: true }),
  closeSettings: () => set({ showSettings: false }),
  openLanguage: () => set({ showLanguage: true }),
  closeLanguage: () => set({ showLanguage: false }),
  openPrivacySafety: () => set({ showPrivacySafety: true }),
  closePrivacySafety: () => set({ showPrivacySafety: false }),
  openFeedback: () => set({ showFeedback: true }),
  closeFeedback: () => set({ showFeedback: false }),
  openEmailLogin: () => set({ showEmailLogin: true }),
  closeEmailLogin: () => set({ showEmailLogin: false }),
  openEditProfile: () => set({ showEditProfile: true }),
  closeEditProfile: () => set({ showEditProfile: false }),
  setUserProfile: (patch) =>
    set((s) => ({ userProfile: { ...s.userProfile, ...patch } })),
}))
