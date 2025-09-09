// YouTube 쇼츠 랭킹 앱 메인 로직
class YouTubeShortsRanking {
    constructor() {
        this.cacheKey = 'youtube_shorts_cache';
        this.videos = [];
        this.init();
    }

    // 앱 초기화
    init() {
        this.bindEvents();
        this.loadVideos();
    }

    // 이벤트 바인딩
    bindEvents() {
        const refreshBtn = document.getElementById('refreshBtn');
        const retryBtn = document.getElementById('retryBtn');

        refreshBtn.addEventListener('click', () => this.refreshVideos());
        retryBtn.addEventListener('click', () => this.loadVideos());
    }

    // 비디오 데이터 로드
    async loadVideos() {
        try {
            this.showLoading();
            this.hideError();

            // 캐시된 데이터 확인
            const cachedData = this.getCachedData();
            if (cachedData) {
                console.log('📦 캐시된 데이터 사용');
                this.videos = cachedData.videos;
                this.displayVideos();
                this.updateLastUpdatedTime(cachedData.timestamp);
                return;
            }

            // API에서 새 데이터 가져오기
            console.log('🌐 API에서 새 데이터 가져오는 중...');
            console.log('🔑 API 키:', CONFIG.API_KEY.substring(0, 10) + '...');
            
            const videos = await this.fetchPopularVideos();
            console.log(`📺 API에서 ${videos.length}개 영상 수신`);
            
            const shortsVideos = this.filterShortsVideos(videos);
            
            this.videos = shortsVideos.slice(0, 10); // 상위 10개만 선택
            console.log(`🎯 최종 선택된 영상: ${this.videos.length}개`);
            
            this.cacheData(this.videos);
            this.displayVideos();
            this.updateLastUpdatedTime(Date.now());

        } catch (error) {
            console.error('❌ 비디오 로드 실패:', error);
            console.error('❌ 에러 상세:', error);
            this.showError(error.message);
        }
    }

