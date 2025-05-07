<template>
    <el-menu :default-active="activeIndex" class="top-nav el-menu-demo" mode="horizontal" :ellipsis="false"
        @select="handleSelect">
        <el-menu-item index="0" class="logo">
            <img src="https://7n.bczcdn.com/static/static/icon-bcz.8a81c5ce.png" alt="Element logo" />
        </el-menu-item>
        <el-menu-item index="1" class="nav">关于我们</el-menu-item>
        <el-sub-menu index="2" class="nav">
            <template #title>
                <div class="nav-title">网页介绍</div>
            </template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
            <el-sub-menu index="2-4">
                <template #title>item four</template>
                <el-menu-item index="2-4-1">item one</el-menu-item>
                <el-menu-item index="2-4-2">item two</el-menu-item>
                <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="3" class="actions">
            <el-button type="primary" @click="goToLogin">登录</el-button>
        </el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeIndex = ref('1')

const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

const goToLogin = () => {
    router.push('/login') // 确保与路由配置中的 path 一致
}
</script>


<style scoped>
.top-nav {
    height: 90px;
    width: 100%;
    /* 改为 100%，铺满整个屏幕顶部 */
    /* margin: 0 auto; 删除居中限制 */
    display: flex;
    flex-direction: row;
    align-items: center;
    position: fixed;
    /* 固定在顶部 */
    top: 0;
    left: 0;
    z-index: 9999;
    /* 确保在其他内容之上 */
    background-color: white;
    /* 避免背景透明影响显示 */
    /*字体大小*/
    /* font-size: large; */
}

.logo {
    flex: 16;
}

.logo img {
    width: 166px;
    height: 42px;
    margin-right: 30px;
}

.nav {
    height: 100%;
    flex: 85;
    font-size: 18px;
    --el-menu-item-font-size: 18px;
}

.nav-title {
    /* justify-content: center; */
    margin: auto;
}

.actions {
    flex: 26;
    display: flex;
    justify-content: center;
}

.el-button {
    width: 80px;
    height: 42px;
}

/* :deep(.el-menu--horizontal.el-menu) {
    border-bottom: none; */
/* } */
</style>
<style>
.el-menu--horizontal.el-menu {
    border-bottom: none;
}
</style>