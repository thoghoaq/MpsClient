import { Locales } from './locales';

import en from './en.json'
import vi from './vi.json'

export const messages = {
  [Locales.EN]: en,
  [Locales.VI]: vi,
}

export const defaultLocale = Locales.VI
