import child_process from 'child_process'
import prettier from 'prettier'
import { pipeline } from 'stream/promises'
import { ReadableString, WritableString } from 'src/utils'

const LATEXINDENT_SEPARATOR = '\n\n\n>>>>>>>\n\n\n'

interface FormatTemplate {
  type: ContentType
  content: string
}

enum ContentType {
  markdown,
  latex,
  delimiter
}

const format = async function (note: BraindNote): Promise<string> {
  const lines = note.text.split(/(?<=\n)/)
  const formatTemplate: FormatTemplate[] = []
  let state: ContentType = ContentType.markdown
  let chunk = ''
  for (const l of lines) {
    const prevState: ContentType = state
    state = stateTransition(state, l)
    if (state === prevState) {
      chunk += l
    } else {
      formatTemplate.push({
        type: prevState,
        content: chunk
      })
      formatTemplate.push({
        type: ContentType.delimiter,
        content: l
      })
      chunk = ''
    }
  }
  const latexindentInput = formatTemplate
    .filter(item => item.type === ContentType.latex)
    .reduce((acc, item) => {
      return acc + `${item.content}${LATEXINDENT_SEPARATOR}`
    }, '')
  const latexindentOutput: string = await processLatexindent(latexindentInput)
  const latexindentOutputArray: string[] = latexindentOutput
    .split(LATEXINDENT_SEPARATOR)
  const formattedBody = formatTemplate
    .filter(item => item.content.trim() !== '')
    .reduce((acc, item) => {
      switch (item.type) {
        case ContentType.markdown:
          return acc + prettier.format(item.content, { parser: 'markdown' }).trim() + '\n'
        case ContentType.latex:
          return `${acc}
$
${latexindentOutputArray.shift()?.trim() ?? ''}
$

`
      }
      return acc
    }, '')
  return formattedBody
}

const processLatexindent = async (input: string): Promise<string> => {
  const latexindent = child_process.exec('latexindent --cruft=/tmp')
  if ((latexindent.stdin == null) || (latexindent.stdout == null)) {
    throw new Error('something went wrong with latexindent')
  }
  const inputStream = new ReadableString(input)
  const outputStream = new WritableString()
  await pipeline(inputStream, latexindent.stdin)
  await pipeline(latexindent.stdout, outputStream)
  latexindent.kill()
  return outputStream.toString()
}

const EQUATION_START_REGEX = /^\$\$?\s*$/

const stateTransition = function (prevState: ContentType, line: string): ContentType {
  if (EQUATION_START_REGEX.test(line)) {
    if (prevState === ContentType.latex) {
      return ContentType.markdown
    }
    if (prevState === ContentType.markdown) {
      return ContentType.latex
    }
  }
  return prevState
}

export default format
