<template>
  <!DOCTYPE html>
  <flash-message />

  <suspense>
    <slot />
  </suspense>
</template>

<script setup lang="ts">
import FlashMessage from '@/components/FlashMessage.vue';
</script>