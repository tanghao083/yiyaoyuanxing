// 通用交互逻辑

// 侧边栏导航
function initSidebar() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            sidebarItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
}

// 分页功能
class Pagination {
    constructor(container, options = {}) {
        this.container = container;
        this.currentPage = options.currentPage || 1;
        this.totalPages = options.totalPages || 5;
        this.itemsPerPage = options.itemsPerPage || 10;
        this.onPageChange = options.onPageChange || function() {};
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateUI();
    }
    
    bindEvents() {
        const links = this.container.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageText = link.textContent.trim();
                const hasChevronLeft = link.querySelector('.fa-chevron-left');
                const hasChevronRight = link.querySelector('.fa-chevron-right');
                
                if (pageText === '上一页' || hasChevronLeft) {
                    this.goToPage(this.currentPage - 1);
                } else if (pageText === '下一页' || hasChevronRight) {
                    this.goToPage(this.currentPage + 1);
                } else if (!isNaN(pageText)) {
                    this.goToPage(parseInt(pageText));
                }
            });
        });
    }
    
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updateUI();
            this.onPageChange(page);
        }
    }
    
    updateUI() {
        const links = this.container.querySelectorAll('a');
        links.forEach(link => {
            const pageText = link.textContent.trim();
            const hasChevronLeft = link.querySelector('.fa-chevron-left');
            const hasChevronRight = link.querySelector('.fa-chevron-right');
            
            if (!isNaN(pageText) && !hasChevronLeft && !hasChevronRight) {
                const pageNum = parseInt(pageText);
                if (pageNum === this.currentPage) {
                    link.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-50');
                    link.classList.add('bg-admin-primary', 'text-white');
                } else {
                    link.classList.remove('bg-admin-primary', 'text-white');
                    link.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-50');
                }
            }
        });
        
        // 更新显示信息
        const infoElement = this.container.closest('.bg-white').querySelector('.text-sm.text-gray-700');
        if (infoElement) {
            const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalPages * this.itemsPerPage);
            const totalItems = this.totalPages * this.itemsPerPage;
            infoElement.innerHTML = `显示 <span class="font-medium">${startItem}</span> 到 <span class="font-medium">${endItem}</span> 共 <span class="font-medium">${totalItems}</span> 条记录`;
        }
    }
}

// 滚动加载更多
function initInfiniteScroll(options = {}) {
    const {
        container = window,
        triggerElement = null,
        onLoadMore = function() {},
        loading = false
    } = options;
    
    let isLoading = loading;
    
    const handleScroll = () => {
        if (isLoading) return;
        
        let scrollPosition;
        let scrollHeight;
        let clientHeight;
        
        if (container === window) {
            scrollPosition = window.scrollY;
            scrollHeight = document.documentElement.scrollHeight;
            clientHeight = window.innerHeight;
        } else {
            scrollPosition = container.scrollTop;
            scrollHeight = container.scrollHeight;
            clientHeight = container.clientHeight;
        }
        
        if (triggerElement) {
            const rect = triggerElement.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 1.5) {
                loadMore();
            }
        } else {
            if (scrollPosition + clientHeight >= scrollHeight - 100) {
                loadMore();
            }
        }
    };
    
    const loadMore = async () => {
        isLoading = true;
        await onLoadMore();
        isLoading = false;
    };
    
    container.addEventListener('scroll', handleScroll);
    
    return {
        destroy: () => container.removeEventListener('scroll', handleScroll)
    };
}

// 按钮状态管理
function initButtons() {
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        if (button.disabled) {
            button.classList.add('opacity-50', 'cursor-not-allowed');
        }
        
        button.addEventListener('click', function() {
            if (!this.disabled) {
                // 添加点击效果
                this.classList.add('scale-95');
                setTimeout(() => {
                    this.classList.remove('scale-95');
                }, 150);
            }
        });
    });
}

// 表单验证和处理
class FormHandler {
    constructor(form, options = {}) {
        this.form = form;
        this.rules = options.rules || {};
        this.onSubmit = options.onSubmit || function() {};
        this.onReset = options.onReset || function() {};
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                this.onSubmit(new FormData(this.form));
            }
        });
        
        const resetButton = this.form.querySelector('[type="reset"]');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.onReset();
            });
        }
        
        // 实时验证
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }
    
    validate() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(input) {
        const name = input.name;
        const value = input.value.trim();
        const rules = this.rules[name];
        
        if (!rules) return true;
        
        // 清除之前的错误信息
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        
        // 验证必填
        if (rules.required && !value) {
            this.showError(input, rules.message || '此字段为必填项');
            return false;
        }
        
        // 验证最小长度
        if (rules.minLength && value.length < rules.minLength) {
            this.showError(input, rules.message || `最少需要${rules.minLength}个字符`);
            return false;
        }
        
        // 验证最大长度
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showError(input, rules.message || `最多允许${rules.maxLength}个字符`);
            return false;
        }
        
        // 验证正则表达式
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showError(input, rules.message || '输入格式不正确');
            return false;
        }
        
        return true;
    }
    
    showError(input, message) {
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-danger text-xs mt-1';
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        errorElement.textContent = message;
    }
    
    reset() {
        this.form.reset();
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(el => el.remove());
    }
}

