import { execAsync } from 'utils/exec'
// ----------------------------
// --- Types ------------------
// ----------------------------

interface VideoOptions {
  entryVideo: string
  entryAudio: string
  outFile: string
  type: 'mp4' | 'webm'
  metadata?: {
    [key: string]: string | number | boolean
  }
}

// ----------------------------
// --- Variables --------------
// ----------------------------
const COMMAND = 'ffmpeg'

const COMMAND_ARGS = {
  //
  AUDIO_WEBM: ['-map', '0:a', '-c:a', 'libvorbis', '-f', 'webm', '-y'],
  AUDIO_MP3: ['-map', '0:a', '-c:a', 'libmp3lame', '-q:a', '0', '-f', 'mp3', '-y'],
  AUDIO_ACC: ['-map', '0:a', '-c:a', 'aac', '-f', 'mp4', '-y'],
  VIDEO: ['-c:v', 'copy', '-c:a', 'copy', '-y'],
  MP4_COVER: [
    '-map',
    '0',
    '-map',
    '1',
    '-c',
    'copy',
    '-map_metadata',
    '0',
    '-disposition:v:1',
    'attached_pic',
    '-f',
    'mp4',
    '-y'
  ],
  MP3_COVER: [
    '-map',
    '0',
    '-map',
    '1',
    '-c',
    'copy',
    '-id3v2_version',
    '3',
    '-map_metadata',
    '0',
    '-f',
    'mp3',
    '-y'
  ],
  JPEG: ['-q:v', '1', '-f', 'image2']
}

// ----------------------------
// --- Functions --------------
// ----------------------------

// Add metadata to ffmpeg args
function metadataToArgs(metadata: any) {
  const args: (string | number)[] = []

  for (const key in metadata) {
    args.push('-metadata')
    args.push(`${key}="${metadata[key]}"`)
  }

  return args
}

// Base function to convert audio
async function toAudio(
  entryFile: string,
  outFile: string,
  type: 'mp3' | 'aac' | 'webm',
  metadata?: any
) {
  const args: (string | number)[] = ['-i', entryFile]

  if (metadata) args.push(...metadataToArgs(metadata))
  if (type === 'webm') args.push(...COMMAND_ARGS.AUDIO_WEBM)
  else if (type === 'aac') args.push(...COMMAND_ARGS.AUDIO_ACC)
  else if (type === 'mp3') args.push(...COMMAND_ARGS.AUDIO_MP3)
  args.push(outFile)

  await execAsync(COMMAND, args)
}

async function toAudioMp3(entryFile: string, outFile: string, metadata?: any) {
  return await toAudio(entryFile, outFile, 'mp3', metadata)
}

async function toAudioWebm(entryFile: string, outFile: string) {
  return await toAudio(entryFile, outFile, 'webm')
}

async function toAudioAac(entryFile: string, outFile: string) {
  return await toAudio(entryFile, outFile, 'aac')
}

async function toMp3Cover(entryAudio: string, entryCover: string, outFile: string) {
  const args: (string | number)[] = ['-i', entryAudio, '-i', entryCover]

  args.push(...COMMAND_ARGS.MP3_COVER)
  args.push(outFile)

  await execAsync(COMMAND, args)
}

async function toVideo({ entryVideo, entryAudio, outFile, metadata, type }: VideoOptions) {
  const args: (string | number)[] = ['-i', entryVideo, '-i', entryAudio]

  if (metadata) args.push(...metadataToArgs(metadata))
  args.push(...COMMAND_ARGS.VIDEO)
  args.push('-f', type)
  args.push(outFile)

  await execAsync(COMMAND, args)
}

async function toMp4Cover(entryVideo: string, entryCover: string, outFile: string) {
  const args: (string | number)[] = ['-i', entryVideo, '-i', entryCover]

  args.push(...COMMAND_ARGS.MP4_COVER)
  args.push(outFile)

  await execAsync(COMMAND, args)
}

async function toJpeg(entryFile: string, outFile: string) {
  const args: (string | number)[] = ['-i', entryFile]
  args.push(...COMMAND_ARGS.JPEG)
  args.push(outFile)
  return await execAsync(COMMAND, args)
}

export default { toAudioMp3, toAudioWebm, toAudioAac, toVideo, toJpeg, toMp3Cover, toMp4Cover }
