import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Timeline, 
  List, 
  Tag, 
  message,
  Tabs,
  Space
} from 'antd';
import { 
  ReloadOutlined, 
  DownloadOutlined, 
  BookOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS, VIEW_MODES } from '../../constants/noteEditConstants';
import { generateComprehensiveTrainingPlan, generateTrainingPlanMarkdown } from '../../utils/trainingPlanGenerator';
import SimpleTrainingPlanDetailView from '../SimpleTrainingPlanDetailView';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const TrainingPlanViewer = ({
  rightPanelTrainingPlanRecord,
  rightPanelTrainingPlanContent,
  setRightPanelView,
  setRightPanelTrainingPlanRecord,
  setRightPanelTrainingPlanContent,
  isFullscreen = false,
  setCurrentView
}) => {
  // 状态管理
  const [generatedPlans, setGeneratedPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  // 初始化时检查是否有现有的培训方案内容，如果有则创建对应的页签
  React.useEffect(() => {
    if (rightPanelTrainingPlanContent && rightPanelTrainingPlanRecord) {
      // 检查是否已经有对应的页签
      const existingPlan = generatedPlans.find(plan => 
        plan.id === rightPanelTrainingPlanRecord.id || 
        plan.timestamp === rightPanelTrainingPlanRecord.timestamp
      );
      
      if (!existingPlan && rightPanelTrainingPlanContent.metadata) {
        // 如果有完整的培训方案内容，创建对应的页签
        const planWithId = {
          ...rightPanelTrainingPlanContent,
          id: rightPanelTrainingPlanRecord.id || Date.now(),
          timestamp: rightPanelTrainingPlanRecord.timestamp || new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        
        setGeneratedPlans([planWithId]);
        setActiveTab(`plan-${planWithId.id}`);
      }
    }
  }, [rightPanelTrainingPlanContent, rightPanelTrainingPlanRecord]);

  // 获取培训方案数据
  const trainingPlanData = {
    overview: {
      duration: '8周',
      totalHours: 120,
      participantCount: 25
    },
    schedule: [
      { week: 1, title: '基础理论学习' },
      { week: 2, title: '实践操作训练' },
      { week: 3, title: '案例分析讨论' },
      { week: 4, title: '项目实战演练' }
    ],
    participants: [
      { name: '张三', status: '优秀' },
      { name: '李四', status: '良好' },
      { name: '王五', status: '需关注' },
      { name: '赵六', status: '良好' },
      { name: '钱七', status: '优秀' }
    ]
  };

  // 返回上一级
  const handleBack = () => {
    if (isFullscreen && setCurrentView) {
      setCurrentView(VIEW_MODES.NORMAL);
    } else {
      setRightPanelView(RIGHT_PANEL_VIEWS.TRAINING_PLAN_LIST);
    }
  };

  // 重新生成培训方案
  const handleRegenerateTrainingPlan = async () => {
    setIsGenerating(true);
    try {
      // 构造培训数据参数
      const trainingData = {
        title: rightPanelTrainingPlanRecord?.title || '专业发展培训方案',
        category: rightPanelTrainingPlanRecord?.category || 'teaching_methods',
        targetAudience: rightPanelTrainingPlanRecord?.targetAudience || '全体教师',
        duration: rightPanelTrainingPlanRecord?.duration || '6周',
        description: rightPanelTrainingPlanRecord?.description || '提升教师专业能力的综合培训方案'
      };
      
      // 生成新的培训方案
      const newPlan = generateComprehensiveTrainingPlan(trainingData);
      
      // 为新方案添加唯一ID和时间戳
      const planWithId = {
        ...newPlan,
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      
      // 添加到方案列表
      setGeneratedPlans(prev => [...prev, planWithId]);
      
      // 切换到新生成的方案页签
      setActiveTab(`plan-${planWithId.id}`);
      
      message.success('培训方案重新生成成功！');
    } catch (error) {
      console.error('生成培训方案失败:', error);
      message.error('生成培训方案失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 下载培训方案
  const handleDownloadTrainingPlan = async () => {
    try {
      const markdown = generateTrainingPlanMarkdown(rightPanelTrainingPlanContent);
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `培训方案_${new Date().toLocaleDateString()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('培训方案下载成功');
    } catch (error) {
      message.error('下载失败，请重试');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 头部操作栏 */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        background: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              type="text"
            >
              返回
            </Button>
            <Title level={4} style={{ margin: 0 }}>培训方案查看器</Title>
          </div>
          
          <Space>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              loading={isGenerating}
              onClick={handleRegenerateTrainingPlan}
            >
              重新生成方案
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              onClick={handleDownloadTrainingPlan}
            >
              下载方案
            </Button>
          </Space>
        </div>
      </div>

      {/* 主要内容区域 - 使用多页签布局 */}
      <div style={{ 
        flex: 1, 
        padding: '0 16px 16px 16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="editable-card"
          hideAdd
          onEdit={(targetKey, action) => {
            if (action === 'remove') {
              const newPlans = generatedPlans.filter(plan => `plan-${plan.id}` !== targetKey);
              setGeneratedPlans(newPlans);
              if (activeTab === targetKey) {
                setActiveTab('overview');
              }
            }
          }}
          style={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
          tabBarStyle={{ 
            marginBottom: '16px',
            flexShrink: 0
          }}
          tabPaneStyle={{
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* 概览页签 */}
          <TabPane tab="培训概览" key="overview" closable={false}>
            <div style={{ 
              height: '100%',
              background: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ 
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                background: '#fafafa',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <BookOutlined style={{ color: '#1890ff' }} />
                <Text strong>培训方案概览</Text>
              </div>
              <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card size="small" title="基本信息">
                      <Statistic title="培训周期" value={trainingPlanData.overview.duration} />
                      <Statistic title="总学时" value={trainingPlanData.overview.totalHours} suffix="小时" />
                      <Statistic title="参训人数" value={trainingPlanData.overview.participantCount} suffix="人" />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" title="进度安排">
                      <Timeline size="small">
                        {trainingPlanData.schedule.map((item, index) => (
                          <Timeline.Item key={index}>
                            <Text strong>第{item.week}周</Text>
                            <br />
                            <Text type="secondary">{item.title}</Text>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" title="参训人员">
                      <List
                        size="small"
                        dataSource={trainingPlanData.participants.slice(0, 3)}
                        renderItem={(participant) => (
                          <List.Item>
                            <div style={{ width: '100%' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text>{participant.name}</Text>
                                <Tag 
                                  color={participant.status === '优秀' ? 'green' : participant.status === '需关注' ? 'red' : 'blue'}
                                >
                                  {participant.status}
                                </Tag>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                      {trainingPlanData.participants.length > 3 && (
                        <div style={{ textAlign: 'center', marginTop: '8px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            还有 {trainingPlanData.participants.length - 3} 名参训人员...
                          </Text>
                        </div>
                      )}
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </TabPane>

          {/* 动态生成的方案页签 */}
          {generatedPlans.map((plan) => (
            <TabPane 
              tab="培训方案" 
              key={`plan-${plan.id}`}
              closable={true}
            >
              <div style={{ 
                height: '100%',
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  background: '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0
                }}>
                  <BookOutlined style={{ color: '#1890ff' }} />
                  <Text strong>培训方案详情</Text>
                </div>
                <div style={{ 
                  flex: 1, 
                  overflow: 'auto',
                  minHeight: 0
                }}>
                  <SimpleTrainingPlanDetailView plan={plan} />
                </div>
              </div>
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default TrainingPlanViewer;