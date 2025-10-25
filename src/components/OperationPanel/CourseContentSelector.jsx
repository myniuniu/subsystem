import React, { useMemo, useState } from 'react'
import { Typography, Row, Col, Card, Button, Tag, Space, Select, Divider, Empty, Checkbox, message } from 'antd'
import { PlayCircleOutlined, FileTextOutlined, FileImageOutlined, AudioOutlined, PlusOutlined } from '@ant-design/icons'
import { initialResources } from '../../data/resourceLibraryData'

const { Title, Text } = Typography

// 简化的类型图标映射
const typeIcon = (type) => {
  if (type === 'video') return <PlayCircleOutlined />
  if (type === 'document' || type === 'ppt') return <FileTextOutlined />
  if (type === 'image') return <FileImageOutlined />
  if (type === 'audio') return <AudioOutlined />
  return <FileTextOutlined />
}

// 模拟资料内部资源（拷贝简化版）
const sampleInnerItems = [
  { id: 'c-video-1', title: '课程讲解视频.mp4', type: 'video', drive: 'org', size: '320 MB', space: '技术部-研发' },
  { id: 'c-ppt-1', title: '配套课件.pptx', type: 'ppt', drive: 'org', size: '3.2 MB', space: '帮助文档' },
  { id: 'c-doc-1', title: '教学设计.pdf', type: 'document', drive: 'my', size: '1.8 MB' },
  { id: 'c-audio-1', title: '课堂录音.mp3', type: 'audio', drive: 'org', size: '25 MB', space: '技术部-研发' }
]

// 计算唯一知识空间
const computeSpaces = (resources) => {
  const set = new Set()
  resources.forEach(r => sampleInnerItems.forEach(it => { if (it.space) set.add(it.space) }))
  const arr = Array.from(set)
  return arr.length ? arr : ['技术部-研发', '帮助文档']
}

// 顶级分类（全部知识空间）
const topCategories = [
  { id: 'teaching_resources', name: '教学资源库' },
  { id: 'technology_training', name: '技术培训资源库' },
  { id: 'family_education', name: '家庭教育资源库' },
  { id: 'school_management', name: '学校管理资源库' },
  { id: 'mental_health', name: '心理健康资源库' },
  { id: 'new_teacher_resources', name: '新教师资源库' }
]

export default function CourseContentSelector({ value = [], onChange }) {
  const [currentCategory, setCurrentCategory] = useState('teaching_resources')
  const [currentSpace, setCurrentSpace] = useState('技术部-研发')
  const [activeMaterial, setActiveMaterial] = useState(null)
  const [selectedItemIds, setSelectedItemIds] = useState(() => value.map(v => v.id))

  const spaces = useMemo(() => computeSpaces(initialResources), [])
  const materials = useMemo(() => initialResources.filter(r => r.category === currentCategory), [currentCategory])

  const filteredInnerItems = useMemo(() => {
    // drive 为 org 时按空间过滤；其他直接展示
    return sampleInnerItems.filter(it => it.drive !== 'org' || (it.space === currentSpace))
  }, [currentSpace, activeMaterial])

  const toggleSelect = (item) => {
    const exists = selectedItemIds.includes(item.id)
    let nextIds
    let nextItems
    if (exists) {
      nextIds = selectedItemIds.filter(id => id !== item.id)
      nextItems = (value || []).filter(v => v.id !== item.id)
    } else {
      nextIds = [...selectedItemIds, item.id]
      nextItems = [...(value || []), { ...item, materialId: activeMaterial?.id, materialTitle: activeMaterial?.title }]
    }
    setSelectedItemIds(nextIds)
    onChange && onChange(nextItems)
  }

  const clearSelection = () => {
    setSelectedItemIds([])
    onChange && onChange([])
  }

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
            options={spaces.map(s => ({ value: s, label: `空间：${s}` }))}
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
                {materials.slice(0, 12).map(m => (
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