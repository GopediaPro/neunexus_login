pipeline {
    agent any

    // Jenkins 파이프라인에서 사용할 환경 변수
    environment {
        DOCKER_REGISTRY = 'lyckabc.xyz'
        IMAGE_NAME = 'neunexus_login'
        // GitHub 레포지토리 주소
        GIT_REPO_URL = 'https://github.com/GopediaPro/neunexus_login.git'
        // Docker Registry 인증 정보 ID (Jenkins에 등록한 ID)
        REGISTRY_CREDENTIAL_ID = 'docker-registry-credentials'
        // 배포 서버 정보
        DEPLOY_SERVER_SSH = 'root@lyckabc.xyz'
        // 배포 서버 포트
        DEPLOY_SERVER_PORT = '50022'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out from GitHub...'
                // GitHub에서 소스 코드 가져오기
                git branch: 'main', credentialsId: 'github-credentials', url: GIT_REPO_URL
            }
        }

        stage('Set Build Tag') {
            steps {
                script {
                    // 빌드 태그를 커밋 해시로 설정하여 버전 관리
                    env.IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // withCredentials 블록으로 Jenkins에 등록된 정보들을 감쌉니다.
                withCredentials([
                    string(credentialsId: 'vite-keycloak-url', variable: 'VITE_KEYCLOAK_URL'),
                    string(credentialsId: 'vite-keycloak-realm', variable: 'VITE_KEYCLOAK_REALM'),
                    string(credentialsId: 'vite-keycloak-client-id', variable: 'VITE_KEYCLOAK_CLIENT_ID'),
                    string(credentialsId: 'vite-keycloak-admin-id', variable: 'VITE_KEYCLOAK_ADMIN_ID'),
                    string(credentialsId: 'vite-keycloak-admin-password', variable: 'VITE_KEYCLOAK_ADMIN_PASSWORD'),
                    string(credentialsId: 'vite-api-base-url', variable: 'VITE_API_BASE_URL')
                ]) {
                    script {
                        echo "Building Docker image with credentials..."

                        // withCredentials를 통해 주입된 변수들을 직접 사용합니다.
                        docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG}",
                            "--build-arg VITE_KEYCLOAK_URL=${VITE_KEYCLOAK_URL} " +
                            "--build-arg VITE_KEYCLOAK_REALM=${VITE_KEYCLOAK_REALM} " +
                            "--build-arg VITE_KEYCLOAK_CLIENT_ID=${VITE_KEYCLOAK_CLIENT_ID} " +
                            "--build-arg VITE_KEYCLOAK_ADMIN_ID=${VITE_KEYCLOAK_ADMIN_ID} " +
                            "--build-arg VITE_KEYCLOAK_ADMIN_PASSWORD=${VITE_KEYCLOAK_ADMIN_PASSWORD} " +
                            "--build-arg VITE_API_BASE_URL=${VITE_API_BASE_URL} .")
                    }
                }
            }
        }

        stage('Push to Private Registry') {
            steps {
                echo "Pushing image to ${DOCKER_REGISTRY}"
                // Docker Private Registry에 로그인 후 이미지 푸시
                docker.withRegistry("http://${DOCKER_REGISTRY}", REGISTRY_CREDENTIAL_ID) {
                    docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG}").push()
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                echo "Deploying to production server..."
                // [수정 필요] 'your-ssh-key-credential-id'를 실제 Credential ID로 변경하세요.
                sshagent(credentials: ['lyckabc-ssh-key-id']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER_SSH} -p ${DEPLOY_SERVER_PORT} '
                            cd /morphogen/neunexus/login && \\
                            export DOCKER_REGISTRY=${DOCKER_REGISTRY} && \\
                            export IMAGE_NAME=${IMAGE_NAME} && \\
                            export TAG=${env.IMAGE_TAG} && \\
                            docker-compose -f docker-compose.yml --env-file .env.prod pull && \\
                            docker-compose -f docker-compose.yml --env-file .env.prod up -d'
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            // 빌드 후 생성된 Docker 이미지 정리 (Jenkins 서버 용량 확보)
            script {
                sh "docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG} || true"
            }
            cleanWs()
        }
    }
}