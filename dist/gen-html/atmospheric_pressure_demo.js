class AtmosphericPressureDemo {
    constructor() {
        this.isBlowing = true;
        this.animationId = null;
        this.arrows = [];
        this.windSpeed = 15.2;
        this.userWindSpeed = 15.2; // 用户设定的风速
        this.windDirection = 'horizontal'; // 风向: horizontal, vertical-down, vertical-up, diagonal
        this.paperDistance = 100; // 两张纸之间的距离
        this.originalPaper1X = 280;
        this.originalPaper2X = 380;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createAirflowArrows();
        this.startAnimation();
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('toggle-wind');
        const resetBtn = document.getElementById('reset-experiment');
        const windSlider = document.getElementById('wind-speed-slider');
        const windSpeedValue = document.getElementById('wind-speed-value');

        toggleBtn.addEventListener('click', () => this.toggleWind());
        resetBtn.addEventListener('click', () => this.resetExperiment());
        
        // 风速滑块控制
        windSlider.addEventListener('input', (e) => {
            this.userWindSpeed = parseFloat(e.target.value);
            windSpeedValue.textContent = this.userWindSpeed.toFixed(1);
            this.updateExperimentBasedOnWindSpeed();
        });
        
        // 滑块视觉反馈
        windSlider.addEventListener('mousedown', () => {
            windSlider.style.transform = 'scale(1.02)';
        });
        
        windSlider.addEventListener('mouseup', () => {
            windSlider.style.transform = 'scale(1)';
        });
        
        // 风向按钮控制
        const directionBtns = document.querySelectorAll('.direction-btn');
        directionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeWindDirection(e.target.dataset.direction);
                // 更新按钮状态
                directionBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    // 根据风速更新实验效果
    updateExperimentBasedOnWindSpeed() {
        // 更新箭头颜色和密度
        this.arrows.forEach((arrow, index) => {
            if (this.userWindSpeed < 5) {
                arrow.element.setAttribute('fill', '#a8d5f2'); // 低风速 - 浅蓝色
            } else if (this.userWindSpeed < 15) {
                arrow.element.setAttribute('fill', '#4a90e2'); // 中风速 - 蓝色
            } else {
                arrow.element.setAttribute('fill', '#e74c3c'); // 高风速 - 红色
            }
        });
        
        // 更新滑块颜色
        const slider = document.getElementById('wind-speed-slider');
        if (this.userWindSpeed < 8) {
            slider.style.background = 'linear-gradient(to right, #e9ecef 0%, #17a2b8 50%, #17a2b8 100%)';
        } else if (this.userWindSpeed < 18) {
            slider.style.background = 'linear-gradient(to right, #e9ecef 0%, #ffc107 50%, #dc3545 100%)';
        } else {
            slider.style.background = 'linear-gradient(to right, #ffc107 0%, #dc3545 50%, #dc3545 100%)';
        }
    }

    changeWindDirection(direction) {
        this.windDirection = direction;
        console.log('Wind direction changed to:', direction);
        
        // 重新创建箭头以适应新方向
        this.createAirflowArrows();
        
        // 更新吹风管道的方向
        this.updateBlowpipeDirection();
        
        // 立即更新纸张效果
        this.animatePapers();
    }

    updateBlowpipeDirection() {
        const blowpipe = document.getElementById('blowpipe');
        
        switch(this.windDirection) {
            case 'horizontal':
                blowpipe.setAttribute('d', 'M 100 180 Q 180 160 250 200');
                break;
            case 'vertical-down':
                blowpipe.setAttribute('d', 'M 300 50 Q 320 100 300 150');
                break;
            case 'vertical-up':
                blowpipe.setAttribute('d', 'M 300 350 Q 320 300 300 250');
                break;
            case 'diagonal':
                blowpipe.setAttribute('d', 'M 150 120 Q 200 150 280 180');
                break;
        }
    }

    createAirflowArrows() {
        const svg = document.getElementById('experiment-svg');
        const arrowContainer = document.getElementById('airflow-arrows');
        
        // 清除现有箭头
        arrowContainer.innerHTML = '';
        this.arrows = [];

        // 根据风向创建不同的箭头位置
        let arrowPositions = [];
        
        switch(this.windDirection) {
            case 'horizontal':
                arrowPositions = [
                    {x: 260, y: 180}, {x: 280, y: 190}, {x: 300, y: 185},
                    {x: 320, y: 195}, {x: 340, y: 180}, {x: 360, y: 190},
                    {x: 380, y: 185}, {x: 400, y: 195}, {x: 420, y: 180},
                    {x: 270, y: 220}, {x: 310, y: 230}, {x: 350, y: 225},
                    {x: 390, y: 235}, {x: 280, y: 250}, {x: 320, y: 260},
                    {x: 360, y: 255}, {x: 400, y: 265}
                ];
                break;
            case 'vertical-down':
                arrowPositions = [
                    {x: 280, y: 120}, {x: 300, y: 130}, {x: 320, y: 125},
                    {x: 340, y: 135}, {x: 360, y: 130}, {x: 380, y: 140},
                    {x: 290, y: 150}, {x: 310, y: 160}, {x: 330, y: 155},
                    {x: 350, y: 165}, {x: 370, y: 160}, {x: 285, y: 180},
                    {x: 315, y: 190}, {x: 345, y: 185}, {x: 375, y: 195}
                ];
                break;
            case 'vertical-up':
                arrowPositions = [
                    {x: 280, y: 280}, {x: 300, y: 270}, {x: 320, y: 275},
                    {x: 340, y: 265}, {x: 360, y: 270}, {x: 380, y: 260},
                    {x: 290, y: 250}, {x: 310, y: 240}, {x: 330, y: 245},
                    {x: 350, y: 235}, {x: 370, y: 240}, {x: 285, y: 220},
                    {x: 315, y: 210}, {x: 345, y: 215}, {x: 375, y: 205}
                ];
                break;
            case 'diagonal':
                arrowPositions = [
                    {x: 250, y: 160}, {x: 270, y: 170}, {x: 290, y: 180},
                    {x: 310, y: 190}, {x: 330, y: 200}, {x: 350, y: 210},
                    {x: 370, y: 220}, {x: 260, y: 190}, {x: 280, y: 200},
                    {x: 300, y: 210}, {x: 320, y: 220}, {x: 340, y: 230},
                    {x: 360, y: 240}, {x: 270, y: 220}, {x: 290, y: 230}
                ];
                break;
        }

        arrowPositions.forEach((pos, index) => {
            const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            // 根据风向设置箭头形状和方向
            let arrowPath = '';
            let rotation = 0;
            
            switch(this.windDirection) {
                case 'horizontal':
                    arrowPath = 'M 0 -2 L 8 0 L 0 2 L 0 -2';
                    rotation = 0;
                    break;
                case 'vertical-down':
                    arrowPath = 'M -2 0 L 0 8 L 2 0 L -2 0';
                    rotation = 0;
                    break;
                case 'vertical-up':
                    arrowPath = 'M -2 0 L 0 -8 L 2 0 L -2 0';
                    rotation = 0;
                    break;
                case 'diagonal':
                    arrowPath = 'M 0 -2 L 8 0 L 0 2 L 0 -2';
                    rotation = 45;
                    break;
            }
            
            arrow.setAttribute('d', arrowPath);
            arrow.setAttribute('fill', '#4a90e2');
            arrow.setAttribute('opacity', '0.7');
            arrow.setAttribute('transform', `translate(${pos.x}, ${pos.y}) rotate(${rotation})`);
            arrow.classList.add('arrow');
            
            arrowContainer.appendChild(arrow);
            this.arrows.push({
                element: arrow,
                x: pos.x,
                y: pos.y,
                baseX: pos.x,
                baseY: pos.y,
                speed: 2 + Math.random() * 2,
                delay: index * 100,
                rotation: rotation
            });
        });
    }

    animateArrows() {
        if (!this.isBlowing) return;

        this.arrows.forEach((arrow, index) => {
            // 根据风速调整箭头移动速度
            const speedMultiplier = this.userWindSpeed / 15.2; // 以默认风速为基准
            let moveSpeed = arrow.speed * speedMultiplier;
            
            // 根据风向调整箭头移动
            switch(this.windDirection) {
                case 'horizontal':
                    arrow.x += moveSpeed;
                    if (arrow.x > 450) {
                        arrow.x = arrow.baseX - 50;
                    }
                    break;
                case 'vertical-down':
                    arrow.y += moveSpeed;
                    if (arrow.y > 380) {
                        arrow.y = arrow.baseY - 50;
                    }
                    break;
                case 'vertical-up':
                    arrow.y -= moveSpeed;
                    if (arrow.y < 50) {
                        arrow.y = arrow.baseY + 50;
                    }
                    break;
                case 'diagonal':
                    arrow.x += moveSpeed * 0.7;
                    arrow.y += moveSpeed * 0.7;
                    if (arrow.x > 420 || arrow.y > 350) {
                        arrow.x = arrow.baseX - 30;
                        arrow.y = arrow.baseY - 30;
                    }
                    break;
            }

            // 根据风速调整波动幅度
            const time = Date.now() / 1000;
            const waveAmplitude = Math.max(1, speedMultiplier * 3);
            let waveX = 0, waveY = 0;
            
            if (this.windDirection === 'horizontal') {
                waveY = Math.sin(time * 2 + index * 0.5) * waveAmplitude;
            } else if (this.windDirection === 'vertical-down' || this.windDirection === 'vertical-up') {
                waveX = Math.sin(time * 2 + index * 0.5) * waveAmplitude;
            } else if (this.windDirection === 'diagonal') {
                waveX = Math.sin(time * 2 + index * 0.5) * (waveAmplitude * 0.7);
                waveY = Math.cos(time * 2 + index * 0.5) * (waveAmplitude * 0.7);
            }
            
            arrow.element.setAttribute('transform', 
                `translate(${arrow.x + waveX}, ${arrow.y + waveY}) rotate(${arrow.rotation})`);
            
            // 根据风速调整箭头透明度
            const opacity = Math.min(0.9, 0.3 + speedMultiplier * 0.4);
            arrow.element.setAttribute('opacity', opacity);
            // 控制箭头可见性
            if (this.isBlowing && this.userWindSpeed > 0) {
                arrow.element.classList.add('visible');
            }
        });
    }

    animatePapers() {
        const paper1 = document.getElementById('paper1');
        const paper2 = document.getElementById('paper2');
        
        if (this.isBlowing && this.userWindSpeed > 0) {
            // 根据风速调整纸张靠近程度
            const speedFactor = this.userWindSpeed / 15.2;
            let paper1Transform = '';
            let paper2Transform = '';
            
            switch(this.windDirection) {
                case 'horizontal':
                    // 纸张向中间靠拢
                    const maxMoveDistance = 25;
                    const moveDistance = Math.min(maxMoveDistance, 5 + speedFactor * 15);
                    const rotationAngle = Math.min(8, speedFactor * 5);
                    paper1Transform = `translate(${this.originalPaper1X + moveDistance}, 150) rotate(${rotationAngle})`;
                    paper2Transform = `translate(${this.originalPaper2X - moveDistance}, 150) rotate(-${rotationAngle})`;
                    break;
                case 'vertical-down':
                    // 纸张向下弯曲
                    const downMove = Math.min(10, speedFactor * 8);
                    const downSkew = Math.min(10, speedFactor * 8);
                    paper1Transform = `translate(${this.originalPaper1X}, ${150 + downMove}) rotate(0) skewX(${downSkew})`;
                    paper2Transform = `translate(${this.originalPaper2X}, ${150 + downMove}) rotate(0) skewX(-${downSkew})`;
                    break;
                case 'vertical-up':
                    // 纸张向上弯曲
                    const upMove = Math.min(10, speedFactor * 8);
                    const upSkew = Math.min(10, speedFactor * 8);
                    paper1Transform = `translate(${this.originalPaper1X}, ${150 - upMove}) rotate(0) skewX(-${upSkew})`;
                    paper2Transform = `translate(${this.originalPaper2X}, ${150 - upMove}) rotate(0) skewX(${upSkew})`;
                    break;
                case 'diagonal':
                    // 纸张斜向倾斜
                    const diagMove = Math.min(15, speedFactor * 10);
                    const diagRotation = Math.min(12, speedFactor * 8);
                    paper1Transform = `translate(${this.originalPaper1X + diagMove}, ${150 + diagMove}) rotate(${diagRotation})`;
                    paper2Transform = `translate(${this.originalPaper2X - diagMove}, ${150 + diagMove}) rotate(-${diagRotation})`;
                    break;
            }
            
            paper1.setAttribute('transform', paper1Transform);
            paper2.setAttribute('transform', paper2Transform);
        } else {
            // 恢复原位
            paper1.setAttribute('transform', `translate(${this.originalPaper1X}, 150) rotate(0)`);
            paper2.setAttribute('transform', `translate(${this.originalPaper2X}, 150) rotate(0)`);
        }
    }

    updateWindSpeed() {
        if (this.isBlowing && this.userWindSpeed > 0) {
            // 根据用户设定的风速添加小幅波动
            const variation = Math.sin(Date.now() / 1000) * 0.3;
            this.windSpeed = this.userWindSpeed + variation;
        } else {
            this.windSpeed = 0;
        }
        
        document.getElementById('wind-speed').textContent = 
            `风速: ${this.windSpeed.toFixed(1)} m/s`;
            
        // 更新SVG中的风速显示
        const svgWindSpeed = document.querySelector('#experiment-svg text:last-of-type');
        if (svgWindSpeed) {
            svgWindSpeed.textContent = `${this.windSpeed.toFixed(1)} m/s`;
        }
    }

    startAnimation() {
        const animate = () => {
            this.animateArrows();
            this.animatePapers();
            this.updateWindSpeed();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    toggleWind() {
        this.isBlowing = !this.isBlowing;
        const toggleBtn = document.getElementById('toggle-wind');
        
        if (this.isBlowing) {
            toggleBtn.innerHTML = '<span class="btn-icon">⏸️</span> 停止吹风';
            toggleBtn.className = 'btn btn-primary';
            
            // 显示箭头
            this.arrows.forEach(arrow => {
                arrow.element.classList.add('visible');
            });
        } else {
            toggleBtn.innerHTML = '<span class="btn-icon">▶️</span> 开始吹风';
            toggleBtn.className = 'btn btn-secondary';
            
            // 隐藏箭头
            this.arrows.forEach(arrow => {
                arrow.element.classList.remove('visible');
            });
        }
    }

    resetExperiment() {
        // 重置所有状态
        this.isBlowing = true;
        this.userWindSpeed = 15.2;
        this.windSpeed = 15.2;
        this.windDirection = 'horizontal';
        
        // 重置风速滑块
        const windSlider = document.getElementById('wind-speed-slider');
        const windSpeedValue = document.getElementById('wind-speed-value');
        windSlider.value = 15.2;
        windSpeedValue.textContent = '15.2';
        
        // 重置风向按钮
        const directionBtns = document.querySelectorAll('.direction-btn');
        directionBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-direction="horizontal"]').classList.add('active');
        
        // 重置按钮状态
        const toggleBtn = document.getElementById('toggle-wind');
        toggleBtn.innerHTML = '<span class="btn-icon">⏸️</span> 停止吹风';
        toggleBtn.className = 'btn btn-primary';
        
        // 重置吹风管道
        this.updateBlowpipeDirection();
        
        // 重新创建箭头
        this.createAirflowArrows();
        
        // 重置滑块颜色
        windSlider.style.background = 'linear-gradient(to right, #e9ecef 0%, #17a2b8 50%, #dc3545 100%)';
        
        // 重置纸张位置
        this.animatePapers();
        
        // 更新风速显示
        this.updateWindSpeed();
        
        // 添加重置动画效果
        const demoCard = document.querySelector('.demo-card');
        demoCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            demoCard.style.transform = 'scale(1)';
        }, 150);
    }
}

