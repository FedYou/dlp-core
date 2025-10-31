// @ts-ignore
import Aria2 from 'aria2'
import getSize from 'utils/getSize'
import getTime from 'utils/getTime'
import cache from 'global/cache'
import { execa } from 'execa'

// ----------------------------
// --- Types ------------------
// ----------------------------

import type { FileDownloadOptions, FileDownloadProgress } from 'types/dlf'

// ----------------------------
// --- Headers ----------------
// ----------------------------

const HTTP_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-us,en;q=0.5',
  'Sec-Fetch-Mode': 'navigate'
}

// ----------------------------
// --------- Aria2 RPC --------
// ----------------------------

const RPC_SECRET = Math.random().toString(36).substring(2, 15)

const COMMAND = 'aria2c'
const COMMAND_ARGS = [
  '--enable-rpc',
  '--rpc-listen-all=true',
  '--rpc-allow-origin-all',
  '--rpc-listen-port=6800',
  `--rpc-secret=${RPC_SECRET}`
]

let isExecuted = false

function runRPC() {
  if (isExecuted) return
  isExecuted = true

  execa(COMMAND, [...COMMAND_ARGS], { all: true })
  return
}

runRPC()

// ----------------------------
// ----------------------------
// ----------------------------

const CONFIG = {
  host: 'localhost',
  port: 6800,
  secure: false,
  secret: RPC_SECRET,
  path: '/jsonrpc'
}

const TELL_STATUS = ['totalLength', 'completedLength', 'downloadSpeed', 'status']

function getStatus(tellStatus: any): FileDownloadProgress {
  const total = parseInt(tellStatus.totalLength)
  const done = parseInt(tellStatus.completedLength)
  const speed = parseInt(tellStatus.downloadSpeed)

  return {
    progress: total > 0 ? parseFloat(((done / total) * 100).toFixed(1)) : 0,
    speed: `${getSize(speed)}/s`,
    eta: total > 0 && speed > 0 ? `${getTime((total - done) / speed)}` : '---',
    byDownload: getSize(total) as string,
    downloaded: getSize(done) as string
  }
}

async function dlf({
  url,
  fileName,
  referer,
  cookies,
  on = {
    progress: () => {},
    complete: () => {}
  }
}: FileDownloadOptions): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const GID_OPTIONS = {
      header: [
        `User-Agent: ${HTTP_HEADERS['User-Agent']}`,
        `Accept: ${HTTP_HEADERS.Accept}`,
        `Accept-Language: ${HTTP_HEADERS['Accept-Language']}`,
        `Sec-Fetch-Mode: ${HTTP_HEADERS['Sec-Fetch-Mode']}`
      ],
      'allow-overwrite': 'true',
      'max-connection-per-server': '16',
      split: '64',
      'min-split-size': '1M'
    }

    if (referer) GID_OPTIONS.header.push(`Referer: ${referer}`)
    if (cookies)
      GID_OPTIONS.header.push(`Cookie: ${cookies.replace(/\s+/g, ' ').replace(/"/g, '').trim()}`)

    runRPC()

    // Connect to RPC
    const aria2 = new Aria2(CONFIG)

    await aria2.open()

    // Start download
    const gidOptions = { ...GID_OPTIONS, dir: cache.path, out: fileName }

    const gid = await aria2.call('addUri', [url], gidOptions)

    // Monitor progress with interval
    const interval = setInterval(async () => {
      try {
        const tellStatus = await aria2.call('tellStatus', gid, TELL_STATUS)

        on.progress(getStatus(tellStatus))

        if (tellStatus.status === 'complete') {
          clearInterval(interval)
          on.complete(0)
          await aria2.close()
        }
      } catch (err) {
        clearInterval(interval)
        on.complete(1)
        await aria2.close()
        reject(err)
      }
    }, 100)

    aria2.on('close', () => {
      clearInterval(interval)
      resolve()
    })
  })
}

export default dlf
