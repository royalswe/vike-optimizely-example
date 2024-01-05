<template>
    <header-component>
        <img :src="'/static/img/vike-oblique.svg'" class="navbar-brand__logo-image" alt="logo" />
        <h1 class="navbar-brand__title ms-2">{{ t('common.greetings') }}</h1>
    </header-component>

    <div class="container flex-grow-1 d-flex justify-content-center align-items-center mt-4">
        <div>
            <h1 class="mb-4">{{ t('common.header.selectstartpage') }}</h1>
            <div class="list-group list-group-flush">
                <div v-for="(market, index) in marketPages" :key="index" class="list-group-item market-item border-0">
                    <Link :href="market.url" class="text-decoration-none">
                    <span>{{ market.name }}</span>
                    </Link>
                </div>
            </div>
        </div>
    </div>

    <footer-component />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Link from '#src/renderer/Link.vue';

import FooterComponent from '#src/components/FooterComponent.vue';
import HeaderComponent from '#src/components/HeaderComponent.vue';

const { t } = useI18n();
const { marketPages } = defineProps(['marketPages']);
</script>

<style scoped>
h1 {
    color: #04a300;
    font-family: sans-serif;
}
</style>