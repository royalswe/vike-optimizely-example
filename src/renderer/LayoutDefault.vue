<template>
  <slot />
  <admin-buttons v-if="isAdminOrEditor" />
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