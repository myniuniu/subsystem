// 化学实验演示教学 JavaScript
class ChemistryDemo {
    constructor() {
        this.canvas = document.getElementById('chemistryCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.isPaused = false;
        this.animationId = null;
        this.startTime = 0;
        this.currentTime = 0;
        
        // 实验参数
        this.experimentType = 'acid_base';
        this.reactantA = 'HCl';
        this.reactantB = 'NaOH';
        this.concentrationA = 1.0;
        this.concentrationB = 1.0;
        this.temperature = 25;
        this.pH = 7.0;
        this.reactionRate = 1.0;
        
        // 反应状态
        this.progress = 0;
        this.productConcentration = 0;
        this.heatChange = 0;
        
        // 分子动画
        this.molecules = [];
        this.products = [];
        
        // 实验装置
        this.beaker = {
            x: 200,
            y: 150,
            width: 120,
            height: 180,
            liquidLevel: 0
        };
        
        this.initializeControls();
        this.setupCanvas();
        this.initializeMolecules();
        this.updateDisplay();
        this.render();
    }
    
    initializeControls() {
        // 实验类型选择
        document.getElementById('experimentType').addEventListener('change', (e) => {
            this.experimentType = e.target.value;
            this.updateReactionEquation();
            this.reset();
        });
        
        // 反应物选择
        document.getElementById('reactantA').addEventListener('change', (e) => {
            this.reactantA = e.target.value;
            this.updateReactionEquation();
            this.initializeMolecules();
        });
        
        document.getElementById('reactantB').addEventListener('change', (e) => {
            this.reactantB = e.target.value;
            this.updateReactionEquation();
            this.initializeMolecules();
        });
        
        // 浓度控制
        document.getElementById('concentrationA').addEventListener('input', (e) => {
            this.concentrationA = parseFloat(e.target.value);
            document.getElementById('concentrationAValue').textContent = `${this.concentrationA.toFixed(1)} mol/L`;
            this.initializeMolecules();
        });
        
        document.getElementById('concentrationB').addEventListener('input', (e) => {
            this.concentrationB = parseFloat(e.target.value);
            document.getElementById('concentrationBValue').textContent = `${this.concentrationB.toFixed(1)} mol/L`;
            this.initializeMolecules();
        });
        
        // 实验条件
        document.getElementById('temperature').addEventListener('input', (e) => {
            this.temperature = parseFloat(e.target.value);
            document.getElementById('temperatureValue').textContent = `${this.temperature}°C`;
            this.updateReactionRate();
        });
        
        document.getElementById('pH').addEventListener('input', (e) => {
            this.pH = parseFloat(e.target.value);
            document.getElementById('pHValue').textContent = this.pH.toFixed(1);
        });
        
        document.getElementById('reactionRate').addEventListener('input', (e) => {
            this.reactionRate = parseFloat(e.target.value);
            document.getElementById('reactionRateValue').textContent = `${this.reactionRate.toFixed(1)}x`;
        });
        
        // 控制按钮
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('stepBtn').addEventListener('click', () => this.step());
        
        // 视图控制
        document.getElementById('zoomIn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOut').addEventListener('click', () => this.zoomOut());
        document.getElementById('resetView').addEventListener('click', () => this.resetView());
        
        // 步骤点击
        document.querySelectorAll('.step').forEach((step, index) => {
            step.addEventListener('click', () => this.setActiveStep(index + 1));
        });
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        this.scale = 1.0;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    
    initializeMolecules() {
        this.molecules = [];
        this.products = [];
        
        // 根据浓度生成分子
        const numMoleculesA = Math.floor(this.concentrationA * 20);
        const numMoleculesB = Math.floor(this.concentrationB * 20);
        
        // 生成反应物A的分子
        for (let i = 0; i < numMoleculesA; i++) {
            this.molecules.push({
                type: this.reactantA,
                x: Math.random() * 80 + 160,
                y: Math.random() * 100 + 200,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                color: this.getMoleculeColor(this.reactantA),
                reacted: false
            });
        }
        
        // 生成反应物B的分子
        for (let i = 0; i < numMoleculesB; i++) {
            this.molecules.push({
                type: this.reactantB,
                x: Math.random() * 80 + 260,
                y: Math.random() * 100 + 200,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                color: this.getMoleculeColor(this.reactantB),
                reacted: false
            });
        }
    }
    
    getMoleculeColor(moleculeType) {
        const colors = {
            'HCl': '#ff6b6b',
            'NaOH': '#74b9ff',
            'AgNO3': '#a29bfe',
            'NaCl': '#fdcb6e',
            'H2O': '#00cec9',
            'AgCl': '#ddd'
        };
        return colors[moleculeType] || '#95a5a6';
    }
    
    updateReactionEquation() {
        const equations = {
            'acid_base': `${this.reactantA} + ${this.reactantB} → NaCl + H₂O`,
            'precipitation': `AgNO₃ + NaCl → AgCl↓ + NaNO₃`,
            'redox': `Zn + CuSO₄ → ZnSO₄ + Cu`,
            'gas_evolution': `CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑`,
            'crystallization': `NaCl(aq) → NaCl(s)`,
            'titration': `HCl + NaOH → NaCl + H₂O`
        };
        
        const reactionTypes = {
            'acid_base': '酸碱中和反应',
            'precipitation': '沉淀反应',
            'redox': '氧化还原反应',
            'gas_evolution': '气体产生反应',
            'crystallization': '结晶过程',
            'titration': '滴定反应'
        };
        
        const energyChanges = {
            'acid_base': 'ΔH = -57.3 kJ/mol',
            'precipitation': 'ΔH = -65.5 kJ/mol',
            'redox': 'ΔH = -217.1 kJ/mol',
            'gas_evolution': 'ΔH = +178.3 kJ/mol',
            'crystallization': 'ΔH = -3.9 kJ/mol',
            'titration': 'ΔH = -57.3 kJ/mol'
        };
        
        document.getElementById('chemicalEquation').textContent = equations[this.experimentType];
        document.querySelector('.reaction-type').textContent = reactionTypes[this.experimentType];
        document.querySelector('.energy-change').textContent = energyChanges[this.experimentType];
    }
    
    updateReactionRate() {
        // 温度对反应速率的影响（阿伦尼乌斯方程简化）
        const baseRate = this.reactionRate;
        const tempFactor = Math.exp((this.temperature - 25) / 10);
        this.effectiveRate = baseRate * tempFactor;
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            this.startTime = Date.now();
            this.updateReactionRate();
            this.animate();
            
            document.getElementById('startBtn').classList.add('active');
            this.setActiveStep(3);
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isPaused = !this.isPaused;
            if (!this.isPaused) {
                this.animate();
            }
        }
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // 重置反应状态
        this.progress = 0;
        this.productConcentration = 0;
        this.heatChange = 0;
        this.currentTime = 0;
        
        this.initializeMolecules();
        this.updateDisplay();
        this.render();
        
        document.getElementById('startBtn').classList.remove('active');
        this.setActiveStep(1);
    }
    
    step() {
        if (!this.isRunning) {
            this.updateReaction(1.0); // 1秒步长
            this.updateDisplay();
            this.render();
        }
    }
    
    animate() {
        if (!this.isRunning || this.isPaused) return;
        
        const deltaTime = 0.1; // 0.1秒
        this.updateReaction(deltaTime);
        this.updateMolecules(deltaTime);
        this.updateDisplay();
        this.render();
        
        // 检查反应完成
        if (this.progress >= 100) {
            this.setActiveStep(4);
            setTimeout(() => this.reset(), 3000);
            return;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateReaction(deltaTime) {
        this.currentTime += deltaTime;
        
        // 更新反应进度
        const progressIncrement = this.effectiveRate * deltaTime * 2;
        this.progress = Math.min(100, this.progress + progressIncrement);
        
        // 计算产物浓度
        const minConcentration = Math.min(this.concentrationA, this.concentrationB);
        this.productConcentration = (this.progress / 100) * minConcentration;
        
        // 计算热量变化
        this.heatChange = this.productConcentration * this.getReactionEnthalpy();
        
        // 更新pH值（对于酸碱反应）
        if (this.experimentType === 'acid_base' || this.experimentType === 'titration') {
            this.updatePH();
        }
    }
    
    getReactionEnthalpy() {
        const enthalpies = {
            'acid_base': -57.3,
            'precipitation': -65.5,
            'redox': -217.1,
            'gas_evolution': 178.3,
            'crystallization': -3.9,
            'titration': -57.3
        };
        return enthalpies[this.experimentType] || 0;
    }
    
    updatePH() {
        // 简化的pH计算
        if (this.reactantA === 'HCl' && this.reactantB === 'NaOH') {
            const excessAcid = this.concentrationA - this.productConcentration;
            const excessBase = this.concentrationB - this.productConcentration;
            
            if (Math.abs(excessAcid - excessBase) < 0.01) {
                this.pH = 7.0; // 中性点
            } else if (excessAcid > excessBase) {
                this.pH = Math.max(1, 7 - Math.log10(excessAcid));
            } else {
                this.pH = Math.min(13, 7 + Math.log10(excessBase));
            }
            
            document.getElementById('pHValue').textContent = this.pH.toFixed(1);
        }
    }
    
    updateMolecules(deltaTime) {
        // 更新分子位置和碰撞检测
        this.molecules.forEach(molecule => {
            if (!molecule.reacted) {
                // 布朗运动
                molecule.x += molecule.vx * deltaTime * 10;
                molecule.y += molecule.vy * deltaTime * 10;
                
                // 边界碰撞
                if (molecule.x < this.beaker.x + 10 || molecule.x > this.beaker.x + this.beaker.width - 10) {
                    molecule.vx *= -1;
                }
                if (molecule.y < this.beaker.y + 50 || molecule.y > this.beaker.y + this.beaker.height - 10) {
                    molecule.vy *= -1;
                }
                
                // 随机速度变化（模拟热运动）
                molecule.vx += (Math.random() - 0.5) * 0.1;
                molecule.vy += (Math.random() - 0.5) * 0.1;
                
                // 限制速度
                const maxSpeed = 3;
                const speed = Math.sqrt(molecule.vx * molecule.vx + molecule.vy * molecule.vy);
                if (speed > maxSpeed) {
                    molecule.vx = (molecule.vx / speed) * maxSpeed;
                    molecule.vy = (molecule.vy / speed) * maxSpeed;
                }
            }
        });
        
        // 反应概率检测
        if (this.isRunning && Math.random() < this.effectiveRate * deltaTime * 0.1) {
            this.tryReaction();
        }
    }
    
    tryReaction() {
        const unreactedA = this.molecules.filter(m => m.type === this.reactantA && !m.reacted);
        const unreactedB = this.molecules.filter(m => m.type === this.reactantB && !m.reacted);
        
        if (unreactedA.length > 0 && unreactedB.length > 0) {
            const molA = unreactedA[Math.floor(Math.random() * unreactedA.length)];
            const molB = unreactedB[Math.floor(Math.random() * unreactedB.length)];
            
            // 检查距离
            const distance = Math.sqrt(
                Math.pow(molA.x - molB.x, 2) + Math.pow(molA.y - molB.y, 2)
            );
            
            if (distance < 20) {
                // 发生反应
                molA.reacted = true;
                molB.reacted = true;
                
                // 生成产物
                this.createProduct(molA.x, molA.y);
            }
        }
    }
    
    createProduct(x, y) {
        const productTypes = {
            'acid_base': ['NaCl', 'H2O'],
            'precipitation': ['AgCl', 'NaNO3'],
            'redox': ['ZnSO4', 'Cu'],
            'gas_evolution': ['CaCl2', 'H2O'],
            'crystallization': ['NaCl'],
            'titration': ['NaCl', 'H2O']
        };
        
        const products = productTypes[this.experimentType] || ['Product'];
        
        products.forEach((product, index) => {
            this.products.push({
                type: product,
                x: x + (index * 15),
                y: y,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                color: this.getMoleculeColor(product),
                age: 0
            });
        });
    }
    
    updateDisplay() {
        document.getElementById('progress').textContent = `${this.progress.toFixed(1)}%`;
        document.getElementById('productConcentration').textContent = `${this.productConcentration.toFixed(2)} mol/L`;
        document.getElementById('reactionTime').textContent = `${this.currentTime.toFixed(1)} s`;
        document.getElementById('heatChange').textContent = `${this.heatChange.toFixed(1)} kJ/mol`;
    }
    
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 应用变换
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(this.offsetX, this.offsetY);
        
        // 绘制实验装置
        this.drawApparatus();
        
        // 绘制分子
        this.drawMolecules();
        
        // 绘制产物
        this.drawProducts();
        
        // 绘制效果
        this.drawEffects();
        
        this.ctx.restore();
    }
    
    drawApparatus() {
        // 绘制烧杯
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.beaker.x, this.beaker.y + this.beaker.height);
        this.ctx.lineTo(this.beaker.x, this.beaker.y + 30);
        this.ctx.lineTo(this.beaker.x + 20, this.beaker.y);
        this.ctx.lineTo(this.beaker.x + this.beaker.width - 20, this.beaker.y);
        this.ctx.lineTo(this.beaker.x + this.beaker.width, this.beaker.y + 30);
        this.ctx.lineTo(this.beaker.x + this.beaker.width, this.beaker.y + this.beaker.height);
        this.ctx.stroke();
        
        // 绘制液体
        const liquidHeight = (this.progress / 100) * 120 + 40;
        this.ctx.fillStyle = this.getLiquidColor();
        this.ctx.globalAlpha = 0.6;
        this.ctx.fillRect(
            this.beaker.x + 5,
            this.beaker.y + this.beaker.height - liquidHeight,
            this.beaker.width - 10,
            liquidHeight - 5
        );
        this.ctx.globalAlpha = 1.0;
        
        // 绘制刻度
        this.ctx.strokeStyle = '#7f8c8d';
        this.ctx.lineWidth = 1;
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#2c3e50';
        
        for (let i = 0; i <= 5; i++) {
            const y = this.beaker.y + 50 + (i * 25);
            this.ctx.beginPath();
            this.ctx.moveTo(this.beaker.x - 10, y);
            this.ctx.lineTo(this.beaker.x, y);
            this.ctx.stroke();
            
            this.ctx.fillText(`${(5-i)*20}mL`, this.beaker.x - 40, y + 4);
        }
        
        // 绘制温度计
        this.drawThermometer();
        
        // 绘制pH指示器
        this.drawPHIndicator();
    }
    
    getLiquidColor() {
        const colors = {
            'acid_base': `hsl(${200 + this.progress}, 70%, 60%)`,
            'precipitation': '#ecf0f1',
            'redox': `hsl(${30 + this.progress}, 70%, 50%)`,
            'gas_evolution': `hsl(${120 + this.progress}, 60%, 70%)`,
            'crystallization': '#3498db',
            'titration': `hsl(${this.pH * 30}, 70%, 60%)`
        };
        return colors[this.experimentType] || '#3498db';
    }
    
    drawThermometer() {
        const x = this.beaker.x + this.beaker.width + 30;
        const y = this.beaker.y + 50;
        
        // 温度计主体
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.rect(x, y, 15, 100);
        this.ctx.stroke();
        
        // 温度计底部球体
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.arc(x + 7.5, y + 110, 10, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // 温度液体
        const tempHeight = (this.temperature / 100) * 90;
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(x + 2, y + 100 - tempHeight, 11, tempHeight);
        
        // 温度标签
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`${this.temperature}°C`, x + 20, y + 60);
    }
    
    drawPHIndicator() {
        const x = this.beaker.x - 80;
        const y = this.beaker.y + 50;
        
        // pH指示器背景
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.fillRect(x, y, 60, 20);
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.strokeRect(x, y, 60, 20);
        
        // pH颜色指示
        const pHColor = `hsl(${(14 - this.pH) * 25}, 70%, 50%)`;
        this.ctx.fillStyle = pHColor;
        this.ctx.fillRect(x + 2, y + 2, 56, 16);
        
        // pH数值
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`pH ${this.pH.toFixed(1)}`, x + 30, y + 14);
        this.ctx.textAlign = 'left';
    }
    
