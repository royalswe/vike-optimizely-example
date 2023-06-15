<template>
  <a v-bind="attributes">
    <slot />
  </a>
</template>
<style scoped>
a {
  padding: 2px 10px;
  margin-left: -10px;
}

a.active {
  background-color: #eee;
}
</style>
<script lang="ts" setup>
//https://vite-plugin-ssr.com/navigate
import { useAttrs } from 'vue'

const { href } = useAttrs()
const isAbsolute = /^https?:\/\//i.test(href)

const attributes = {
  href,
  ...(isAbsolute ? { target: '_blank', rel: 'noopener noreferrer' } : undefined)
}

</script>
