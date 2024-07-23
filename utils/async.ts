export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function createDebounce() {
  let timeout: NodeJS.Timeout | null = null
  return function (fnc: Function, delayMs: number = 300) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      fnc()
    }, delayMs || 500)
  }
}
