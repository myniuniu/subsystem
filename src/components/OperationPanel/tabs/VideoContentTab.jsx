import React, { useState } from 'react'
import { Card, Row, Col, Space, Tooltip, Button, Select, Input, Empty, Tag, Typography } from 'antd'
import { ProfileOutlined, AppstoreOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import OnDemandResourceLibrary from '../OnDemandResourceLibrary'
import { initialResources } from '../../../data/resourceLibraryData'

const { Text } = Typography

/**
 * 点播课内容配置页签
 * 将 ImplementationPlan.jsx 中 configModal.formatKey === 'videos' 分支抽取为组件
 */
const VideoContentTab = ({
  configModal,
  formatConfigs,
  setFormatConfigs,
  phaseMaterials,
  leftViewMode,
  setLeftViewMode,
  isSmallScreen,
  leftCollapsed,
  rightFilterCategory,
  setRightFilterCategory,
  rightFilterQuery,
  setRightFilterQuery,
  getDefaultConfig,
}) => {
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [hoveredCardId, setHoveredCardId] = useState(null)

  const DEFAULT_SPACE = '技术部-研发'

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

  const getFilteredItemsForPreview = (rc, space) => {
    try {
      return (rc.items || []).filter(it => ((it.drive === 'org' || typeof it.drive === 'undefined') && ((it.space || DEFAULT_SPACE) === space)))
    } catch {
      return []
    }
  }

  const openCollectionPreview = (rc) => {
    const space = (typeof localStorage !== 'undefined' && (localStorage.getItem('current_knowledge_space') || DEFAULT_SPACE)) || DEFAULT_SPACE
    const items = getFilteredItemsForPreview(rc, space)
    const categories = [
      { id: 'teaching_resources', name: '教学资源库' },
      { id: 'technology_training', name: '技术培训资源库' },
      { id: 'family_education', name: '家庭教育资源库' },
      { id: 'school_management', name: '学校管理资源库' },
      { id: 'mental_health', name: '心理健康资源库' },
      { id: 'new_teacher_resources', name: '新教师资源库' }
    ]
    const categoryLabel = (categories.find(c => c.id === rc.category)?.name) || '资料集合'
    const preview = window.open('', '_blank', 'width=740,height=520')
    if (preview) {
      preview.document.write(`
        <html><head><title>集合预览：${rc.title}</title></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 16px;">
          <h2>集合预览：${rc.title}</h2>
          <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;">
            <div style="display:none;width:160px;height:90px;border-radius:6px;overflow:hidden;background:#fafafa;border:1px solid #f0f0f0;">
              <img src="${getCollectionThumbnail(rc)}" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <div>
              <div style="font-weight:600;">${categoryLabel}</div>
              <div style="margin-top:6px;color:#888">创建时间：${rc.createdAt} · 项目数：${items.length}</div>
            </div>
          </div>
          ${items.length === 0 ? '<div>当前空间下暂无可预览的资源项</div>' : items.map(it => `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              
              <div style="flex:1;min-width:0;">
                <div style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${it.title}</div>
                <div style="margin-top:4px;color:#888;font-size:12px;">${(it.tags||[]).slice(0,4).join(' · ')}</div>
              </div>
              <div style="color:#888;font-size:12px;">${it.lastModified}</div>
            </div>
          `).join('')}
        </body></html>
      `)
      preview.document.close()
    }
  }

  const phaseCfg = (formatConfigs[configModal.phaseId] || {})
  const phaseObj = phaseMaterials.find(p => p.id === configModal.phaseId)
  const baseVideos = phaseCfg.videos || getDefaultConfig(phaseObj, 'videos')
  const selectedIds = baseVideos.selectedCollections || []
  const aiIds = baseVideos.aiSelectedIds || []

  const categories = [
    { id: 'teaching_resources', name: '教学资源库' },
    { id: 'technology_training', name: '技术培训资源库' },
    { id: 'family_education', name: '家庭教育资源库' },
    { id: 'school_management', name: '学校管理资源库' },
    { id: 'mental_health', name: '心理健康资源库' },
    { id: 'new_teacher_resources', name: '新教师资源库' }
  ]

  const createDefaultCollections = () => {
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

  const collections = (function(){
    const uniqueTags = (items) => Array.from(new Set((items || []).flatMap(it => it.tags || [])))
    const byId = new Map((selectedIds || []).map(id => [id, id]))
    const all = createDefaultCollections()
    const pick = all.filter(c => byId.has(c.id))
    return pick.map(rc => ({
      ...rc,
      thumbnail: getCollectionThumbnail(rc),
      items: (rc.items || []),
      tags: uniqueTags(rc.items)
    }))
  })()

  const selected = selectedIds
    .map(id => collections.find(c => c.id === id))
    .filter(Boolean)

  return (
    <Row gutter={0} wrap={false} style={{ height: '100%', alignItems: 'stretch', margin: 0 }}>
      <Col id="course-content-left" style={{ display: 'flex', width: (leftViewMode === 'single' ? '16.8%' : '33.6%'), minWidth: (leftViewMode === 'single' ? 200 : 240), flex: '0 0 auto', height: '100%' }}>
        <Card
          title={(
            <Space>
              <span>📚</span>
              <span>当前课程内容</span>
            </Space>
          )}
          extra={(
            <Space>
              <Tooltip title="单卡视图">
                <Button size="small" type="text" icon={<ProfileOutlined />} style={{ color: leftViewMode === 'single' ? '#1677ff' : undefined }} onClick={() => setLeftViewMode('single')} />
              </Tooltip>
              <Tooltip title="双卡视图">
                <Button size="small" type="text" icon={<AppstoreOutlined />} style={{ color: leftViewMode === 'double' ? '#1677ff' : undefined }} onClick={() => setLeftViewMode('double')} />
              </Tooltip>
            </Space>
          )}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          bodyStyle={{ padding: 8, flex: 1, minHeight: 0, overflow: 'auto' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: (leftViewMode === 'single') ? 'repeat(1, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
              gap: 12,
              cursor: 'default'
            }}
          >
            {selected.map(rc => (
              <Card
                key={rc.id}
                hoverable
                draggable
                onDragStart={(e) => { setDraggingId(rc.id); e.dataTransfer.setData('text/plain', rc.id) }}
                onDragEnd={() => { setDraggingId(null); setDragOverId(null) }}
                onDragOver={(e) => { e.preventDefault(); if (dragOverId !== rc.id) setDragOverId(rc.id) }}
                onDragLeave={() => { if (dragOverId === rc.id) setDragOverId(null) }}
                onDrop={(e) => {
                  e.preventDefault()
                  const draggedId = e.dataTransfer.getData('text/plain')
                  if (!draggedId || draggedId === rc.id) return
                  setFormatConfigs(prev => {
                    const phase = prev[configModal.phaseId] || {}
                    const phaseObj = phaseMaterials.find(p => p.id === configModal.phaseId)
                    const baseVideos = phase.videos || getDefaultConfig(phaseObj, 'videos')
                    const ids = Array.from((baseVideos.selectedCollections || []))
                    const from = ids.indexOf(draggedId)
                    const to = ids.indexOf(rc.id)
                    if (from === -1 || to === -1) return prev
                    ids.splice(from, 1)
                    ids.splice(to, 0, draggedId)
                    return {
                      ...prev,
                      [configModal.phaseId]: {
                        ...phase,
                        videos: { ...baseVideos, selectedCollections: ids }
                      }
                    }
                  })
                  setDraggingId(null); setDragOverId(null)
                }}
                style={{
                  width: '100%',
                  position: 'relative',
                  boxShadow: dragOverId === rc.id ? '0 4px 12px rgba(22, 119, 255, 0.3), 0 0 0 2px #1677ff' : (draggingId && draggingId !== rc.id ? '0 2px 8px rgba(0,0,0,0.1)' : undefined),
                  opacity: draggingId === rc.id ? 0.6 : 1,
                  transform: draggingId === rc.id ? 'scale(0.95) rotate(2deg)' : 'none',
                  transition: 'all 0.2s ease',
                  zIndex: draggingId === rc.id ? 1000 : 'auto'
                }}
              >
                {dragOverId === rc.id && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: -8,
                      left: -4,
                      right: -4,
                      height: 4,
                      background: 'linear-gradient(90deg, #1677ff, #40a9ff)',
                      borderRadius: '2px',
                      boxShadow: '0 2px 4px rgba(22, 119, 255, 0.4)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: '6px solid #1677ff'
                    }} />
                  </>
                )}
                <div
                  style={{ position: 'relative', width: '100%', height: 120, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0', marginBottom: 8 }}
                  onMouseEnter={() => setHoveredCardId(rc.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                >
                  <img src={getCollectionThumbnail(rc)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                      background: 'rgba(0,0,0,0.35)',
                      opacity: hoveredCardId === rc.id ? 1 : 0,
                      transition: 'opacity 0.2s ease'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="middle"
                      type="primary"
                      style={{ background: '#1677ff', borderColor: '#1677ff', borderRadius: 20, padding: '0 14px' }}
                      icon={<EyeOutlined />}
                      onClick={() => openCollectionPreview(rc)}
                    >预览</Button>
                    <Button
                      size="middle"
                      danger
                      style={{ background: '#ff4d4f', borderColor: '#ff4d4f', borderRadius: 20, padding: '0 14px', color: '#fff' }}
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setFormatConfigs(prev => {
                          const phase = prev[configModal.phaseId] || {}
                          const phaseObj = phaseMaterials.find(p => p.id === configModal.phaseId)
                          const baseVideos = phase.videos || getDefaultConfig(phaseObj, 'videos')
                          const ids = (baseVideos.selectedCollections || []).filter(x => x !== rc.id)
                          return {
                            ...prev,
                            [configModal.phaseId]: {
                              ...phase,
                              videos: { ...baseVideos, selectedCollections: ids }
                            }
                          }
                        })
                      }}
                    >取消</Button>
                  </div>
                </div>
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Text type="secondary">{(categories.find(c => c.id === rc.category)?.name) || '资料集合'}</Text>
                  <Text type="secondary">{rc.createdAt}</Text>
                </Space>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, marginTop: 8 }}>
                  <span>{rc.title}</span>
                  {aiIds.includes(rc.id) && (<Tag color="processing">AI</Tag>)}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </Col>
      <Col id="course-content-right" style={{ display: 'flex', flex: '1 1 auto', minWidth: 240, height: '100%' }}>
        <Card
          title={(
            <Space>
              <span>🗂️</span>
              <span>{leftCollapsed ? '选择集合' : '选择课程内容集合'}</span>
            </Space>
          )}
          extra={(
            (() => {
              const rightCategories = [
                { id: 'all', name: '全部' },
                { id: 'teaching_resources', name: '教学资源库' },
                { id: 'technology_training', name: '技术培训资源库' },
                { id: 'family_education', name: '家庭教育资源库' },
                { id: 'school_management', name: '学校管理资源库' },
                { id: 'mental_health', name: '心理健康资源库' },
                { id: 'new_teacher_resources', name: '新教师资源库' }
              ]
              return (
                <Space>
                  <Select
                    value={rightFilterCategory}
                    onChange={setRightFilterCategory}
                    style={{ width: (isSmallScreen || leftCollapsed) ? 120 : 160 }}
                    options={rightCategories.map(c => ({ value: c.id, label: c.name }))}
                  />
                  <Input.Search
                    allowClear
                    placeholder="搜索集合标题/标签"
                    value={rightFilterQuery}
                    onChange={(e) => setRightFilterQuery(e.target.value)}
                    onSearch={setRightFilterQuery}
                    style={{ width: (isSmallScreen || leftCollapsed) ? 160 : 220 }}
                  />
                </Space>
              )
            })()
          )}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          bodyStyle={{ padding: 8, flex: 1, minHeight: 0, overflow: 'auto' }}
        >
          <OnDemandResourceLibrary
            selectMode
            selectedCollectionIds={(function(){
              const phaseCfg = (formatConfigs[configModal.phaseId] || {})
              const phaseObj = phaseMaterials.find(p => p.id === configModal.phaseId)
              const baseVideos = phaseCfg.videos || getDefaultConfig(phaseObj, 'videos')
              return baseVideos.selectedCollections || []
            })()}
            useExternalFilters
            externalFilters={{ query: rightFilterQuery, category: rightFilterCategory }}
            defaultViewMode="grid"
            onCategoryChange={setRightFilterCategory}
            onSelectionChange={(ids) => {
              setFormatConfigs(prev => {
                const phase = prev[configModal.phaseId] || {}
                const phaseObj = phaseMaterials.find(p => p.id === configModal.phaseId)
                const baseVideos = phase.videos || getDefaultConfig(phaseObj, 'videos')
                return {
                  ...prev,
                  [configModal.phaseId]: {
                    ...phase,
                    videos: { ...baseVideos, selectedCollections: ids }
                  }
                }
              })
            }}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default VideoContentTab