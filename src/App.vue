<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app1">
    <!-- 路由页面内容渲染区域 -->
    <RouterView />
  </div>
</template>

<style lang="css" scoped>
#app1 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* make it fullscreen */
  height: 100%;
}
</style>
