<template>
  <nav class="c-breadcrumbs">
    <a v-for="(breadcrumb, index) in breadcrumbs" :key="index" :href="breadcrumb.path"
      :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined" class="c-breadcrumbs__item">
      {{ breadcrumb.title }}
    </a>
  </nav>
</template>

<script setup lang="ts">
import { usePageContext } from '@/renderer/usePageContext'
const { currentPage } = usePageContext();
const breadcrumbs = currentPage?.breadcrumb;
</script>
