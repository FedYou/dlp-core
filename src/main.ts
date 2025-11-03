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
import type { DataOptions } from 'types/media'
import type { VideoInfo, Metadata } from 'types/any'

class DLP {
  private url: any
  private dumpJSON: any
  private json: any
  private platform: any
  private output: any

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

    await this.getJSON()
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

    await downloadMedia({ json: this.json, options })
    this.output = await processMedia({ json: this.json, options })
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
  }

  getInfo(): VideoInfo | null {
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

  private getMetadata(): Metadata | null {
    if (!this.json) return null
    return {
      title: this.json.title,
      artist: this.json.uploader,
      description: this.json.description
    }
  }
}

export { DLP }
export default { DLP }
