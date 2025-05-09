<template>
    <div class="student-words-container">
      <!-- 返回按钮 -->
      <el-button @click="router.back()" icon="ArrowLeft" plain class="back-btn">返回</el-button>
  
      <h2>📘 学生词库</h2>
  
      <el-card v-if="word" shadow="hover" class="word-card">
        <div class="word-content">
          <h3>{{ word.word }}</h3>
          <p v-if="word.phonetic"><strong>音标:</strong> {{ word.phonetic }}</p>
          <el-button
            v-if="word.audioUrl"
            @click="playAudio(word.audioUrl)"
            icon="Headset"
            type="primary"
            plain
          >
            播放发音
          </el-button>
          <p><strong>含义:</strong> {{ word.meaning }}</p>
        </div>
  
        <div class="controls">
          <el-button @click="prevWord" icon="ArrowLeft" type="info" plain>上一个</el-button>
          <el-button @click="nextWord" icon="ArrowRight" type="info" plain>下一个</el-button>
          <el-button @click="markAsLearned" icon="Check" type="danger" plain>✅ 已会</el-button>
        </div>
      </el-card>
  
      <el-empty v-else description="没有更多生词了"></el-empty>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
//   import {
//     ArrowLeft,
//     ArrowRight,
//     Check,
//     Headset
//   } from '@element-plus/icons-vue'
  
  interface Word {
    word: string
    phonetic?: string
    audioUrl?: string
    meaning: string
  }
  
  const router = useRouter()
  const words = ref<Word[]>([])
  const currentIndex = ref<number>(0)
  const word = ref<Word | null>(null)
  
  // 加载本地存储中的生词
  const loadStudentWords = () => {
    const stored = localStorage.getItem('studentWords')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          words.value = parsed
        }
      } catch (e) {
        console.error('解析生词数据失败', e)
        words.value = []
      }
    } else {
      words.value = []
    }
  }
  
  // 保存到本地存储
  const saveStudentWords = () => {
    localStorage.setItem('studentWords', JSON.stringify(words.value))
  }
  
  // 更新当前显示单词
  const updateCurrentWord = () => {
    if (
      words.value.length > 0 &&
      currentIndex.value >= 0 &&
      currentIndex.value < words.value.length
    ) {
      word.value = words.value[currentIndex.value]
    } else {
      word.value = null
    }
  }
  
  // 上一个单词
  const prevWord = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
      updateCurrentWord()
    }
  }
  
  // 下一个单词
  const nextWord = () => {
    if (currentIndex.value < words.value.length - 1) {
      currentIndex.value++
      updateCurrentWord()
    }
  }
  
  // 播放音频
  const playAudio = (url: string) => {
    if (url) {
      new Audio(url).play().catch(() => ElMessage.error('无法播放音频'))
    }
  }
  
  // 标记为已学会并移除
  const markAsLearned = () => {
    if (word.value) {
      words.value.splice(currentIndex.value, 1)
      saveStudentWords()
      currentIndex.value = Math.max(0, currentIndex.value - 1)
      updateCurrentWord()
      ElMessage.success('该单词已掌握！')
    }
  }
  
  onMounted(() => {
    loadStudentWords()
    updateCurrentWord()
  })
  </script>
  
  <style scoped>
  .student-words-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 24px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    position: relative;
  }
  
  .back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
  }
  
  .word-card {
    border-radius: 10px;
    transition: box-shadow 0.3s ease;
  }
  
  .word-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .word-content {
    text-align: center;
    padding: 20px 0;
  }
  
  .word-content h3 {
    font-size: 24px;
    margin-bottom: 12px;
    color: #333;
  }
  
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  @media (max-width: 600px) {
    .controls {
      flex-direction: column;
    }
  
    .controls .el-button {
      width: 100%;
    }
  }
  </style>