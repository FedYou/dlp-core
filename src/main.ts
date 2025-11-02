import './stopExec'
import path from 'path'
import youfile from 'youfile'
import downloadMedia from 'lib/dlm'
import processMedia from 'lib/processMedia'
import getJSON from 'lib/json/get'
import toJSONYT from 'lib/json/toYoutube'
import toJSONIG from 'lib/json/toInstagram'
import toJSONTK from 'lib/json/toTiktok'
import platformURL from 'utils/platformURL'
import type { DataOptions } from 'types/media'

class DLP {
  private url: any
  private dumpJSON: any
  private json: any
  private platform: any
  private outputFile: any

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

    if (this.outputFile) this.outputFile = ''

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
    this.outputFile = await processMedia({ json: this.json, options })
  }

  async saveMedia(dir: string, fileName: string) {
    if (!this.outputFile) return
    await youfile.copy(this.outputFile, path.join(dir, fileName))
  }
}

export { DLP }
export default { DLP }
