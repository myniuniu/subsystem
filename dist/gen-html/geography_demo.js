// 地理演示教学JavaScript交互
class GeographyDemo {
    constructor() {
        this.earthCanvas = null;
        this.sectionCanvas = null;
        this.climateCanvas = null;
        this.earthCtx = null;
        this.sectionCtx = null;
        this.climateCtx = null;
        
        // 地球参数
        this.earthRadius = 150;
        this.earthRotation = { x: 0, y: 0, z: 0 };
        this.earthTilt = 23.5;
        this.earthSpeed = 1;
        this.zoomLevel = 1;
        
        // 视图控制
        this.currentView = 'globe';
        this.showAtmosphere = true;
        this.showOceans = true;
        this.showContinents = true;
        this.showClimate = false;
        this.showTectonics = false;
        
        // 时间控制
        this.timeScale = 'realtime';
        this.timeSpeed = 1;
        this.isPlaying = false;
        this.currentTime = new Date();
        
        // 测量工具
        this.measurementMode = null;
        this.measurementPoints = [];
        this.measurements = {
            distance: 0,
            area: 0,
            coordinates: { lat: 0, lng: 0 }
        };
        
        // 地理数据
        this.geoData = {
            temperature: 15,
            humidity: 60,
            pressure: 1013,
            windSpeed: 10,
            elevation: 0
        };
        
        // 动画控制
        this.animationId = null;
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupControls();
        this.startAnimation();
        this.updateDisplay();
    }
    
    setupCanvas() {
        // 主地球画布
        this.earthCanvas = document.getElementById('earthCanvas');
        if (this.earthCanvas) {
            this.earthCtx = this.earthCanvas.getContext('2d');
            this.earthCanvas.width = 600;
            this.earthCanvas.height = 400;
            
            // 添加鼠标事件
            this.earthCanvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.earthCanvas.addEventListener('click', (e) => this.handleCanvasClick(e));
            this.earthCanvas.addEventListener('wheel', (e) => this.handleWheel(e));
        }
        
        // 剖面图画布
        this.sectionCanvas = document.getElementById('sectionCanvas');
        if (this.sectionCanvas) {
            this.sectionCtx = this.sectionCanvas.getContext('2d');
            this.sectionCanvas.width = 600;
            this.sectionCanvas.height = 300;
        }
        
        // 气候图表画布
        this.climateCanvas = document.getElementById('climateCanvas');
        if (this.climateCanvas) {
            this.climateCtx = this.climateCanvas.getContext('2d');
            this.climateCanvas.width = 600;
            this.climateCanvas.height = 250;
        }
    }
    
