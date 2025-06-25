pipeline {
    agent any

    // 파라미터 정의
    parameters {
        string(name: 'RESTORE_VERSION', defaultValue: '', description: '복원할 버전 (MMddHHmm 형식, 예: 06251130)')
        booleanParam(name: 'RESTORE_MODE', defaultValue: false, description: '복원 모드를 활성화하려면 체크')
    }

    // Jenkins 파이프라인에서 사용할 환경 변수
    environment {
        // Docker Registry 설정
        DOCKER_REGISTRY = 'registry.lyckabc.xyz'
        IMAGE_NAME = 'neunexus_login'
        
        // Git 설정
        GIT_REPO_URL = 'https://github.com/GopediaPro/neunexus_login.git'
        GIT_CREDENTIAL_ID = 'Iv23likhQak519AdkG6d'
        
        // 인증 정보
        REGISTRY_CREDENTIAL_ID = 'docker-registry-credentials'
        SSH_CREDENTIAL_ID = 'lyckabc-ssh-key-id'
        DOCKER_REGISTRY_ID = 'docker-registry-id'
        DOCKER_REGISTRY_PW = 'docker-registry-pw'
        LOGIN_ENV_FILE = 'login-env-file'
        
        // 배포 서버 설정 (브랜치별로 동적 설정)
        DEPLOY_SERVER_PORT = '50022'
        
        // 브랜치별 설정을 위한 변수
        IS_DEPLOYABLE = "${env.BRANCH_NAME in ['main', 'dev'] ? 'true' : 'false'}"
    }

    stages {
        stage('Environment Setup') {
            steps {
                script {
                    echo "🔍 현재 브랜치: ${env.BRANCH_NAME}"
                    
                    // 브랜치별 환경 설정
                    switch(env.BRANCH_NAME) {
                        case 'main':
                            env.DEPLOY_ENV = 'production'
                            env.DEPLOY_SERVER_USER_HOST = 'root@lyckabc.xyz'
                            env.LOGIN_SUBDOMAIN = 'portal'
                            env.DOCKER_COMPOSE_FILE = 'docker-compose.prod.yml'
                            break
                        case 'dev':
                            env.DEPLOY_ENV = 'development'
                            env.DEPLOY_SERVER_USER_HOST = 'root@lyckabc.xyz'  // 개발 서버 주소로 변경 필요
                            env.LOGIN_SUBDOMAIN = 'portal'
                            env.DOCKER_COMPOSE_FILE = 'docker-compose.dev.yml'
                            break
                        case '*docker*':
                            env.DEPLOY_ENV = 'development'
                            env.DEPLOY_SERVER_USER_HOST = 'root@lyckabc.xyz'  // 개발 서버 주소로 변경 필요
                            env.LOGIN_SUBDOMAIN = 'portal'
                            env.DOCKER_COMPOSE_FILE = 'docker-compose.dev.yml'
                            break
                        default:
                            env.DEPLOY_ENV = 'none'
                            echo "⚠️ 브랜치 '${env.BRANCH_NAME}'는 자동 배포 대상이 아닙니다."
                    }
                    
                    // PR 빌드인지 확인
                    if (env.CHANGE_ID) {
                        echo "📋 PR #${env.CHANGE_ID} 빌드 - 배포 없이 빌드만 수행합니다."
                        env.IS_PR_BUILD = 'true'
                    } else {
                        env.IS_PR_BUILD = 'false'
                    }
                }
            }
        }

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
                        def timestamp = now.format('MMddHHmm', TimeZone.getTimeZone('Asia/Seoul'))
                        
                        // 브랜치명을 태그에 포함
                        if (env.BRANCH_NAME == 'main') {
                            env.IMAGE_TAG = "prod-${timestamp}"
                        } else if (env.BRANCH_NAME == 'dev') {
                            env.IMAGE_TAG = "dev-${timestamp}"
                        } else {
                            env.IMAGE_TAG = "feature-${timestamp}"
                        }
                        
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
                checkout scm
            }
        }

        stage('Code Quality Check') {
            when {
                allOf {
                    not { expression { params.RESTORE_MODE } }
                    expression { env.IS_PR_BUILD == 'true' || env.IS_DEPLOYABLE == 'true' }
                }
            }
            parallel {
                stage('Lint') {
                    steps {
                        dir('client') {
                            echo "코드 린팅을 수행합니다..."
                            // sh 'npm ci && npm run lint'
                        }
                    }
                }
                stage('Test') {
                    steps {
                        dir('client') {
                            echo "테스트를 수행합니다..."
                            // sh 'npm ci && npm run test'
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            when {
                allOf {
                    not { expression { params.RESTORE_MODE } }
                    anyOf {
                        expression { env.IS_PR_BUILD == 'true' }
                        expression { env.IS_DEPLOYABLE == 'true' }
                    }
                }
            }
            steps {
                dir('client') {
                    script {
                        echo "Docker 이미지를 빌드합니다: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG}"
                        
                        // 브랜치별 환경 파일 선택
                        def envFileCredentialId = LOGIN_ENV_FILE
                        if (env.BRANCH_NAME == 'dev') {
                            envFileCredentialId = 'login-env-file-dev'  // 개발용 환경 파일
                        }
                        
                        withCredentials([file(credentialsId: envFileCredentialId, variable: 'ENV_FILE')]) {
                            sh "cp ${ENV_FILE} .env"
                        }
                        
                        // Docker 이미지 빌드
                        sh """
                            docker build \
                                --build-arg BUILD_ENV=${env.DEPLOY_ENV} \
                                --build-arg BUILD_DATE=\$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                                --build-arg BUILD_VERSION=${env.IMAGE_TAG} \
                                --build-arg VCS_REF=\$(git rev-parse --short HEAD) \
                                -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG} \
                                -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BRANCH_NAME}-latest \
                                .
                        """
                        
                        // .env 파일 삭제
                        sh "rm -f .env"
                    }
                }
            }
        }

        stage('Security Scan') {
            when {
                allOf {
                    not { expression { params.RESTORE_MODE } }
                    expression { env.IS_DEPLOYABLE == 'true' }
                }
            }
            steps {
                echo "Docker 이미지 보안 스캔을 수행합니다..."
                // Trivy, Anchore 등의 도구를 사용한 보안 스캔
                // sh "trivy image ${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG}"
            }
        }

        stage('Push to Private Registry') {
            when {
                allOf {
                    not { expression { params.RESTORE_MODE } }
                    expression { env.IS_DEPLOYABLE == 'true' }
                    expression { env.IS_PR_BUILD == 'false' }
                }
            }
            steps {
                script {
                    echo "Private Registry에 로그인 및 이미지 푸시를 시작합니다..."
                    
                    withCredentials([usernamePassword(
                        credentialsId: REGISTRY_CREDENTIAL_ID,
                        usernameVariable: 'REGISTRY_USER',
                        passwordVariable: 'REGISTRY_PASS'
                    )]) {
                        sh """
                            echo \${REGISTRY_PASS} | docker login ${DOCKER_REGISTRY} -u \${REGISTRY_USER} --password-stdin
                            
                            # 버전 태그와 latest 태그 모두 푸시
                            docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG}
                            docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BRANCH_NAME}-latest
                            
                            docker logout ${DOCKER_REGISTRY}
                        """
                    }
                }
            }
        }

        stage('Deploy to Server') {
            when {
                allOf {
                    expression { env.IS_DEPLOYABLE == 'true' }
                    expression { env.IS_PR_BUILD == 'false' }
                    anyOf {
                        expression { params.RESTORE_MODE == true }
                        not { expression { params.RESTORE_MODE } }
                    }
                }
            }
            steps {
                echo "배포 서버(${DEPLOY_SERVER_USER_HOST})에 ${env.DEPLOY_ENV} 환경으로 배포를 시작합니다..."
                
                sshagent(credentials: [SSH_CREDENTIAL_ID]) {
                    script {
                        // 브랜치별 환경 파일 선택
                        def envFileCredentialId = LOGIN_ENV_FILE
                        
                        withCredentials([file(credentialsId: envFileCredentialId, variable: 'ENV_FILE')]) {
                            // 1. Credential 파일 내용을 미리 읽어서 Groovy 변수에 저장
                            def envFileContent = readFile(ENV_FILE).trim()

                            sh """
                                ssh -p ${DEPLOY_SERVER_PORT} -o StrictHostKeyChecking=no ${DEPLOY_SERVER_USER_HOST} << 'EOF'
                                set -e
                                
                                echo ">> 배포 디렉토리로 이동"
                                cd /morphogen/neunexus/login
                                
                                echo ">> 이전 버전 백업"
                                if [ -f .env.docker ]; then
                                    # 불필요한 이스케이프 제거. 쉘이 $(...)를 해석함
                                    cp .env.docker .env.docker.backup.$(date +%Y%m%d%H%M%S)
                                fi
                                
                                echo ">> 배포용 환경변수 파일(.env.docker) 생성"
                                cat > .env.docker << 'ENV_EOF'
${envFileContent}
DOCKER_REGISTRY=${DOCKER_REGISTRY}
IMAGE_NAME=${IMAGE_NAME}
TAG=${env.IMAGE_TAG}
LOGIN_SUBDOMAIN=${LOGIN_SUBDOMAIN}
DEPLOY_ENV=${env.DEPLOY_ENV}
ENV_EOF
                                
                                echo ">> Docker Registry 로그인"
                                docker login ${DOCKER_REGISTRY} -u ${DOCKER_REGISTRY_USER} -p ${DOCKER_REGISTRY_PASSWORD}
                                
                                echo ">> 최신 버전의 Docker 이미지를 다운로드합니다: ${env.IMAGE_TAG}"
                                docker-compose -f ${DOCKER_COMPOSE_FILE} --env-file .env.docker pull
                                
                                echo ">> 헬스체크를 위한 이전 컨테이너 정보 저장"
                                # 불필요한 이스케이프 제거
                                OLD_CONTAINER_ID=$(docker-compose -f ${DOCKER_COMPOSE_FILE} ps -q ${IMAGE_NAME} 2>/dev/null || true)
                                
                                echo ">> docker-compose를 사용하여 서비스 업데이트"
                                docker-compose -f ${DOCKER_COMPOSE_FILE} --env-file .env.docker up -d --force-recreate --no-build
                                
                                echo ">> 헬스체크 수행 (30초 대기)"
                                sleep 30
                                
                                if docker-compose -f ${DOCKER_COMPOSE_FILE} ps | grep -q "Up"; then
                                    echo "✅ 배포 성공: ${env.IMAGE_TAG}"
                                    
                                    echo ">> 오래된 Docker 이미지 정리"
                                    # 불필요한 이스케이프 제거
                                    docker images ${DOCKER_REGISTRY}/${IMAGE_NAME} --format "{{.Tag}} {{.ID}}" | \
                                        grep -E "^(dev|prod)-[0-9]{8}" | \
                                        sort -r | \
                                        tail -n +4 | \
                                        awk '{print $2}' | \
                                        xargs -r docker rmi || true
                                else
                                    echo "❌ 헬스체크 실패, 롤백을 시도합니다..."
                                    # 불필요한 이스케이프 제거
                                    if [ ! -z "$OLD_CONTAINER_ID" ]; then
                                        LATEST_BACKUP=$(ls -t .env.docker.backup.* | head -n 1)
                                        if [ -f "$LATEST_BACKUP" ]; then
                                            echo ">> 가장 최신 백업 파일($LATEST_BACKUP)로 롤백합니다."
                                            docker-compose -f ${DOCKER_COMPOSE_FILE} --env-file $LATEST_BACKUP up -d --force-recreate --no-build
                                        fi
                                    fi
                                    exit 1
                                fi
                                
                                docker logout ${DOCKER_REGISTRY}
EOF
                            """
                        }
                    }
                }
            }
        }

        stage('Post-Deploy Verification') {
            when {
                allOf {
                    expression { env.IS_DEPLOYABLE == 'true' }
                    expression { env.IS_PR_BUILD == 'false' }
                    not { expression { params.RESTORE_MODE } }
                }
            }
            steps {
                echo "배포 후 검증을 수행합니다..."
                // E2E 테스트, API 헬스체크 등
                script {
                    def deployUrl = env.BRANCH_NAME == 'main' ? 
                        "https://${LOGIN_SUBDOMAIN}.lyckabc.xyz" : 
                        "https://${LOGIN_SUBDOMAIN}.lyckabc.xyz"
                    
                    // sh "curl -f ${deployUrl}/health || exit 1"
                }
            }
        }
    }

    post {
        always {
            echo 'Jenkins Agent의 Workspace를 정리합니다...'
            
            // Docker 이미지 정리 (PR 빌드의 경우)
            script {
                if (env.IS_PR_BUILD == 'true') {
                    sh """
                        docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.IMAGE_TAG} || true
                        docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BRANCH_NAME}-latest || true
                    """
                }
            }
            
            cleanWs()
        }
        
        success {
            script {
                if (env.IS_DEPLOYABLE == 'true' && env.IS_PR_BUILD == 'false') {
                    // Slack, Email 등으로 배포 성공 알림
                    echo "✅ ${env.DEPLOY_ENV} 환경에 버전 ${env.IMAGE_TAG} 배포 성공!"
                }
            }
        }
        
        failure {
            script {
                if (env.IS_DEPLOYABLE == 'true' && env.IS_PR_BUILD == 'false') {
                    // Slack, Email 등으로 배포 실패 알림
                    echo "❌ ${env.DEPLOY_ENV} 환경 배포 실패!"
                }
            }
        }
    }
}