import React, { useState, useEffect } from 'react';
import { Calendar, Card, Badge, Button, Row, Col, Statistic, List, Tag, Tooltip, Modal, Empty } from 'antd';
import { LeftOutlined, RightOutlined, CalendarOutlined, BookOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 设置dayjs为中文
dayjs.locale('zh-cn');

const LearningPlanCalendar = ({ planData, analysis, plan, habits, selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDateForModal, setSelectedDateForModal] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [learningEvents, setLearningEvents] = useState([]);

  // 根据学习计划生成日历事件
  useEffect(() => {
    if (plan && plan.phases) {
      const events = generateLearningEvents(plan, habits);
      setLearningEvents(events);
    } else {
      setLearningEvents([]);
    }
  }, [plan, habits]);

  // 生成学习事件
  const generateLearningEvents = (plan, habits) => {
    const events = [];
    const startDate = dayjs();
    
    // 根据学习习惯确定学习时间
    const getStudyTimes = (habits) => {
      const times = [];
      habits.forEach(habit => {
        switch(habit) {
          case 'morning':
            times.push({ time: '08:00-10:00', label: '早晨学习' });
            break;
          case 'evening':
            times.push({ time: '19:00-21:00', label: '晚间学习' });
            break;
          case 'weekend':
            times.push({ time: '09:00-12:00', label: '周末学习' });
            break;
          case 'fragmented':
            times.push({ time: '12:00-12:30', label: '午休学习' });
            times.push({ time: '18:00-18:30', label: '碎片学习' });
            break;
          default:
            times.push({ time: '14:00-16:00', label: '学习时间' });
        }
      });
      return times.length > 0 ? times : [{ time: '14:00-16:00', label: '学习时间' }];
    };

    const studyTimes = getStudyTimes(habits);
    let eventId = 1;

    // 为每个学习阶段生成事件
    plan.phases.forEach((phase, phaseIndex) => {
      const phaseStartDate = startDate.add(phaseIndex * 7, 'day');
      
      phase.tasks.forEach((task, taskIndex) => {
        const taskDate = phaseStartDate.add(taskIndex, 'day');
        const studyTime = studyTimes[taskIndex % studyTimes.length];
        
        events.push({
          id: eventId++,
          date: taskDate.format('YYYY-MM-DD'),
          title: task,
          phase: phase.phase,
          milestone: phase.milestone,
          time: studyTime.time,
          timeLabel: studyTime.label,
          type: 'study',
          color: getPhaseColor(phaseIndex)
        });
      });
      
      // 添加里程碑事件
      const milestoneDate = phaseStartDate.add(phase.tasks.length, 'day');
      events.push({
        id: eventId++,
        date: milestoneDate.format('YYYY-MM-DD'),
        title: phase.milestone,
        phase: phase.phase,
        time: '全天',
        timeLabel: '里程碑',
        type: 'milestone',
        color: 'purple'
      });
    });

    return events;
  };

  // 获取阶段颜色
  const getPhaseColor = (index) => {
    const colors = ['blue', 'green', 'orange', 'red', 'purple', 'cyan'];
    return colors[index % colors.length];
  };

  // 获取指定日期的学习事件
  const getDateEvents = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return learningEvents.filter(event => event.date === dateStr);
  };

  // 日历单元格渲染
  const cellRender = (current, info) => {
    if (info.type === 'date') {
      const events = getDateEvents(current);
      
      return (
        <div className="calendar-cell">
          <ul className="events" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {events.slice(0, 2).map((event) => (
              <li key={event.id} style={{ marginBottom: '2px' }}>
                <Tooltip title={`${event.time} - ${event.title}`}>
                  <Badge 
                    color={event.color} 
                    text={
                      <span style={{ 
                        fontSize: '10px', 
                        color: '#666',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '70px'
                      }}>
                        {event.title}
                      </span>
                    }
                  />
                </Tooltip>
              </li>
            ))}
            {events.length > 2 && (
              <li>
                <span style={{ fontSize: '10px', color: '#999' }}>
                  +{events.length - 2}更多
                </span>
              </li>
            )}
          </ul>
        </div>
      );
    }
    return info.originNode;
  };

  // 处理日期选择
  const onSelect = (date) => {
    onDateChange(date);
    const events = getDateEvents(date);
    if (events.length > 0) {
      setSelectedDateForModal(date);
      setShowScheduleModal(true);
    }
  };

  // 处理面板变化
  const onPanelChange = (value, mode) => {
    setCurrentMonth(value);
  };

  // 导航到上月
  const goToPrevMonth = () => {
    setCurrentMonth(prev => prev.subtract(1, 'month'));
  };

  // 导航到下月
  const goToNextMonth = () => {
    setCurrentMonth(prev => prev.add(1, 'month'));
  };

  // 导航到今天
  const goToToday = () => {
    const today = dayjs();
    setCurrentMonth(today);
    onDateChange(today);
  };

  // 检查是否有学习计划数据
  if (!plan || !plan.phases || plan.phases.length === 0) {
    return (
      <div style={{ padding: '16px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty
          image="📅"
          imageStyle={{ fontSize: '48px' }}
          description={
            <div>
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>暂无学习计划</div>
              <div style={{ fontSize: '14px', color: '#8c8c8c' }}>请先生成学习计划，然后查看日历视图</div>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
      {/* 日历头部导航 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button 
            size="small" 
            icon={<LeftOutlined />} 
            onClick={goToPrevMonth}
          />
          <Button 
            size="small" 
            icon={<RightOutlined />} 
            onClick={goToNextMonth}
          />
          <Button 
            size="small" 
            onClick={goToToday}
          >
            今天
          </Button>
        </div>
        
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
          {currentMonth.format('YYYY年MM月')} 学习安排
        </div>
      </div>

      {/* 学习计划统计概览 */}
      <Row gutter={[8, 8]} style={{ marginBottom: '16px' }}>
        <Col span={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic 
              title="总任务" 
              value={learningEvents.filter(e => e.type === 'study').length} 
              suffix="个"
              valueStyle={{ fontSize: '14px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic 
              title="里程碑" 
              value={learningEvents.filter(e => e.type === 'milestone').length} 
              suffix="个"
              valueStyle={{ fontSize: '14px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic 
              title="计划周期" 
              value={plan?.duration || '未设定'}
              valueStyle={{ fontSize: '14px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic 
              title="每周学时" 
              value={plan?.weeklyHours || 0} 
              suffix="小时"
              valueStyle={{ fontSize: '14px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 学习习惯标签 */}
      {habits.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>学习习惯：</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {habits.map(habit => {
              const habitMap = {
                'morning': '早晨学习',
                'evening': '晚间学习',
                'weekend': '周末集中',
                'fragmented': '碎片化学习',
                'intensive': '密集学习',
                'gradual': '循序渐进'
              };
              return (
                <Tag key={habit} size="small" color="blue">
                  {habitMap[habit]}
                </Tag>
              );
            })}
          </div>
        </div>
      )}

      {/* 日历组件 */}
      <Calendar
        value={currentMonth}
        cellRender={cellRender}
        onSelect={onSelect}
        onPanelChange={onPanelChange}
        style={{ 
          background: '#fff',
          borderRadius: '8px',
          padding: '8px'
        }}
      />

      {/* 日程详情弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarOutlined />
            {selectedDateForModal?.format('YYYY年MM月DD日')} 学习安排
          </div>
        }
        open={showScheduleModal}
        onCancel={() => setShowScheduleModal(false)}
        footer={null}
        width={600}
      >
        {selectedDateForModal && (
          <div>
            <List
              dataSource={getDateEvents(selectedDateForModal)}
              renderItem={event => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: event.color === 'blue' ? '#1890ff' : 
                                       event.color === 'green' ? '#52c41a' :
                                       event.color === 'orange' ? '#fa8c16' :
                                       event.color === 'red' ? '#f5222d' :
                                       event.color === 'purple' ? '#722ed1' : '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '14px'
                      }}>
                        {event.type === 'milestone' ? '🎯' : '📚'}
                      </div>
                    }
                    title={
                      <div>
                        <span style={{ fontWeight: 'bold' }}>{event.title}</span>
                        <Tag color={event.color} size="small" style={{ marginLeft: '8px' }}>
                          {event.phase}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <ClockCircleOutlined />
                          <span>{event.time}</span>
                          <span style={{ color: '#999' }}>({event.timeLabel})</span>
                        </div>
                        {event.type === 'milestone' && (
                          <div style={{ color: '#52c41a', fontStyle: 'italic' }}>
                            🎯 阶段目标：{event.milestone}
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LearningPlanCalendar;