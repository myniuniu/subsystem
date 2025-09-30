import React, { useState, useEffect } from 'react';
import { Dropdown, Space, message } from 'antd';
import { 
  User, 
  LogOut, 
  Settings, 
  Palette,
  CheckCircle,
  Share2
} from 'lucide-react';
import { getCurrentTheme, setTheme, getThemeList } from '../utils/themeManager';
import ThemeShareModal from './ThemeShareModal';
import './SidebarAvatar.css';

const SidebarAvatar = ({ onThemeChange, isCollapsed }) => {
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 模拟登录状态
  const [userInfo, setUserInfo] = useState({
    name: '张老师',
    email: 'zhang.teacher@edu.cn',
    avatar: null
  });

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
      message.success(`已切换到${getThemeList().find(t => t.key === themeName)?.name}主题`);
    }
  };

  const handleLogin = () => {
    // 模拟登录逻辑
    message.info('跳转到登录页面...');
    // 这里可以添加实际的登录逻辑
  };

  const handleLogout = () => {
    // 模拟退出逻辑
    setIsLoggedIn(false);
    message.success('已成功退出登录');
    // 这里可以添加实际的退出逻辑，如清除token等
  };

  const handleShareTheme = () => {
    setShareModalVisible(true);
  };

  const getCurrentThemeData = () => {
    const themeList = getThemeList();
    return themeList.find(theme => theme.key === currentTheme) || themeList[0];
  };

  const themeList = getThemeList();

  // 主题选择子菜单
  const themeMenuItems = themeList.map(theme => ({
    key: `theme-${theme.key}`,
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
            <CheckCircle size={16} style={{ color: theme.colors.primary }} />
          )}
        </Space>
      </div>
    )
  }));

  // 用户菜单项
  const userMenuItems = [
    // 用户信息
    {
      key: 'user-info',
      label: (
        <div className="sidebar-user-info-section">
          <div className="sidebar-user-name">{userInfo.name}</div>
          <div className="sidebar-user-email">{userInfo.email}</div>
        </div>
      ),
      disabled: true
    },
    {
      type: 'divider'
    },
    // 主题设置
    {
      key: 'theme-settings',
      label: (
        <Space>
          <Palette size={16} />
          <span>主题设置</span>
        </Space>
      ),
      children: [
        ...themeMenuItems,
        {
          type: 'divider'
        },
        {
          key: 'share-theme',
          label: (
            <Space>
              <Share2 size={16} />
              <span>分享主题</span>
            </Space>
          ),
          onClick: handleShareTheme
        }
      ]
    },
    // 个人设置
    {
      key: 'settings',
      label: (
        <Space>
          <Settings size={16} />
          <span>个人设置</span>
        </Space>
      ),
      onClick: () => message.info('个人设置功能开发中...')
    },
    {
      type: 'divider'
    },
    // 登录/退出
    isLoggedIn ? {
      key: 'logout',
      label: (
        <Space>
          <LogOut size={16} />
          <span>退出登录</span>
        </Space>
      ),
      onClick: handleLogout
    } : {
      key: 'login',
      label: (
        <Space>
          <User size={16} />
          <span>登录</span>
        </Space>
      ),
      onClick: handleLogin
    }
  ];

  return (
    <>
      <Dropdown
        menu={{ items: userMenuItems }}
        placement="bottomLeft"
        trigger={['click']}
        overlayClassName="sidebar-avatar-dropdown"
      >
        <div className={`sidebar-title-with-avatar clickable ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-avatar">
            <User size={16} />
          </div>
          {!isCollapsed && <h4 className="sidebar-title">张老师</h4>}
        </div>
      </Dropdown>

      <ThemeShareModal
        visible={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        currentTheme={getCurrentThemeData()}
      />
    </>
  );
};

export default SidebarAvatar;