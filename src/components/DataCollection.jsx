import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Progress,
  Space,
  Tag,
  Alert,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Typography,
  Divider,
  Upload,
  message,
  Tabs,
  Timeline
} from 'antd';
import {
  DatabaseOutlined,
  CloudUploadOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  FileTextOutlined,
  ApiOutlined,
  MonitorOutlined,
  ClearOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DataCollection = () => {
  const [dataSources, setDataSources] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('sources');
  const [collectionStats, setCollectionStats] = useState({
    totalSources: 8,
    activeSources: 6,
    dataPoints: 156789,
    successRate: 98.5
  });

  // 模拟数据源数据
  useEffect(() => {
    const mockDataSources = [
      {
        id: 1,
        name: '在线学习系统',
        type: 'API',
        status: 'active',
        lastSync: '2024-01-15 14:30:00',
        dataPoints: 45678,
        description: '学生课程学习进度、完成度、在线时长等数据',
        config: {
          endpoint: 'https://api.learning.edu/v1/data',
          frequency: 'realtime'
        }
      },
      {
        id: 2,
        name: '测评系统',
        type: 'Database',
        status: 'active',
        lastSync: '2024-01-15 14:25:00',
        dataPoints: 23456,
        description: '考试、测验、作业成绩及答题详情',
        config: {
          host: 'db.assessment.edu',
          frequency: 'hourly'
        }
      },
      {
        id: 3,
        name: 'AI备课助手',
        type: 'API',
        status: 'active',
        lastSync: '2024-01-15 14:20:00',
        dataPoints: 12345,
        description: '教师使用AI工具的行为数据',
        config: {
          endpoint: 'https://api.aiassist.edu/v2/usage',
          frequency: 'daily'
        }
      },
      {
        id: 4,
        name: '虚拟仿真实验',
        type: 'File',
        status: 'inactive',
        lastSync: '2024-01-14 16:00:00',
        dataPoints: 8901,
        description: '学生实验操作记录和结果数据',
        config: {
          path: '/data/simulation/',
          frequency: 'daily'
        }
      },
      {
        id: 5,
        name: '互动课堂工具',
        type: 'API',
        status: 'active',
        lastSync: '2024-01-15 14:35:00',
        dataPoints: 34567,
        description: '课堂互动、提问回答、参与度数据',
        config: {
          endpoint: 'https://api.classroom.edu/v1/interactions',
          frequency: 'realtime'
        }
      },
      {
        id: 6,
        name: '教师评价记录',
        type: 'Manual',
        status: 'active',
        lastSync: '2024-01-15 12:00:00',
        dataPoints: 5678,
        description: '教师对学生表现的主观评价',
        config: {
          method: 'form_input',
          frequency: 'weekly'
        }
      }
    ];
    setDataSources(mockDataSources);
  }, []);

  // 处理添加/编辑数据源
  const handleSaveSource = (values) => {
    if (editingSource) {
      setDataSources(prev => prev.map(source => 
        source.id === editingSource.id ? { ...source, ...values } : source
      ));
      message.success('数据源更新成功');
    } else {
      const newSource = {
        id: Date.now(),
        ...values,
        status: 'inactive',
        lastSync: '-',
        dataPoints: 0
      };
      setDataSources(prev => [...prev, newSource]);
      message.success('数据源添加成功');
    }
    setModalVisible(false);
    setEditingSource(null);
    form.resetFields();
  };

  // 处理数据源状态切换
  const handleToggleStatus = (sourceId) => {
    setDataSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, status: source.status === 'active' ? 'inactive' : 'active' }
        : source
    ));
  };

  // 处理数据同步
  const handleSync = (sourceId) => {
    message.loading('正在同步数据...', 2);
    setTimeout(() => {
      setDataSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { ...source, lastSync: new Date().toLocaleString() }
          : source
      ));
      message.success('数据同步完成');
    }, 2000);
  };

  // 数据源表格列定义
  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar 
            icon={getSourceIcon(record.type)} 
            style={{ backgroundColor: getSourceColor(record.type) }}
          />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.description}</Text>
          </div>
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={getTypeColor(type)}>{type}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '运行中' : '已停止'}
        </Tag>
      )
    },
    {
      title: '数据量',
      dataIndex: 'dataPoints',
      key: 'dataPoints',
      render: (points) => points.toLocaleString()
    },
    {
      title: '最后同步',
      dataIndex: 'lastSync',
      key: 'lastSync'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<SyncOutlined />} 
            onClick={() => handleSync(record.id)}
            disabled={record.status !== 'active'}
          >
            同步
          </Button>
          <Button 
            type="text" 
            icon={<SettingOutlined />} 
            onClick={() => {
              setEditingSource(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            配置
          </Button>
          <Switch 
            size="small"
            checked={record.status === 'active'}
            onChange={() => handleToggleStatus(record.id)}
          />
        </Space>
      )
    }
  ];

  // 获取数据源图标
  const getSourceIcon = (type) => {
    const icons = {
      'API': <ApiOutlined />,
      'Database': <DatabaseOutlined />,
      'File': <FileTextOutlined />,
      'Manual': <MonitorOutlined />
    };
    return icons[type] || <DatabaseOutlined />;
  };

  // 获取数据源颜色
  const getSourceColor = (type) => {
    const colors = {
      'API': '#1890ff',
      'Database': '#52c41a',
      'File': '#fa8c16',
      'Manual': '#722ed1'
    };
    return colors[type] || '#1890ff';
  };

  // 获取类型颜色
  const getTypeColor = (type) => {
    const colors = {
      'API': 'blue',
      'Database': 'green',
      'File': 'orange',
      'Manual': 'purple'
    };
    return colors[type] || 'blue';
  };

  // 渲染数据处理流程
  const renderDataProcessing = () => (
    <div className="data-processing">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="数据处理流程" className="process-card">
            <Timeline>
              <Timeline.Item 
                dot={<DatabaseOutlined style={{ color: '#1890ff' }} />}
                color="blue"
              >
                <Text strong>数据采集</Text>
                <br />
                <Text type="secondary">从多个数据源自动或手动采集原始数据</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<ClearOutlined style={{ color: '#52c41a' }} />}
                color="green"
              >
                <Text strong>数据清洗</Text>
                <br />
                <Text type="secondary">去除重复、错误和无效数据</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<SyncOutlined style={{ color: '#fa8c16' }} />}
                color="orange"
              >
                <Text strong>数据标准化</Text>
                <br />
                <Text type="secondary">统一数据格式和结构</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<CheckCircleOutlined style={{ color: '#722ed1' }} />}
                color="purple"
              >
                <Text strong>数据整合</Text>
                <br />
                <Text type="secondary">将处理后的数据存储到统一数据仓库</Text>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="数据质量监控" className="quality-card">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text>数据完整性</Text>
                <Progress percent={95} strokeColor="#52c41a" />
              </div>
              <div>
                <Text>数据准确性</Text>
                <Progress percent={98} strokeColor="#1890ff" />
              </div>
              <div>
                <Text>数据一致性</Text>
                <Progress percent={92} strokeColor="#722ed1" />
              </div>
              <div>
                <Text>数据时效性</Text>
                <Progress percent={89} strokeColor="#fa8c16" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="data-collection">
      {/* 统计概览 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="数据源总数"
              value={collectionStats.totalSources}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="活跃数据源"
              value={collectionStats.activeSources}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="数据采集点"
              value={collectionStats.dataPoints}
              prefix={<MonitorOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="成功率"
              value={collectionStats.successRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'sources',
            label: '数据源管理',
            children: (
              <Card 
                title="数据源列表"
                extra={
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditingSource(null);
                      form.resetFields();
                      setModalVisible(true);
                    }}
                  >
                    添加数据源
                  </Button>
                }
              >
                <Table
                  columns={columns}
                  dataSource={dataSources}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true
                  }}
                />
              </Card>
            )
          },
          {
            key: 'processing',
            label: '数据处理',
            children: renderDataProcessing()
          }
        ]}
      />

      {/* 添加/编辑数据源模态框 */}
      <Modal
        title={editingSource ? '编辑数据源' : '添加数据源'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingSource(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveSource}
        >
          <Form.Item
            name="name"
            label="数据源名称"
            rules={[{ required: true, message: '请输入数据源名称' }]}
          >
            <Input placeholder="请输入数据源名称" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="数据源类型"
            rules={[{ required: true, message: '请选择数据源类型' }]}
          >
            <Select placeholder="请选择数据源类型">
              <Option value="API">API接口</Option>
              <Option value="Database">数据库</Option>
              <Option value="File">文件导入</Option>
              <Option value="Manual">手动录入</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <TextArea rows={3} placeholder="请输入数据源描述" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingSource ? '更新' : '添加'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingSource(null);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataCollection;