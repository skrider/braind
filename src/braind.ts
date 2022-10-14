import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import parse from 'src/parse'
import format from 'src/format'
import { writeFile } from 'fs/promises'
import { FileSystemCache } from 'file-system-cache'
import { resolve } from 'path'
import { hash } from './utils'

const ENV_WORKSPACE_KEY = 'BRAIND_WORKSPACE'

const braind = async (): Promise<void> => {
  const baseArgs = await yargs(hideBin(process.argv)).argv
  const workspace = baseArgs.d as string ?? process.env[ENV_WORKSPACE_KEY] ?? process.cwd()
  console.log(workspace)
  const braindCache = new FileSystemCache({
    basePath: resolve(workspace, '.braind')
  })
  await yargs(hideBin(process.argv))
    .check((argv) => {
      return true
    }, true)
    .command('parse', 'parse a file', (yargs) => yargs, async (argv) => {
      const file = await parse(argv._[1] as string)
      console.log(JSON.stringify(file))
    })
    .command('format', 'format a file', (yargs) => yargs.boolean('w'), async (argv) => {
      const file = await parse(argv._[1] as string)
      const cacheIndex = `file-${hash(file.path)}`
      const setArray = await braindCache.get(cacheIndex, '[]')
      console.log('setArray', setArray)
      const set = new Set<string>(JSON.parse(setArray))
      const { output, cache } = await format(file, { hashSet: set })
      const storeArray = Array.from(cache.hashSet.keys())
      await braindCache.set(cacheIndex, JSON.stringify(storeArray))
      if (argv.w ?? false) {
        await writeFile(file.path, output)
      } else {
        // console.log(output)
      }
    })
    .help()
    .argv
}

void braind()
