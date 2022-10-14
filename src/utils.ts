import { createHash } from 'crypto'
import { Readable, Writable } from 'stream'

export class ReadableString extends Readable {
  private sent = false

  constructor (private readonly str: string) {
    super()
  }

  _read (): void {
    if (!this.sent) {
      this.push(Buffer.from(this.str))
      this.sent = true
    } else {
      this.push(null)
    }
  }
}

export class WritableString extends Writable {
  private str = ''

  _write (chunk, encoding, callback): void {
    this.str += Buffer.from(chunk).toString('utf-8')
    callback()
  }

  toString (): string {
    return this.str
  }
}

export function hash (string: string): string {
  return 'h' + cyrb53(string)
}

const sha1 = (string: string): string => {
  const hash = createHash('sha1')
  hash.push(string)
  return hash.digest('base64url')
}

const cyrb53 = (str: string, seed = 0): string => {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)

  const res = 4294967296 * (2097151 & h2) + (h1 >>> 0)
  return res.toString()
}
