import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import parse from 'src/parse'
import format from 'src/format'
import { writeFile } from 'fs/promises'

const braind = async (): Promise<void> => {
  await yargs(hideBin(process.argv))
    .command('parse', 'parse a file', (yargs) => yargs, async (argv) => {
      const file = await parse(argv._[1] as string)
      console.log(JSON.stringify(file))
    })
    .command('format', 'format a file', (yargs) => yargs.boolean('w'), async (argv) => {
      const file = await parse(argv._[1] as string)
      const res = await format(file, { hashSet: new Set() })
      if (argv.w ?? false) {
        await writeFile(file.path, res)
      } else {
        console.log(res)
      }
    })
    .help()
    .argv
}

void braind()
