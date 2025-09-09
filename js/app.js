/**
 * 메인 애플리케이션 로직
 */

class App {
    constructor() {
        this.ui = window.UIManager;
        this.api = window.YouTubeAPI;
        this.isLoading = false;
        this.init();
    }

    /**
     * 애플리케이션 초기화
     */
    async init() {
        console.log('한국 인기 쇼츠 추천기 시작');
        
        try {
            // 초기 데이터 로드
            await this.loadShorts();

            // 윈도우 리사이즈 이벤트
            window.addEventListener('resize', Utils.debounce(() => {
                this.ui.adjustGrid();
            }, 250));

        } catch (error) {
            console.error('앱 초기화 오류:', error);
            this.ui.showError(Utils.ErrorUtils.getUserFriendlyMessage(error));
        }
    }

    /**
     * 쇼츠 데이터 로드
     */
    async loadShorts() {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.ui.showLoading(true);
            this.ui.showDebugInfo('쇼츠 데이터 로딩 시작...');

            console.log('쇼츠 데이터 로딩 시작...');
            
            const shorts = await this.api.getKoreanPopularShorts();
            
            if (!shorts || shorts.length === 0) {
                throw new Error('오늘의 인기 쇼츠를 찾을 수 없습니다.');
            }

            console.log(`${shorts.length}개의 쇼츠를 로드했습니다.`);
            this.ui.showDebugInfo(`${shorts.length}개의 쇼츠를 성공적으로 로드했습니다!`);
            
            // 쇼츠 정보 로깅
            shorts.forEach((short, index) => {
                console.log(`${index + 1}. ${short.title} - ${short.channelTitle} (${Utils.NumberUtils.formatViews(short.viewCount)})`);
            });
            
            this.ui.showShortsGrid(shorts);

        } catch (error) {
            console.error('쇼츠 로드 오류:', error);
            this.ui.showDebugInfo(`오류 발생: ${error.message}`);
            this.ui.showError(Utils.ErrorUtils.getUserFriendlyMessage(error));
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * 새로고침 처리
     */
    async refresh() {
        console.log('새로고침 요청');
        await this.loadShorts();
    }

    /**
     * 에러 상태에서 재시도
     */
    async retry() {
        console.log('재시도 요청');
        await this.loadShorts();
    }
}

// DOM 로드 완료 후 앱 시작
document.addEventListener('DOMContentLoaded', () => {
    window.App = new App();
});

// 전역 함수들 (HTML에서 직접 호출용)
window.refreshShorts = () => {
    if (window.App) {
        window.App.refresh();
    }
};

window.retryShorts = () => {
    if (window.App) {
        window.App.retry();
    }
};
