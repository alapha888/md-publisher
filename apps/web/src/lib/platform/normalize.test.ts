import { describe, expect, it } from 'vitest'
import { normalizeMarkdownForPlatform } from './normalize'

describe(`normalizeMarkdownForPlatform`, () => {
  it(`微信平台原样返回`, () => {
    const md = `# 标题\n\n\`\`\`js\ncode\n\`\`\`\n`
    expect(normalizeMarkdownForPlatform(md, `wechat`)).toBe(md)
  })

  it(`知乎平台清理行尾空白并统一换行`, () => {
    const md = `# 标题   \r\n\r\n正文  \n`
    expect(normalizeMarkdownForPlatform(md, `zhihu`)).toBe(`# 标题\n\n正文\n`)
  })

  it(`掘金平台规范化代码语言别名`, () => {
    const md = `\`\`\`js\nconsole.log(1)\n\`\`\`\n\n\`\`\`py\nprint(1)\n\`\`\`\n\n\`\`\`rust\nfn main() {}\n\`\`\`\n`
    const out = normalizeMarkdownForPlatform(md, `juejin`)
    expect(out).toContain(`\`\`\`javascript`)
    expect(out).toContain(`\`\`\`python`)
    // 未知语言保持原样
    expect(out).toContain(`\`\`\`rust`)
  })

  it(`掘金平台无语言标注的代码块不受影响`, () => {
    const md = `\`\`\`\nplain\n\`\`\`\n`
    expect(normalizeMarkdownForPlatform(md, `juejin`)).toBe(md)
  })
})
