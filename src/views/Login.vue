<template>
    <el-container class="login-background">
        <el-card class="login-card" shadow="hover">
            <h2 style="text-align: center; margin-bottom: 20px;">登录 / 注册</h2>

            <el-form @submit.prevent="handleSubmit" label-position="top">
                <!-- 用户名输入 -->
                <el-form-item label="用户名">
                    <el-input v-model="username" placeholder="请输入用户名" clearable prefix-icon="User" />
                </el-form-item>

                <!-- 密码输入 -->
                <el-form-item label="密码">
                    <el-input v-model="password" type="password" placeholder="请输入密码" show-password clearable
                        prefix-icon="Lock" />
                </el-form-item>

                <!-- 成功提示 -->
                <transition name="fade">
                    <el-alert v-if="successMessage" :title="successMessage" type="success" :closable="false"
                        style="margin-bottom: 15px;" />
                </transition>

                <!-- 错误提示 -->
                <transition name="fade">
                    <el-alert v-if="errorMessage" :title="errorMessage" type="error" :closable="false"
                        style="margin-bottom: 15px;" />
                </transition>

                <!-- 提交按钮 -->
                <el-button native-type="submit" type="primary" :loading="isLoading"
                    style="width: 100%; font-size: 16px;">
                    {{ isLoading ? '请稍候...' : '登录 / 注册' }}
                </el-button>
            </el-form>
        </el-card>
    </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()
const isLoading = ref(false)

// 模拟本地存储的用户列表（实际应调用 API）
const getUsers = (): Record<string, string> => {
    const users = localStorage.getItem('users')
    return users ? JSON.parse(users) : {}
}

const saveUser = (username: string, password: string) => {
    const users = getUsers()
    users[username] = password
    localStorage.setItem('users', JSON.stringify(users))
}

const handleSubmit = () => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    setTimeout(() => {
        const users = getUsers()

        if (!username.value || !password.value) {
            errorMessage.value = '请输入用户名和密码'
        } else if (users[username.value]) {
            if (users[username.value] === password.value) {
                successMessage.value = '登录成功'
                setTimeout(() => {
                    router.push('/')
                }, 1000)
            } else {
                errorMessage.value = '密码错误，请重新输入'
            }
        } else {
            saveUser(username.value, password.value)
            successMessage.value = '用户不存在，已为您自动注册'
            setTimeout(() => {
                router.push('/')
            }, 1500)
        }

        isLoading.value = false
    }, 800)
}
</script>

<style scoped>
.login-background {
    height: 100vh;
    background: linear-gradient(135deg, #667eea, #764ba2);
    justify-content: center;
    align-items: center;
}

.login-card {
    width: 420px;
    padding: 30px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border-radius: 16px;
    background-color: #ffffffcc;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.login-card:hover {
    transform: translateY(-5px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>