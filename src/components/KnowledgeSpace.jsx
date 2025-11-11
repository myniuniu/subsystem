import React, { useState } from 'react'
import { Row, Col, Card, Space, Typography, Button, Tag, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './KnowledgeSpace.css'
import KnowledgeSpaceSettingsModal from './KnowledgeSpaceSettingsModal'

const { Title, Text } = Typography

const initialSpaces = [
  { id: 'a1', title: '学习公社6.0【产品】', badge: '置顶', cover: '/assets/知识空间封面/创建知识库分类卡片封面 (1).png' },
  { id: 'a2', title: '学习公社6.0外包工作', badge: '在处理', cover: '/assets/知识空间封面/创建知识库分类卡片封面 (2).png' },
  { id: 'a3', title: '技术部-研发', cover: '/assets/知识空间封面/创建知识库分类卡片封面 (3).png' },
  { id: 'a4', title: '学习公社3.0/网络及部署', badge: '更新', cover: '/assets/知识空间封面/创建知识库分类卡片封面 (4).png' },
  { id: 'a5', title: '帮助文档', cover: '/assets/知识空间封面/创建知识库分类卡片封面 (5).png' },
  { id: 'a6', title: '技术栈-技术栈梳理', cover: '/assets/知识空间封面/创建知识库分类卡片封面 (6).png' },
  { id: 'a7', title: '学习公社6.0产品操作手册', badge: '更新提示', cover: '/assets/知识空间封面/创建知识库分类卡片封面 (7).png' },
  { id: 'a8', title: 'Dify操作手册', cover: '/assets/知识空间封面/创建知识库分类卡片封面 (8).png' }
]

// 已移除 mockPinned/mockAll，统一使用 initialSpaces + state 管理

const KnowledgeCard = ({ data, isCurrent, onSelect, onSettings, onTogglePinned }) => {
  const coverPath = data.cover || '/thumbnails/default.png'
  const coverStyle = { backgroundImage: `url("${encodeURI(coverPath)}")` }
  return (
    <Card
      hoverable
      className={`knowledge-card ${isCurrent ? 'current' : ''}`}
      cover={
        <div className="cover" style={coverStyle}>
          <div className="card-actions">
            <Button size="small" className="card-action-btn" onClick={(e) => { e.stopPropagation(); onTogglePinned && onTogglePinned(data) }}>{data.pinned ? '取消置顶' : '置顶'}</Button>
            <Button size="small" className="card-settings-btn" onClick={(e) => { e.stopPropagation(); onSettings && onSettings(data) }}>设置</Button>
          </div>
        </div>
      }
      onClick={() => onSelect && onSelect(data)}
    >
      <div className="card-body">
        <div className="title-row">
          <Text className="card-title">{data.title}</Text>
        </div>
        {data.desc && <Text type="secondary" className="card-desc">{data.desc}</Text>}
      </div>
    </Card>
  )
}

const KnowledgeSpace = () => {
  const DEFAULT_SPACE = '技术部-研发'
  const [spaces, setSpaces] = useState(() => initialSpaces.map(x => ({ ...x, pinned: x.badge === '置顶' })))
  const [currentSpace, setCurrentSpace] = useState(() => {
    try { return localStorage.getItem('current_knowledge_space') || DEFAULT_SPACE } catch { return DEFAULT_SPACE }
  })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState(null)

  const handleSelectSpace = (item) => {
    setCurrentSpace(item.title)
    try { localStorage.setItem('current_knowledge_space', item.title) } catch {}
    console.log('[KnowledgeSpace] dispatch knowledgeSpaceChanged ->', item.title)
    window.dispatchEvent(new CustomEvent('knowledgeSpaceChanged', { detail: { name: item.title } }))
  }

  const handleOpenSettings = (item) => {
    setSelectedSpace(item)
    setSettingsOpen(true)
  }

  const handleTogglePinned = (item) => {
    setSpaces(prev => prev.map(s => s.id === item.id ? { ...s, pinned: !s.pinned } : s))
  }

  return (
    <div className="knowledge-space">
      <div className="page-header">
        <Space align="center">
          <Title level={4} style={{ margin: 0 }}>知识库</Title>
          <Tag color="#f5f5f5" className="header-tag">仓库</Tag>
          <Tag color="#e6fffb" className="current-badge">当前空间：{currentSpace}</Tag>
        </Space>
        <Space>
          <Tooltip title="新建知识库">
            <Button icon={<PlusOutlined />} size="small">新建</Button>
          </Tooltip>
        </Space>
      </div>

      <div className="pinned-section">
        <div className="section-title">置顶知识库</div>
        <Row gutter={[16, 16]}>
          {spaces.filter(item => item.pinned).map(item => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <KnowledgeCard data={item} isCurrent={item.title === currentSpace} onSelect={handleSelectSpace} onSettings={handleOpenSettings} onTogglePinned={handleTogglePinned} />
            </Col>
          ))}
        </Row>
      </div>

      <div className="all-section">
        <div className="section-title">全部知识库</div>
        <Row gutter={[16, 16]}>
          {spaces.map(item => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <KnowledgeCard data={item} isCurrent={item.title === currentSpace} onSelect={handleSelectSpace} onSettings={handleOpenSettings} onTogglePinned={handleTogglePinned} />
            </Col>
          ))}
        </Row>
      </div>
      <KnowledgeSpaceSettingsModal 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        currentSpace={selectedSpace?.title || currentSpace}
        onSave={(payload) => {
          if (payload?.name && payload.name !== currentSpace) {
            setCurrentSpace(payload.name)
            try { localStorage.setItem('current_knowledge_space', payload.name) } catch {}
          }
        }}
      />
    </div>
  )
}

export default KnowledgeSpace