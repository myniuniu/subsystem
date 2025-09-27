// 物理实验演示教学 JavaScript
class PhysicsDemo {
    constructor() {
        this.canvas = document.getElementById('physicsCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.isPaused = false;
        this.animationId = null;
        this.startTime = 0;
        this.currentTime = 0;
        
        // 物理参数
        this.mass = 1.0; // kg
        this.force = 10.0; // N
        this.angle = 30; // degrees
        this.gravity = 9.8; // m/s²
        
        // 物体状态
        this.position = { x: 50, y: 400 };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.displacement = 0;
        
        // 实验类型
        this.experimentType = 'mechanics';
        
        // 轨迹记录
        this.trajectory = [];
        
        this.initializeControls();
        this.setupCanvas();
        this.updateDisplay();
        this.render();
    }
    
    initializeControls() {
        // 实验类型选择
        document.getElementById('experimentType').addEventListener('change', (e) => {
            this.experimentType = e.target.value;
            this.reset();
        });
        
        // 参数控制
        document.getElementById('mass').addEventListener('input', (e) => {
            this.mass = parseFloat(e.target.value);
            document.getElementById('massValue').textContent = `${this.mass.toFixed(1)} kg`;
            this.calculateAcceleration();
            this.updateDisplay();
        });
        
        document.getElementById('force').addEventListener('input', (e) => {
            this.force = parseFloat(e.target.value);
            document.getElementById('forceValue').textContent = `${this.force.toFixed(1)} N`;
            this.calculateAcceleration();
            this.updateDisplay();
        });
        
        document.getElementById('angle').addEventListener('input', (e) => {
            this.angle = parseFloat(e.target.value);
            document.getElementById('angleValue').textContent = `${this.angle}°`;
            this.calculateAcceleration();
            this.updateDisplay();
        });
        
        // 控制按钮
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('stepBtn').addEventListener('click', () => this.step());
        
        // 步骤点击
        document.querySelectorAll('.step').forEach((step, index) => {
            step.addEventListener('click', () => this.setActiveStep(index + 1));
        });
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // 设置坐标系
        this.scale = 2; // 像素/米
        this.origin = { x: 50, y: this.canvas.height - 50 };
    }
    
    calculateAcceleration() {
        const angleRad = this.angle * Math.PI / 180;
        
        switch (this.experimentType) {
            case 'mechanics':
                // 斜面运动或抛物运动
                this.acceleration.x = (this.force * Math.cos(angleRad)) / this.mass;
                this.acceleration.y = -this.gravity + (this.force * Math.sin(angleRad)) / this.mass;
                break;
            case 'electromagnetics':
                // 电场中的运动
                this.acceleration.x = this.force / this.mass;
                this.acceleration.y = -this.gravity;
                break;
            case 'optics':
                // 光线传播（无加速度）
                this.acceleration.x = 0;
                this.acceleration.y = 0;
                break;
            case 'thermodynamics':
                // 热运动模拟
                this.acceleration.x = (Math.random() - 0.5) * 2;
                this.acceleration.y = (Math.random() - 0.5) * 2;
                break;
        }
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            this.startTime = Date.now();
            this.animate();
            
            document.getElementById('startBtn').classList.add('active');
            this.setActiveStep(2);
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
        
        // 重置物体状态
        this.position = { x: 50, y: 400 };
        this.velocity = { x: 0, y: 0 };
        this.currentTime = 0;
        this.displacement = 0;
        this.trajectory = [];
        
        this.calculateAcceleration();
        this.updateDisplay();
        this.render();
        
        document.getElementById('startBtn').classList.remove('active');
        this.setActiveStep(1);
    }
    
    step() {
        if (!this.isRunning) {
            this.updatePhysics(0.1); // 0.1秒步长
            this.updateDisplay();
            this.render();
        }
    }
    
    animate() {
        if (!this.isRunning || this.isPaused) return;
        
        const deltaTime = 0.016; // 约60fps
        this.updatePhysics(deltaTime);
        this.updateDisplay();
        this.render();
        
        // 检查边界
        if (this.position.x > this.canvas.width - 50 || this.position.y > this.canvas.height - 50) {
            this.setActiveStep(4);
            setTimeout(() => this.reset(), 2000);
            return;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updatePhysics(deltaTime) {
        this.currentTime += deltaTime;
        
        // 更新速度
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        
        // 更新位置
        this.position.x += this.velocity.x * deltaTime * this.scale;
        this.position.y -= this.velocity.y * deltaTime * this.scale; // Y轴向上为正
        
        // 计算位移
        this.displacement = Math.sqrt(
            Math.pow(this.position.x - 50, 2) + Math.pow(400 - this.position.y, 2)
        ) / this.scale;
        
        // 记录轨迹
        this.trajectory.push({ x: this.position.x, y: this.position.y });
        if (this.trajectory.length > 100) {
            this.trajectory.shift();
        }
        
        // 边界检测
        if (this.position.y >= this.canvas.height - 30) {
            this.position.y = this.canvas.height - 30;
            this.velocity.y = -this.velocity.y * 0.8; // 弹性碰撞
        }
    }
    
    updateDisplay() {
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        const totalAcceleration = Math.sqrt(this.acceleration.x * this.acceleration.x + this.acceleration.y * this.acceleration.y);
        
        document.getElementById('velocity').textContent = `${speed.toFixed(2)} m/s`;
        document.getElementById('acceleration').textContent = `${totalAcceleration.toFixed(2)} m/s²`;
        document.getElementById('displacement').textContent = `${this.displacement.toFixed(2)} m`;
        document.getElementById('time').textContent = `${this.currentTime.toFixed(1)} s`;
    }
    
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制坐标轴
        this.drawAxes();
        
        // 绘制轨迹
        this.drawTrajectory();
        
        // 绘制物体
        this.drawObject();
        
        // 绘制力矢量
        this.drawForceVector();
        
        // 绘制速度矢量
        this.drawVelocityVector();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = 0; x < this.canvas.width; x += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 水平线
        for (let y = 0; y < this.canvas.height; y += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawAxes() {
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        
        // X轴
        this.ctx.beginPath();
        this.ctx.moveTo(this.origin.x, this.origin.y);
        this.ctx.lineTo(this.canvas.width - 20, this.origin.y);
        this.ctx.stroke();
        
        // Y轴
        this.ctx.beginPath();
        this.ctx.moveTo(this.origin.x, this.origin.y);
        this.ctx.lineTo(this.origin.x, 20);
        this.ctx.stroke();
        
        // 箭头
        this.drawArrow(this.canvas.width - 20, this.origin.y, 0);
        this.drawArrow(this.origin.x, 20, Math.PI / 2);
    }
    
    drawTrajectory() {
        if (this.trajectory.length < 2) return;
        
        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let i = 0; i < this.trajectory.length; i++) {
            const point = this.trajectory[i];
            if (i === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        }
        
        this.ctx.stroke();
    }
    
    drawObject() {
        // 绘制物体（圆形）
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, 15, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // 绘制物体边框
        this.ctx.strokeStyle = '#c0392b';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // 绘制质量标签
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${this.mass}kg`, this.position.x, this.position.y - 25);
    }
    
    drawForceVector() {
        const scale = 5; // 矢量缩放
        const angleRad = this.angle * Math.PI / 180;
        const endX = this.position.x + this.force * Math.cos(angleRad) * scale;
        const endY = this.position.y - this.force * Math.sin(angleRad) * scale;
        
        // 绘制力矢量
        this.ctx.strokeStyle = '#27ae60';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x, this.position.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        // 绘制箭头
        const arrowAngle = Math.atan2(this.position.y - endY, endX - this.position.x);
        this.drawArrow(endX, endY, arrowAngle);
        
        // 标签
        this.ctx.fillStyle = '#27ae60';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`F=${this.force}N`, endX + 10, endY - 10);
    }
    
    drawVelocityVector() {
        if (this.velocity.x === 0 && this.velocity.y === 0) return;
        
        const scale = 10;
        const endX = this.position.x + this.velocity.x * scale;
        const endY = this.position.y - this.velocity.y * scale;
        
        // 绘制速度矢量
        this.ctx.strokeStyle = '#f39c12';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x, this.position.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        // 绘制箭头
        const arrowAngle = Math.atan2(this.position.y - endY, endX - this.position.x);
        this.drawArrow(endX, endY, arrowAngle);
        
        // 标签
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        this.ctx.fillStyle = '#f39c12';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`v=${speed.toFixed(1)}m/s`, endX + 10, endY + 15);
    }
    
    drawArrow(x, y, angle) {
        const arrowLength = 10;
        const arrowAngle = Math.PI / 6;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x - arrowLength * Math.cos(angle - arrowAngle),
            y - arrowLength * Math.sin(angle - arrowAngle)
        );
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x - arrowLength * Math.cos(angle + arrowAngle),
            y - arrowLength * Math.sin(angle + arrowAngle)
        );
        this.ctx.stroke();
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
    new PhysicsDemo();
});

// 窗口大小改变时重新设置画布
window.addEventListener('resize', () => {
    const demo = new PhysicsDemo();
});