import React, { useMemo, useState } from 'react'
import './OrgMembersDepartments.css'
import './ChatWindow.css'
import { X } from 'lucide-react'
import {
  Layout,
  Tree,
  Table,
  Input,
  Space,
  Tag,
  Typography,
  Breadcrumb,
  Avatar,
  Divider,
  Tabs,
  Select
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const { Sider, Content } = Layout
const { Text } = Typography

const companyName = '北京国人通教育科技有限公司'

// 模拟部门树（移除市场部、销售部、人事部）
const departmentTreeData = [
  {
    title: companyName,
    key: 'company-root',
    children: [
      {
        title: '技术部',
        key: 'dept-tech',
        children: [
          { title: '前端组', key: 'dept-tech-fe' },
          { title: '后端组', key: 'dept-tech-be' },
          { title: '测试组', key: 'dept-tech-qa' }
        ]
      },
      {
        title: '产品部',
        key: 'dept-product',
        children: [
          { title: '需求组', key: 'dept-product-req' },
          { title: '设计组', key: 'dept-product-design' }
        ]
      }
    ]
  }
]

// 模拟人员数据
const names = [
  '陈安', '李雪', '王明', '赵丽', '孙浩', '周洋', '吴倩', '郑宇', '冯晨', '褚凯',
  '卫婷', '蒋磊', '沈静', '韩博', '杨帆', '朱敏', '秦峰', '尤然', '许泽', '何佳',
  '吕倩', '施乐', '张越', '孔扬', '曹楠', '严宁', '华清', '金波', '魏巍', '陶然',
  '姜楠', '戚鑫', '谢婧', '邹昊', '喻辰', '柏林', '水晶', '窦羽', '章琴', '云舒',
  '苏航', '潘磊', '葛亮', '奚悦', '范慧', '彭越', '鲁宁', '韦华', '昌乐', '苗云'
]

const deptKeys = [
  'dept-tech-fe',
  'dept-tech-be',
  'dept-tech-qa',
  'dept-product-req',
  'dept-product-design'
]

function makePhone(i) {
  return `1${String(3 + (i % 6)).padStart(2, '0')}${String(5678 + i).padStart(8, '0')}`
}

const allMembers = Array.from({ length: 100 }, (_, i) => {
  const name = names[i % names.length]
  const deptKey = deptKeys[i % deptKeys.length]
  const deptNameMap = {
    'dept-tech-fe': '技术部 / 前端组',
    'dept-tech-be': '技术部 / 后端组',
    'dept-tech-qa': '技术部 / 测试组',
    'dept-product-req': '产品部 / 需求组',
    'dept-product-design': '产品部 / 设计组'
  }
  return {
    key: `member-${i}`,
    name,
    status: '在职',
    phone: makePhone(i),
    departmentKey: deptKey,
    department: deptNameMap[deptKey]
  }
})

const ContactsDirectory = () => {
  const [search, setSearch] = useState('')
  const [selectedDeptKeys, setSelectedDeptKeys] = useState([])
  const [activeCategory, setActiveCategory] = useState('ai-friends')
  const [activeTab, setActiveTab] = useState('members') // members | departments | offboarded
  const [statusFilter, setStatusFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('all')
  const [showCardKey, setShowCardKey] = useState(null)

  const [aiFriends, setAiFriends] = useState(() => {
    const seed = [
      {
        key: 'ai-li-ming',
        name: '李明',
        status: 'AI',
        phone: '',
        departmentKey: 'ai-friends',
        department: 'AI好友',
        avatar: '/assets/场景模拟/小男孩头像.png',
        isAI: true,
        motto: '保持热爱，奔赴山海',
        description: '大二学生李明，近期考试较多、压力大，夜间失眠，上课难以集中注意力。来到辅导员办公室表达困扰，期望获得情绪调适与学习规划建议。',
        source: '场景模拟',
        sourceTitle: '学业压力过大',
        sourceLink: '/gen-html/ai-mental-health-scenario.html#history-latest'
      }
    ]
    let templates = []
    try {
      const raw = localStorage.getItem('theme-templates')
      templates = raw ? JSON.parse(raw) : []
    } catch {}
    if (!Array.isArray(templates) || templates.length === 0) {
      templates = [
        { id: 'teaching-research', name: '教研智能体', description: '面向教学与教研场景的通用智能体', avatarUrl: '/images/agents/teacher.svg' },
        { id: 'class-teacher', name: '班主任智能体', description: '面向班级管理与家校沟通的班主任辅助智能体', avatarUrl: '' },
        { id: 'counselor', name: '辅导员智能体', description: '面向学生思想政治与事务管理的辅导员智能体', avatarUrl: '' },
        { id: 'supervisor', name: '督学智能体', description: '面向督导评估与质量监测的督学智能体', avatarUrl: '' },
        { id: 'principal', name: '校长智能体', description: '面向学校治理与决策支持的校长智能体', avatarUrl: '' },
        { id: 'scientific-research', name: '科研智能体', description: '面向课题研究与成果管理的科研智能体', avatarUrl: '' }
      ]
    }
    const mapped = templates.map(t => ({
      key: `ai-${t.id || String(t.name || Date.now())}`,
      name: t.name || '智能体',
      status: 'AI',
      phone: '',
      departmentKey: 'ai-friends',
      department: 'AI好友',
      avatar: t.avatarUrl || '',
      isAI: true,
      motto: '保持热爱，奔赴山海',
      description: t.description || '',
      source: '智能体',
      sourceTitle: '详情',
      sourceLink: ''
    }))
    return [...seed, ...mapped]
  })

  const filteredMembers = useMemo(() => {
    let base
    if (activeCategory === 'ai-friends') {
      base = aiFriends
    } else {
      base = selectedDeptKeys.includes('company-root')
        ? allMembers
        : allMembers.filter(m => selectedDeptKeys.includes(m.departmentKey))
    }

    if (statusFilter === 'active') {
      base = base.filter(m => m.status === '在职')
    } else if (statusFilter === 'disabled') {
      base = base.filter(m => m.status === '已停用')
    } else if (statusFilter === 'offboarded') {
      base = []
    }

    const deptKeywordMap = {
      tech: '技术部',
      product: '产品部',
      ai: 'AI好友'
    }
    if (deptFilter !== 'all') {
      const kw = deptKeywordMap[deptFilter]
      base = base.filter(m => m.department.includes(kw))
    }

    const q = search.trim()
    if (q) {
      base = base.filter(m =>
        m.name.includes(q) || m.phone.includes(q) || m.department.includes(q)
      )
    }

    if (activeTab === 'offboarded') return []
    return base
  }, [search, selectedDeptKeys, statusFilter, deptFilter, activeTab])

  const columnsCompany = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (text, record) => (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {record?.avatar ? (
            (String(record.avatar).startsWith('http') || String(record.avatar).startsWith('/')) ? (
              <img src={record.avatar} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%' }} />
            ) : (
              <Avatar size={28} style={{ backgroundColor: '#1677ff' }}>{text.slice(0, 1)}</Avatar>
            )
          ) : (
            <Avatar size={28} style={{ backgroundColor: '#1677ff' }}>{text.slice(0, 1)}</Avatar>
          )}
          <Text
            strong
            style={{ marginLeft: 8, cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); setShowCardKey(prev => prev === record.key ? null : record.key) }}
          >
            {text}
          </Text>
          {showCardKey === record.key && (
            <div
              className="contact-detail-card"
              style={{ position: 'absolute', left: 36, top: 32, zIndex: 1000 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="detail-header">
                <div className="detail-avatar">
                  {record?.avatar ? (
                    (String(record.avatar).startsWith('http') || String(record.avatar).startsWith('/')) ? (
                      <img src={record.avatar} alt="avatar" />
                    ) : (
                      <div className="detail-avatar-emoji">{record.avatar}</div>
                    )
                  ) : (
                    <div className="detail-avatar-initial">{String(record?.name || '').charAt(0)}</div>
                  )}
                </div>
                <div className="detail-info">
                  <div className="detail-name">{record?.name || ''}</div>
                  <div className="detail-motto">{record?.motto || '保持热爱，奔赴山海'}</div>
                </div>
                <button className="detail-close-btn" onClick={() => setShowCardKey(null)}>
                  <X size={14} />
                </button>
              </div>
              <div className="detail-fields">
                <div className="detail-field">
                  <span className="field-label">部门</span>
                  <span className="field-value">{record?.department || '暂无'}</span>
                </div>
                <div className="detail-field">
                  <span className="field-label">来源</span>
                  <span className="field-value">
                    {record?.source || '—'}
                    {record?.sourceLink && (
                      <a className="detail-source-link" href={record.sourceLink} target="_blank" rel="noopener noreferrer">
                        {record?.sourceTitle || '历史记录'}
                      </a>
                    )}
                  </span>
                </div>
                <div className="detail-field">
                  <span className="field-label">备注与描述</span>
                </div>
                <div className="detail-note">{record?.description || '暂无'}</div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color="blue">{s}</Tag>
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 160
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      ellipsis: true,
      render: (d) => <Text>{d}</Text>
    }
  ]

  const columnsAI = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      ellipsis: true,
      render: (text, record) => (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {record?.avatar ? (
            (String(record.avatar).startsWith('http') || String(record.avatar).startsWith('/')) ? (
              <img src={record.avatar} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%' }} />
            ) : (
              <Avatar size={28} style={{ backgroundColor: '#1677ff' }}>{text.slice(0, 1)}</Avatar>
            )
          ) : (
            <Avatar size={28} style={{ backgroundColor: '#1677ff' }}>{text.slice(0, 1)}</Avatar>
          )}
          <Text
            strong
            style={{ marginLeft: 8, cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); setShowCardKey(prev => prev === record.key ? null : record.key) }}
          >
            {text}
          </Text>
          {showCardKey === record.key && (
            <div
              className="contact-detail-card"
              style={{ position: 'absolute', left: 36, top: 32, zIndex: 1000 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="detail-header">
                <div className="detail-avatar">
                  {record?.avatar ? (
                    (String(record.avatar).startsWith('http') || String(record.avatar).startsWith('/')) ? (
                      <img src={record.avatar} alt="avatar" />
                    ) : (
                      <div className="detail-avatar-emoji">{record.avatar}</div>
                    )
                  ) : (
                    <div className="detail-avatar-initial">{String(record?.name || '').charAt(0)}</div>
                  )}
                </div>
                <div className="detail-info">
                  <div className="detail-name">{record?.name || ''}</div>
                  <div className="detail-motto">{record?.motto || '保持热爱，奔赴山海'}</div>
                </div>
                <button className="detail-close-btn" onClick={() => setShowCardKey(null)}>
                  <X size={14} />
                </button>
              </div>
              <div className="detail-fields">
                <div className="detail-field">
                  <span className="field-label">来源</span>
                  <span className="field-value">
                    {record?.source || '—'}
                    {record?.sourceLink && (
                      <a className="detail-source-link" href={record.sourceLink} target="_blank" rel="noopener noreferrer">
                        {record?.sourceTitle || '历史记录'}
                      </a>
                    )}
                  </span>
                </div>
                <div className="detail-field">
                  <span className="field-label">备注与描述</span>
                </div>
                <div className="detail-note">{record?.description || '暂无'}</div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 260,
      ellipsis: true,
      render: (_, record) => (
        <span>
          {record?.source || '—'}
          {record?.sourceTitle && (
            <a style={{ marginLeft: 6 }} href={record.sourceLink} target="_blank" rel="noopener noreferrer">
              {record.sourceTitle}
            </a>
          )}
        </span>
      )
    },
    {
      title: '备注与描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (d) => <Text>{d || '暂无'}</Text>
    }
  ]

  

  React.useEffect(() => {
    const onDocClick = () => setShowCardKey(null)
    document.addEventListener('click', onDocClick, true)
    return () => document.removeEventListener('click', onDocClick, true)
  }, [])

  return (
    <Layout className="org-layout">
      <Sider width={260} className="org-sider">
        <div className="org-sider-header">
          <Text strong>通讯录</Text>
        </div>
        <div style={{ padding: '8px 12px' }}>
          <div
            onClick={() => { setActiveCategory('ai-friends'); setSelectedDeptKeys([]); setActiveTab('members'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderRadius: 8,
              cursor: 'pointer',
              background: activeCategory === 'ai-friends' ? 'rgba(0,0,0,0.06)' : 'transparent'
            }}
          >
            <span style={{ fontSize: 18 }}>🤖</span>
            <span style={{ fontSize: 14 }}>AI好友</span>
          </div>
        </div>
        <div className="org-tree-wrapper">
          <Tree
            showLine
            defaultExpandAll
            selectedKeys={selectedDeptKeys}
            onSelect={(keys) => { setActiveCategory(null); setSelectedDeptKeys(keys.length ? keys : ['company-root']) }}
            treeData={departmentTreeData}
          />
        </div>
      </Sider>
      <Content className="org-content">
        {activeCategory === 'ai-friends' ? (
          <div className="org-table-card">
            <Table
              size="middle"
              columns={columnsAI}
              dataSource={filteredMembers}
              pagination={false}
              tableLayout="fixed"
              style={{ width: '100%' }}
            />
          </div>
        ) : (
          <>
            <div className="org-top-tabs">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                  { key: 'members', label: '成员' },
                  { key: 'departments', label: '部门' },
                  { key: 'offboarded', label: '已离职成员' }
                ]}
              />
            </div>
            <div className="org-header">
              <Breadcrumb>
                <Breadcrumb.Item>通讯录</Breadcrumb.Item>
                <Breadcrumb.Item>成员</Breadcrumb.Item>
              </Breadcrumb>
              <div className="org-company-info">
                <Text strong>{companyName}</Text>
                <Text type="secondary" style={{ marginLeft: 8 }}>总人数 100</Text>
              </div>
            </div>
            <div className="org-toolbar">
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="输入姓名、手机号、部门关键词"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="org-search"
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'all', label: '成员状态：全部' },
                  { value: 'active', label: '在职' },
                  { value: 'disabled', label: '已停用' },
                  { value: 'offboarded', label: '已离职' }
                ]}
              />
              <Select
                value={deptFilter}
                onChange={setDeptFilter}
                options={[
                  { value: 'all', label: '所属部门：全部' },
                  { value: 'tech', label: '技术部' },
                  { value: 'product', label: '产品部' },
                  { value: 'ai', label: 'AI好友' }
                ]}
              />
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div className="org-main">
              {activeTab === 'departments' ? (
                <div className="org-table-card">
                  <div className="org-table-header">
                    <Space size={12}>
                      <Tag color="default">部门结构</Tag>
                    </Space>
                  </div>
                  <div style={{ padding: 8 }}>
                    <Tree
                      showLine
                      defaultExpandAll
                      treeData={departmentTreeData}
                      selectable={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="org-table-card">
                  <Table
                    size="middle"
                    columns={columnsCompany}
                    dataSource={filteredMembers}
                    pagination={false}
                    tableLayout="fixed"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </Content>
    </Layout>
  )
}

export default ContactsDirectory