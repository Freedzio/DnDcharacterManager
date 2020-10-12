export function preventNaN(v: string) {
  return isNaN(parseInt(v)) ? 0 : parseInt(v)
}