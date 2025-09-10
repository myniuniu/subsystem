// 并联电路教学动画 - 完全重新设计
class ParallelCircuitDemo {
    constructor() {
        this.isOn = false;
        this.animationRunning = false;
        this.currentAnimationId = null;
        
        // 新的电流路径定义
        this.currentPaths = {
            'battery-to-switch': {
                indicators: [],
                delay: 100
            },
            'switch-to-junction': {
                indicators: [],
                delay: 100
            },
            'junction-to-bulb1': {
                indicators: [],
                delay: 100
            },
            'junction-to-bulb2': {
                indicators: [],
                delay: 100
            },
            'bulb2-horizontal': {
                indicators: [],
                delay: 100
            },
            'bulb1-return': {
                indicators: [],
                delay: 100
            },
            'bulb2-return': {
                indicators: [],
                delay: 100
            },
            'return-to-battery': {
                indicators: [],
                delay: 100
            },
            'battery-negative': {
                indicators: [],
                delay: 100
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeCurrentIndicators();
        this.updateDisplay();
    }
    
    bindEvents() {
        const toggleBtn = document.querySelector('.toggle-btn');
        const resetBtn = document.querySelector('.reset-btn');
        const switchElement = document.querySelector('.switch');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleCircuit());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetCircuit());
        }
        
        if (switchElement) {
            switchElement.addEventListener('click', () => this.toggleCircuit());
        }
    }
    
    initializeCurrentIndicators() {
        // 收集所有电流指示器
        Object.keys(this.currentPaths).forEach(pathName => {
            const indicators = document.querySelectorAll(`.current-indicator.${pathName}`);
            this.currentPaths[pathName].indicators = Array.from(indicators);
        });
    }
    
    toggleCircuit() {
        this.isOn = !this.isOn;
        this.updateDisplay();
        
        if (this.isOn) {
            this.startCurrentAnimation();
        } else {
            this.stopCurrentAnimation();
        }
    }
    
    resetCircuit() {
        this.isOn = false;
        this.stopCurrentAnimation();
        this.updateDisplay();
    }
    
    updateDisplay() {
        // 更新状态指示器
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            statusIndicator.textContent = this.isOn ? '电路已闭合' : '电路已断开';
            statusIndicator.className = `status-indicator ${this.isOn ? 'on' : 'off'}`;
        }
        
        // 更新开关状态
        const switchElement = document.querySelector('.switch');
        if (switchElement) {
            switchElement.className = `switch ${this.isOn ? 'closed' : 'open'}`;
        }
        
        // 更新灯泡状态
        const bulbs = document.querySelectorAll('.bulb');
        bulbs.forEach(bulb => {
            if (this.isOn) {
                bulb.classList.add('on');
            } else {
                bulb.classList.remove('on');
            }
        });
        
        // 更新线路状态
        const wires = document.querySelectorAll('.wire');
        wires.forEach(wire => {
            if (this.isOn) {
                wire.classList.add('active');
            } else {
                wire.classList.remove('active');
            }
        });
        
        // 更新按钮文本
        const toggleBtn = document.querySelector('.toggle-btn');
        if (toggleBtn) {
            const btnText = toggleBtn.querySelector('span');
            if (btnText) {
                btnText.textContent = this.isOn ? '断开电路' : '闭合电路';
            }
        }
    }
    
    startCurrentAnimation() {
        if (this.animationRunning) {
            this.stopCurrentAnimation();
        }
        
        this.animationRunning = true;
        this.animateCurrentFlow();
    }
    
    stopCurrentAnimation() {
        this.animationRunning = false;
        
        if (this.currentAnimationId) {
            clearTimeout(this.currentAnimationId);
            this.currentAnimationId = null;
        }
        
        // 清除所有电流指示器
        document.querySelectorAll('.current-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
    }
    
    animateCurrentFlow() {
        if (!this.isOn || !this.animationRunning) {
            return;
        }
        
        // 定义动画序列
        const animationSequence = [
            { path: 'battery-to-switch', duration: 1500 },
            { path: 'switch-to-junction', duration: 1000 },
            { 
                // 并行动画 - 两个分支同时进行
                parallel: [
                    { path: 'junction-to-bulb1', duration: 1000 },
                    [
                        { path: 'junction-to-bulb2', duration: 1000 },
                        { path: 'bulb2-horizontal', duration: 800 }
                    ]
                ]
            },
            {
                // 并行返回动画
                parallel: [
                    { path: 'bulb1-return', duration: 1500 },
                    { path: 'bulb2-return', duration: 1500 }
                ]
            },
            { path: 'return-to-battery', duration: 1500 },
            { path: 'battery-negative', duration: 800 }
        ];
        
        this.executeAnimationSequence(animationSequence, 0);
    }
    
    executeAnimationSequence(sequence, index) {
        if (!this.isOn || !this.animationRunning || index >= sequence.length) {
            // 动画完成，重新开始
            if (this.isOn && this.animationRunning) {
                this.currentAnimationId = setTimeout(() => {
                    this.animateCurrentFlow();
                }, 500); // 短暂停顿后重新开始
            }
            return;
        }
        
        const currentStep = sequence[index];
        
        if (currentStep.parallel) {
            // 并行执行多个路径
            const promises = currentStep.parallel.map(step => 
                this.animatePathWithPromise(step.path, step.duration)
            );
            
            Promise.all(promises).then(() => {
                this.executeAnimationSequence(sequence, index + 1);
            });
        } else {
            // 单个路径执行
            this.animatePathWithPromise(currentStep.path, currentStep.duration)
                .then(() => {
                    this.executeAnimationSequence(sequence, index + 1);
                });
        }
    }
    
    animatePathWithPromise(pathName, duration) {
        return new Promise((resolve) => {
            if (!this.isOn || !this.animationRunning) {
                resolve();
                return;
            }
            
            const path = this.currentPaths[pathName];
            if (!path || !path.indicators.length) {
                resolve();
                return;
            }
            
            const indicators = path.indicators;
            const stepDelay = duration / indicators.length;
            
            let currentIndex = 0;
            
            const animateStep = () => {
                if (!this.isOn || !this.animationRunning || currentIndex >= indicators.length) {
                    resolve();
                    return;
                }
                
                // 激活当前指示器
                const currentIndicator = indicators[currentIndex];
                if (currentIndicator) {
                    currentIndicator.classList.add('active');
                    
                    // 在一定时间后移除激活状态
                    setTimeout(() => {
                        if (currentIndicator) {
                            currentIndicator.classList.remove('active');
                        }
                    }, stepDelay * 2);
                }
                
                currentIndex++;
                
                if (currentIndex < indicators.length) {
                    setTimeout(animateStep, stepDelay);
                } else {
                    // 路径动画完成
                    setTimeout(resolve, stepDelay);
                }
            };
            
            animateStep();
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ParallelCircuitDemo();
});

// 导出类以便在其他地方使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParallelCircuitDemo;
}