<template>
    <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <h2>{{ t('common.menu') }}</h2>
        </a>
        <hr>
        <ul class="nav flex-column mb-auto">
            <nav-items v-for="(item, index) in navMenu" :key="index" :item="item" />
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import NavItems from '#src/components/NavItems.vue';

const { t } = useI18n();

defineProps(['navMenu']);
</script>