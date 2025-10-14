import React, { useState, useEffect } from 'react'
import { Layout, Card, Typography, Menu } from 'antd'
import { Users, Shield } from 'lucide-react'
import OrgMembersDepartments from './OrgMembersDepartments'

const { Sider, Content } = Layout
const { Title, Paragraph } = Typography

const AdminCenter = () => {
  const [activeKey, setActiveKey] = useState('org-members-departments')

  // 设置页面标题为“果仁-管理后台”，离开页面时恢复
  useEffect(() => {
    const prevTitle = document.title
    document.title = '果仁-管理后台'
    return () => {
      document.title = prevTitle
    }
  }, [])

  const menuItems = [
    {
      key: 'organization',
      label: '组织架构',
      icon: <Users size={16} />,
      children: [
        {
          key: 'org-members-departments',
          label: '成员与部门',
          icon: <Users size={16} />
        },
        {
          key: 'org-role-management',
          label: '角色管理',
          icon: <Shield size={16} />
        }
      ]
    }
  ]

  return (
    <Layout style={{ height: '100vh', background: '#f5f7fa' }}>
      <Sider 
        width={220}
        style={{ 
          background: 'var(--theme-cardBackground)',
          borderRight: '1px solid rgba(0,0,0,0.06)'
        }}
      >
        <div style={{ padding: '16px', fontWeight: 600 }}>管理后台</div>
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          defaultOpenKeys={["organization"]}
          items={menuItems}
          onClick={(e) => setActiveKey(e.key)}
        />
      </Sider>
      <Content style={{ padding: '0 8px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeKey === 'org-members-departments' ? (
          <OrgMembersDepartments />
        ) : (
          <Card style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              {'组织架构 · 角色管理'}
            </Title>
            <Paragraph type="secondary">
              {'在此配置角色与权限策略，支持角色创建、权限分配与审计。'}
            </Paragraph>
          </Card>
        )}
      </Content>
    </Layout>
  )
}

export default AdminCenter