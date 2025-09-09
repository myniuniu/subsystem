// 主题管理工具

// 主题配置
export const themes = {
  light: {
    name: '亮色主题',
    colors: {
      primary: '#1890ff',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#262626',
      textSecondary: '#8c8c8c',
      textLight: '#595959',
      border: '#d9d9d9',
      headerBackground: 'rgba(255, 255, 255, 0.95)',
      headerText: '#262626'
    }
  },
  dark: {
    name: '暗色主题',
    colors: {
      primary: '#1890ff',
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      cardBackground: 'rgba(45, 55, 72, 0.95)',
      textPrimary: '#ffffff',
      textSecondary: '#a0aec0',
      textLight: '#cbd5e0',
      border: '#4a5568',
      headerBackground: 'rgba(45, 55, 72, 0.95)',
      headerText: '#ffffff'
    }
  },
  blue: {
    name: '蓝色主题',
    colors: {
      primary: '#1890ff',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#ffffff',
      textSecondary: '#e6f7ff',
      textLight: '#bae7ff',
      border: '#91d5ff',
      headerBackground: 'rgba(255, 255, 255, 0.95)',
      headerText: '#ffffff'
    }
  },
  purple: {
    name: '紫色主题',
    colors: {
      primary: '#722ed1',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#ffffff',
      textSecondary: '#f9f0ff',
      textLight: '#efdbff',
      border: '#d3adf7',
      headerBackground: 'rgba(255, 255, 255, 0.95)',
      headerText: '#ffffff'
    }
  },
  green: {
    name: '绿色主题',
    colors: {
      primary: '#52c41a',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#ffffff',
      textSecondary: '#f6ffed',
      textLight: '#d9f7be',
      border: '#b7eb8f',
      headerBackground: 'rgba(255, 255, 255, 0.95)',
      headerText: '#ffffff'
    }
  }
};

// 默认主题
export const DEFAULT_THEME = 'blue';

// 获取当前主题
export const getCurrentTheme = () => {
  return localStorage.getItem('app-theme') || DEFAULT_THEME;
};

// 设置主题
export const setTheme = (themeName) => {
  if (themes[themeName]) {
    localStorage.setItem('app-theme', themeName);
    applyTheme(themeName);
    return true;
  }
  return false;
};

// 应用主题到页面
export const applyTheme = (themeName) => {
  const theme = themes[themeName];
  if (!theme) return;

  const root = document.documentElement;
  
  // 设置CSS变量
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
  
  // 触发主题变更事件
  window.dispatchEvent(new CustomEvent('themeChanged', { 
    detail: { theme: themeName, colors: theme.colors } 
  }));
};

// 初始化主题
export const initTheme = () => {
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);
  return currentTheme;
};

// 获取主题列表
export const getThemeList = () => {
  return Object.entries(themes).map(([key, theme]) => ({
    key,
    name: theme.name,
    colors: theme.colors
  }));
};