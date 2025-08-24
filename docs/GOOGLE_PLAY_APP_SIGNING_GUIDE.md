# Google Play App Signing 완전 가이드 🔐

Google Play App Signing을 활용한 안전한 앱 배포 시스템 구축 가이드입니다.

---

## 📋 Google Play App Signing이란?

**전통적인 방식 (위험):**
```
개발자가 앱 서명 키 직접 관리 → 키 분실 시 앱 업데이트 불가능
```

**Google Play App Signing (안전):**
```
개발자: 업로드 키만 관리
Google: 실제 앱 서명 키 안전하게 보관 및 관리
```

### 🎯 주요 이점
- ✅ **키 분실 방지**: Google이 앱 서명 키 안전 보관
- ✅ **업로드 키 교체 가능**: 분실 시에도 복구 가능
- ✅ **보안 강화**: 업로드 키와 앱 서명 키 분리
- ✅ **자동 최적화**: Play Asset Delivery 등 최적화 기능

---

## 🚀 신규 앱용 설정 방법

### 1단계: Google Play Console에서 새 앱 생성
1. **Google Play Console** 접속
2. **앱 만들기** 클릭
3. 앱 세부정보 입력:
   - 앱 이름: `TenantC App` (예시)
   - 기본 언어: `한국어`
   - 앱 또는 게임: `앱`
   - 무료 또는 유료: `무료`

### 2단계: Google Play App Signing 활성화 (자동)
- **2021년 8월 이후 생성된 모든 새 앱은 자동으로 Google Play App Signing 활성화**
- 별도 설정 불필요!

### 3단계: 업로드 키 등록
```bash
# 1. 테넌트별 업로드 키 생성 (이미 완료)
node scripts/generate-keystore.js tenantC

# 2. APK 빌드 및 업로드
cd client/android
./gradlew assembleTenantCRelease

# 3. Google Play Console에서 APK 업로드
# → 첫 번째 업로드 시 자동으로 업로드 키 등록됨
```

---

## 🔑 업로드 키 vs 앱 서명 키 차이점

| 구분 | 업로드 키 | 앱 서명 키 |
|------|-----------|------------|
| **관리 주체** | 개발자 | Google Play |
| **용도** | APK/AAB 업로드용 | 실제 앱 서명용 |
| **교체 가능성** | 가능 (Google 지원팀 통해) | 불가능 |
| **보안 등급** | 중간 | 최고 |
| **분실 시** | 복구 가능 | Google이 보관하므로 안전 |

### 💡 우리 시스템에서의 역할
- **현재 생성하는 키스토어** = 업로드 키
- **Google Play가 생성하는 키** = 실제 앱 서명 키
- **사용자가 다운로드하는 APK** = Google의 앱 서명 키로 서명됨

---

## 🔄 앱별 Google Play App Signing 설정 체크리스트

### 새 테넌트 앱마다 수행:

#### 1️⃣ 업로드 키 생성
```bash
node scripts/generate-keystore.js <tenantID>
```

#### 2️⃣ Google Play Console 새 앱 생성
- 앱 이름: `<TenantID> App`
- 패키지명: `com.client.<tenantID>` (자동 설정)

#### 3️⃣ 첫 번째 APK 업로드
```bash
cd client/android
./gradlew assemble<TenantID>Release
```
- 생성된 APK를 Google Play Console **내부 테스트**에 업로드
- 이때 업로드 키가 자동 등록됨

#### 4️⃣ App Signing 상태 확인
1. Google Play Console → **설정** → **앱 서명**
2. **"Google Play App Signing을 사용하고 있습니다"** 메시지 확인
3. **업로드 키 인증서** 정보 확인

---

## 🛡️ 보안 모범 사례

### 업로드 키 관리
```bash
# 1. 키스토어 파일 백업
mkdir -p ~/secure-keystore-backup
cp client/android/app/keystores/*.keystore ~/secure-keystore-backup/

# 2. 패스워드 안전 보관
# gradle.properties (로컬 개발용)
# CI 환경변수 (배포용)
# 패스워드 매니저 (장기 보관용)
```

### 접근 권한 관리
- **키스토어 파일**: 개발팀만 접근
- **Google Play Console**: 릴리스 매니저만 접근
- **CI 환경변수**: DevOps 팀만 접근

---

## 🚨 응급 상황 대응

### 업로드 키 분실 시
1. **즉시 Google 지원팀에 연락**
2. **앱 서명 키 증명서 제공** (Google Play Console에서 다운로드)
3. **새 업로드 키 생성 및 등록** (Google 지원 하에)
4. **CI 시스템 업데이트**

### 키스토어 파일 손상 시
```bash
# 백업에서 복구
cp ~/secure-keystore-backup/<tenant>-release.keystore client/android/app/keystores/

# 패스워드 확인
grep "<TENANT>_STORE_PASSWORD" client/android/gradle.properties
```

---

## 📊 앱별 서명 상태 추적

### 체크리스트 템플릿 (테넌트별 복사해서 사용)

**TenantA:**
- [ ] ✅ 업로드 키 생성됨
- [ ] ✅ Google Play Console 앱 생성됨
- [ ] ✅ 첫 번째 APK 업로드됨
- [ ] ✅ Google Play App Signing 활성화 확인됨
- [ ] ✅ 업로드 키 백업 완료
- [ ] ✅ CI 환경변수 설정됨

**TenantB:**
- [ ] ✅ 업로드 키 생성됨
- [ ] ✅ Google Play Console 앱 생성됨
- [ ] ✅ 첫 번째 APK 업로드됨
- [ ] ✅ Google Play App Signing 활성화 확인됨
- [ ] ✅ 업로드 키 백업 완료
- [ ] ✅ CI 환경변수 설정됨

---

## 🔗 다음 단계

Google Play App Signing 설정이 완료되면:
1. **CI/CD 파이프라인 설정** (다음 문서 참조)
2. **자동 배포 시스템 구축**
3. **키 회전 전략 수립**

**🎯 이 설정을 완료하면 앱 서명 키 분실 위험이 제거됩니다!**