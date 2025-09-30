import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { DownloadOutlined, CheckOutlined } from '@ant-design/icons';
import './PWAInstallButton.css';

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // 检查是否已经安装
    const checkIfInstalled = () => {
      // 检查是否在PWA模式下运行
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = window.navigator.standalone === true;
      const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches;
      
      if (isStandalone || isInWebAppiOS || isInWebAppChrome) {
        setIsInstalled(true);
        setShowInstallButton(false);
        return;
      }

      // 检查是否支持PWA安装
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        setShowInstallButton(true);
      }
    };

    // 监听beforeinstallprompt事件
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt event fired');
      // 阻止默认的安装提示
      e.preventDefault();
      // 保存事件，以便稍后触发
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // 监听appinstalled事件
    const handleAppInstalled = (e) => {
      console.log('PWA: App was installed', e);
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
      
      // 显示安装成功消息
      if (window.antd && window.antd.message) {
        window.antd.message.success('应用安装成功！');
      }
    };

    // 注册Service Worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('PWA: Service Worker registered successfully:', registration);
          
          // 监听Service Worker更新
          registration.addEventListener('updatefound', () => {
            console.log('PWA: Service Worker update found');
          });
        } catch (error) {
          console.error('PWA: Service Worker registration failed:', error);
        }
      }
    };

    checkIfInstalled();
    registerServiceWorker();

    // 添加事件监听器
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 清理事件监听器
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // 处理安装按钮点击
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('PWA: No deferred prompt available');
      return;
    }

    setIsInstalling(true);

    try {
      // 显示安装提示
      deferredPrompt.prompt();
      
      // 等待用户响应
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`PWA: User response to the install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        // 安装成功的处理在appinstalled事件中进行
      } else {
        console.log('PWA: User dismissed the install prompt');
        setIsInstalling(false);
      }
      
      // 清除保存的事件
      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA: Error during installation:', error);
      setIsInstalling(false);
    }
  };

  // 隐藏按钮但保留功能
  if (isInstalled) {
    return null;
  }

  return (
    <div className="pwa-install-container" style={{ display: 'none' }}>
      <Button
        type="primary"
        icon={isInstalling ? <CheckOutlined /> : <DownloadOutlined />}
        loading={isInstalling}
        onClick={handleInstallClick}
        className="pwa-install-button"
        size="small"
      >
        {isInstalling ? '安装中...' : '安装应用'}
      </Button>
    </div>
  );
};

export default PWAInstallButton;