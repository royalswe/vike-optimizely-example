<template>
  <li class="c-sidebar-nav__item" v-bind="subMenuAttr(!!item.children, isActive)">
    <component :is="item.url ? 'a' : 'span'" :href="item.url" class="c-sidebar-nav__link"
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

// a11y attributes for submenu
const subMenuAttr: any = (submenu: boolean, isActive: boolean) => {
  if (submenu) {
    return {
      'aria-haspopup': 'true',
      'aria-expanded': isActive ? 'true' : 'false',
    };
  }
};

// render the text and icons
const content = defineComponent({
  setup() {
    return () => [
      props.item.icon ?
        h('i', { class: 'c-sidebar-nav__symbol-left material-symbols-outlined', innerHTML: props.item.icon }) : undefined,
      props.item.text, // plain text
      props.item.children ? h('span', { class: 'c-sidebar-nav__symbol' }, [
        h('i', { class: 'material-symbols-outlined', innerHTML: 'keyboard_arrow_right' }),
      ]) : undefined
    ];
  }
});

// loop all the children and render them
const subMenu = defineComponent({
  setup() {
    return () => props.item.children && [
      h('button', { 'type': 'button', class: 'c-sidebar-nav__open-submenu', 'aria-expanded': 'false' }, [
        h('i', { class: 'material-icons' }),
      ]),
      h('ul', { class: 'c-sidebar-nav__submenu' }, [
        props.item.children.map((child: { url: string; route: string; }) => h(NavItem, {
          key: child.url ?? child.route,
          item: child
        }))
      ])
    ];
  }
});

</script>