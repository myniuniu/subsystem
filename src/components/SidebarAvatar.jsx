import React, { useState, useEffect } from 'react';
import { Dropdown, Space, message } from 'antd';
import { 
  User, 
  LogOut, 
  Settings, 
  Palette,
  CheckCircle,
  Share2,
  Users,
  Shield
} from 'lucide-react';
import { getCurrentTheme, setTheme, getThemeList } from '../utils/themeManager';
import ThemeShareModal from './ThemeShareModal';
import LoginMoreModal from './LoginMoreModal';
import DesktopDownloadModal from './DesktopDownloadModal';
import './SidebarAvatar.css';
import { getTotalMedalCount } from '../data/medalsData';

const SidebarAvatar = ({ onThemeChange, isCollapsed }) => {
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [loginMoreModalVisible, setLoginMoreModalVisible] = useState(false);
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

  const handleLoginMore = () => {
    setLoginMoreModalVisible(true);
  };

  const handleOpenAdminCenter = () => {
    const adminUrl = `${window.location.origin}${window.location.pathname}#admin-center`;
    window.open(adminUrl, '_blank');
  };

  // 下载到桌面弹窗
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);

  // PWA 安装相关逻辑：通过全局隐藏的按钮触发 beforeinstallprompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const triggerPWAInstall = async () => {
    if (!deferredPrompt) {
      message.info('当前浏览器暂不支持或暂不可安装PWA');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      message.success('已添加到桌面');
      setDownloadModalVisible(false);
    } else {
      message.warning('已取消安装');
    }
    setDeferredPrompt(null);
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
    // 我的勋章
    {
      key: 'my-medals',
      label: (
        <Space>
          <CheckCircle size={16} />
          <span>我的勋章</span>
          <span style={{ marginLeft: 6, fontSize: 12, color: 'var(--theme-primary)' }}>{getTotalMedalCount()} 枚</span>
        </Space>
      ),
      onClick: () => {
        const url = `${window.location.origin}${window.location.pathname}#my-medals`;
        window.open(url, '_blank');
      }
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
    },
    // 下载到桌面（位于退出登录与登录更多账号之间）
    {
      key: 'download-desktop',
      label: (
        <Space>
          <CheckCircle size={16} />
          <span>下载到桌面</span>
        </Space>
      ),
      children: [
        {
          key: 'pwa-install',
          label: (
            <Space>
              <Palette size={16} />
              <span>添加到电脑桌面</span>
            </Space>
          ),
          onClick: () => setDownloadModalVisible(true)
        },
        {
          key: 'wechat-qr',
          label: (
            <Space>
              <Palette size={16} />
              <span>微信扫码即可体验</span>
            </Space>
          ),
          onClick: () => setDownloadModalVisible(true)
        }
      ]
    },
    // 登录更多账号
    {
      key: 'login-more',
      label: (
        <Space>
          <Users size={16} />
          <span>登录更多账号</span>
        </Space>
      ),
      onClick: handleLoginMore
    },
    // 管理后台（位于最后）
    {
      key: 'admin-center',
      label: (
        <Space>
          <Shield size={16} />
          <span>管理后台</span>
        </Space>
      ),
      onClick: handleOpenAdminCenter
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
            <User size={20} />
          </div>
          {!isCollapsed && <h4 className="sidebar-title">张老师</h4>}
        </div>
      </Dropdown>

      <DesktopDownloadModal
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
        onInstallPWA={triggerPWAInstall}
        qrUrl={window.location.origin}
      />

      <ThemeShareModal
        visible={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        currentTheme={getCurrentThemeData()}
      />

      <LoginMoreModal
        open={loginMoreModalVisible}
        onCancel={() => setLoginMoreModalVisible(false)}
      />
    </>
  );
};

export default SidebarAvatar;