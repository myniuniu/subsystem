class LensSimulator {
    constructor() {
        this.focalLength = 8;
        this.objectDistance = 17;
        this.imageDistance = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.updateSimulation();
    }
    
    initializeElements() {
        this.focalSlider = document.getElementById('focal-slider');
        this.objectSlider = document.getElementById('object-slider');
        this.focalValue = document.getElementById('focal-value');
        this.objectValue = document.getElementById('object-value');
        
        this.presetButtons = document.querySelectorAll('.preset-btn');
        this.checkboxes = document.querySelectorAll('.checkbox');
        
        this.resultU = document.getElementById('result-u');
        this.resultV = document.getElementById('result-v');
        this.resultF = document.getElementById('result-f');
        
        this.charReality = document.getElementById('char-reality');
        this.charOrientation = document.getElementById('char-orientation');
        this.charSize = document.getElementById('char-size');
        this.charPosition = document.getElementById('char-position');
        
        this.lensFormula = document.getElementById('lens-formula');
        this.calculationDetail = document.getElementById('calculation-detail');
        
        this.diagram = document.getElementById('lens-diagram');
    }
    
    bindEvents() {
        this.focalSlider.addEventListener('input', (e) => {
            this.focalLength = parseFloat(e.target.value);
            this.updateSimulation();
        });
        
        this.objectSlider.addEventListener('input', (e) => {
            this.objectDistance = parseFloat(e.target.value);
            this.updateSimulation();
        });
        
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setPreset(e.target.dataset.condition);
                this.updateActivePreset(e.target);
            });
        });
        
        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateDisplay();
            });
        });
    }
    
    calculateImageDistance() {
        // 使用透镜公式: 1/f = 1/u + 1/v
        // 解得: 1/v = 1/f - 1/u = (u - f) / (f * u)
        // 所以: v = (f * u) / (u - f)
        
        if (Math.abs(this.objectDistance - this.focalLength) < 0.1) {
            return Infinity; // 物体在焦点上
        }
        
        this.imageDistance = (this.focalLength * this.objectDistance) / (this.objectDistance - this.focalLength);
        return this.imageDistance;
    }
    
    getImageCharacteristics() {
        const u = this.objectDistance;
        const f = this.focalLength;
        const v = this.imageDistance;
        
        let reality, orientation, size, position;
        
        if (u > 2 * f) {
            reality = "实像";
            orientation = "倒立";
            size = "缩小";
            position = "异侧";
        } else if (u > f && u < 2 * f) {
            reality = "实像";
            orientation = "倒立";
            size = "放大";
            position = "异侧";
        } else if (u < f) {
            reality = "虚像";
            orientation = "正立";
            size = "放大";
            position = "同侧";
        } else {
            reality = "无像";
            orientation = "-";
            size = "-";
            position = "-";
        }
        
        return { reality, orientation, size, position };
    }
    
    setPreset(condition) {
        const f = this.focalLength;
        
        switch(condition) {
            case 'u > 2f':
                this.objectDistance = 2.5 * f;
                break;
            case 'f < u < 2f':
                this.objectDistance = 1.5 * f;
                break;
            case 'u < f':
                this.objectDistance = 0.8 * f;
                break;
        }
        
        this.objectSlider.value = this.objectDistance;
        this.updateSimulation();
    }
    
    updateActivePreset(activeBtn) {
        this.presetButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    
    updateSimulation() {
        this.calculateImageDistance();
        this.updateValues();
        this.updateCharacteristics();
        this.updateFormula();
        this.updateDiagram();
        this.updateDisplay();
    }
    
    updateValues() {
        this.focalValue.textContent = `${this.focalLength.toFixed(1)} cm`;
        this.objectValue.textContent = `${this.objectDistance.toFixed(1)} cm`;
        
        this.resultU.textContent = `u = ${this.objectDistance.toFixed(1)} cm`;
        this.resultV.textContent = `v = ${Math.abs(this.imageDistance).toFixed(1)} cm`;
        this.resultF.textContent = `f = ${this.focalLength.toFixed(1)} cm`;
    }
    
    updateCharacteristics() {
        const chars = this.getImageCharacteristics();
        this.charReality.textContent = chars.reality;
        this.charOrientation.textContent = chars.orientation;
        this.charSize.textContent = chars.size;
        this.charPosition.textContent = chars.position;
    }
    
    updateFormula() {
        const showFormula = document.getElementById('show-formula').checked;
        if (showFormula) {
            const u = this.objectDistance.toFixed(1);
            const v = Math.abs(this.imageDistance).toFixed(1);
            const f = this.focalLength.toFixed(1);
            
            this.calculationDetail.textContent = `1/${f} = 1/${u} + 1/${v}`;
        }
    }
    
    updateDiagram() {
        const centerX = 450;
        const centerY = 250;
        const scale = 5; // 像素每厘米
        
        // 计算位置
        const objectX = centerX - this.objectDistance * scale;
        const imageX = this.imageDistance > 0 ? 
            centerX + Math.abs(this.imageDistance) * scale : 
            centerX - Math.abs(this.imageDistance) * scale;
        
        const focusLeftX = centerX - this.focalLength * scale;
        const focusRightX = centerX + this.focalLength * scale;
        
        // 更新焦点位置
        const focusLeft = document.getElementById('focus-left');
        const focusRight = document.getElementById('focus-right');
        const focusLeftLabel = document.getElementById('focus-left-label');
        const focusRightLabel = document.getElementById('focus-right-label');
        
        focusLeft.setAttribute('cx', focusLeftX);
        focusLeft.setAttribute('cy', centerY);
        focusRight.setAttribute('cx', focusRightX);
        focusRight.setAttribute('cy', centerY);
        focusLeftLabel.setAttribute('x', focusLeftX);
        focusLeftLabel.setAttribute('y', centerY + 30);
        focusRightLabel.setAttribute('x', focusRightX);
        focusRightLabel.setAttribute('y', centerY + 30);
        
        // 更新物体位置
        const object = document.getElementById('object');
        const objectLine = object.querySelector('line');
        const objectArrow = object.querySelector('polygon');
        
        objectLine.setAttribute('x1', objectX);
        objectLine.setAttribute('x2', objectX);
        objectLine.setAttribute('y1', centerY);
        objectLine.setAttribute('y2', 160);
        objectArrow.setAttribute('points', `${objectX},160 ${objectX-10},180 ${objectX+10},180`);
        
        // 更新像的位置
        const image = document.getElementById('image');
        const imageLine = image.querySelector('line');
        const imageArrow = image.querySelector('polygon');
        
        const imageHeight = this.imageDistance > 0 ? 310 : 190;
        const arrowDirection = this.imageDistance > 0 ? 'down' : 'up';
        
        imageLine.setAttribute('x1', imageX);
        imageLine.setAttribute('x2', imageX);
        imageLine.setAttribute('y1', centerY);
        imageLine.setAttribute('y2', imageHeight);
        
        if (arrowDirection === 'down') {
            imageArrow.setAttribute('points', `${imageX},${imageHeight} ${imageX-10},${imageHeight-20} ${imageX+10},${imageHeight-20}`);
        } else {
            imageArrow.setAttribute('points', `${imageX},${imageHeight} ${imageX-10},${imageHeight+20} ${imageX+10},${imageHeight+20}`);
        }
        
        // 更新光线
        this.updateRays(objectX, imageX, focusLeftX, focusRightX, centerX, centerY);
        
        // 更新距离标注
        this.updateDistanceLabels(objectX, imageX, focusLeftX, centerX);
    }
    
    updateRays(objectX, imageX, focusLeftX, focusRightX, centerX, centerY) {
        const rays = document.getElementById('rays');
        const lines = rays.querySelectorAll('line');
        
        // 平行光线
        lines[0].setAttribute('x1', objectX);
        lines[0].setAttribute('y1', 160);
        lines[0].setAttribute('x2', centerX);
        lines[0].setAttribute('y2', 160);
        lines[1].setAttribute('x1', centerX);
        lines[1].setAttribute('y1', 160);
        lines[1].setAttribute('x2', focusRightX);
        lines[1].setAttribute('y2', centerY);
        lines[2].setAttribute('x1', focusRightX);
        lines[2].setAttribute('y1', centerY);
        lines[2].setAttribute('x2', imageX);
        lines[2].setAttribute('y2', this.imageDistance > 0 ? 310 : 190);
        
        // 过焦点光线
        lines[3].setAttribute('x1', objectX);
        lines[3].setAttribute('y1', 160);
        lines[3].setAttribute('x2', focusLeftX);
        lines[3].setAttribute('y2', centerY);
        lines[4].setAttribute('x1', focusLeftX);
        lines[4].setAttribute('y1', centerY);
        lines[4].setAttribute('x2', centerX);
        lines[4].setAttribute('y2', 210);
        lines[5].setAttribute('x1', centerX);
        lines[5].setAttribute('y1', 210);
        lines[5].setAttribute('x2', imageX);
        lines[5].setAttribute('y2', this.imageDistance > 0 ? 310 : 190);
        
        // 过光心光线
        lines[6].setAttribute('x1', objectX);
        lines[6].setAttribute('y1', 160);
        lines[6].setAttribute('x2', imageX);
        lines[6].setAttribute('y2', this.imageDistance > 0 ? 310 : 190);
    }
    
    updateDistanceLabels(objectX, imageX, focusLeftX, centerX) {
        const labels = document.getElementById('distance-labels');
        const lines = labels.querySelectorAll('line');
        const texts = labels.querySelectorAll('text');
        
        // 物距标注
        lines[0].setAttribute('x1', objectX);
        lines[0].setAttribute('x2', centerX);
        lines[0].setAttribute('y1', 380);
        lines[0].setAttribute('y2', 380);
        texts[0].setAttribute('x', (objectX + centerX) / 2);
        texts[0].setAttribute('y', 405);
        
        // 像距标注
        lines[1].setAttribute('x1', centerX);
        lines[1].setAttribute('x2', imageX);
        lines[1].setAttribute('y1', 410);
        lines[1].setAttribute('y2', 410);
        texts[1].setAttribute('x', (centerX + imageX) / 2);
        texts[1].setAttribute('y', 435);
        
        // 焦距标注
        lines[2].setAttribute('x1', focusLeftX);
        lines[2].setAttribute('x2', centerX);
        lines[2].setAttribute('y1', 440);
        lines[2].setAttribute('y2', 440);
        texts[2].setAttribute('x', (focusLeftX + centerX) / 2);
        texts[2].setAttribute('y', 465);
    }
    
    updateDisplay() {
        const showRays = document.getElementById('show-rays').checked;
        const showLabels = document.getElementById('show-labels').checked;
        const showFormula = document.getElementById('show-formula').checked;
        
        const rays = document.getElementById('rays');
        const labels = document.getElementById('distance-labels');
        const formulaSection = document.querySelector('.formula-section');
        
        rays.style.display = showRays ? 'block' : 'none';
        labels.style.display = showLabels ? 'block' : 'none';
        formulaSection.style.display = showFormula ? 'block' : 'none';
    }
}

// 当页面加载完成后初始化模拟器
document.addEventListener('DOMContentLoaded', () => {
    new LensSimulator();
});