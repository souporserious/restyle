export function hash(str: string): string {
  // FNV-1a Hash Function
  let h = 0 ^ 0x811c9dc5
  for (let index = 0; index < str.length; index++) {
    h ^= str.charCodeAt(index)
    h = (h * 0x01000193) >>> 0
  }

  // Base36 Encoding Function
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const base36 = '0123456789' + letters
  let result = ''
  do {
    result = base36[h % 36] + result
    h = Math.floor(h / 36)
  } while (h > 0)

  return result
}
