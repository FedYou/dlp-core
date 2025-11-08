import type { DataOptions } from './media'
import type { VideoInfo, Dependencies, Status } from './any'
import type { FormatVideoDefault, FormatAudioDefault, FormatVideoYT, FormatAudioYT } from './json'

interface SaveMediaOptions {
  dir: string
  fileName: string
  cover?: boolean
  metadata?: boolean
}

declare namespace core {
  class DLP {
    addURL(url: string): Promise<void>
    getMedia(options: DataOptions): Promise<void>
    saveMedia(options: SaveMediaOptions): Promise<void>
    get status(): Status
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
  function statusDeps(): Promise<Dependencies>
  const cachePath: string
}

export = core
export as namespace core
