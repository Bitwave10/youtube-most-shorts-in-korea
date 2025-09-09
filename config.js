/**
 * 애플리케이션 설정 파일
 * 실제 배포 시에는 환경변수나 서버 설정을 사용하세요.
 */

// YouTube Data API v3 설정
const CONFIG = {
    // YouTube API 키 (여기에 본인의 API 키를 입력하세요)
    YOUTUBE_API_KEY: 'AIzaSyDoGm3lkRGNTCpBe0k1nVdzCigD6Bj-1uI',
    
    // API 설정
    API: {
        BASE_URL: 'https://www.googleapis.com/youtube/v3',
        MAX_RESULTS: 10,
        CACHE_TTL: 30, // 분 단위
        REQUEST_TIMEOUT: 10000 // 밀리초
    },
    
    // 검색 파라미터
    SEARCH_PARAMS: {
        PART: 'snippet,statistics',
        TYPE: 'video',
        VIDEO_DURATION: 'short',
        REGION_CODE: 'KR',
        ORDER: 'viewCount',
        Q: 'shorts' // 검색어
    },
    
    // UI 설정
    UI: {
        ANIMATION_DELAY: 100, // 밀리초
        GRID_COLUMNS: {
            MOBILE: 1,
            TABLET: 2,
            DESKTOP: 3
        },
        BREAKPOINTS: {
            MOBILE: 480,
            TABLET: 768,
            DESKTOP: 1024
        }
    },
    
    // 캐시 설정
    CACHE: {
        KEYS: {
            SHORTS_DATA: 'korean_shorts_cache',
            LAST_UPDATE: 'last_update_time',
            API_QUOTA: 'api_quota_usage'
        },
        TTL: {
            SHORTS_DATA: 30, // 분
            API_QUOTA: 24 * 60 // 24시간
        }
    },
    
    // 에러 메시지
    ERROR_MESSAGES: {
        NO_API_KEY: 'YouTube API 키가 설정되지 않았습니다.',
        API_QUOTA_EXCEEDED: 'API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.',
        NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
        NO_DATA: '오늘의 인기 쇼츠를 찾을 수 없습니다.',
        UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.'
    }
};

// 설정 유효성 검사
function validateConfig() {
    if (!CONFIG.YOUTUBE_API_KEY || CONFIG.YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
        console.error('YouTube API 키가 설정되지 않았습니다.');
        return false;
    }
    return true;
}

// 설정 가져오기
function getConfig() {
    return CONFIG;
}

// API 키 가져오기
function getAPIKey() {
    return CONFIG.YOUTUBE_API_KEY;
}

// 전역 설정 객체
window.CONFIG = CONFIG;
window.validateConfig = validateConfig;
window.getConfig = getConfig;
window.getAPIKey = getAPIKey;
