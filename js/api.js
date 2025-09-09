/**
 * YouTube Data API v3 연동 모듈
 */

class YouTubeAPI {
    constructor() {
        // API 키는 환경변수나 설정에서 가져와야 함
        this.apiKey = this.getAPIKey();
        this.baseURL = 'https://www.googleapis.com/youtube/v3';
        this.cacheKey = 'korean_shorts_cache';
        this.cacheTTL = 30; // 30분 캐시
    }

    /**
     * API 키 가져오기 (환경변수 또는 설정에서)
     * @returns {string} YouTube API 키
     */
    getAPIKey() {
        // config.js에서 API 키 가져오기
        if (window.getAPIKey) {
            return window.getAPIKey();
        }
        
        console.warn('YouTube API 키가 설정되지 않았습니다. config.js 파일을 확인해주세요.');
        return null;
    }

    /**
     * 한국 인기 쇼츠 검색
     * @returns {Promise<Array>} 쇼츠 데이터 배열
     */
    async getKoreanPopularShorts() {
        try {
            // 캐시된 데이터 확인
            const cachedData = Utils.StorageUtils.get(this.cacheKey);
            if (cachedData) {
                console.log('캐시된 데이터 사용');
                return cachedData;
            }

            // API 키가 없거나 기본값이면 샘플 데이터 사용
            if (!this.apiKey || this.apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
                console.log('API 키가 설정되지 않음, 샘플 데이터 사용');
                const sampleData = this.getSampleData();
                Utils.StorageUtils.set(this.cacheKey, sampleData, this.cacheTTL);
                return sampleData;
            }

            console.log('API 키 확인됨, 실시간 데이터 로딩 시도');

            // 간단한 검색 시도
            try {
                const shorts = await this.searchShorts('shorts');
                
                if (shorts && shorts.length > 0) {
                    console.log(`실시간 데이터 로드 성공: ${shorts.length}개`);
                    Utils.StorageUtils.set(this.cacheKey, shorts, this.cacheTTL);
                    return shorts;
                }
            } catch (error) {
                console.warn('실시간 데이터 로드 실패:', error.message);
            }

            // 실시간 데이터 실패 시 샘플 데이터 사용
            console.log('실시간 데이터 로드 실패, 샘플 데이터 사용');
            const sampleData = this.getSampleData();
            Utils.StorageUtils.set(this.cacheKey, sampleData, this.cacheTTL);
            return sampleData;

        } catch (error) {
            console.error('YouTube API 오류:', error);
            // 최후의 수단으로 샘플 데이터 반환
            return this.getSampleData();
        }
    }

    /**
     * 한국 인기 쇼츠 검색
     * @returns {Promise<Array>} 쇼츠 데이터 배열
     */
    async getKoreanPopularShorts() {
        try {
            // 캐시된 데이터 확인
            const cachedData = Utils.StorageUtils.get(this.cacheKey);
            if (cachedData) {
                console.log('캐시된 데이터 사용');
                return cachedData;
            }

            // API 키가 없거나 기본값이면 샘플 데이터 사용
            if (!this.apiKey || this.apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
                console.log('API 키가 설정되지 않음, 샘플 데이터 사용');
                const sampleData = this.getSampleData();
                Utils.StorageUtils.set(this.cacheKey, sampleData, this.cacheTTL);
                return sampleData;
            }

            console.log('API 키 확인됨, 실시간 데이터 로딩 시도');

            // 간단한 검색 시도
            try {
                const shorts = await this.searchShorts('shorts');
                
                if (shorts && shorts.length > 0) {
                    console.log(`실시간 데이터 로드 성공: ${shorts.length}개`);
                    Utils.StorageUtils.set(this.cacheKey, shorts, this.cacheTTL);
                    return shorts;
                }
            } catch (error) {
                console.warn('실시간 데이터 로드 실패:', error.message);
            }

            // 실시간 데이터 실패 시 샘플 데이터 사용
            console.log('실시간 데이터 로드 실패, 샘플 데이터 사용');
            const sampleData = this.getSampleData();
            Utils.StorageUtils.set(this.cacheKey, sampleData, this.cacheTTL);
            return sampleData;

        } catch (error) {
            console.error('YouTube API 오류:', error);
            // 최후의 수단으로 샘플 데이터 반환
            return this.getSampleData();
        }
    }

