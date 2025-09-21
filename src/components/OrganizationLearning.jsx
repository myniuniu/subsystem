import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Table,
  Tag,
  Avatar,
  Progress,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Tabs,
  Statistic,
  List,
  Badge,
  Tooltip,
  Popconfirm,
  Steps,
  Timeline,
  Rate,
  Divider,
  Empty,
  Dropdown,
  Menu,
  Drawer,
  Switch,
  Slider,
  Radio,
  Checkbox,
  Alert,
  Spin,
  Result
} from 'antd';
import {
  ArrowLeftOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  UserOutlined,
  BookOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  SettingOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  StarOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  RobotOutlined,
  HistoryOutlined,
  SaveOutlined
} from '@ant-design/icons';
import needsService from '../services/needsService';
import AIAssistant from './AIAssistant';
import CourseWorkspace from './CourseWorkspace';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Step } = Steps;

const OrganizationLearning = ({ onBack }) => {
  const [trainingNeeds, setTrainingNeeds] = useState([]);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    // 获取培训需求数据
    const fetchTrainingNeeds = async () => {
      try {
        const needs = needsService.getAllNeeds();
        setTrainingNeeds(needs);
        // 默认选择第一个培训需求
        if (needs.length > 0) {
          setSelectedNeed(needs[0]);
        }
      } catch (error) {
        message.error('获取培训需求失败');
      }
    };

    fetchTrainingNeeds();
  }, []);

  // 处理培训需求切换
  const handleNeedChange = (needId) => {
    const need = trainingNeeds.find(n => n.id === needId);
    setSelectedNeed(need);
  };

  const tabItems = [
    {
      key: 'needs',
      label: (
        <span>
          <ExperimentOutlined />
          培训需求
        </span>
      ),
      children: (
        <div>
          <List
            dataSource={trainingNeeds}
            renderItem={need => (
              <List.Item
                style={{ 
                  padding: '16px 24px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  backgroundColor: '#fafafa',
                  border: '1px solid #f0f0f0'
                }}
                actions={[
                  <Button 
                    type="primary" 
                    size="small"
                    icon={<RocketOutlined />}
                    onClick={() => setSelectedNeed(need)}
                  >
                    查看详情
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      size={48}
                      style={{ backgroundColor: '#1890ff' }}
                      icon={<ExperimentOutlined />} 
                    />
                  }
                  title={
                    <div style={{ marginBottom: '8px' }}>
                      <Text strong style={{ fontSize: '16px', color: '#262626' }}>
                        {need.title}
                      </Text>
                    </div>
                  }
                  description={
                    <div style={{ lineHeight: '1.6' }}>
                      <Paragraph 
                        type="secondary" 
                        style={{ 
                          marginBottom: '12px',
                          fontSize: '14px',
                          color: '#595959'
                        }}
                        ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
                      >
                        {need.description}
                      </Paragraph>
                      <Space size="middle" wrap>
                        <Tag color="blue" style={{ borderRadius: '12px' }}>
                          {need.priority}
                        </Tag>
                        <Tag color="green" style={{ borderRadius: '12px' }}>
                          {need.category}
                        </Tag>
                        <Space>
                          <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
                          <Text type="secondary" style={{ fontSize: '13px' }}>
                            截止日期: {need.deadline}
                          </Text>
                        </Space>
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        {/* 整合后的单一标题栏 */}
        <div style={{ 
          background: '#fff', 
          padding: '16px 24px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '16px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
                返回
              </Button>
              <Title level={2} style={{ margin: 0 }}>
                组织学习 - 配课工作台
                {selectedNeed && (
                  <Text type="secondary" style={{ fontSize: '16px', fontWeight: 'normal', marginLeft: '8px' }}>
                    - {selectedNeed.title}
                  </Text>
                )}
              </Title>
            </Space>
            
            <Space>
              <Select
                placeholder="选择培训需求"
                style={{ width: 300 }}
                value={selectedNeed?.id}
                onChange={handleNeedChange}
                allowClear
              >
                {trainingNeeds.map(need => (
                  <Option key={need.id} value={need.id}>
                    <Space>
                      <Tag color="blue">{need.priority}</Tag>
                      {need.title}
                    </Space>
                  </Option>
                ))}
              </Select>
              
              {selectedNeed && (
                <>
                  <Radio.Group 
                    defaultValue="collaborative"
                    size="small"
                  >
                    <Radio.Button value="collaborative">协同模式</Radio.Button>
                    <Radio.Button value="ai-only">AI模式</Radio.Button>
                    <Radio.Button value="manual-only">人工模式</Radio.Button>
                  </Radio.Group>
                  
                  <Button icon={<HistoryOutlined />} size="small">
                    历史方案
                  </Button>
                  
                  <Button icon={<SaveOutlined />} size="small">
                    保存草稿
                  </Button>
                </>
              )}
              
              <Button 
                type="primary" 
                icon={<RobotOutlined />}
                onClick={() => setShowAIAssistant(true)}
              >
                AI学习助手
              </Button>
            </Space>
          </div>
        </div>

        {/* 配课工作台主体 */}
        <div style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'calc(100vh - 140px)'
        }}>
          {selectedNeed ? (
            <CourseWorkspace
              trainingNeed={selectedNeed}
              onBack={() => setSelectedNeed(null)}
              onSave={(plan) => {
                message.success(`配课方案"${plan.name}"已保存`);
              }}
              hideHeader={true}
            />
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: '#8c8c8c'
            }}>
              <ExperimentOutlined style={{ fontSize: 64, marginBottom: 16 }} />
              <Title level={3} type="secondary">选择培训需求</Title>
              <Text type="secondary">请从上方下拉菜单选择一个培训需求开始配课</Text>
            </div>
          )}
        </div>

        {/* AI学习助手 */}
        <AIAssistant
          visible={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
          mode="learning"
          userProfile={{
            name: '学习者',
            department: '技术部',
            level: '中级'
          }}
          learningHistory={[]}
        />
      </Content>
    </Layout>
  );
};

export default OrganizationLearning;