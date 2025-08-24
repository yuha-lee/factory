# 새 앱 생성 가이드 📱

앱 대량 생산을 위한 단계별 체크리스트입니다. **각 앱마다 독립적인 키스토어**를 가지므로 이 가이드를 따라주세요.

---

## 🔥 필수 단계 (새 앱 생성할 때마다)

### 1단계: 키스토어 생성 🔐
```bash
# 새 테넌트용 키스토어 생성 (tenantC 예시)
node scripts/generate-keystore.js tenantC
```

**실행 시 입력 사항:**
- 자동 생성 패스워드 사용할지 (`Y` 추천)
- Common Name: `tenantC App` (앱 이름)
- Organizational Unit: `Development`
- Organization: 회사명
- City, State, Country 정보

**결과:** 
- `keystores/tenantC-release.keystore` 생성
- `gradle.properties`에 tenantC 설정 추가
- `flavors.gradle`에 tenantC 추가

---

### 2단계: 빌드 테스트 🔨
```bash
# Android 디렉토리로 이동
cd client/android

# 새 테넌트 빌드 테스트 (tenantC 예시)
./gradlew assembleTenantCRelease
```

**성공하면:** `client/android/app/build/outputs/apk/tenantC/release/` 경로에 APK 생성

---

### 3단계: Google Play Console 설정 📤

#### 3.1 Google Play App Signing 활성화
1. Google Play Console에서 새 앱 생성
2. **앱 서명** → **Google Play 앱 서명 사용** (자동으로 활성화됨)
3. 업로드 키 등록 필요 시 `.keystore` 파일 업로드

#### 3.2 앱 정보 설정
- 앱 이름: `tenantC 고유 이름`
- 패키지명: `com.client.tenantC` (자동 생성됨)
- 앱 아이콘, 스크린샷 등 업로드

---

### 4단계: CI/CD 설정 (선택사항) ⚙️

#### GitHub Actions 환경변수 추가:
```
TENANTC_STORE_PASSWORD=<패스워드>
TENANTC_KEY_PASSWORD=<키패스워드>
```

#### 빌드 명령어:
```yaml
- name: Build TenantC Release
  run: cd client/android && ./gradlew assembleTenantCRelease
```

---

## 📋 체크리스트 (새 앱마다 확인)

- [ ] ✅ `node scripts/generate-keystore.js <tenantID>` 실행
- [ ] ✅ 빌드 성공: `./gradlew assemble<TenantID>Release`
- [ ] ✅ Google Play Console에 새 앱 생성
- [ ] ✅ Google Play App Signing 활성화 확인
- [ ] ✅ APK 업로드 및 테스트
- [ ] ✅ CI 환경변수 설정 (필요시)
- [ ] ✅ 키스토어 백업 저장

---

## 🚨 중요한 보안 사항

### 키스토어 백업
```bash
# 키스토어 백업 (각 테넌트마다)
cp client/android/app/keystores/<tenant>-release.keystore ~/secure-backup/
```

### 패스워드 관리
- **gradle.properties**: 개발용 (버전 관리 안함)
- **CI 환경변수**: 프로덕션 배포용
- **안전한 패스워드 관리자**: 장기 보관용

### Google Play App Signing 이점
- **키 분실 방지**: Google이 앱 서명 키를 안전하게 보관
- **키 로테이션**: 업로드 키만 교체 가능
- **보안 향상**: 업로드 키와 앱 서명 키 분리

---

## 🔄 키 로테이션 (향후 필요시)

### 업로드 키 교체 방법:
1. 새 업로드 키 생성: `node scripts/generate-keystore.js <tenant>-new`
2. Google Play Console에서 새 키 등록
3. CI 환경변수 업데이트
4. 이전 키는 백업 보관

---

## 📱 다음 단계

새 앱을 성공적으로 생성했다면:
1. **앱별 브랜딩**: `tenants.yaml`에 테넌트별 설정 추가
2. **테마 커스터마이징**: `npm run sync-themes` 실행
3. **기능 개발**: React Native 코드 작성
4. **테스트 배포**: Internal Testing으로 APK 업로드

---

**🎯 이 가이드를 북마크해두고 새 앱 만들 때마다 확인하세요!**