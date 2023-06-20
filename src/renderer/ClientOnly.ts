// copied from evan vue: https://github.com/vuejs/vitepress/blob/49ddb1f120f1c66c6c8d1a7e388e2f49bdf1c552/src/client/app/components/ClientOnly.ts
// example use: <ClientOnly><MyComponent /></ClientOnly>
// This will only render the component on the client side.
import { ref, onMounted, defineComponent } from 'vue';

export const ClientOnly = defineComponent({
  setup(_, { slots }) {
    const show = ref(false);
    onMounted(() => {
      show.value = true;
    });
    return () => (show.value && slots.default ? slots.default() : null);
  },
});
