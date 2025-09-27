import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Space, Avatar } from 'antd';
import { BgColorsOutlined, CheckOutlined, ShareAltOutlined } from '@ant-design/icons';
import { themes, getCurrentTheme, setTheme, getThemeList } from '../utils/themeManager';
import ThemeShareModal from './ThemeShareModal';
import './ThemeSelector.css';

const ThemeSelector = ({ onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  const [shareModalVisible, setShareModalVisible] = useState(false);

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

  const handleShareTheme = () => {
    setShareModalVisible(true);
  };

  const getCurrentThemeData = () => {
    const themeList = getThemeList();
    return themeList.find(theme => theme.key === currentTheme) || themeList[0];
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
    <>
      <Space>
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
        
        <Button 
          type="text" 
          icon={<ShareAltOutlined />}
          className="theme-share-button"
          title="分享当前主题"
          onClick={handleShareTheme}
        >
          分享主题
        </Button>
      </Space>

      <ThemeShareModal
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        theme={getCurrentThemeData()}
        onShareSuccess={() => {
          setShareModalVisible(false);
          // 可以在这里添加分享成功后的处理逻辑
        }}
      />
    </>
  );
};

export default ThemeSelector;