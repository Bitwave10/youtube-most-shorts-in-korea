// YouTube Data API v3 설정
const CONFIG = {
    // API 키 설정 (실제 사용 시 환경변수로 관리하세요)
    API_KEY: 'AIzaSyDoGm3lkRGNTCpBe0k1nVdzCigD6Bj-1uI',
    
    // API 엔드포인트
    API_BASE_URL: 'https://www.googleapis.com/youtube/v3',
    
    // 캐시 설정 (밀리초)
    CACHE_DURATION: 60 * 60 * 1000, // 1시간
    
    // API 요청 설정
    REQUEST_CONFIG: {
        regionCode: 'KR',           // 한국 지역
        chart: 'mostPopular',       // 인기 차트
        maxResults: 50,             // 최대 50개 결과 (필터링 후 10개 선택)
        part: 'snippet,statistics,contentDetails', // 필요한 데이터 부분
        order: 'viewCount'          // 조회수 순
    },
    
    // 쇼츠 필터링 조건
    SHORTS_FILTER: {
        maxDuration: 60,            // 60초 이하
        hashtags: ['#shorts', '#Shorts', '#SHORTS'] // 쇼츠 해시태그
    }
};

// 환경변수에서 API 키 가져오기 (배포 시 사용)
if (typeof process !== 'undefined' && process.env && process.env.YOUTUBE_API_KEY) {
    CONFIG.API_KEY = process.env.YOUTUBE_API_KEY;
}

// API 키 설정 확인
if (CONFIG.API_KEY && CONFIG.API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE') {
    console.log('✅ YouTube API 키가 설정되었습니다.');
} else {
    console.warn('⚠️ API 키가 설정되지 않았습니다. config.js 파일에서 YOUR_YOUTUBE_API_KEY_HERE를 실제 API 키로 교체하세요.');
}
