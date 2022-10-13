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

export function sha1 (string: string): string {
  const input = new ReadableString(string)
  const hash = createHash('sha1')
  hash.push(input)
  return hash.digest('base64')
}
