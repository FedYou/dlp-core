import type { JSONIG, JSONYT, JSONTK } from './json'
import type { MediaProcessOptions, MediaDownloadOptions } from './media'

declare namespace core {
  function getJSON(url: string): Promise<any | null>
  function getJSONYT(url: string): Promise<JSONYT | null>
  function getJSONIG(url: string): Promise<JSONIG | null>
  function getJSONTK(url: string): Promise<JSONTK | null>
  function downloadMedia(options: MediaDownloadOptions): Promise<void>
  function processMedia(options: MediaProcessOptions): Promise<string>
}

export = core
export as namespace core
