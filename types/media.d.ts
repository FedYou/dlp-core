import type { FileDownloadProgress } from './dlf'

export interface DataOptions {
  /**
   * Platform
   */
  platform: 'youtube' | 'instagram' | 'tiktok'
  /**
   * Type of download
   *
   * Youtube: onlyVideo | onlyAudio | video
   *
   * Instagram: onlyVideo | onlyAudio | video
   *
   * Tiktok: video
   */
  type: 'onlyVideo' | 'onlyAudio' | 'video'
  /**
   * Id of video
   */
  id: string
  /**
   * Language of youtube audio
   */
  audioLanguage?: string
  /**
   * Type of video
   *
   * Youtube: mp4 | webm
   *
   * Instagram: mp4
   *
   * Tiktok: mp4
   */
  videoType?: 'mp4' | 'webm'
  /**
   * Index position of format video
   */
  videoQuality?: number
}

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
  start: (type: 'video' | 'audio' | 'thumbnail') => void
  complete: (type: 'video' | 'audio' | 'thumbnail', code: number) => void
}

export interface MediaProcessOptions {
  data: DataOptions
  on?: MediaProcessOn
}
