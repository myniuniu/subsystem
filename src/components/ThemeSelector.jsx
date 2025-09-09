import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Space, Avatar } from 'antd';
import { BgColorsOutlined, CheckOutlined } from '@ant-design/icons';
import { themes, getCurrentTheme, setTheme, getThemeList } from '../utils/themeManager';
import './ThemeSelector.css';

const ThemeSelector = ({ onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());

  useEffect(() => {
    // 监听主题变更事件
    const handleThemeChange = (event) => {
      setCurrentTheme(event.detail.theme);
      if (onThemeChange) {
        onThemeChange(event.detail.theme, event.detail.colors);
      }
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, [onThemeChange]);

  const handleThemeSelect = (themeName) => {
    if (setTheme(themeName)) {
      setCurrentTheme(themeName);
    }
  };

  const themeList = getThemeList();

  const menuItems = themeList.map(theme => ({
    key: theme.key,
    label: (
      <div className="theme-option" onClick={() => handleThemeSelect(theme.key)}>
        <Space>
          <div className="theme-preview">
            <div 
              className="theme-color-dot" 
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div 
              className="theme-color-dot" 
              style={{ backgroundColor: theme.colors.textPrimary }}
            />
            <div 
              className="theme-color-dot" 
              style={{ background: theme.colors.background }}
            />
          </div>
          <span className="theme-name">{theme.name}</span>
          {currentTheme === theme.key && (
            <CheckOutlined style={{ color: theme.colors.primary }} />
          )}
        </Space>
      </div>
    )
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={['click']}
      overlayClassName="theme-selector-dropdown"
    >
      <Button 
        type="text" 
        icon={<BgColorsOutlined />}
        className="theme-selector-button"
        title="切换主题"
      >
        换肤
      </Button>
    </Dropdown>
  );
};

export default ThemeSelector;