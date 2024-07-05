export default class StringHelper {
  static getNameChar = (str: string): string => {
    var words = str.split(' ')
    return words[words.length - 1].trim().charAt(0)
  }

  static searchIgnoreCase(text: string, pattern: string): boolean {
    const normalizedText = this.removeDiacritics(text)
    const normalizedPattern = this.removeDiacritics(pattern)
    const regex = new RegExp(normalizedPattern, 'i')
    return regex.test(normalizedText)
  }

  static removeDiacritics(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .normalize('NFC')
  }
}
