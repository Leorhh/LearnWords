<template>
    <div class="body-wrapper" :class="{ 'dark-mode': isDarkMode }">
        <!-- 光晕背景 -->
        <div class="glow-bg"></div>

        <!-- 波浪背景 -->
        <div class="wave-bg"></div>

        <!-- SVG 粒子背景 -->
        <div class="background-decoration">
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" class="bg-svg">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color: #3498db; stop-opacity: 0.2" />
                        <stop offset="100%" style="stop-color: #2ecc71; stop-opacity: 0.2" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad1)" />
                <g stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.6">
                    <circle v-for="dot in dots" :key="dot.id" :cx="dot.x" :cy="dot.y" :r="dot.size" class="dot" />
                </g>
            </svg>
        </div>

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
                class="nav-button" draggable="true" :class="[
                    getAnimationClass(index),
                    { bounce: buttonBounced === button.text, dragging: draggingButton === button.text, shake: shakingButton === button.text }
                ]" @click="handleButtonClick(button.path)" @mousedown.native="startDrag(button)"
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
        case '背单词':
            return 'Document'
        case '查单词':
            return 'Search'
        case '学生词':
            return 'School'
        default:
            return 'Document'
    }
}

// 判断当前路径是否激活该按钮
const isActive = (path: string) => {
    return route.path === path
}

// ===== 按钮点击反弹动画 =====
const buttonBounced = ref<string | null>(null)

const handleButtonClick = async (path: string) => {
    if (!path) return
    router.push(path)

    // 设置按钮反弹状态
    if (path.includes('select-words')) {
        buttonBounced.value = '背单词'
    } else if (path.includes('word-lookup')) {
        buttonBounced.value = '查单词'
    } else if (path.includes('student-words')) {
        buttonBounced.value = '学生词'
    }

    setTimeout(() => {
        buttonBounced.value = null
    }, 400)
}

// ===== 暗黑模式控制 =====
const isDarkMode = ref(false)
const draggingButton = ref<string | null>(null)
const shakingButton = ref<string | null>(null)

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value ? 'true' : 'false')
    applyTheme()
}

const applyTheme = () => {
    if (isDarkMode.value) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

onMounted(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true'
    isDarkMode.value = savedMode
    applyTheme()

    // 启动按钮入场动画
    setTimeout(() => {
        animationPlayed.value = true
    }, 100)

    updateBackgroundGradient()
    animateDots()
})

// 动态颜色渐变算法：HSL 色彩轮转
let hue = 0
const updateBackgroundGradient = () => {
    hue = (hue + 0.5) % 360
    requestAnimationFrame(updateBackgroundGradient)
}

// SVG 粒子动画数据 + 运动逻辑
const dots = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    vx: (Math.random() - 0.5) * 0.1,
    vy: (Math.random() - 0.5) * 0.1,
    size: 0.2 + Math.random() * 0.3
}))

const animateDots = () => {
    dots.forEach(dot => {
        dot.x += dot.vx
        dot.y += dot.vy
        if (dot.x < 0 || dot.x > 100) dot.vx *= -1
        if (dot.y < 0 || dot.y > 100) dot.vy *= -1
    })
    requestAnimationFrame(animateDots)
}

// 控制按钮入场动画触发
const animationPlayed = ref(false)

// 返回随机动画类名
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

    const dx = clientX / window.innerWidth
    const dy = clientY / window.innerHeight

    const direction =
        dx > 0.5
            ? dy > 0.5
                ? 'bottom-right'
                : 'top-right'
            : dx < 0.5
                ? dy > 0.5
                    ? 'bottom-left'
                    : 'top-left'
                : 'center'

    console.log(`Dragging ${draggingButton.value} to ${direction}`)
}

const endDrag = () => {
    const currentButton = draggingButton.value
    draggingButton.value = null
    startPos.value = null

    if (currentButton) {
        shakingButton.value = currentButton
        setTimeout(() => {
            shakingButton.value = null
        }, 500)
    }

    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', endDrag)
    document.removeEventListener('mouseleave', endDrag)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', endDrag)
}
</script>

<style lang="css" scoped>
/* 原有样式保持不变 */
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

.body-wrapper.dark-mode {
    background-color: #1a1a1a;
    color: #f1f1f1;
}

.glow-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(52, 152, 219, 0.1) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 0;
    pointer-events: none;
    animation: glowPulse 10s ease-in-out infinite;
}

@keyframes glowPulse {

    0%,
    100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.6;
    }

    50% {
        transform: translate(-50%, -50%) scale(1.1);
        opacity: 0.8;
    }
}

.wave-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 100" xmlns="http://www.w3.org/2000/svg"><path fill="%23ffffff33" d="M0,32L30,37.3C60,43,120,53,180,53.3C240,53,300,43,360,37.3C420,32,480,32,540,37.3C600,43,660,53,720,58.7C780,64,840,64,900,64C960,64,1020,64,1080,64C1140,64,1200,64,1200,64L1200,100L1140,100C1080,100,1020,100,960,100C900,100,840,100,780,100C720,100,660,100,600,100C540,100,480,100,420,100C360,100,300,100,240,100C180,100,120,100,60,100L0,100Z"></path></svg>') repeat-x;
    background-size: cover;
    z-index: 0;
    animation: waveMove 10s linear infinite;
}

@keyframes waveMove {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-100%);
    }
}

.background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}

.bg-svg {
    width: 100%;
    height: 100%;
    font-size: 1em;
    color: currentColor;
}

.dot {
    animation: pulse 4s infinite ease-in-out;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.5;
    }

    50% {
        transform: scale(1.5);
        opacity: 1;
    }
}

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

.nav-button-icon {
    font-size: 24px !important;
}

.dark-mode .nav-button {
    background-color: #2c2c2c;
    color: #eee;
}

.nav-button:hover {
    background-color: #e6e6e6;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.dark-mode .nav-button:hover {
    background-color: #3a3a3a;
}

.nav-button.dragging {
    transform: scale(1.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.theme-toggle {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 3;
}
</style>