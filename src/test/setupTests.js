import '@testing-library/jest-dom'

// Polyfills or global stubs if needed
// Vitest with experimental Vite (rolldown) may emit SSR helpers
// Ensure they exist to avoid ReferenceErrors during module transform
if (typeof globalThis.__vite_ssr_exportName__ === 'undefined') {
  globalThis.__vite_ssr_exportName__ = (name, value) => value
}
