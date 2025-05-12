<template>
    <el-menu :default-active="activeIndex" class="top-nav el-menu-demo" mode="horizontal" :ellipsis="false"
        @select="handleSelect">
        <el-menu-item index="0" class="logo">
            <img src="/baicizhan.png" alt="Element logo" />
        </el-menu-item>
        <el-menu-item index="1" class="nav-item">关于我们</el-menu-item>
        <el-sub-menu index="2" class="nav-item">
            <template #title>
                <div class="nav-title" height="81px">
                    <i class="el-icon-document"></i> 网页介绍
                </div>
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
            <el-button type="primary" @click="goToLogin">登录/注册</el-button>
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
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* 增加阴影效果 */
    padding: 0 30px;
    transition: background-color 0.3s ease;
    /* 增加背景色的过渡效果 */
}

.logo {
    flex: 0 1 auto;
}

.logo img {
    width: 150px;
    height: 40px;
    transition: transform 0.3s ease;
    /* 添加logo图标缩放的动画效果 */
}

.logo img:hover {
    transform: scale(1.1);
    /* 鼠标悬停时略微放大 */
}

.nav-item {
    font-size: 18px;
    color: #333;
    transition: color 0.3s ease;
    font-weight: 600;
    line-height: 50px;
    /* 确保菜单项的高度一致 */
    height: 100%;
}

.nav-item:hover {
    color: #2196f3;
    /* 鼠标悬停时字体颜色变为蓝色 */
}

.nav-title {
    font-weight: 600;
    font-size: 18px;
}

.el-menu--horizontal .el-menu-item.is-active {
    border-bottom: 3px solid #2196f3;
    /* 高亮菜单项的蓝色下划线 */
    margin-bottom: -3px;
    /* 调整蓝色下划线位置 */
}


.actions {
    display: flex;
    justify-content: center;
    align-items: center;
}

.el-button {
    width: 100px;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 20px;
    /* 圆角按钮 */
    background-color: #2196f3;
    /* 按钮背景色 */
    color: #fff;
    border: none;
    transition: background-color 0.3s ease, transform 0.3s ease;
    /* 添加按钮背景色过渡效果 */
}

.el-button:hover {
    background-color: #1976d2;
    /* 鼠标悬停时背景色变深 */
    transform: translateY(-3px);
    /* 按钮悬停时上浮效果 */
}

/* 鼠标悬停时，导航栏的背景色变化 */
.top-nav:hover {
    background-color: #f1f1f1;
}

/* 修改水平菜单的边框 */
.el-menu--horizontal.el-menu {
    border-bottom: none;
}

/* 响应式设计：小屏幕调整菜单排列 */
@media (max-width: 768px) {
    .top-nav {
        flex-direction: column;
        align-items: flex-start;
        padding: 15px;
    }

    .logo img {
        width: 130px;
        height: auto;
    }

    .nav-item {
        font-size: 16px;
        padding: 10px 0;
    }

    .el-button {
        width: 90px;
    }
}
</style>
