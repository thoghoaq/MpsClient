export default class NumberHelper {
  static formatCurrency = (value: number | undefined): string => {
    if (value === undefined) {
      return ''
    }
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }

  static displayPercentage = (value: number | undefined): string => {
    if (value === undefined) {
      return ''
    }
    return `${value * 100}%`
  }
}
