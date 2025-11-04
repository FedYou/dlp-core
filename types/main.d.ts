import type { DataOptions, MediaDownloadOn, MediaProcessOn } from './media.'
import type { VideoInfo, Metadata } from './any'
import type { FormatVideoDefault, FormatAudioDefault, FormatVideoYT, FormatAudioYT } from './json'

interface SaveMediaOptions {
  dir: string
  fileName: string
  cover?: boolean = false
  metadata?: boolean = false
}

declare namespace core {
  class DLP {
    async addURL(url: string): Promise<void>
    async getMedia(options: DataOptions): Promise<void>
    async saveMedia(options: SaveMediaOptions): Promise<void>
    get info(): VideoInfo | null
    get formats(): {
      audio?:
        | FormatAudioDefault[]
        | FormatAudioYT
        | FormatAudioDefault
        | { [key: string]: FormatAudioYT[] }
        | null
      mp4: FormatVideoDefault[] | FormatVideoYT[]
      webm?: FormatVideoYT[] | null
    }
  }
}

export = core
export as namespace core