    /**
     * 특정 검색어로 쇼츠 검색
     * @param {string} searchTerm - 검색어
     * @returns {Promise<Array>} 쇼츠 데이터 배열
     */
    async searchShorts(searchTerm) {
        // 최근 3일간의 데이터로 검색 (더 많은 결과를 위해)
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const threeDaysAgoISO = threeDaysAgo.toISOString();

        const searchParams = {
            part: 'snippet,statistics',
            q: searchTerm,
            type: 'video',
            videoDuration: 'short',
            regionCode: 'KR',
            order: 'viewCount',
            publishedAfter: threeDaysAgoISO,
            maxResults: 10,
            key: this.apiKey
        };

        const url = `${this.baseURL}/search?${this.buildQueryString(searchParams)}`;
        console.log('API 요청:', url);
        console.log('검색어:', searchTerm);
        console.log('API 키:', this.apiKey ? this.apiKey.substring(0, 10) + '...' : '없음');

        try {
            const response = await fetch(url);
            console.log('응답 상태:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API 오류 응답:', errorData);
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('API 응답 데이터:', data);
            
            if (data.error) {
                console.error('API 오류:', data.error);
                throw new Error(data.error.message || 'API 오류가 발생했습니다.');
            }

            const processedData = this.processShortsData(data.items || []);
            console.log(`검색어 "${searchTerm}" 결과:`, processedData.length, '개');
            return processedData;

        } catch (error) {
            console.error(`검색어 "${searchTerm}" 오류:`, error);
            throw error;
        }
    }

    /**
     * 중복 쇼츠 제거
     * @param {Array} shorts - 쇼츠 배열
     * @returns {Array} 중복 제거된 쇼츠 배열
     */
    removeDuplicates(shorts) {
        const seen = new Set();
        return shorts.filter(short => {
            if (seen.has(short.id)) {
                return false;
            }
            seen.add(short.id);
            return true;
        });
    }

    /**
     * 대체 검색 (더 넓은 범위)
     * @returns {Promise<Array>} 쇼츠 데이터 배열
     */
    async fallbackSearch() {
        try {
            console.log('대체 검색 시작...');
            
            // 최근 7일간의 데이터로 검색
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const weekAgoISO = weekAgo.toISOString();

            const searchParams = {
                part: 'snippet,statistics',
                q: 'shorts',
                type: 'video',
                videoDuration: 'short',
                regionCode: 'KR',
                order: 'viewCount',
                publishedAfter: weekAgoISO,
                maxResults: 20,
                key: this.apiKey
            };

            const url = `${this.baseURL}/search?${this.buildQueryString(searchParams)}`;
            console.log('대체 검색 API 요청:', url);

            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message || 'API 오류가 발생했습니다.');
            }

            const shorts = this.processShortsData(data.items || []);
            console.log(`대체 검색으로 ${shorts.length}개의 쇼츠를 찾았습니다.`);
            
