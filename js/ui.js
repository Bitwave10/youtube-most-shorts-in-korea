/**
 * UI 컴포넌트 및 상호작용 관리 모듈
 */

class UIManager {
    constructor() {
        this.elements = this.initializeElements();
        this.modal = null;
        this.bindEvents();
        this.debugMode = true; // 개발 중에는 true로 설정
    }

    /**
     * DOM 요소들 초기화
     * @returns {Object} DOM 요소 객체
     */
    initializeElements() {
        return {
            loadingState: Utils.DOMUtils.select('#loadingState'),
            errorState: Utils.DOMUtils.select('#errorState'),
            successState: Utils.DOMUtils.select('#successState'),
            successMessage: Utils.DOMUtils.select('#successMessage'),
            shortsGrid: Utils.DOMUtils.select('#shortsGrid'),
            refreshBtn: Utils.DOMUtils.select('#refreshBtn'),
            retryBtn: Utils.DOMUtils.select('#retryBtn'),
            errorMessage: Utils.DOMUtils.select('#errorMessage'),
            lastUpdated: Utils.DOMUtils.select('#lastUpdated'),
            shortsModal: Utils.DOMUtils.select('#shortsModal'),
            modalTitle: Utils.DOMUtils.select('#modalTitle'),
            closeModal: Utils.DOMUtils.select('#closeModal'),
            playerContainer: Utils.DOMUtils.select('#playerContainer'),
            debugInfo: Utils.DOMUtils.select('#debugInfo'),
            debugText: Utils.DOMUtils.select('#debugText')
        };
    }

    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        // 새로고침 버튼
        if (this.elements.refreshBtn) {
            this.elements.refreshBtn.addEventListener('click', () => {
                this.handleRefresh();
            });
        }

        // 재시도 버튼
        if (this.elements.retryBtn) {
            this.elements.retryBtn.addEventListener('click', () => {
                this.handleRetry();
            });
        }

