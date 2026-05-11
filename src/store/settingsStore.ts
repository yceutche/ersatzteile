import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings, Language, PageSize } from '../types'

interface SettingsState extends AppSettings {
  setLanguage: (lang: Language) => void
  setPageSize: (size: PageSize) => void
  setTractorField: (field: keyof AppSettings['tractor'], value: string) => void
}

const defaultSettings: AppSettings = {
  version: 1,
  language: 'de',
  pageSize: 20,
  tractor: {
    model: 'MF 1014',
    engineNumber: '',
    chassisNumber: '',
    tyreRear: '',
    tyreFront: '',
  }
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setLanguage: (language) => set({ language }),

      setPageSize: (pageSize) => set({ pageSize }),

      setTractorField: (field, value) =>
        set(state => ({
          tractor: { ...state.tractor, [field]: value.slice(0, 100) }
        })),
    }),
    {
      name: 'mf1014_settings',
      version: 1,
    }
  )
)