    // 인기 비디오 가져오기
    async fetchPopularVideos() {
        const url = this.buildAPIUrl();
        
        console.log('🔗 API 요청 URL:', url);
        
        try {
            const response = await fetch(url);
            console.log('📡 API 응답 상태:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ API 에러 응답:', errorData);
                
                if (response.status === 403) {
                    if (errorData.error?.message?.includes('quota')) {
                        throw new Error('API 할당량이 초과되었습니다. 내일 다시 시도해주세요.');
                    } else {
                        throw new Error('API 키가 유효하지 않습니다. config.js 파일의 API 키를 확인해주세요.');
                    }
                } else if (response.status === 400) {
                    throw new Error(`잘못된 API 요청입니다: ${errorData.error?.message || '알 수 없는 오류'}`);
                } else {
                    throw new Error(`API 요청 실패 (${response.status}): ${errorData.error?.message || response.statusText}`);
                }
            }

            const data = await response.json();
            console.log('📊 API 응답 데이터:', data);

            if (!data.items || data.items.length === 0) {
                throw new Error('인기 비디오를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.');
            }

            return data.items;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('네트워크 연결을 확인해주세요.');
            }
            throw error;
        }
    }

    // API URL 구성
    buildAPIUrl() {
        const params = new URLSearchParams({
            key: CONFIG.API_KEY,
            part: CONFIG.REQUEST_CONFIG.part,
            chart: CONFIG.REQUEST_CONFIG.chart,
            regionCode: CONFIG.REQUEST_CONFIG.regionCode,
            maxResults: CONFIG.REQUEST_CONFIG.maxResults
        });

        return `${CONFIG.API_BASE_URL}/videos?${params}`;
    }

    // 쇼츠 비디오 필터링
    filterShortsVideos(videos) {
        console.log(`🔍 총 ${videos.length}개 영상에서 쇼츠 필터링 시작`);
        
        const filteredVideos = videos.filter(video => {
            const title = video.snippet.title.toLowerCase();
            const description = video.snippet.description.toLowerCase();
            
            // 쇼츠 해시태그 확인
            const hasShortsHashtag = CONFIG.SHORTS_FILTER.hashtags.some(hashtag => 
                title.includes(hashtag.toLowerCase()) || 
                description.includes(hashtag.toLowerCase())
            );

            // 제목에 "쇼츠" 키워드 확인
            const hasShortsKeyword = title.includes('쇼츠') || title.includes('shorts');
            
            // 영상 길이 확인 (가능한 경우)
            const duration = video.contentDetails?.duration;
            const isShortDuration = duration && this.parseDuration(duration) <= CONFIG.SHORTS_FILTER.maxDuration;

            const isShorts = hasShortsHashtag || hasShortsKeyword || isShortDuration;
            
            if (isShorts) {
                console.log(`✅ 쇼츠 영상 발견: ${video.snippet.title}`);
            }
            
            return isShorts;
        });
        
        console.log(`📊 필터링 결과: ${filteredVideos.length}개 쇼츠 영상 발견`);
        
        // 쇼츠 영상이 충분하지 않으면 상위 영상들을 반환
        if (filteredVideos.length < 5) {
            console.log('⚠️ 쇼츠 영상이 부족하여 상위 인기 영상들을 반환합니다.');
            return videos.slice(0, 10);
        }
        
        return filteredVideos;
    }
    
    // YouTube duration 파싱 (PT1M30S -> 90초)
    parseDuration(duration) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return 0;
        
        const hours = parseInt(match[1] || 0);
        const minutes = parseInt(match[2] || 0);
        const seconds = parseInt(match[3] || 0);
        
        return hours * 3600 + minutes * 60 + seconds;
    }

    // 비디오 카드 표시
    displayVideos() {
        const grid = document.getElementById('videosGrid');
        
        if (this.videos.length === 0) {
            grid.innerHTML = `
                <div class="no-videos">
                    <div class="no-videos-icon">📺</div>
                    <h3>쇼츠 영상을 찾을 수 없습니다</h3>
                    <p>다시 시도해주세요.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.videos.map((video, index) => {
            const rank = index + 1;
            const thumbnail = video.snippet.thumbnails.medium || video.snippet.thumbnails.default;
            const viewCount = this.formatViewCount(video.statistics.viewCount);
            const publishedAt = this.formatDate(video.snippet.publishedAt);

            return `
                <div class="video-card" data-rank="${rank}">
                    <div class="rank-badge">${rank}</div>
                    <div class="video-thumbnail">
                        <img src="${thumbnail.url}" alt="${video.snippet.title}" loading="lazy">
                        <div class="play-overlay">
                            <div class="play-button">▶️</div>
                        </div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">${this.escapeHtml(video.snippet.title)}</h3>
                        <p class="channel-name">${this.escapeHtml(video.snippet.channelTitle)}</p>
                        <div class="video-stats">
                            <span class="view-count">👁️ ${viewCount}</span>
                            <span class="publish-date">📅 ${publishedAt}</span>
                        </div>
                    </div>
                    <a href="https://www.youtube.com/watch?v=${video.id}" 
                       target="_blank" 
                       class="video-link"
                       aria-label="YouTube에서 영상 보기">
                    </a>
                </div>
            `;
        }).join('');

        this.hideLoading();
    }

    // 조회수 포맷팅
    formatViewCount(count) {
        const num = parseInt(count);
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    // 날짜 포맷팅
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return '어제';
        } else if (diffDays < 7) {
            return `${diffDays}일 전`;
        } else if (diffDays < 30) {
            return `${Math.ceil(diffDays / 7)}주 전`;
        } else {
            return date.toLocaleDateString('ko-KR');
        }
    }

    // HTML 이스케이프
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 로딩 상태 표시
    showLoading() {
        document.getElementById('loading').style.display = 'flex';
        document.getElementById('videosGrid').style.display = 'none';
    }

    // 로딩 상태 숨기기
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('videosGrid').style.display = 'grid';
    }

    // 에러 표시
    showError(message) {
        const errorDiv = document.getElementById('error');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = message;
        errorDiv.style.display = 'flex';
        
        this.hideLoading();
    }

    // 에러 숨기기
    hideError() {
        document.getElementById('error').style.display = 'none';
    }

    // 마지막 업데이트 시간 표시
    updateLastUpdatedTime(timestamp) {
        const lastUpdated = document.getElementById('lastUpdated');
        const date = new Date(timestamp);
        const timeString = date.toLocaleString('ko-KR');
        lastUpdated.textContent = `마지막 업데이트: ${timeString}`;
    }

    // 데이터 새로고침
    async refreshVideos() {
        this.clearCache();
        await this.loadVideos();
    }

    // 캐시 데이터 가져오기
    getCachedData() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;

            const data = JSON.parse(cached);
            const now = Date.now();

            // 캐시 만료 확인
            if (now - data.timestamp > CONFIG.CACHE_DURATION) {
                console.log('⏰ 캐시 만료됨');
                this.clearCache();
                return null;
            }

            return data;
        } catch (error) {
            console.error('캐시 읽기 실패:', error);
            return null;
        }
    }

    // 데이터 캐시하기
    cacheData(videos) {
        try {
            const data = {
                videos: videos,
                timestamp: Date.now()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(data));
            console.log('💾 데이터 캐시됨');
        } catch (error) {
            console.error('캐시 저장 실패:', error);
        }
    }

    // 캐시 삭제
    clearCache() {
        localStorage.removeItem(this.cacheKey);
        console.log('🗑️ 캐시 삭제됨');
    }
}

// 앱 시작
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 YouTube 쇼츠 랭킹 앱 시작');
    
    // API 키 확인
    if (!CONFIG.API_KEY || CONFIG.API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
        console.error('❌ API 키가 설정되지 않음');
        const errorDiv = document.getElementById('error');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.innerHTML = `
            API 키가 설정되지 않았습니다.<br>
            config.js 파일에서 YOUR_YOUTUBE_API_KEY_HERE를 실제 YouTube API 키로 교체하세요.
        `;
        errorDiv.style.display = 'flex';
        return;
    }

    // API 키 형식 확인
    if (!CONFIG.API_KEY.startsWith('AIza')) {
        console.warn('⚠️ API 키 형식이 올바르지 않을 수 있습니다.');
    }

    console.log('✅ API 키 확인 완료');
    
    // 앱 초기화
    try {
        new YouTubeShortsRanking();
    } catch (error) {
        console.error('❌ 앱 초기화 실패:', error);
        const errorDiv = document.getElementById('error');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = `앱 초기화 중 오류가 발생했습니다: ${error.message}`;
        errorDiv.style.display = 'flex';
    }
});

// 개발자 도구용 전역 함수
window.clearCache = () => {
    localStorage.removeItem('youtube_shorts_cache');
    console.log('🗑️ 캐시가 삭제되었습니다.');
    location.reload(); // 페이지 새로고침
};

window.getCacheInfo = () => {
    const cached = localStorage.getItem('youtube_shorts_cache');
    if (cached) {
        const data = JSON.parse(cached);
        console.log('📦 캐시 정보:', {
            timestamp: new Date(data.timestamp),
            videoCount: data.videos.length,
            age: Math.round((Date.now() - data.timestamp) / 1000 / 60) + '분 전'
        });
    } else {
        console.log('📦 캐시된 데이터가 없습니다.');
    }
};

window.forceRefresh = () => {
    console.log('🔄 강제 새로고침 시작');
    window.clearCache();
};
