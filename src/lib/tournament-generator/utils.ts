export function binomialCoefficient(n: number, k: number): number {
    if (k === 0 || k === n) return 1;
    if (n < 0 || k < 0 || k > n) throw new Error(`Invalid arguments: n=${n}, k=${k}`);
    return binomialCoefficient(n - 1, k - 1) + binomialCoefficient(n - 1, k);
}
