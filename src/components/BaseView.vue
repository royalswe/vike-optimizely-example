<template>
    <div>
        <client-only>
            <notice-block v-for="(noticeBlock, index) in notices" :block="noticeBlock" :key="index" />
            <notice-block v-for="(noticeBlock, index) in childNotices" :block="noticeBlock" :key="index" />
        </client-only>

        <header-component>
            <template #headerLogo>
                <Link :href="marketStartPage" class="c-compact-header__logo-link">
                <img :src="'/static/img/temp-logo-green.svg'" class="c-compact-header__logo-image" alt="logo" />
                </Link>
            </template>
        </header-component>

        <client-only>
            <Teleport to="#modal-container">
                <start-page-selector v-if="showModal" @close="showModal = false" />
            </Teleport>
        </client-only>

        <slot />

        <footer-component />
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import HeaderComponent from '#src/components/HeaderComponent.vue';
import FooterComponent from '#src/components/FooterComponent.vue';
import Link from '#src/renderer/Link.vue';
import { ClientOnly } from '#src/renderer/ClientOnly';

import { usePageContext } from '#src/renderer/usePageContext';
import { PageContext } from '#src/renderer/types';
import { runOnClient } from '#src/utils/ssrUtils';

const NoticeBlock = defineAsyncComponent(() => import('#src/components/blocks/NoticeBlock.vue'));
const StartPageSelector = defineAsyncComponent(() => import('#src/components/modals/StartPageSelectorComponent.vue'));

defineProps(['navMenu', 'rootPage', 'notices', 'childNotices', 'route']);

const { t } = useI18n();

const pageContext = usePageContext();
const user = pageContext.user;
const marketStartPage = pageContext.market;
const userNavigationItems: any = ref();
const userProfileNavigationItems: any = ref([]);

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
const returnUrl = pageContext.fullUrl.replace('https:', '');

const showModal = ref(false);

onMounted(async () => {
    const emailService = (await import('#src/services/emailService')).default;

    // Get all elements with the class "obfEmail"
    const obfEmailElements = document.querySelectorAll(".obfEmail");

    function defuscateEmail(event: { target: any; }) {
        console.log("Touch event:", event);
        const element = event.target;
        element.outerHTML = emailService.defuscateEmail(element?.outerHTML) ?? '';

        // Your touch event handling logic here
    }
    // Defuscate email on hover and touch
    obfEmailElements.forEach((element) => {
        element.addEventListener("mouseover", defuscateEmail);
        element.addEventListener("touchstart", defuscateEmail);
    });
});

runOnClient(() => {
    // setupUserNavigationItems();
    // setCookies(pageContext);
});

</script>