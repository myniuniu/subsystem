// 场景缩略图生成工具
export const generateScenarioThumbnail = (scenarioId, title, category = 'default') => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  
  // 根据分类设置不同的颜色主题
  const categoryThemes = {
    'psychology': {
      gradient: ['#fef3c7', '#fbbf24'],
      primary: '#d97706',
      secondary: '#92400e'
    },
    'family': {
      gradient: ['#fce7f3', '#f472b6'],
      primary: '#ec4899',
      secondary: '#be185d'
    },
    'teacher': {
      gradient: ['#dcfce7', '#4ade80'],
      primary: '#16a34a',
      secondary: '#15803d'
    },
    'management': {
      gradient: ['#dbeafe', '#60a5fa'],
      primary: '#3b82f6',
      secondary: '#1d4ed8'
    },
    'leadership': {
      gradient: ['#e0e7ff', '#a78bfa'],
      primary: '#8b5cf6',
      secondary: '#7c3aed'
    },
    'special': {
      gradient: ['#fef2f2', '#fca5a5'],
      primary: '#ef4444',
      secondary: '#dc2626'
    },
    'science_demo': {
      gradient: ['#f0fdfa', '#34d399'],
      primary: '#10b981',
      secondary: '#059669'
    },
    'default': {
      gradient: ['#f0f9ff', '#38bdf8'],
      primary: '#0ea5e9',
      secondary: '#0369a1'
    }
  };
  
  const theme = categoryThemes[category] || categoryThemes.default;
  
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 400, 300);
  gradient.addColorStop(0, theme.gradient[0]);
  gradient.addColorStop(1, theme.gradient[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 300);
  
  // 添加几何装饰
  ctx.fillStyle = `${theme.primary}20`;
  ctx.beginPath();
  ctx.arc(50, 50, 30, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(350, 250, 25, 0, Math.PI * 2);
  ctx.fill();
  
  // 中心图标
  ctx.fillStyle = theme.primary;
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('场', 200, 120);
  
  // 场景标题
  ctx.fillStyle = theme.secondary;
  ctx.font = 'bold 16px Arial';
  
  // 处理长标题，自动换行
  const maxWidth = 320;
  const lineHeight = 20;
  const words = title.split('');
  let line = '';
  let y = 160;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, 200, y);
      line = words[i];
      y += lineHeight;
      
      // 最多显示两行
      if (y > 180) {
        line = line.substring(0, 10) + '...';
        break;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 200, y);
  
  // 底部信息
  ctx.fillStyle = theme.secondary + '80';
  ctx.font = '12px Arial';
  ctx.fillText(`ID: ${scenarioId}`, 200, 220);
  
  // 分类标签
  const categoryNames = {
    'psychology': '学生心理',
    'family': '家庭教育',
    'teacher': '教师培训',
    'management': '班级管理',
    'leadership': '学校管理',
    'special': '特殊教育',
    'science_demo': '科学演示'
  };
  
  const categoryText = categoryNames[category] || '场景模拟';
  ctx.fillText(categoryText, 200, 240);
  
  return canvas.toDataURL('image/jpeg', 0.8);
};

// 从iframe URL生成预览图
export const generatePreviewFromUrl = async (url, scenarioId, title, category) => {
  try {
    // 首先尝试直接生成主题缩略图
    return generateScenarioThumbnail(scenarioId, title, category);
  } catch (error) {
    console.error('生成预览图失败:', error);
    return generateScenarioThumbnail(scenarioId, title, 'default');
  }
};

// 图片缓存管理
export class ImageCacheManager {
  constructor() {
    this.cache = new Map();
    this.loadingSet = new Set();
  }
  
  async getImage(scenarioId, url, title, category) {
    // 如果已缓存，直接返回
    if (this.cache.has(scenarioId)) {
      return this.cache.get(scenarioId);
    }
    
    // 如果正在加载，返回null
    if (this.loadingSet.has(scenarioId)) {
      return null;
    }
    
    // 开始加载
    this.loadingSet.add(scenarioId);
    
    try {
      const imageData = await generatePreviewFromUrl(url, scenarioId, title, category);
      this.cache.set(scenarioId, imageData);
      return imageData;
    } finally {
      this.loadingSet.delete(scenarioId);
    }
  }
  
  clearCache() {
    this.cache.clear();
    this.loadingSet.clear();
  }
  
  getCacheSize() {
    return this.cache.size;
  }
}