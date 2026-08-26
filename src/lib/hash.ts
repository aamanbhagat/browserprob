const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

function fnv1a(input: string, seed: number): number {
  let hash = (FNV_OFFSET ^ seed) >>> 0;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }
  return hash;
}

/** A compact, deterministic sample ID. This is not a cryptographic hash. */
export function fingerprintString(input: string): string {
  const first = fnv1a(input, 0);
  const second = fnv1a(input, 0x9e3779b9);
  return `${first.toString(16).padStart(8, "0")}${second.toString(16).padStart(8, "0")}`;
}

export function fingerprintNumbers(values: ArrayLike<number>, precision = 6): string {
  let serialized = "";
  for (let index = 0; index < values.length; index += 1) {
    serialized += `${Number(values[index]).toFixed(precision)},`;
  }
  return fingerprintString(serialized);
}
