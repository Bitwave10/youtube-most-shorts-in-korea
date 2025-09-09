# 🔥 한국 인기 YouTube 쇼츠 TOP 10

YouTube Data API v3를 활용하여 한국 지역 기준으로 오늘 하루 동안 가장 인기 있는 쇼츠 영상 10개를 실시간으로 조회하고 표시하는 웹앱입니다.

## ✨ 주요 기능

- 🎯 **실시간 인기 쇼츠 랭킹**: YouTube Data API v3를 통한 실시간 데이터 조회
- 📱 **반응형 디자인**: 모바일과 데스크톱 모두에서 최적화된 사용자 경험
- 🎨 **YouTube 브랜드 컬러**: 세련된 UI/UX 디자인
- ⚡ **캐싱 시스템**: 1시간 단위 LocalStorage 캐싱으로 API 호출 최소화
- 🔄 **자동 새로고침**: 수동 새로고침 버튼으로 최신 데이터 갱신
- 🛡️ **완전한 에러 핸들링**: API 할당량 초과, 네트워크 오류 등 모든 상황 대응

## 🚀 시작하기

### 1. YouTube Data API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **라이브러리**에서 "YouTube Data API v3" 검색 후 활성화
4. **API 및 서비스** > **사용자 인증 정보**에서 **사용자 인증 정보 만들기** > **API 키** 선택
5. 생성된 API 키를 복사

### 2. API 키 설정

`config.js` 파일을 열고 다음 부분을 수정하세요:

```javascript
// 이 부분을 실제 API 키로 교체
API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
```

예시:
```javascript
API_KEY: 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
```

### 3. 로컬 실행

1. 모든 파일을 웹 서버에 업로드하거나 로컬 서버 실행
2. `index.html` 파일을 브라우저에서 열기

```bash
# Python을 사용한 간단한 로컬 서버
python -m http.server 8000

# Node.js를 사용한 간단한 로컬 서버
npx serve .
```

## 📁 프로젝트 구조

```
youtube-shorts-ranking/
├── index.html          # 메인 HTML 파일
├── style.css           # CSS 스타일시트
├── script.js           # JavaScript 로직
├── config.js           # API 설정 파일
└── README.md           # 프로젝트 문서
```

## 🛠️ 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, CSS 변수, 반응형 디자인
- **JavaScript ES6+**: async/await, 클래스, 모듈화
- **YouTube Data API v3**: REST API 연동
- **LocalStorage**: 클라이언트 사이드 캐싱

## 🎯 학습 포인트

이 프로젝트를 통해 다음 웹 개발 기술들을 실습할 수 있습니다:

### 1. REST API 연동
- YouTube Data API v3 사용법
- fetch API를 통한 비동기 데이터 요청
- API 응답 데이터 파싱 및 처리

### 2. DOM 조작
- 동적 HTML 요소 생성
- 이벤트 리스너 등록 및 처리
- 조건부 렌더링

### 3. 반응형 웹 디자인
- CSS Grid와 Flexbox 활용
- 미디어 쿼리를 통한 반응형 레이아웃
- 모바일 퍼스트 디자인

### 4. 성능 최적화
- LocalStorage를 활용한 캐싱
- 이미지 지연 로딩 (lazy loading)
- API 호출 최적화

### 5. 에러 핸들링
- try-catch를 통한 예외 처리
- 사용자 친화적 에러 메시지
- 네트워크 오류 대응

## 🔧 API 설정 상세

### YouTube Data API v3 파라미터

```javascript
{
    regionCode: 'KR',           // 한국 지역
    chart: 'mostPopular',       // 인기 차트
    maxResults: 50,             // 최대 50개 결과
    part: 'snippet,statistics', // 필요한 데이터 부분
    videoCategoryId: '10',      // 음악 카테고리
    order: 'viewCount'          // 조회수 순
}
```

### 쇼츠 필터링 조건

- 제목 또는 설명에 `#shorts`, `#Shorts`, `#SHORTS` 해시태그 포함
- 제목에 "쇼츠" 또는 "shorts" 키워드 포함
- 60초 이하 영상 (API 제한으로 정확한 필터링은 어려움)

## 🚀 배포 가이드

### GitHub Pages 배포

1. GitHub 저장소 생성
2. 프로젝트 파일 업로드
3. **Settings** > **Pages**에서 소스 선택
4. 브랜치 선택 후 저장

### 환경변수 설정 (고급)

배포 시 API 키 보안을 위해 환경변수를 사용할 수 있습니다:

```javascript
// config.js에서 환경변수 확인
if (typeof process !== 'undefined' && process.env && process.env.YOUTUBE_API_KEY) {
    CONFIG.API_KEY = process.env.YOUTUBE_API_KEY;
}
```

## 🐛 디버깅

개발자 도구 콘솔에서 다음 함수들을 사용할 수 있습니다:

```javascript
// 캐시 정보 확인
getCacheInfo()

// 캐시 삭제
clearCache()
```

## 📊 API 할당량 관리

YouTube Data API v3는 일일 할당량이 있습니다:
- 기본 할당량: 10,000 units/day
- videos.list 요청: 1 unit
- 할당량 초과 시 403 에러 발생

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- [YouTube Data API v3](https://developers.google.com/youtube/v3) - 데이터 제공
- [Google Fonts](https://fonts.google.com/) - Noto Sans KR 폰트
- [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/) - 레이아웃 시스템

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**바이브코딩과 함께하는 웹 개발 학습! 🚀**
