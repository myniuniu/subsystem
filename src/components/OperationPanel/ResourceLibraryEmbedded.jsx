import React, { useMemo, useState, useEffect } from 'react'
import { Typography, Row, Col, Card, Button, Tag, Space, Select, Divider, Empty, Checkbox, Input } from 'antd'
import { PlayCircleOutlined, FileTextOutlined, FileImageOutlined, AudioOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { initialResources } from '../../data/resourceLibraryData'

const { Title, Text } = Typography

// 精简版资源库（拷贝版本）：用于配置弹窗嵌入显示与后续独立改造
// - 支持知识空间切换（监听 knowledgeSpaceChanged 事件 + 下拉）
// - 左侧显示资料集合（从 initialResources 过滤构造）
// - 右侧显示资料内部资源（示例数据，组织盘按空间过滤）
// - 预留后续改造点：搜索、标签过滤、选择回写等

const typeIcon = (type) => {
  if (type === 'video') return <PlayCircleOutlined />
  if (type === 'document' || type === 'ppt') return <FileTextOutlined />
  if (type === 'image') return <FileImageOutlined />
  if (type === 'audio') return <AudioOutlined />
  return <FileTextOutlined />
}

// 示例：资料内部资源（可后续替换为真实集合 items）
const sampleInnerItems = [
  { id: 'c-video-1', title: '课程讲解视频.mp4', type: 'video', drive: 'org', size: '320 MB', space: '技术部-研发' },
  { id: 'c-ppt-1', title: '配套课件.pptx', type: 'ppt', drive: 'org', size: '3.2 MB', space: '帮助文档' },
  { id: 'c-doc-1', title: '教学设计.pdf', type: 'document', drive: 'my', size: '1.8 MB' },
  { id: 'c-audio-1', title: '课堂录音.mp3', type: 'audio', drive: 'org', size: '25 MB', space: '技术部-研发' }
]

const DEFAULT_SPACE = '技术部-研发'

const topCategories = [
  { id: 'teaching_resources', name: '教学资源库' },
  { id: 'technology_training', name: '技术培训资源库' },
  { id: 'family_education', name: '家庭教育资源库' },
  { id: 'school_management', name: '学校管理资源库' },
  { id: 'mental_health', name: '心理健康资源库' },
  { id: 'new_teacher_resources', name: '新教师资源库' }
]

export default function ResourceLibraryEmbedded({ embedded = true }) {
  // 空间状态：默认从 localStorage 读取，并监听外部空间切换事件
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

  const [currentCategory, setCurrentCategory] = useState('teaching_resources')
  const [activeMaterial, setActiveMaterial] = useState(null)
  const [selectedItemIds, setSelectedItemIds] = useState([])
  const [query, setQuery] = useState('')

  // 资料集合：从 initialResources 过滤得到（后续可替换为真实集合）
  const materialsAll = useMemo(() => initialResources || [], [])
  const materials = useMemo(() => {
    const list = materialsAll.filter(r => r.category === currentCategory)
    if (!query) return list
    const q = query.trim().toLowerCase()
    return list.filter(r => String(r.title || '').toLowerCase().includes(q) || String(r.description || '').toLowerCase().includes(q))
  }, [materialsAll, currentCategory, query])

  // 内部资源：示例数据，组织盘按空间过滤；my 盘不受空间限制
  const filteredInnerItems = useMemo(() => {
    return sampleInnerItems.filter(it => it.drive !== 'org' || ((it.space || DEFAULT_SPACE) === currentSpace))
  }, [currentSpace, activeMaterial])

  const toggleSelect = (item) => {
    const exists = selectedItemIds.includes(item.id)
    const next = exists ? selectedItemIds.filter(id => id !== item.id) : [...selectedItemIds, item.id]
    setSelectedItemIds(next)
  }

  const clearSelection = () => setSelectedItemIds([])

  // 可视化布局：适配弹窗内嵌，两列布局
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Space style={{ justifyContent: 'space-between' }}>
        <Space>
          <Select
            value={currentCategory}
            onChange={setCurrentCategory}
            style={{ width: 220 }}
            options={topCategories.map(c => ({ value: c.id, label: c.name }))}
          />
          <Select
            value={currentSpace}
            onChange={setCurrentSpace}
            style={{ width: 180 }}
            options={[DEFAULT_SPACE, '帮助文档'].map(s => ({ value: s, label: `空间：${s}` }))}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            allowClear
            prefix={<SearchOutlined />}
            placeholder="搜索资料关键字"
            style={{ width: 220 }}
          />
        </Space>
        <Space>
          <Tag color="blue">已选 {selectedItemIds.length} 项</Tag>
          <Button size="small" onClick={clearSelection}>清空选择</Button>
        </Space>
      </Space>

      <Row gutter={[12, 12]}>
        <Col span={10}>
          <Card size="small" title={<Space><span>资料库 · {topCategories.find(c => c.id === currentCategory)?.name}</span><Tag color="geekblue">{materials.length}</Tag></Space>} bodyStyle={{ padding: 8 }}>
            {materials.length === 0 ? (
              <Empty description="无资料" />
            ) : (
              <Space direction="vertical" style={{ width: '100%' }}>
                {materials.slice(0, 20).map(m => (
                  <Card key={m.id} size="small" hoverable onClick={() => setActiveMaterial(m)} bodyStyle={{ padding: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {typeIcon(m.type)}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{m.title}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{m.description}</Text>
                      </div>
                      <Tag>{m.type}</Tag>
                    </div>
                  </Card>
                ))}
              </Space>
            )}
          </Card>
        </Col>

        <Col span={14}>
          <Card size="small" title={<Space><span>资料内容 · {activeMaterial ? activeMaterial.title : '请选择左侧资料'}</span><Tag color="blue">空间：{currentSpace}</Tag></Space>} bodyStyle={{ padding: 8 }}>
            {!activeMaterial ? (
              <Empty description="请选择左侧一项资料以查看内部资源" />
            ) : (
              <Row gutter={[8, 8]}>
                {filteredInnerItems.map(it => (
                  <Col key={it.id} xs={24} sm={12}>
                    <Card size="small" hoverable bodyStyle={{ padding: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {typeIcon(it.type)}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>{it.title}</div>
                            <Text type="secondary" style={{ fontSize: 12 }}>类型：{it.type} · 大小：{it.size}</Text>
                          </div>
                          <Checkbox checked={selectedItemIds.includes(it.id)} onChange={() => toggleSelect(it)} />
                        </div>
                        <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={() => toggleSelect(it)}>
                          {selectedItemIds.includes(it.id) ? '取消选择' : '加入课程内容'}
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}