<template>
  <div id="modal-container"></div>

  <suspense v-if="errorPageId">
    <base-view v-bind="$props">
      <error-page-view :error-page-id="errorPageId" />
    </base-view>
  </suspense>
  <!-- If no error page is set, show a default error page -->
  <main v-else role="main">
    <div>
      <h1>{{ abortStatusCode }}</h1>
      <p>
        {{ abortReason ? abortReason : 'Error! Something went wrong.' }}
      </p>

    </div>
  </main>
</template>

<script setup lang="ts">
import BaseView from '#src/views/BaseView.vue';
import ErrorPageView from '#src/views/ErrorPageView.vue';
import { usePageContext } from '#src/renderer/usePageContext';


const { abortReason, abortStatusCode, siteSettings } = usePageContext();

defineProps(['navMenu', 'rootPage', 'route', 'is404']);

const errorPageId = (siteSettings as any)[`error${abortStatusCode}Page`]?.id ?? undefined;

</script>