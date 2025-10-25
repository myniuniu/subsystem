import React, { useEffect, useMemo, useState } from 'react'
import { Card, Row, Col, Space, Typography, Tag, Select, Button, Divider, Empty } from 'antd'
import { FileTextOutlined, FilePptOutlined, VideoCameraOutlined, AudioOutlined, TableOutlined, HighlightOutlined, PlusOutlined } from '@ant-design/icons'
import { initialResources } from '../../data/resourceLibraryData'

const { Text } = Typography
const DEFAULT_SPACE = '技术部-研发'

// 图标映射（与原资源库风格一致）
const getTypeIcon = (type) => {
  switch (type) {
    case 'document':
      return <FileTextOutlined style={{ color: '#1890ff', fontSize: 16 }} />
    case 'ppt':
      return <FilePptOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
    case 'video':
      return <VideoCameraOutlined style={{ color: '#f5222d', fontSize: 16 }} />
    case 'audio':
      return <AudioOutlined style={{ color: '#faad14', fontSize: 16 }} />
    case 'table':
      return <TableOutlined style={{ color: '#52c41a', fontSize: 16 }} />
    case 'whiteboard':
      return <HighlightOutlined style={{ color: '#13c2c2', fontSize: 16 }} />
    default:
      return <FileTextOutlined style={{ color: '#1890ff', fontSize: 16 }} />
  }
}

// 业务顶级分类（与原页面一致）
const topCategories = [
  { id: 'teaching_resources', name: '教学资源库' },
  { id: 'technology_training', name: '技术培训资源库' },
  { id: 'family_education', name: '家庭教育资源库' },
  { id: 'school_management', name: '学校管理资源库' },
  { id: 'mental_health', name: '心理健康资源库' },
  { id: 'new_teacher_resources', name: '新教师资源库' }
]

// 构造集合：从 initialResources 近似分组（克隆版不依赖原组件的大型集合数据）
const buildCollections = (resources) => {
  const byCat = resources.reduce((acc, r) => {
    acc[r.category] = acc[r.category] || []
    acc[r.category].push(r)
    return acc
  }, {})
  const collections = []
  Object.keys(byCat).forEach(cat => {
    const list = byCat[cat]
    // 切分为多个集合块，每块包含若干条资源（近似原页面的集合）
    const chunkSize = 4
    for (let i = 0; i < list.length; i += chunkSize) {
      const items = list.slice(i, i + chunkSize).map((it, idx) => ({
        id: `${cat}-${i + idx}`,
        title: it.title,
        type: it.type,
        drive: it.drive || 'org',
        space: it.space || (it.drive === 'org' ? (idx % 2 === 0 ? DEFAULT_SPACE : '帮助文档') : undefined),
        size: it.size || 'N/A',
        lastModified: it.lastModified || '2024-01-12',
        tags: it.tags || []
      }))
      collections.push({
        id: `rc-${cat}-${i / chunkSize + 1}`,
        title: `${list[0]?.category_name || cat} · 集合 ${i / chunkSize + 1}`,
        category: cat,
        createdAt: '2024-01-12',
        items,
        tags: Array.from(new Set(items.flatMap(x => x.tags))).slice(0, 5),
        isBookmarked: false,
        isShared: false
      })
    }
  })
  return collections
}

export default function ResourceLibraryCloned() {
  // 空间切换：保持与原页面的事件/本地存储行为一致
  const [currentSpace, setCurrentSpace] = useState(() => {
    try { return localStorage.getItem('current_knowledge_space') || DEFAULT_SPACE } catch { return DEFAULT_SPACE }
  })
  useEffect(() => {
    const onSpaceChanged = (e) => {
      const name = e?.detail?.name || localStorage.getItem('current_knowledge_space') || DEFAULT_SPACE
      setCurrentSpace(name)
    }
    window.addEventListener('knowledgeSpaceChanged', onSpaceChanged)
    return () => window.removeEventListener('knowledgeSpaceChanged', onSpaceChanged)
  }, [])

  const [selectedCategory, setSelectedCategory] = useState('technology_training')
  const [activeCollection, setActiveCollection] = useState(null)

  const collectionsAll = useMemo(() => buildCollections(initialResources || []), [])
  const collections = useMemo(() => {
    return collectionsAll.filter(c => !selectedCategory || selectedCategory === 'all' || c.category === selectedCategory)
  }, [collectionsAll, selectedCategory])

  const visibleItems = useMemo(() => {
    const items = activeCollection?.items || []
    // 组织盘资源按空间过滤；个人盘不受空间限制
    return items.filter(it => it.drive !== 'org' || ((it.space || DEFAULT_SPACE) === currentSpace))
  }, [activeCollection, currentSpace])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 顶部筛选条：分类 + 空间 */}
      <Space style={{ justifyContent: 'space-between' }}>
        <Space>
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 220 }}
            options={[{ value: 'all', label: '全部资源' }, ...topCategories.map(c => ({ value: c.id, label: c.name }))]}
          />
          <Select
            value={currentSpace}
            onChange={setCurrentSpace}
            style={{ width: 200 }}
            options={[DEFAULT_SPACE, '帮助文档'].map(s => ({ value: s, label: `空间：${s}` }))}
          />
        </Space>
        <Space>
          {activeCollection && <Tag color="blue">资源数 {visibleItems.length}</Tag>}
        </Space>
      </Space>

      <Row gutter={[12, 12]}>
        {/* 左侧：资源集合列表 */}
        <Col span={10}>
          <Card size="small" title={<Space><span>资源集合 · {selectedCategory === 'all' ? '全部资源' : (topCategories.find(c => c.id === selectedCategory)?.name || selectedCategory)}</span><Tag color="geekblue">{collections.length}</Tag></Space>} bodyStyle={{ padding: 8 }}>
            {collections.length === 0 ? (
              <Empty description="暂无集合" />
            ) : (
              <Space direction="vertical" style={{ width: '100%' }}>
                {collections.slice(0, 30).map(c => (
                  <Card key={c.id} size="small" hoverable onClick={() => setActiveCollection(c)} bodyStyle={{ padding: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getTypeIcon(c.items?.[0]?.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{c.title}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{(c.tags || []).slice(0,4).join(' · ')}</Text>
                      </div>
                      <Tag>{c.category}</Tag>
                    </div>
                  </Card>
                ))}
              </Space>
            )}
          </Card>
        </Col>

        {/* 右侧：集合详情与资源项列表 */}
        <Col span={14}>
          <Card size="small" title={<Space><span>集合内容 · {activeCollection ? activeCollection.title : '请选择左侧集合'}</span><Tag color="blue">空间：{currentSpace}</Tag></Space>} bodyStyle={{ padding: 8 }}>
            {!activeCollection ? (
              <Empty description="请选择左侧一项集合以查看内部资源" />
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text type="secondary">共 {visibleItems.length} 项</Text>
                  <Button size="small" icon={<PlusOutlined />}>添加资源</Button>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={[12, 12]}>
                  {visibleItems.map(item => (
                    <Col key={item.id} xs={24} sm={12}>
                      <Card size="small" hoverable bodyStyle={{ padding: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {getTypeIcon(item.type)}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>{item.title}</div>
                            <Text type="secondary" style={{ fontSize: 12 }}>类型：{item.type} · 大小：{item.size}</Text>
                          </div>
                          <Tag color={item.drive === 'org' ? 'purple' : 'cyan'}>{item.drive === 'org' ? '组织盘' : '个人盘'}</Tag>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}