import ffmpeg from 'lib/ffmpeg'
import existsCache from 'utils/existsCache'
import generateCache from 'utils/generateCache'

// ----------------------------
// --- Types ------------------
// ----------------------------

import type { MediaProcessOptions as Options } from 'types/media'

// ----------------------------
// --- Functions --------------
// ----------------------------

export default async function ({
  json,
  options,
  on = {
    start: () => {},
    complete: () => {}
  }
}: Options): Promise<string> {
  const { NAMES, PATHS } = generateCache(json, options)

  if (options?.cover) {
    if (!existsCache(NAMES.jpeg)) {
      on?.start('thumbnail')
      await ffmpeg.toJpeg(PATHS.thumbnail, PATHS.jpeg)
      on?.complete('thumbnail', 0)
    }
  }

  if (options.type === 'onlyAudio') {
    on?.start('audio')
    if (!existsCache(NAMES.audioMp3)) {
      await ffmpeg.toAudioMp3(PATHS.onlyAudio, PATHS.audioMp3)
    }
    on?.complete('audio', 0)
    return PATHS.audioMp3
  }

  if (options.type === 'video' && json.platform === 'youtube') {
    let audioKeyName: 'audioAac' | 'audioWebm' = options.vformat === 'mp4' ? 'audioAac' : 'audioWebm'

    if (!existsCache(NAMES[audioKeyName])) {
      on?.start('audio')
      if (options.vformat === 'mp4') {
        await ffmpeg.toAudioAac(PATHS.onlyAudio, PATHS.audioAac)
      } else if (options.vformat === 'webm') {
        await ffmpeg.toAudioWebm(PATHS.onlyAudio, PATHS.audioWebm)
      }
      on?.complete('audio', 0)
    }

    on?.start('video')

    if (!existsCache(NAMES.video)) {
      await ffmpeg.toVideo({
        entryVideo: PATHS.onlyVideo,
        entryAudio: PATHS[audioKeyName],
        outFile: PATHS.video,
        type: options.vformat as 'mp4' | 'webm'
      })
    }

    on?.complete('video', 0)
    return PATHS.video
  }
  if (options.type === 'video' && json.platform === 'instagram') {
    on?.start('video')
    if (!existsCache(NAMES.video)) {
      await ffmpeg.toVideo({
        entryVideo: PATHS.onlyVideo,
        entryAudio: PATHS.onlyAudio,
        outFile: PATHS.video,
        type: options.vformat as 'mp4' | 'webm'
      })
    }
    on?.complete('video', 0)

    return PATHS.video
  }

  // onlyVideo

  return PATHS.onlyVideo
}
