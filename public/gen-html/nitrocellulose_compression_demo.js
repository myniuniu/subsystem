class NitrocelluloseExperiment {
    constructor() {
        this.piston = document.getElementById('piston');
        this.nitrocellulose = document.getElementById('nitrocellulose');
        this.fireEffect = document.getElementById('fire-effect');
        this.compressedAir = document.getElementById('compressed-air');
        this.temperatureDisplay = document.getElementById('temperature');
        this.pressureDisplay = document.getElementById('pressure');
        this.temperatureFill = document.getElementById('temperature-fill');
        this.pressureFill = document.getElementById('pressure-fill');
        this.statusDisplay = document.getElementById('status');
        this.resetBtn = document.getElementById('reset-btn');
        
        // 实验参数
        this.initialTemperature = 25; // 初始温度 (°C)
        this.initialPressure = 1.0; // 初始压力 (atm)
        this.ignitionTemperature = 160; // 硝化棉燃点 (°C)
        this.maxTemperature = 300; // 最高温度 (°C)
        this.maxPressure = 10.0; // 最大压力 (atm)
        
        // 活塞位置参数
        this.initialPistonY = 0;
        this.maxPistonY = 250; // 最大压缩距离
        this.currentPistonY = 0;
        
        // 状态变量
        this.isDragging = false;
        this.isBurning = false;
        this.dragStartY = 0;
        this.pistonStartY = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    setupEventListeners() {
        // 鼠标事件
        this.piston.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        
        // 触摸事件（移动端支持）
        this.piston.addEventListener('touchstart', this.startDrag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('touchend', this.endDrag.bind(this));
        
        // 重置按钮
        this.resetBtn.addEventListener('click', this.reset.bind(this));
        
        // 防止默认拖拽行为
        this.piston.addEventListener('dragstart', (e) => e.preventDefault());
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.piston.classList.add('dragging');
        
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        this.dragStartY = clientY;
        this.pistonStartY = this.currentPistonY;
        
        e.preventDefault();
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - this.dragStartY;
        const newPistonY = Math.max(0, Math.min(this.maxPistonY, this.pistonStartY + deltaY));
        
        this.currentPistonY = newPistonY;
        this.updatePistonPosition();
        this.calculatePhysics();
        this.updateDisplay();
        
        // 实时检查是否达到燃点
        this.checkIgnition();
        
        e.preventDefault();
    }
    
    endDrag(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.piston.classList.remove('dragging');
        
        // 检查是否达到燃点
        this.checkIgnition();
    }
    
    updatePistonPosition() {
        this.piston.setAttribute('transform', `translate(0, ${this.currentPistonY})`);
    }
    
    calculatePhysics() {
        // 计算压缩比例 (0-1)
        const compressionRatio = this.currentPistonY / this.maxPistonY;
        
        // 根据理想气体定律和绝热过程计算压力和温度
        // P1V1^γ = P2V2^γ (绝热过程)
        // γ = 1.4 (空气的绝热指数)
        const gamma = 1.4;
        const volumeRatio = 1 - compressionRatio * 0.8; // 体积比例
        
        if (volumeRatio > 0.1) {
            // 压力计算
            this.currentPressure = this.initialPressure * Math.pow(1 / volumeRatio, gamma);
            
            // 温度计算 (绝热过程: T1V1^(γ-1) = T2V2^(γ-1))
            this.currentTemperature = (this.initialTemperature + 273.15) * 
                Math.pow(1 / volumeRatio, gamma - 1) - 273.15;
        } else {
            // 极限压缩
            this.currentPressure = this.maxPressure;
            this.currentTemperature = this.maxTemperature;
        }
        
        // 限制最大值
        this.currentPressure = Math.min(this.currentPressure, this.maxPressure);
        this.currentTemperature = Math.min(this.currentTemperature, this.maxTemperature);
        
        // 显示压缩空气效果
        if (compressionRatio > 0.3) {
            this.compressedAir.style.opacity = Math.min(0.8, compressionRatio);
            this.compressedAir.classList.add('active');
        } else {
            this.compressedAir.style.opacity = '0';
            this.compressedAir.classList.remove('active');
        }
    }
    
    checkIgnition() {
        if (this.currentTemperature >= this.ignitionTemperature && !this.isBurning) {
            this.ignite();
        }
    }
    
    ignite() {
        this.isBurning = true;
        
        // 显示燃烧效果
        this.fireEffect.style.opacity = '1';
        this.fireEffect.classList.add('burning');
        this.nitrocellulose.classList.add('burning');
        
        // 更新状态
        this.statusDisplay.textContent = '🔥 硝化棉燃烧中！温度已达到燃点！';
        this.statusDisplay.className = 'status-text burning';
        
        // 添加燃烧提示
        this.showBurningAlert();
        
        // 燃烧粒子效果
        this.playBurningEffect();
    }
    
    showBurningAlert() {
        // 创建燃烧提示效果
        console.log('🔥 燃烧效果触发！温度达到160°C');
        
        // 页面震动效果（如果支持）
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
        
        // 临时改变页面背景色提示燃烧
        document.body.style.transition = 'background-color 0.3s ease';
        const originalBg = document.body.style.background;
        document.body.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
        
        setTimeout(() => {
            document.body.style.background = originalBg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 1000);
    }
    
    playBurningEffect() {
        // 创建燃烧粒子效果
        const particles = [];
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 80);
        }
    }
    
    createParticle() {
        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        particle.setAttribute('cx', 100 + (Math.random() - 0.5) * 20);
        particle.setAttribute('cy', 340);
        particle.setAttribute('r', Math.random() * 3 + 1);
        particle.setAttribute('fill', `hsl(${Math.random() * 60 + 10}, 100%, 50%)`);
        particle.setAttribute('opacity', '0.8');
        
        document.querySelector('.glass-tube').appendChild(particle);
        
        // 动画粒子上升
        let y = 340;
        let opacity = 0.8;
        const animate = () => {
            y -= 2;
            opacity -= 0.02;
            particle.setAttribute('cy', y);
            particle.setAttribute('opacity', opacity);
            
            if (opacity > 0 && y > 200) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        requestAnimationFrame(animate);
    }
    
    updateDisplay() {
        // 更新温度显示
        this.temperatureDisplay.textContent = Math.round(this.currentTemperature || this.initialTemperature);
        const tempPercentage = Math.min(100, ((this.currentTemperature || this.initialTemperature) / this.maxTemperature) * 100);
        this.temperatureFill.style.width = `${tempPercentage}%`;
        
        // 温度条颜色变化
        if (this.currentTemperature >= this.ignitionTemperature) {
            this.temperatureFill.classList.add('very-hot');
        } else if (this.currentTemperature >= 100) {
            this.temperatureFill.classList.add('hot');
        } else {
            this.temperatureFill.classList.remove('hot', 'very-hot');
        }
        
        // 更新压力显示
        this.pressureDisplay.textContent = (this.currentPressure || this.initialPressure).toFixed(1);
        const pressurePercentage = Math.min(100, ((this.currentPressure || this.initialPressure) / this.maxPressure) * 100);
        this.pressureFill.style.width = `${pressurePercentage}%`;
        
        // 更新状态显示
        if (!this.isBurning) {
            if (this.currentPistonY > 50) {
                this.statusDisplay.textContent = '🔄 正在压缩空气...';
                this.statusDisplay.className = 'status-text compressing';
            } else {
                this.statusDisplay.textContent = '✅ 准备就绪';
                this.statusDisplay.className = 'status-text';
            }
        }
    }
    
    reset() {
        // 重置所有状态
        this.currentPistonY = 0;
        this.currentTemperature = this.initialTemperature;
        this.currentPressure = this.initialPressure;
        this.isBurning = false;
        
        // 重置UI
        this.updatePistonPosition();
        this.fireEffect.style.opacity = '0';
        this.fireEffect.classList.remove('burning');
        this.nitrocellulose.classList.remove('burning');
        this.compressedAir.style.opacity = '0';
        this.compressedAir.classList.remove('active');
        
        // 清除粒子效果
        const particles = document.querySelectorAll('.glass-tube circle:not(#nitrocellulose)');
        particles.forEach(particle => particle.remove());
        
        // 重置显示
        this.updateDisplay();
        
        // 重置状态文本
        this.statusDisplay.textContent = '✅ 实验已重置';
        this.statusDisplay.className = 'status-text';
        
        setTimeout(() => {
            this.statusDisplay.textContent = '✅ 准备就绪';
        }, 1000);
    }
}

// 页面加载完成后初始化实验
document.addEventListener('DOMContentLoaded', () => {
    new NitrocelluloseExperiment();
    
    // 添加一些提示信息
    console.log('🔬 硝化棉压缩燃烧实验模拟器已加载');
    console.log('💡 拖拽活塞向下压缩空气，观察温度变化');
    console.log('🔥 当温度达到160°C时，硝化棉将会燃烧');
});

// 添加键盘快捷键支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        document.getElementById('reset-btn').click();
    }
});

// 防止页面滚动干扰拖拽
document.addEventListener('touchmove', (e) => {
    if (e.target.closest('#piston')) {
        e.preventDefault();
    }
}, { passive: false });