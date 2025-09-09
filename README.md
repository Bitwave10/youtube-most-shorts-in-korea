# 한국 인기 쇼츠 추천기 (Korean Popular Shorts Finder)

YouTube Data API v3를 활용해 오늘 하루 동안 한국에서 가장 많이 시청된 Shorts 영상 10개를 자동 추천하는 웹앱입니다.

## 🚀 주요 기능

- **실시간 인기 쇼츠 추천**: 오늘 한국에서 가장 많이 시청된 Shorts 영상 10개 자동 추천
- **반응형 디자인**: 모바일 퍼스트 접근법으로 모든 디바이스에서 최적화된 경험
- **캐싱 시스템**: localStorage를 활용한 효율적인 데이터 캐싱 (30분 TTL)
- **인라인 플레이어**: 쇼츠 카드 클릭 시 모달에서 바로 재생
- **현대적 UI/UX**: 세련된 카드 그리드 레이아웃과 부드러운 애니메이션
- **에러 처리**: 사용자 친화적인 에러 메시지와 재시도 기능

## 🛠 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: YouTube Data API v3
- **스타일링**: CSS Grid, Flexbox, CSS Variables
- **캐싱**: localStorage
- **폰트**: Noto Sans KR (Google Fonts)

## 📁 프로젝트 구조

```
claude/
├── index.html          # 메인 HTML 파일
├── css/
│   └── style.css       # 스타일시트
├── js/
│   ├── utils.js        # 유틸리티 함수들
│   ├── api.js          # YouTube API 연동
│   ├── ui.js           # UI 컴포넌트 관리
│   └── app.js          # 메인 애플리케이션 로직
├── config.js           # 설정 파일
└── README.md           # 프로젝트 문서
```

## 🚀 시작하기

### 1. YouTube API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. YouTube Data API v3 활성화
4. API 키 생성 및 제한 설정

### 2. API 키 설정

`config.js` 파일에서 API 키를 설정하세요:

```javascript
const CONFIG = {
    YOUTUBE_API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
    // ... 기타 설정
};
```

### 3. 로컬 서버 실행

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server 설치 필요)
npx http-server

# Live Server (VS Code 확장)
# index.html 우클릭 → "Open with Live Server"
```

### 4. 브라우저에서 접속

```
http://localhost:8000
```

## 🔧 설정 옵션

### API 설정
- `MAX_RESULTS`: 검색 결과 수 (기본값: 10)
- `CACHE_TTL`: 캐시 유지 시간 (분, 기본값: 30)
- `REQUEST_TIMEOUT`: API 요청 타임아웃 (밀리초, 기본값: 10000)

### UI 설정
- `ANIMATION_DELAY`: 카드 애니메이션 지연 시간
- `GRID_COLUMNS`: 반응형 그리드 컬럼 수
- `BREAKPOINTS`: 반응형 브레이크포인트

## 📱 반응형 디자인

- **모바일** (< 480px): 1열 그리드
- **태블릿** (480px - 768px): 2열 그리드  
- **데스크톱** (> 768px): 3열 그리드

## 🎨 주요 UI 컴포넌트

### 쇼츠 카드
- 썸네일 이미지
- 제목 (2줄 말줄임)
- 채널명
- 조회수 (한국어 형식)
- 재생 오버레이

### 모달 플레이어
- YouTube 임베드 플레이어
- 자동 재생
- 반응형 비율 (16:9)
- ESC 키 또는 배경 클릭으로 닫기

## 🔄 캐싱 전략

- **데이터 캐싱**: 30분 TTL로 API 호출 최소화
- **캐시 키**: `korean_shorts_cache`
- **캐시 무효화**: 새로고침 버튼 클릭 시 자동 클리어

## 🚨 에러 처리

- API 할당량 초과
- 네트워크 연결 오류
- 잘못된 API 키
- 데이터 없음
- 기타 예외 상황

## 🔒 보안 고려사항

- API 키는 클라이언트에 노출되므로 CORS 정책 설정 필요
- 프로덕션 환경에서는 서버 사이드에서 API 호출 권장
- API 키 제한 설정 (HTTP 리퍼러, IP 주소 등)

## 📊 API 할당량

- **Search 요청**: 100 할당량/요청
- **일일 한도**: 10,000 할당량
- **권장 사용량**: 시간당 100회 이하

## 🛠 개발 도구

- **브라우저 개발자 도구**: 콘솔에서 API 응답 확인
- **Network 탭**: API 호출 모니터링
- **Application 탭**: localStorage 캐시 확인

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**주의**: 이 프로젝트는 교육 및 데모 목적으로 제작되었습니다. 상업적 사용 시 YouTube API 이용약관을 확인하시기 바랍니다.
