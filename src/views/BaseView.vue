<template>
    <div>
        <client-only>
            <notice-block v-for="(noticeBlock, index) in notices" :block="noticeBlock" :key="index" />
            <notice-block v-for="(noticeBlock, index) in childNotices" :block="noticeBlock" :key="index" />
        </client-only>
        <header-component>
            <Link :href="'/'" class="navbar-brand d-flex align-items-center">
            <img :src="'/static/img/vike-oblique.svg'" class="navbar-brand__logo-image" alt="logo" />
            <h1 class="navbar-brand__title ms-2">{{ t('common.greetings') }}</h1>
            </Link>
        </header-component>

        <div class="row g-0 flex-grow-1">
            <aside class="col-md-3 bg-dark">
                <nav-bar :navMenu="navMenu" />
            </aside>

            <main class="col-md-9">
                <slot />
                <button class="btn btn-primary m-5" @click="showModal = true">
                    {{ t('common.selectstartpagemodal.header') }}
                </button>
            </main>
        </div>

        <client-only>
            <Teleport to="#modal-container">
                <start-page-selector v-if="showModal" @close="showModal = false" />
            </Teleport>
        </client-only>

        <footer-component />
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import HeaderComponent from '#src/components/HeaderComponent.vue';
import FooterComponent from '#src/components/FooterComponent.vue';
import Link from '#src/renderer/Link.vue';
import NavBar from '#src/components/NavBar.vue';

import { ClientOnly } from '#src/renderer/ClientOnly';

import { runOnClient } from '#src/utils/ssrUtils';

// Load theese components asynchronously because they are not used often.
const NoticeBlock = defineAsyncComponent(() => import('#src/components/blocks/NoticeBlock.vue'));
const StartPageSelector = defineAsyncComponent(() => import('#src/components/modals/StartPageSelectorComponent.vue'));

defineProps(['navMenu', 'rootPage', 'notices', 'childNotices', 'route']);

const { t } = useI18n();

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