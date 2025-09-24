class SpringSimulator {
    constructor() {
        this.ball = document.getElementById('ball');
        this.spring = document.getElementById('spring');
        this.pressureValue = document.getElementById('pressureValue');
        this.gaugeNeedle = document.getElementById('gaugeNeedle');
        this.simulator = document.querySelector('.simulator');
        
        // 初始参数
        this.initialBallTop = 180; // 小球初始位置
        this.initialSpringHeight = 120; // 弹簧初始长度
        this.springConstant = 2.5; // 弹簧常数
        this.maxStretch = 200; // 最大拉伸距离
        
        // 拖拽状态
        this.isDragging = false;
        this.dragStartY = 0;
        this.ballStartTop = 0;
        
        // 动画相关
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.updatePressure(0);
    }
    
    addEventListeners() {
        // 鼠标事件
        this.ball.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // 触摸事件（移动端支持）
        this.ball.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // 防止拖拽时选中文本
        this.ball.addEventListener('selectstart', (e) => e.preventDefault());
        this.ball.addEventListener('dragstart', (e) => e.preventDefault());
    }
    
    handleMouseDown(e) {
        e.preventDefault();
        this.startDrag(e.clientY);
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        this.startDrag(e.touches[0].clientY);
    }
    
    startDrag(clientY) {
        this.isDragging = true;
        this.dragStartY = clientY;
        this.ballStartTop = parseInt(this.ball.style.top) || this.initialBallTop;
        
        // 添加拖拽样式
        this.simulator.classList.add('dragging');
        this.ball.style.cursor = 'grabbing';
        
        // 禁用压力表盘指针的过渡效果
        if (this.gaugeNeedle) {
            this.gaugeNeedle.style.transition = 'none';
        }
        
        // 取消任何正在进行的动画
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    handleMouseMove(e) {
        if (this.isDragging) {
            e.preventDefault();
            this.updateDrag(e.clientY);
        }
    }
    
    handleTouchMove(e) {
        if (this.isDragging) {
            e.preventDefault();
            this.updateDrag(e.touches[0].clientY);
        }
    }
    
    updateDrag(clientY) {
        const deltaY = clientY - this.dragStartY;
        let newTop = this.ballStartTop + deltaY;
        
        // 限制拖拽范围（只能向下拖拽）
        newTop = Math.max(this.initialBallTop, newTop);
        newTop = Math.min(this.initialBallTop + this.maxStretch, newTop);
        
        // 更新小球位置
        this.ball.style.top = newTop + 'px';
        
        // 计算拉伸距离
        const stretch = newTop - this.initialBallTop;
        
        // 更新弹簧长度
        const newSpringHeight = this.initialSpringHeight + stretch;
        this.spring.style.height = newSpringHeight + 'px';
        
        // 更新弹簧样式（拉伸时变红）
        if (stretch > 0) {
            this.spring.classList.add('stretched');
        } else {
            this.spring.classList.remove('stretched');
        }
        
        // 计算并更新压力值
        const pressure = this.calculatePressure(stretch);
        this.updatePressure(pressure);
    }
    
    handleMouseUp(e) {
        if (this.isDragging) {
            this.endDrag();
        }
    }
    
    handleTouchEnd(e) {
        if (this.isDragging) {
            this.endDrag();
        }
    }
    
    endDrag() {
        this.isDragging = false;
        
        // 移除拖拽样式
        this.simulator.classList.remove('dragging');
        this.ball.style.cursor = 'grab';
        
        // 启动回弹动画
        this.startSpringBackAnimation();
    }
    
    startSpringBackAnimation() {
        // 启用压力表盘指针的过渡效果
        if (this.gaugeNeedle) {
            this.gaugeNeedle.style.transition = 'transform 0.1s ease-out';
        }
        
        const startTime = performance.now();
        const startTop = parseInt(this.ball.style.top) || this.initialBallTop;
        const startSpringHeight = parseInt(this.spring.style.height) || this.initialSpringHeight;
        const duration = 800; // 动画持续时间（毫秒）
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用弹性缓动函数
            const easeProgress = this.easeOutElastic(progress);
            
            // 计算当前位置
            const currentTop = startTop + (this.initialBallTop - startTop) * easeProgress;
            const currentSpringHeight = startSpringHeight + (this.initialSpringHeight - startSpringHeight) * easeProgress;
            
            // 更新位置
            this.ball.style.top = currentTop + 'px';
            this.spring.style.height = currentSpringHeight + 'px';
            
            // 计算当前压力
            const currentStretch = currentTop - this.initialBallTop;
            const pressure = this.calculatePressure(Math.max(0, currentStretch));
            this.updatePressure(pressure);
            
            // 更新弹簧样式
            if (currentStretch > 1) {
                this.spring.classList.add('stretched');
            } else {
                this.spring.classList.remove('stretched');
            }
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                // 动画结束，确保回到初始状态
                this.resetToInitialState();
            }
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
    
    calculatePressure(stretch) {
        // 根据胡克定律计算压力：F = kx
        // stretch 单位为像素，转换为实际单位（假设1像素 = 0.1cm）
        const stretchInCm = stretch * 0.1;
        const pressure = this.springConstant * stretchInCm;
        return Math.max(0, pressure);
    }
    
    updatePressure(pressure) {
        // 格式化压力值显示
        const formattedPressure = pressure.toFixed(1);
        this.pressureValue.textContent = formattedPressure;
        
        // 根据压力值改变颜色
        if (pressure > 30) {
            this.pressureValue.style.color = '#e74c3c'; // 红色
        } else if (pressure > 15) {
            this.pressureValue.style.color = '#f39c12'; // 橙色
        } else if (pressure > 0) {
            this.pressureValue.style.color = '#3498db'; // 蓝色
        } else {
            this.pressureValue.style.color = '#3498db'; // 默认蓝色
        }
        
        // 更新压力表盘指针角度
        // 压力范围 0-50N 对应角度 0-180度
        const maxPressure = 50;
        const maxAngle = 180;
        const angle = Math.min((pressure / maxPressure) * maxAngle, maxAngle);
        
        if (this.gaugeNeedle) {
            this.gaugeNeedle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
        }
    }
    
    resetToInitialState() {
        this.ball.style.top = this.initialBallTop + 'px';
        this.spring.style.height = this.initialSpringHeight + 'px';
        this.spring.classList.remove('stretched');
        this.updatePressure(0);
        this.animationId = null;
    }
}

// 页面加载完成后初始化模拟器
document.addEventListener('DOMContentLoaded', () => {
    new SpringSimulator();
    
    // 添加一些视觉增强效果
    const simulator = document.querySelector('.simulator');
    
    // 鼠标悬停效果
    const ball = document.getElementById('ball');
    ball.addEventListener('mouseenter', () => {
        ball.style.transform = 'translateX(-50%) scale(1.05)';
    });
    
    ball.addEventListener('mouseleave', () => {
        if (!ball.matches(':active')) {
            ball.style.transform = 'translateX(-50%) scale(1)';
        }
    });
    
    // 添加键盘支持
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            // 空格键触发一个小的弹跳效果
            ball.style.transform = 'translateX(-50%) scale(1.1)';
            setTimeout(() => {
                ball.style.transform = 'translateX(-50%) scale(1)';
            }, 150);
        }
    });
});

// 添加页面可见性API支持，当页面不可见时暂停动画
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏时可以暂停动画以节省资源
        console.log('页面隐藏，动画已暂停');
    } else {
        // 页面重新可见时恢复动画
        console.log('页面可见，动画已恢复');
    }
});