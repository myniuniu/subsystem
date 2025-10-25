import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Layout, Card, Space, Typography, Tooltip, Button, Table, Tag as AntTag, Empty, message, Modal, Select } from 'antd'
import { AppstoreOutlined, UnorderedListOutlined, EditOutlined, DeleteOutlined, ShareAltOutlined, EyeOutlined, FileTextOutlined, BookOutlined, ExperimentOutlined, TeamOutlined, FolderOpenOutlined, HeartTwoTone } from '@ant-design/icons'
import '../ResourceLibrary.css'
import { initialResources } from '../../data/resourceLibraryData'

const { Title, Text } = Typography
const { Header, Sider, Content } = Layout
const DEFAULT_SPACE = '技术部-研发'

// 图标映射（与原资源库一致）
const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'teaching_resources':
      return <BookOutlined style={{ color: '#1f2937' }} />
    case 'technology_training':
      return <ExperimentOutlined style={{ color: '#3b82f6' }} />
    case 'family_education':
      return <TeamOutlined style={{ color: '#f59e0b' }} />
    case 'school_management':
      return <FolderOpenOutlined style={{ color: '#10b981' }} />
    case 'mental_health':
      return <HeartTwoTone twoToneColor="#eb2f96" />
    case 'new_teacher_resources':
      return <BookOutlined style={{ color: '#6d28d9' }} />
    default:
      return <FileTextOutlined />
  }
}

const categories = [
  { id: 'teaching_resources', name: '教学资源库' },
  { id: 'technology_training', name: '技术培训资源库' },
  { id: 'family_education', name: '家庭教育资源库' },
  { id: 'school_management', name: '学校管理资源库' },
  { id: 'mental_health', name: '心理健康资源库' },
  { id: 'new_teacher_resources', name: '新教师资源库' }
]

// 来自原资源库的默认集合构造
function createDefaultCollections() {
  const pickByCategory = (cat, limit = 8) => initialResources.filter(r => r.category === cat).slice(0, limit)
  const today = new Date().toLocaleDateString('zh-CN')
  const cats = [
    { id: 'teaching_resources', title: '教学资源精选' },
    { id: 'technology_training', title: '技术培训精选' },
    { id: 'family_education', title: '家庭教育精选' },
    { id: 'school_management', title: '学校管理精选' },
    { id: 'mental_health', title: '心理健康研修' }
  ]
  const uniqueTags = (items, limit = 12) => {
    const set = new Set()
    items.forEach(i => (i.tags || []).forEach(t => set.add(t)))
    return Array.from(set).slice(0, limit)
  }
  return cats.map((c, idx) => {
    const items = pickByCategory(c.id, 8)
    if (c.id === 'technology_training') {
      items.push({ id: 'scn-phy-1', title: '科学演示：电磁感应虚拟实验', type: 'scenario', drive: 'org', size: 'N/A', lastModified: today, tags: ['科学演示','物理','虚拟仿真'] })
    }
    if (c.id === 'mental_health') {
      items.push({ id: 'scn-psy-1', title: '心理健康辅导：校园压力疏导', type: 'scenario', drive: 'my', size: 'N/A', lastModified: today, tags: ['心理健康','辅导','情绪管理'] })
    }
    return {
      id: `rc-${c.id}-${idx+1}`,
      title: c.title,
      category: c.id,
      createdAt: today,
      items,
      tags: uniqueTags(items),
      isBookmarked: false,
      isShared: false
    }
  })
}

const getCollectionThumbnail = (rc) => {
  return '/images/agents/agent-docs.svg'
}

