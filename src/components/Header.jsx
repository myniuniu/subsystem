import React, { useEffect, useState } from 'react'
import { Typography, Space, Button } from 'antd'
import { Sparkles, ExternalLink, Cloud } from 'lucide-react'
import UserAvatar from './UserAvatar'
import { initTheme } from '../utils/themeManager'
import './Header.css'

const { Title, Text } = Typography

const Header = ({ onMenuClick, currentView }) => {
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 初始化主题
    const theme = initTheme();
    setCurrentTheme(theme);
    // 检测 PWA 独立或全屏模式（含 iOS Safari 添加到主屏幕）
    try {
      const isDMStandalone = window.matchMedia && (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches
      );
      const isiOSStandalone = typeof window.navigator !== 'undefined' && window.navigator.standalone;
      setIsStandalone(Boolean(isDMStandalone || isiOSStandalone));
    } catch (e) {
      setIsStandalone(false);
    }
  }, []);

  const handleThemeChange = (theme, colors) => {
    setCurrentTheme(theme);
    // 可以在这里添加额外的主题变更逻辑
  };
  const getViewTitle = (view) => {
    const titles = {
      'home': '个人工作台',
      'ai-assistant': 'AI辅助中心',
      'lesson-observation': '听课评课',
  
      'meeting-center': '会议中心',
      'download-center': '下载中心',
      'docs-center': '文档中心'
    }
    return titles[view] || '智慧教学平台【端管理】'
  }

  // 根据当前视图选择图标
  const IconComponent = currentView === 'docs-center' ? Cloud : Sparkles

  const headerBg = isStandalone ? 'rgba(255,255,255,0.92)' : 'transparent';
  const headerText = isStandalone ? '#1f1f1f' : '#fff';
  const headerBorder = isStandalone ? '1px solid rgba(0,0,0,0.06)' : 'none';
  const headerShadow = isStandalone ? '0 2px 8px rgba(0,0,0,0.06)' : 'none';

  return (
    <div className="header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      height: '64px',
      padding: '0 24px',
      background: headerBg,
      borderBottom: headerBorder,
      boxShadow: headerShadow,
      backdropFilter: isStandalone ? 'saturate(180%) blur(8px)' : 'none'
    }}>
      <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <IconComponent size={28} color={headerText} />
        <Title 
          level={3} 
          style={{ 
            margin: 0, 
            color: headerText, 
            fontWeight: 600,
            textShadow: isStandalone ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
          智慧教学平台【端管理】
        </Title>
      </div>
      
      <div className="header-right">
        <Space align="center" size="large">
          <Button
            type="text"
            icon={<ExternalLink size={16} />}
            onClick={() => window.open('https://training.edu.cn', '_blank')}
            style={{
              color: isStandalone ? '#1f1f1f' : 'rgba(255, 255, 255, 0.9)',
              border: isStandalone ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '4px 12px',
              height: 'auto',
              fontSize: '14px',
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
              background: isStandalone ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isStandalone ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.2)'
              e.target.style.borderColor = isStandalone ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isStandalone ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)'
              e.target.style.borderColor = isStandalone ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.3)'
            }}
          >
            研修平台
          </Button>
          <div style={{ textAlign: 'right', minWidth: '120px', whiteSpace: 'nowrap' }}>
            <div style={{ color: isStandalone ? '#1f1f1f' : 'rgba(255, 255, 255, 0.9)', fontSize: '14px', lineHeight: '1.4' }}>
              晚上好
            </div>
            <div style={{ color: isStandalone ? 'rgba(31,31,31,0.7)' : 'rgba(255, 255, 255, 0.7)', fontSize: '12px', lineHeight: '1.4', marginTop: '2px' }}>
              张老师
            </div>
          </div>
          <UserAvatar onThemeChange={handleThemeChange} />
        </Space>
      </div>
    </div>
  )
}

export default Header