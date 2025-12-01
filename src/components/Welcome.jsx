import React, { useState } from 'react'
import { Button, Typography } from 'antd'

const Welcome = ({ onEnter }) => {
  const slides = [
    { src: '/assets/欢迎页/核心功能.png', title: '核心功能' },
    { src: '/assets/欢迎页/产品特点.png', title: '产品特点' },
    { src: '/assets/欢迎页/解决方案.png', title: '解决方案' },
    { src: '/assets/欢迎页/灵动岛1.png', title: '灵动岛体验' },
    { src: '/assets/欢迎页/灵动岛2.png', title: '灵动岛更多' }
  ]
  const [index, setIndex] = useState(0)

  const prev = () => setIndex(i => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex(i => (i + 1) % slides.length)

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
      <div style={{ width: 'min(1200px, 94vw)', height: 'min(820px, 86vh)', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 16px', width: '100%' }}>
          <img src="/assets/果仁-头像.png" alt="果仁AI" style={{ width: 40, height: 40, borderRadius: 12 }} />
          <Typography.Title level={4} style={{ margin: 0, color: '#1f2937' }}>果仁·沉浸式AI学习空间</Typography.Title>
        </div>

        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <img 
            src={slides[index].src} 
            alt={slides[index].title} 
            style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
          />
          <button aria-label="上一张" onClick={prev} style={{ position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%)', border: 'none', width: 46, height: 46, borderRadius: 23, background: 'rgba(0,0,0,0.25)', color: '#fff', cursor: 'pointer' }}>‹</button>
          <button aria-label="下一张" onClick={next} style={{ position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', border: 'none', width: 46, height: 46, borderRadius: 23, background: 'rgba(0,0,0,0.25)', color: '#fff', cursor: 'pointer' }}>›</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {slides.map((_, i) => (
              <div key={i} onClick={() => setIndex(i)} style={{ width: 8, height: 8, borderRadius: 6, background: i === index ? '#6C6CF4' : '#d1d5db', cursor: 'pointer' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Button onClick={onEnter} style={{ borderRadius: 10 }}>跳过</Button>
            <Button type="primary" onClick={onEnter} style={{ borderRadius: 10 }}>开始使用</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
