<template>
    <div class="word-lookup-container">
        <h1>查单词</h1>

        <div class="search-box">
            <input v-model="word" type="text" placeholder="输入单词或中文" />
            <button @click="translate">查询</button>
            <button @click="clear">清空</button>
        </div>

        <div class="language-toggle">
            <label><input type="radio" v-model="direction" value="en-to-zh" /> 英译汉</label>
            <label><input type="radio" v-model="direction" value="zh-to-en" /> 汉译英</label>
        </div>

        <div v-if="loading" class="loading">正在查询...</div>

        <div v-if="result" class="result-section">
            <div class="word-info">
                <h2>{{ result.word }}</h2>
                <p v-if="result.phonetic">
                    音标: {{ result.phonetic }}
                    <button v-if="result.audioUrl" @click="playAudio(result.audioUrl)">🔊</button>
                </p>
                <p v-if="result.meaning">含义: {{ result.meaning }}</p>
                <p v-if="result.example">例句: {{ result.example }}</p>
            </div>
        </div>

        <div v-if="error" class="error">{{ error }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 响应式状态
const word = ref<string>('') // 用户输入的单词
const direction = ref<string>('en-to-zh') // 翻译方向
const result = ref<{
    word: string
    phonetic?: string
    audioUrl?: string
    meaning?: string
    example?: string
} | null>(null)
const loading = ref<boolean>(false) // 加载状态
const error = ref<string | null>(null) // 错误信息

// 翻译函数
const translate = async () => {
    const trimmedWord = word.value.trim()
    if (!trimmedWord) return

    loading.value = true
    error.value = null
    result.value = null

    try {
        const response = await fetch(
            `/api/translate?word=${encodeURIComponent(trimmedWord)}&direction=${direction.value}`
        )
        const data = await response.json()

        if (data.success) {
            result.value = data.result
        } else {
            result.value = {
                word: '未找到结果',
            }
        }
    } catch (err) {
        console.error('翻译失败:', err)
        error.value = '网络请求失败，请稍后再试。'
    } finally {
        loading.value = false
    }
}

// 播放音频
const playAudio = (url: string) => {
    const audio = new Audio(url)
    audio.play().catch(() => alert('无法播放音频'))
}

// 清空输入和结果
const clear = () => {
    word.value = ''
    result.value = null
    error.value = null
}
</script>

<style scoped>
.word-lookup-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 24px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Segoe UI', sans-serif;
}

.search-box {
    display: flex;
    gap: 10px;
    align-items: center;
}

.search-box input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.search-box button {
    padding: 10px 16px;
    font-size: 14px;
    background-color: #42b883;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.language-toggle {
    margin-top: 20px;
    display: flex;
    gap: 16px;
}

.result-section {
    margin-top: 24px;
    padding: 20px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.word-info h2 {
    margin-bottom: 10px;
    color: #333;
}

.word-info p {
    margin: 6px 0;
    line-height: 1.5;
}

.loading {
    margin-top: 20px;
    color: #666;
    font-style: italic;
}

.error {
    margin-top: 20px;
    color: red;
    font-weight: bold;
}
</style>
