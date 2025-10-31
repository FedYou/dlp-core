import { DataOptions } from './enum'
import type { FileDownloadProgress } from './dlf'

export interface MediaDownloadOn {
  start: (type: 'video' | 'audio') => void
  progress: (data: FileDownloadProgress) => void
  complete: (type: 'video' | 'audio', code: number) => void
}

export interface MediaDownloadOptions {
  formats: any
  referer?: string
  cookies?: string
  data: DataOptions
  on?: MediaDownloadOn
}
