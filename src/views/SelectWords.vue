<template>
  <div class="select-words-container">
    <el-card class="box-card">
      <h2 class="title">选择你的背单词计划</h2>

      <!-- 步骤导航 -->
      <el-steps :active="step" align-center style="margin-bottom: 30px;">
        <el-step title="选择难度"></el-step>
        <el-step title="设置数量"></el-step>
        <el-step title="开始学习"></el-step>
      </el-steps>

      <!-- 难度选择 -->
      <div v-if="step === 1" class="step-content">
        <p class="step-title">第一步：请选择学习难度</p>
        <div class="level-options">
          <el-button v-for="level in levels" :key="level.name"
            :type="selectedLevel?.name === level.name ? 'success' : 'primary'" @click="selectLevel(level)" round
            size="large">
            {{ level.label }}
          </el-button>
        </div>
        <el-button type="primary" @click="nextStep" :disabled="!selectedLevel" style="margin-top: 30px;">
          下一步
        </el-button>
      </div>

      <!-- 数量选择 -->
      <div v-if="step === 2" class="step-content">
        <p class="step-title">第二步：请设置学习单词数量（最多{{ maxWordCount }}个）</p>
        <el-input-number v-model="wordCount" :min="1" :max="maxWordCount" placeholder="请输入数量" size="large" />
        <div style="margin-top: 20px;">
          <el-button @click="prevStep">上一步</el-button>
          <el-button type="primary" @click="confirmCount">确认并继续</el-button>
        </div>
      </div>

      <!-- 最终页 -->
      <div v-if="step === 3" class="step-content result-page">
        <el-result icon="success" title="配置完成！" :subTitle="`你将学习【${selectedLevel?.label}】的 ${wordCount} 个单词。`">
          <template #extra>
            <el-button type="primary" @click="startLearning">开始学习</el-button>
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 所有可选的学习等级
const levels = [
  { name: 'cet4', label: '大学英语四级 (CET4)' },
  { name: 'cet6', label: '大学英语六级 (CET6)' },
  { name: 'toefl', label: '托福 (TOEFL)' },
  { name: 'ielts', label: '雅思 (IELTS)' },
  { name: 'gre', label: '美国研究生入学考试 (GRE)' },
  { name: 'gmat', label: '管理类研究生入学考试 (GMAT)' },
  { name: 'pte', label: '培生英语考试 (PTE)' },
  { name: 'tem4', label: '英语专业四级 (TEM4)' },
  { name: 'tem8', label: '英语专业八级 (TEM8)' },
  { name: 'postgraduate', label: '考研英语' },
  { name: 'k12', label: '中小学词汇' },
  { name: 'vocational', label: '职业英语' }
]

const step = ref<number>(1)
const selectedLevel = ref<{ name: string; label: string } | null>(null)
const wordCount = ref<number>(1)
const maxWordCount = 100

// 上一步 / 下一步
const nextStep = () => {
  if (!selectedLevel.value) return
  step.value = 2
}

const prevStep = () => {
  step.value = 1
}

// 设置数量后进入最后一步
const confirmCount = () => {
  step.value = 3
}

// 开始学习按钮
const startLearning = async () => {
  if (selectedLevel.value && wordCount.value > 0) {
    const payload = {
      level: selectedLevel.value.name,
      count: wordCount.value
    }

    try {
      // 使用 axios 发送 POST 请求
      await axios.post('/api/learning-plan', payload)

      // 跳转页面
      router.push({
        name: 'Word',
        query: {
          level: selectedLevel.value.name,
          count: wordCount.value.toString()
        }
      })
    } catch (error) {
      alert('提交失败，请稍后再试')
      console.error('提交学习计划出错:', error)
    }
  }
}

// 选择等级
const selectLevel = (level: { name: string; label: string }) => {
  selectedLevel.value = level
}
</script>

<style scoped>
.select-words-container {
  display: flex;
  align-items: center;
  height: 100%;
  background-color: #f5f7fa;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

.box-card {
  max-width: 700px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.step-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

.level-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.level-options .el-button {
  font-size: 16px;
  padding: 12px 20px;
}

.result-page {
  text-align: center;
}

@media (max-width: 768px) {
  .level-options {
    flex-direction: column;
    align-items: center;
  }

  .level-options .el-button {
    width: 100%;
    max-width: 300px;
  }

  .quantity-selection .el-input-number {
    width: 100%;
  }
}
</style>
