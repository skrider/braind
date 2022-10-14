import fs from 'fs'
import { DEFAULT_OPTIONS } from 'src/constants'
import { merge } from 'lodash'
import YAML from 'yaml'

// this file is responsible for parsing a markdown file

// const FRONTMATTER_REGEX = /^[.-]{3}([\w\s\d]*?)\n[.-]{3}$/
const FRONTMATTER_REGEX = /^[.-]{3}\n([\w\W]*)\n[.-]{3}/

async function parse (path: string): Promise<BraindNote> {
  const text = fs.readFileSync(path, 'utf8')
  const config: BraindOptions = DEFAULT_OPTIONS
  const match = FRONTMATTER_REGEX.exec(text)
  let frontmatter = ''
  let body = ''
  if (match != null) {
    const parsedConfig: BraindOptions = YAML.parse(match[1])
    merge(config, parsedConfig)
    frontmatter = match[1]
    body = text.slice(match[0].length)
  } else {
    body = text
  }
  const note: BraindNote = {
    path,
    body,
    frontmatter,
    properties: config
  }
  return note
}

export default parse
