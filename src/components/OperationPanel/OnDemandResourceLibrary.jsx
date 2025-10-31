import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Layout, Card, Space, Typography, Tooltip, Button, Table, Tag as AntTag, Empty, message, Modal, Select, Checkbox, Input } from 'antd'
import { AppstoreOutlined, UnorderedListOutlined, EditOutlined, DeleteOutlined, ShareAltOutlined, EyeOutlined, FileTextOutlined, BookOutlined, ExperimentOutlined, TeamOutlined, FolderOpenOutlined, HeartTwoTone } from '@ant-design/icons'
import './OnDemandResourceLibrary.css'
import { initialResources } from '../../data/resourceLibraryData'
import OnDemandResourceCategorySidebar from './OnDemandResourceCategorySidebar'
import { resourceCategoryData, mockResourcesForCategories } from '../../data/resourceCategoryData'

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
  try {
    const typeToThumb = {
      documents: '/thumbnails/documents.png',
      videos: '/thumbnails/videos.png',
      images: '/thumbnails/images.png',
      audio: '/thumbnails/audio.png',
      presentations: '/thumbnails/presentations.png',
      default: '/thumbnails/default.png'
    }
    const items = (rc && rc.items) || []
    const firstType = (items.find(it => typeof it?.type === 'string')?.type) || ''
    const t = String(firstType).toLowerCase()
    if (t.includes('ppt') || t.includes('presentation')) return typeToThumb.presentations
    if (t.includes('doc') || t.includes('pdf') || t.includes('guide')) return typeToThumb.documents
    if (t.includes('video') || t.includes('mp4')) return typeToThumb.videos
    if (t.includes('image') || t.includes('png') || t.includes('jpg')) return typeToThumb.images
    if (t.includes('audio') || t.includes('mp3')) return typeToThumb.audio
    switch (rc?.category) {
      case 'technology_training': return typeToThumb.videos
      case 'teaching_resources': return typeToThumb.documents
      case 'family_education': return typeToThumb.presentations
      case 'school_management': return typeToThumb.images
      case 'mental_health': return typeToThumb.images
      case 'new_teacher_resources': return typeToThumb.presentations
      default: return typeToThumb.default
    }
  } catch {
    return '/images/agents/agent-docs.svg'
  }
}

// 新增：集合预览
const getFilteredItemsForPreview = (rc, currentSpace) => {
  return (rc.items || []).filter(it => ((it.drive === 'org' || typeof it.drive === 'undefined') && ((it.space || DEFAULT_SPACE) === currentSpace)))
}

