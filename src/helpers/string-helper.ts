export default class StringHelper {
    static getNameChar = (str: string): string => {
        var words = str.split(" ");
        return words[words.length - 1].trim().charAt(0)
    }
}