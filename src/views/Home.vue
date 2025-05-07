<script setup lang="ts">
// 引入顶部导航栏组件
import Top from '../components/Top.vue'

// 引入主体内容区域组件
import Body from '../components/Body.vue'
</script>

<template>
  <div class="common-layout">
    <!-- 使用 Element Plus 布局容器 -->
    <el-container style="flex-direction: column; height: 100vh;">
      <!-- 页眉区域：顶部导航 -->
      <el-header style="padding: 0; background-color: #fff;">
        <Top />
      </el-header>

      <!-- 主体内容区域 -->
      <el-main style="flex: 1; padding: 0; background-color: white;">

        <Body />
      </el-main>
    </el-container>
  </div>
</template>

<style lang="css" scoped>
.common-layout {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.el-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  /* 确保容器高度继承自父级 */
}

.el-main {
  flex: 1;
  /* 自动填充剩余空间 */
  padding: 0;
}
</style>