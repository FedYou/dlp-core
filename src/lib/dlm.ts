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

export default async function ({
  formats,
  thumbnail,
  referer,
  cookies,
  data,
  on
}: MediaDownloadOptions) {
  const { NAMES } = generateCache(data)

  on?.start('thumbnail')
  await dlf({ url: thumbnail, fileName: NAMES.thumbnail, on: on as any })
  on?.complete('thumbnail', 0)

  if (data.platform === 'tiktok') {
    const url = formats[data.videoType as 'mp4' | 'webm'][data.videoQuality ?? 0].url
    const fileName = NAMES.tiktok

    if (!existsCache(fileName)) {
      on?.start('video')
      await dlf({ url, referer, cookies, fileName: NAMES.tiktok, on: on as any })
      on?.complete('video', 0)
    }
    return
  }

  if (data.type === 'onlyVideo' || data.type === 'video') {
    const url = formats[data.videoType as 'mp4' | 'webm'][data.videoQuality ?? 0].url
    const fileName = NAMES.onlyVideo

    if (!existsCache(fileName)) {
      on?.start('video')
      await dlf({ url, fileName: NAMES.onlyVideo, on: on as any })
      on?.complete('video', 0)
    }
  }
  if (data.type === 'onlyAudio' || data.type === 'video') {
    let url: string = ''

    if (data.platform === 'youtube') {
      url = formats.audio[data.audioLanguage as string].url
    } else if (data.platform === 'instagram') {
      url = formats.audio.url
    }

    const fileName = NAMES.onlyAudio

    if (!existsCache(fileName)) {
      on?.start('audio')
      await dlf({ url, fileName: NAMES.onlyAudio, on: on as any })
      on?.complete('audio', 0)
    }
  }
}
