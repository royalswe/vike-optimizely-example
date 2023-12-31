<template>
    <div>
        <header-component>
            <template #headerLogo>
                <Link :href="marketStartPage" class="c-compact-header__logo-link">
                <img :src="'/static/img/temp-logo-green.svg'" class="c-compact-header__logo-image" alt="logo" />
                </Link>
            </template>
        </header-component>
        <c-sidebar :sidebarId="'mainMenu'" :modifiers="[]">
            <template #header>
                <Link :href="marketStartPage">
                <img :src="'/static/img/logo.svg'" class="c-sidebar__logo" alt="logo" />
                </Link>
                <span class="js-toggle-open u-float-right" data-element-id="mainMenu">
                    <i class="material-icons c-sidebar__header-icon">close</i>
                </span>
            </template>
            <template #nav>
                <c-sidebar-nav v-if="navMenu" :menus="navMenu.menuHeading">
                    <nav-items v-for="(item, index) in navMenu.items" :key="index" :item="item" />
                </c-sidebar-nav>
                <Link class="o-button o-button--black u-full-width mt-3">
                {{ t('common.header.tostartpage') }}
                <img :src="'/static/img/logo.svg'">
                </Link>

                <span class="o-line o-line--thin o-line--grey mt-4 mb-3"></span>
                <div class="u-float-right">
                    <a href="/" class="c-sidebar__location">
                        {{ t('common.header.location') }}
                        <i class="material-icons">language</i>
                    </a>
                    <button type="button" class="c-sidebar__location js-modal-trigger" data-target="#selectStartPageModal">
                        {{ t('common.header.selectstartpage') }}
                        <i class="material-icons">home</i>
                    </button>
                </div>

                <c-social :items="socialItems" />
            </template>
        </c-sidebar>
        <c-sidebar :sidebarId="'loginMenu'" :modifiers="[
            {
                prefix: 'c-sidebar-container',
                modifiers: ['right', 'yellow'],
            },
            {
                prefix: 'c-sidebar',
                modifiers: ['yellow'],
            },
        ]">
            <template #header>
                <i class="material-icons c-sidebar__header-icon">account_circle</i>
                <span class="c-sidebar__toggle c-sidebar__toggle--close js-toggle-open u-float-right"
                    data-element-id="loginMenu">
                    <i class="material-icons c-sidebar__header-icon">close</i>
                </span>
            </template>

        </c-sidebar>

        <client-only>
            <h3>Everything between client-only tag, runs only on client side only</h3>
        </client-only>


        <footer-component />

    </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import NavItems from '@/components/NavItems.vue';


import { onErrorCaptured, ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import Link from '@/renderer/Link.vue';
import { usePageContext } from '@/renderer/usePageContext'
import { ClientOnly } from '@/renderer/ClientOnly';
import { initFlashMessage } from '@/models/flashMessage';

defineProps(['navMenu'])


const { t } = useI18n();
const pageContext = usePageContext()
const $flashMessage = inject('$flashMessage', initFlashMessage());

const marketStartPage = pageContext.market;

const error = ref(false);

const socialItems = [
    new SocialItem({
        url: 'https://www.facebook.com/',
        title: 'Facebook',
        text: 'Facebook',
        name: 'facebook'
    }),
    new SocialItem({
        url: 'https://twitter.com/',
        title: 'Twitter',
        text: 'Twitter',
        name: 'twitter'
    }),
    new SocialItem({
        url: 'https://www.linkedin.com/',
        title: 'LinkedIn',
        text: 'LinkedIn',
        name: 'linkedin'
    }),
    new SocialItem({
        url: 'https://www.instagram.com/',
        title: 'Instagram',
        text: 'Instagram',
        name: 'instagram'
    })
];


onErrorCaptured((callback) => {
    error.value = true;
    $flashMessage.duration = 999999; // show message in 16 minutes
    $flashMessage.show = true;
    $flashMessage.text = t('common.errors.unknown');
    console.error(callback);
    return false;
})

</script>