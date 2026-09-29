// Must be imported before Firebase or any module that uses crypto.randomUUID.
// crypto.randomUUID is only available in secure contexts (HTTPS).
// This polyfill makes it work over plain HTTP in local dev.
if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
  Object.defineProperty(crypto, 'randomUUID', {
    value: function randomUUID(): string {
      const bytes = crypto.getRandomValues(new Uint8Array(16))
      bytes[6] = (bytes[6] & 0x0f) | 0x40
      bytes[8] = (bytes[8] & 0x3f) | 0x80
      const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'))
      return `${hex.slice(0,4).join('')}-${hex.slice(4,6).join('')}-${hex.slice(6,8).join('')}-${hex.slice(8,10).join('')}-${hex.slice(10).join('')}`
    },
    writable: false,
    configurable: false,
  })
}
