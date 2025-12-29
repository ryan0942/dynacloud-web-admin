FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
# 如果是純靜態輸出 (output: export)，這裡可能要改用 nginx image
# 但如果你是用標準 Next.js server 模式，用下面這樣即可：

RUN npm install

COPY . .

# Declare build arguments
ARG APP_TITLE
ARG APP_URL
ARG SERVICE_URL
ARG SERVICE_TIMEOUT
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

# Set environment variables from build arguments
ENV APP_TITLE=$APP_TITLE
ENV APP_URL=$APP_URL
ENV SERVICE_URL=$SERVICE_URL
ENV SERVICE_TIMEOUT=$SERVICE_TIMEOUT
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# 打包
RUN npm run build

# 開放 Port (容器內部通常用 3000)
EXPOSE 3000

# 啟動
CMD ["npm", "start"]