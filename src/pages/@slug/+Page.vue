<template>
    <div>
        <flash-message />
        <!-- Teleport modals to this element -->
        <div id="modal-container"></div>
        <suspense>
            <base-view v-if="!isStyleApp" v-bind="$props">
                <default-page-view />
            </base-view>
            <default-page-view v-else />
        </suspense>
    </div>
</template>

<script setup lang="ts">
import BaseView from '#src/views/BaseView.vue';
import DefaultPageView from '#src/views/DefaultPageView.vue';
import { usePageContext } from '#src/renderer/usePageContext';
import { inject, onErrorCaptured } from 'vue';
import { initFlashMessage } from '#src/models/flashMessage';
import FlashMessage from '#src/components/FlashMessage.vue';
import { useI18n } from 'vue-i18n';

defineProps(['navMenu', 'rootPage', 'notices', 'childNotices', 'route']);

const isStyleApp = usePageContext().isStyleApp;
const $flashMessage = inject('$flashMessage', initFlashMessage());
const { t } = useI18n();

// Catches error in suspense
onErrorCaptured((callback) => {
    $flashMessage.duration = 999999; // show message in 16 minutes
    $flashMessage.show = true;
    $flashMessage.text = t('common.errors.unknown');
    console.error(callback);
    return false;
})

</script>