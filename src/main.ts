import './stopExec'
import path from 'path'
import youfile from 'youfile'
import downloadMedia from 'lib/dlm'
import ffmpeg from 'lib/ffmpeg'
import processMedia from 'lib/processMedia'
import getJSON from 'lib/json/get'
import toJSONYT from 'lib/json/toYoutube'
import toJSONIG from 'lib/json/toInstagram'
import toJSONTK from 'lib/json/toTiktok'
import platformURL from 'utils/platformURL'
import statusDeps from 'lib/statusDeps'

import type { DataOptions, MediaDownloadOn, MediaProcessOn } from 'types/media'
import type { FileDownloadProgress } from 'types/dlf'
import type { VideoInfo, Metadata, Status } from 'types/any'
import type { FormatVideoDefault, FormatAudioDefault, FormatVideoYT, FormatAudioYT } from 'types/json'

class DLP {
  private url: any
  private dumpJSON: any
  private json: any
  private platform: any
  private output: any
  private _status: Status = {
    status: 'ready',
    type: 'none',
    download: {
      progress: 0,
      speed: '---',
      eta: '---',
      byDownload: '---',
      downloaded: '---'
    },
    downloaded: {
      audio: false,
      video: false,
      thumbnail: false
    },
    processed: {
      audio: false,
      video: false,
      thumbnail: false
    }
  }

  async addURL(url: string) {
    this.url = url
    this.platform = platformURL(url)

    if (this.platform === null) {
      throw new Error('Invalid URL', {
        cause: {
          code: 'INVALID_URL',
          value: url
        }
      })
    }

    if (this.output) this.output = ''
    this._status.status = 'JSON'
    this._status.type = 'json'
    await this.getJSON()
    this._status.status = 'JSONComplete'
    this._status.type = 'none'
  }

  private async getJSON() {
    this.dumpJSON = await getJSON(this.url)
    if (!this.dumpJSON) return
    if (this.platform === 'youtube') {
      this.json = toJSONYT(this.dumpJSON)
    } else if (this.platform === 'instagram') {
      this.json = toJSONIG(this.dumpJSON)
    } else if (this.platform === 'tiktok') {
      this.json = toJSONTK(this.dumpJSON)
    }
  }

  async getMedia(options: DataOptions) {
    if (options.type === 'video' || options.type === 'onlyAudio') {
      if (!this.json.formats.audio) {
        throw new Error('Audio no available in this video', {
          cause: {
            code: 'AUDIO_NOT_AVAILABLE'
          }
        })
      }
    }

    await downloadMedia({ json: this.json, options, on: this.onDownload() })
    this.output = await processMedia({ json: this.json, options, on: this.onProcess() })
  }

  private onDownload(): MediaDownloadOn {
    const complete = (type: 'video' | 'audio' | 'thumbnail', _: number) => {
      this._status.status = 'downloadingComplete'
      this._status.type = type
      this._status.downloaded[type] = true
      this._status.download = {
        progress: 0,
        speed: '---',
        eta: '---',
        byDownload: '---',
        downloaded: '---'
      }
    }
    const start = (type: 'video' | 'audio' | 'thumbnail') => {
      this._status.status = 'downloadingStart'
      this._status.type = type
      this._status.download = {
        progress: 0,
        speed: '---',
        eta: '---',
        byDownload: '---',
        downloaded: '---'
      }
    }
    const progress = (data: FileDownloadProgress) => {
      this._status.status = 'downloading'
      this._status.download = data
    }
    return { complete, progress, start }
  }

  private onProcess(): MediaProcessOn {
    const complete = (type: 'video' | 'audio' | 'thumbnail') => {
      this._status.status = 'processingComplete'
      this._status.processed[type] = true
    }
    const start = (type: 'video' | 'audio' | 'thumbnail') => {
      this._status.status = 'processing'
      this._status.type = type
    }

    return { complete, start }
  }

  async saveMedia({
    dir,
    fileName,
    cover = false,
    metadata = false
  }: {
    dir: string
    fileName: string
    cover?: boolean
    metadata?: boolean
  }) {
    if (!this.output) return
    this._status.status = 'saving'
    if (cover) {
      if (this.output.type === 'video' && this.output.format === 'mp4') {
        await ffmpeg.toMp4Cover({
          entryVideo: this.output.path,
          entryCover: this.output.cover,
          outFile: path.join(dir, fileName),
          metadata: this.getMetadata()
        })
        return
      }
      if (this.output.type === 'audio') {
        await ffmpeg.toMp3Cover({
          entryAudio: this.output.path,
          entryCover: this.output.cover,
          outFile: path.join(dir, fileName),
          metadata: this.getMetadata()
        })
        return
      }
    }

    if (metadata) {
      await ffmpeg.addMetadata(this.output.path, path.join(dir, fileName), this.getMetadata())
      return
    }
    await youfile.copy(this.output.path, path.join(dir, fileName))
    this._status.status = 'saved'
    this._status.type = this.output.type
  }
  get status(): Status {
    return this._status
  }

  get info(): VideoInfo | null {
    if (!this.json) return null
    const data: VideoInfo = {
      title: this.json.title,
      uploader: this.json.uploader,
      description: this.json.description,
      upload_date: this.json.upload_date,
      duration: this.json.duration,
      thumbnail: this.json.thumbnail,
      id: this.json.id,
      platform: this.json.platform
    }
    if (this.json.views) data.views = this.json.views
    if (this.json.language) data.language = this.json.language

    return data
  }

  get formats(): {
    audio?:
      | FormatAudioDefault[]
      | FormatAudioYT
      | FormatAudioDefault
      | { [key: string]: FormatAudioYT[] }
      | null
    mp4: FormatVideoDefault[] | FormatVideoYT[]
    webm?: FormatVideoYT[] | null
  } | null {
    return this.json.formats
  }

  private getMetadata(): Metadata | null {
    if (!this.json) return null
    return {
      title: this.json.title,
      artist: this.json.uploader,
      description: this.json.description
    }
  }
}

export { DLP, statusDeps }
export default { DLP }
