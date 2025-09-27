class ConvexLensDemo {
    constructor() {
        // 基本参数
        this.focalLength = 10; // 焦距 (cm)
        this.objectDistance = 15; // 物距 (cm)
        this.imageDistance = 0; // 像距 (cm)
        this.magnification = 0; // 放大倍数
        
        // 画布参数
        this.canvasWidth = 800;
        this.canvasHeight = 500;
        this.lensX = 400; // 透镜位置
        this.scale = 4; // 像素/cm比例
        
        // 状态控制
        this.isDragging = false;
        this.showAnimation = true;
        
        this.initElements();
        this.bindEvents();
        this.updateDemo();
    }
    
    initElements() {
        // 控制元素
        this.focalSlider = document.getElementById('focalLength');
        this.objectSlider = document.getElementById('objectDistance');
        this.focalValue = document.getElementById('focalValue');
        this.objectValue = document.getElementById('objectValue');
        
        // 显示选项
        this.showRaysCheckbox = document.getElementById('showRays');
        this.showGridCheckbox = document.getElementById('showGrid');
        this.showLabelsCheckbox = document.getElementById('showLabels');
        this.showAnimationCheckbox = document.getElementById('showAnimation');
        
        // 快速按钮
        this.quickButtons = document.querySelectorAll('.quick-btn');
        
        // 信息显示
        this.imageDistanceSpan = document.getElementById('imageDistance');
        this.magnificationSpan = document.getElementById('magnification');
        this.imageNatureSpan = document.getElementById('imageNature');
        this.imagePositionSpan = document.getElementById('imagePosition');
        this.formulaCalculation = document.getElementById('formulaCalculation');
        
        // SVG元素
        this.svg = document.getElementById('lensCanvas');
        this.objectHandle = document.getElementById('objectHandle');
        this.gridPattern = document.getElementById('gridPattern');
        
        // 光线元素
        this.ray1 = document.getElementById('ray1');
        this.ray2 = document.getElementById('ray2');
        this.ray3 = document.getElementById('ray3');
        
        // 距离标注
        this.distanceLabels = document.getElementById('distanceLabels');
        
        // 添加动画类
        this.addAnimationClasses();
    }
    
    addAnimationClasses() {
        const animatedElements = [
            'objectGroup', 'imageGroup', 'rayGroup', 
            'focusPoints', 'distanceLabels'
        ];
        
        animatedElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('animate');
            }
        });
    }
    
    bindEvents() {
        // 滑块事件
        this.focalSlider.addEventListener('input', (e) => {
            this.focalLength = parseFloat(e.target.value);
            this.updateDemo();
        });
        
        this.objectSlider.addEventListener('input', (e) => {
            this.objectDistance = parseFloat(e.target.value);
            this.updateDemo();
        });
        
        // 快速按钮事件
        this.quickButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setQuickPosition(e.target.dataset.type);
                this.updateActiveButton(e.target);
            });
        });
        
        // 显示选项事件
        this.showRaysCheckbox.addEventListener('change', () => this.updateDisplay());
        this.showGridCheckbox.addEventListener('change', () => this.updateDisplay());
        this.showLabelsCheckbox.addEventListener('change', () => this.updateDisplay());
        this.showAnimationCheckbox.addEventListener('change', (e) => {
            this.showAnimation = e.target.checked;
            this.updateAnimationState();
        });
        
        // 拖拽事件
        this.bindDragEvents();
    }
    
    bindDragEvents() {
        let startX = 0;
        let startObjectDistance = 0;
        
        this.objectHandle.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            startX = e.clientX;
            startObjectDistance = this.objectDistance;
            this.objectHandle.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaDistance = -deltaX / this.scale; // 负号因为左移是减少距离
            
            this.objectDistance = Math.max(2, Math.min(80, startObjectDistance + deltaDistance));
            this.objectSlider.value = this.objectDistance;
            this.updateDemo();
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.objectHandle.style.cursor = 'grab';
                document.body.style.userSelect = '';
            }
        });
        
        // 触摸事件支持
        this.objectHandle.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            startX = e.touches[0].clientX;
            startObjectDistance = this.objectDistance;
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const deltaDistance = -deltaX / this.scale;
            
            this.objectDistance = Math.max(2, Math.min(80, startObjectDistance + deltaDistance));
            this.objectSlider.value = this.objectDistance;
            this.updateDemo();
            e.preventDefault();
        });
        
        document.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }
    
    setQuickPosition(type) {
        const f = this.focalLength;
        
        switch(type) {
            case 'far':
                this.objectDistance = f * 3; // u > 2f
                break;
            case 'middle':
                this.objectDistance = f * 1.5; // f < u < 2f
                break;
            case 'near':
                this.objectDistance = f * 0.7; // u < f
                break;
            case 'focus':
                this.objectDistance = f; // u = f
                break;
        }
        
        this.objectSlider.value = this.objectDistance;
        this.updateDemo();
    }
    
    updateActiveButton(activeBtn) {
        this.quickButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    
    calculateImageProperties() {
        const u = this.objectDistance;
        const f = this.focalLength;
        
        // 透镜公式: 1/f = 1/u + 1/v => v = (f * u) / (u - f)
        if (Math.abs(u - f) < 0.1) {
            this.imageDistance = Infinity;
            this.magnification = Infinity;
        } else {
            this.imageDistance = (f * u) / (u - f);
            this.magnification = -this.imageDistance / u; // 负号表示倒立
        }
    }
    
    getImageCharacteristics() {
        const u = this.objectDistance;
        const f = this.focalLength;
        const v = this.imageDistance;
        
        let nature, position;
        
        if (u > 2 * f) {
            nature = "倒立、缩小、实像";
            position = "透镜右侧";
        } else if (u > f && u < 2 * f) {
            nature = "倒立、放大、实像";
            position = "透镜右侧";
        } else if (u < f) {
            nature = "正立、放大、虚像";
            position = "透镜左侧";
        } else if (Math.abs(u - f) < 0.1) {
            nature = "不成像";
            position = "平行光线";
        } else if (Math.abs(u - 2 * f) < 0.1) {
            nature = "倒立、等大、实像";
            position = "透镜右侧";
        }
        
        return { nature, position };
    }
    
    updateDemo() {
        this.calculateImageProperties();
        this.updateValues();
        this.updateInformation();
        this.updateFormula();
        this.updateSVGElements();
        this.updateDisplay();
    }
    
    updateValues() {
        this.focalValue.textContent = `${this.focalLength} cm`;
        this.objectValue.textContent = `${this.objectDistance.toFixed(1)} cm`;
    }
    
    updateInformation() {
        const chars = this.getImageCharacteristics();
        
        this.imageDistanceSpan.textContent = 
            Math.abs(this.imageDistance) === Infinity ? "∞" : `${Math.abs(this.imageDistance).toFixed(1)} cm`;
        
        this.magnificationSpan.textContent = 
            Math.abs(this.magnification) === Infinity ? "∞" : `${Math.abs(this.magnification).toFixed(1)}×`;
        
        this.imageNatureSpan.textContent = chars.nature;
        this.imagePositionSpan.textContent = chars.position;
    }
    
    updateFormula() {
        const u = this.objectDistance.toFixed(1);
        const f = this.focalLength.toFixed(1);
        const v = Math.abs(this.imageDistance) === Infinity ? "∞" : Math.abs(this.imageDistance).toFixed(1);
        
        this.formulaCalculation.textContent = `1/${f} = 1/${u} + 1/${v}`;
    }
    
    updateSVGElements() {
        // 更新焦点位置
        const leftFocusX = this.lensX - this.focalLength * this.scale;
        const rightFocusX = this.lensX + this.focalLength * this.scale;
        
        document.getElementById('leftFocus').setAttribute('cx', leftFocusX);
        document.getElementById('leftFocusLabel').setAttribute('x', leftFocusX);
        document.getElementById('rightFocus').setAttribute('cx', rightFocusX);
        document.getElementById('rightFocusLabel').setAttribute('x', rightFocusX);
        
        // 更新物体位置
        const objectX = this.lensX - this.objectDistance * this.scale;
        const objectY = 250;
        const objectTop = 180;
        
        document.getElementById('objectLine').setAttribute('x1', objectX);
        document.getElementById('objectLine').setAttribute('x2', objectX);
        document.getElementById('objectArrow').setAttribute('points', `${objectX},${objectTop} ${objectX-10},${objectTop+15} ${objectX+10},${objectTop+15}`);
        document.getElementById('objectHandle').setAttribute('cx', objectX);
        document.getElementById('objectLabel').setAttribute('x', objectX);
        
        // 更新像的位置
        let imageX, imageY, imageTop;
        
        if (Math.abs(this.imageDistance) === Infinity) {
            // 不成像的情况
            imageX = this.lensX + 200;
            imageY = 250;
            imageTop = 180;
        } else if (this.imageDistance > 0) {
            // 实像
            imageX = this.lensX + Math.abs(this.imageDistance) * this.scale;
            imageY = 250;
            imageTop = 320;
        } else {
            // 虚像
            imageX = this.lensX - Math.abs(this.imageDistance) * this.scale;
            imageY = 250;
            imageTop = 180;
        }
        
        document.getElementById('imageLine').setAttribute('x1', imageX);
        document.getElementById('imageLine').setAttribute('x2', imageX);
        document.getElementById('imageLine').setAttribute('y2', imageTop);
        
        if (this.imageDistance > 0) {
            document.getElementById('imageArrow').setAttribute('points', `${imageX},${imageTop} ${imageX-10},${imageTop-15} ${imageX+10},${imageTop-15}`);
        } else {
            document.getElementById('imageArrow').setAttribute('points', `${imageX},${imageTop} ${imageX-10},${imageTop+15} ${imageX+10},${imageTop+15}`);
        }
        
        document.getElementById('imageLabel').setAttribute('x', imageX);
        document.getElementById('imageLabel').setAttribute('y', imageTop + (this.imageDistance > 0 ? 25 : -10));
        
        // 更新光线
        this.updateRays(objectX, objectTop, imageX, imageTop, leftFocusX, rightFocusX);
        
        // 更新距离标注
        this.updateDistanceAnnotations(objectX, imageX, leftFocusX);
    }
    
    updateRays(objectX, objectTop, imageX, imageTop, leftFocusX, rightFocusX) {
        const lensY = 250;
        
        // 平行于主轴的光线
        let ray1Path = `M ${objectX} ${objectTop} L ${this.lensX} ${objectTop}`;
        if (Math.abs(this.imageDistance) !== Infinity) {
            ray1Path += ` L ${rightFocusX} ${lensY} L ${imageX} ${imageTop}`;
        } else {
            ray1Path += ` L ${this.lensX + 200} ${objectTop}`;
        }
        this.ray1.setAttribute('d', ray1Path);
        
        // 过光心的光线
        let ray2Path = `M ${objectX} ${objectTop} L ${imageX} ${imageTop}`;
        this.ray2.setAttribute('d', ray2Path);
        
        // 过左焦点的光线
        let ray3Path = `M ${objectX} ${objectTop} L ${leftFocusX} ${lensY}`;
        if (Math.abs(this.imageDistance) !== Infinity) {
            const lensIntersectY = lensY + (objectTop - lensY) * (this.lensX - leftFocusX) / (objectX - leftFocusX);
            ray3Path += ` L ${this.lensX} ${lensIntersectY} L ${imageX} ${imageTop}`;
        } else {
            ray3Path += ` L ${this.lensX + 200} ${lensY}`;
        }
        this.ray3.setAttribute('d', ray3Path);
    }
    
    updateDistanceAnnotations(objectX, imageX, leftFocusX) {
        // 物距标注
        document.getElementById('uLine').setAttribute('x1', objectX);
        document.getElementById('uLine').setAttribute('x2', this.lensX);
        document.getElementById('uLabel').setAttribute('x', (objectX + this.lensX) / 2);
        
        // 像距标注
        document.getElementById('vLine').setAttribute('x1', this.lensX);
        document.getElementById('vLine').setAttribute('x2', imageX);
        document.getElementById('vLabel').setAttribute('x', (this.lensX + imageX) / 2);
        
        // 焦距标注
        document.getElementById('fLine').setAttribute('x1', leftFocusX);
        document.getElementById('fLine').setAttribute('x2', this.lensX);
        document.getElementById('fLabel').setAttribute('x', (leftFocusX + this.lensX) / 2);
    }
    
    updateDisplay() {
        // 显示/隐藏光线
        document.getElementById('rayGroup').style.display = 
            this.showRaysCheckbox.checked ? 'block' : 'none';
        
        // 显示/隐藏网格
        this.gridPattern.style.display = 
            this.showGridCheckbox.checked ? 'block' : 'none';
        
        // 显示/隐藏标签
        this.distanceLabels.style.display = 
            this.showLabelsCheckbox.checked ? 'block' : 'none';
    }
    
    updateAnimationState() {
        const animatedElements = document.querySelectorAll('.animate');
        
        animatedElements.forEach(element => {
            if (this.showAnimation) {
                element.style.transition = 'all 0.3s ease';
            } else {
                element.style.transition = 'none';
            }
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ConvexLensDemo();
});