            return shorts;

        } catch (error) {
            console.error('대체 검색 오류:', error);
            return [];
        }
    }

    /**
     * 최소한의 검색 (가장 기본적인 파라미터)
     * @returns {Promise<Array>} 쇼츠 데이터 배열
     */
    async minimalSearch() {
        try {
            console.log('최소한의 검색 시작...');
            
            const searchParams = {
                part: 'snippet',
                q: 'shorts',
                type: 'video',
                maxResults: 10,
                key: this.apiKey
            };

            const url = `${this.baseURL}/search?${this.buildQueryString(searchParams)}`;
            console.log('최소 검색 API 요청:', url);

            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message || 'API 오류가 발생했습니다.');
            }

            const shorts = this.processShortsData(data.items || []);
            console.log(`최소 검색으로 ${shorts.length}개의 쇼츠를 찾았습니다.`);
            
            return shorts;

        } catch (error) {
            console.error('최소 검색 오류:', error);
            return [];
        }
    }

    /**
     * 더미 데이터 생성 (API 실패 시)
     * @returns {Array} 더미 쇼츠 데이터
     */
    getDummyData() {
        console.log('더미 데이터 사용');
        return [
            {
                id: 'dummy1',
                title: 'API 연결 실패 - 더미 데이터',
                channelTitle: '시스템',
                description: 'YouTube API 연결에 실패했습니다.',
                thumbnail: 'https://via.placeholder.com/320x180?text=API+Error',
                publishedAt: new Date().toISOString(),
                viewCount: 0,
                duration: 'Shorts',
                url: '#',
                embedUrl: '#',
                channelUrl: '#'
            },
            {
                id: 'dummy2',
                title: 'API 키를 확인해주세요',
                channelTitle: '시스템',
                description: 'YouTube Data API v3가 활성화되었는지 확인해주세요.',
                thumbnail: 'https://via.placeholder.com/320x180?text=Check+API+Key',
                publishedAt: new Date().toISOString(),
                viewCount: 0,
                duration: 'Shorts',
                url: '#',
                embedUrl: '#',
                channelUrl: '#'
            }
        ];
    }

    /**
     * 쇼츠 데이터 처리 및 정리
     * @param {Array} items - API 응답 아이템들
     * @returns {Array} 처리된 쇼츠 데이터
     */
    processShortsData(items) {
        return items.map(item => {
            const snippet = item.snippet || {};
            const statistics = item.statistics || {};
            
            // 제목에서 #Shorts 태그 제거
            let title = snippet.title || '제목 없음';
            title = title.replace(/#Shorts/gi, '').replace(/#shorts/gi, '').trim();
            
            return {
                id: item.id.videoId,
                title: title,
                channelTitle: snippet.channelTitle || '채널명 없음',
                description: snippet.description || '',
                thumbnail: this.getBestThumbnail(snippet.thumbnails || {}),
                publishedAt: snippet.publishedAt || new Date().toISOString(),
                viewCount: parseInt(statistics.viewCount) || 0,
                duration: 'Shorts',
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                embedUrl: `https://www.youtube.com/embed/${item.id.videoId}?autoplay=1&rel=0`,
                channelUrl: `https://www.youtube.com/channel/${snippet.channelId}`
            };
        }).filter(item => {
            // 유효한 데이터만 필터링
            return item.id && item.title !== '제목 없음';
        });
    }

    /**
     * 최적의 썸네일 URL 선택
     * @param {Object} thumbnails - 썸네일 객체
     * @returns {string} 썸네일 URL
     */
    getBestThumbnail(thumbnails) {
        // 우선순위: maxres > high > medium > default
        const priority = ['maxres', 'high', 'medium', 'default'];
        
        for (const quality of priority) {
            if (thumbnails[quality] && thumbnails[quality].url) {
                return thumbnails[quality].url;
            }
        }
        
        return 'https://via.placeholder.com/320x180?text=No+Thumbnail';
    }

    /**
     * 비디오 길이 정보 가져오기 (추가 API 호출 필요)
     * @param {Object} item - 비디오 아이템
     * @returns {string} 비디오 길이
     */
    getVideoDuration(item) {
        // YouTube API v3에서는 search 결과에 duration이 포함되지 않음
        // contentDetails.part를 추가로 요청해야 함
        return 'Shorts';
    }

    /**
     * 쿼리 스트링 빌드
     * @param {Object} params - 파라미터 객체
     * @returns {string} 쿼리 스트링
     */
    buildQueryString(params) {
        return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }

    /**
     * 비디오 상세 정보 가져오기 (선택사항)
     * @param {string} videoId - 비디오 ID
     * @returns {Promise<Object>} 비디오 상세 정보
     */
    async getVideoDetails(videoId) {
        try {
            if (!this.apiKey) {
                throw new Error('API 키가 설정되지 않았습니다.');
            }

            const params = {
                part: 'snippet,statistics,contentDetails',
                id: videoId,
                key: this.apiKey
            };

            const url = `${this.baseURL}/videos?${this.buildQueryString(params)}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.items?.[0] || null;

        } catch (error) {
            console.error('비디오 상세 정보 가져오기 오류:', error);
            throw error;
        }
    }

    /**
     * 채널 정보 가져오기 (선택사항)
     * @param {string} channelId - 채널 ID
     * @returns {Promise<Object>} 채널 정보
     */
    async getChannelInfo(channelId) {
        try {
            if (!this.apiKey) {
                throw new Error('API 키가 설정되지 않았습니다.');
            }

            const params = {
                part: 'snippet,statistics',
                id: channelId,
                key: this.apiKey
            };

            const url = `${this.baseURL}/channels?${this.buildQueryString(params)}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.items?.[0] || null;

        } catch (error) {
            console.error('채널 정보 가져오기 오류:', error);
            throw error;
        }
    }

    /**
     * 캐시 클리어
     */
    clearCache() {
        Utils.StorageUtils.remove(this.cacheKey);
        console.log('캐시가 클리어되었습니다.');
    }

    /**
     * API 키 테스트
     * @returns {Promise<boolean>} API 키 유효성
     */
    async testAPIKey() {
        try {
            if (!this.apiKey) {
                throw new Error('API 키가 설정되지 않았습니다.');
            }

            console.log('API 키 테스트 시작...');
            const testUrl = `${this.baseURL}/search?part=snippet&q=test&type=video&maxResults=1&key=${this.apiKey}`;
            console.log('테스트 URL:', testUrl);

            const response = await fetch(testUrl);
            console.log('테스트 응답 상태:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API 키 테스트 실패:', errorData);
                return false;
            }

            const data = await response.json();
            console.log('API 키 테스트 성공:', data);
            return true;

        } catch (error) {
            console.error('API 키 테스트 오류:', error);
            return false;
        }
    }

    /**
     * 샘플 데이터 가져오기 (API 실패 시)
     * @returns {Array} 샘플 쇼츠 데이터
     */
    getSampleData() {
        console.log('샘플 데이터 사용');
        return [
            {
                id: 'dQw4w9WgXcQ',
                title: 'Never Gonna Give You Up - Shorts Version',
                channelTitle: 'Rick Astley',
                description: 'The classic Rick Roll in shorts format!',
                thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                publishedAt: new Date().toISOString(),
                viewCount: 1500000000,
                duration: 'Shorts',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0',
                channelUrl: 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw'
            },
            {
                id: 'jNQXAC9IVRw',
                title: 'Me at the zoo - Shorts',
                channelTitle: 'jawed',
                description: 'The very first YouTube video in shorts format!',
                thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
                publishedAt: new Date(Date.now() - 86400000).toISOString(),
                viewCount: 250000000,
                duration: 'Shorts',
                url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
                embedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw?autoplay=1&rel=0',
                channelUrl: 'https://www.youtube.com/channel/UC4QobU6STFB0P71PMvIKNQw'
            },
            {
                id: 'kJQP7kiw5Fk',
                title: 'Despacito - Shorts Remix',
                channelTitle: 'Luis Fonsi',
                description: 'The viral hit in shorts format!',
                thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
                publishedAt: new Date(Date.now() - 172800000).toISOString(),
                viewCount: 8000000000,
                duration: 'Shorts',
                url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
                embedUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk?autoplay=1&rel=0',
                channelUrl: 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw'
            },
            {
                id: 'YQHsXMglC9A',
                title: 'Hello - Shorts Version',
                channelTitle: 'Adele',
                description: 'Adele\'s Hello in shorts format!',
                thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/maxresdefault.jpg',
                publishedAt: new Date(Date.now() - 259200000).toISOString(),
                viewCount: 3500000000,
                duration: 'Shorts',
                url: 'https://www.youtube.com/watch?v=YQHsXMglC9A',
                embedUrl: 'https://www.youtube.com/embed/YQHsXMglC9A?autoplay=1&rel=0',
                channelUrl: 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw'
            },
            {
                id: '9bZkp7q19f0',
                title: 'PSY - GANGNAM STYLE - Shorts',
                channelTitle: 'officialpsy',
                description: 'The K-pop sensation in shorts format!',
                thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
                publishedAt: new Date(Date.now() - 345600000).toISOString(),
                viewCount: 4500000000,
                duration: 'Shorts',
                url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
                embedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&rel=0',
                channelUrl: 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw'
            },
            {
                id: 'fJ9rUzIMcZQ',
                title: 'Queen - Bohemian Rhapsody - Shorts',
                channelTitle: 'Queen Official',
                description: 'The legendary Queen song in shorts format!',
                thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
                publishedAt: new Date(Date.now() - 432000000).toISOString(),
                viewCount: 2000000000,
                duration: 'Shorts',
                url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
                embedUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ?autoplay=1&rel=0',
                channelUrl: 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw'
            },
            {
                id: 'hT_nvWreIhg',
                title: 'The Weeknd - Blinding Lights - Shorts',
                channelTitle: 'The Weeknd',
                description: 'The Weeknd\'s hit in shorts format!',
                thumbnail: 'https://i.ytimg.com/vi/hT_nvWreIhg/maxresdefault.jpg',
                publishedAt: new Date(Date.now() - 518400000).toISOString(),
                viewCount: 1800000000,
                duration: 'Shorts',
                url: 'https://www.youtube.com/watch?v=hT_nvWreIhg',
                embedUrl: 'https://www.youtube.com/embed/hT_nvWreIhg?autoplay=1&rel=0',
                channelUrl: 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw'
            },
            {
                id: 'kJQP7kiw5Fk',
                title: 'Ed Sheeran - Shape of You - Shorts',
                channelTitle: 'Ed Sheeran',
                description: 'Ed Sheeran\'s global hit in shorts format!',
                thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
                publishedAt: new Date(Date.now() - 604800000).toISOString(),
                viewCount: 5500000000,
                duration: 'Shorts',
                url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
                embedUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk?autoplay=1&rel=0',
                channelUrl: 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw'
            },
            {
                id: 'YQHsXMglC9A',
                title: 'Billie Eilish - bad guy - Shorts',
                channelTitle: 'Billie Eilish',
                description: 'Billie Eilish\'s breakthrough hit in shorts format!',
                thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/maxresdefault.jpg',
                publishedAt: new Date(Date.now() - 691200000).toISOString(),
                viewCount: 1200000000,
                duration: 'Shorts',
                url: 'https://www.youtube.com/watch?v=YQHsXMglC9A',
                embedUrl: 'https://www.youtube.com/embed/YQHsXMglC9A?autoplay=1&rel=0',
                channelUrl: 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw'
            },
            {
                id: 'dQw4w9WgXcQ',
                title: 'Taylor Swift - Shake It Off - Shorts',
                channelTitle: 'Taylor Swift',
                description: 'Taylor Swift\'s catchy hit in shorts format!',
                thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                publishedAt: new Date(Date.now() - 777600000).toISOString(),
                viewCount: 3200000000,
                duration: 'Shorts',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0',
                channelUrl: 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw'
            }
        ].map(short => ({
            ...short,
            // 조회수를 랜덤하게 조정하여 더 현실적으로 만들기
            viewCount: Math.floor(Math.random() * 10000000) + 1000000
        })).sort((a, b) => b.viewCount - a.viewCount);
    }

    /**
     * API 할당량 정보 확인 (선택사항)
     * @returns {Object} 할당량 정보
     */
    getQuotaInfo() {
        // YouTube API v3 할당량 정보
        return {
            search: 100, // search 요청당 100 할당량
            videos: 1,   // videos 요청당 1 할당량
            channels: 1, // channels 요청당 1 할당량
            dailyLimit: 10000 // 일일 할당량
        };
    }
}

// 전역 API 인스턴스 생성
window.YouTubeAPI = new YouTubeAPI();