    setupControls() {
        // 地理主题选择
        const topicSelect = document.getElementById('geoTopic');
        if (topicSelect) {
            topicSelect.addEventListener('change', (e) => {
                this.changeGeographyTopic(e.target.value);
            });
        }
        
        // 地球参数控制
        const tiltSlider = document.getElementById('earthTilt');
        if (tiltSlider) {
            tiltSlider.addEventListener('input', (e) => {
                this.earthTilt = parseFloat(e.target.value);
                this.updateTiltDisplay();
            });
        }
        
        const speedSlider = document.getElementById('earthSpeed');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.earthSpeed = parseFloat(e.target.value);
                this.updateSpeedDisplay();
            });
        }
        
        // 视图控制按钮
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeView(e.target.dataset.view);
            });
        });
        
        // 缩放控制
        const zoomSlider = document.getElementById('zoomLevel');
        if (zoomSlider) {
            zoomSlider.addEventListener('input', (e) => {
                this.zoomLevel = parseFloat(e.target.value);
                this.updateZoomDisplay();
            });
        }
        
        // 旋转控制
        const rotationXSlider = document.getElementById('rotationX');
        if (rotationXSlider) {
            rotationXSlider.addEventListener('input', (e) => {
                this.earthRotation.x = parseFloat(e.target.value);
                this.updateRotationDisplay();
            });
        }
        
        const rotationYSlider = document.getElementById('rotationY');
        if (rotationYSlider) {
            rotationYSlider.addEventListener('input', (e) => {
                this.earthRotation.y = parseFloat(e.target.value);
                this.updateRotationDisplay();
            });
        }
        
        // 图层控制
        const layerCheckboxes = document.querySelectorAll('.layer-checkbox');
        layerCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleLayer(e.target.dataset.layer, e.target.checked);
            });
        });
        
        // 时间控制
        const timeScaleSelect = document.getElementById('timeScale');
        if (timeScaleSelect) {
            timeScaleSelect.addEventListener('change', (e) => {
                this.timeScale = e.target.value;
                this.updateTimeScale();
            });
        }
        
        const timeSpeedSlider = document.getElementById('timeSpeed');
        if (timeSpeedSlider) {
            timeSpeedSlider.addEventListener('input', (e) => {
                this.timeSpeed = parseFloat(e.target.value);
                this.updateTimeSpeedDisplay();
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
            resetBtn.addEventListener('click', () => this.resetTime());
        }
        
        // 测量工具按钮
        const measureDistanceBtn = document.getElementById('measureDistance');
        if (measureDistanceBtn) {
            measureDistanceBtn.addEventListener('click', () => this.setMeasurementMode('distance'));
        }
        
        const measureAreaBtn = document.getElementById('measureArea');
        if (measureAreaBtn) {
            measureAreaBtn.addEventListener('click', () => this.setMeasurementMode('area'));
        }
        
        const clearMeasurementsBtn = document.getElementById('clearMeasurements');
        if (clearMeasurementsBtn) {
            clearMeasurementsBtn.addEventListener('click', () => this.clearMeasurements());
        }
    }
    
    changeGeographyTopic(topic) {
        // 根据主题切换显示内容
        switch(topic) {
            case 'climate':
                this.showClimate = true;
                this.showTectonics = false;
                break;
            case 'tectonics':
                this.showTectonics = true;
                this.showClimate = false;
                break;
            case 'weather':
                this.showClimate = true;
                this.showTectonics = false;
                break;
            case 'oceans':
                this.showOceans = true;
                this.showContinents = true;
                break;
            default:
                this.showClimate = false;
                this.showTectonics = false;
        }
        this.render();
    }
    
    changeView(view) {
        this.currentView = view;
        
        // 更新按钮状态
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        this.render();
    }
    
    toggleLayer(layer, enabled) {
        switch(layer) {
            case 'atmosphere':
                this.showAtmosphere = enabled;
                break;
            case 'oceans':
                this.showOceans = enabled;
                break;
            case 'continents':
                this.showContinents = enabled;
                break;
            case 'climate':
                this.showClimate = enabled;
                break;
            case 'tectonics':
                this.showTectonics = enabled;
                break;
        }
        this.render();
    }
    
    setMeasurementMode(mode) {
        this.measurementMode = mode;
        this.measurementPoints = [];
        
        // 更新按钮状态
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (mode) {
            document.getElementById(`measure${mode.charAt(0).toUpperCase() + mode.slice(1)}`).classList.add('active');
        }
    }
    
    clearMeasurements() {
        this.measurementPoints = [];
        this.measurementMode = null;
        this.measurements = {
            distance: 0,
            area: 0,
            coordinates: { lat: 0, lng: 0 }
        };
        
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.updateMeasurementDisplay();
        this.render();
    }
    
    togglePlay() {
        this.isPlaying = !this.isPlaying;
        
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.textContent = this.isPlaying ? '暂停' : '播放';
        }
    }
    
    pause() {
        this.isPlaying = false;
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.textContent = '播放';
        }
    }
    
    resetTime() {
        this.currentTime = new Date();
        this.isPlaying = false;
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.textContent = '播放';
        }
        this.updateTimeDisplay();
    }
    
    updateTimeScale() {
        // 根据时间尺度调整时间推进速度
        switch(this.timeScale) {
            case 'geological':
                this.timeSpeed *= 1000000; // 地质时间尺度
                break;
            case 'historical':
                this.timeSpeed *= 365; // 历史时间尺度
                break;
            case 'seasonal':
                this.timeSpeed *= 30; // 季节时间尺度
                break;
            case 'daily':
                this.timeSpeed *= 1; // 日时间尺度
                break;
            default:
                this.timeSpeed = 1; // 实时
        }
    }
    
    handleMouseMove(e) {
        const rect = this.earthCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 计算地理坐标
        const coords = this.pixelToGeoCoordinates(x, y);
        this.measurements.coordinates = coords;
        
        // 更新地理数据
        this.updateGeoDataAtPoint(coords);
        this.updateCoordinateDisplay(coords);
        this.updateGeoDataDisplay();
    }
    
    handleCanvasClick(e) {
        if (!this.measurementMode) return;
        
        const rect = this.earthCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const coords = this.pixelToGeoCoordinates(x, y);
        this.measurementPoints.push(coords);
        
        if (this.measurementMode === 'distance' && this.measurementPoints.length === 2) {
            this.calculateDistance();
        } else if (this.measurementMode === 'area' && this.measurementPoints.length >= 3) {
            this.calculateArea();
        }
        
        this.render();
    }
    
    handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.zoomLevel = Math.max(0.5, Math.min(3, this.zoomLevel + delta));
        
        const zoomSlider = document.getElementById('zoomLevel');
        if (zoomSlider) {
            zoomSlider.value = this.zoomLevel;
        }
        
        this.updateZoomDisplay();
        this.render();
    }
    
    pixelToGeoCoordinates(x, y) {
        // 简化的像素到地理坐标转换
        const centerX = this.earthCanvas.width / 2;
        const centerY = this.earthCanvas.height / 2;
        
        const normalizedX = (x - centerX) / (this.earthRadius * this.zoomLevel);
        const normalizedY = (y - centerY) / (this.earthRadius * this.zoomLevel);
        
        const lng = normalizedX * 180;
        const lat = -normalizedY * 90;
        
        return {
            lat: Math.max(-90, Math.min(90, lat)),
            lng: Math.max(-180, Math.min(180, lng))
        };
    }
    
    calculateDistance() {
        if (this.measurementPoints.length < 2) return;
        
        const p1 = this.measurementPoints[0];
        const p2 = this.measurementPoints[1];
        
        // 使用Haversine公式计算距离
        const R = 6371; // 地球半径（公里）
        const dLat = this.toRadians(p2.lat - p1.lat);
        const dLng = this.toRadians(p2.lng - p1.lng);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.toRadians(p1.lat)) * Math.cos(this.toRadians(p2.lat)) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        this.measurements.distance = R * c;
        
        this.updateMeasurementDisplay();
    }
    
    calculateArea() {
        if (this.measurementPoints.length < 3) return;
        
        // 简化的面积计算
        let area = 0;
        const n = this.measurementPoints.length;
        
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += this.measurementPoints[i].lng * this.measurementPoints[j].lat;
            area -= this.measurementPoints[j].lng * this.measurementPoints[i].lat;
        }
        
        this.measurements.area = Math.abs(area) / 2 * 12364; // 转换为平方公里
        this.updateMeasurementDisplay();
    }
    
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    updateGeoDataAtPoint(coords) {
        // 模拟根据坐标更新地理数据
        this.geoData.temperature = 15 + Math.sin(this.toRadians(coords.lat)) * 20;
        this.geoData.humidity = 50 + Math.random() * 30;
        this.geoData.pressure = 1013 + (Math.random() - 0.5) * 50;
        this.geoData.windSpeed = Math.random() * 20;
        this.geoData.elevation = Math.sin(this.toRadians(coords.lng)) * 1000;
    }
    
    startAnimation() {
        const animate = (currentTime) => {
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            if (this.isPlaying) {
                this.updateTime(deltaTime);
            }
            
            // 自动旋转地球
            if (this.earthSpeed > 0) {
                this.earthRotation.y += this.earthSpeed * 0.01;
                if (this.earthRotation.y > 360) this.earthRotation.y -= 360;
            }
            
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    updateTime(deltaTime) {
        const timeIncrement = deltaTime * this.timeSpeed;
        this.currentTime = new Date(this.currentTime.getTime() + timeIncrement);
        this.updateTimeDisplay();
    }
    
    render() {
        this.renderEarth();
        this.renderCrossSection();
        this.renderClimateChart();
    }
    
    renderEarth() {
        if (!this.earthCtx) return;
        
        const ctx = this.earthCtx;
        const canvas = this.earthCanvas;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景
        const gradient = ctx.createRadialGradient(
            canvas.width/2, canvas.height/2, 0,
            canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)
        );
        gradient.addColorStop(0, '#001122');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制地球
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = this.earthRadius * this.zoomLevel;
        
        // 地球主体
        if (this.showOceans) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = '#4A90E2';
            ctx.fill();
        }
        
        // 大陆
        if (this.showContinents) {
            this.drawContinents(ctx, centerX, centerY, radius);
        }
        
        // 大气层
        if (this.showAtmosphere) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(135, 206, 250, 0.5)';
            ctx.lineWidth = 8;
            ctx.stroke();
        }
        
        // 气候数据
        if (this.showClimate) {
            this.drawClimateData(ctx, centerX, centerY, radius);
        }
        
        // 板块构造
        if (this.showTectonics) {
            this.drawTectonicPlates(ctx, centerX, centerY, radius);
        }
        
        // 测量点和线
        this.drawMeasurements(ctx, centerX, centerY, radius);
        
        // 坐标网格
        this.drawCoordinateGrid(ctx, centerX, centerY, radius);
    }
    
    drawContinents(ctx, centerX, centerY, radius) {
        ctx.fillStyle = '#8FBC8F';
        
        // 简化的大陆形状
        const continents = [
            { x: -0.3, y: 0.2, w: 0.4, h: 0.3 }, // 北美
            { x: 0.1, y: 0.1, w: 0.3, h: 0.4 },  // 欧亚
            { x: -0.1, y: -0.2, w: 0.2, h: 0.3 }, // 非洲
            { x: 0.3, y: -0.3, w: 0.2, h: 0.2 }   // 澳洲
        ];
        
        continents.forEach(continent => {
            const x = centerX + continent.x * radius;
            const y = centerY + continent.y * radius;
            const w = continent.w * radius;
            const h = continent.h * radius;
            
            ctx.beginPath();
            ctx.ellipse(x, y, w/2, h/2, 0, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    drawClimateData(ctx, centerX, centerY, radius) {
        // 绘制气候带
        const zones = [
            { y: -0.8, color: 'rgba(255, 255, 255, 0.7)' }, // 极地
            { y: -0.4, color: 'rgba(100, 149, 237, 0.7)' }, // 温带
            { y: 0, color: 'rgba(255, 165, 0, 0.7)' },      // 热带
            { y: 0.4, color: 'rgba(100, 149, 237, 0.7)' },  // 温带
            { y: 0.8, color: 'rgba(255, 255, 255, 0.7)' }   // 极地
        ];
        
        zones.forEach(zone => {
            const y = centerY + zone.y * radius;
            ctx.fillStyle = zone.color;
            ctx.fillRect(centerX - radius, y - 20, radius * 2, 40);
        });
    }
    
    drawTectonicPlates(ctx, centerX, centerY, radius) {
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 3;
        
        // 简化的板块边界
        const boundaries = [
            [{ x: -0.8, y: -0.2 }, { x: 0.8, y: 0.3 }],
            [{ x: -0.5, y: -0.8 }, { x: 0.2, y: 0.8 }],
            [{ x: 0.3, y: -0.6 }, { x: -0.4, y: 0.7 }]
        ];
        
        boundaries.forEach(boundary => {
            ctx.beginPath();
            boundary.forEach((point, index) => {
                const x = centerX + point.x * radius;
                const y = centerY + point.y * radius;
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        });
    }
    
    drawMeasurements(ctx, centerX, centerY, radius) {
        if (this.measurementPoints.length === 0) return;
        
        ctx.fillStyle = '#FF4444';
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 2;
        
        // 绘制测量点
        this.measurementPoints.forEach(point => {
            const x = centerX + (point.lng / 180) * radius;
            const y = centerY - (point.lat / 90) * radius;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // 绘制测量线
        if (this.measurementPoints.length > 1) {
            ctx.beginPath();
            this.measurementPoints.forEach((point, index) => {
                const x = centerX + (point.lng / 180) * radius;
                const y = centerY - (point.lat / 90) * radius;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            if (this.measurementMode === 'area' && this.measurementPoints.length > 2) {
                ctx.closePath();
            }
            
            ctx.stroke();
        }
    }
    
    drawCoordinateGrid(ctx, centerX, centerY, radius) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        
        // 经线
        for (let lng = -180; lng <= 180; lng += 30) {
            const x = centerX + (lng / 180) * radius;
            ctx.beginPath();
            ctx.moveTo(x, centerY - radius);
            ctx.lineTo(x, centerY + radius);
            ctx.stroke();
        }
        
        // 纬线
        for (let lat = -90; lat <= 90; lat += 30) {
            const y = centerY - (lat / 90) * radius;
            ctx.beginPath();
            ctx.moveTo(centerX - radius, y);
            ctx.lineTo(centerX + radius, y);
            ctx.stroke();
        }
    }
    
    renderCrossSection() {
        if (!this.sectionCtx) return;
        
        const ctx = this.sectionCtx;
        const canvas = this.sectionCanvas;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制地球剖面
        const layers = [
            { name: '地壳', thickness: 0.1, color: '#8B4513' },
            { name: '地幔', thickness: 0.7, color: '#FF6347' },
            { name: '外核', thickness: 0.15, color: '#FFD700' },
            { name: '内核', thickness: 0.05, color: '#FFA500' }
        ];
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        let currentRadius = Math.min(canvas.width, canvas.height) / 2 - 20;
        
        layers.forEach(layer => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI);
            ctx.fillStyle = layer.color;
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 标签
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.fillText(layer.name, centerX + currentRadius - 50, centerY - currentRadius + 20);
            
            currentRadius *= (1 - layer.thickness);
        });
    }
    
    renderClimateChart() {
        if (!this.climateCtx) return;
        
        const ctx = this.climateCtx;
        const canvas = this.climateCanvas;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制气候图表
        const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        const temperatures = [5, 8, 12, 18, 23, 28, 30, 29, 25, 19, 12, 7];
        const precipitation = [45, 38, 52, 68, 85, 120, 140, 135, 95, 75, 58, 48];
        
        const margin = 50;
        const chartWidth = canvas.width - 2 * margin;
        const chartHeight = canvas.height - 2 * margin;
        
        // 绘制坐标轴
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, margin + chartHeight);
        ctx.lineTo(margin + chartWidth, margin + chartHeight);
        ctx.stroke();
        
        // 绘制温度曲线
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        temperatures.forEach((temp, index) => {
            const x = margin + (index / (temperatures.length - 1)) * chartWidth;
            const y = margin + chartHeight - (temp / 35) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // 绘制降水柱状图
        ctx.fillStyle = 'rgba(74, 144, 226, 0.7)';
        precipitation.forEach((precip, index) => {
            const x = margin + (index / precipitation.length) * chartWidth;
            const barWidth = chartWidth / precipitation.length * 0.6;
            const barHeight = (precip / 150) * chartHeight;
            
            ctx.fillRect(x, margin + chartHeight - barHeight, barWidth, barHeight);
        });
        
        // 标签
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        months.forEach((month, index) => {
            const x = margin + (index / (months.length - 1)) * chartWidth;
            ctx.fillText(month, x - 10, margin + chartHeight + 20);
        });
    }
    
    updateDisplay() {
        this.updateTiltDisplay();
        this.updateSpeedDisplay();
        this.updateZoomDisplay();
        this.updateRotationDisplay();
        this.updateTimeSpeedDisplay();
        this.updateTimeDisplay();
        this.updateMeasurementDisplay();
        this.updateGeoDataDisplay();
    }
    
    updateTiltDisplay() {
        const display = document.getElementById('tiltValue');
        if (display) {
            display.textContent = this.earthTilt.toFixed(1) + '°';
        }
    }
    
    updateSpeedDisplay() {
        const display = document.getElementById('speedValue');
        if (display) {
            display.textContent = this.earthSpeed.toFixed(1) + 'x';
        }
    }
    
    updateZoomDisplay() {
        const display = document.getElementById('zoomValue');
        if (display) {
            display.textContent = this.zoomLevel.toFixed(1) + 'x';
        }
    }
    
    updateRotationDisplay() {
        const xDisplay = document.getElementById('rotationXValue');
        if (xDisplay) {
            xDisplay.textContent = this.earthRotation.x.toFixed(0) + '°';
        }
        
        const yDisplay = document.getElementById('rotationYValue');
        if (yDisplay) {
            yDisplay.textContent = this.earthRotation.y.toFixed(0) + '°';
        }
    }
    
    updateTimeSpeedDisplay() {
        const display = document.getElementById('timeSpeedValue');
        if (display) {
            display.textContent = this.timeSpeed.toFixed(1) + 'x';
        }
    }
    
    updateTimeDisplay() {
        const display = document.getElementById('currentTime');
        if (display) {
            display.textContent = this.currentTime.toLocaleString();
        }
    }
    
    updateMeasurementDisplay() {
        const distanceDisplay = document.getElementById('distanceValue');
        if (distanceDisplay) {
            distanceDisplay.textContent = this.measurements.distance.toFixed(2) + ' km';
        }
        
        const areaDisplay = document.getElementById('areaValue');
        if (areaDisplay) {
            areaDisplay.textContent = this.measurements.area.toFixed(2) + ' km²';
        }
    }
    
    updateCoordinateDisplay(coords) {
        const display = document.querySelector('.coordinate-info');
        if (display) {
            display.textContent = `纬度: ${coords.lat.toFixed(2)}°, 经度: ${coords.lng.toFixed(2)}°`;
        }
    }
    
    updateGeoDataDisplay() {
        const tempDisplay = document.getElementById('temperatureValue');
        if (tempDisplay) {
            tempDisplay.textContent = this.geoData.temperature.toFixed(1) + '°C';
        }
        
        const humidityDisplay = document.getElementById('humidityValue');
        if (humidityDisplay) {
            humidityDisplay.textContent = this.geoData.humidity.toFixed(1) + '%';
        }
        
        const pressureDisplay = document.getElementById('pressureValue');
        if (pressureDisplay) {
            pressureDisplay.textContent = this.geoData.pressure.toFixed(0) + ' hPa';
        }
        
        const windDisplay = document.getElementById('windSpeedValue');
        if (windDisplay) {
            windDisplay.textContent = this.geoData.windSpeed.toFixed(1) + ' m/s';
        }
        
        const elevationDisplay = document.getElementById('elevationValue');
        if (elevationDisplay) {
            elevationDisplay.textContent = this.geoData.elevation.toFixed(0) + ' m';
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.geographyDemo = new GeographyDemo();
});

// 窗口大小改变时重新调整画布
window.addEventListener('resize', () => {
    if (window.geographyDemo) {
        window.geographyDemo.setupCanvas();
        window.geographyDemo.render();
    }
});