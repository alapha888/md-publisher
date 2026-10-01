import type { ExportPlatform } from '@/stores/platform'

/**
 * 掘金代码块语言别名 → 掘金编辑器可识别的规范名称。
 * 只做别名归一，不改动代码内容本身。
 */
const JUEJIN_LANG_ALIAS: Record<string, string> = {
  'js': `javascript`,
  'jsx': `javascript`,
  'ts': `typescript`,
  'tsx': `typescript`,
  'py': `python`,
  'py3': `python`,
  'sh': `bash`,
  'shell': `bash`,
  'zsh': `bash`,
  'yml': `yaml`,
  'golang': `go`,
  'cplusplus': `cpp`,
  'c++': `cpp`,
  'c#': `csharp`,
  'md': `markdown`,
  'dockerfile': `docker`,
}

/**
 * 把编辑器里的 Markdown 按目标平台做轻量适配。
 *
 * 设计原则（只做加法）：
 * - 微信：原样返回，走 doocs/md 现有的 HTML 渲染管线，不动。
 * - 知乎/掘金：两家编辑器原生支持 Markdown 粘贴，这里只做三件事——
 *   1. 统一换行符、去掉行尾多余空白，保证跨平台粘贴不乱；
 *   2. 图片：用户在编辑器里上传的图片已由图床模块改写为 URL，这里不二次处理；
 *   3. 掘金：规范化代码块语言标注（别名映射），避免高亮失效。
 */
export function normalizeMarkdownForPlatform(md: string, platform: ExportPlatform): string {
  if (platform === `wechat`)
    return md

  // 统一换行符 + 清理行尾空白（知乎/掘金对行尾空格敏感，顺手清掉）
  let out = md.replace(/\r\n?/g, `\n`).replace(/[ \t]+$/gm, ``)

  if (platform === `juejin`) {
    // 规范化围栏代码块的语言标注：```js → ```javascript
    out = out.replace(/^```([^\s`]*)/gm, (match, lang: string) => {
      if (!lang)
        return match
      const normalized = JUEJIN_LANG_ALIAS[lang.toLowerCase()] ?? lang
      return `\`\`\`${normalized}`
    })
  }

  return out
}
