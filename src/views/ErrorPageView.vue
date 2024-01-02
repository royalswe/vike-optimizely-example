<template>
    <div v-if="page" class="error-page">
        <article>
            <banner-block v-if="page.banner" :block="page.banner" />
            <div v-html="page.bodyText"></div>
        </article>
    </div>
    <div v-else>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <h1>Whoops, something is wrong</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    errorPageId: number;
}>();

const page: any = props.errorPageId ? fetchErrorPage() : null;

async function fetchErrorPage() {
    return null; // TODO: fetch error page
}

</script>