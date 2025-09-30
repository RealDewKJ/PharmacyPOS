declare module 'quagga' {
  interface QuaggaConfig {
    inputStream: {
      name: string
      type: string
      target: HTMLElement | string
      constraints: {
        width: number
        height: number
        facingMode: string
      }
    }
    locator: {
      patchSize: string
      halfSample: boolean
    }
    numOfWorkers: number
    decoder: {
      readers: string[]
    }
    locate: boolean
  }

  interface QuaggaResult {
    codeResult: {
      code: string
      format: string
    }
  }

  export function init(config: QuaggaConfig, callback: (err?: any) => void): void
  export function start(): void
  export function stop(): void
  export function onDetected(callback: (result: QuaggaResult) => void): void
  export function offDetected(callback: (result: QuaggaResult) => void): void
}
