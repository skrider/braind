interface BraindNote {
  path: string
  body: string
  frontmatter: string
  properties: BraindOptions
}

interface BraindOptions extends PandocOptions {
  preview: boolean
  template: string
}

interface PandocOptions {
  title: string
}
