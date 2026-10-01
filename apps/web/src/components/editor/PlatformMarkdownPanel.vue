<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { copyPlain } from '@/lib/browser/clipboard'
import { normalizeMarkdownForPlatform } from '@/lib/platform/normalize'
import { usePlatformStore } from '@/stores/platform'
import { usePostStore } from '@/stores/post'

const { t } = useI18n()
const platformStore = usePlatformStore()
const postStore = usePostStore()

const { platform } = storeToRefs(platformStore)

// 原始 Markdown 来自当前文章；平台适配只做轻量规范化（见 normalize.ts），不改原文
const normalizedMarkdown = computed(() => {
  const raw = postStore.currentPost?.content ?? ``
  return normalizeMarkdownForPlatform(raw, platform.value)
})

const isCopying = ref(false)

async function copyMarkdown() {
  isCopying.value = true
  try {
    await copyPlain(normalizedMarkdown.value)
    toast.success(t(`platform.copiedMarkdown`))
  }
  catch {
    toast.error(t(`platform.copyFailed`))
  }
  finally {
    isCopying.value = false
  }
}
</script>

<template>
  <!-- 知乎/掘金导出面板：干净 Markdown 预览 + 一键复制，图片已是图床 URL，可直接粘贴 -->
  <div class="flex h-full flex-col">
    <div class="flex items-center justify-between gap-2 px-3 py-2">
      <p class="text-xs text-muted-foreground">
        {{ t(`platform.imageHint`) }}
      </p>
      <Button size="sm" :disabled="isCopying" @click="copyMarkdown">
        {{ t(`platform.copyMarkdown`) }}
      </Button>
    </div>
    <div class="min-h-0 flex-1 overflow-auto px-3 pb-3">
      <pre
        class="h-full overflow-auto rounded-md border bg-muted/40 p-3 text-xs leading-relaxed whitespace-pre-wrap break-words select-all"
      >{{ normalizedMarkdown }}</pre>
    </div>
  </div>
</template>
