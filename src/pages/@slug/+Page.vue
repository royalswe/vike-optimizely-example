<template>
    <div>
        <header-component>
            <template #headerLogo>
                <Link :href="marketStartPage" class="c-compact-header__logo-link">
                <img :src="'/static/img/temp-logo-green.svg'" class="c-compact-header__logo-image" alt="logo" />
                </Link>
            </template>
        </header-component>

        <aside class="left-menu">
            <div class="menu-header">
                <h2>Menu</h2>
            </div>
            <nav-items v-for="(item, index) in navMenu" :key="index" :item="item" />
        </aside>

        <client-only>
            <h3>Everything between client-only tag, runs only on client side only</h3>
        </client-only>


        <footer-component />

    </div>
</template>

<style scoped>
.left-menu {
    width: 200px;
    /* Adjust the width as needed */
    height: 100%;
    /* Adjust the background color as needed */
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
}

/* Add any additional styling for NavItems component */
</style>

<script setup lang="ts">
import HeaderComponent from '#src/components/HeaderComponent.vue';
import FooterComponent from '#src/components/FooterComponent.vue';
import NavItems from '#src/components/NavItems.vue';


import { onErrorCaptured, ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import Link from '#src/renderer/Link.vue';
import { usePageContext } from '#src/renderer/usePageContext';
import { ClientOnly } from '#src/renderer/ClientOnly';
import { initFlashMessage } from '#src/models/flashMessage';

defineProps(['navMenu']);


const { t } = useI18n();
const pageContext = usePageContext();
const $flashMessage = inject('$flashMessage', initFlashMessage());

const marketStartPage = pageContext.market;

const error = ref(false);

onErrorCaptured((callback) => {
    error.value = true;
    $flashMessage.duration = 999999; // show message in 16 minutes
    $flashMessage.show = true;
    $flashMessage.text = t('common.errors.unknown');
    console.error(callback);
    return false;
})

</script>