<template>
  <div>
    <suspense>
      <template #default>
        <component v-if="component" :is="component" :page="page" />
        <loader v-else>
          {{ t('common.loading') }}
        </loader>
      </template>
      <template #fallback>
        <loader>
          {{ t('common.loading') }}
        </loader>
      </template>
    </suspense>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import Loader from '#src/components/Loader.vue';
import { usePageContext } from '#src/renderer/usePageContext';

import { defineAsyncComponent, markRaw, ref, watch, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import { initFlashMessage } from '#src/models/flashMessage';

const pageContext = usePageContext();
const $flashMessage = inject('$flashMessage', initFlashMessage());

const { t } = useI18n();

const page = ref<any | null>(null);
const component = ref<Component | null>(null);
const error = ref(false);

const initPage = async () => {
  error.value = false;

  if (pageContext.currentPage?.PageTypeName && pageContext.currentPage?.PageTypeName === pageContext.currentPage?.DetailsPage) {
    component.value = markRaw(defineAsyncComponent(() => import(`#src/views/${pageContext.currentPage.DetailsPage}View.vue`)));
  }
  else {
    try {
      await getContent();
    } catch {
      error.value = true;
    }
  }
};

const getContent = async () => {
  page.value = pageContext.documentProps;

  const pageType = page.value.contentType.last();
  component.value = markRaw(defineAsyncComponent(() => import(`#src/views/${pageType}View.vue`)));
};

// runs on page change and when preview mode is toggled
watch(() => [pageContext.urlPathname], async () => {
  await initPage();
});

watch(error, (value) => {
  if (value) {
    $flashMessage.duration = 999999; // show message in 16 minutes
    $flashMessage.show = true;
    $flashMessage.text = t('common.errors.unknown');
  }
});

setTimeout(async () => {
  await initPage();
}, 500);
</script>