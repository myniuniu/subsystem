import React, { useEffect, useState } from 'react'
import { Avatar, Typography, Space } from 'antd'
import { MessageCircle, Sparkles, User } from 'lucide-react'
import ThemeSelector from './ThemeSelector'
import { initTheme } from '../utils/themeManager'
import './Header.css'

const { Title, Text } = Typography

const Header = ({ onMenuClick, currentView }) => {
  const [currentTheme, setCurrentTheme] = useState('blue');

  useEffect(() => {
    // 初始化主题
    const theme = initTheme();
    setCurrentTheme(theme);
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

  return (
    <div className="header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      height: '64px',
      padding: '0 24px',
      background: 'transparent'
    }}>
      <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Sparkles size={28} color="#fff" />
        <Title 
          level={3} 
          style={{ 
            margin: 0, 
            color: '#fff', 
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
          智慧教学平台【端管理】
        </Title>
      </div>
      
      <div className="header-right">
        <Space align="center" size="large">
          <div style={{ textAlign: 'right', minWidth: '120px', whiteSpace: 'nowrap' }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', lineHeight: '1.4' }}>
              晚上好
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', lineHeight: '1.4', marginTop: '2px' }}>
              张老师
            </div>
          </div>
          <ThemeSelector onThemeChange={handleThemeChange} />
          <Avatar 
            size={40}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
            icon={<User size={20} color="#fff" />}
          />
        </Space>
      </div>
    </div>
  )
}

export default Header