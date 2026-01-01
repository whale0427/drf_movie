import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 开发服务器配置（对应webpack的devServer）
  server: {
    // host:"127.0.0.1",
    // 可选：指定开发服务器端口
    port: 8080,
    allowedHosts: [
      'www.u19894.nyat.app', // 添加你的域名
      'localhost',           // 保留本地访问
      '127.0.0.1',          // 保留本地访问
    ],
    // 代理配置，解决跨域
    proxy: {
      // 匹配以/api开头的请求
      '/api': {
        // 后端接口的目标地址
        target: 'http://127.0.0.1:8000/api',
        // 开启跨域源模拟，避免后端拦截
        changeOrigin: true,
        // 路径重写，去掉前端的/api前缀（防止重复）
        rewrite: (path) => path.replace(/^\/api/, ''), // Vite中是rewrite，不是webpack的pathRewrite
      },
      // 豆瓣图片代理（关键修改：匹配所有豆瓣图片路径，而非仅img9）
      '/douban-image': {
        // 注意：这里target改为通用的https://img9.doubanio.com（所有豆瓣图片域名都可以通过这个代理转发）
        target: 'https://img9.doubanio.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/douban-image/, ''),
        // 核心：移除Referer请求头（豆瓣防盗链的关键检测项）
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // 删掉Referer头，让豆瓣服务器无法识别请求来源
            proxyReq.removeHeader('referer');
            proxyReq.removeHeader('Referer');
            // 同时保留User-Agent，模拟浏览器
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          });
        },
      },
    },
  },
})
