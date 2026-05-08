export function hasWebGL2(): boolean {
  if (typeof document === 'undefined') return true
  return document.createElement('canvas').getContext('webgl2') !== null
}
