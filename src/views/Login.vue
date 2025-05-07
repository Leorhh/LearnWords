<template>
    <div class="login-container">
        <h2>登录 / 注册</h2>
        <form @submit.prevent="handleSubmit">
            <div>
                <label for="username">用户名：</label>
                <input type="text" id="username" v-model="username" required />
            </div>
            <div>
                <label for="password">密码：</label>
                <input type="password" id="password" v-model="password" required />
            </div>

            <!-- 提示信息 -->
            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

            <button type="submit">登录 / 注册</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

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
    const users = getUsers()

    if (!username.value || !password.value) {
        errorMessage.value = '请输入用户名和密码'
        successMessage.value = ''
        return
    }

    if (users[username.value]) {
        // 用户已存在，验证密码
        if (users[username.value] === password.value) {
            successMessage.value = '登录成功'
            errorMessage.value = ''
            setTimeout(() => {
                router.push('/')
            }, 1000)
        } else {
            errorMessage.value = '密码错误，请重新输入'
            successMessage.value = ''
        }
    } else {
        // 用户不存在，自动注册
        saveUser(username.value, password.value)
        successMessage.value = '用户不存在，已为您自动注册'
        errorMessage.value = ''

        setTimeout(() => {
            router.push('/')
        }, 1500)
    }
}
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.error-message {
    color: red;
    font-size: 14px;
    margin-top: 10px;
}

.success-message {
    color: green;
    font-size: 14px;
    margin-top: 10px;
}

button {
    margin-top: 10px;
}
</style>