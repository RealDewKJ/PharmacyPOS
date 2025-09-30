import { treaty } from '@elysiajs/eden'
import type { App } from './index'

// Create Eden Treaty instance for type-safe client generation
export const eden = treaty<App>('http://localhost:3001')

export type EdenClient = typeof eden
