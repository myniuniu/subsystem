// 生物实验演示教学JavaScript交互
class BiologyDemo {
    constructor() {
        this.microscopeCanvas = null;
        this.molecularCanvas = null;
        this.processCanvas = null;
        this.microscopeCtx = null;
        this.molecularCtx = null;
        this.processCtx = null;
        
        // 实验参数
        this.currentExperiment = 'cell_observation';
        this.magnification = 100;
        this.focus = 50;
        this.illumination = 75;
        this.staining = {
            methylene_blue: false,
            iodine: false,
            congo_red: false
        };
        
        // 显微镜参数
        this.specimenType = 'onion_cell';
        this.cellSize = 20;
        this.cellCount = 50;
        this.cells = [];
        
        // 分子模型参数
        this.moleculeType = 'dna';
        this.moleculeRotation = { x: 0, y: 0, z: 0 };
        this.moleculeScale = 1;
        this.showBonds = true;
        this.showLabels = true;
        
        // 生化过程参数
        this.processType = 'photosynthesis';
        this.processSpeed = 1;
        this.processTime = 0;
        this.isProcessRunning = false;
        
        // 时间控制
        this.timeScale = 'realtime';
        this.timeSpeed = 1;
        this.isPlaying = false;
        
        // 数据记录
        this.measurements = [];
        this.currentMeasurement = {
            cellSize: 0,
            cellCount: 0,
            concentration: 0,
            temperature: 25,
            ph: 7.0
        };
        
        // 动画控制
        this.animationId = null;
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupControls();
        this.initializeCells();
        this.startAnimation();
        this.updateDisplay();
    }
    
    setupCanvas() {
        // 显微镜画布
        this.microscopeCanvas = document.getElementById('microscopeCanvas');
        if (this.microscopeCanvas) {
            this.microscopeCtx = this.microscopeCanvas.getContext('2d');
            this.microscopeCanvas.width = 600;
            this.microscopeCanvas.height = 400;
            
            // 添加鼠标事件
            this.microscopeCanvas.addEventListener('mousemove', (e) => this.handleMicroscopeMouseMove(e));
            this.microscopeCanvas.addEventListener('click', (e) => this.handleMicroscopeClick(e));
        }
        
        // 分子模型画布
        this.molecularCanvas = document.getElementById('molecularCanvas');
        if (this.molecularCanvas) {
            this.molecularCtx = this.molecularCanvas.getContext('2d');
            this.molecularCanvas.width = 600;
            this.molecularCanvas.height = 350;
            
            // 添加鼠标事件
            this.molecularCanvas.addEventListener('mousedown', (e) => this.handleMolecularMouseDown(e));
            this.molecularCanvas.addEventListener('mousemove', (e) => this.handleMolecularMouseMove(e));
            this.molecularCanvas.addEventListener('mouseup', (e) => this.handleMolecularMouseUp(e));
        }
        
        // 生化过程画布
        this.processCanvas = document.getElementById('processCanvas');
        if (this.processCanvas) {
            this.processCtx = this.processCanvas.getContext('2d');
            this.processCanvas.width = 600;
            this.processCanvas.height = 300;
        }
    }
    
