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
