<template>
  <c-compact-header :logoUrl="'/static/img/sodra-logo-green.svg'">
    <template #headerStart>
      <span class="c-compact-header__button js-toggle-open" data-element-id="mainMenu">
        <i class="c-compact-header__button-icon material-icons">menu</i>
        <span class="c-compact-header__button-label">Meny</span>
      </span>
    </template>
    <template #headerCenter>
      <slot name="headerLogo" />
    </template>
    <template #headerEnd>
      <button v-if="commonStore.user.Name"
        class="c-compact-header__button c-compact-header__button--yellow js-toggle-open ms-3"
        data-element-id="loggedInMenu">
        <i class="c-compact-header__button-icon material-icons">account_circle</i>
        <span class="c-compact-header__button-label">{{ commonStore.user.Name }}</span>
      </button>
      <button v-if="!commonStore.user.Name"
        class="c-compact-header__button c-compact-header__button--yellow js-toggle-open ms-3" data-element-id="loginMenu">
        <i class="c-compact-header__button-icon material-icons">account_circle</i>
        <span class="c-compact-header__button-label">
          Login
        </span>
      </button>
    </template>
  </c-compact-header>
</template>

<script setup lang="ts">
import { CCompactHeader } from "@sodraskog/unity/vue/Components";
import { useCommonStore } from '@/stores/commonStore';

const commonStore = useCommonStore();





</script>
