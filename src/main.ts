// main.ts - Vue 应用入口文件

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts' // 引入路由配置
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// 创建应用实例
const app = createApp(App)

// 注册icon组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 配置 axios 全局默认设置
axios.defaults.baseURL = 'http://127.0.0.1:5000' // 设置后端基础地址
axios.defaults.headers.common['Content-Type'] = 'application/json'

// 使用插件
app.use(router) // 必须注册路由插件
app.use(ElementPlus)

// 挂载应用到 #app 容器
app.mount('#app')