export default function ResourceLibraryCopied() {
  // 空间切换监听
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

  // 分类与集合视图
  const [selectedResourceCategory, setSelectedResourceCategory] = useState('all')
  const [collectionViewMode, setCollectionViewMode] = useState('list')
  const resourceCollections = useMemo(() => createDefaultCollections(), [])

  const matchesSelectedCategory = (rc, selected) => {
    if (!selected || selected === 'all') return true
    return rc.category === selected
  }

  const collectionListData = useMemo(() => {
    const list = (selectedResourceCategory==='all' ? resourceCollections : resourceCollections.filter(rc => matchesSelectedCategory(rc, selectedResourceCategory)))
    const withFiltered = list.map(rc => ({
      rc,
      filteredOrgItems: (rc.items || []).filter(it => it.drive === 'org' && ((it.space || DEFAULT_SPACE) === currentSpace))
    }))
    return withFiltered
      .filter(x => x.filteredOrgItems.length > 0)
      .map(({ rc, filteredOrgItems }) => ({
        key: rc.id,
        id: rc.id,
        title: rc.title,
        categoryLabel: (categories.find(c => c.id === rc.category)?.name) || '资料集合',
        tags: (rc.tags || []).slice(0, 6),
        itemsCount: filteredOrgItems.length,
        createdAt: rc.createdAt,
        rc
      }))
  }, [resourceCollections, selectedResourceCategory, currentSpace])

  const collectionColumns = [
    {
      title: '缩略图',
      dataIndex: 'rc',
      key: 'thumb',
      width: 120,
      render: (rc) => (
        <div style={{ width: 100, height: 50, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0' }}>
          <img src={getCollectionThumbnail(rc)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (<span style={{ fontWeight: 600 }}>{text}</span>)
    },
    { title: '分类', dataIndex: 'categoryLabel', key: 'category' },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(tags || []).map(tag => <AntTag key={tag}>{tag}</AntTag>)}
        </div>
      )
    },
    { title: '数量', dataIndex: 'itemsCount', key: 'count', width: 80 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 140 },
    {
      title: '操作', key: 'actions', width: 220,
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="编辑集合"><Button type="text" size="small" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); message.info(`编辑 ${record.title}`) }} /></Tooltip>
          <Tooltip title="编辑标签"><Button type="text" size="small" icon={<FileTextOutlined />} onClick={(e) => { e.stopPropagation(); message.info('标签功能待接入') }} /></Tooltip>
          <Tooltip title="预览集合"><Button type="text" size="small" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); Modal.info({ title: '集合预览', content: record.title }) }} /></Tooltip>
          <Tooltip title="分享集合"><Button type="text" size="small" icon={<ShareAltOutlined />} onClick={(e) => { e.stopPropagation(); message.success('已生成分享链接（示例）') }} /></Tooltip>
          <Tooltip title="删除集合"><Button type="text" size="small" icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); message.warning('删除示例，不执行实际删除') }} /></Tooltip>
        </Space>
      )
    }
  ]

  return (
    <Layout className="docs-center" style={{ height: '100%', background: 'transparent' }}>
      <Header style={{ background: 'transparent', padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Title level={4} style={{ margin: 0 }}>资源集合</Title>
            <Select value={currentSpace} onChange={setCurrentSpace} style={{ width: 220 }} options={[DEFAULT_SPACE, '帮助文档'].map(s => ({ value: s, label: `空间：${s}` }))} />
          </Space>
          <Space>
            <Tooltip title="网格视图"><Button size="small" type={collectionViewMode==='grid' ? 'primary' : 'text'} icon={<AppstoreOutlined />} onClick={() => setCollectionViewMode('grid')} /></Tooltip>
            <Tooltip title="列表视图"><Button size="small" type={collectionViewMode==='list' ? 'primary' : 'text'} icon={<UnorderedListOutlined />} onClick={() => setCollectionViewMode('list')} /></Tooltip>
          </Space>
        </div>
      </Header>

      <Layout>
        <Sider width={220} style={{ background: 'transparent' }}>
          <div className="sidebar-content">
            <Typography.Title level={5} style={{ marginBottom: 12 }}>资源分类</Typography.Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type={selectedResourceCategory==='all' ? 'primary' : 'text'} block onClick={() => setSelectedResourceCategory('all')}>全部资源</Button>
              {categories.map(c => (
                <Button key={c.id} type={selectedResourceCategory===c.id ? 'primary' : 'text'} block icon={getCategoryIcon(c.id)} onClick={() => setSelectedResourceCategory(c.id)}>{c.name}</Button>
              ))}
            </Space>
          </div>
        </Sider>
        <Content className="docs-main">
          {collectionViewMode === 'list' ? (
            collectionListData.length === 0 ? (
              <Empty description={<div><Text>该分类下暂无资料集合</Text><br /><Text type="secondary">请切换空间或新建集合</Text></div>} style={{ marginTop: 8 }} />
            ) : (
              <div className="notes-content list-mode" style={{ marginTop: 12 }}>
                <Table
                  dataSource={collectionListData}
                  columns={collectionColumns}
                  size="small"
                  pagination={false}
                  rowKey="id"
                  onRow={(record) => ({ onClick: () => message.info(`打开集合：${record.title}`) })}
                />
              </div>
            )
          ) : (
            <div style={{ marginTop: 12 }}>
              <Space wrap>
                {collectionListData.map(row => (
                  <Card key={row.id} hoverable style={{ width: 280 }} onClick={() => message.info(`打开集合：${row.title}`)}>
                    <div style={{ width: '100%', height: 120, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0', marginBottom: 8 }}>
                      <img src={getCollectionThumbnail(row.rc)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                      <Space>
                        {getCategoryIcon(row.rc.category)}
                        <Text type="secondary">{row.itemsCount} 项</Text>
                      </Space>
                      <Text type="secondary">{row.createdAt}</Text>
                    </Space>
                    <div style={{ fontWeight: 600, marginTop: 8 }}>{row.title}</div>
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(row.tags || []).map(tag => <AntTag key={tag}>{tag}</AntTag>)}
                    </div>
                  </Card>
                ))}
              </Space>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}