<template>
    <div class="body-wrapper">
        <div class="body-nav">
            <el-button v-for="button in buttons" :key="button.text" :type="button.type" text class="white-bg"
                @click="handleButtonClick(button.path)">
                {{ button.text }}
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const buttons = [
    { type: '', text: '背单词', path: '/word' },
    { type: 'primary', text: '查单词', path: '' }, // 可以根据需要设置路径
    { type: 'success', text: '学生词', path: '' },
] as const;

const handleButtonClick = (path: string) => {
    if (path) {
        router.push(path);
    }
};
</script>

<style lang="css" scoped>
.body-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.body-nav {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 600px;
}
</style>