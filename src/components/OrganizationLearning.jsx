import React, { useState, useEffect } from 'react';
import {
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
    // 获取培训选课数据
    const fetchTrainingNeeds = async () => {
      try {
        const needs = needsService.getAllNeeds();
        setTrainingNeeds(needs);
        // 默认选择第一个培训选课
        if (needs.length > 0) {
          setSelectedNeed(needs[0]);
        }
      } catch (error) {
        message.error('获取培训选课失败');
      }
    };

    fetchTrainingNeeds();
  }, []);

  // 处理培训选课切换
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
          培训选课
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
    <div style={{ 
      minHeight: '100vh', 
      background: '#f0f2f5',
      padding: '16px'
    }}>
      {/* 配课工作台主体 - 移除标题栏，扩大主体区域 */}
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '6px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        height: 'calc(100vh - 32px)',
        overflow: 'hidden'
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
            <Title level={3} type="secondary">选择培训选课</Title>
            <Text type="secondary">请从上方下拉菜单选择一个培训选课开始配课</Text>
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
    </div>
  );
};

export default OrganizationLearning;