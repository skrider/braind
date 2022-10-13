import fs from 'fs'
import { DEFAULT_OPTIONS } from 'src/constants'
import { merge } from 'lodash'
import YAML from 'yaml'

// this file is responsible for parsing a markdown file

// const FRONTMATTER_REGEX = /^[.-]{3}([\w\s\d]*?)\n[.-]{3}$/
const FRONTMATTER_REGEX = /^[.-]{3}\n([\w\W]*)\n[.-]{3}/

async function parse (path: string): Promise<BraindNote> {
  const body = fs.readFileSync(path, 'utf8')
  const config: BraindOptions = DEFAULT_OPTIONS
  const match = FRONTMATTER_REGEX.exec(body)
  if (match != null) {
    const parsedConfig: BraindOptions = YAML.parse(match[1])
    merge(config, parsedConfig)
  }
  const note: BraindNote = {
    path,
    text: body,
    properties: config
  }
  return note
}

export default parse
