# CI/CD 환경변수 시스템 설정 가이드 ⚙️

테넌트별 독립적인 CI/CD 파이프라인 구축을 위한 완전 가이드입니다.

---

## 🎯 CI/CD 시스템 개요

### 구조
```
각 테넌트별로 독립적인:
├── 환경변수 (GitHub Secrets)
├── 워크플로우 파일
├── 빌드 파이프라인
└── Google Play 업로드 설정
```

### 이점
- ✅ **테넌트 간 격리**: 각 앱의 키스토어와 설정이 독립적
- ✅ **보안 강화**: 테넌트별 환경변수로 키 분리
- ✅ **병렬 빌드**: 여러 테넌트 동시 빌드 가능
- ✅ **자동 배포**: 메인 브랜치 푸시 시 자동 업로드

---

## 🔐 GitHub Secrets 설정 (테넌트별)

### 1단계: 키스토어를 Base64로 인코딩

각 테넌트의 키스토어를 CI에서 사용할 수 있도록 인코딩합니다:

```bash
# 예시: tenantA 키스토어 인코딩
cd client/android/app/keystores
base64 -i tenantA-release.keystore | pbcopy  # macOS
# 또는
base64 -w 0 tenantA-release.keystore  # Linux

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("tenantA-release.keystore"))
```

### 2단계: GitHub Repository Secrets 등록

**Settings → Secrets and variables → Actions → New repository secret**

#### TenantA용 Secrets:
```
TENANTA_KEYSTORE_BASE64=<위에서 생성한 base64 문자열>
TENANTA_STORE_PASSWORD=<tenantA 스토어 비밀번호>
TENANTA_KEY_PASSWORD=<tenantA 키 비밀번호>
TENANTA_KEY_ALIAS=tenantA-key
```

#### TenantB용 Secrets:
```
TENANTB_KEYSTORE_BASE64=<tenantB base64 문자열>
TENANTB_STORE_PASSWORD=<tenantB 스토어 비밀번호>
TENANTB_KEY_PASSWORD=<tenantB 키 비밀번호>
TENANTB_KEY_ALIAS=tenantB-key
```

#### 공통 Secrets (선택사항):
```
GOOGLE_PLAY_KEY_JSON=<Google Play API JSON 키>
```

---

## 📝 워크플로우 파일 생성

### 템플릿 사용 방법

1. **`.github/workflows/android-build-template.yml`** 파일을 복사
2. 테넌트별로 이름 변경:
   - `android-build-tenantA.yml`
   - `android-build-tenantB.yml`

### 커스터마이징 포인트

#### 📋 각 파일에서 수정할 부분:
```yaml
# BEFORE (템플릿)
env:
  TENANT_ID: TENANT_REPLACE_ME

# AFTER (tenantA용)
env:
  TENANT_ID: TENANTA

# AFTER (tenantB용)
env:
  TENANT_ID: TENANTB
```

---

## 🚀 자동 생성 스크립트

테넌트별 워크플로우 파일을 자동으로 생성하는 스크립트:

### scripts/generate-ci-workflow.js 생성:

```bash
node scripts/generate-ci-workflow.js tenantC
```

이 스크립트는:
1. 템플릿 파일을 복사
2. `TENANT_ID`를 실제 테넌트 ID로 교체
3. `.github/workflows/android-build-tenantC.yml` 생성

---

## 🔄 빌드 프로세스

### 자동 트리거 조건:
- **Push**: `main`, `develop` 브랜치
- **Pull Request**: `main` 브랜치 대상

### 빌드 단계:
1. **환경 설정**: JDK 17, Node.js 18
2. **의존성 설치**: `npm ci`
3. **테마 동기화**: `npm run sync-themes`
4. **리소스 생성**: `npm run generate-resources`
5. **키스토어 복원**: Base64 디코딩
6. **APK 빌드**: `./gradlew assemble<TenantID>Release`
7. **아티팩트 업로드**: GitHub Actions artifacts
8. **Google Play 업로드** (선택사항)

---

## 🛠️ 로컬 vs CI 환경변수 관리

### 로컬 개발 (gradle.properties):
```properties
# 개발용 더미 비밀번호 (커밋 안전)
TENANTA_STORE_PASSWORD=dev-password-change-for-prod
TENANTA_KEY_PASSWORD=dev-password-change-for-prod
```

### CI 환경 (GitHub Secrets):
```
# 실제 프로덕션 비밀번호 (암호화됨)
TENANTA_STORE_PASSWORD=<실제 안전한 비밀번호>
TENANTA_KEY_PASSWORD=<실제 안전한 비밀번호>
```

### 분리 방법:
```yaml
# CI에서 환경변수 덮어쓰기
env:
  TENANTA_STORE_PASSWORD: ${{ secrets.TENANTA_STORE_PASSWORD }}
  TENANTA_KEY_PASSWORD: ${{ secrets.TENANTA_KEY_PASSWORD }}
```

---

## 📊 모니터링 및 알림

### 빌드 상태 확인:
- GitHub Actions 탭에서 각 테넌트별 빌드 상태 확인
- 실패 시 이메일/Slack 알림 설정

### 아티팩트 관리:
- APK 파일은 30일간 보관
- 릴리스 버전은 별도 태그로 관리

---

## 🚨 보안 체크리스트

### ✅ 해야 할 것:
- [ ] GitHub Secrets에 실제 비밀번호 저장
- [ ] Base64 인코딩된 키스토어 저장
- [ ] 테넊트별 환경변수 분리
- [ ] main 브랜치에만 배포 권한 부여

### ❌ 하지 말아야 할 것:
- [ ] gradle.properties에 실제 비밀번호 커밋
- [ ] 키스토어 파일을 Git에 커밋
- [ ] 여러 테넌트가 같은 환경변수 공유
- [ ] CI 로그에 비밀번호 노출

---

## 🔧 트러블슈팅

### 자주 발생하는 문제:

#### 1. 키스토어 인코딩 오류:
```bash
# 해결: Base64 인코딩 다시 시도
base64 -w 0 keystores/tenantA-release.keystore
```

#### 2. 환경변수 이름 오타:
```yaml
# 잘못된 예:
TENANT_A_STORE_PASSWORD  # 언더스코어

# 올바른 예:
TENANTA_STORE_PASSWORD   # 붙여쓰기
```

#### 3. 빌드 실패:
```bash
# 로컬에서 먼저 테스트
cd client/android
./gradlew assembleTenantARelease
```

---

## 📋 테넌트별 CI 설정 체크리스트

### TenantA:
- [ ] ✅ GitHub Secrets 설정됨
- [ ] ✅ 워크플로우 파일 생성됨
- [ ] ✅ 빌드 성공 확인됨
- [ ] ✅ 아티팩트 생성 확인됨

### TenantB:
- [ ] ✅ GitHub Secrets 설정됨
- [ ] ✅ 워크플로우 파일 생성됨
- [ ] ✅ 빌드 성공 확인됨
- [ ] ✅ 아티팩트 생성 확인됨

---

**🎯 이 설정을 완료하면 Push만 해도 자동으로 모든 테넌트 APK가 빌드됩니다!**