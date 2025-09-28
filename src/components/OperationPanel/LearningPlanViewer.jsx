import React, { useState } from 'react';
import { Button, Typography, Tabs, Card, Row, Col, Statistic, List, Tag, Empty, Dropdown, message } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, FileTextOutlined, BookOutlined, ClockCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../../constants/noteEditConstants';
import LearningPlanCalendar from '../LearningPlanCalendar';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const LearningPlanViewer = ({
  rightPanelLearningPlanRecord,
  rightPanelLearningPlanContent,
  setRightPanelView,
  setRightPanelLearningPlanRecord,
  setRightPlanelLearningPlanContent
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // 获取学习计划数据
  const planRecord = rightPanelLearningPlanRecord;
  const planData = planRecord?.planData || planRecord?.metadata;
  const analysis = planData?.analysis;
  const plan = planData?.plan;
  const habits = planData?.habits || [];

  // 返回操作面板
  const handleBack = () => {
    setRightPanelView(RIGHT_PANEL_VIEWS.OPERATION_PANEL);
    setRightPanelLearningPlanRecord(null);
    if (setRightPlanelLearningPlanContent) {
      setRightPlanelLearningPlanContent(null);
    }
  };

  // 同步到我的日历
  const handleSyncToCalendar = () => {
    if (!planRecord) {
      message.error('没有可同步的学习计划');
      return;
    }

    try {
      // 获取现有的日历分类
      const existingCategories = JSON.parse(localStorage.getItem('calendar-categories') || '[]');
      
      // 创建新的日历分类
      const newCategory = {
        key: `learning-plan-${planRecord.id || Date.now()}`,
        label: planRecord.title || '学习计划',
        color: '#52c41a',
        checked: true,
        type: 'learning-plan',
        planId: planRecord.id,
        createdAt: new Date().toISOString()
      };

      // 检查是否已经存在相同的分类
      const existingCategory = existingCategories.find(cat => 
        cat.type === 'learning-plan' && cat.planId === planRecord.id
      );

      if (existingCategory) {
        message.warning('该学习计划已经同步到日历中');
        return;
      }

      // 添加新分类到日历中心
      const updatedCategories = [...existingCategories, newCategory];
      localStorage.setItem('calendar-categories', JSON.stringify(updatedCategories));

      // 标记该记录已同步
      const syncedPlans = JSON.parse(localStorage.getItem('synced-learning-plans') || '[]');
      if (!syncedPlans.includes(planRecord.id)) {
        syncedPlans.push(planRecord.id);
        localStorage.setItem('synced-learning-plans', JSON.stringify(syncedPlans));
        
        // 触发自定义同步状态变化事件
        window.dispatchEvent(new CustomEvent('syncedPlansChanged', {
          detail: { syncedPlans }
        }));
      }

      // 触发日历中心更新事件
      window.dispatchEvent(new CustomEvent('calendarCategoriesChanged', {
        detail: { categories: updatedCategories }
      }));

      message.success(`学习计划"${planRecord.title}"已成功同步到我的日历`);
    } catch (error) {
      console.error('同步到日历失败:', error);
      message.error('同步到日历失败，请重试');
    }
  };

  // 获取更多操作菜单项
  const getMoreMenuItems = () => {
    const syncedPlans = JSON.parse(localStorage.getItem('synced-learning-plans') || '[]');
    const isSynced = planRecord && syncedPlans.includes(planRecord.id);

    return [
      {
        key: 'syncToCalendar',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📅</span>
            <span>{isSynced ? '已同步到日历' : '同步到我的日历'}</span>
          </div>
        ),
        onClick: handleSyncToCalendar,
        disabled: isSynced
      }
    ];
  };

  // 渲染计划概要
  const renderPlanOverview = () => {
    if (!planData || !analysis || !plan) {
      return (
        <div style={{ 
          height: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Empty
            image="📋"
            imageStyle={{ fontSize: '48px' }}
            description={
              <div>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>暂无学习计划数据</div>
                <div style={{ fontSize: '14px', color: '#8c8c8c' }}>请重新生成学习计划</div>
              </div>
            }
          />
        </div>
      );
    }

    return (
      <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
        {/* 学习计划统计 */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOutlined style={{ color: '#1890ff' }} />
              <span>学习计划概要</span>
            </div>
          }
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="总学习阶段"
                value={plan.phases?.length || 0}
                suffix="个"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="计划周期"
                value={analysis.duration || 0}
                suffix="周"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="每周学时"
                value={analysis.weeklyHours || 0}
                suffix="小时"
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="总学习任务"
                value={plan.phases?.reduce((total, phase) => total + (phase.tasks?.length || 0), 0) || 0}
                suffix="个"
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
          </Row>
        </Card>

        {/* 学习习惯 */}
        {habits && habits.length > 0 && (
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClockCircleOutlined style={{ color: '#52c41a' }} />
                <span>学习习惯</span>
              </div>
            }
            style={{ marginBottom: '16px' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {habits.map((habit, index) => (
                <Tag key={index} color="blue" style={{ margin: 0 }}>
                  {habit}
                </Tag>
              ))}
            </div>
          </Card>
        )}

        {/* 学习阶段详情 */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileTextOutlined style={{ color: '#faad14' }} />
              <span>学习阶段详情</span>
            </div>
          }
        >
          <List
            dataSource={plan.phases || []}
            renderItem={(phase, index) => (
              <List.Item>
                <Card 
                  size="small" 
                  style={{ width: '100%' }}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag color={getPhaseColor(index)}>{`阶段 ${index + 1}`}</Tag>
                      <span>{phase.name}</span>
                    </div>
                  }
                >
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>学习内容：</Text>
                    <Text>{phase.content}</Text>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>预计时长：</Text>
                    <Text>{phase.duration}</Text>
                  </div>
                  {phase.tasks && phase.tasks.length > 0 && (
                    <div>
                      <Text strong>学习任务：</Text>
                      <div style={{ marginTop: '4px' }}>
                        {phase.tasks.map((task, taskIndex) => (
                          <Tag key={taskIndex} style={{ margin: '2px' }}>
                            {task}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  };

  // 渲染日历视图
  const renderCalendarView = () => {
    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <LearningPlanCalendar
          planData={planData}
          analysis={analysis}
          plan={plan}
          habits={habits}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    );
  };

  // 获取阶段颜色
  const getPhaseColor = (index) => {
    const colors = ['blue', 'green', 'orange', 'purple', 'red', 'cyan', 'magenta', 'lime'];
    return colors[index % colors.length];
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 查看器头部 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🎯</span>
          <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
            学习计划查看器
          </Text>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 更多选项菜单 */}
          <Dropdown
            menu={{ items: getMoreMenuItems() }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              更多选项
            </Button>
          </Dropdown>

          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            返回操作面板
          </Button>
        </div>
      </div>

      {/* 学习计划信息 */}
      {planRecord && (
        <div style={{ 
          marginBottom: '16px',
          padding: '12px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Text strong>{planRecord.title}</Text>
            <Tag color="blue">{planRecord.type}</Tag>
            {/* 同步状态标识 */}
            {(() => {
              const syncedPlans = JSON.parse(localStorage.getItem('synced-learning-plans') || '[]');
              const isSynced = syncedPlans.includes(planRecord.id);
              return isSynced ? (
                <Tag color="green" icon="📅">已同步到日历</Tag>
              ) : null;
            })()}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {planRecord.source} • {planRecord.time}
          </Text>
        </div>
      )}

      {/* 页签内容 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          style={{ height: '100%' }}
          tabBarStyle={{ marginBottom: '16px' }}
        >
          <TabPane 
            tab={
              <span>
                <FileTextOutlined />
                计划概要
              </span>
            } 
            key="overview"
          >
            {renderPlanOverview()}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <CalendarOutlined />
                日历
              </span>
            } 
            key="calendar"
          >
            {renderCalendarView()}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default LearningPlanViewer;