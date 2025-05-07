<template>
    <div class="word-container">
        <div class="word-info">
            <h2>{{ word }}</h2>
            <p>音标: {{ phonetic }}</p>
            <p>解释: {{ translation }}</p>
            <button @click="playAudio" class="audio-btn">🔊 发音</button>
        </div>

        <div class="controls">
            <button @click="prevWord">⬅️ 上一个</button>
            <button @click="markAsUnknown">📘 生词</button>
            <button @click="markAsKnown">📗 熟词</button>
            <button @click="nextWord">➡️ 下一个</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前单词相关
const word = ref<string>('')
const phonetic = ref<string>('')
const translation = ref<string>('')

// 示例词库
const wordList = ['apple', 'banana', 'computer', 'beautiful', 'dictionary']
const currentIndex = ref<number>(0)

// 本地存储的生词和熟词列表
const unknownWords = ref<string[]>([])
const knownWords = ref<string[]>([])

// 获取单词详情
const fetchWordDetails = async (wordParam: string) => {
    try {
        const response = await axios.get(
            `https://fanyi.youdao.com/openapi.do?keyfrom=你的_keyfrom&key=你的_apikey&type=data&doctype=json&version=1.1&q=${wordParam}`
        )

        const data = response.data
        word.value = data.query
        phonetic.value = data.basic?.phonetic || ''
        translation.value = data.translation.join(', ')
    } catch (error) {
        console.error('获取单词失败:', error)
        word.value = '加载失败'
        phonetic.value = ''
        translation.value = '请检查网络或稍后再试'
    }
}

// 播放发音
const playAudio = () => {
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word.value)}`
    const audio = new Audio(audioUrl)
    audio.play()
}

// 切换单词
const nextWord = () => {
    if (currentIndex.value < wordList.length - 1) {
        currentIndex.value++
        fetchWordDetails(wordList[currentIndex.value])
    }
}

const prevWord = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--
        fetchWordDetails(wordList[currentIndex.value])
    }
}

// 标记为生词
const markAsUnknown = () => {
    const currentWord = word.value
    if (!unknownWords.value.includes(currentWord)) {
        unknownWords.value.push(currentWord)
        localStorage.setItem('unknownWords', JSON.stringify(unknownWords.value))
    }
}

// 标记为熟词
const markAsKnown = () => {
    const currentWord = word.value
    if (!knownWords.value.includes(currentWord)) {
        knownWords.value.push(currentWord)
        localStorage.setItem('knownWords', JSON.stringify(knownWords.value))
    }
}

// 初始化加载
onMounted(() => {
    // 从本地存储恢复记录
    unknownWords.value = JSON.parse(localStorage.getItem('unknownWords') || '[]')
    knownWords.value = JSON.parse(localStorage.getItem('knownWords') || '[]')
    fetchWordDetails(wordList[currentIndex.value])
})
</script>

<style scoped>
.word-container {
    max-width: 600px;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
}

.word-info {
    margin-bottom: 40px;
}

.audio-btn {
    margin-top: 10px;
    padding: 8px 16px;
    font-size: 16px;
}

.controls {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

button {
    flex: 1;
    padding: 10px;
    font-size: 14px;
}
</style>