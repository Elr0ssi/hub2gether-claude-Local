/** Le drapeau d'un pays à partir de son code à deux lettres. */
export function drapeau(iso2?: string): string {
  if (!iso2 || iso2.length !== 2) return "🌐";
  return String.fromCodePoint(...[...iso2.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}