// 列表管理
class ListManager {
    constructor(container, options = {}) {
        this.container = container;
        this.data = options.data || [];
        this.itemTemplate = options.itemTemplate || function() {};
        this.emptyTemplate = options.emptyTemplate || function() { return '<div class="text-center py-8 text-gray-500">暂无数据</div>'; };
        this.loadingTemplate = options.loadingTemplate || function() { return '<div class="text-center py-8"><i class="fa fa-spinner fa-spin"></i> 加载中...</div>'; };
        
        this.isLoading = false;
    }
    
    render() {
        if (this.isLoading) {
            this.container.innerHTML = this.loadingTemplate();
            return;
        }
        
        if (this.data.length === 0) {
            this.container.innerHTML = this.emptyTemplate();
            return;
        }
        
        const itemsHtml = this.data.map(item => this.itemTemplate(item)).join('');
        this.container.innerHTML = itemsHtml;
    }
    
    setData(data) {
        this.data = data;
        this.render();
    }
    
    addItem(item) {
        this.data.push(item);
        this.render();
    }
    
    removeItem(index) {
        this.data.splice(index, 1);
        this.render();
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        this.render();
    }
}

// 标签页管理
function initTabs() {
    const tabContainers = document.querySelectorAll('.tab-container');
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('[data-tab]');
        const tabPanes = container.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // 更新按钮状态
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // 更新面板状态
                tabPanes.forEach(pane => {
                    pane.classList.add('hidden');
                });
                const activePane = container.querySelector(`#${tabId}`);
                if (activePane) {
                    activePane.classList.remove('hidden');
                }
            });
        });
    });
}

// 模态框管理
class Modal {
    constructor(modalElement, options = {}) {
        this.modal = modalElement;
        this.onOpen = options.onOpen || function() {};
        this.onClose = options.onClose || function() {};
        
        this.init();
    }
    
    init() {
        const closeButtons = this.modal.querySelectorAll('[data-close], .close');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.close();
            });
        });
        
        // 点击模态框外部关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }
    
    open() {
        this.modal.classList.remove('hidden');
        this.onOpen();
    }
    
    close() {
        this.modal.classList.add('hidden');
        this.onClose();
    }
    
    toggle() {
        if (this.modal.classList.contains('hidden')) {
            this.open();
        } else {
            this.close();
        }
    }
}

// 下拉菜单
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('hidden');
            });
            
            // 点击外部关闭
            document.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        }
    });
}

// 自动补全
class Autocomplete {
    constructor(input, options = {}) {
        this.input = input;
        this.data = options.data || [];
        this.onSelect = options.onSelect || function() {};
        this.minLength = options.minLength || 2;
        
        this.init();
    }
    
    init() {
        this.input.addEventListener('input', () => {
            this.handleInput();
        });
        
        this.input.addEventListener('blur', () => {
            setTimeout(() => {
                this.hideResults();
            }, 200);
        });
    }
    
    handleInput() {
        const value = this.input.value.trim();
        
        if (value.length < this.minLength) {
            this.hideResults();
            return;
        }
        
        const results = this.data.filter(item => 
            item.toLowerCase().includes(value.toLowerCase())
        );
        
        if (results.length > 0) {
            this.showResults(results);
        } else {
            this.hideResults();
        }
    }
    
    showResults(results) {
        // 移除旧的结果
        this.hideResults();
        
        // 创建结果容器
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'autocomplete-results absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-40 overflow-y-auto';
        
        // 添加结果项
        results.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer';
            itemElement.textContent = item;
            itemElement.addEventListener('click', () => {
                this.input.value = item;
                this.hideResults();
                this.onSelect(item);
            });
            resultsContainer.appendChild(itemElement);
        });
        
        // 定位结果容器
        const inputRect = this.input.getBoundingClientRect();
        resultsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
        resultsContainer.style.left = `${inputRect.left + window.scrollX}px`;
        resultsContainer.style.width = `${inputRect.width}px`;
        
        document.body.appendChild(resultsContainer);
        this.resultsContainer = resultsContainer;
    }
    
    hideResults() {
        if (this.resultsContainer) {
            this.resultsContainer.remove();
            this.resultsContainer = null;
        }
    }
}

// 页面初始化
function initPage() {
    initSidebar();
    initButtons();
    initTabs();
    initDropdowns();
    
    // 初始化分页
    const paginationContainers = document.querySelectorAll('.pagination');
    paginationContainers.forEach(container => {
        new Pagination(container, {
            onPageChange: (page) => {
                console.log('Page changed to:', page);
                // 这里可以添加数据加载逻辑
            }
        });
    });
    
    // 初始化滚动加载
    initInfiniteScroll({
        onLoadMore: async () => {
            console.log('Loading more data...');
            // 这里可以添加加载更多数据的逻辑
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);
"// Test deployment" 