// 页面加载完成后初始化演示
document.addEventListener('DOMContentLoaded', () => {
    new AtmosphericPressureDemo();
    
    // 添加页面加载动画
    const cards = document.querySelectorAll('.theory-card, .demo-section');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// 添加鼠标悬停效果
document.addEventListener('DOMContentLoaded', () => {
    const experimentArea = document.querySelector('.experiment-area');
    const papers = document.querySelectorAll('#paper1, #paper2');
    
    experimentArea.addEventListener('mouseenter', () => {
        papers.forEach(paper => {
            paper.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))';
        });
    });
    
    experimentArea.addEventListener('mouseleave', () => {
        papers.forEach(paper => {
            paper.style.filter = 'none';
        });
    });
});

// 添加键盘快捷键支持
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        document.getElementById('toggle-wind').click();
    } else if (e.code === 'KeyR') {
        e.preventDefault();
        document.getElementById('reset-experiment').click();
    } else if (e.code === 'Digit1') {
        e.preventDefault();
        document.querySelector('[data-direction="horizontal"]').click();
    } else if (e.code === 'Digit2') {
        e.preventDefault();
        document.querySelector('[data-direction="vertical-down"]').click();
    } else if (e.code === 'Digit3') {
        e.preventDefault();
        document.querySelector('[data-direction="vertical-up"]').click();
    } else if (e.code === 'Digit4') {
        e.preventDefault();
        document.querySelector('[data-direction="diagonal"]').click();
    } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        const slider = document.getElementById('wind-speed-slider');
        const newValue = Math.min(25, parseFloat(slider.value) + 1);
        slider.value = newValue;
        slider.dispatchEvent(new Event('input'));
    } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        const slider = document.getElementById('wind-speed-slider');
        const newValue = Math.max(0, parseFloat(slider.value) - 1);
        slider.value = newValue;
        slider.dispatchEvent(new Event('input'));
    }
});

// 响应式调整
window.addEventListener('resize', () => {
    // 在移动设备上调整SVG视窗
    const svg = document.getElementById('experiment-svg');
    const container = svg.parentElement;
    const containerWidth = container.clientWidth;
    
    if (containerWidth < 500) {
        svg.setAttribute('viewBox', '50 0 500 400');
    } else {
        svg.setAttribute('viewBox', '0 0 600 400');
    }
});