<template>
  <div>
    <suspense>
      <template #default>
        <div>
          <component v-if="component" :is="component" :page="page" />
        </div>
      </template>
      <template #fallback>
        <o-loader class="u-width-100">
          {{ t('common.loading') }}
        </o-loader>
      </template>
    </suspense>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

import { usePageContext } from '#src/renderer/usePageContext'

import { defineAsyncComponent, markRaw, ref, watch, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import { initFlashMessage } from '#src/models/flashMessage';
import popoverService from '#src/services/popoverService';

const pageContext = usePageContext();
const $flashMessage = inject('$flashMessage', initFlashMessage());

const { t } = useI18n();

const page = ref<any | null>(null);
const component = ref<Component | null>(null);
const error = ref(false);

const initPage = async () => {
  error.value = false;
  if (pageContext.currentPage.PageTypeName === pageContext.currentPage.DetailsPage) {
    component.value = markRaw(defineAsyncComponent(() => import(`#src/views/${pageContext.currentPage.DetailsPage}View.vue`)));
  }
  else {
    try {
      await getContent()
    } catch {
      error.value = true;
    }
  }
}

const getContent = async () => {
  page.value = pageContext.documentProps;
  // if you are logged out and try to access a page that requires authentication
  if (pageContext.currentPage.PageTypeName === 'ApplicationContentPage' && !page.value?.contentType?.length) {
    $flashMessage.modifiers = ['attention'];
    $flashMessage.show = true;
    $flashMessage.text = t('identity.login');
    return;
  }

  const pageType = page.value.contentType.last();
  component.value = markRaw(defineAsyncComponent(() => import(`#src/views/${pageType}View.vue`)));

  // Init/Add popovers
  if (pageContext.siteSettings?.popovers) {
    popoverService.initPopovers(pageContext.siteSettings.popovers);
  }
}

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
})

await initPage();
</script>