    drawMolecules() {
        this.molecules.forEach(molecule => {
            if (!molecule.reacted) {
                this.ctx.fillStyle = molecule.color;
                this.ctx.beginPath();
                this.ctx.arc(molecule.x, molecule.y, 4, 0, 2 * Math.PI);
                this.ctx.fill();
                
                // 分子标签
                this.ctx.fillStyle = '#2c3e50';
                this.ctx.font = '8px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(molecule.type, molecule.x, molecule.y - 8);
            }
        });
        this.ctx.textAlign = 'left';
    }
    
    drawProducts() {
        this.products.forEach(product => {
            product.age += 0.1;
            
            // 产物可能沉淀或上浮
            if (this.experimentType === 'precipitation') {
                product.vy += 0.1; // 重力
            } else if (this.experimentType === 'gas_evolution') {
                product.vy -= 0.05; // 浮力
            }
            
            product.x += product.vx;
            product.y += product.vy;
            
            this.ctx.fillStyle = product.color;
            this.ctx.globalAlpha = Math.max(0.3, 1 - product.age * 0.01);
            this.ctx.beginPath();
            this.ctx.arc(product.x, product.y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // 产物标签
            this.ctx.fillStyle = '#2c3e50';
            this.ctx.font = '8px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(product.type, product.x, product.y - 6);
        });
        this.ctx.globalAlpha = 1.0;
        this.ctx.textAlign = 'left';
    }
    
    drawEffects() {
        // 绘制气泡（气体产生反应）
        if (this.experimentType === 'gas_evolution' && this.isRunning) {
            for (let i = 0; i < 5; i++) {
                const x = this.beaker.x + 20 + Math.random() * 80;
                const y = this.beaker.y + 100 + Math.random() * 80;
                const size = Math.random() * 5 + 2;
                
                this.ctx.strokeStyle = '#74b9ff';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        }
        
        // 绘制热效应（放热反应）
        if (this.heatChange < 0 && this.isRunning) {
            this.ctx.strokeStyle = '#e74c3c';
            this.ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                const x = this.beaker.x + this.beaker.width / 2 + (Math.random() - 0.5) * 20;
                const y = this.beaker.y - 10 - i * 15;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x - 5, y);
                this.ctx.lineTo(x, y - 10);
                this.ctx.lineTo(x + 5, y);
                this.ctx.stroke();
            }
        }
    }
    
    // 视图控制方法
    zoomIn() {
        this.scale = Math.min(2.0, this.scale * 1.2);
        this.render();
    }
    
    zoomOut() {
        this.scale = Math.max(0.5, this.scale / 1.2);
        this.render();
    }
    
    resetView() {
        this.scale = 1.0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.render();
    }
    
    setActiveStep(stepNumber) {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        
        const activeStep = document.querySelector(`[data-step="${stepNumber}"]`);
        if (activeStep) {
            activeStep.classList.add('active');
        }
    }
}

// 初始化演示
document.addEventListener('DOMContentLoaded', () => {
    new ChemistryDemo();
});

// 窗口大小改变时重新设置画布
window.addEventListener('resize', () => {
    const demo = new ChemistryDemo();
});