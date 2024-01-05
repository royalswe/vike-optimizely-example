<template>
    <breadcrumbs-component />

    <div class="p-5">
        <h3>Episode 1</h3>

        <p>Captain. Yes, sir? Tell them we wish to board at once. With all due respect, the Ambassadors for the Supreme
            Chancellor wish to board immediately. Yes, yes, of course, as you know, our blockade is perfectly legal, and
            we'd be happy to receive the Ambassador.</p>
        <p>
            It's awful. I die every time Watto makes you do it. But Mom, I love it. The prize money would more than pay for
            the parts they need.</p>
        <p>
            They've probably spotted us. We haven't much time. Jar Jar is on his way to the Gungan city, Master. Good. Do
            you think the Queen's idea will work? The Gungans will not easily be swayed, and we cannot use our power to help
            her.</p>
        <p>
            a quick controlled thrust and he's back on course! Did he crashed? Skywalker's in trouble. Sebulba takes the
            lead. He's catching Sebulba. Inkabunga.</p>
        <p>
            You won't be, Ani. I'm not allowed to train you, so I want you to watch me and be mindful, always remember, your
            focus determines your reality. Stay close to me and you will be safe. Master, sir. I heard Yoda talking about
            midi-chlorians. I've been wondering, what are midi-chlorians? Midi-chlorians are a microcopic lifeform that
            reside within all living cells. They live inside of me? In your cells, yes.</p>

        <img src="/static/img/vike-square-gradient.png" class="lazyload" alt="lazyloaded image" />
    </div>
</template>

<script setup lang="ts">
import BreadcrumbsComponent from '#src/components/BreadcrumbsComponent.vue';

defineProps<{
    page: any;
}>();
</script>
