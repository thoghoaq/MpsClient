import { Locales } from './locales';

import en from './en.json'
import vi from './vi.json'

export const messages = {
  [Locales.EN]: en,
  [Locales.VI]: vi,
}

export const getMessage = (locale: string) => {
  switch (locale) {
    case 'en':
      return messages.en
    case 'vi':
      return messages.vi
    default:
      return messages.vi
  }
}

export const defaultLocale = Locales.VI
