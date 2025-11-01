import './stopExec'
import downloadMedia from 'lib/dlm'
import processMedia from 'lib/processMedia'
import getJSON from 'lib/json/get'
import toJSONYT from 'lib/json/toYoutube'
import toJSONIG from 'lib/json/toInstagram'
import toJSONTK from 'lib/json/toTiktok'
import platformURL from 'utils/platformURL'
import type { DataOptions, MediaDownloadOn, MediaProcessOn } from 'types/media'

class DLP {
  private url: any
  private dumpJSON: any
  private json: any
  private platform: any

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
  }
  async getJSON() {
    if (!this.platform || !this.url) return
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

  async downloadMedia(options: DataOptions, on?: MediaDownloadOn) {
    if (!this.platform || !this.url) return
    await downloadMedia({ json: this.json, options, on })
  }

  async processMedia(options: DataOptions, on?: MediaProcessOn) {
    if (!this.platform || !this.url) return
    return await processMedia({ json: this.json, options, on })
  }
}

export { DLP }
export default { DLP }
