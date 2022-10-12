interface BraindNote {
  fd: number
  properties: BraindOptions
}

interface BraindOptions extends PandocOptions {
  preview: boolean
  template: string
}

interface PandocOptions {
  title: string
}
