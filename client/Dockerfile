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

# 환경변수 설정 (빌드 시점)
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
ARG VITE_KEYCLOAK_ADMIN_ID
ARG VITE_KEYCLOAK_ADMIN_PASSWORD
ARG VITE_SYNC_ENABLED
ARG VITE_API_BASE_URL

# Vite 빌드를 실행하여 /app/dist 폴더에 결과물을 생성합니다.
# 이 단계에서 ARG로 받은 .env 파일의 변수들이 JS 코드에 삽입됨.
RUN npm run build

# =========================================
# Stage 2: Serve the application with Nginx
# =========================================
# 경량 웹서버인 Nginx 이미지를 기반으로 최종 서비스 환경을 구성합니다.
FROM nginx:stable-alpine

# Stage 2에서도 ARG를 다시 선언해야 값을 전달받을 수 있음
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
ARG VITE_API_BASE_URL

# gettext 패키지 설치 (envsubst 명령어 사용)
RUN apk add --no-cache gettext

# Stage 1(builder)에서 빌드된 React 앱의 결과물(dist 폴더)을
# Nginx의 기본 웹 루트 디렉토리로 복사합니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# React Router와 같은 SPA 라우팅을 올바르게 처리하기 위해
# 사용자 정의 Nginx 설정을 복사합니다. (템플릿으로 사용)
COPY ./public/conf/nginx.conf /etc/nginx/conf.d/default.conf.template

# 런타임 환경변수 설정 (default values)
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL:-https://portal.lyckabc.xyz}
ENV VITE_KEYCLOAK_URL=${VITE_KEYCLOAK_URL:-https://auth.lyckabc.xyz}
ENV VITE_KEYCLOAK_REALM=${VITE_KEYCLOAK_REALM:-toji}
ENV VITE_KEYCLOAK_CLIENT_ID=${VITE_KEYCLOAK_CLIENT_ID:-portal-client}

# --- Docker Entrypoint 설정 ---

# 1. 로컬의 entrypoint 쉘 스크립트를 이미지 안으로 복사합니다.
COPY docker-entrypoint.sh /docker-entrypoint.sh

# 2. 복사한 스크립트에 실행 권한을 부여합니다.
RUN chmod +x /docker-entrypoint.sh

# 3. 컨테이너 시작 시 해당 스크립트를 실행하도록 설정합니다.
ENTRYPOINT ["/docker-entrypoint.sh"]

# 컨테이너가 노출할 포트를 지정합니다.
EXPOSE 5173