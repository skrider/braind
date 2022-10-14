import child_process from 'child_process'
import { pipeline } from 'stream/promises'
import { ReadableString, hash, WritableString } from 'src/utils'

const CONTENT_SEPARATOR = 'braindbraindbraind'

interface FormatTemplate {
  type: ContentType
  content: string
  contentHash: string
}

interface BatchProcessTemplate extends FormatTemplate {
  oldIndex: number
}

enum ContentType {
  markdown,
  latex,
  delimiter
}

interface FormatCache {
  hashSet: Set<string>
}

const format = async function (note: BraindNote, cache: FormatCache): Promise<{
  output: string
  cache: FormatCache
}> {
  const parsedBody = parseBody(note.text)

  let misses = 0

  const { latexAcc, markdownAcc } = parsedBody
    .reduce<{
    latexAcc: BatchProcessTemplate[]
    markdownAcc: BatchProcessTemplate[]
  }>(({ latexAcc, markdownAcc }, item, index) => {
    if (!cache.hashSet.has(item.contentHash)) {
      misses += 1
      console.log(item.contentHash)
      switch (item.type) {
        case ContentType.markdown:
          markdownAcc.push({
            ...item,
            oldIndex: index
          })
          break
        case ContentType.latex:
          latexAcc.push({
            ...item,
            oldIndex: index
          })
          break
      }
    }
    return { latexAcc, markdownAcc }
  }, {
    latexAcc: [],
    markdownAcc: []
  })
  console.log(misses)
  console.log(latexAcc.length)
  console.log(markdownAcc.length)
  await processExternalFormatter(latexAcc, 'latexindent --cruft=/tmp')
  await processExternalFormatter(markdownAcc, 'markdownfmt')
  latexAcc.concat(markdownAcc).forEach((item) => {
    parsedBody[item.oldIndex].content = item.content
    parsedBody[item.oldIndex].contentHash = hash(item.content)
  })
  cache.hashSet.clear()
  parsedBody.forEach(item => cache.hashSet.add(item.contentHash))
  return {
    output: serializeBody(parsedBody),
    cache
  }
}

const parseBody = function (body: string): FormatTemplate[] {
  const lines = body.split(/(?<=\n)/)
  const formatTemplate: FormatTemplate[] = []
  let state: ContentType = ContentType.markdown
  let chunk = ''
  for (const l of lines) {
    const prevState: ContentType = state
    state = stateTransition(state, l)
    if (state === prevState) {
      chunk = chunk + l
    } else {
      formatTemplate.push({
        type: prevState,
        content: chunk,
        contentHash: hash(chunk)
      })
      formatTemplate.push({
        type: ContentType.delimiter,
        content: l,
        contentHash: ''
      })
      chunk = ''
    }
  }
  return formatTemplate
}

const serializeBody = function (parsedBody: FormatTemplate[]): string {
  const formattedBody = parsedBody
    .filter(item => item.content.trim() !== '')
    .reduce((acc, item) => {
      switch (item.type) {
        case ContentType.markdown:
          return acc + item.content + '\n'
        case ContentType.latex:
          return `${acc}
$
${item.content}
$

`
      }
      return acc
    }, '')
  return formattedBody
}

const processExternalFormatter = async (input: BatchProcessTemplate[], argv: string): Promise<void> => {
  const inputString = input
    .reduce((acc, item) => {
      return acc + `${item.content}${CONTENT_SEPARATOR}`
    }, '')
  const formatter = child_process.exec(argv)
  if ((formatter.stdin == null) || (formatter.stdout == null)) {
    throw new Error(`something went wrong with ${argv}`)
  }
  const inputStream = new ReadableString(inputString)
  const outputStream = new WritableString()
  await pipeline(inputStream, formatter.stdin)
  await pipeline(formatter.stdout, outputStream)
  formatter.kill()
  const output: string[] = outputStream.toString().split(CONTENT_SEPARATOR)
  // process side effect
  input.forEach((item, index) => {
    item.content = output[index].trim()
  })
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
