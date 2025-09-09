import React, { useState, useEffect } from 'react';
import {
  Modal,
  Table,
  Button,
  Space,
  Tag,
  Avatar,
  Select,
  Input,
  Form,
  message,
  Tooltip,
  Popconfirm,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Badge,
  List,
  Transfer,
  Tabs
} from 'antd';
import {
  UserAddOutlined,
  DeleteOutlined,
  EditOutlined,
  CrownOutlined,
  EyeOutlined,
  SafetyOutlined,
  TeamOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const UserPermissionManager = ({ 
  visible, 
  onCancel, 
  projectId, 
  projectTitle,
  currentMembers = [],
  onMembersUpdate 
}) => {
  // 状态管理
  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isEditPermissionVisible, setIsEditPermissionVisible] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  
  // 权限级别定义
  const permissionLevels = {
    owner: {
      label: '项目负责人',
      color: 'red',
      icon: <CrownOutlined />,
      description: '拥有所有权限，包括删除项目和管理成员'
    },
    admin: {
      label: '管理员',
      color: 'orange',
      icon: <SafetyOutlined />,
      description: '可以编辑内容、管理成员，但不能删除项目'
    },
    editor: {
      label: '编辑者',
      color: 'blue',
      icon: <EditOutlined />,
      description: '可以编辑和评论内容，不能管理成员'
    },
    viewer: {
      label: '查看者',
      color: 'green',
      icon: <EyeOutlined />,
      description: '只能查看内容和添加评论'
    }
  };
  
  // 模拟数据初始化
  useEffect(() => {
    if (visible) {
      // 模拟当前项目成员
      const mockMembers = [
        {
          id: 'user1',
          name: '张老师',
          email: 'zhang@school.edu',
          phone: '138****1234',
          avatar: '👨‍🏫',
          department: '数学组',
          role: 'owner',
          joinDate: '2024-01-10',
          lastActive: '2024-01-15 16:30',
          status: 'online',
          contributions: {
            documents: 5,
            comments: 12,
            edits: 28
          }
        },
        {
          id: 'user2',
          name: '李老师',
          email: 'li@school.edu',
          phone: '139****5678',
          avatar: '👩‍🏫',
          department: '数学组',
          role: 'admin',
          joinDate: '2024-01-12',
          lastActive: '2024-01-15 15:20',
          status: 'online',
          contributions: {
            documents: 3,
            comments: 8,
            edits: 15
          }
        },
        {
          id: 'user3',
          name: '王老师',
          email: 'wang@school.edu',
          phone: '137****9012',
          avatar: '👨‍💼',
          department: '数学组',
          role: 'editor',
          joinDate: '2024-01-13',
          lastActive: '2024-01-15 14:10',
          status: 'offline',
          contributions: {
            documents: 2,
            comments: 5,
            edits: 8
          }
        },
        {
          id: 'user4',
          name: '刘老师',
          email: 'liu@school.edu',
          phone: '136****3456',
          avatar: '👩‍💼',
          department: '教务处',
          role: 'viewer',
          joinDate: '2024-01-14',
          lastActive: '2024-01-15 10:30',
          status: 'offline',
          contributions: {
            documents: 0,
            comments: 3,
            edits: 0
          }
        }
      ];
      setMembers(mockMembers);
      
      // 模拟可添加的用户
      const mockAvailableUsers = [
        {
          key: 'user5',
          title: '陈老师 (数学组)',
          description: 'chen@school.edu',
          avatar: '👨‍🎓'
        },
        {
          key: 'user6',
          title: '赵老师 (数学组)',
          description: 'zhao@school.edu',
          avatar: '👩‍🎓'
        },
        {
          key: 'user7',
          title: '孙老师 (教务处)',
          description: 'sun@school.edu',
          avatar: '👨‍💻'
        },
        {
          key: 'user8',
          title: '周老师 (数学组)',
          description: 'zhou@school.edu',
          avatar: '👩‍💻'
        }
      ];
      setAvailableUsers(mockAvailableUsers);
    }
  }, [visible]);
  
  // 获取权限标签
  const getPermissionTag = (role) => {
    const permission = permissionLevels[role];
    return (
      <Tag color={permission.color} icon={permission.icon}>
        {permission.label}
      </Tag>
    );
  };
  
  // 获取状态标签
  const getStatusBadge = (status) => {
    return (
      <Badge 
        status={status === 'online' ? 'success' : 'default'} 
        text={status === 'online' ? '在线' : '离线'}
      />
    );
  };
  
  // 添加成员
  const handleAddMembers = () => {
    if (selectedUsers.length === 0) {
      message.warning('请选择要添加的成员');
      return;
    }
    
    const newMembers = selectedUsers.map(userId => {
      const user = availableUsers.find(u => u.key === userId);
      return {
        id: userId,
        name: user.title.split(' (')[0],
        email: user.description,
        phone: '138****0000',
        avatar: user.avatar,
        department: user.title.split('(')[1]?.replace(')', '') || '未知',
        role: 'viewer', // 默认权限
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: '刚刚',
        status: 'online',
        contributions: {
          documents: 0,
          comments: 0,
          edits: 0
        }
      };
    });
    
    setMembers(prev => [...prev, ...newMembers]);
    setSelectedUsers([]);
    setIsAddUserModalVisible(false);
    message.success(`成功添加 ${newMembers.length} 名成员`);
    
    // 通知父组件更新
    if (onMembersUpdate) {
      onMembersUpdate([...members, ...newMembers]);
    }
  };
  
  // 移除成员
  const handleRemoveMember = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member.role === 'owner') {
      message.error('不能移除项目负责人');
      return;
    }
    
    const updatedMembers = members.filter(m => m.id !== memberId);
    setMembers(updatedMembers);
    message.success('成员已移除');
    
    // 通知父组件更新
    if (onMembersUpdate) {
      onMembersUpdate(updatedMembers);
    }
  };
  
  // 编辑权限
  const handleEditPermission = (member) => {
    if (member.role === 'owner') {
      message.error('不能修改项目负责人的权限');
      return;
    }
    
    setEditingMember(member);
    form.setFieldsValue({
      role: member.role
    });
    setIsEditPermissionVisible(true);
  };
  
  // 保存权限修改
  const handleSavePermission = () => {
    form.validateFields().then(values => {
      const updatedMembers = members.map(m => 
        m.id === editingMember.id 
          ? { ...m, role: values.role }
          : m
      );
      setMembers(updatedMembers);
      setIsEditPermissionVisible(false);
      setEditingMember(null);
      form.resetFields();
      message.success('权限已更新');
      
      // 通知父组件更新
      if (onMembersUpdate) {
        onMembersUpdate(updatedMembers);
      }
    });
  };
  
  // 成员表格列定义
  const memberColumns = [
    {
      title: '成员信息',
      key: 'member',
      width: 250,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar size={40}>{record.avatar}</Avatar>
          <div>
            <div style={{ fontWeight: 500, marginBottom: '2px' }}>
              {record.name}
              {record.role === 'owner' && (
                <CrownOutlined style={{ color: '#faad14', marginLeft: '4px' }} />
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              <MailOutlined style={{ marginRight: '4px' }} />
              {record.email}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              <PhoneOutlined style={{ marginRight: '4px' }} />
              {record.phone}
            </div>
          </div>
        </div>
      )
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100
    },
    {
      title: '权限',
      key: 'permission',
      width: 120,
      render: (_, record) => getPermissionTag(record.role)
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: (_, record) => getStatusBadge(record.status)
    },
    {
      title: '贡献统计',
      key: 'contributions',
      width: 150,
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>文档: {record.contributions.documents}</div>
          <div>评论: {record.contributions.comments}</div>
          <div>编辑: {record.contributions.edits}</div>
        </div>
      )
    },
    {
      title: '加入时间',
      key: 'joinDate',
      width: 100,
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>{record.joinDate}</div>
          <div style={{ color: '#8c8c8c' }}>最后活跃: {record.lastActive}</div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑权限">
            <Button 
              type="text" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditPermission(record)}
              disabled={record.role === 'owner'}
            />
          </Tooltip>
          
          <Popconfirm
            title="确定要移除这个成员吗？"
            onConfirm={() => handleRemoveMember(record.id)}
            disabled={record.role === 'owner'}
          >
            <Tooltip title={record.role === 'owner' ? '不能移除项目负责人' : '移除成员'}>
              <Button 
                type="text" 
                size="small"
                danger
                icon={<DeleteOutlined />}
                disabled={record.role === 'owner'}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];
  
  // 过滤成员
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchText.toLowerCase()) ||
    member.email.toLowerCase().includes(searchText.toLowerCase()) ||
    member.department.toLowerCase().includes(searchText.toLowerCase())
  );
  
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TeamOutlined />
          <span>成员与权限管理</span>
          <Tag color="blue">{projectTitle}</Tag>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          关闭
        </Button>
      ]}
      style={{ top: 20 }}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'members',
            label: `成员管理 (${members.length})`,
            children: (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Search
                        placeholder="搜索成员..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                      />
                    </Col>
                    
                    <Col>
                      <Button 
                        type="primary" 
                        icon={<UserAddOutlined />}
                        onClick={() => setIsAddUserModalVisible(true)}
                      >
                        添加成员
                      </Button>
                    </Col>
                  </Row>
                </div>
                
                <Table
                  columns={memberColumns}
                  dataSource={filteredMembers}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 名成员`
                  }}
                  scroll={{ x: 1000 }}
                />
              </>
            )
          },
          {
            key: 'permissions',
            label: '权限说明',
            children: (
              <Row gutter={[16, 16]}>
                {Object.entries(permissionLevels).map(([key, permission]) => (
                  <Col span={12} key={key}>
                    <Card size="small">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Tag color={permission.color} icon={permission.icon}>
                          {permission.label}
                        </Tag>
                      </div>
                      <Text type="secondary">{permission.description}</Text>
                      
                      <Divider style={{ margin: '12px 0' }} />
                      
                      <div style={{ fontSize: '12px' }}>
                        <Title level={5} style={{ fontSize: '13px', margin: '0 0 8px 0' }}>具体权限：</Title>
                        {key === 'owner' && (
                          <ul style={{ margin: 0, paddingLeft: '16px' }}>
                            <li>删除和归档项目</li>
                            <li>管理所有成员和权限</li>
                            <li>编辑所有文档内容</li>
                            <li>查看所有统计数据</li>
                          </ul>
                        )}
                        {key === 'admin' && (
                          <ul style={{ margin: 0, paddingLeft: '16px' }}>
                            <li>添加和移除成员</li>
                            <li>修改成员权限</li>
                            <li>编辑所有文档内容</li>
                            <li>管理项目设置</li>
                          </ul>
                        )}
                        {key === 'editor' && (
                          <ul style={{ margin: 0, paddingLeft: '16px' }}>
                            <li>编辑文档内容</li>
                            <li>添加和回复评论</li>
                            <li>查看项目历史</li>
                            <li>导出文档</li>
                          </ul>
                        )}
                        {key === 'viewer' && (
                          <ul style={{ margin: 0, paddingLeft: '16px' }}>
                            <li>查看文档内容</li>
                            <li>添加评论</li>
                            <li>下载文档</li>
                            <li>查看基本统计</li>
                          </ul>
                        )}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )
          },
          {
            key: 'activity',
            label: '活动日志',
            children: (
              <List
                dataSource={[
                  {
                    id: 1,
                    user: '张老师',
                    action: '创建了项目',
                    time: '2024-01-10 09:00',
                    type: 'create'
                  },
                  {
                    id: 2,
                    user: '张老师',
                    action: '邀请李老师加入项目',
                    time: '2024-01-12 10:30',
                    type: 'invite'
                  },
                  {
                    id: 3,
                    user: '李老师',
                    action: '接受邀请并加入项目',
                    time: '2024-01-12 11:00',
                    type: 'join'
                  },
                  {
                    id: 4,
                    user: '张老师',
                    action: '将李老师权限提升为管理员',
                    time: '2024-01-13 14:20',
                    type: 'permission'
                  },
                  {
                    id: 5,
                    user: '李老师',
                    action: '邀请王老师加入项目',
                    time: '2024-01-13 15:10',
                    type: 'invite'
                  }
                ]}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          style={{ 
                            backgroundColor: 
                              item.type === 'create' ? '#52c41a' :
                              item.type === 'invite' ? '#1890ff' :
                              item.type === 'join' ? '#722ed1' :
                              item.type === 'permission' ? '#faad14' : '#8c8c8c'
                          }}
                        >
                          {item.type === 'create' ? <CheckCircleOutlined /> :
                           item.type === 'invite' ? <MailOutlined /> :
                           item.type === 'join' ? <UserAddOutlined /> :
                           item.type === 'permission' ? <SettingOutlined /> : <UserOutlined />}
                        </Avatar>
                      }
                      title={`${item.user} ${item.action}`}
                      description={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CalendarOutlined style={{ fontSize: '12px' }} />
                          <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{item.time}</span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )
          }
        ]}
      />
      
      {/* 添加成员模态框 */}
      <Modal
        title="添加项目成员"
        open={isAddUserModalVisible}
        onCancel={() => {
          setIsAddUserModalVisible(false);
          setSelectedUsers([]);
        }}
        onOk={handleAddMembers}
        width={600}
      >
        <Transfer
          dataSource={availableUsers}
          targetKeys={selectedUsers}
          onChange={setSelectedUsers}
          render={item => `${item.title}`}
          titles={['可添加用户', '已选择用户']}
          listStyle={{
            width: 250,
            height: 300,
          }}
        />
      </Modal>
      
      {/* 编辑权限模态框 */}
      <Modal
        title={`编辑权限 - ${editingMember?.name}`}
        open={isEditPermissionVisible}
        onCancel={() => {
          setIsEditPermissionVisible(false);
          setEditingMember(null);
          form.resetFields();
        }}
        onOk={handleSavePermission}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="role"
            label="权限级别"
            rules={[{ required: true, message: '请选择权限级别' }]}
          >
            <Select placeholder="选择权限级别">
              {Object.entries(permissionLevels)
                .filter(([key]) => key !== 'owner') // 不能设置为负责人
                .map(([key, permission]) => (
                  <Option key={key} value={key}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag color={permission.color} icon={permission.icon}>
                        {permission.label}
                      </Tag>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {permission.description}
                      </Text>
                    </div>
                  </Option>
                ))
              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
};

export default UserPermissionManager;