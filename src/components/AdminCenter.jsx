import React, { useState, useEffect } from 'react'
import { Layout, Card, Typography, Menu, Tabs, Row, Col, Button, Tag, Avatar, Modal } from 'antd'
import { Users, Shield, Package } from 'lucide-react'
import OrgMembersDepartments from './OrgMembersDepartments'
import './AdminCenter.css'

const { Sider, Content } = Layout
const { Title, Paragraph } = Typography

const AdminCenter = () => {
  const [activeKey, setActiveKey] = useState('org-members-departments')
  const [installedApps, setInstalledApps] = useState([
    { id: 'guoren-space', name: '果仁空间', desc: '统一学习与工作平台入口', color: '#3b82f6', tags: ['平台', '工作台'] }
  ])
  const [moreApps, setMoreApps] = useState([
    { id: 'resource-center', name: '资源中心', desc: '统一的教学与文档资源管理', color: '#3b82f6', tags: ['资源', '文档'] },
    { id: 'meeting-center', name: '会议中心', desc: '会议安排与纪要管理', color: '#f59e0b', tags: ['会议', '纪要'] },
    { id: 'download-center', name: '下载中心', desc: '任务下载与文件管理', color: '#6366f1', tags: ['下载', '任务'] }
  ])
  const [isConfigVisible, setIsConfigVisible] = useState(false)
  const [configApp, setConfigApp] = useState(null)

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
    },
    {
      key: 'app-management',
      label: '应用管理',
      icon: <Package size={16} />
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
        ) : activeKey === 'app-management' ? (
          <Card style={{ width: '100%', maxWidth: 'none', margin: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              {'应用管理'}
            </Title>
            <Tabs
              className="app-tabs"
              items={[
                {
                  key: 'installed',
                  label: '已安装',
                  children: (
                    <div className="app-tab-pane" style={{ paddingTop: 8 }}>
                      <Row gutter={[12, 12]}>
                        {installedApps.map(app => (
                          <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
                            <Card
                              className="app-card"
                              hoverable
                              actions={[
                                <Button
                                  key="config"
                                  type="text"
                                  onClick={() => {
                                    setConfigApp(app)
                                    setIsConfigVisible(true)
                                  }}
                                >
                                  配置
                                </Button>
                              ]}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Avatar size={40} style={{ backgroundColor: app.color }}>
                                  {app.name.slice(0, 1)}
                                </Avatar>
                                <div>
                                  <div style={{ fontWeight: 600 }}>{app.name}</div>
                                  <Paragraph type="secondary" style={{ margin: 0 }}>{app.desc}</Paragraph>
                                </div>
                              </div>
                              <div style={{ marginTop: 8 }}>
                                {(app.tags || []).map(t => (
                                  <Tag key={t} color="blue">{t}</Tag>
                                ))}
                              </div>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'more',
                  label: '更多应用',
                  children: (
                    <div className="app-tab-pane" style={{ paddingTop: 8 }}>
                      <Row gutter={[12, 12]}>
                        {moreApps.map(app => (
                          <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
                            <Card
                              className="app-card"
                              hoverable
                              actions={[
                                <Button key="install" type="primary" ghost onClick={() => {
                                  setMoreApps(prev => prev.filter(a => a.id !== app.id))
                                  setInstalledApps(prev => [...prev, app])
                                }}>
                                  安装
                                </Button>
                              ]}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Avatar size={40} style={{ backgroundColor: app.color }}>
                                  {app.name.slice(0, 1)}
                                </Avatar>
                                <div>
                                  <div style={{ fontWeight: 600 }}>{app.name}</div>
                                  <Paragraph type="secondary" style={{ margin: 0 }}>{app.desc}</Paragraph>
                                </div>
                              </div>
                              <div style={{ marginTop: 8 }}>
                                {(app.tags || []).map(t => (
                                  <Tag key={t} color="geekblue">{t}</Tag>
                                ))}
                              </div>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )
                }
              ]}
            />
            <Modal
              title={configApp ? `配置 · ${configApp.name}` : '配置'}
              open={isConfigVisible}
              onCancel={() => setIsConfigVisible(false)}
              onOk={() => setIsConfigVisible(false)}
            >
              <Paragraph type="secondary">
                {'可在此配置应用的显示、权限与入口。'}
              </Paragraph>
            </Modal>
          </Card>
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
