import React, { useMemo, useState } from 'react'
import './OrgMembersDepartments.css'
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

// 模拟部门树
const departmentTreeData = [
  {
    title: companyName,
    key: 'root',
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
      },
      { title: '市场部', key: 'dept-marketing' },
      { title: '销售部', key: 'dept-sales' },
      { title: '人事部', key: 'dept-hr' }
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
  'dept-product-design',
  'dept-marketing',
  'dept-sales',
  'dept-hr'
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
    'dept-product-design': '产品部 / 设计组',
    'dept-marketing': '市场部',
    'dept-sales': '销售部',
    'dept-hr': '人事部'
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
  const [selectedDeptKeys, setSelectedDeptKeys] = useState(['root'])
  const [activeTab, setActiveTab] = useState('members') // members | departments | offboarded
  const [statusFilter, setStatusFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('all')

  const filteredMembers = useMemo(() => {
    let base = selectedDeptKeys.includes('root')
      ? allMembers
      : allMembers.filter(m => selectedDeptKeys.includes(m.departmentKey))

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
      marketing: '市场部',
      sales: '销售部',
      hr: '人事部'
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

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (text) => (
        <Space>
          <Avatar size={28} style={{ backgroundColor: '#1677ff' }}>
            {text.slice(0, 1)}
          </Avatar>
          <Text strong>{text}</Text>
        </Space>
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

  return (
    <Layout className="org-layout">
      <Sider width={260} className="org-sider">
        <div className="org-sider-header">
          <Text strong>组织架构</Text>
        </div>
        <div className="org-tree-wrapper">
          <Tree
            showLine
            defaultExpandAll
            selectedKeys={selectedDeptKeys}
            onSelect={(keys) => setSelectedDeptKeys(keys.length ? keys : ['root'])}
            treeData={departmentTreeData}
          />
        </div>
      </Sider>
      <Content className="org-content">
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
            <Breadcrumb.Item>组织架构</Breadcrumb.Item>
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
              { value: 'marketing', label: '市场部' },
              { value: 'sales', label: '销售部' },
              { value: 'hr', label: '人事部' }
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
                columns={columns}
                dataSource={filteredMembers}
                pagination={false}
                tableLayout="fixed"
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>
      </Content>
    </Layout>
  )
}

export default ContactsDirectory