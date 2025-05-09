// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'

// 使用懒加载方式引入页面组件
const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const Word = () => import('@/views/Word.vue') // 背单词页面
const WordLookup = () => import('@/views/WordLookup.vue')
const StudentWords = () => import('@/views/StudentWords.vue')
const SelectWords = () => import('@/views/SelectWords.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/word',
    name: 'Word',
    component: Word,
  },
  {
    path: '/select-words',
    name: 'SelectWords',
    component: SelectWords,
  },
  {
    path: '/word-lookup',
    name: 'WordLookup',
    component: WordLookup,
  },
  {
    path: '/student-words',
    name: 'StudentWords',
    component: StudentWords,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router