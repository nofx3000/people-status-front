# 构建阶段
FROM node:18.19.1-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --registry=https://registry.npmmirror.com

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3000

CMD ["npm", "start"] 