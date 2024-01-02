<template>
  <header>
    <h1>{{ t('common.header.menu') }}</h1>
    <nav>
      <ul>
        <!-- <li v-for="(link, index) in links" :key="index">{{ link }}</li> -->
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { usePageContext } from '#src/renderer/usePageContext';
import { useI18n } from "vue-i18n";

const pageContext = usePageContext();
const { t } = useI18n();

</script>

<style scoped>
header {
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
}

h1 {
  margin: 0;
}

nav ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: center;
}

nav li {
  margin: 0 10px;
  cursor: pointer;
}
</style>