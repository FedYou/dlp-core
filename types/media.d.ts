import type { DataOptions } from './enum'
import type { FileDownloadProgress } from './dlf'

export interface MediaDownloadOn {
  start: (type: 'video' | 'audio' | 'thumbnail') => void
  progress: (data: FileDownloadProgress) => void
  complete: (type: 'video' | 'audio' | 'thumbnail', code: number) => void
}

export interface MediaDownloadOptions {
  formats: any
  thumbnail: string
  referer?: string
  cookies?: string
  data: DataOptions
  on?: MediaDownloadOn
}

interface MediaProcessOn {
  start: (type: 'video' | 'audio') => void
  complete: (type: 'video' | 'audio', code: number) => void
}

export interface MediaProcessOptions {
  data: DataOptions
  on?: MediaProcessOn
}
