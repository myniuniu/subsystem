import React, { useMemo, useState } from 'react';
import { Button, Typography, Tabs, Card, Row, Col, Statistic, List, Tag, Empty, message, Tooltip } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, FileTextOutlined, BookOutlined, ClockCircleOutlined, RobotOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../../constants/noteEditConstants';
import LearningPlanCalendar from '../LearningPlanCalendar';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const LearningPlanViewer = ({
  rightPanelLearningPlanRecord,
  setRightPanelView,
  setRightPanelLearningPlanRecord,
  setRightPlanelLearningPlanContent,
  isFullscreen,
  setCurrentView
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
    if (isFullscreen && setCurrentView) {
      setCurrentView('materials');
      return;
    }
    setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
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
      // 必须存在唯一的计划ID，避免产生重复条目
      if (!planRecord.id) {
        message.error('学习计划缺少唯一ID，无法同步到日历');
        return;
      }
      // 获取现有的日历分类
      const existingCategories = JSON.parse(localStorage.getItem('calendar-categories') || '[]');
      
      // 创建新的日历分类
      const newCategory = {
        key: `learning-plan-${planRecord.id}`,
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
      // 追加并按planId去重
      const updatedCategories = [...existingCategories, newCategory].filter((cat, index, arr) => {
        if (cat.type !== 'learning-plan') return true;
        const id = cat.planId ?? cat.key;
        return arr.findIndex(c => (c.planId ?? c.key) === id && c.type === 'learning-plan') === index;
      });
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

  const handleAIGenerate = () => {
    try {
      window.dispatchEvent(new CustomEvent('triggerAIGenerateForLearningPlan', {
        detail: {
          planTitle: planRecord?.title || '学习计划',
          actions: ['配课', '预定直播会议', '试题生成']
        }
      }));
    } catch {}
    message.success('已触发AI配课、预定直播会议与试题生成');
  };

  

  const SLOT_MAP = {
    早晨: { start: '07:30', end: '09:00' },
    下午: { start: '14:00', end: '15:30' },
    晚上: { start: '19:30', end: '21:00' }
  };

  const schedule = useMemo(() => {
    const cfg = (() => {
      try { return JSON.parse(localStorage.getItem('learning_plan_config') || '{}'); } catch { return {}; }
    })();
    const preferred = Array.isArray(cfg.preferredTimeSlots) ? cfg.preferredTimeSlots : [];
    const minutes = Number(cfg.dailyStudyMinutes) > 0 ? Number(cfg.dailyStudyMinutes) : 60;
    const useWeekend = !!cfg.weekendStudy;
    const days = ['周一','周二','周三','周四','周五'].concat(useWeekend ? ['周六','周日'] : []);
    const toRange = (slot) => {
      const base = SLOT_MAP[slot] || SLOT_MAP['晚上'];
      return `${base.start}-${base.end}`;
    };
    const pickSlot = () => preferred[0] || '晚上';
    const onDemand = days.map((d) => ({ day: d, time: toRange(pickSlot()), minutes }));
    const live = [
      { title: '直播讲座', day: '周二', time: '19:30-21:00' },
      { title: '直播答疑', day: '周四', time: '19:30-21:00' }
    ];
    return { onDemand, live };
  }, []);

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
      <div style={{ padding: '12px', height: '100%', overflow: 'auto' }}>
        {planData.overview && (
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileTextOutlined style={{ color: '#1890ff' }} />
                <span>{planData.overview.title || '培训方案概要'}</span>
              </div>
            }
            bordered={false}
            headStyle={{ background: 'transparent' }}
            bodyStyle={{ background: 'transparent' }}
            style={{ marginBottom: '12px', background: 'transparent' }}
          >
            <Row gutter={8} style={{ marginBottom: 8 }}>
              <Col span={8}>
                <div>
                  <Text strong>培训对象：</Text>
                  <Text>{planData.overview.audience}</Text>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <Text strong>培训周期：</Text>
                  <Text>{planData.overview.cycle}</Text>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <Text strong>时间选择：</Text>
                  <Text>{(planData.overview.timeSlots || []).join('、')}</Text>
                </div>
              </Col>
            </Row>
            <div style={{ marginBottom: 8 }}>
              <Text strong>培训目标：</Text>
              <Text>{planData.overview.goal}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>培训形式：</Text>
              <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 8 }}>
                {(planData.overview.formats || []).map((f, i) => (
                  <Tag key={i} color="blue" style={{ margin: 0 }}>{f}</Tag>
                ))}
              </div>
            </div>
            <div>
              <Text strong>考核方式：</Text>
              <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 8 }}>
                {(planData.overview.assessment || []).map((f, i) => (
                  <Tag key={i} color="green" style={{ margin: 0 }}>{f}</Tag>
                ))}
              </div>
            </div>
          </Card>
        )}
        <Row gutter={12} style={{ marginBottom: 12 }}>
          <Col xs={24} md={12}>
            <Card 
              size="small"
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOutlined style={{ color: '#1890ff' }} />
                  <span>学习计划概要</span>
                </div>
              }
              bordered={false}
              headStyle={{ background: 'transparent' }}
              bodyStyle={{ background: 'transparent', paddingTop: 8, paddingBottom: 8 }}
              style={{ background: 'transparent' }}
            >
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="总学习阶段"
                    value={plan.phases?.length || 0}
                    suffix="个"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="计划周期"
                    value={analysis.duration || 0}
                    suffix="周"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="每周学时"
                    value={analysis.weeklyHours || 0}
                    suffix="小时"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="总学习任务"
                    value={plan.phases?.reduce((total, phase) => total + (phase.tasks?.length || 0), 0) || 0}
                    suffix="个"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card 
              size="small"
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ClockCircleOutlined style={{ color: '#52c41a' }} />
                  <span>学习习惯</span>
                </div>
              }
              bordered={false}
              headStyle={{ background: '透明' }}
              bodyStyle={{ background: 'transparent', paddingTop: 8, paddingBottom: 8 }}
              style={{ background: 'transparent' }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(habits || []).map((habit, index) => (
                  <Tag key={index} color="blue" style={{ margin: 0 }}>
                    {habit}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 学习阶段详情 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 8 }}>
            <FileTextOutlined style={{ color: '#faad14' }} />
            <span>学习阶段详情</span>
          </div>
          <div style={{ paddingTop: 6 }}>
          <Row gutter={[12, 12]}>
            {(plan.phases || []).map((phase, index) => (
               <Col key={`${phase.name}-${index}`} xs={24} sm={12} md={12} lg={8} xl={8}>
                <Card
                  size="small"
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag color={getPhaseColor(index)}>{`阶段 ${index + 1}`}</Tag>
                      <span>{phase.name}</span>
                    </div>
                  }
                  bordered={false}
                  headStyle={{ background: 'transparent' }}
                  bodyStyle={{ background: 'transparent', paddingTop: 8, paddingBottom: 8 }}
                  style={{ background: 'transparent' }}
                >
                  <div style={{ marginBottom: '6px' }}>
                    <Text strong>学习内容：</Text>
                    <Text style={{ wordBreak: 'break-word' }}>{phase.content}</Text>
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    <Text strong>预计时长：</Text>
                    <Text>{phase.duration}</Text>
                  </div>
                  {phase.tasks && phase.tasks.length > 0 && (
                    <div style={{ marginBottom: '6px' }}>
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
                  {phase.formats && phase.formats.length > 0 && (
                    <div style={{ marginBottom: '6px' }}>
                      <Text strong>培训形式：</Text>
                      <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6 }}>
                        {phase.formats.map((fmt, i) => (
                          <Tag key={i} color="blue" style={{ margin: 0 }}>{fmt}</Tag>
                        ))}
                      </div>
                    </div>
                  )}
                  {phase.assessment && phase.assessment.length > 0 && (
                    <div style={{ marginBottom: '6px' }}>
                      <Text strong>考核方式：</Text>
                      <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6 }}>
                        {phase.assessment.map((a, i) => (
                          <Tag key={i} color="green" style={{ margin: 0 }}>{a}</Tag>
                        ))}
                      </div>
                    </div>
                  )}
                  {phase.deliverables && phase.deliverables.length > 0 && (
                    <div>
                      <Text strong>阶段产出：</Text>
                      <List
                        size="small"
                        dataSource={phase.deliverables}
                        renderItem={(d, i) => (
                          <List.Item key={i}>
                            <span style={{ color: '#595959', wordBreak: 'break-word' }}>{d}</span>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
          </div>
        </div>

        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClockCircleOutlined style={{ color: '#1890ff' }} />
              <span>组织学习排期</span>
            </div>
          }
          bordered={false}
          headStyle={{ background: 'transparent' }}
          bodyStyle={{ background: 'transparent' }}
          style={{ marginTop: 12, background: 'transparent' }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Title level={5} style={{ marginBottom: 6 }}>点播课学习时间段</Title>
              <List
                size="small"
                dataSource={schedule.onDemand}
                renderItem={(itm) => (
                  <List.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{itm.day}</span>
                      <span>{itm.time}</span>
                    </div>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={12}>
              <Title level={5} style={{ marginBottom: 6 }}>直播课时间段</Title>
              <List
                size="small"
                dataSource={schedule.live}
                renderItem={(itm) => (
                  <List.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{`${itm.title}`}</span>
                      <span>{`${itm.day} ${itm.time}`}</span>
                    </div>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
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
          {(() => {
            const syncedPlans = JSON.parse(localStorage.getItem('synced-learning-plans') || '[]');
            const isSynced = planRecord && syncedPlans.includes(planRecord.id);
            return (
              <>
                <Button
                  type="default"
                  icon={<CalendarOutlined />}
                  onClick={handleSyncToCalendar}
                  disabled={isSynced}
                >
                  {isSynced ? '已同步到日历' : '同步到我的日历'}
                </Button>
                <Tooltip title="一键AI配课、预定直播会议以及试题生成">
                  <Button
                    type="default"
                    icon={<RobotOutlined />}
                    onClick={handleAIGenerate}
                  >
                    AI生成
                  </Button>
                </Tooltip>
              </>
            );
          })()}

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
          padding: '12px'
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
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          style={{ height: '100%' }}
          tabBarStyle={{ marginBottom: '12px' }}
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
