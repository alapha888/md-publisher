import { store } from '@/storage'
import { addPrefix } from '@/storage/prefix'

/** 目标发布平台：微信公众号 / 知乎 / 稀土掘金 */
export type ExportPlatform = `wechat` | `zhihu` | `juejin`

export const PLATFORM_META: Record<ExportPlatform, { label: string, hint: string }> = {
  wechat: {
    label: `微信公众号`,
    hint: `渲染为微信图文样式，复制后粘贴到公众号后台`,
  },
  zhihu: {
    label: `知乎`,
    hint: `输出干净 Markdown（图片已转图床链接），直接粘贴到知乎编辑器`,
  },
  juejin: {
    label: `稀土掘金`,
    hint: `输出干净 Markdown（代码块语言标注已规范化），直接粘贴到掘金编辑器`,
  },
}

export const PLATFORM_ORDER: ExportPlatform[] = [`wechat`, `zhihu`, `juejin`]

/**
 * 多平台导出状态：当前选中的目标发布平台。
 * 只影响右侧预览区展示哪个面板，不动编辑器、微信渲染与复制逻辑。
 */
export const usePlatformStore = defineStore(`platform`, () => {
  const platform = store.reactive<ExportPlatform>(addPrefix(`export_platform`), `wechat`)

  function setPlatform(p: ExportPlatform) {
    platform.value = p
  }

  const isWechat = computed(() => platform.value === `wechat`)

  return {
    platform,
    setPlatform,
    isWechat,
  }
})
