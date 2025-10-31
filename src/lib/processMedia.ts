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
  data,
  on = {
    start: () => {},
    complete: () => {}
  }
}: Options): Promise<string> {
  const { NAMES, PATHS } = generateCache(json, data)

  if (!existsCache(NAMES.jpeg)) {
    on?.start('thumbnail')
    await ffmpeg.toJpeg(PATHS.thumbnail, PATHS.jpeg)
    on?.complete('thumbnail', 0)
  }

  if (data.type === 'onlyAudio') {
    on?.start('audio')
    if (!existsCache(NAMES.audioMp3)) {
      await ffmpeg.toAudioMp3(PATHS.onlyAudio, PATHS.audioMp3)
    }
    on?.complete('audio', 0)
    return PATHS.audioMp3
  }

  if (data.type === 'video' && json.platform === 'youtube') {
    let audioKeyName: 'audioAac' | 'audioWebm' = data.videoType === 'mp4' ? 'audioAac' : 'audioWebm'

    if (!existsCache(NAMES[audioKeyName])) {
      on?.start('audio')
      if (data.videoType === 'mp4') {
        await ffmpeg.toAudioAac(PATHS.onlyAudio, PATHS.audioAac)
      } else if (data.videoType === 'webm') {
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
        type: data.videoType as 'mp4' | 'webm'
      })
    }

    on?.complete('video', 0)
    return PATHS.video
  }
  if (data.type === 'video' && json.platform === 'instagram') {
    on?.start('video')
    if (!existsCache(NAMES.video)) {
      await ffmpeg.toVideo({
        entryVideo: PATHS.onlyVideo,
        entryAudio: PATHS.onlyAudio,
        outFile: PATHS.video,
        type: data.videoType as 'mp4' | 'webm'
      })
    }
    on?.complete('video', 0)

    return PATHS.video
  }

  // onlyVideo

  return PATHS.onlyVideo
}
