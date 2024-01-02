<template>
    <div class="market-selector-page">
        <div class="market-selector-page__content">
            <h1 class="market-selector-page__title">{{ t('common.header.location') }}</h1>
            <div class="market-selector-page__markets">
                <div class="market-selector-page__markets__item" v-for="(market, index) in marketPages" :key="index">
                    <Link :href="market.url">
                    <span>{{ market.name }}</span>
                    </Link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Link from '#src/renderer/Link.vue';

defineProps(['page', 'marketPages']);

const { t } = useI18n();

</script>
