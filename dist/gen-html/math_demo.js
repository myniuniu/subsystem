// 数学演示教学交互脚本
class MathDemo {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.canvas3D = null;
        this.ctx3D = null;
        this.statsCanvas = null;
        this.statsCtx = null;
        
        this.currentTopic = 'functions';
        this.animationId = null;
        this.isAnimating = false;
        this.animationSpeed = 1.0;
        this.time = 0;
        
        // 坐标系参数
        this.xMin = -10;
        this.xMax = 10;
        this.yMin = -10;
        this.yMax = 10;
        this.showGrid = true;
        this.showAxes = true;
        
        // 函数参数
        this.paramA = 1;
        this.paramB = 0;
        this.paramC = 0;
        this.functionExpression = 'sin(x)';
        
        // 几何图形
        this.geometryType = 'circle';
        this.geometrySize = 3;
        this.geometryRotation = 0;
        this.geometryObjects = [];
        
        // 3D参数
        this.rotation3D = { x: 45, y: 45, z: 0 };
        
        // 鼠标位置
        this.mousePos = { x: 0, y: 0 };
        
        // 统计数据
        this.statisticsData = [];
        this.chartType = 'histogram';
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupControls();
        this.setupEventListeners();
        this.generateStatisticsData();
        this.render();
    }
    
    setupCanvas() {
        // 主画布
        this.canvas = document.getElementById('mathCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 3D画布
        this.canvas3D = document.getElementById('math3DCanvas');
        this.ctx3D = this.canvas3D.getContext('2d');
        
        // 统计画布
        this.statsCanvas = document.getElementById('statisticsCanvas');
        this.statsCtx = this.statsCanvas.getContext('2d');
        
        // 设置画布大小
        this.resizeCanvas();
    }
    
    setupControls() {
        // 数学主题选择
        const topicSelect = document.getElementById('mathTopic');
        topicSelect.addEventListener('change', (e) => {
            this.currentTopic = e.target.value;
            this.render();
        });
        
        // 函数表达式
        const functionInput = document.getElementById('functionExpression');
        functionInput.addEventListener('input', (e) => {
            this.functionExpression = e.target.value;
        });
        
        // 绘制函数按钮
        document.getElementById('plotFunction').addEventListener('click', () => {
            this.render();
        });
        
        // 参数控制
        this.setupParameterControls();
        
        // 坐标系控制
        this.setupAxisControls();
        
        // 几何图形控制
        this.setupGeometryControls();
        
        // 动画控制
        this.setupAnimationControls();
        
        // 计算工具
        this.setupCalculationTools();
        
        // 3D控制
        this.setup3DControls();
        
        // 统计图表控制
        this.setupStatisticsControls();
        
        // 工具按钮
        this.setupToolButtons();
    }
    
    setupParameterControls() {
        const paramA = document.getElementById('paramA');
        const paramB = document.getElementById('paramB');
        const paramC = document.getElementById('paramC');
        
        paramA.addEventListener('input', (e) => {
            this.paramA = parseFloat(e.target.value);
            document.getElementById('paramAValue').textContent = this.paramA.toFixed(1);
            this.render();
        });
        
        paramB.addEventListener('input', (e) => {
            this.paramB = parseFloat(e.target.value);
            document.getElementById('paramBValue').textContent = this.paramB.toFixed(1);
            this.render();
        });
        
        paramC.addEventListener('input', (e) => {
            this.paramC = parseFloat(e.target.value);
            document.getElementById('paramCValue').textContent = this.paramC.toFixed(1);
            this.render();
        });
    }
    
    setupAxisControls() {
        const xMin = document.getElementById('xMin');
        const xMax = document.getElementById('xMax');
        const yMin = document.getElementById('yMin');
        const yMax = document.getElementById('yMax');
        const showGrid = document.getElementById('showGrid');
        const showAxes = document.getElementById('showAxes');
        
        [xMin, xMax, yMin, yMax].forEach(input => {
            input.addEventListener('change', () => {
                this.xMin = parseFloat(xMin.value);
                this.xMax = parseFloat(xMax.value);
                this.yMin = parseFloat(yMin.value);
                this.yMax = parseFloat(yMax.value);
                this.render();
            });
        });
        
        showGrid.addEventListener('change', (e) => {
            this.showGrid = e.target.checked;
            this.render();
        });
        
        showAxes.addEventListener('change', (e) => {
            this.showAxes = e.target.checked;
            this.render();
        });
    }
    
    setupGeometryControls() {
        const geometryType = document.getElementById('geometryType');
        const geometrySize = document.getElementById('geometrySize');
        const geometryRotation = document.getElementById('geometryRotation');
        const addGeometry = document.getElementById('addGeometry');
        
        geometryType.addEventListener('change', (e) => {
            this.geometryType = e.target.value;
        });
        
        geometrySize.addEventListener('input', (e) => {
            this.geometrySize = parseFloat(e.target.value);
            document.getElementById('geometrySizeValue').textContent = this.geometrySize.toFixed(1);
        });
        
        geometryRotation.addEventListener('input', (e) => {
            this.geometryRotation = parseFloat(e.target.value);
            document.getElementById('geometryRotationValue').textContent = this.geometryRotation + '°';
        });
        
        addGeometry.addEventListener('click', () => {
            this.addGeometryObject();
            this.render();
        });
    }
    
    setupAnimationControls() {
        const animationSpeed = document.getElementById('animationSpeed');
        const playAnimation = document.getElementById('playAnimation');
        const pauseAnimation = document.getElementById('pauseAnimation');
        const resetAnimation = document.getElementById('resetAnimation');
        
        animationSpeed.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            document.getElementById('speedValue').textContent = this.animationSpeed.toFixed(1) + 'x';
        });
        
        playAnimation.addEventListener('click', () => {
            this.startAnimation();
        });
        
        pauseAnimation.addEventListener('click', () => {
            this.pauseAnimation();
        });
        
        resetAnimation.addEventListener('click', () => {
            this.resetAnimation();
        });
    }
    
    setupCalculationTools() {
        const calcExpression = document.getElementById('calcExpression');
        const calculate = document.getElementById('calculate');
        const calcDerivative = document.getElementById('calcDerivative');
        const calcIntegral = document.getElementById('calcIntegral');
        const findRoots = document.getElementById('findRoots');
        
        calculate.addEventListener('click', () => {
            this.calculateExpression(calcExpression.value);
        });
        
        calcDerivative.addEventListener('click', () => {
            this.calculateDerivative();
        });
        
        calcIntegral.addEventListener('click', () => {
            this.calculateIntegral();
        });
        
        findRoots.addEventListener('click', () => {
            this.findRoots();
        });
    }
    
    setup3DControls() {
        const rotationX = document.getElementById('rotationX');
        const rotationY = document.getElementById('rotationY');
        const rotationZ = document.getElementById('rotationZ');
        
        rotationX.addEventListener('input', (e) => {
            this.rotation3D.x = parseFloat(e.target.value);
            document.getElementById('rotationXValue').textContent = this.rotation3D.x + '°';
            this.render3D();
        });
        
        rotationY.addEventListener('input', (e) => {
            this.rotation3D.y = parseFloat(e.target.value);
            document.getElementById('rotationYValue').textContent = this.rotation3D.y + '°';
            this.render3D();
        });
        
        rotationZ.addEventListener('input', (e) => {
            this.rotation3D.z = parseFloat(e.target.value);
            document.getElementById('rotationZValue').textContent = this.rotation3D.z + '°';
            this.render3D();
        });
    }
    
    setupStatisticsControls() {
        const chartType = document.getElementById('chartType');
        const generateData = document.getElementById('generateData');
        const updateChart = document.getElementById('updateChart');
        
        chartType.addEventListener('change', (e) => {
            this.chartType = e.target.value;
            this.renderStatistics();
        });
        
        generateData.addEventListener('click', () => {
            this.generateStatisticsData();
            this.renderStatistics();
        });
        
        updateChart.addEventListener('click', () => {
            this.renderStatistics();
        });
    }
    
    setupToolButtons() {
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.zoom(0.8);
        });
        
        document.getElementById('zoomOut').addEventListener('click', () => {
            this.zoom(1.25);
        });
        
        document.getElementById('resetView').addEventListener('click', () => {
            this.resetView();
        });
        
        document.getElementById('exportImage').addEventListener('click', () => {
            this.exportImage();
        });
    }
    
    setupEventListeners() {
        // 鼠标移动事件
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.mousePos = this.screenToMath(x, y);
            this.updateMouseCoordinates();
            this.updateFunctionValue();
        });
        
        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.render();
        });
    }
    
    resizeCanvas() {
        // 主画布自适应
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth - 40;
        const containerHeight = Math.min(500, containerWidth * 0.75);
        
        this.canvas.width = containerWidth;
        this.canvas.height = containerHeight;
        
        // 3D画布保持固定比例
        const canvas3DContainer = this.canvas3D.parentElement;
        const canvas3DWidth = Math.min(400, canvas3DContainer.clientWidth - 40);
        this.canvas3D.width = canvas3DWidth;
        this.canvas3D.height = canvas3DWidth * 0.75;
        
        // 统计画布保持固定比例
        const statsContainer = this.statsCanvas.parentElement;
        const statsWidth = Math.min(400, statsContainer.clientWidth - 40);
        this.statsCanvas.width = statsWidth;
        this.statsCanvas.height = statsWidth * 0.625;
    }
    
    mathToScreen(x, y) {
        const scaleX = this.canvas.width / (this.xMax - this.xMin);
        const scaleY = this.canvas.height / (this.yMax - this.yMin);
        
        const screenX = (x - this.xMin) * scaleX;
        const screenY = this.canvas.height - (y - this.yMin) * scaleY;
        
        return { x: screenX, y: screenY };
    }
    
    screenToMath(screenX, screenY) {
        const scaleX = (this.xMax - this.xMin) / this.canvas.width;
        const scaleY = (this.yMax - this.yMin) / this.canvas.height;
        
        const x = this.xMin + screenX * scaleX;
        const y = this.yMax - screenY * scaleY;
        
        return { x, y };
    }
    
    evaluateFunction(x) {
        try {
            // 简单的函数解析器
            let expr = this.functionExpression
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/tan/g, 'Math.tan')
                .replace(/log/g, 'Math.log')
                .replace(/exp/g, 'Math.exp')
                .replace(/sqrt/g, 'Math.sqrt')
                .replace(/abs/g, 'Math.abs')
                .replace(/\^/g, '**')
                .replace(/x/g, `(${x})`)
                .replace(/a/g, `(${this.paramA})`)
                .replace(/b/g, `(${this.paramB})`)
                .replace(/c/g, `(${this.paramC})`);
            
            return eval(expr);
        } catch (e) {
            return NaN;
        }
    }
    
    drawGrid() {
        if (!this.showGrid) return;
        
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        // 垂直网格线
        const stepX = (this.xMax - this.xMin) / 20;
        for (let x = this.xMin; x <= this.xMax; x += stepX) {
            const pos = this.mathToScreen(x, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(pos.x, 0);
            this.ctx.lineTo(pos.x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 水平网格线
        const stepY = (this.yMax - this.yMin) / 20;
        for (let y = this.yMin; y <= this.yMax; y += stepY) {
            const pos = this.mathToScreen(0, y);
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos.y);
            this.ctx.lineTo(this.canvas.width, pos.y);
            this.ctx.stroke();
        }
    }
    
    drawAxes() {
        if (!this.showAxes) return;
        
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        
        // X轴
        if (this.yMin <= 0 && this.yMax >= 0) {
            const pos = this.mathToScreen(0, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos.y);
            this.ctx.lineTo(this.canvas.width, pos.y);
            this.ctx.stroke();
        }
        
        // Y轴
        if (this.xMin <= 0 && this.xMax >= 0) {
            const pos = this.mathToScreen(0, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(pos.x, 0);
            this.ctx.lineTo(pos.x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 坐标轴标签
        this.drawAxisLabels();
    }
    
    drawAxisLabels() {
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        // X轴标签
        const stepX = (this.xMax - this.xMin) / 10;
        for (let x = this.xMin; x <= this.xMax; x += stepX) {
            if (Math.abs(x) < 0.001) continue;
            const pos = this.mathToScreen(x, 0);
            if (pos.x >= 0 && pos.x <= this.canvas.width) {
                this.ctx.fillText(x.toFixed(1), pos.x, this.canvas.height - 5);
            }
        }
        
        // Y轴标签
        this.ctx.textAlign = 'right';
        const stepY = (this.yMax - this.yMin) / 10;
        for (let y = this.yMin; y <= this.yMax; y += stepY) {
            if (Math.abs(y) < 0.001) continue;
            const pos = this.mathToScreen(0, y);
            if (pos.y >= 0 && pos.y <= this.canvas.height) {
                this.ctx.fillText(y.toFixed(1), this.canvas.width - 5, pos.y + 4);
            }
        }
    }
    
    drawFunction() {
        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        let firstPoint = true;
        const step = (this.xMax - this.xMin) / this.canvas.width;
        
        for (let x = this.xMin; x <= this.xMax; x += step) {
            const y = this.evaluateFunction(x + this.time * this.animationSpeed * 0.1);
            
            if (!isNaN(y) && isFinite(y)) {
                const pos = this.mathToScreen(x, y);
                
                if (pos.y >= -100 && pos.y <= this.canvas.height + 100) {
                    if (firstPoint) {
                        this.ctx.moveTo(pos.x, pos.y);
                        firstPoint = false;
                    } else {
                        this.ctx.lineTo(pos.x, pos.y);
                    }
                }
            }
        }
        
        this.ctx.stroke();
    }
    
    drawGeometry() {
        this.geometryObjects.forEach(obj => {
            this.ctx.strokeStyle = obj.color;
            this.ctx.fillStyle = obj.color + '40';
            this.ctx.lineWidth = 2;
            
            const center = this.mathToScreen(obj.x, obj.y);
            
            this.ctx.save();
            this.ctx.translate(center.x, center.y);
            this.ctx.rotate((obj.rotation + this.time * this.animationSpeed * 30) * Math.PI / 180);
            
            switch (obj.type) {
                case 'circle':
                    this.drawCircle(obj.size);
                    break;
                case 'triangle':
                    this.drawTriangle(obj.size);
                    break;
                case 'rectangle':
                    this.drawRectangle(obj.size);
                    break;
                case 'polygon':
                    this.drawPolygon(obj.size, obj.sides || 6);
                    break;
                case 'ellipse':
                    this.drawEllipse(obj.size, obj.size * 0.6);
                    break;
            }
            
            this.ctx.restore();
        });
    }
    
    drawCircle(radius) {
        const screenRadius = radius * this.canvas.width / (this.xMax - this.xMin);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, screenRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawTriangle(size) {
        const screenSize = size * this.canvas.width / (this.xMax - this.xMin);
        this.ctx.beginPath();
        this.ctx.moveTo(0, -screenSize);
        this.ctx.lineTo(-screenSize * 0.866, screenSize * 0.5);
        this.ctx.lineTo(screenSize * 0.866, screenSize * 0.5);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawRectangle(size) {
        const screenSize = size * this.canvas.width / (this.xMax - this.xMin);
        this.ctx.beginPath();
        this.ctx.rect(-screenSize/2, -screenSize/2, screenSize, screenSize);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawPolygon(size, sides) {
        const screenSize = size * this.canvas.width / (this.xMax - this.xMin);
        this.ctx.beginPath();
        
        for (let i = 0; i <= sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            const x = screenSize * Math.cos(angle);
            const y = screenSize * Math.sin(angle);
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawEllipse(radiusX, radiusY) {
        const screenRadiusX = radiusX * this.canvas.width / (this.xMax - this.xMin);
        const screenRadiusY = radiusY * this.canvas.height / (this.yMax - this.yMin);
        
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, screenRadiusX, screenRadiusY, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    addGeometryObject() {
        const colors = ['#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        this.geometryObjects.push({
            type: this.geometryType,
            x: (Math.random() - 0.5) * (this.xMax - this.xMin) * 0.5,
            y: (Math.random() - 0.5) * (this.yMax - this.yMin) * 0.5,
            size: this.geometrySize,
            rotation: this.geometryRotation,
            color: color,
            sides: Math.floor(Math.random() * 6) + 3
        });
    }
    
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格和坐标轴
        this.drawGrid();
        this.drawAxes();
        
        // 根据当前主题绘制内容
        switch (this.currentTopic) {
            case 'functions':
                this.drawFunction();
                break;
            case 'geometry':
                this.drawGeometry();
                break;
            case 'calculus':
                this.drawFunction();
                this.drawDerivative();
                break;
            case 'statistics':
                this.drawStatisticalData();
                break;
            case 'algebra':
                this.drawAlgebraicCurves();
                break;
            case 'trigonometry':
                this.drawTrigonometricFunctions();
                break;
            case 'vectors':
                this.drawVectors();
                break;
            case 'matrices':
                this.drawMatrixTransformation();
                break;
        }
        
        // 绘制3D图形
        this.render3D();
        
        // 绘制统计图表
        this.renderStatistics();
    }
    
    drawDerivative() {
        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        
        let firstPoint = true;
        const step = (this.xMax - this.xMin) / this.canvas.width;
        const h = 0.001;
        
        for (let x = this.xMin; x <= this.xMax; x += step) {
            const y1 = this.evaluateFunction(x - h);
            const y2 = this.evaluateFunction(x + h);
            const derivative = (y2 - y1) / (2 * h);
            
            if (!isNaN(derivative) && isFinite(derivative)) {
                const pos = this.mathToScreen(x, derivative);
                
                if (pos.y >= -100 && pos.y <= this.canvas.height + 100) {
                    if (firstPoint) {
                        this.ctx.moveTo(pos.x, pos.y);
                        firstPoint = false;
                    } else {
                        this.ctx.lineTo(pos.x, pos.y);
                    }
                }
            }
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawStatisticalData() {
        // 绘制散点图
        this.ctx.fillStyle = '#3498db';
        
        for (let i = 0; i < 50; i++) {
            const x = this.xMin + Math.random() * (this.xMax - this.xMin);
            const y = this.yMin + Math.random() * (this.yMax - this.yMin);
            const pos = this.mathToScreen(x, y);
            
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawAlgebraicCurves() {
        // 绘制抛物线
        this.ctx.strokeStyle = '#9b59b6';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        let firstPoint = true;
        const step = (this.xMax - this.xMin) / this.canvas.width;
        
        for (let x = this.xMin; x <= this.xMax; x += step) {
            const y = this.paramA * x * x + this.paramB * x + this.paramC;
            const pos = this.mathToScreen(x, y);
            
            if (pos.y >= -100 && pos.y <= this.canvas.height + 100) {
                if (firstPoint) {
                    this.ctx.moveTo(pos.x, pos.y);
                    firstPoint = false;
                } else {
                    this.ctx.lineTo(pos.x, pos.y);
                }
            }
        }
        
        this.ctx.stroke();
    }
    
    drawTrigonometricFunctions() {
        // 绘制sin函数
        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.lineWidth = 2;
        this.drawTrigFunction('sin');
        
        // 绘制cos函数
        this.ctx.strokeStyle = '#2ecc71';
        this.drawTrigFunction('cos');
        
        // 绘制tan函数
        this.ctx.strokeStyle = '#f39c12';
        this.drawTrigFunction('tan');
    }
    
    drawTrigFunction(func) {
        this.ctx.beginPath();
        
        let firstPoint = true;
        const step = (this.xMax - this.xMin) / this.canvas.width;
        
        for (let x = this.xMin; x <= this.xMax; x += step) {
            let y;
            switch (func) {
                case 'sin':
                    y = this.paramA * Math.sin(this.paramB * x + this.paramC + this.time * this.animationSpeed * 0.1);
                    break;
                case 'cos':
                    y = this.paramA * Math.cos(this.paramB * x + this.paramC + this.time * this.animationSpeed * 0.1);
                    break;
                case 'tan':
                    y = this.paramA * Math.tan(this.paramB * x + this.paramC + this.time * this.animationSpeed * 0.1);
                    if (Math.abs(y) > 100) continue;
                    break;
            }
            
            const pos = this.mathToScreen(x, y);
            
            if (pos.y >= -100 && pos.y <= this.canvas.height + 100) {
                if (firstPoint) {
                    this.ctx.moveTo(pos.x, pos.y);
                    firstPoint = false;
                } else {
                    this.ctx.lineTo(pos.x, pos.y);
                }
            }
        }
        
        this.ctx.stroke();
    }
    
    drawVectors() {
        // 绘制向量场
        this.ctx.strokeStyle = '#34495e';
        this.ctx.lineWidth = 1;
        
        const stepX = (this.xMax - this.xMin) / 20;
        const stepY = (this.yMax - this.yMin) / 15;
        
        for (let x = this.xMin; x <= this.xMax; x += stepX) {
            for (let y = this.yMin; y <= this.yMax; y += stepY) {
                const vx = this.paramA * y;
                const vy = -this.paramB * x;
                
                const startPos = this.mathToScreen(x, y);
                const endPos = this.mathToScreen(x + vx * 0.1, y + vy * 0.1);
                
                this.ctx.beginPath();
                this.ctx.moveTo(startPos.x, startPos.y);
                this.ctx.lineTo(endPos.x, endPos.y);
                this.ctx.stroke();
                
                // 绘制箭头
                const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
                const arrowLength = 5;
                
                this.ctx.beginPath();
                this.ctx.moveTo(endPos.x, endPos.y);
                this.ctx.lineTo(
                    endPos.x - arrowLength * Math.cos(angle - Math.PI / 6),
                    endPos.y - arrowLength * Math.sin(angle - Math.PI / 6)
                );
                this.ctx.moveTo(endPos.x, endPos.y);
                this.ctx.lineTo(
                    endPos.x - arrowLength * Math.cos(angle + Math.PI / 6),
                    endPos.y - arrowLength * Math.sin(angle + Math.PI / 6)
                );
                this.ctx.stroke();
            }
        }
    }
    
    drawMatrixTransformation() {
        // 绘制变换后的网格
        this.ctx.strokeStyle = '#8e44ad';
        this.ctx.lineWidth = 1;
        
        const matrix = [
            [this.paramA, this.paramB],
            [this.paramC, 1]
        ];
        
        // 绘制变换后的单位向量
        for (let i = -5; i <= 5; i++) {
            for (let j = -5; j <= 5; j++) {
                const x1 = i;
                const y1 = j;
                const x2 = i + 1;
                const y2 = j;
                const x3 = i;
                const y3 = j + 1;
                
                // 应用矩阵变换
                const tx1 = matrix[0][0] * x1 + matrix[0][1] * y1;
                const ty1 = matrix[1][0] * x1 + matrix[1][1] * y1;
                const tx2 = matrix[0][0] * x2 + matrix[0][1] * y2;
                const ty2 = matrix[1][0] * x2 + matrix[1][1] * y2;
                const tx3 = matrix[0][0] * x3 + matrix[0][1] * y3;
                const ty3 = matrix[1][0] * x3 + matrix[1][1] * y3;
                
                const pos1 = this.mathToScreen(tx1, ty1);
                const pos2 = this.mathToScreen(tx2, ty2);
                const pos3 = this.mathToScreen(tx3, ty3);
                
                // 绘制水平线
                this.ctx.beginPath();
                this.ctx.moveTo(pos1.x, pos1.y);
                this.ctx.lineTo(pos2.x, pos2.y);
                this.ctx.stroke();
                
                // 绘制垂直线
                this.ctx.beginPath();
                this.ctx.moveTo(pos1.x, pos1.y);
                this.ctx.lineTo(pos3.x, pos3.y);
                this.ctx.stroke();
            }
        }
    }
    
    render3D() {
        this.ctx3D.clearRect(0, 0, this.canvas3D.width, this.canvas3D.height);
        
        // 绘制3D坐标系
        this.draw3DAxes();
        
        // 绘制3D函数曲面
        this.draw3DSurface();
    }
    
    draw3DAxes() {
        const centerX = this.canvas3D.width / 2;
        const centerY = this.canvas3D.height / 2;
        const scale = 50;
        
        this.ctx3D.strokeStyle = '#333';
        this.ctx3D.lineWidth = 2;
        
        // X轴
        this.ctx3D.beginPath();
        this.ctx3D.moveTo(centerX - scale, centerY);
        this.ctx3D.lineTo(centerX + scale, centerY);
        this.ctx3D.stroke();
        
        // Y轴
        this.ctx3D.beginPath();
        this.ctx3D.moveTo(centerX, centerY - scale);
        this.ctx3D.lineTo(centerX, centerY + scale);
        this.ctx3D.stroke();
        
        // Z轴（斜向）
        const zAngle = Math.PI / 4;
        this.ctx3D.beginPath();
        this.ctx3D.moveTo(centerX, centerY);
        this.ctx3D.lineTo(
            centerX + scale * Math.cos(zAngle),
            centerY - scale * Math.sin(zAngle)
        );
        this.ctx3D.stroke();
    }
    
    draw3DSurface() {
        const centerX = this.canvas3D.width / 2;
        const centerY = this.canvas3D.height / 2;
        const scale = 20;
        
        this.ctx3D.strokeStyle = '#3498db';
        this.ctx3D.lineWidth = 1;
        
        for (let x = -5; x <= 5; x += 0.5) {
            this.ctx3D.beginPath();
            let firstPoint = true;
            
            for (let y = -5; y <= 5; y += 0.1) {
                const z = Math.sin(Math.sqrt(x*x + y*y) + this.time * this.animationSpeed * 0.05);
                
                // 3D到2D投影
                const rotX = this.rotation3D.x * Math.PI / 180;
                const rotY = this.rotation3D.y * Math.PI / 180;
                const rotZ = this.rotation3D.z * Math.PI / 180;
                
                // 旋转变换
                let rx = x;
                let ry = y * Math.cos(rotX) - z * Math.sin(rotX);
                let rz = y * Math.sin(rotX) + z * Math.cos(rotX);
                
                let rx2 = rx * Math.cos(rotY) + rz * Math.sin(rotY);
                let ry2 = ry;
                let rz2 = -rx * Math.sin(rotY) + rz * Math.cos(rotY);
                
                let rx3 = rx2 * Math.cos(rotZ) - ry2 * Math.sin(rotZ);
                let ry3 = rx2 * Math.sin(rotZ) + ry2 * Math.cos(rotZ);
                
                // 投影到2D
                const screenX = centerX + rx3 * scale;
                const screenY = centerY - ry3 * scale;
                
                if (firstPoint) {
                    this.ctx3D.moveTo(screenX, screenY);
                    firstPoint = false;
                } else {
                    this.ctx3D.lineTo(screenX, screenY);
                }
            }
            
            this.ctx3D.stroke();
        }
    }
    
    generateStatisticsData() {
        this.statisticsData = [];
        
        // 生成正态分布数据
        for (let i = 0; i < 100; i++) {
            const u1 = Math.random();
            const u2 = Math.random();
            const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            this.statisticsData.push(z0 * 2 + 5);
        }
    }
    
    renderStatistics() {
        this.statsCtx.clearRect(0, 0, this.statsCanvas.width, this.statsCanvas.height);
        
        switch (this.chartType) {
            case 'histogram':
                this.drawHistogram();
                break;
            case 'scatter':
                this.drawScatterPlot();
                break;
            case 'line':
                this.drawLineChart();
                break;
            case 'pie':
                this.drawPieChart();
                break;
            case 'box':
                this.drawBoxPlot();
                break;
        }
    }
    
    drawHistogram() {
        const bins = 20;
        const minVal = Math.min(...this.statisticsData);
        const maxVal = Math.max(...this.statisticsData);
        const binWidth = (maxVal - minVal) / bins;
        
        const histogram = new Array(bins).fill(0);
        
        this.statisticsData.forEach(value => {
            const binIndex = Math.min(Math.floor((value - minVal) / binWidth), bins - 1);
            histogram[binIndex]++;
        });
        
        const maxCount = Math.max(...histogram);
        const barWidth = this.statsCanvas.width / bins;
        const maxHeight = this.statsCanvas.height - 40;
        
        this.statsCtx.fillStyle = '#3498db';
        
        histogram.forEach((count, i) => {
            const height = (count / maxCount) * maxHeight;
            const x = i * barWidth;
            const y = this.statsCanvas.height - height - 20;
            
            this.statsCtx.fillRect(x, y, barWidth - 2, height);
        });
    }
    
    drawScatterPlot() {
        this.statsCtx.fillStyle = '#e74c3c';
        
        this.statisticsData.forEach((value, i) => {
            const x = (i / this.statisticsData.length) * this.statsCanvas.width;
            const y = this.statsCanvas.height - ((value + 5) / 15) * this.statsCanvas.height;
            
            this.statsCtx.beginPath();
            this.statsCtx.arc(x, y, 3, 0, 2 * Math.PI);
            this.statsCtx.fill();
        });
    }
    
    drawLineChart() {
        this.statsCtx.strokeStyle = '#2ecc71';
        this.statsCtx.lineWidth = 2;
        this.statsCtx.beginPath();
        
        let firstPoint = true;
        
        this.statisticsData.forEach((value, i) => {
            const x = (i / this.statisticsData.length) * this.statsCanvas.width;
            const y = this.statsCanvas.height - ((value + 5) / 15) * this.statsCanvas.height;
            
            if (firstPoint) {
                this.statsCtx.moveTo(x, y);
                firstPoint = false;
            } else {
                this.statsCtx.lineTo(x, y);
            }
        });
        
        this.statsCtx.stroke();
    }
    
    drawPieChart() {
        const centerX = this.statsCanvas.width / 2;
        const centerY = this.statsCanvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        // 简化数据为几个类别
        const categories = [0, 0, 0, 0];
        this.statisticsData.forEach(value => {
            if (value < 2) categories[0]++;
            else if (value < 5) categories[1]++;
            else if (value < 8) categories[2]++;
            else categories[3]++;
        });
        
        const total = categories.reduce((a, b) => a + b, 0);
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
        
        let currentAngle = 0;
        
        categories.forEach((count, i) => {
            const sliceAngle = (count / total) * 2 * Math.PI;
            
            this.statsCtx.fillStyle = colors[i];
            this.statsCtx.beginPath();
            this.statsCtx.moveTo(centerX, centerY);
            this.statsCtx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            this.statsCtx.closePath();
            this.statsCtx.fill();
            
            currentAngle += sliceAngle;
        });
    }
    
    drawBoxPlot() {
        const sortedData = [...this.statisticsData].sort((a, b) => a - b);
        const n = sortedData.length;
        
        const q1 = sortedData[Math.floor(n * 0.25)];
        const median = sortedData[Math.floor(n * 0.5)];
        const q3 = sortedData[Math.floor(n * 0.75)];
        const min = sortedData[0];
        const max = sortedData[n - 1];
        
        const centerY = this.statsCanvas.height / 2;
        const boxHeight = 60;
        const dataRange = max - min;
        const scale = (this.statsCanvas.width - 40) / dataRange;
        
        const minX = 20 + (min - min) * scale;
        const q1X = 20 + (q1 - min) * scale;
        const medianX = 20 + (median - min) * scale;
        const q3X = 20 + (q3 - min) * scale;
        const maxX = 20 + (max - min) * scale;
        
        // 绘制箱体
        this.statsCtx.fillStyle = '#3498db40';
        this.statsCtx.fillRect(q1X, centerY - boxHeight/2, q3X - q1X, boxHeight);
        
        this.statsCtx.strokeStyle = '#3498db';
        this.statsCtx.lineWidth = 2;
        this.statsCtx.strokeRect(q1X, centerY - boxHeight/2, q3X - q1X, boxHeight);
        
        // 绘制中位数线
        this.statsCtx.beginPath();
        this.statsCtx.moveTo(medianX, centerY - boxHeight/2);
        this.statsCtx.lineTo(medianX, centerY + boxHeight/2);
        this.statsCtx.stroke();
        
        // 绘制须线
        this.statsCtx.beginPath();
        this.statsCtx.moveTo(minX, centerY);
        this.statsCtx.lineTo(q1X, centerY);
        this.statsCtx.moveTo(q3X, centerY);
        this.statsCtx.lineTo(maxX, centerY);
        this.statsCtx.stroke();
        
        // 绘制端点
        [minX, maxX].forEach(x => {
            this.statsCtx.beginPath();
            this.statsCtx.moveTo(x, centerY - 10);
            this.statsCtx.lineTo(x, centerY + 10);
            this.statsCtx.stroke();
        });
    }
    
    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const animate = () => {
            if (!this.isAnimating) return;
            
            this.time += 1;
            this.render();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    pauseAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    resetAnimation() {
        this.pauseAnimation();
        this.time = 0;
        this.render();
    }
    
    zoom(factor) {
        const centerX = (this.xMin + this.xMax) / 2;
        const centerY = (this.yMin + this.yMax) / 2;
        const rangeX = (this.xMax - this.xMin) * factor / 2;
        const rangeY = (this.yMax - this.yMin) * factor / 2;
        
        this.xMin = centerX - rangeX;
        this.xMax = centerX + rangeX;
        this.yMin = centerY - rangeY;
        this.yMax = centerY + rangeY;
        
        // 更新输入框
        document.getElementById('xMin').value = this.xMin.toFixed(1);
        document.getElementById('xMax').value = this.xMax.toFixed(1);
        document.getElementById('yMin').value = this.yMin.toFixed(1);
        document.getElementById('yMax').value = this.yMax.toFixed(1);
        
        this.render();
    }
    
    resetView() {
        this.xMin = -10;
        this.xMax = 10;
        this.yMin = -10;
        this.yMax = 10;
        
        document.getElementById('xMin').value = this.xMin;
        document.getElementById('xMax').value = this.xMax;
        document.getElementById('yMin').value = this.yMin;
        document.getElementById('yMax').value = this.yMax;
        
        this.render();
    }
    
    exportImage() {
        const link = document.createElement('a');
        link.download = 'math_demo.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
    
    updateMouseCoordinates() {
        document.getElementById('mouseCoords').textContent = 
            `(${this.mousePos.x.toFixed(2)}, ${this.mousePos.y.toFixed(2)})`;
    }
    
    updateFunctionValue() {
        const functionValue = this.evaluateFunction(this.mousePos.x);
        document.getElementById('functionValue').textContent = 
            isNaN(functionValue) ? 'undefined' : functionValue.toFixed(3);
        
        document.getElementById('currentPoint').textContent = 
            `(${this.mousePos.x.toFixed(2)}, ${functionValue.toFixed(3)})`;
    }
    
    calculateExpression(expression) {
        try {
            const result = eval(expression
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/tan/g, 'Math.tan')
                .replace(/log/g, 'Math.log')
                .replace(/exp/g, 'Math.exp')
                .replace(/sqrt/g, 'Math.sqrt')
                .replace(/\^/g, '**')
            );
            
            document.getElementById('calcResult').textContent = result.toFixed(6);
        } catch (e) {
            document.getElementById('calcResult').textContent = 'Error';
        }
    }
    
    calculateDerivative() {
        const h = 0.001;
        const x = this.mousePos.x;
        const y1 = this.evaluateFunction(x - h);
        const y2 = this.evaluateFunction(x + h);
        const derivative = (y2 - y1) / (2 * h);
        
        document.getElementById('derivativeValue').textContent = 
            isNaN(derivative) ? 'undefined' : derivative.toFixed(3);
    }
    
    calculateIntegral() {
        // 简单的数值积分（梯形法则）
        const a = this.xMin;
        const b = this.xMax;
        const n = 1000;
        const h = (b - a) / n;
        
        let sum = (this.evaluateFunction(a) + this.evaluateFunction(b)) / 2;
        
        for (let i = 1; i < n; i++) {
            sum += this.evaluateFunction(a + i * h);
        }
        
        const integral = sum * h;
        document.getElementById('integralValue').textContent = 
            isNaN(integral) ? 'undefined' : integral.toFixed(3);
    }
    
    findRoots() {
        // 简单的根查找（二分法）
        const roots = [];
        const step = (this.xMax - this.xMin) / 1000;
        
        for (let x = this.xMin; x < this.xMax; x += step) {
            const y1 = this.evaluateFunction(x);
            const y2 = this.evaluateFunction(x + step);
            
            if (y1 * y2 < 0) {
                // 使用二分法精确查找根
                let a = x;
                let b = x + step;
                
                for (let i = 0; i < 50; i++) {
                    const c = (a + b) / 2;
                    const yc = this.evaluateFunction(c);
                    
                    if (Math.abs(yc) < 0.001) {
                        roots.push(c);
                        break;
                    }
                    
                    if (this.evaluateFunction(a) * yc < 0) {
                        b = c;
                    } else {
                        a = c;
                    }
                }
            }
        }
        
        document.getElementById('calcResult').textContent = 
            roots.length > 0 ? `根: ${roots.map(r => r.toFixed(3)).join(', ')}` : '未找到根';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new MathDemo();
});

// 窗口大小改变时重新调整
window.addEventListener('resize', () => {
    // 延迟执行以避免频繁调用
    setTimeout(() => {
        if (window.mathDemo) {
            window.mathDemo.resizeCanvas();
            window.mathDemo.render();
        }
    }, 100);
});