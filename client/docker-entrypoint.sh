#!/bin/sh
# 스크립트 실행 중 오류 발생 시 즉시 중단
set -e

# 이 스크립트는 Dockerfile이 아닌 별도의 파일이므로,
# echo, set 같은 모든 쉘 명령어들을 자유롭게 사용할 수 있습니다.
echo "=== Docker Container Starting ==="
echo "Runtime Environment Variables:"
echo "  VITE_API_BASE_URL: $VITE_API_BASE_URL"
echo "  VITE_KEYCLOAK_URL: $VITE_KEYCLOAK_URL"
echo "  VITE_KEYCLOAK_REALM: $VITE_KEYCLOAK_REALM"
echo "  VITE_KEYCLOAK_CLIENT_ID: $VITE_KEYCLOAK_CLIENT_ID"

echo "=== Applying environment variables to nginx configuration ==="
envsubst '${VITE_API_BASE_URL} ${VITE_KEYCLOAK_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "=== Final nginx configuration generated: ==="
cat /etc/nginx/conf.d/default.conf
echo "=========================================="

echo "=== Starting Nginx ==="
exec nginx -g "daemon off;"