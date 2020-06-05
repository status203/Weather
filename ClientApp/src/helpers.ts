// Return a -ve number if a < b, +ve if a > b, or 0 otherwise
export function dateCompare(a: Date, b: Date): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}