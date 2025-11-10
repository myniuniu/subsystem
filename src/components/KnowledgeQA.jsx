import React from 'react'
import { Input, Button, Card, List, Typography, Space, Tag, Tooltip } from 'antd'
import { UploadOutlined, AudioOutlined, EllipsisOutlined, FilePdfOutlined, FileWordOutlined, FilePptOutlined, FileTextOutlined, MenuOutlined } from '@ant-design/icons'
import './KnowledgeQA.css'

const { Title, Paragraph } = Typography

const KnowledgeQA = () => {
  const suggestions = [
    { title: '上传文件，让它充分理解', desc: '支持 Word / PDF / PPT 等常见格式', icon: <UploadOutlined /> },
    { title: '没有合适的资料？试试上传微文件并提问', desc: '快速构建知识点并提问，适配课堂与培训', icon: <FileTextOutlined /> }
  ]

  const recentDocs = [
    { title: 'IC20&ZC40 组题质量提升 JVM（ZGC）策略要点', type: 'pdf', time: '1天前' },
    { title: '2025.10 DeepSeek大模型应用探索', type: 'ppt', time: '2天前' },
    { title: '教研方案与可视化课件清单.docx', type: 'docx', time: '3天前' },
    { title: '项目复盘：智能问答知识库构建指南.pdf', type: 'pdf', time: '5天前' }
  ]

  const renderFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FilePdfOutlined />
      case 'docx': return <FileWordOutlined />
      case 'ppt': return <FilePptOutlined />
      default: return <FileTextOutlined />
    }
  }

  // 左侧菜单示例数据
  const historyItems = [
    'FastAPI框架要务与中间处理及要点',
    '最近聊天的人',
    '3个优化MySQL 8.0数据库性能的实战',
    'pass平台架构',
    '内置智能框架并处理思维内容'
  ]

  return (
    <div className="qa-page">
      <div className={'qa-layout with-left'}>
        <aside className="qa-left-menu">
          <div className="qa-left-header">
            <MenuOutlined />
            <span className="qa-left-title">知识问答</span>
          </div>
          <div className="qa-left-top">
            <div className="qa-left-item active">新对话</div>
            <div className="qa-left-item">知识库</div>
          </div>

            <div className="qa-left-section">
              <div className="qa-left-section-title">历史对话</div>
              <div className="qa-left-list">
                {historyItems.map((t, i) => (
                  <div key={i} className="qa-left-list-item" title={t}>{t}</div>
                ))}
              </div>
            </div>

            <div className="qa-left-bottom">
              <a href="#">提交反馈</a>
            </div>
        </aside>

        <main className="qa-right">
          <div className="qa-content">
            <div className="qa-hero">
              <div className="qa-logo" />
              <Title level={3} className="qa-title">飞书知识问答</Title>
              <Paragraph className="qa-subtitle">智能合作的知识引擎，汇聚你的内容，AI 直达答案</Paragraph>
            </div>

            <div className="qa-search">
              <Input
                className="qa-search-input"
                placeholder="搜个问题，视频/课程/文档内容均可问"
                size="large"
                suffix={
                  <Space size={12}>
                    <Tooltip title="语音提问"><AudioOutlined /></Tooltip>
                    <Tooltip title="高级选项"><EllipsisOutlined /></Tooltip>
                  </Space>
                }
              />
              <div className="qa-search-actions">
                <Button type="primary" size="large">立即提问</Button>
              </div>
            </div>

            <div className="qa-sections">
              <div className="qa-suggestions">
                {suggestions.map((s, idx) => (
                  <Card key={idx} className="qa-card" hoverable>
                    <Space size={10} align="start">
                      <Tag color="purple" className="qa-card-icon">{s.icon}</Tag>
                      <div>
                        <div className="qa-card-title">{s.title}</div>
                        <div className="qa-card-desc">{s.desc}</div>
                      </div>
                    </Space>
                  </Card>
                ))}
              </div>

              <div className="qa-recent">
                <Card className="qa-card" title="你可能需要" bordered={false}>
                  <List
                    itemLayout="horizontal"
                    dataSource={recentDocs}
                    renderItem={(item) => (
                      <List.Item className="qa-list-item">
                        <Space>
                          {renderFileIcon(item.type)}
                          <span className="qa-file-title">{item.title}</span>
                        </Space>
                        <span className="qa-file-time">{item.time}</span>
                      </List.Item>
                    )}
                  />
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default KnowledgeQA