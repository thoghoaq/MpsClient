export default class DateTimeHelper {
  static parse(date: string): Date {
    return new Date(date)
  }

  static format(
    date: Date | string | null,
    format?: 'datetime' | 'month' | 'date' | 'time',
  ): string {
    if (!date) {
      return ''
    }
    date = typeof date === 'string' ? this.parse(date) : date
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }

    const formatter = new Intl.DateTimeFormat('vi-VN', options)
    const parts = formatter.formatToParts(date)

    const day = parts.find((part) => part.type === 'day')?.value
    const month = parts.find((part) => part.type === 'month')?.value
    const year = parts.find((part) => part.type === 'year')?.value
    const hour = parts.find((part) => part.type === 'hour')?.value
    const minute = parts.find((part) => part.type === 'minute')?.value
    const second = parts.find((part) => part.type === 'second')?.value

    const formattedDate = `${day}/${month}/${year}`
    const formattedTime = `${hour}:${minute}:${second}`

    switch (format) {
      case 'datetime':
        return `${formattedDate} ${formattedTime}`
      case 'date':
        return formattedDate
      case 'time':
        return formattedTime
      case 'month':
        return `${month}/${year}`
      default:
        return parts.map((part) => part.value).join('')
    }
  }
}
