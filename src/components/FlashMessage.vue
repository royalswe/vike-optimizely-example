<template>
    <transition :duration="{ enter: $flashMessage.duration || 5000, leave: 250 }" @after-enter="$flashMessage.show = false">
        <c-alert v-if="$flashMessage.show" :modifiers="$flashMessage.modifiers" :icon="$flashMessage.icon"
            @close="($flashMessage.show = false)">
            <strong>{{ $flashMessage?.title }}</strong> {{ $flashMessage?.text }}
        </c-alert>
    </transition>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { initFlashMessage } from '@/models/flashMessage';
import CAlert from '@sodraskog/unity/vue/components/CAlert.vue';

const $flashMessage = inject('$flashMessage', initFlashMessage());
</script>

<style scoped>
/* enter transitions */
.v-enter-from {
    transform: translateY(-66px);
}

.v-enter-to {
    transition: all 0.3s ease;
    transform: translateY(0px);
    position: sticky;
    top: 0;
}

/* leave transitions */
.v-leave-active {
    transition: all 0.4s ease;
    transform: translateY(-66px);
}
</style>