/**
 * 유틸리티 함수들
 */

// 날짜 관련 유틸리티
const DateUtils = {
    /**
     * 오늘 날짜를 ISO 8601 형식으로 반환 (YouTube API용)
     * @returns {string} YYYY-MM-DDTHH:MM:SSZ 형식의 날짜
     */
    getTodayISO: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today.toISOString();
    },

    /**
     * 날짜를 한국어 형식으로 포맷팅
     * @param {string|Date} date - 포맷팅할 날짜
     * @returns {string} YYYY년 MM월 DD일 HH:MM 형식
     */
    formatKorean: (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
    },

    /**
     * 상대적 시간 표시 (예: "2시간 전")
     * @param {string|Date} date - 기준 날짜
     * @returns {string} 상대적 시간 문자열
     */
    getRelativeTime: (date) => {
        const now = new Date();
        const target = new Date(date);
        const diffMs = now - target;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return '방금 전';
        if (diffMinutes < 60) return `${diffMinutes}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;
        
        return DateUtils.formatKorean(date);
    }
};

// 숫자 관련 유틸리티
const NumberUtils = {
    /**
     * 조회수를 한국어 형식으로 포맷팅
     * @param {number|string} views - 조회수
     * @returns {string} 포맷팅된 조회수 (예: "1.2만회")
     */
    formatViews: (views) => {
        const num = parseInt(views);
        if (isNaN(num)) return '0회';

        if (num >= 100000000) {
            return `${(num / 100000000).toFixed(1)}억회`;
        } else if (num >= 10000) {
            return `${(num / 10000).toFixed(1)}만회`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}천회`;
        } else {
            return `${num.toLocaleString()}회`;
        }
    },

    /**
     * 숫자를 천 단위로 콤마 구분
     * @param {number|string} num - 숫자
     * @returns {string} 콤마가 추가된 숫자 문자열
     */
    addCommas: (num) => {
        return parseInt(num).toLocaleString();
    }
};

// 문자열 관련 유틸리티
const StringUtils = {
    /**
     * 문자열을 지정된 길이로 자르고 말줄임표 추가
     * @param {string} str - 자를 문자열
     * @param {number} maxLength - 최대 길이
     * @returns {string} 잘린 문자열
     */
    truncate: (str, maxLength = 50) => {
        if (!str) return '';
        if (str.length <= maxLength) return str;
        return str.substring(0, maxLength) + '...';
    },

    /**
     * HTML 특수문자 이스케이프
     * @param {string} str - 이스케이프할 문자열
     * @returns {string} 이스케이프된 문자열
     */
    escapeHtml: (str) => {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// 로컬 스토리지 관련 유틸리티
const StorageUtils = {
    /**
     * 로컬 스토리지에 데이터 저장
     * @param {string} key - 키
     * @param {any} data - 저장할 데이터
     * @param {number} ttl - TTL (Time To Live) in minutes
     */
    set: (key, data, ttl = 60) => {
        const item = {
            data: data,
            timestamp: Date.now(),
            ttl: ttl * 60 * 1000 // TTL을 밀리초로 변환
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    /**
     * 로컬 스토리지에서 데이터 가져오기
     * @param {string} key - 키
     * @returns {any|null} 저장된 데이터 또는 null
     */
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const parsed = JSON.parse(item);
            const now = Date.now();

            // TTL 체크
            if (now - parsed.timestamp > parsed.ttl) {
                localStorage.removeItem(key);
                return null;
            }

            return parsed.data;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },

    /**
     * 로컬 스토리지에서 데이터 삭제
     * @param {string} key - 키
     */
    remove: (key) => {
        localStorage.removeItem(key);
    },

    /**
     * 로컬 스토리지 클리어
     */
    clear: () => {
        localStorage.clear();
    }
};

// DOM 관련 유틸리티
const DOMUtils = {
    /**
     * 요소를 안전하게 선택
     * @param {string} selector - CSS 선택자
     * @returns {Element|null} 선택된 요소 또는 null
     */
    select: (selector) => {
        return document.querySelector(selector);
    },

    /**
     * 여러 요소를 안전하게 선택
     * @param {string} selector - CSS 선택자
     * @returns {NodeList} 선택된 요소들
     */
    selectAll: (selector) => {
        return document.querySelectorAll(selector);
    },

    /**
     * 요소에 클래스 추가
     * @param {Element} element - 대상 요소
     * @param {string} className - 추가할 클래스명
     */
    addClass: (element, className) => {
        if (element) element.classList.add(className);
    },

    /**
     * 요소에서 클래스 제거
     * @param {Element} element - 대상 요소
     * @param {string} className - 제거할 클래스명
     */
    removeClass: (element, className) => {
        if (element) element.classList.remove(className);
    },

    /**
     * 요소 표시/숨김
     * @param {Element} element - 대상 요소
     * @param {boolean} show - 표시 여부
     */
    toggle: (element, show) => {
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    }
};

// 에러 처리 유틸리티
const ErrorUtils = {
    /**
     * 에러 메시지를 사용자 친화적으로 변환
     * @param {Error} error - 에러 객체
     * @returns {string} 사용자 친화적 에러 메시지
     */
    getUserFriendlyMessage: (error) => {
        if (error.message.includes('quota')) {
            return 'API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('network')) {
            return '네트워크 연결을 확인해주세요.';
        } else if (error.message.includes('403')) {
            return 'API 키가 유효하지 않습니다.';
        } else if (error.message.includes('404')) {
            return '요청한 데이터를 찾을 수 없습니다.';
        } else {
            return '알 수 없는 오류가 발생했습니다.';
        }
    }
};

// 디바운스 함수
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// 스로틀 함수
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// 전역 유틸리티 객체
window.Utils = {
    DateUtils,
    NumberUtils,
    StringUtils,
    StorageUtils,
    DOMUtils,
    ErrorUtils,
    debounce,
    throttle
};
