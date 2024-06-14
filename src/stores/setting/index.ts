import { defineStore } from 'pinia'
import { Language, Theme } from './types'
import axios from 'axios'
import LanguageHelper from 'src/helpers/language-helper'
import { appConfig } from '..'

const themeInfo = localStorage.getItem('theme')
const savedTheme = themeInfo
  ? JSON.parse(themeInfo)
  : { theme: 'aura-light-indigo', scheme: 'Light' }

const savedScale = localStorage.getItem('scale') ? parseInt(localStorage.getItem('scale')!) : 14;
document.documentElement.style.fontSize = savedScale + 'px';

export const useSettingStore = defineStore({
  id: 'setting',
  state: () => ({
    currentTheme: savedTheme.theme,
    collection: themeCollection,
    colorSchemes: colorSchemes,
    currentScheme: savedTheme.scheme,
    dark: savedTheme.scheme == 'Dark',
    scale: savedScale,
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
    changeLanguage(language: string) {
      var accept = LanguageHelper.getAcceptLanguage(language)?.toString() ?? 'vi-VN';
      localStorage.setItem('language', language);
      axios.defaults.headers.common['Accept-Language'] = accept;
      appConfig.language = accept;
    },
    changeScale(scale: number) {
      document.documentElement.style.fontSize = scale + 'px';
      localStorage.setItem('scale', scale.toString());
    }
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

const colorSchemes: string[] = ['Light', 'Dark']
