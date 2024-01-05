<template>
  <div class="d-flex flex-column min-vh-100">
    <slot />
    <admin-buttons v-if="isAdminOrEditor" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { usePageContext } from '#src/renderer/usePageContext';

const AdminButtons = defineAsyncComponent(() => import('#src/components/AdminButtonsComponent.vue'));

const pageContext = usePageContext();
const isAdminOrEditor = ref(false);

import('#src/services/accountService').then(accountService =>
  isAdminOrEditor.value = accountService.default.isEditorOrAdmin(pageContext.user)
);

</script>