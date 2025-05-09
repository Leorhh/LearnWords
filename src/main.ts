// main.ts - Vue 应用入口文件

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts' // 引入路由配置
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(router) // 必须注册路由插件
app.use(ElementPlus)

// 挂载应用到 #app 容器
app.mount('#app')