<template>
  <div v-if="items?.length" class="c-sidebar__content">
    <h3 class="t-heading-4">
      {{ heading }}
    </h3>
    <div v-for="(item, index) in items" :key="index">
      <a v-bind="linkAttr(item.LinkItem)" class="o-button o-button--black u-full-width mb-2"></a>
      <a v-if="item.SecondaryLinkItem" v-bind="linkAttr(item.SecondaryLinkItem)"
        class="o-button o-button--black u-full-width mb-2">
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LoginType } from '@/enums/loginType';
import { useCommonStore } from '@/stores/commonStore';
import { ref } from 'vue';
const commonStore = useCommonStore();

const props = defineProps<{
  loginType?: number;
  heading?: string;
}>();

const linkAttr = (linkItem: any) => {
  return {
    href: linkItem.href,
    target: linkItem.target,
    title: linkItem.title,
    text: linkItem.text,
  };
};

const items = ref(
  commonStore.siteSettings.loginModalContentArea
    ?.filter((item: any) => {
      // filter out items that don't have LinkItems
      const link = item?.contentLink?.expanded;
      return (
        link.LinkItem &&
        link.LinkItem[0]?.href &&
        (link.LoginType == props.loginType ||
          (props.loginType == LoginType.None && link.LoginType == null))
      );
    })
    .map((item: any) => {
      const linkItem = item.contentLink.expanded.LinkItem[0];
      if (linkItem.href.indexOf('aspx') != -1) {
        linkItem.href = `${import.meta.env.VITE_API_BASE_URL}/account/externallogin/?returnUrl=${window.location.pathname}`;
      }

      // return only LinkItems
      return {
        LinkItem: linkItem,
        SecondaryLinkItem: item.contentLink.expanded.SecondaryLinkItem[0],
      };
    })
);
</script>
