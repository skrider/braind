import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import parse from 'src/parse'

const braind = async (): Promise<void> => {
  await yargs(hideBin(process.argv))
    .command('parse', 'parse a file', (yargs) => yargs, async (argv) => {
      return await parse(argv._[1] as string)
    })
    .help()
    .argv
}

void braind()
