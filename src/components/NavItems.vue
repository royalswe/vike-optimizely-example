<template>
  <li v-bind="subMenuAttr(!!item.children, isActive)">
    <component :is="item.url ? 'a' : 'span'" :href="item.url" class="nav-link text-white"
      :aria-current="item.url === pageContext.urlPathname ? 'page' : undefined">
      <content />
    </component>
    <sub-menu />
  </li>
</template>

<script setup lang="ts">
import { defineComponent, computed, h } from 'vue';
import NavItem from '#src/components/NavItems.vue';
import { usePageContext } from '#src/renderer/usePageContext';

const props = defineProps<{ item: any; }>();
const pageContext = usePageContext();

const isActive = computed(() => {
  const { urlPathname } = pageContext;
  return props.item.url === '/' ? urlPathname === props.item.url : urlPathname.startsWith(props.item.url as string);
});

const subMenuAttr: any = (submenu: boolean, isActive: boolean) => {
  if (submenu) {
    return {
      'aria-haspopup': 'true',
      'aria-expanded': isActive ? 'true' : 'false',
    };
  }
};

const content = defineComponent({
  setup() {
    return () => [
      props.item.icon ?
        h('i', { class: props.item.icon }) : undefined,
      props.item.text,
      props.item.children ? h('span', { class: 'ms-4' }, [
        h('i', { class: 'bi bi-chevron-down' }), // Bootstrap chevron-down icon
      ]) : undefined
    ];
  }
});

const subMenu = defineComponent({
  setup() {
    return () => props.item.children && [
      h('ul', { class: 'list-unstyled ms-4' }, [
        props.item.children.map((child: { url: string; route: string; }) => h(NavItem, {
          key: child.url ?? child.route,
          item: child
        }))
      ])
    ];
  }
});

</script>
