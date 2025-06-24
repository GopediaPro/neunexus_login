# =========================================
# Stage 1: Build a React application
# =========================================
FROM node:20-alpine AS builder

WORKDIR /app

# package.json과 package-lock.json을 먼저 복사하여 종속성 캐싱을 활용합니다.
COPY package*.json ./

# npm 종속성을 설치합니다.
RUN npm install

# 프로젝트의 나머지 소스 코드를 복사합니다.
COPY . .

# 빌드 시에는 기본값으로 빌드 (런타임에 교체될 예정)
ENV VITE_KEYCLOAK_URL=__VITE_KEYCLOAK_URL__
ENV VITE_KEYCLOAK_REALM=__VITE_KEYCLOAK_REALM__
ENV VITE_KEYCLOAK_CLIENT_ID=__VITE_KEYCLOAK_CLIENT_ID__
ENV VITE_API_BASE_URL=__VITE_API_BASE_URL__

# Vite 빌드를 실행
RUN npm run build

# =========================================
# Stage 2: Serve the application with Nginx
# =========================================
FROM nginx:stable-alpine

# gettext 패키지 설치 (envsubst 명령어 사용)
RUN apk add --no-cache gettext

# Stage 1에서 빌드된 React 앱 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 설정 복사
COPY ./public/conf/nginx.conf /etc/nginx/conf.d/default.conf.template

# 런타임 환경변수 설정 (기본값)
ENV VITE_API_BASE_URL=https://portal.lyckabc.xyz
ENV VITE_KEYCLOAK_URL=https://auth.lyckabc.xyz
ENV VITE_KEYCLOAK_REALM=toji
ENV VITE_KEYCLOAK_CLIENT_ID=portal-client

# entrypoint 스크립트 복사
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 5173