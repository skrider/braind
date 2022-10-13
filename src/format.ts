import child_process, { ChildProcess } from 'child_process'
import prettier from 'prettier'
import { pipeline } from 'stream/promises'
import { Duplex, Readable } from 'stream'
import { ReadableString, WritableString } from 'src/utils'
// this file is responsible for formatting an input note

const LATEX_ENV_REGEX = /^\$$[\w\W]*?^\$$/gm
const SEPERATOR_STRING = '>>>>>>>'

const format = async function (note: BraindNote): Promise<void> {
  prettier.format(note.text, {
    parser: 'markdown'
  })
  const match = note.text.matchAll(LATEX_ENV_REGEX)
  let acc = ''
  for (const m of match) {
    acc = acc + m[0] + '\n' + SEPERATOR_STRING + '\n'
  }
  const accStream = new ReadableString(acc)
  const latexindent: ChildProcess = await child_process.exec('latexindent')
  const resultStream = new WritableString()

  if (latexindent.stdin != null && latexindent.stdout != null) {
    await pipeline(
      accStream,
      latexindent.stdin
    )
    await pipeline(
      latexindent.stdout,
      resultStream
    )
  }
  console.log(resultStream.toString())
  console.log("done")
}

export default format
