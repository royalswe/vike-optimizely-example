<template>
  <div data-element-id="NoticeBlock" class="alert" :class="'alert-' + block?.type + ' d-flex'">
    <span class="alert-icon">
      <span class="mdi" :class="icon"></span>
    </span>
    <div class="alert-text">
      <div v-html="block?.content"></div>
      <div v-if="block?.link" class="buttons">
        <a :href="block.link.value" class="btn btn-primary">{{ block?.linkText }}</a>
      </div>
    </div>
    <span class="js-close-alert alert-close" data-element-id="NoticeBlock" @click.prevent="block.onlyShowOnce"></span>
  </div>
</template>


<script setup lang="ts">

const props = defineProps<{
  block: {
    type: string;
    content: string;
    link: {
      value: string;
    };
    linkText: string;
    onlyShowOnce: boolean;
  };
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
