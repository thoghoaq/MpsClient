import { defineStore } from 'pinia'
import { Theme } from './types'
import { Locales } from 'src/locales/locales'

const themeInfo = localStorage.getItem('theme');
const savedTheme = themeInfo ? JSON.parse(themeInfo) : {theme: 'aura-light-indigo', scheme: 'Light'}

export const useSettingStore = defineStore({
  id: 'setting',
  state: () => ({
    currentTheme: savedTheme.theme,
    collection: themeCollection,
    colorSchemes: colorSchemes,
    currentScheme: savedTheme.scheme,
    languages: languages,
  }),
  actions: {
    changeTheme(theme: string, scheme?: string) {
      this.currentTheme = theme
      const themeInfo = {
        theme: theme,
        scheme: scheme ? scheme : this.currentScheme,
      } 
      localStorage.setItem('theme', JSON.stringify(themeInfo))
    },
  },
})

const themeCollection: Theme[] = [
  {
    light: 'aura-light-indigo',
    dark: 'aura-dark-indigo',
    color: 'bg-indigo-500',
  },
  {
    light: 'aura-light-amber',
    dark: 'aura-dark-amber',
    color: 'bg-orange-500',
  },
  {
    light: 'aura-light-blue',
    dark: 'aura-dark-blue',
    color: 'bg-blue-500',
  },
  {
    light: 'aura-light-cyan',
    dark: 'aura-dark-cyan',
    color: 'bg-cyan-500',
  },
  {
    light: 'aura-light-green',
    dark: 'aura-dark-green',
    color: 'bg-green-500',
  },
  {
    light: 'aura-light-lime',
    dark: 'aura-dark-lime',
    color: 'bg-lime-500',
  },
  {
    light: 'aura-light-noir',
    dark: 'aura-dark-noir',
    color: 'bg-noir-500',
  },
  {
    light: 'aura-light-pink',
    dark: 'aura-dark-pink',
    color: 'bg-pink-500',
  },
  {
    light: 'aura-light-purple',
    dark: 'aura-dark-purple',
    color: 'bg-purple-500',
  },
  {
    light: 'aura-light-teal',
    dark: 'aura-dark-teal',
    color: 'bg-teal-500',
  },
]

const languages: string[] = [Locales.VI, Locales.EN]

const colorSchemes: string[] = ['Light', 'Dark']
