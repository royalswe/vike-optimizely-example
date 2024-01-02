<template>
  <div data-element-id="NoticeBlock" class="c-alert" :class="'c-alert--' + block?.type + ' c-alert--flex'">
    <span class="c-alert__icon">
      <span class="mdi" :class="icon"></span>
    </span>
    <div class="c-alert__text">
      <div v-html="block?.content">
      </div>
      <div v-if="block?.link" class="buttons">
        <a :href="block.link.value" class="o-button o-button--primary">{{
          block?.linkText
        }}</a>
      </div>
    </div>
    <span class="js-close-alert c-alert__close" data-element-id="NoticeBlock" @click.prevent="block.onlyShowOnce">
    </span>
  </div>
</template>

<script setup lang="ts">
import type { NoticeBlock } from '#src/models/blocks/local/noticeBlock';

const props = defineProps<{
  block: NoticeBlock;
}>();

let icon = "mdi-close-circle";
switch (props.block?.type) {
  case "info":
    icon = "mdi-information";
    break;
  case "success":
    icon = "mdi-check";
    break;
  case "warning":
    icon = "mdi-alert";
    break;
  case "error":
    icon = "mdi-close-circle";
    break;
  case "attention":
    icon = "mdi-alert-circle";
    break;
}

</script>
