import axios from 'axios';

// 创建一个 axios 实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // 通过环境变量获取后端地址
  timeout: 10000, // 请求超时设置，适当增加超时等待时间
});

// 请求拦截器（可选）
api.interceptors.request.use(
  (config) => {
    // 在这里可以添加请求头，或者做其他配置，例如 token 认证
    console.log('Request Config:', config); // 用于调试，查看请求参数
    return config;
  },
  (error) => {
    // 请求错误时处理
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器（可选）
api.interceptors.response.use(
  (response) => {
    // 处理正常的响应数据
    console.log('Response Data:', response.data); // 用于调试，查看响应数据
    return response.data;  // 返回数据部分，前端只关注返回的数据，不需要包括整个响应对象
  },
  (error) => {
    // 响应错误时处理
    console.error('Response Error:', error);  // 打印错误信息
    return Promise.reject(error); // 抛出错误，让调用者可以捕获
  }
);

export default api;
