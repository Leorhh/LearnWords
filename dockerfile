# 使用官方 Node 16 镜像作为基础镜像
FROM node:16

# 设置工作目录为 /app
WORKDIR /app

# 复制 package.json 和 package-lock.json 到容器
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有项目文件到容器中
COPY . .

# 构建前端应用
RUN npm run build

# 安装 serve，用于提供静态文件
RUN npm install -g serve

# 启动 serve 静态文件服务器，监听 5000 端口
CMD ["serve", "-s", "dist", "-l", "5000"]

# 开放容器内的 5000 端口
EXPOSE 5000