const openCollectionPreview = (rc, currentSpace) => {
  const items = getFilteredItemsForPreview(rc, currentSpace)
  const categoryLabel = (categories.find(c => c.id === rc.category)?.name) || '资料集合'
  Modal.info({
    title: `集合预览：${rc.title}`,
    width: 680,
    content: (
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
          <div style={{ width: 160, height: 90, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0' }}>
            <img src={getCollectionThumbnail(rc)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{categoryLabel}</div>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(rc.tags || []).slice(0, 8).map(tag => (<AntTag key={tag}>{tag}</AntTag>))}
            </div>
            <div style={{ marginTop: 6, color: '#888' }}>项目数：{items.length}</div>
          </div>
        </div>
        {items.length === 0 ? (
          <Empty description={<div><Text>当前空间下暂无可预览的资源项</Text><br /><Text type="secondary">请切换空间或更改分类</Text></div>} />
        ) : (
          <div style={{ maxHeight: 260, overflow: 'auto', borderTop: '1px dashed #eee', paddingTop: 8 }}>
            {items.map(it => (
              <div key={it.id || it.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px dashed #f5f5f5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Text>{it.title}</Text>
                  {it.type && (<AntTag>{String(it.type)}</AntTag>)}
                </div>
                <div style={{ color: '#999', fontSize: 12 }}>
                  <span>{it.size || 'N/A'}</span>
                  <span style={{ margin: '0 6px' }}>·</span>
                  <span>{it.lastModified || ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  })
}

export default function ResourceLibraryCopied({ selectMode = false, selectedCollectionIds = [], onSelectionChange, useExternalFilters = false, externalFilters = { query: '', category: 'all' }, defaultViewMode = 'list', onCategoryChange, hideCategorySidebar = false, hideHeader = false }) {
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

  // 选择状态（用于配置页）
  const [selectedIds, setSelectedIds] = useState(selectedCollectionIds || [])
  useEffect(() => { setSelectedIds(selectedCollectionIds || []) }, [selectedCollectionIds])
  const toggleSelect = (id, checked) => {
    setSelectedIds(prev => {
      const next = checked ? Array.from(new Set([...prev, id])) : prev.filter(x => x !== id)
      if (typeof onSelectionChange === 'function') onSelectionChange(next)
      return next
    })
  }

  // 分类与集合视图
  const [selectedResourceCategory, setSelectedResourceCategory] = useState('all')
  const [collectionViewMode, setCollectionViewMode] = useState(defaultViewMode)
  const [searchQuery, setSearchQuery] = useState('')
  const resourceCollections = useMemo(() => createDefaultCollections(), [])
  // 模拟视频分钟数：给每个视频资源映射 30~90 分钟，保证确定性
  const videoMinutesForItem = (resId) => {
    const s = String(resId || '')
    let sum = 0; for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i)
    return 30 + (sum % 61)
  }
  const totalMinutesForCollection = (rc) => {
    if (!Array.isArray(rc.items)) return 0
    return rc.items.reduce((acc, it) => acc + (it.type === 'video' ? videoMinutesForItem(it.id) : 0), 0)
  }

  const effectiveSelectedCategory = useExternalFilters ? (externalFilters?.category || 'all') : selectedResourceCategory
  const LIBRARY_CATEGORY_IDS = categories.map(c => c.id)
  const TYPE_CATEGORY_VALUES = ['documents','videos','images','audio','presentations']
  const SUBJECT_CATEGORY_VALUES = ['chinese','math','english','science','history','geography']

  const normalizeType = (t) => {
    switch (String(t || '').toLowerCase()) {
      case 'ppt':
      case 'presentation':
        return 'presentations'
      case 'document':
      case 'doc':
      case 'guide':
      case 'pdf':
        return 'documents'
      case 'video':
      case 'mp4':
        return 'videos'
      case 'image':
      case 'png':
      case 'jpg':
        return 'images'
      case 'audio':
      case 'mp3':
        return 'audio'
      default:
        return ''
    }
  }

  const subjectAlias = {
    math: ['math','mathematics'],
    chinese: ['chinese'],
    english: ['english'],
    science: ['science','physics','biology','chemistry'],
    history: ['history'],
    geography: ['geography']
  }

  const matchesSelectedCategory = (rc, selected) => {
    if (!selected || selected === 'all') return true
    if (LIBRARY_CATEGORY_IDS.includes(selected)) {
      return rc.category === selected
    }
    if (TYPE_CATEGORY_VALUES.includes(selected)) {
      return (rc.items || []).some(it => {
        const normalized = normalizeType(it.type)
        return normalized === selected && ((it.space || DEFAULT_SPACE) === currentSpace) && (it.drive === 'org' || typeof it.drive === 'undefined')
      })
    }
    if (SUBJECT_CATEGORY_VALUES.includes(selected)) {
      return (rc.items || []).some(it => {
        const sub = String(it.subCategory || '').toLowerCase()
        const aliases = subjectAlias[selected] || []
        return aliases.includes(sub) && ((it.space || DEFAULT_SPACE) === currentSpace) && (it.drive === 'org' || typeof it.drive === 'undefined')
      })
    }
    return true
  }

  const collectionListData = useMemo(() => {
    const list = (effectiveSelectedCategory==='all' ? resourceCollections : resourceCollections.filter(rc => matchesSelectedCategory(rc, effectiveSelectedCategory)))
    const withFiltered = list.map(rc => ({
      rc,
      filteredOrgItems: (rc.items || []).filter(it => ((it.drive === 'org' || typeof it.drive === 'undefined') && ((it.space || DEFAULT_SPACE) === currentSpace)))
    }))
    const baseMapped = withFiltered
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
    const q = (useExternalFilters && externalFilters?.query) ? String(externalFilters.query).trim().toLowerCase() : ''
    if (!q) return baseMapped
    return baseMapped.filter(row => row.title.toLowerCase().includes(q) || (row.tags || []).some(t => String(t).toLowerCase().includes(q)))
  }, [resourceCollections, effectiveSelectedCategory, currentSpace, useExternalFilters, externalFilters])

  const collectionColumns = [
    {
      title: '标题',
      dataIndex: 'rc',
      key: 'title_thumb',
      render: (rc, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ width: 100, height: 50, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0' }}>
            <img src={getCollectionThumbnail(rc)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontWeight: 600 }}>{record.title}</span>
        </div>
      )
    },
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

  const previewColumn = {
    title: '预览',
    key: 'preview',
    width: 90,
    render: (_, record) => (
      <Button type="link" size="small" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); openCollectionPreview(record.rc, currentSpace) }}>预览</Button>
    )
  }

  const effectiveColumns = selectMode ? [...collectionColumns.filter(col => col.key !== 'actions'), previewColumn] : collectionColumns

  return (
    <Layout className="docs-center" style={{ height: '100%', background: 'transparent' }}>
      {!hideHeader && (
        <Header style={{ background: 'transparent', padding: '0 12px', height: 56, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Space>
              <Title level={4} style={{ margin: 0 }}>资源集合</Title>
              <Select value={currentSpace} onChange={setCurrentSpace} style={{ width: 220 }} options={[DEFAULT_SPACE, '帮助文档'].map(s => ({ value: s, label: `空间：${s}` }))} />
            </Space>
            <Space>
              <Input
                placeholder="搜索或提问"
                allowClear
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 260 }}
              />
              <Tooltip title="网格视图"><Button size="small" type={collectionViewMode==='grid' ? 'primary' : 'text'} icon={<AppstoreOutlined />} onClick={() => setCollectionViewMode('grid')} /></Tooltip>
              <Tooltip title="列表视图"><Button size="small" type={collectionViewMode==='list' ? 'primary' : 'text'} icon={<UnorderedListOutlined />} onClick={() => setCollectionViewMode('list')} /></Tooltip>
            </Space>
          </div>
        </Header>
      )}

      <Layout>
        {!hideCategorySidebar && (
          <OnDemandResourceCategorySidebar
            selectedCategory={selectedResourceCategory}
            onCategoryChange={(cat) => { setSelectedResourceCategory(cat); if (useExternalFilters && typeof onCategoryChange === 'function') onCategoryChange(cat); }}
            resources={mockResourcesForCategories}
            categories={resourceCategoryData}
            configVersion={1}
            disableHoverActions
          />
        )}
        <Content className="docs-main">
          {collectionViewMode === 'list' ? (
            collectionListData.length === 0 ? (
              <Empty description={<div><Text>该分类下暂无资料集合</Text><br /><Text type="secondary">请切换空间或新建集合</Text></div>} style={{ marginTop: 8 }} />
            ) : (
              <div className="notes-content list-mode" style={{ marginTop: 12 }}>
                <Table
                  dataSource={collectionListData}
                  columns={effectiveColumns}
                  size="small"
                  pagination={false}
                  rowKey="id"
                  rowSelection={selectMode ? { selectedRowKeys: selectedIds, onChange: (keys) => { setSelectedIds(keys); if (typeof onSelectionChange === 'function') onSelectionChange(keys) } } : undefined}
                  onRow={(record) => ({ onClick: () => { if (selectMode) { const checked = !selectedIds.includes(record.id); toggleSelect(record.id, checked) } else { message.info(`打开集合：${record.title}`) } } })}
                />
              </div>
            )
          ) : (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
                {collectionListData.map(row => (
                  <Card key={row.id} hoverable style={{ position: 'relative' }} onClick={() => { if (selectMode) { const checked = !selectedIds.includes(row.id); toggleSelect(row.id, checked) } else { message.info(`打开集合：${row.title}`) } }}>
                    {selectMode && (
                      <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }} onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="预览集合"><Button size="small" type="text" icon={<EyeOutlined />} onClick={() => openCollectionPreview(row.rc, currentSpace)} /></Tooltip>
                      </div>
                    )}
                    {selectMode && (
                      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }} onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selectedIds.includes(row.id)} onChange={(e) => toggleSelect(row.id, e.target.checked)} />
                      </div>
                    )}
                    <div style={{ width: '100%', height: 120, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0', marginBottom: 8 }}>
                      <img src={getCollectionThumbnail(row.rc)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                      <Space>
                        {getCategoryIcon(row.rc.category)}
                        <Text type="secondary">{row.itemsCount} 项</Text>
                      </Space>
                    </Space>
                    <div style={{ fontWeight: 600, marginTop: 8 }}>{row.title}</div>
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(row.tags || []).map(tag => <AntTag key={tag}>{tag}</AntTag>)}
                    </div>
                    {(() => {
                      const minutes = totalMinutesForCollection(row.rc)
                      const hours = Math.round((minutes / 60) * 10) / 10
                      return <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 6 }}>视频总时长：{minutes} 分钟（≈ {hours} 学时）</div>
                    })()}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}