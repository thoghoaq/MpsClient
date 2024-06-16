export default class NumberHelper {
    static formatCurrency = (value: number): string => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
}