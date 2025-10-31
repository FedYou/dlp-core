import './stopExec'
import downloadMedia from 'lib/dlm'
import processMedia from 'lib/processMedia'
import getJSON from 'lib/json/get'
import toJSONYT from 'lib/json/toYoutube'
import toJSONIG from 'lib/json/toInstagram'
import toJSONTK from 'lib/json/toTiktok'
import type { JSONIG, JSONYT, JSONTK } from 'types/json'

async function getJSONToConvert(url: string, func: any) {
  const json = await getJSON(url)
  if (json) return func(json)
  return null
}

async function getJSONYT(url: string): Promise<JSONYT | null> {
  return getJSONToConvert(url, toJSONYT)
}
async function getJSONIG(url: string): Promise<JSONIG | null> {
  return getJSONToConvert(url, toJSONIG)
}
async function getJSONTK(url: string): Promise<JSONTK | null> {
  return getJSONToConvert(url, toJSONTK)
}

export { getJSON, getJSONYT, getJSONIG, getJSONTK, downloadMedia, processMedia }
export default {
  getJSON,
  getJSONYT,
  getJSONIG,
  getJSONTK,
  downloadMedia,
  processMedia
}
