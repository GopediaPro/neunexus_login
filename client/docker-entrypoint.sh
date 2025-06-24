#!/bin/sh
set -e

echo "=== Docker Container Starting ==="
echo "Runtime Environment Variables:"
echo "  VITE_API_BASE_URL: $VITE_API_BASE_URL"
echo "  VITE_KEYCLOAK_URL: $VITE_KEYCLOAK_URL"
echo "  VITE_KEYCLOAK_REALM: $VITE_KEYCLOAK_REALM"
echo "  VITE_KEYCLOAK_CLIENT_ID: $VITE_KEYCLOAK_CLIENT_ID"

# 런타임에 빌드된 JS 파일에서 환경변수 플레이스홀더를 실제 값으로 교체
echo "=== Replacing environment variables in built files ==="

# dist 폴더의 모든 JS 파일에서 플레이스홀더를 실제 환경변수 값으로 교체
find /usr/share/nginx/html -name "*.js" -exec sed -i \
  -e "s|__VITE_KEYCLOAK_URL__|$VITE_KEYCLOAK_URL|g" \
  -e "s|__VITE_KEYCLOAK_REALM__|$VITE_KEYCLOAK_REALM|g" \
  -e "s|__VITE_KEYCLOAK_CLIENT_ID__|$VITE_KEYCLOAK_CLIENT_ID|g" \
  -e "s|__VITE_API_BASE_URL__|$VITE_API_BASE_URL|g" {} \;

echo "=== Environment variables replaced in JS files ==="

# nginx 설정에도 환경변수 적용
echo "=== Applying environment variables to nginx configuration ==="
envsubst '${VITE_API_BASE_URL} ${VITE_KEYCLOAK_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "=== Final nginx configuration generated ==="
echo "=== Starting Nginx ==="
exec nginx -g "daemon off;"