import dlf from 'lib/dlf'
import existsCache from 'utils/existsCache'
import generateCache from 'utils/generateCache'

// ----------------------------
// --- Types ------------------
// ----------------------------
import type { MediaDownloadOptions } from 'types/media'

// ----------------------------
// --- Functions --------------
// ----------------------------

export default async function ({ json, data, on }: MediaDownloadOptions) {
  const { NAMES } = generateCache(json, data)
  const { platform, formats } = json

  if (!existsCache(NAMES.thumbnail)) {
    on?.start('thumbnail')
    await dlf({ url: json.thumbnail, fileName: NAMES.thumbnail, on: on as any })
    on?.complete('thumbnail', 0)
  }

  if (platform === 'tiktok') {
    const url = (formats as any)[data.videoType as 'mp4' | 'webm'][data.videoQuality ?? 0].url
    const fileName = NAMES.tiktok
    const cookies = json?.cookies
    const referer = json?.referer

    if (!existsCache(fileName)) {
      on?.start('video')
      await dlf({ url, referer, cookies, fileName: NAMES.tiktok, on: on as any })
      on?.complete('video', 0)
    }
    return
  }

  if (data.type === 'onlyVideo' || data.type === 'video') {
    const url = (formats as any)[data.videoType as 'mp4' | 'webm'][data.videoQuality ?? 0].url
    const fileName = NAMES.onlyVideo

    if (!existsCache(fileName)) {
      on?.start('video')
      await dlf({ url, fileName: NAMES.onlyVideo, on: on as any })
      on?.complete('video', 0)
    }
  }
  if (data.type === 'onlyAudio' || data.type === 'video') {
    let url: string = ''

    if (platform === 'youtube') {
      url = (formats as any).audio[data.audioLanguage as string].url
    } else if (platform === 'instagram') {
      url = (formats as any).audio.url
    }

    const fileName = NAMES.onlyAudio

    if (!existsCache(fileName)) {
      on?.start('audio')
      await dlf({ url, fileName: NAMES.onlyAudio, on: on as any })
      on?.complete('audio', 0)
    }
  }
}