    setupControls() {
        // 实验选择
        const experimentSelect = document.getElementById('bioExperiment');
        if (experimentSelect) {
            experimentSelect.addEventListener('change', (e) => {
                this.changeExperiment(e.target.value);
            });
        }
        
        // 显微镜控制
        const magnificationSlider = document.getElementById('magnification');
        if (magnificationSlider) {
            magnificationSlider.addEventListener('input', (e) => {
                this.magnification = parseInt(e.target.value);
                this.updateMagnificationDisplay();
            });
        }
        
        const focusSlider = document.getElementById('focus');
        if (focusSlider) {
            focusSlider.addEventListener('input', (e) => {
                this.focus = parseInt(e.target.value);
                this.updateFocusDisplay();
            });
        }
        
        const illuminationSlider = document.getElementById('illumination');
        if (illuminationSlider) {
            illuminationSlider.addEventListener('input', (e) => {
                this.illumination = parseInt(e.target.value);
                this.updateIlluminationDisplay();
            });
        }
        
        // 染色选项
        const stainingCheckboxes = document.querySelectorAll('.staining-checkbox');
        stainingCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.staining[e.target.dataset.stain] = e.target.checked;
                this.render();
            });
        });
        
        // 分子模型控制
        const moleculeSelect = document.getElementById('moleculeType');
        if (moleculeSelect) {
            moleculeSelect.addEventListener('change', (e) => {
                this.moleculeType = e.target.value;
                this.render();
            });
        }
        
        const rotationXSlider = document.getElementById('rotationX');
        if (rotationXSlider) {
            rotationXSlider.addEventListener('input', (e) => {
                this.moleculeRotation.x = parseFloat(e.target.value);
                this.updateRotationDisplay();
            });
        }
        
        const rotationYSlider = document.getElementById('rotationY');
        if (rotationYSlider) {
            rotationYSlider.addEventListener('input', (e) => {
                this.moleculeRotation.y = parseFloat(e.target.value);
                this.updateRotationDisplay();
            });
        }
        
        const scaleSlider = document.getElementById('moleculeScale');
        if (scaleSlider) {
            scaleSlider.addEventListener('input', (e) => {
                this.moleculeScale = parseFloat(e.target.value);
                this.updateScaleDisplay();
            });
        }
        
        // 生化过程控制
        const processSelect = document.getElementById('processType');
        if (processSelect) {
            processSelect.addEventListener('change', (e) => {
                this.processType = e.target.value;
                this.resetProcess();
            });
        }
        
        const processSpeedSlider = document.getElementById('processSpeed');
        if (processSpeedSlider) {
            processSpeedSlider.addEventListener('input', (e) => {
                this.processSpeed = parseFloat(e.target.value);
                this.updateProcessSpeedDisplay();
            });
        }
        
        const processTimelineSlider = document.getElementById('processTimeline');
        if (processTimelineSlider) {
            processTimelineSlider.addEventListener('input', (e) => {
                this.processTime = parseFloat(e.target.value);
                this.updateProcessTimeDisplay();
            });
        }
        
        // 时间控制按钮
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }
        
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pause());
        }
        
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetProcess());
        }
        
        // 测量工具按钮
        const measureSizeBtn = document.getElementById('measureSize');
        if (measureSizeBtn) {
            measureSizeBtn.addEventListener('click', () => this.measureCellSize());
        }
        
        const countCellsBtn = document.getElementById('countCells');
        if (countCellsBtn) {
            countCellsBtn.addEventListener('click', () => this.countCells());
        }
        
        const recordDataBtn = document.getElementById('recordData');
        if (recordDataBtn) {
            recordDataBtn.addEventListener('click', () => this.recordMeasurement());
        }
        
        const clearDataBtn = document.getElementById('clearData');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.clearMeasurements());
        }
    }
    
    changeExperiment(experiment) {
        this.currentExperiment = experiment;
        
        // 根据实验类型调整参数
        switch(experiment) {
            case 'cell_observation':
                this.specimenType = 'onion_cell';
                this.magnification = 400;
                break;
            case 'mitosis':
                this.specimenType = 'dividing_cell';
                this.magnification = 1000;
                break;
            case 'bacteria':
                this.specimenType = 'bacteria';
                this.magnification = 1000;
                break;
            case 'blood_cells':
                this.specimenType = 'blood_cell';
                this.magnification = 400;
                break;
        }
        
        this.initializeCells();
        this.updateDisplay();
        this.render();
    }
    
    initializeCells() {
        this.cells = [];
        
        for (let i = 0; i < this.cellCount; i++) {
            const cell = {
                x: Math.random() * (this.microscopeCanvas?.width || 600),
                y: Math.random() * (this.microscopeCanvas?.height || 400),
                size: this.cellSize + Math.random() * 10,
                type: this.specimenType,
                phase: Math.random() * 4, // 细胞分裂阶段
                organelles: this.generateOrganelles()
            };
            this.cells.push(cell);
        }
    }
    
    generateOrganelles() {
        const organelles = [];
        const organelleTypes = ['nucleus', 'mitochondria', 'chloroplast', 'vacuole'];
        
        organelleTypes.forEach(type => {
            if (Math.random() > 0.3) {
                organelles.push({
                    type: type,
                    x: (Math.random() - 0.5) * 0.8,
                    y: (Math.random() - 0.5) * 0.8,
                    size: Math.random() * 0.3 + 0.1
                });
            }
        });
        
        return organelles;
    }
    
    handleMicroscopeMouseMove(e) {
        const rect = this.microscopeCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 更新标本信息
        this.updateSpecimenInfo(x, y);
    }
    
    handleMicroscopeClick(e) {
        const rect = this.microscopeCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 检查是否点击了细胞
        const clickedCell = this.findCellAtPosition(x, y);
        if (clickedCell) {
            this.selectCell(clickedCell);
        }
    }
    
    handleMolecularMouseDown(e) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    }
    
    handleMolecularMouseMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        
        this.moleculeRotation.y += deltaX * 0.01;
        this.moleculeRotation.x += deltaY * 0.01;
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        this.updateRotationDisplay();
        this.render();
    }
    
    handleMolecularMouseUp(e) {
        this.isDragging = false;
    }
    
    findCellAtPosition(x, y) {
        return this.cells.find(cell => {
            const distance = Math.sqrt((x - cell.x) ** 2 + (y - cell.y) ** 2);
            return distance < cell.size;
        });
    }
    
    selectCell(cell) {
        this.selectedCell = cell;
        this.updateCellInfo(cell);
    }
    
    measureCellSize() {
        if (this.selectedCell) {
            const actualSize = this.selectedCell.size * (100 / this.magnification);
            this.currentMeasurement.cellSize = actualSize;
            this.updateMeasurementDisplay();
        }
    }
    
    countCells() {
        const visibleCells = this.cells.filter(cell => 
            cell.x >= 0 && cell.x <= this.microscopeCanvas.width &&
            cell.y >= 0 && cell.y <= this.microscopeCanvas.height
        );
        this.currentMeasurement.cellCount = visibleCells.length;
        this.updateMeasurementDisplay();
    }
    
    recordMeasurement() {
        const measurement = {
            timestamp: new Date(),
            experiment: this.currentExperiment,
            magnification: this.magnification,
            ...this.currentMeasurement
        };
        
        this.measurements.push(measurement);
        this.updateRecordedDataDisplay();
    }
    
    clearMeasurements() {
        this.measurements = [];
        this.currentMeasurement = {
            cellSize: 0,
            cellCount: 0,
            concentration: 0,
            temperature: 25,
            ph: 7.0
        };
        this.updateMeasurementDisplay();
        this.updateRecordedDataDisplay();
    }
    
    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.isProcessRunning = this.isPlaying;
        
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.textContent = this.isPlaying ? '暂停' : '播放';
        }
    }
    
    pause() {
        this.isPlaying = false;
        this.isProcessRunning = false;
        
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.textContent = '播放';
        }
    }
    
    resetProcess() {
        this.processTime = 0;
        this.isPlaying = false;
        this.isProcessRunning = false;
        
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.textContent = '播放';
        }
        
        const timelineSlider = document.getElementById('processTimeline');
        if (timelineSlider) {
            timelineSlider.value = 0;
        }
        
        this.updateProcessTimeDisplay();
        this.render();
    }
    
    startAnimation() {
        const animate = (currentTime) => {
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            if (this.isProcessRunning) {
                this.updateProcess(deltaTime);
            }
            
            // 更新细胞分裂动画
            if (this.currentExperiment === 'mitosis') {
                this.updateMitosis(deltaTime);
            }
            
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    updateProcess(deltaTime) {
        this.processTime += deltaTime * this.processSpeed * 0.001;
        
        const timelineSlider = document.getElementById('processTimeline');
        if (timelineSlider) {
            timelineSlider.value = Math.min(this.processTime, 100);
        }
        
        this.updateProcessTimeDisplay();
        
        if (this.processTime >= 100) {
            this.pause();
        }
    }
    
    updateMitosis(deltaTime) {
        this.cells.forEach(cell => {
            if (cell.type === 'dividing_cell') {
                cell.phase += deltaTime * 0.001;
                if (cell.phase > 4) {
                    cell.phase = 0;
                }
            }
        });
    }
    
    render() {
        this.renderMicroscope();
        this.renderMolecularModel();
        this.renderBiochemicalProcess();
    }
    
    renderMicroscope() {
        if (!this.microscopeCtx) return;
        
        const ctx = this.microscopeCtx;
        const canvas = this.microscopeCanvas;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景
        const focusBlur = Math.abs(this.focus - 50) / 10;
        ctx.filter = `blur(${focusBlur}px)`;
        
        // 绘制视野圆圈
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const viewRadius = Math.min(canvas.width, canvas.height) / 2 - 20;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, viewRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.getBackgroundColor();
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 绘制细胞
        this.cells.forEach(cell => {
            this.drawCell(ctx, cell);
        });
        
        // 重置滤镜
        ctx.filter = 'none';
        
        // 绘制刻度尺
        this.drawScale(ctx, canvas);
    }
    
    getBackgroundColor() {
        let color = '#f0f0f0';
        
        // 根据染色调整背景色
        if (this.staining.methylene_blue) {
            color = '#e6f3ff';
        } else if (this.staining.iodine) {
            color = '#fff8e6';
        } else if (this.staining.congo_red) {
            color = '#ffe6e6';
        }
        
        // 根据照明调整亮度
        const brightness = this.illumination / 100;
        const rgb = this.hexToRgb(color);
        const adjustedColor = `rgb(${Math.floor(rgb.r * brightness)}, ${Math.floor(rgb.g * brightness)}, ${Math.floor(rgb.b * brightness)})`;
        
        return adjustedColor;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 240, g: 240, b: 240 };
    }
    
    drawCell(ctx, cell) {
        const scaleFactor = this.magnification / 100;
        const cellRadius = cell.size * scaleFactor;
        
        // 细胞膜
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cellRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.getCellColor(cell);
        ctx.fill();
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制细胞器
        cell.organelles.forEach(organelle => {
            this.drawOrganelle(ctx, cell, organelle, cellRadius);
        });
        
        // 细胞分裂阶段
        if (cell.type === 'dividing_cell') {
            this.drawMitosisPhase(ctx, cell, cellRadius);
        }
    }
    
    getCellColor(cell) {
        let baseColor = '#e6ffe6';
        
        switch(cell.type) {
            case 'onion_cell':
                baseColor = '#f0f8e6';
                break;
            case 'blood_cell':
                baseColor = '#ffe6e6';
                break;
            case 'bacteria':
                baseColor = '#e6f0ff';
                break;
            case 'dividing_cell':
                baseColor = '#ffe6f0';
                break;
        }
        
        // 应用染色效果
        if (this.staining.methylene_blue) {
            baseColor = '#cce6ff';
        } else if (this.staining.iodine) {
            baseColor = '#ffeb99';
        } else if (this.staining.congo_red) {
            baseColor = '#ffcccc';
        }
        
        return baseColor;
    }
    
    drawOrganelle(ctx, cell, organelle, cellRadius) {
        const organelleX = cell.x + organelle.x * cellRadius;
        const organelleY = cell.y + organelle.y * cellRadius;
        const organelleSize = organelle.size * cellRadius;
        
        ctx.beginPath();
        ctx.arc(organelleX, organelleY, organelleSize, 0, 2 * Math.PI);
        
        switch(organelle.type) {
            case 'nucleus':
                ctx.fillStyle = '#4a90e2';
                break;
            case 'mitochondria':
                ctx.fillStyle = '#f39c12';
                break;
            case 'chloroplast':
                ctx.fillStyle = '#27ae60';
                break;
            case 'vacuole':
                ctx.fillStyle = '#9b59b6';
                break;
        }
        
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    drawMitosisPhase(ctx, cell, cellRadius) {
        const phase = Math.floor(cell.phase);
        
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        
        switch(phase) {
            case 0: // 间期
                break;
            case 1: // 前期
                this.drawChromosomes(ctx, cell, cellRadius, 'condensing');
                break;
            case 2: // 中期
                this.drawChromosomes(ctx, cell, cellRadius, 'aligned');
                break;
            case 3: // 后期
                this.drawChromosomes(ctx, cell, cellRadius, 'separating');
                break;
            case 4: // 末期
                this.drawCellDivision(ctx, cell, cellRadius);
                break;
        }
    }
    
    drawChromosomes(ctx, cell, cellRadius, stage) {
        const chromosomeCount = 8;
        
        for (let i = 0; i < chromosomeCount; i++) {
            const angle = (i / chromosomeCount) * 2 * Math.PI;
            let x, y;
            
            switch(stage) {
                case 'condensing':
                    x = cell.x + Math.cos(angle) * cellRadius * 0.3;
                    y = cell.y + Math.sin(angle) * cellRadius * 0.3;
                    break;
                case 'aligned':
                    x = cell.x + Math.cos(angle) * cellRadius * 0.1;
                    y = cell.y;
                    break;
                case 'separating':
                    x = cell.x + Math.cos(angle) * cellRadius * 0.5;
                    y = cell.y + Math.sin(angle) * cellRadius * 0.2;
                    break;
            }
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#e74c3c';
            ctx.fill();
        }
    }
    
    drawCellDivision(ctx, cell, cellRadius) {
        // 绘制分裂沟
        ctx.beginPath();
        ctx.moveTo(cell.x - cellRadius, cell.y);
        ctx.lineTo(cell.x + cellRadius, cell.y);
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    drawScale(ctx, canvas) {
        const scaleLength = 100 / (this.magnification / 100); // 100微米的像素长度
        const scaleX = canvas.width - 120;
        const scaleY = canvas.height - 30;
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(scaleX, scaleY);
        ctx.lineTo(scaleX + scaleLength, scaleY);
        ctx.stroke();
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText('100 μm', scaleX, scaleY - 5);
    }
    
    renderMolecularModel() {
        if (!this.molecularCtx) return;
        
        const ctx = this.molecularCtx;
        const canvas = this.molecularCanvas;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景
        const gradient = ctx.createRadialGradient(
            canvas.width/2, canvas.height/2, 0,
            canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)
        );
        gradient.addColorStop(0, '#f8f9fa');
        gradient.addColorStop(1, '#e9ecef');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制分子模型
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        switch(this.moleculeType) {
            case 'dna':
                this.drawDNA(ctx, centerX, centerY);
                break;
            case 'protein':
                this.drawProtein(ctx, centerX, centerY);
                break;
            case 'glucose':
                this.drawGlucose(ctx, centerX, centerY);
                break;
            case 'atp':
                this.drawATP(ctx, centerX, centerY);
                break;
        }
    }
    
    drawDNA(ctx, centerX, centerY) {
        const helixRadius = 50 * this.moleculeScale;
        const helixHeight = 200 * this.moleculeScale;
        const turns = 3;
        
        // 绘制双螺旋
        for (let strand = 0; strand < 2; strand++) {
            ctx.strokeStyle = strand === 0 ? '#3498db' : '#e74c3c';
            ctx.lineWidth = 4;
            ctx.beginPath();
            
            for (let i = 0; i <= 100; i++) {
                const t = i / 100;
                const angle = t * turns * 2 * Math.PI + strand * Math.PI + this.moleculeRotation.y;
                const y = centerY - helixHeight/2 + t * helixHeight;
                const x = centerX + Math.cos(angle) * helixRadius;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        
        // 绘制碱基对
        if (this.showBonds) {
            ctx.strokeStyle = '#95a5a6';
            ctx.lineWidth = 2;
            
            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                const angle1 = t * turns * 2 * Math.PI + this.moleculeRotation.y;
                const angle2 = angle1 + Math.PI;
                const y = centerY - helixHeight/2 + t * helixHeight;
                const x1 = centerX + Math.cos(angle1) * helixRadius;
                const x2 = centerX + Math.cos(angle2) * helixRadius;
                
                ctx.beginPath();
                ctx.moveTo(x1, y);
                ctx.lineTo(x2, y);
                ctx.stroke();
            }
        }
    }
    
    drawProtein(ctx, centerX, centerY) {
        // 绘制蛋白质折叠结构
        const scale = this.moleculeScale;
        const segments = 20;
        
        ctx.strokeStyle = '#9b59b6';
        ctx.lineWidth = 6;
        ctx.beginPath();
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const angle = t * 4 * Math.PI + this.moleculeRotation.y;
            const radius = 30 + Math.sin(t * 6 * Math.PI) * 20;
            const x = centerX + Math.cos(angle) * radius * scale;
            const y = centerY + Math.sin(angle) * radius * scale + Math.sin(t * 8 * Math.PI) * 30 * scale;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // 绘制氨基酸残基
        ctx.fillStyle = '#8e44ad';
        for (let i = 0; i < segments; i += 2) {
            const t = i / segments;
            const angle = t * 4 * Math.PI + this.moleculeRotation.y;
            const radius = 30 + Math.sin(t * 6 * Math.PI) * 20;
            const x = centerX + Math.cos(angle) * radius * scale;
            const y = centerY + Math.sin(angle) * radius * scale + Math.sin(t * 8 * Math.PI) * 30 * scale;
            
            ctx.beginPath();
            ctx.arc(x, y, 5 * scale, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
    drawGlucose(ctx, centerX, centerY) {
        // 绘制葡萄糖环状结构
        const scale = this.moleculeScale;
        const radius = 40 * scale;
        const atoms = 6;
        
        // 绘制碳环
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 4;
        ctx.beginPath();
        
        for (let i = 0; i <= atoms; i++) {
            const angle = (i / atoms) * 2 * Math.PI + this.moleculeRotation.y;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // 绘制原子
        for (let i = 0; i < atoms; i++) {
            const angle = (i / atoms) * 2 * Math.PI + this.moleculeRotation.y;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.arc(x, y, 8 * scale, 0, 2 * Math.PI);
            ctx.fillStyle = i === 5 ? '#e74c3c' : '#2c3e50'; // 氧原子为红色
            ctx.fill();
            
            if (this.showLabels) {
                ctx.fillStyle = '#333';
                ctx.font = `${12 * scale}px Arial`;
                ctx.fillText(i === 5 ? 'O' : 'C', x - 4, y + 4);
            }
        }
    }
    
    drawATP(ctx, centerX, centerY) {
        // 绘制ATP分子结构
        const scale = this.moleculeScale;
        
        // 腺嘌呤环
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(centerX - 60 * scale, centerY, 20 * scale, 0, 2 * Math.PI);
        ctx.fill();
        
        // 核糖
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15 * scale, 0, 2 * Math.PI);
        ctx.fill();
        
        // 磷酸基团
        const phosphatePositions = [30, 60, 90];
        phosphatePositions.forEach((pos, index) => {
            ctx.fillStyle = index === 2 ? '#e74c3c' : '#27ae60'; // 高能磷酸键为红色
            ctx.beginPath();
            ctx.arc(centerX + pos * scale, centerY, 12 * scale, 0, 2 * Math.PI);
            ctx.fill();
            
            // 连接线
            if (index === 0) {
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(centerX + 15 * scale, centerY);
                ctx.lineTo(centerX + pos * scale - 12 * scale, centerY);
                ctx.stroke();
            } else {
                ctx.strokeStyle = index === 2 ? '#e74c3c' : '#27ae60';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(centerX + (pos - 30) * scale + 12 * scale, centerY);
                ctx.lineTo(centerX + pos * scale - 12 * scale, centerY);
                ctx.stroke();
            }
        });
        
        // 标签
        if (this.showLabels) {
            ctx.fillStyle = '#333';
            ctx.font = `${14 * scale}px Arial`;
            ctx.fillText('腺嘌呤', centerX - 80 * scale, centerY - 30 * scale);
            ctx.fillText('核糖', centerX - 20 * scale, centerY - 30 * scale);
            ctx.fillText('磷酸', centerX + 40 * scale, centerY - 30 * scale);
        }
    }
    
    renderBiochemicalProcess() {
        if (!this.processCtx) return;
        
        const ctx = this.processCtx;
        const canvas = this.processCanvas;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 根据过程类型绘制
        switch(this.processType) {
            case 'photosynthesis':
                this.drawPhotosynthesis(ctx, canvas);
                break;
            case 'cellular_respiration':
                this.drawCellularRespiration(ctx, canvas);
                break;
            case 'protein_synthesis':
                this.drawProteinSynthesis(ctx, canvas);
                break;
            case 'enzyme_reaction':
                this.drawEnzymeReaction(ctx, canvas);
                break;
        }
    }
    
    drawPhotosynthesis(ctx, canvas) {
        const progress = this.processTime / 100;
        
        // 绘制叶绿体
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.ellipse(150, canvas.height/2, 80, 40, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // 阳光
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
            const x = 50 + i * 20;
            const y = 50 + Math.sin(progress * Math.PI + i) * 10;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 50, y + 50);
            ctx.stroke();
        }
        
        // CO2 输入
        if (progress > 0.2) {
            ctx.fillStyle = '#95a5a6';
            ctx.font = '16px Arial';
            ctx.fillText('CO₂', 50, canvas.height/2 - 20);
            
            // 箭头
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(80, canvas.height/2 - 10);
            ctx.lineTo(120, canvas.height/2 - 10);
            ctx.lineTo(115, canvas.height/2 - 15);
            ctx.moveTo(120, canvas.height/2 - 10);
            ctx.lineTo(115, canvas.height/2 - 5);
            ctx.stroke();
        }
        
        // H2O 输入
        if (progress > 0.4) {
            ctx.fillStyle = '#3498db';
            ctx.font = '16px Arial';
            ctx.fillText('H₂O', 50, canvas.height/2 + 40);
            
            // 箭头
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(80, canvas.height/2 + 30);
            ctx.lineTo(120, canvas.height/2 + 20);
            ctx.lineTo(115, canvas.height/2 + 15);
            ctx.moveTo(120, canvas.height/2 + 20);
            ctx.lineTo(115, canvas.height/2 + 25);
            ctx.stroke();
        }
        
        // 葡萄糖输出
        if (progress > 0.6) {
            ctx.fillStyle = '#e67e22';
            ctx.font = '16px Arial';
            ctx.fillText('C₆H₁₂O₆', 280, canvas.height/2 - 20);
            
            // 箭头
            ctx.strokeStyle = '#27ae60';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(230, canvas.height/2 - 10);
            ctx.lineTo(270, canvas.height/2 - 10);
            ctx.lineTo(265, canvas.height/2 - 15);
            ctx.moveTo(270, canvas.height/2 - 10);
            ctx.lineTo(265, canvas.height/2 - 5);
            ctx.stroke();
        }
        
        // 氧气输出
        if (progress > 0.8) {
            ctx.fillStyle = '#e74c3c';
            ctx.font = '16px Arial';
            ctx.fillText('O₂', 280, canvas.height/2 + 40);
            
            // 箭头
            ctx.strokeStyle = '#27ae60';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(230, canvas.height/2 + 30);
            ctx.lineTo(270, canvas.height/2 + 30);
            ctx.lineTo(265, canvas.height/2 + 25);
            ctx.moveTo(270, canvas.height/2 + 30);
            ctx.lineTo(265, canvas.height/2 + 35);
            ctx.stroke();
        }
    }
    
    drawCellularRespiration(ctx, canvas) {
        const progress = this.processTime / 100;
        
        // 绘制线粒体
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.ellipse(canvas.width/2, canvas.height/2, 100, 50, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // 内膜褶皱
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const x = canvas.width/2 - 80 + i * 40;
            ctx.beginPath();
            ctx.moveTo(x, canvas.height/2 - 30);
            ctx.quadraticCurveTo(x + 10, canvas.height/2, x + 20, canvas.height/2 - 30);
            ctx.stroke();
        }
        
        // 显示呼吸过程的各个阶段
        if (progress > 0.25) {
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.fillText('糖酵解', 50, 50);
        }
        
        if (progress > 0.5) {
            ctx.fillText('柠檬酸循环', 200, 50);
        }
        
        if (progress > 0.75) {
            ctx.fillText('电子传递链', 350, 50);
        }
    }
    
    drawProteinSynthesis(ctx, canvas) {
        const progress = this.processTime / 100;
        
        // 绘制核糖体
        ctx.fillStyle = '#9b59b6';
        ctx.beginPath();
        ctx.arc(150, canvas.height/2, 30, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(180, canvas.height/2 - 20, 25, 0, 2 * Math.PI);
        ctx.fill();
        
        // mRNA
        if (progress > 0.2) {
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(50, canvas.height/2);
            ctx.lineTo(300, canvas.height/2);
            ctx.stroke();
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText('mRNA', 60, canvas.height/2 - 10);
        }
        
        // tRNA
        if (progress > 0.4) {
            for (let i = 0; i < 3; i++) {
                const x = 200 + i * 40;
                const y = canvas.height/2 + 40;
                
                ctx.fillStyle = '#27ae60';
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, 2 * Math.PI);
                ctx.fill();
                
                // 连接线
                ctx.strokeStyle = '#27ae60';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, y - 8);
                ctx.lineTo(x, canvas.height/2 + 8);
                ctx.stroke();
            }
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText('tRNA', 210, canvas.height/2 + 60);
        }
        
        // 蛋白质链
        if (progress > 0.6) {
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 6;
            ctx.beginPath();
            
            const chainLength = progress * 200;
            for (let i = 0; i <= chainLength; i += 10) {
                const x = 300 + i;
                const y = canvas.height/2 + Math.sin(i * 0.1) * 20;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText('蛋白质', 350, canvas.height/2 - 30);
        }
    }
    
    drawEnzymeReaction(ctx, canvas) {
        const progress = this.processTime / 100;
        
        // 酶
        ctx.fillStyle = '#8e44ad';
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 40, 0, 2 * Math.PI);
        ctx.fill();
        
        // 活性位点
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(canvas.width/2 + 20, canvas.height/2, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        // 底物
        if (progress < 0.5) {
            const substrateX = 100 + progress * 200;
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.arc(substrateX, canvas.height/2, 20, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // 产物
        if (progress > 0.5) {
            const productX = canvas.width/2 + 60 + (progress - 0.5) * 200;
            ctx.fillStyle = '#27ae60';
            ctx.beginPath();
            ctx.arc(productX, canvas.height/2, 18, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // 标签
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.fillText('酶', canvas.width/2 - 10, canvas.height/2 - 50);
        
        if (progress < 0.3) {
            ctx.fillText('底物', 80, canvas.height/2 - 30);
        } else if (progress > 0.7) {
            ctx.fillText('产物', canvas.width - 80, canvas.height/2 - 30);
        }
    }
    
    updateDisplay() {
        this.updateMagnificationDisplay();
        this.updateFocusDisplay();
        this.updateIlluminationDisplay();
        this.updateRotationDisplay();
        this.updateScaleDisplay();
        this.updateProcessSpeedDisplay();
        this.updateProcessTimeDisplay();
        this.updateMeasurementDisplay();
    }
    
    updateMagnificationDisplay() {
        const display = document.getElementById('magnificationValue');
        if (display) {
            display.textContent = this.magnification + 'x';
        }
    }
    
    updateFocusDisplay() {
        const display = document.getElementById('focusValue');
        if (display) {
            display.textContent = this.focus + '%';
        }
    }
    
    updateIlluminationDisplay() {
        const display = document.getElementById('illuminationValue');
        if (display) {
            display.textContent = this.illumination + '%';
        }
    }
    
    updateRotationDisplay() {
        const xDisplay = document.getElementById('rotationXValue');
        if (xDisplay) {
            xDisplay.textContent = this.moleculeRotation.x.toFixed(1) + '°';
        }
        
        const yDisplay = document.getElementById('rotationYValue');
        if (yDisplay) {
            yDisplay.textContent = this.moleculeRotation.y.toFixed(1) + '°';
        }
    }
    
    updateScaleDisplay() {
        const display = document.getElementById('scaleValue');
        if (display) {
            display.textContent = this.moleculeScale.toFixed(1) + 'x';
        }
    }
    
    updateProcessSpeedDisplay() {
        const display = document.getElementById('processSpeedValue');
        if (display) {
            display.textContent = this.processSpeed.toFixed(1) + 'x';
        }
    }
    
    updateProcessTimeDisplay() {
        const display = document.getElementById('processTimeValue');
        if (display) {
            display.textContent = this.processTime.toFixed(1) + '%';
        }
    }
    
    updateMeasurementDisplay() {
        const cellSizeDisplay = document.getElementById('cellSizeValue');
        if (cellSizeDisplay) {
            cellSizeDisplay.textContent = this.currentMeasurement.cellSize.toFixed(2) + ' μm';
        }
        
        const cellCountDisplay = document.getElementById('cellCountValue');
        if (cellCountDisplay) {
            cellCountDisplay.textContent = this.currentMeasurement.cellCount.toString();
        }
        
        const concentrationDisplay = document.getElementById('concentrationValue');
        if (concentrationDisplay) {
            concentrationDisplay.textContent = this.currentMeasurement.concentration.toFixed(2) + ' mol/L';
        }
        
        const temperatureDisplay = document.getElementById('temperatureValue');
        if (temperatureDisplay) {
            temperatureDisplay.textContent = this.currentMeasurement.temperature.toFixed(1) + '°C';
        }
        
        const phDisplay = document.getElementById('phValue');
        if (phDisplay) {
            phDisplay.textContent = this.currentMeasurement.ph.toFixed(1);
        }
    }
    
    updateSpecimenInfo(x, y) {
        const info = document.querySelector('.specimen-info');
        if (info) {
            info.textContent = `坐标: (${x.toFixed(0)}, ${y.toFixed(0)}) | 放大倍数: ${this.magnification}x`;
        }
    }
    
    updateCellInfo(cell) {
        // 更新选中细胞的详细信息
        this.currentMeasurement.cellSize = cell.size * (100 / this.magnification);
        this.updateMeasurementDisplay();
    }
    
    updateRecordedDataDisplay() {
        const container = document.querySelector('.recorded-data');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.measurements.slice(-5).forEach((measurement, index) => {
            const item = document.createElement('div');
            item.className = 'data-item';
            item.innerHTML = `
                <label>记录 ${this.measurements.length - 4 + index}</label>
                <span>${measurement.cellSize.toFixed(2)} μm, ${measurement.cellCount} 个细胞</span>
            `;
            container.appendChild(item);
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.biologyDemo = new BiologyDemo();
});

// 窗口大小改变时重新调整画布
window.addEventListener('resize', () => {
    if (window.biologyDemo) {
        window.biologyDemo.setupCanvas();
        window.biologyDemo.render();
    }
});