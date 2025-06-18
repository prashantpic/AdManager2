/**
 * Generates a random string of a specified length using a given character set.
 * @param {number} length - The desired length of the string.
 * @param {string} [charset="abcdefghijklmnopqrstuvwxyz0123456789"] - The character set to use.
 * @returns {string} A random string.
 */
export function generateRandomString(length, charset = "abcdefghijklmnopqrstuvwxyz0123456789") {
    let result = '';
    const charactersLength = charset.length;
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Picks a random element from an array.
 * @param {Array<any>} list - The array to pick from.
 * @returns {any} A random element from the list, or undefined if the list is empty or null.
 */
export function pickRandomFromList(list) {
    if (!list || list.length === 0) {
        return undefined;
    }
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

/**
 * Generates a UUID v4 string.
 * This is a simple JavaScript implementation as k6 does not have a built-in UUID generator.
 * For truly random UUIDs meeting cryptographic standards, a more robust library or method might be considered
 * if the specific testing needs require it beyond simple uniqueness for test data.
 * @returns {string} A UUID v4 compliant string.
 */
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}