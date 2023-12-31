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
        <c-sidebar :sidebarId="'mainMenu'" :modifiers="[]">
            <template #header>
                <Link :href="marketStartPage">
                <img :src="'/static/img/temp-logo-green.svg'" class="c-sidebar__logo" alt="logo" />
                </Link>
                <button type="button" class="js-toggle-open u-float-right" data-element-id="mainMenu">
                    <i class="material-icons c-sidebar__header-icon">close</i>
                </button>
            </template>
            <template #nav>
                <c-sidebar-nav v-if="navMenu" :menus="navMenu.menuHeading">
                    <nav-items v-for="(item, index) in navMenu.items" :key="index" :item="item" />
                </c-sidebar-nav>
                <search-field-component :minInputLength="1" :minItemLength="0" :classNames="'u-full-width'" />
                <Link
                    v-if="route?.marketPagePath !== pageContext?.urlPathname && pageContext?.urlPathname !== marketStartPage"
                    :href="marketStartPage" class="o-button o-button--black u-full-width mt-3">
                {{ t('common.header.tostartpage') }}
                <img :src="'/static/img/temp-icon-white.png'">
                </Link>

                <span class="o-line o-line--thin o-line--grey mt-4 mb-3"></span>
                <div class="u-float-right">
                    <Link :href="`/location/`" target="_self" rel="shortcut" class="c-sidebar__location">
                    {{ t('common.header.location') }}
                    <i class="material-icons">language</i>
                    </Link>
                    <button v-if="pageContext.siteSettings?.startPageSelectionList?.length" type="button"
                        class="c-sidebar__location" @click.stop="showModal = true">
                        {{ t('common.header.selectstartpage') }}
                        <i class="material-icons">home</i>
                    </button>
                </div>
                <c-social v-if="socialItems?.length" :items="socialItems" />
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

            <template #content v-if="pageContext.siteSettings">
                <login-component :heading="t('loginmodal.member')" :loginType="LoginType.Member"></login-component>
                <login-component :heading="t('loginmodal.customer')" :loginType="LoginType.PulpPlus"></login-component>
                <login-component :heading="t('loginmodal.wood')" :loginType="LoginType.Wood"></login-component>
                <login-component :heading="t('loginmodal.entrepreneur')" :loginType="LoginType.None"></login-component>

                <div class="c-sidebar__content">
                    <a :href="`${baseApiUrl}/account/externallogin/?returnUrl=${returnUrl}/`" rel="nofollow"
                        :title="t('loginmodal.editors')" class="o-button o-button--black u-full-width">
                        <i class="material-icons">lock</i>
                        {{ t('loginmodal.editors') }}
                    </a>
                    <a v-if="pageContext.siteSettings?.gdprLoginText && pageContext.siteSettings?.gdprLoginLink"
                        :href="pageContext.siteSettings.gdprLoginLink.url" :title="pageContext.siteSettings.gdprLoginText"
                        class="o-button o-button--black u-full-width">{{
                            pageContext.siteSettings.gdprLoginText
                        }}</a>
                </div>
            </template>
        </c-sidebar>
        <c-sidebar v-if="user" :sidebarId="'loggedInMenu'" :modifiers="[
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
                <span class="c-sidebar__header-label ms-3">
                    {{ user.Name }}
                </span>
                <span class="c-sidebar__toggle c-sidebar__toggle--close js-toggle-open u-float-right"
                    data-element-id="loggedInMenu">
                    <i class="material-icons c-sidebar__header-icon">close</i>
                </span>
            </template>
            <template #content v-if="pageContext.siteSettings?.loginModalContentArea">
                <c-sidebar-nav v-if="userNavigationItems" :menus="userNavigationItems.heading" :modifiers="['yellow']">
                    <nav-items v-for="(item, index) in userNavigationItems.items" :key="index" :item="item" />
                </c-sidebar-nav>

                <div class="c-contact-card">
                    <div v-if="user.Thumbnail" class="c-contact-card__image">
                        <img :src="user.Thumbnail">
                    </div>
                    <div class="c-contact-card__information">
                        <span class="c-contact-card__information-row"><strong>{{ user.Name
                        }}</strong></span>
                        <span v-if="user.Telephone" class="c-contact-card__information-row">
                            {{ t('usernav.phone') }}:
                            <a class="tel" :href="`tel:${user.Telephone}`">
                                {{ user.Telephone }}
                            </a>
                        </span>
                        <span v-if="user.Email" class="c-contact-card__information-row">
                            {{ t('usernav.email') }}:
                            <a :href="`mailto:${user.Email}`">
                                {{ user.Email }}
                            </a>
                        </span>
                    </div>
                </div>

                <ul class="u-no-padding u-list-style-none ml-0">
                    <li class="my-2" v-for="(item, index) in userProfileNavigationItems" :key="index">
                        <Link class="o-text-link o-text-link--grey" :href="item.url" :target="item.url">
                        <i v-if="item.icon" class="material-icons">{{ item.icon }}</i>
                        {{ item.text }}
                        </Link>
                    </li>
                    <li class="my-2">
                        <a :href="`${baseApiUrl}/account/logout?lang=${pageContext.locale}&returnHost=${returnUrl}`"
                            class="o-text-link o-text-link--grey">
                            <i class="material-icons">exit_to_app</i>
                            {{ t('identity.logout') }}
                        </a>
                    </li>
                </ul>

            </template>
        </c-sidebar>

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

