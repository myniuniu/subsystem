import React from 'react'
import { Button, Typography } from 'antd'

const Welcome = ({ onEnter }) => {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ textAlign: 'center', padding: 28, background: 'rgba(255,255,255,0.92)', borderRadius: 20, boxShadow: '0 16px 32px rgba(0,0,0,0.15)', maxWidth: 680, width: '90%' }}>
        <img src="/assets/果仁-头像.png" alt="果仁AI" style={{ width: 88, height: 88, borderRadius: 20, objectFit: 'cover', boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }} />
        <Typography.Title level={2} style={{ marginTop: 12, marginBottom: 8, color: '#1f2937' }}>欢迎使用果仁·沉浸式AI学习空间</Typography.Title>
        <Typography.Paragraph style={{ marginBottom: 20, color: '#4b5563', fontSize: 16 }}>
          一站式智能学习与教学助理，集成智能笔记、培训管理与知识问答。
        </Typography.Paragraph>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'left', margin: '0 auto', maxWidth: 560 }}>
          <div style={{ background: '#f7f8fa', border: '1px solid #eceff5', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 20 }}>📝</div>
            <div style={{ fontWeight: 600, marginTop: 6 }}>智能笔记</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>结构化记录、AI辅助编辑</div>
          </div>
          <div style={{ background: '#f7f8fa', border: '1px solid #eceff5', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 20 }}>📚</div>
            <div style={{ fontWeight: 600, marginTop: 6 }}>培训管理</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>方案生成、进度与评估</div>
          </div>
          <div style={{ background: '#f7f8fa', border: '1px solid #eceff5', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 20 }}>🧠</div>
            <div style={{ fontWeight: 600, marginTop: 6 }}>知识问答</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>连接知识库，快速找答案</div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <Button type="primary" size="large" onClick={onEnter} style={{ borderRadius: 10, padding: '10px 22px' }}>
            开始使用
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Welcome
