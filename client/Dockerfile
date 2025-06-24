# =========================================
# Stage 1: Build a React application
# =========================================
# Node.js 20-alpine 이미지를 기반으로 빌드 환경을 구성합니다.
FROM node:20-alpine AS builder

# 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# package.json과 package-lock.json을 먼저 복사하여 종속성 캐싱을 활용합니다.
COPY package*.json ./

# npm 종속성을 설치합니다.
RUN npm install

# 프로젝트의 나머지 소스 코드를 복사합니다.
COPY . .

# Vite 빌드를 실행하여 /app/dist 폴더에 결과물을 생성합니다.
# 이 단계에서 VITE_KEYCLOAK_URL 등 .env 파일의 환경변수가 사용됩니다.
RUN npm run build

# =========================================
# Stage 2: Serve the application with Nginx
# =========================================
# 경량 웹서버인 Nginx 이미지를 기반으로 최종 서비스 환경을 구성합니다.
FROM nginx:stable-alpine

# Stage 1(builder)에서 빌드된 React 앱의 결과물(dist 폴더)을
# Nginx의 기본 웹 루트 디렉토리로 복사합니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# React Router와 같은 SPA 라우팅을 올바르게 처리하기 위해
# 사용자 정의 Nginx 설정을 복사합니다.
COPY ./public/conf/nginx.conf /etc/nginx/conf.d/default.conf

# Nginx는 기본적으로 80 포트를 사용합니다.
EXPOSE 80

# 컨테이너 시작 시 Nginx를 실행합니다.
CMD ["nginx", "-g", "daemon off;"]