        // 모달 닫기 버튼
        if (this.elements.closeModal) {
            this.elements.closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // 모달 배경 클릭으로 닫기
        if (this.elements.shortsModal) {
            this.elements.shortsModal.addEventListener('click', (e) => {
                if (e.target === this.elements.shortsModal) {
                    this.closeModal();
                }
            });
        }

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal) {
                this.closeModal();
            }
        });
    }

    /**
     * 로딩 상태 표시
     * @param {boolean} show - 표시 여부
     */
    showLoading(show = true) {
        Utils.DOMUtils.toggle(this.elements.loadingState, show);
        Utils.DOMUtils.toggle(this.elements.errorState, false);
        Utils.DOMUtils.toggle(this.elements.shortsGrid, false);

        if (show && this.elements.refreshBtn) {
            this.elements.refreshBtn.classList.add('loading');
        } else if (this.elements.refreshBtn) {
            this.elements.refreshBtn.classList.remove('loading');
        }
    }

    /**
     * 에러 상태 표시
     * @param {string} message - 에러 메시지
     */
    showError(message) {
        Utils.DOMUtils.toggle(this.elements.loadingState, false);
        Utils.DOMUtils.toggle(this.elements.errorState, true);
        Utils.DOMUtils.toggle(this.elements.shortsGrid, false);

        if (this.elements.errorMessage) {
            this.elements.errorMessage.innerHTML = `
                <div style="margin-bottom: 10px; font-size: 1.1rem; font-weight: 500;">${message}</div>
                <div style="font-size: 0.9rem; color: #95a5a6;">
                    <p><strong>문제 해결 방법:</strong></p>
                    <ul style="text-align: left; margin: 10px 0; padding-left: 20px;">
                        <li>인터넷 연결을 확인해주세요</li>
                        <li>YouTube Data API v3가 활성화되었는지 확인해주세요</li>
                        <li>API 키에 올바른 권한이 설정되었는지 확인해주세요</li>
                        <li>API 할당량이 초과되지 않았는지 확인해주세요</li>
                        <li>잠시 후 다시 시도해주세요</li>
                    </ul>
                    <p style="margin-top: 15px; font-size: 0.8rem; color: #7f8c8d;">
                        💡 <strong>팁:</strong> "API 테스트" 버튼을 클릭하여 API 연결 상태를 확인할 수 있습니다.
                    </p>
                </div>
            `;
        }

        if (this.elements.refreshBtn) {
            this.elements.refreshBtn.classList.remove('loading');
        }

        // 콘솔에 상세 에러 정보 출력
        console.error('에러 발생:', message);
    }

    /**
     * 쇼츠 그리드 표시
     * @param {Array} shorts - 쇼츠 데이터 배열
     */
    showShortsGrid(shorts) {
        Utils.DOMUtils.toggle(this.elements.loadingState, false);
        Utils.DOMUtils.toggle(this.elements.errorState, false);
        Utils.DOMUtils.toggle(this.elements.shortsGrid, true);

        if (this.elements.refreshBtn) {
            this.elements.refreshBtn.classList.remove('loading');
        }

        // 그리드 레이아웃 강제 재설정
        this.forceGridLayout();

        // 성공 메시지 표시
        const isRealTime = shorts.some(short => short.id !== 'dQw4w9WgXcQ' && short.id !== 'jNQXAC9IVRw');
        const message = isRealTime 
            ? `${shorts.length}개의 실시간 인기 쇼츠를 성공적으로 로드했습니다!`
            : `${shorts.length}개의 인기 쇼츠를 성공적으로 로드했습니다!`;
        this.showSuccess(message);

        this.renderShortsCards(shorts);
        this.updateLastUpdated();
    }

    /**
     * 그리드 레이아웃 강제 재설정
     */
    forceGridLayout() {
        if (this.elements.shortsGrid) {
            // 그리드 스타일 강제 적용
            this.elements.shortsGrid.style.display = 'grid';
            this.elements.shortsGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
            this.elements.shortsGrid.style.gridTemplateRows = 'repeat(2, auto)';
            this.elements.shortsGrid.style.gap = '15px';
            this.elements.shortsGrid.style.maxWidth = '1800px';
            this.elements.shortsGrid.style.marginLeft = 'auto';
            this.elements.shortsGrid.style.marginRight = 'auto';
            this.elements.shortsGrid.style.width = '100%';
            this.elements.shortsGrid.style.gridAutoFlow = 'row';
            
            console.log('그리드 레이아웃 강제 재설정 완료');
        }
    }

    /**
     * 성공 상태 표시
     * @param {string} message - 성공 메시지
     */
    showSuccess(message) {
        Utils.DOMUtils.toggle(this.elements.loadingState, false);
        Utils.DOMUtils.toggle(this.elements.errorState, false);
        Utils.DOMUtils.toggle(this.elements.successState, true);

        if (this.elements.successMessage) {
            this.elements.successMessage.textContent = message;
        }

        // 3초 후 성공 메시지 숨기기
        setTimeout(() => {
            Utils.DOMUtils.toggle(this.elements.successState, false);
        }, 3000);
    }

    /**
     * 쇼츠 카드들 렌더링
     * @param {Array} shorts - 쇼츠 데이터 배열
     */
    renderShortsCards(shorts) {
        if (!this.elements.shortsGrid) return;

        this.elements.shortsGrid.innerHTML = '';

        shorts.forEach((short, index) => {
            const card = this.createShortsCard(short, index);
            this.elements.shortsGrid.appendChild(card);
        });

        // 애니메이션 효과 추가
        this.animateCards();
    }

    /**
     * 개별 쇼츠 카드 생성
     * @param {Object} short - 쇼츠 데이터
     * @param {number} index - 인덱스
     * @returns {HTMLElement} 카드 요소
     */
    createShortsCard(short, index) {
        const card = document.createElement('div');
        card.className = 'shorts-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="thumbnail-container" data-video-id="${short.id}">
                <img 
                    src="${short.thumbnail}" 
                    alt="${Utils.StringUtils.escapeHtml(short.title)}"
                    class="thumbnail"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/320x180?text=Thumbnail+Error'"
                >
                <div class="play-overlay">
                    ▶
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${Utils.StringUtils.escapeHtml(short.title)}</h3>
                <div class="channel-info">
                    <span class="channel-name">${Utils.StringUtils.escapeHtml(short.channelTitle)}</span>
                </div>
                <div class="views-info">
                    <span class="views-icon">👁</span>
                    <span class="views-count">${Utils.NumberUtils.formatViews(short.viewCount)}</span>
                </div>
            </div>
        `;

        // 카드 클릭 이벤트
        card.addEventListener('click', () => {
            this.openModal(short);
        });

        // 썸네일 클릭 이벤트
        const thumbnailContainer = card.querySelector('.thumbnail-container');
        if (thumbnailContainer) {
            thumbnailContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openModal(short);
            });
        }

        return card;
    }

    /**
     * 모달 열기
     * @param {Object} short - 쇼츠 데이터
     */
    openModal(short) {
        if (!this.elements.shortsModal) return;

        this.modal = short;

        // 모달 제목 설정
        if (this.elements.modalTitle) {
            this.elements.modalTitle.textContent = Utils.StringUtils.truncate(short.title, 50);
        }

        // 플레이어 컨테이너 설정
        if (this.elements.playerContainer) {
            this.elements.playerContainer.innerHTML = `
                <iframe 
                    src="${short.embedUrl}?autoplay=1&rel=0&modestbranding=1"
                    title="${Utils.StringUtils.escapeHtml(short.title)}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            `;
        }

        // 모달 표시
        Utils.DOMUtils.toggle(this.elements.shortsModal, true);
        document.body.style.overflow = 'hidden';

        // 모달 애니메이션
        this.elements.shortsModal.classList.add('fade-in');
    }

    /**
     * 모달 닫기
     */
    closeModal() {
        if (!this.elements.shortsModal || !this.modal) return;

        // 플레이어 정리
        if (this.elements.playerContainer) {
            this.elements.playerContainer.innerHTML = '';
        }

        // 모달 숨기기
        Utils.DOMUtils.toggle(this.elements.shortsModal, false);
        document.body.style.overflow = '';

        this.modal = null;
    }

    /**
     * 카드 애니메이션 효과
     */
    animateCards() {
        const cards = this.elements.shortsGrid.querySelectorAll('.shorts-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('slide-up');
            }, index * 100);
        });
    }

    /**
     * 마지막 업데이트 시간 갱신
     */
    updateLastUpdated() {
        if (this.elements.lastUpdated) {
            this.elements.lastUpdated.textContent = Utils.DateUtils.formatKorean(new Date());
        }
    }

    /**
     * 새로고침 처리
     */
    async handleRefresh() {
        try {
            this.showLoading(true);
            
            // 캐시 클리어
            if (window.YouTubeAPI) {
                window.YouTubeAPI.clearCache();
            }

            // 데이터 다시 로드
            if (window.App) {
                await window.App.loadShorts();
            }
        } catch (error) {
            console.error('새로고침 오류:', error);
            this.showError(Utils.ErrorUtils.getUserFriendlyMessage(error));
        }
    }

    /**
     * 재시도 처리
     */
    async handleRetry() {
        try {
            this.showLoading(true);
            
            if (window.App) {
                await window.App.loadShorts();
            }
        } catch (error) {
            console.error('재시도 오류:', error);
            this.showError(Utils.ErrorUtils.getUserFriendlyMessage(error));
        }
    }

    /**
     * 토스트 메시지 표시 (선택사항)
     * @param {string} message - 메시지
     * @param {string} type - 메시지 타입 (success, error, info)
     */
    showToast(message, type = 'info') {
        // 간단한 토스트 구현
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    /**
     * 반응형 그리드 조정
     */
    adjustGrid() {
        if (!this.elements.shortsGrid) return;

        const containerWidth = this.elements.shortsGrid.offsetWidth;
        const cardWidth = 300;
        const gap = 20;
        const columns = Math.floor((containerWidth + gap) / (cardWidth + gap));
        
        this.elements.shortsGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }

    /**
     * 디버깅 정보 표시
     * @param {string} message - 디버그 메시지
     */
    showDebugInfo(message) {
        if (!this.debugMode) return;
        
        if (this.elements.debugInfo && this.elements.debugText) {
            this.elements.debugText.textContent = message;
            Utils.DOMUtils.toggle(this.elements.debugInfo, true);
        }
        
        console.log('디버그:', message);
    }

    /**
     * 디버깅 정보 숨기기
     */
    hideDebugInfo() {
        if (this.elements.debugInfo) {
            Utils.DOMUtils.toggle(this.elements.debugInfo, false);
        }
    }
}

// 전역 UI 매니저 인스턴스 생성
window.UIManager = new UIManager();
