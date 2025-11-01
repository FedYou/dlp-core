import type { DataOptions, MediaDownloadOn, MediaProcessOn } from './media'

declare namespace core {
  class DLP {
    async addURL(url: string): Promise<void>
    async downloadMedia(options: DataOptions, on?: MediaDownloadOn): Promise<void>
    async processMedia(options: DataOptions, on?: MediaProcessOn): Promise<string>
  }
}

export = core
export as namespace core
