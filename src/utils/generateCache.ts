import youfile from 'youfile'
import sha256 from 'utils/sha256'
import cache from 'global/cache'
import existsCache from 'utils/existsCache'

// ----------------------------
// --- Types ------------------
// ----------------------------

import type { DataOptions } from 'types/enums'

interface JSON {
  NAMES: {
    onlyVideo: string
    onlyAudio: string
    audioWebm: string
    audioMp3: string
    audioAac: string
    video: string
    tiktok: string
    thumbnail: string
  }
  PATHS: {
    onlyVideo: string
    onlyAudio: string
    audioWebm: string
    audioMp3: string
    audioAac: string
    video: string
    tiktok: string
    thumbnail: string
  }
}

// ----------------------------
// --- Functions --------------
// ----------------------------

function resolveCache(fileName: string) {
  return cache.path + '/' + fileName
}

export default function ({
  platform,
  id,
  type,
  videoType,
  videoQuality,
  audioLanguage
}: DataOptions): JSON {
  const key = sha256('keys' + platform + id + type + videoType + videoQuality + audioLanguage)

  if (existsCache(key)) {
    return youfile.read.jsonSync(resolveCache(key)) as JSON
  }

  const NAMES = {
    onlyVideo: sha256(platform + id + videoType + videoQuality),
    onlyAudio: sha256(platform + id + audioLanguage),
    audioWebm: sha256(platform + id + audioLanguage + 'webm'),
    audioMp3: sha256(platform + id + audioLanguage + 'mp3'),
    audioAac: sha256(platform + id + audioLanguage + 'acc'),
    video: sha256(platform + id + type + videoType + videoQuality + audioLanguage),
    tiktok: sha256(platform + id + type + videoQuality),
    thumbnail: sha256(platform + id + 'thumbnail')
  }

  const PATHS = {
    onlyVideo: resolveCache(NAMES.onlyVideo),
    onlyAudio: resolveCache(NAMES.onlyAudio),
    audioWebm: resolveCache(NAMES.audioWebm),
    audioMp3: resolveCache(NAMES.audioMp3),
    audioAac: resolveCache(NAMES.audioAac),
    video: resolveCache(NAMES.video),
    tiktok: resolveCache(NAMES.tiktok),
    thumbnail: resolveCache(NAMES.thumbnail)
  }

  youfile.write.jsonSync(resolveCache(key), { NAMES, PATHS }, 0)

  return { NAMES, PATHS }
}
