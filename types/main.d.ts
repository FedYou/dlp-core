import type { MediaProcessOptions, MediaDownloadOptions } from './media'

declare namespace core {
  class DLP {
    addURL(url: string): Promise<void>
    async getJSON(): Promise<void>
    async downloadMedia(options: MediaDownloadOptions): Promise<void>
    async processMedia(options: MediaProcessOptions): Promise<string>
  }
}

export = core
export as namespace core
