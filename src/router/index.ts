import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Word from '@/views/Word.vue' // 引入背单词页面

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/word', name: 'Word', component: Word }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router