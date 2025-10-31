import type { JSONIG, JSONYT, JSONTK } from './json'
import type { MediaProcessOptions, MediaDownloadOptions } from './media'

declare module 'dlp-core' {
  export function getJSON(url: string): Promise<any | null>
  export function getJSONYT(url: string): Promise<JSONYT | null>
  export function getJSONIG(url: string): Promise<JSONIG | null>
  export function getJSONTK(url: string): Promise<JSONTK | null>
  export function downloadMedia(options: MediaDownloadOptions): Promise<void>
  export function processMedia(options: MediaProcessOptions): Promise<string>

  const _default: {
    getJSON: typeof getJSON
    getJSONYT: typeof getJSONYT
    getJSONIG: typeof getJSONIG
    getJSONTK: typeof getJSONTK
    downloadMedia: typeof downloadMedia
    processMedia: typeof processMedia
  }
  export default _default
}
