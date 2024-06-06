import { LOCALES } from "src/locales/locales"

export default class LanguageHelper {
    static getAcceptLanguage = function (code: string) {
        return LOCALES.find(locale => locale.value.toString() == code)?.accept
    }
}