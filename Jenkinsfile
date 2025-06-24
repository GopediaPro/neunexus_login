pipeline {
    agent any

    // 파라미터 정의 - 복원 시 사용
    parameters {
        string(name: 'RESTORE_VERSION', defaultValue: '', description: '복원할 버전 (MMddHHmm 형식, 예: 06251130)')
        booleanParam(name: 'RESTORE_MODE', defaultValue: false, description: '복원 모드를 활성화하려면 체크')
    }

    // Jenkins 파이프라인에서 사용할 환경 변수
    environment {
        DOCKER_REGISTRY = 'registry.lyckabc.xyz'
        IMAGE_NAME = 'neunexus_login'
        GIT_REPO_URL = 'https://github.com/GopediaPro/neunexus_login.git'
        GIT_CREDENTIAL_ID = 'Iv23likhQak519AdkG6d'
        GIT_BRANCH = 'feat/docker-setup'
        REGISTRY_CREDENTIAL_ID = 'docker-registry-credentials'
        DEPLOY_SERVER_USER_HOST = 'root@lyckabc.xyz'
        DEPLOY_SERVER_PORT = '50022'
        SSH_CREDENTIAL_ID = 'lyckabc-ssh-key-id'
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    if (params.RESTORE_MODE) {
                        if (params.RESTORE_VERSION.trim().isEmpty()) {
                            error "❌ 복원 모드에서는 'RESTORE_VERSION'을 반드시 입력해야 합니다."
                        }
                        env.IMAGE_TAG = params.RESTORE_VERSION
                        echo "🔄 [복원 모드] 버전 ${env.IMAGE_TAG}(으)로 복원을 시작합니다."
                    } else {
                        def now = new Date()
                        env.IMAGE_TAG = now.format('MMddHHmm', TimeZone.getTimeZone('Asia/Seoul'))
                        echo "🚀 [빌드 모드] 새 버전 ${env.IMAGE_TAG}(을)를 생성합니다."
                    }
                }
            }
        }

        stage('Checkout from Git') {
            when {
                not { expression { params.RESTORE_MODE } }
            }
            steps {
                echo 'Source 코드를 다운로드합니다...'
                git branch: GIT_BRANCH, credentialsId: GIT_CREDENTIAL_ID, url: GIT_REPO_URL
            }
        }

        stage('Build Docker Image') {
            when {
                not { expression { params.RESTORE_MODE } }
            }
            steps {
                dir('client') {
                    script {
                        echo "Docker 이미지를 빌드합니다: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG}"
                        // .env 파일 없이 클린 빌드 실행
                        // 이미지는 환경과 분리되어야 합니다.
                        docker.withRegistry("https://${DOCKER_REGISTRY}", REGISTRY_CREDENTIAL_ID) {
                            def customImage = docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG}", ".")
                        }
                    }
                }
            }
        }

        stage('Push to Private Registry') {
            when {
                not { expression { params.RESTORE_MODE } }
            }
            steps {
                script {
                    echo "이미지를 Private Registry에 푸시합니다..."
                    docker.withRegistry("https://${DOCKER_REGISTRY}", REGISTRY_CREDENTIAL_ID) {
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                echo "배포 서버(${DEPLOY_SERVER_USER_HOST})에 배포를 시작합니다..."
                sshagent(credentials: [SSH_CREDENTIAL_ID]) {
                    // 더 안정적이고 읽기 쉬운 Here-document 문법 사용
                    sh """
                        ssh -p ${DEPLOY_SERVER_PORT} -o StrictHostKeyChecking=no ${DEPLOY_SERVER_USER_HOST} << 'EOF'
                            # 스크립트 실행 중 오류 발생 시 즉시 중단
                            set -e

                            echo ">> 배포 디렉토리로 이동"
                            cd /morphogen/neunexus/login

                            echo ">> 최신 버전의 Docker 이미지를 다운로드합니다: ${env.IMAGE_TAG}"
                            # docker-compose.yml이 참조할 환경변수 파일(.env) 업데이트
                            # TAG 변수를 현재 배포 버전으로 덮어씀
                            echo "TAG=${env.IMAGE_TAG}" > .env.docker
                            
                            # Private Registry 로그인
                            # 참고: Jenkins Secret Text를 사용하여 로그인 정보를 안전하게 전달할 수도 있음
                            docker login ${DOCKER_REGISTRY}

                            echo ">> docker-compose를 사용하여 서비스 업데이트"
                            # .env.docker 파일을 환경변수로 사용하여 pull
                            docker-compose -f docker-compose.yml --env-file .env.docker pull
                            
                            # --force-recreate: 이미지가 변경되었으므로 컨테이너 강제 재생성
                            # --no-build: 배포 서버에서 실수로 빌드하는 것을 방지
                            docker-compose -f docker-compose.yml --env-file .env.docker up -d --force-recreate --no-build

                            echo ">> 사용하지 않는 Docker 이미지 정리"
                            docker image prune -af

                            echo "✅ 배포 완료: ${env.IMAGE_TAG}"
                        EOF
                    """
                }
            }
        }
    }

    post {
        always {
            // Jenkins Agent의 작업 공간 정리
            echo 'Jenkins Agent의 Workspace를 정리합니다...'
            cleanWs()
            
            // Jenkins Agent에 남아있는 Docker 이미지 정리 (빌드/복원 시 다운로드한 이미지)
            script {
                // 로그인 실패 등으로 태그가 없을 수 있으므로 오류 무시
                sh "docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG} || true"
            }
        }
    }
}