<template>
  <div class="p-5 bg-warning" role="dialog" aria-modal="true">
    <div v-click-outside="clickedOutside" class="modal-content">
      <div class="modal-header">
        <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
        <h5 class="modal-title">{{ t('common.selectstartpagemodal.header') }}</h5>
      </div>
      <div class="modal-body">
        <p>{{ t('common.selectstartpagemodal.text') }}</p>
        <div v-for="(startPage, index) in pageContext.siteSettings.startPageSelectionList" :key="index" class="mb-2">
          <Link :href="startPage.href" class="nav nav-link text-dark">
          {{ startPage.title ?? startPage.text }}
          </Link>
        </div>
      </div>
      <div class="modal-footer py-3">
        <button type="button" class="btn btn-secondary me-3" @click.prevent="emit('close')">
          {{ t('common.selectstartpagemodal.closemodal') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageContext } from '#src/renderer/usePageContext';
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import Link from '#src/renderer/Link.vue';

const emit = defineEmits(['close']);
const clickedOutside = (event: Event) => event && emit('close');

const { t } = useI18n();
const pageContext = usePageContext();

onMounted(() => {
  const firstInput = document.querySelector('.start-page-selector-list-input') as HTMLElement;
  if (firstInput) {
    firstInput.focus();
  }
});
</script>
