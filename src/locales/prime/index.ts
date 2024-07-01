import en from './en.json'
import vi from './vi.json'

export const primeLocales = {
  en: en,
  vi: vi,
}

export const getLocale = (locale: string) => {
  switch (locale) {
    case 'en':
      return primeLocales.en
    case 'vi':
      return primeLocales.vi
    default:
      return primeLocales.vi
  }
}
