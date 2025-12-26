import React from 'react'
import { Card, Row, Col, Typography, Tag } from 'antd'

const { Title, Text } = Typography

const LabCard = ({ title, desc, bg, icon, tag, onClick }) => (
  <Card
    hoverable
    style={{
      borderRadius: 16,
      height: 136,
      border: 'none',
      background: bg,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    }}
    styles={{
      body: {
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }
    }}
    onClick={onClick}
  >
    <div style={{
      width: 48,
      height: 48,
      borderRadius: 12,
      background: 'rgba(255,255,255,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Title level={4} style={{ margin: 0, color: '#1f2937', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</Title>
        {tag && (
          <Tag color="red" style={{ borderRadius: 12, fontWeight: 700 }}>NEW</Tag>
        )}
      </div>
      <Text style={{ color: '#4b5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{desc}</Text>
    </div>
  </Card>
)

const LabCenter = ({ onNavigate }) => {
  const enter = (view) => {
    if (onNavigate && view) onNavigate(view)
  }
  return (
    <div style={{ width: '100%', background: '#fff', minHeight: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1200, padding: '24px 24px 48px' }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={3} style={{ margin: 0, color: '#111827' }}>工具栏</Title>
        </div>

        <div style={{ marginBottom: 8 }}>
          <Title level={4} style={{ margin: 0, color: '#374151' }}>AI Studio</Title>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <LabCard
              title="AI实验馆"
              desc="AI应用体验与算法训练"
              icon="🤖"
              bg="linear-gradient(135deg,#b3e5fc 0%,#81d4fa 100%)"
              onClick={() => enter('ai-experience')}
            />
          </Col>
          <Col xs={24} md={8}>
            <LabCard
              title="AIGC创作工坊"
              desc="探索AIGC的无限潜力"
              icon="✨"
              bg="linear-gradient(135deg,#c7d2fe 0%,#a5b4fc 100%)"
              tag
              onClick={() => enter(null)}
            />
          </Col>
          <Col xs={24} md={8}>
            <LabCard
              title="AI竞技平台"
              desc="游戏化AI自主编程竞技"
              icon="🏆"
              bg="linear-gradient(135deg,#ffcc80 0%,#ffa726 100%)"
              onClick={() => enter(null)}
            />
          </Col>
        </Row>

        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <Title level={4} style={{ margin: 0, color: '#374151' }}>Coding Studio</Title>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <LabCard
              title="图形化实验室"
              desc="搭积木一样的创作"
              icon="💡"
              bg="linear-gradient(135deg,#ffe0b2 0%,#ffcc80 100%)"
              onClick={() => enter(null)}
            />
          </Col>
          <Col xs={24} md={12}>
            <LabCard
              title="Python实验室"
              desc="广泛使用的编程语言"
              icon="🐍"
              bg="linear-gradient(135deg,#c7d2fe 0%,#a5b4fc 100%)"
              onClick={() => enter(null)}
            />
          </Col>
          <Col xs={24} md={12}>
            <LabCard
              title="硬件实验室"
              desc="软硬结合的编程体验"
              icon="🔧"
              bg="linear-gradient(135deg,#b2ebf2 0%,#80deea 100%)"
              onClick={() => enter(null)}
            />
          </Col>
          <Col xs={24} md={12}>
            <LabCard
              title="更多编程工具"
              desc="人工智能、艺术、游戏"
              icon="🖥️"
              bg="linear-gradient(135deg,#c8e6c9 0%,#a5d6a7 100%)"
              onClick={() => enter(null)}
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default LabCenter
