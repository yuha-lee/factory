# 키 백업 및 회전 전략 📋

대량 앱 생산을 위한 키 관리, 백업, 회전 전략 완전 가이드입니다.

---

## 🔐 키 관리 아키텍처

### 3단계 키 시스템:
```
1. 개발 키 (Debug) ────── 로컬 개발용
2. 업로드 키 (Upload) ─── Google Play 업로드용 (우리가 관리)
3. 앱 서명 키 (Release) ── 실제 사용자 다운로드용 (Google이 관리)
```

### 책임 분담:
- **개발자**: 업로드 키 생성, 백업, 회전
- **Google**: 앱 서명 키 생성, 보관, 관리
- **CI/CD**: 자동화된 빌드 및 업로드

---

## 📦 백업 전략

### 자동 백업 시스템

#### 정기 백업 실행:
```bash
# 모든 키스토어 백업
node scripts/backup-keystores.js

# 특정 위치에 백업
node scripts/backup-keystores.js /path/to/secure/location
```

#### 백업 내용:
- ✅ 모든 테넌트 키스토어 파일
- ✅ gradle.properties 설정
- ✅ 백업 메니페스트 (JSON)
- ✅ 타임스탬프 및 메타데이터

### 백업 보관 전략

#### 3-2-1 백업 규칙:
- **3개 복사본**: 원본 + 백업 2개
- **2개 다른 매체**: 클라우드 + 로컬
- **1개 오프사이트**: 물리적 분리 위치

#### 구체적 보관 장소:
1. **로컬 암호화 폴더**: `~/secure-keystore-backup/`
2. **클라우드 스토리지**: Google Drive, Dropbox (암호화)
3. **오프라인 매체**: USB, 외장하드 (암호화)

---

## 🔄 키 회전 (Key Rotation) 전략

### 언제 회전해야 하는가?

#### ⚠️ 즉시 회전 필요:
- 키스토어 파일 노출 의심
- 개발자 계정 보안 침해
- CI/CD 시스템 해킹
- 비밀번호 유출

#### 📅 정기 회전 (권장):
- **6개월마다**: 보안 강화
- **새로운 주요 릴리스**: 버전 관리
- **개발팀 변경**: 접근 권한 관리

### 업로드 키 회전 절차

#### 1단계: 새 업로드 키 생성
```bash
# 현재 키 백업
node scripts/backup-keystores.js

# 새 키 생성 (예: tenantA-new)
node scripts/generate-keystore.js tenantA-new
```

#### 2단계: Google Play Console 업데이트
1. **Google Play Console** → **설정** → **앱 서명**
2. **업로드 키 인증서** → **새 업로드 키 등록**
3. 새 키스토어로 생성한 APK 업로드
4. Google 승인 대기 (24-48시간)

#### 3단계: 시스템 업데이트
```bash
# Gradle 설정 업데이트
vim client/android/gradle.properties
# TENANTA_STORE_FILE=keystores/tenantA-new-release.keystore

# CI 환경변수 업데이트
# GitHub Secrets에 새 키스토어 Base64 등록

# 테스트 빌드
./gradlew assembleTenantARelease
```

#### 4단계: 구 키 폐기
```bash
# 안전한 위치로 이동 (즉시 삭제 금지)
mkdir -p ~/deprecated-keystores
mv keystores/tenantA-release.keystore ~/deprecated-keystores/
```

---

## 🚨 응급 상황 대응

### 키 분실 시나리오별 대응

#### 시나리오 1: 업로드 키 분실
```
1. 백업에서 복구 시도
2. 불가능하면 Google 지원팀 연락
3. 앱 서명 키 증명서 제공
4. 새 업로드 키 등록 요청
5. CI/CD 시스템 업데이트
```

#### 시나리오 2: 비밀번호 분실
```
1. 백업 매니페스트 확인
2. gradle.properties.backup 확인
3. 패스워드 매니저 확인
4. 불가능하면 키 회전 수행
```

#### 시나리오 3: 키스토어 손상
```
1. 파일 무결성 검증
2. 백업에서 복구
3. 키스토어 정보 검증
4. 테스트 빌드 수행
```

### 응급 연락처
- **Google Play 지원팀**: play-console-support@google.com
- **개발팀 리드**: [팀 연락처]
- **DevOps 담당자**: [담당자 연락처]

---

## 🛡️ 보안 모범 사례

### 키 생성 시:
- ✅ 강력한 비밀번호 사용 (20자 이상)
- ✅ 테넌트별 고유 비밀번호
- ✅ 패스워드 매니저 활용
- ✅ 정확한 인증서 정보 입력

### 키 저장 시:
- ✅ 암호화된 백업
- ✅ 접근 권한 제한
- ✅ 버전 관리에서 제외
- ✅ 정기적 백업 검증

### 키 사용 시:
- ✅ CI/CD 환경변수만 사용
- ✅ 로그에 비밀번호 노출 금지
- ✅ 개발자별 접근 권한 관리
- ✅ 사용 기록 모니터링

---

## 📊 키 관리 모니터링

### 정기 점검 체크리스트 (월간)

#### ✅ 백업 상태 확인:
- [ ] 최신 백업 날짜 확인
- [ ] 백업 파일 무결성 검증
- [ ] 클라우드 동기화 상태
- [ ] 오프라인 백업 상태

#### ✅ 보안 상태 점검:
- [ ] CI 환경변수 만료일 확인
- [ ] Google Play Console 접근 로그 점검
- [ ] 개발팀 권한 검토
- [ ] 비밀번호 강도 검토

#### ✅ 시스템 테스트:
- [ ] 각 테넌트 빌드 성공 여부
- [ ] 키스토어 파일 접근 가능성
- [ ] 백업에서 복구 테스트
- [ ] CI/CD 파이프라인 동작

---

## 🔧 자동화 도구

### 백업 자동화:
```bash
# 크론탭 등록 (주간 백업)
0 2 * * 1 cd /path/to/project && node scripts/backup-keystores.js
```

### 모니터링 스크립트:
```bash
# 키스토어 상태 점검
node scripts/check-keystore-health.js

# CI 환경변수 검증
node scripts/verify-ci-secrets.js
```

### 알림 시스템:
- 백업 실패 시 이메일 알림
- 키 만료 90일 전 알림
- 비정상 접근 시 Slack 알림

---

## 📋 테넌트별 키 관리 현황

### TenantA:
- [ ] ✅ 업로드 키 생성: 2024-XX-XX
- [ ] ✅ 마지막 백업: 2024-XX-XX
- [ ] ✅ Google Play 등록: 완료
- [ ] ✅ 다음 회전 예정: 2024-XX-XX

### TenantB:
- [ ] ✅ 업로드 키 생성: 2024-XX-XX
- [ ] ✅ 마지막 백업: 2024-XX-XX
- [ ] ✅ Google Play 등록: 완료
- [ ] ✅ 다음 회전 예정: 2024-XX-XX

---

## 📚 관련 문서 링크

- [새 앱 생성 가이드](./NEW_APP_SETUP_GUIDE.md)
- [Google Play App Signing 가이드](./GOOGLE_PLAY_APP_SIGNING_GUIDE.md)  
- [CI/CD 설정 가이드](./CI_CD_SETUP_GUIDE.md)
- [Google Play Console 도움말](https://support.google.com/googleplay/android-developer/answer/9842756)

---

**🎯 정기적인 키 관리로 안전한 앱 대량 생산 시스템을 유지하세요!**