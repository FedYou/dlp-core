import type { FileDownloadProgress } from './dlf'

export interface VideoInfo {
  title: string
  uploader: string
  description: string
  upload_date: string
  duration: string
  thumbnail: string
  id: string
  platform: string
  views?: string
  language?: string
}

export interface Metadata {
  title: string
  artist: string
  description: string
}

export interface DependencyFormat {
  installed: boolean
  version: string | null
  lastest: boolean | null
}

export interface DependenciesList {
  ytdlp: DependencyFormat
  ffmpeg: DependencyFormat
  deno: DependencyFormat
  aria2: DependencyFormat
}

export interface Dependencies {
  'all-installed': boolean
  list: DependenciesList
}

interface Status {
  status:
    | 'ready'
    | 'JSON'
    | 'JSONComplete'
    | 'downloadingStart'
    | 'downloading'
    | 'downloadingComplete'
    | 'processing'
    | 'processingComplete'
    | 'saving'
    | 'saved'
  type: 'video' | 'audio' | 'thumbnail' | 'json' | 'none'
  download: FileDownloadProgress
  downloaded: {
    audio: boolean
    video: boolean
    thumbnail: boolean
  }
  processed: {
    audio: boolean
    video: boolean
    thumbnail: boolean
  }
}
