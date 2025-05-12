<template>
  <div class="word-lookup-container">
    <!-- Header -->
    <el-header class="header">
      <el-button icon="ArrowLeft" @click="goBack"> 返回</el-button>
      <h2>📘 查单词</h2>
      <div style="width: 48px;"></div> <!-- 占位符对齐 -->
    </el-header>

    <!-- Main Content -->
    <el-main class="main-content">
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input v-model="word" placeholder="输入英文或中文进行查询" clearable size="large" @keyup.enter="translate">
          <template #append>
            <el-button icon="Search" @click="translate">查询</el-button>
          </template>
        </el-input>
        <el-button @click="clear" plain style="margin-top: 10px;">清空记录</el-button>
      </div>

      <!-- 切换语言方向 -->
      <div class="language-toggle">
        <el-radio-group v-model="direction">
          <el-radio label="en-to-zh">英译汉</el-radio>
          <el-radio label="zh-to-en">汉译英</el-radio>
        </el-radio-group>
      </div>

      <!-- 加载状态 -->
      <el-alert v-if="loading" title="正在查询..." type="info" :closable="false" />

      <!-- 错误提示 -->
      <el-alert v-if="error" :title="error" type="error" show-icon />

      <!-- 查询结果 -->
      <div v-show="result && result.word !== '未找到结果'" class="result-section">
        <el-card shadow="hover" class="word-card">
          <h3>{{ result?.word }}</h3>
          <p v-if="result?.phonetic">音标: {{ result?.phonetic }}</p>
          <p v-if="result?.audioUrl">
            <el-button icon="Voice" @click="playAudio(result.audioUrl)"> 发音</el-button>
          </p>
          <p v-if="result?.meaning">含义: {{ result?.meaning }}</p>
          <p v-if="result?.example">例句: {{ result?.example }}</p>
        </el-card>

        <!-- 操作按钮 -->
        <div class="actions">
          <el-button type="warning" round @click="addToUnknownWords">📘 加入生词本</el-button>
          <el-button type="success" round @click="addToFavorites">⭐ 收藏此词</el-button>
        </div>
      </div>

      <!-- 无结果 -->
      <el-empty v-if="result && result.word === '未找到结果'" description="未找到相关解释"></el-empty>

      <!-- 历史记录 -->
      <div v-if="history.length > 0" class="history-section">
        <h4>🔍 最近查询</h4>
        <ul class="history-list">
          <li v-for="(item, index) in history" :key="index" @click="reQuery(item)">
            {{ item }}
          </li>
        </ul>
      </div>
    </el-main>

    <!-- 弹窗 -->
    <el-dialog :visible.sync="isDialogVisible" title="正在查询" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <p>查询中，请稍候...</p>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const word = ref<string>('')
const direction = ref<string>('en-to-zh')
const result = ref<{
  word: string
  phonetic?: string
  audioUrl?: string
  meaning?: string
  example?: string
} | null>(null)
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const isDialogVisible = ref<boolean>(false)

const unknownWords = ref<string[]>(JSON.parse(localStorage.getItem('unknownWords') || '[]'))
const favorites = ref<string[]>(JSON.parse(localStorage.getItem('favorites') || '[]'))
const history = ref<string[]>(JSON.parse(localStorage.getItem('lookupHistory') || '[]'))

const translate = async () => {
  const trimmedWord = word.value.trim()
  if (!trimmedWord) return

  loading.value = true
  error.value = null
  result.value = null
  isDialogVisible.value = true

  try {
    const response = await axios.get('/translate', {
      params: {
        word: trimmedWord,
        direction: direction.value
      }
    })

    const data = response.data

    if (data.translate) {
      result.value = { word: data.translate };
      /* append search query to history */
      if (!history.value.includes(trimmedWord)) {
        history.value.unshift(trimmedWord)
        if (history.value.length > 10) history.value.pop()
        localStorage.setItem('lookupHistory', JSON.stringify(history.value))
      }
    } else {
      result.value = {
        word: '未找到结果',
        meaning: ''
      }
    }
  } catch (err) {
    console.error('翻译失败:', err)
    error.value = '网络请求失败，请稍后再试。'
  } finally {
    loading.value = false
    isDialogVisible.value = false
  }
}

const playAudio = (url: string) => {
  const audio = new Audio(url)
  audio.play().catch(() => alert('无法播放音频'))
}

const clear = () => {
  word.value = ''
  result.value = null
  error.value = null
  isDialogVisible.value = false
}

const addToUnknownWords = () => {
  const currentWord = result.value?.word
  if (!currentWord || unknownWords.value.includes(currentWord)) return

  unknownWords.value.push(currentWord)
  localStorage.setItem('unknownWords', JSON.stringify(unknownWords.value))
}

const addToFavorites = () => {
  const currentWord = result.value?.word
  if (!currentWord || favorites.value.includes(currentWord)) return

  favorites.value.push(currentWord)
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}

const reQuery = (item: string) => {
  word.value = item
  translate()
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.word-lookup-container {
  background-color: #f9f9f9;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 16px 24px;
}

.header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.main-content {
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
  padding: 0 16px;
}

.search-box {
  margin-bottom: 20px;
}

.language-toggle {
  margin-bottom: 20px;
}

.word-card {
  text-align: left;
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.word-card h3 {
  font-size: 28px;
  margin-bottom: 12px;
  color: #2c3e50;
}

.word-card p {
  font-size: 16px;
  margin: 8px 0;
  line-height: 1.5;
}

.actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.history-section {
  margin-top: 40px;
  text-align: left;
}

.history-list {
  list-style: none;
  padding-left: 0;
}

.history-list li {
  cursor: pointer;
  padding: 8px 12px;
  margin-bottom: 6px;
  background-color: #f0f0f0;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.history-list li:hover {
  background-color: #e0e0e0;
}
</style>
