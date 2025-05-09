<template>
    <div class="word-container">
      <!-- Header -->
      <el-header class="header">
        <el-button icon="ArrowLeft" @click="router.back()">返回</el-button>
        <h2>📘 背单词模式</h2>
        <div style="width: 48px;"></div> <!-- 对齐占位 -->
      </el-header>
  
      <!-- Main Content -->
      <el-main class="main-content">
        <!-- 进度条 -->
        <div class="progress">第 {{ currentIndex + 1 }} / {{ words.length }} 个单词</div>
  
        <!-- 单词卡片 -->
        <transition name="flip" mode="out-in">
          <div :key="word.word" class="word-card" @click="toggleTranslation">
            <h3>{{ word.word }}</h3>
            <p class="phonetic">音标: {{ word.phonetic }}</p>
            <p v-show="showTranslation" class="translation animated fadeIn">
              中文释义: {{ word.translation }}
            </p>
          </div>
        </transition>
  
        <!-- 控制按钮 -->
        <div class="controls">
          <el-button @click="prevWord" :disabled="currentIndex === 0" plain>上一个</el-button>
          <el-button @click="markAsUnknown" type="warning" round>📘 生词</el-button>
          <el-button @click="addToStudentWords" type="success" round>🎒 学生词</el-button>
          <el-button @click="markAsKnown" type="info" round>📗 熟词</el-button>
          <el-button @click="nextWord" :disabled="currentIndex >= words.length - 1" plain>下一个</el-button>
        </div>
  
        <!-- 发音按钮 -->
        <el-button
          icon="Voice"
          type="primary"
          circle
          size="large"
          class="audio-btn"
          @click="playAudio"
        />
      </el-main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const route = useRoute()
  
  // 当前单词数据
  const word = ref<{ word: string; phonetic: string; translation: string }>({
    word: '',
    phonetic: '',
    translation: ''
  })
  const words = ref<any[]>([])
  const currentIndex = ref<number>(0)
  const showTranslation = ref<boolean>(false)
  
  // 用户选择的数据
  const level = ref<string>((route.query.level as string) || '')
  const count = ref<number>(parseInt(route.query.count as string) || 5)
  
  // 本地存储管理
  const unknownWords = ref<string[]>(JSON.parse(localStorage.getItem('unknownWords') || '[]'))
  const knownWords = ref<string[]>(JSON.parse(localStorage.getItem('knownWords') || '[]'))
  
  // 切换释义显示
  const toggleTranslation = () => {
    showTranslation.value = !showTranslation.value
  }
  
  // 播放发音
  const playAudio = () => {
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word.value.word)}`
    const audio = new Audio(audioUrl)
    audio.play()
  }
  
  // 获取单词列表
  const fetchWords = async () => {
    try {
      const res = await axios.get(`/api/words`, {
        params: {
          level: level.value,
          count: count.value
        }
      })
      words.value = res.data
      if (words.value.length > 0) {
        word.value = words.value[currentIndex.value]
      }
    } catch (error) {
      console.error('获取单词失败:', error)
      alert('无法加载单词，请检查网络或稍后再试')
      router.back()
    }
  }
  
  // 切换单词
  const nextWord = () => {
    if (currentIndex.value < words.value.length - 1) {
      currentIndex.value++
      word.value = words.value[currentIndex.value]
      showTranslation.value = false
    }
  }
  
  const prevWord = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
      word.value = words.value[currentIndex.value]
      showTranslation.value = false
    }
  }
  
  // 标记为生词
  const markAsUnknown = () => {
    const currentWord = word.value.word
    if (!unknownWords.value.includes(currentWord)) {
      unknownWords.value.push(currentWord)
      localStorage.setItem('unknownWords', JSON.stringify(unknownWords.value))
    }
  }
  
  // 标记为熟词
  const markAsKnown = () => {
    const currentWord = word.value.word
    if (!knownWords.value.includes(currentWord)) {
      knownWords.value.push(currentWord)
      localStorage.setItem('knownWords', JSON.stringify(knownWords.value))
    }
  }
  
  // 加入学生词
  const addToStudentWords = () => {
    const currentWord = word.value.word
    if (!currentWord) return
  
    const studentWords = JSON.parse(localStorage.getItem('studentWords') || '[]')
  
    if (!studentWords.includes(currentWord)) {
      studentWords.push(currentWord)
      localStorage.setItem('studentWords', JSON.stringify(studentWords))
    }
  }
  
  onMounted(() => {
    fetchWords()
  })
  </script>
  
  <style scoped>
  .word-container {
    background: linear-gradient(to right bottom, #e6f7ff, #f9f9f9);
    min-height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 16px 24px;
  }
  
  .header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
  }
  
  .main-content {
    max-width: 500px;
    margin: 60px auto;
    text-align: center;
  }
  
  .progress {
    font-size: 14px;
    color: #888;
    margin-bottom: 20px;
  }
  
  .word-card {
    background-color: #fff;
    border-radius: 16px;
    padding: 40px 24px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    user-select: none;
  }
  
  .word-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .word-card h3 {
    font-size: 36px;
    margin-bottom: 16px;
    font-weight: bold;
  }
  
  .phonetic {
    font-style: italic;
    color: #555;
    margin-bottom: 12px;
  }
  
  .translation {
    font-size: 18px;
    color: #333;
    margin-top: 16px;
    opacity: 0.95;
  }
  
  .controls {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: space-between;
  }
  
  .audio-btn {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 1000;
  }
  
  /* 动画 */
  .flip-enter-active,
  .flip-leave-active {
    transition: all 0.4s ease;
    transform-origin: center;
  }
  .flip-enter-from,
  .flip-leave-to {
    opacity: 0;
    transform: rotateY(180deg);
  }
  </style>