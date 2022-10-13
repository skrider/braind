import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import parse from 'src/parse'
import format from 'src/format'

const braind = async (): Promise<void> => {
  await yargs(hideBin(process.argv))
    .command('parse', 'parse a file', (yargs) => yargs, async (argv) => {
      const file = await parse(argv._[1] as string)
      format(file)
    })
    .help()
    .argv
}

void braind()
