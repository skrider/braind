interface BraindNote {
  path: string
  text: string
  properties: BraindOptions
}

interface BraindOptions extends PandocOptions {
  preview: boolean
  template: string
}

interface PandocOptions {
  title: string
}
