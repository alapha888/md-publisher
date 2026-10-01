<script setup lang="ts">
import type { ExportPlatform } from '@/stores/platform'
import { PLATFORM_META, PLATFORM_ORDER, usePlatformStore } from '@/stores/platform'

const { t } = useI18n()
const platformStore = usePlatformStore()

const { platform } = storeToRefs(platformStore)

function select(p: ExportPlatform) {
  platformStore.setPlatform(p)
}
</script>

<template>
  <!-- 发布平台切换：只决定右侧预览区展示微信渲染还是干净 Markdown，不动编辑器与原有逻辑 -->
  <div class="flex items-center gap-1 border-b px-3 py-1.5" role="tablist" aria-label="export platform">
    <button
      v-for="p in PLATFORM_ORDER"
      :key="p"
      role="tab"
      :aria-selected="platform === p"
      :title="PLATFORM_META[p].hint"
      class="cursor-pointer rounded-md px-3 py-1 text-xs transition-colors"
      :class="platform === p
        ? `bg-primary text-primary-foreground font-medium`
        : `text-muted-foreground hover:bg-muted hover:text-foreground`"
      @click="select(p)"
    >
      {{ t(`platform.${p}`) }}
    </button>
  </div>
</template>
