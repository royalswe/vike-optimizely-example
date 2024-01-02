<template>
  <footer>
    <p>&copy; {{ dayjs().year() }} My Vue.js App</p>
  </footer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
</script>

<style scoped>
footer {
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
