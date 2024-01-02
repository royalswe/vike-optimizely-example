<template>
    <header-component>
        <template #headerLogo>
            <img :src="'/static/img/temp-logo-green.svg'" class="c-compact-header__logo-image" alt="logo" />
        </template>
    </header-component>
    <div class="choose-market-page">
        <div class="market-selection">
            <h1>{{ t('common.header.selectstartpage') }}</h1>
            <div class="market-list">
                <div v-for="(market, index) in marketPages" :key="index" class="market-item">
                    <Link :href="market.url">
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
.choose-market-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

h1 {
    color: #04a300;
    font-family: sans-serif;
}

.market-selection {
    text-align: center;
}

.market-list {
    margin-top: 20px;
}

.market-item {
    margin-bottom: 10px;
}

/* Add any additional styling as needed */
</style>
  