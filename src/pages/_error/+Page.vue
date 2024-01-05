<template>
  <div v-if="abortStatusCode === 404">
    <h1>404 Page Not Found</h1>
    <p>This page could not be found.</p>
  </div>
  <div v-else role="main">
    <h1>{{ abortStatusCode }}</h1>
    <p>
      {{ abortReason ? abortReason : 'Error! Something went wrong.' }}
    </p>
  </div>
</template>


<script setup lang="ts">
import { usePageContext } from '#src/renderer/usePageContext';

const { abortReason, abortStatusCode } = usePageContext();
</script>
