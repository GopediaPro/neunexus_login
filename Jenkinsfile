pipeline {
    agent any

    // Jenkins 파이프라인에서 사용할 환경 변수
    environment {
        DOCKER_REGISTRY = 'lyckabc.xyz'
        IMAGE_NAME = 'neunexus_login'
        // GitHub 레포지토리 주소
        GIT_REPO_URL = 'https://github.com/GopediaPro/neunexus_login.git'
        GIT_CREDENTIAL_ID = 'Iv23likhQak519AdkG6d'
        GIT_BRANCH = 'feat/docker-setup'
        // Docker Registry 인증 정보 ID (Jenkins에 등록한 ID)
        REGISTRY_CREDENTIAL_ID = 'docker-registry-credentials'
        // 배포 서버 정보
        DEPLOY_SERVER_SSH = 'root@lyckabc.xyz'
        // 배포 서버 포트
        DEPLOY_SERVER_PORT = '50022'
        // .env 파일을 위한 secret file credential ID
        ENV_FILE_CREDENTIAL_ID = 'login-env-file'
        // SSH 인증 정보 ID (Jenkins에 등록한 ID)
        SSH_CREDENTIAL_ID = 'lyckabc-ssh-key-id'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out from GitHub...'
                // GitHub에서 소스 코드 가져오기
                git branch: GIT_BRANCH, credentialsId: GIT_CREDENTIAL_ID, url: GIT_REPO_URL
            }
        }

        stage('Set Build Tag') {
            steps {
                script {
                    // 빌드 태그를 "MMDDhhmm" 형식의 타임스탬프로 설정
                    def now = new Date()
                    env.IMAGE_TAG = now.format('MMddHHmm')
                    echo "Generated build tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // secret file을 사용하여 .env 파일의 모든 환경변수를 한번에 로드
                withCredentials([file(credentialsId: ENV_FILE_CREDENTIAL_ID, variable: 'ENV_FILE')]) {
                    script {
                        echo "Building Docker image with environment variables from .env file..."
                        
                        // .env 파일을 client 디렉토리에 복사
                        sh "cp ${ENV_FILE} client/.env"
                        
                        // client 디렉토리로 이동하여 Docker 빌드 실행
                        dir('client') {
                            // Docker 빌드 시 .env 파일의 환경변수들이 자동으로 사용됨
                            docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG}", ".")
                        }
                        
                        // 빌드 후 .env 파일 정리
                        sh "rm -f client/.env"
                    }
                }
            }
        }

        stage('Push to Private Registry') {
            steps {
                echo "Pushing image to ${DOCKER_REGISTRY}"
                // Docker Private Registry에 로그인 후 이미지 푸시
                docker.withRegistry("https://${DOCKER_REGISTRY}", REGISTRY_CREDENTIAL_ID) {
                    docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG}").push()
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                echo "Deploying to production server..."
                // [수정 필요] 'your-ssh-key-credential-id'를 실제 Credential ID로 변경하세요.
                sshagent(credentials: [SSH_CREDENTIAL_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER_SSH} -p ${DEPLOY_SERVER_PORT} '
                            cd /morphogen/neunexus/login && \\
                            export DOCKER_REGISTRY=${DOCKER_REGISTRY} && \\
                            export IMAGE_NAME=${IMAGE_NAME} && \\
                            export TAG=${env.IMAGE_TAG} && \\
                            docker-compose -f docker-compose.yml --env-file .env pull && \\
                            docker-compose -f docker-compose.yml --env-file .env up -d'
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