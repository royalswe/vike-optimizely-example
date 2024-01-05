<template>
    <nav class="bg-secondary-subtle breadcrumbs" v-if="breadcrumbs && breadcrumbs.length">
        <div class="container-fluid">
            <Link v-for="(breadcrumb, index) in breadcrumbs" :key="index" :href="breadcrumb.path"
                :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined" class="breadcrumbs-item">
            {{ breadcrumb.title }}
            </Link>
        </div>
    </nav>
</template>

<script setup lang="ts">
import Link from '#src/renderer/Link.vue';
import { usePageContext } from '#src/renderer/usePageContext';
const pageContext = usePageContext();
const breadcrumbs = pageContext.currentPage?.breadcrumb;

</script>