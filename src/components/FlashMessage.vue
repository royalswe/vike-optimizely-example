<template>
    <transition :duration="{ enter: $flashMessage.duration || 5000, leave: 250 }" @after-enter="$flashMessage.show = false">
        <div v-if="$flashMessage.show" class="alert alert-danger d-flex align-items-center">
            <span class="alert-icon material-symbols-outlined">{{ $flashMessage.icon }}</span>
            <span class="alert-text">
                <strong>{{ $flashMessage?.title }}</strong> {{ $flashMessage?.text }}
            </span>
            <span @click.prevent="$flashMessage.show = false" class="close" aria-label="Close"></span>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { initFlashMessage } from '#src/models/flashMessage';

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