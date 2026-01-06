export class RandomCode {
    static generateCode(lenght: number = 6) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const array = new Uint8Array(lenght);
        crypto.getRandomValues(array);

        return Array.from(array, (x) => chars[x % chars.length]).join('');
    }

    static isEqual(a: string, b: string) {
        return a.toUpperCase() === b.toUpperCase();
    }
}
