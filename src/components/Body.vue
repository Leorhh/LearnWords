<template>
    <div class="body-wrapper" :class="{ 'dark-mode': isDarkMode }">
        <!-- 星空背景 -->
        <div class="starry-sky-bg"></div>

        <!-- 主题切换按钮 - 左上角 -->
        <div class="theme-toggle">
            <el-button circle @click="toggleDarkMode">
                <el-icon size="large">
                    <Moon v-if="isDarkMode" />
                    <Sunny v-else />
                </el-icon>
            </el-button>
        </div>

        <!-- 内容区域 -->
        <div class="body-nav">
            <el-button v-for="(button, index) in buttons" :key="button.text" round size="large" :type="button.type"
                class="nav-button" draggable="true" :class="[getAnimationClass(index), {
                    bounce: buttonBounced === button.text,
                    dragging: draggingButton === button.text,
                    shake: shakingButton === button.text,
                }]" @click="handleButtonClick(button.path)" @mousedown.native="startDrag(button)"
                @mouseup.native="endDrag" @mouseleave.native="endDrag" @touchstart.native="startDrag(button)"
                @touchend.native="endDrag">
                <el-icon size="large" class="nav-button-icon">
                    <component :is="getIcon(button.text)" />
                </el-icon>
                {{ button.text }}
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Sunny, Moon } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 按钮数据
const buttons = [
    { type: 'default', text: '背单词', path: '/select-words' },
    { type: 'primary', text: '查单词', path: '/word-lookup' },
    { type: 'success', text: '学生词', path: '/student-words' },
] as const

// 获取对应按钮的图标
const getIcon = (text: string) => {
    switch (text) {
        case '背单词': return 'Document'
        case '查单词': return 'Search'
        case '学生词': return 'School'
        default: return 'Document'
    }
}

// 判断当前路径是否激活该按钮
const isActive = (path: string) => route.path === path

// ===== 按钮点击反弹动画 =====
const buttonBounced = ref<string | null>(null)

const handleButtonClick = async (path: string) => {
    if (!path) return
    router.push(path)

    // 反弹动画
    buttonBounced.value = path.includes('select-words') ? '背单词' :
        path.includes('word-lookup') ? '查单词' : '学生词'
    setTimeout(() => buttonBounced.value = null, 400)
}

// ===== 暗黑模式控制 =====
const isDarkMode = ref(false) // 初始化 false
const draggingButton = ref<string | null>(null)
const shakingButton = ref<string | null>(null)

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value ? 'true' : 'false')
    applyTheme()
}

const applyTheme = () => {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
}

onMounted(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true'
    isDarkMode.value = savedMode
    applyTheme() // 初始化时应用主题
})

// 控制按钮入场动画触发
const animationPlayed = ref(false)

const getAnimationClass = (index: number): string => {
    const animations = ['fly-in-top', 'fly-in-left', 'fly-in-right', 'fly-in-bottom', 'fly-in-spin', 'fly-in-flip']
    return animations[(index + Date.now()) % animations.length]
}

// ===== 拖拽逻辑 =====
let startPos = ref<{ x: number; y: number } | null>(null)

const startDrag = (button: any) => {
    endDrag() // 清理已有监听器

    draggingButton.value = button.text
    startPos.value = { x: 0, y: 0 }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', endDrag)
    document.addEventListener('mouseleave', endDrag)
    document.addEventListener('touchmove', onMove)
    document.addEventListener('touchend', endDrag)
}

const onMove = (e: MouseEvent | TouchEvent) => {
    if (!draggingButton.value) return

    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0]?.clientX || 0
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0]?.clientY || 0
    // Handle movement
}

const endDrag = () => {
    const currentButton = draggingButton.value
    draggingButton.value = null
    startPos.value = null

    if (currentButton) {
        shakingButton.value = currentButton
        setTimeout(() => shakingButton.value = null, 500)
    }

    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', endDrag)
    document.removeEventListener('mouseleave', endDrag)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', endDrag)
}
</script>

<style lang="css" scoped>
/* 主题切换相关样式 */
.body-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #f9f9f9;
    color: #333;
    padding: 40px 20px;
    overflow: hidden;
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* 星空背景 */
.starry-sky-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    z-index: 0;
    pointer-events: none;
    transition: background-color 0.3s ease;
}

.body-wrapper.dark-mode .starry-sky-bg {
    background-color: #f0f0f0;
}

.starry-sky-bg::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://www.transparenttextures.com/patterns/stardust.png') repeat;
    z-index: 0;
    animation: starry-sky 100s infinite linear;
}

@keyframes starry-sky {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 5000px 5000px;
    }
}

/* 其他样式不变 */
.body-nav {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;
    width: 100%;
    max-width: 600px;
}

.nav-button {
    font-size: 20px;
    padding: 20px 36px;
    border-radius: 38px;
    background-color: #f1f1f1;
    color: #333;
    box-shadow: none;
    transition: all 0.6s ease;
    transform-origin: center;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 160px;
    z-index: 1;
    font-weight: 500;
    cursor: pointer;
}

.nav-button:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
}

.nav-button:active {
    background-color: #ccc;
    transform: translateY(0);
}

.nav-button-icon {
    transition: transform 0.3s ease;
}

.nav-button:hover .nav-button-icon {
    transform: rotate(360deg);
}
</style>
