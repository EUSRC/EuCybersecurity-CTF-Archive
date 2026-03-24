# 使用阿里云镜像加速
FROM node:18-alpine AS base

# 设置工作目录
WORKDIR /app

# 使用淘宝 npm 镜像
RUN npm config set registry https://registry.npmmirror.com

# 安装依赖阶段
FROM base AS deps

# 替换 Alpine 源为阿里云镜像
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装 libc6-compat（Next.js standalone 需要）
RUN apk add --no-cache libc6-compat

# 复制 package 文件
COPY site/package.json ./

# 安装依赖（使用淘宝镜像）
RUN npm install --legacy-peer-deps --registry=https://registry.npmmirror.com


# 构建阶段
FROM base AS builder

WORKDIR /app

# 从 deps 阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY site/ ./

# 构建 Next.js 应用
RUN npm run build

# 运行阶段
FROM node:18-alpine AS runner

WORKDIR /app

# 替换 Alpine 源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制 public 文件夹
COPY --from=builder /app/public ./public

# 复制 standalone 输出
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]