import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import HeaderComponent from '#src/components/HeaderComponent.vue';
import FooterComponent from '#src/components/FooterComponent.vue';
import SearchFieldComponent from '#src/components/SearchFieldComponent.vue';
import NavItems from '#src/components/NavItems.vue';
import LoginComponent from '#src/components/LoginComponent.vue';
import Link from '#src/renderer/Link.vue';
import { ClientOnly } from '#src/renderer/ClientOnly';

import { LoginType } from '#src/enums/loginType';

import navigationService from '#src/services/navigationService';
import socialService from '#src/services/socialService';
import { usePageContext } from '#src/renderer/usePageContext';
import { PageContext } from '#src/renderer/types';
import { isClientOnly } from '#src/utils/ssrUtils';

const NoticeBlock = defineAsyncComponent(() => import('#src/components/blocks/NoticeBlock.vue'));
const StartPageSelector = defineAsyncComponent(() => import('#src/components/modals/StartPageSelectorComponent.vue'));

defineProps(['navMenu', 'rootPage', 'notices', 'childNotices', 'route'])

const { t } = useI18n();

const pageContext = usePageContext();
const user = pageContext.user;
const marketStartPage = pageContext.market;
const userNavigationItems: any = ref();
const userProfileNavigationItems: any = ref([]);

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
const returnUrl = pageContext.fullUrl.replace('https:', '');

const showModal = ref(false);

const socialItems = computed(() =>
    socialService.getSocialItems(pageContext.siteSettings)
);

onMounted(async () => {
    const emailService = (await import('#src/services/emailService')).default;

    // Defuscate email on hover and click
    eventsHelper.live(
        '.obfEmail',
        'mouseover',
        (_: Event, element: HTMLElement) => {
            element.outerHTML = emailService.defuscateEmail(element?.outerHTML) ?? '';
        }
    );

    // Defuscate email on hover and touch with mobile
    eventsHelper.live(
        '.obfEmail',
        'touch',
        (_: Event, element: HTMLElement) => {
            // Defuscate email on hover and click
            element.outerHTML = emailService.defuscateEmail(element?.outerHTML) ?? '';
        }
    );

    // Set links to router links
    navigationService.setAnchorsToRouterLink();
});

const setupUserNavigationItems = async () => {
    if (!user || !pageContext.marketPageId) {
        return;
    }
    try {
        // Fetch user navigation data
        const userNavigationResponse = await import('#src/services/accountService').then((accountService) =>
            accountService.default.getUserNavigation(pageContext.marketPageId, pageContext.locale)
        );

        // Initialize result arrays
        const userNavigationItemsResult: SidebarNavItem[] = [];
        const userProfileNavigationItemsResult: any[] = [];
        // Process user navigation data
        for (const group of userNavigationResponse) {
            if (group[0].UserNavGroupName == 'profile') {
                // Handle profile links
                for (const profileLink of group) {
                    userProfileNavigationItemsResult.push({
                        url: profileLink.Url,
                        id: profileLink.ContentLink,
                        text: profileLink.DisplayName,
                        icon: profileLink.Icon,
                        language: profileLink.AvailableLanguages[0]?.LanguageCode
                    });

                }
            }
            else {
                userNavigationItemsResult.push({
                    text: group[0].UserNavGroupName,
                    showArrow: true,
                    children: navigationService.MapNavItemToMenuItem(group)
                } as SidebarNavItem);
            }
        }

        userNavigationItems.value = {
            heading: [''], // We don't want a heading but the Unity component requires array.
            items: userNavigationItemsResult
        };

        userProfileNavigationItems.value = userProfileNavigationItemsResult;
    } catch (error) {
        console.error('An error occured when trying to get user navigation items', error);
    }
}

async function setCookies(pageContext: PageContext) {
    const cookieName = (await import('#src/constants/cookieName')).default;
    const cookieService = (await import('#src/services/cookieService')).default;

    if (pageContext.currentPage && cookieService.userConsentsToFunctionalCookies()) {
        // Set market location code cookie
        if (pageContext.documentProps?.marketLocationCode) {
            cookieService.setCookie(
                cookieName.SelectedStartPageUrl,
                pageContext.urlOriginal
            );
        }

        cookieService.setCookie(
            cookieName.SelectedLanguage,
            pageContext.currentPage.locale
        );
    }
}

isClientOnly(() => {
    setupUserNavigationItems();
    setCookies(pageContext);
});

</script>