import React, { useState, useEffect } from 'react';
import { Calendar, Card, Badge, Button, Row, Col, List, Tag, Tooltip, Modal, Empty, message, Checkbox, Form, Input, Select, DatePicker, TimePicker } from 'antd';
import { LeftOutlined, RightOutlined, CalendarOutlined, ClockCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import './CalendarCenter.css';

// 设置dayjs为中文
dayjs.locale('zh-cn');

const LearningPlanCalendar = ({ plan, habits, selectedDate, onDateChange, onBackToThreeColumn }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDateForModal, setSelectedDateForModal] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  const [eventList, setEventList] = useState([]);
  const [calendarView, setCalendarView] = useState('day');
  const [currentDate, setCurrentDate] = useState(selectedDate || dayjs());
  const [categories, setCategories] = useState([
    { key: 'study', label: '学习任务', color: '#1890ff', checked: true, disabled: false },
    { key: 'milestone', label: '里程碑', color: '#722ed1', checked: true, disabled: false }
  ]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 根据学习计划生成日历事件
  useEffect(() => {
    if (plan && plan.phases) {
      const events = generateLearningEvents(plan, habits);
      
      try {
        const saved = JSON.parse(localStorage.getItem('learning-plan-events') || '[]');
        const all = [...events, ...(Array.isArray(saved) ? saved : [])];
        const seen = new Set();
        const merged = all.filter(ev => {
          const id = ev.id;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        setEventList(merged);
      } catch {
        setEventList(events);
      }
    } else {
      
      setEventList([]);
    }
  }, [plan, habits]);

  useEffect(() => {
    try {
      localStorage.setItem('learning-plan-events', JSON.stringify(eventList));
    } catch (e) { void 0; }
  }, [eventList]);

  // 生成学习事件
  const generateLearningEvents = (plan, habits) => {
    const events = [];
    const startDate = dayjs();
    
    // 根据学习习惯确定学习时间
    const getStudyTimes = (habits) => {
      const times = [];
      (habits || []).forEach(habit => {
        const h = String(habit || '');
        if (h === 'morning' || h.includes('早晨')) {
          times.push({ time: '07:30-09:00', label: '早晨学习' });
          return;
        }
        if (h === 'afternoon' || h.includes('下午')) {
          times.push({ time: '14:00-15:30', label: '下午学习' });
          return;
        }
        if (h === 'evening' || h.includes('晚上')) {
          times.push({ time: '19:30-21:00', label: '晚间学习' });
          return;
        }
        if (h === 'weekend' || h.includes('周末学习')) {
          times.push({ time: '09:00-11:00', label: '周末学习' });
          return;
        }
        if (h === 'fragmented' || h.includes('碎片')) {
          times.push({ time: '12:00-12:30', label: '午休学习' });
          times.push({ time: '18:00-18:30', label: '碎片学习' });
          return;
        }
        times.push({ time: '14:00-16:00', label: '学习时间' });
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
        const baseTimes = [
          { time: '09:30-10:30', label: '上午学习' },
          { time: '11:00-12:00', label: '上午学习' },
          { time: '19:00-20:00', label: '晚间学习' }
        ];
        const timesForDay = (studyTimes.length > 0 ? studyTimes : baseTimes).slice(0, 3);
        timesForDay.forEach((t, idx) => {
          const timeStr = t.time || baseTimes[idx].time;
          const labelStr = t.label || baseTimes[idx].label;
          events.push({
            id: eventId++,
            date: taskDate.format('YYYY-MM-DD'),
            title: idx === 0 ? task : `${task}（练习${idx}）`,
            phase: phase.phase,
            milestone: phase.milestone,
            time: timeStr,
            timeLabel: labelStr,
            type: 'study',
            color: getPhaseColor((phaseIndex + idx) % 6),
            startTime: timeStr.includes('-') ? timeStr.split('-')[0] : undefined,
            endTime: timeStr.includes('-') ? timeStr.split('-')[1] : undefined
          });
        });
      });
      
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

    const extraDays = 7;
    for (let i = 0; i < extraDays; i++) {
      const d = startDate.add(i, 'day');
      const slots = ['09:30-10:30', '11:00-12:00', '19:00-20:00'];
      const titles = ['训练学习示例1', '训练学习示例3', '教研会议示例2'];
      slots.forEach((s, idx) => {
        events.push({
          id: eventId++,
          date: d.format('YYYY-MM-DD'),
          title: titles[idx],
          phase: `阶段${(i % (plan.phases.length || 1)) + 1}`,
          time: s,
          timeLabel: idx < 2 ? '定时学习' : '教研会议',
          type: 'study',
          color: ['blue', 'orange', 'green'][idx % 3],
          startTime: s.split('-')[0],
          endTime: s.split('-')[1]
        });
      });
    }

    return events;
  };

  // 获取阶段颜色
  const getPhaseColor = (index) => {
    const colors = ['blue', 'green', 'orange', 'red', 'purple', 'cyan'];
    return colors[index % colors.length];
  };

  const moveEvent = (draggedEvent, newDate, newTime) => {
    setEventList(prev => prev.map(ev => {
      if (ev.id !== draggedEvent.id) return ev;
      const next = { ...ev, date: newDate };
      if (newTime) {
        next.startTime = newTime;
        if (ev.endTime) {
          next.time = `${newTime}-${ev.endTime}`;
        }
      }
      return next;
    }));
    message.success('事件已移动');
  };

  const DraggableEvent = ({ event, children, className }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'event',
      item: { id: event.id, event },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    return (
      <div
        ref={drag}
        className={className}
        style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
      >
        {children}
      </div>
    );
  };

  const DroppableCell = ({ date, children, className, timeSlot }) => {
    const [{ isOver }, drop] = useDrop({
      accept: 'event',
      drop: (item) => {
        const newDate = date.format('YYYY-MM-DD');
        moveEvent(item.event, newDate, timeSlot);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });
    return (
      <div
        ref={drop}
        className={className}
        style={{ backgroundColor: isOver ? '#e6f7ff' : 'transparent' }}
      >
        {children}
      </div>
    );
  };

  const getDateEvents = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return eventList.filter(event => event.date === dateStr);
  };

  const renderSimpleDayView = () => {
    const activeKeys = categories.filter(cat => cat.checked).map(cat => cat.key);
    const filteredEvents = getDateEvents(currentDate).filter(ev => activeKeys.includes(ev.type));
    const allDayEvents = filteredEvents.filter(event => !event.startTime);
    const timedEvents = filteredEvents.filter(event => event.startTime);
    return (
      <div className="simple-day-view" style={{ height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', background: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#0369a1', marginBottom: 4 }}>
              {currentDate.format('YYYY年MM月DD日 dddd')}
            </div>
            <div style={{ fontSize: 14, color: '#64748b' }}>
              {filteredEvents.length > 0 ? `共有 ${filteredEvents.length} 个事件` : '今日无事件安排'}
            </div>
          </div>
          <Button type="text" onClick={() => setCalendarView('month')} style={{ color: '#0369a1' }}>返回月视图</Button>
        </div>
        <div style={{ padding: 16, height: 'calc(100% - 80px)', overflow: 'auto' }}>
          {allDayEvents.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>📅</span>
                全天事件
              </div>
              {allDayEvents.map((event) => (
                <div key={event.id} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: '12px 16px', marginBottom: 8, borderLeft: `4px solid ${categories.find(cat => cat.key === event.type)?.color || '#1890ff'}`, transition: 'all 0.2s ease' }}>
                  <div style={{ fontWeight: 500, color: '#1f2937', marginBottom: 4 }}>{event.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{categories.find(cat => cat.key === event.type)?.label}</div>
                </div>
              ))}
            </div>
          )}
          {timedEvents.length > 0 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⏰</span>
                定时事件
              </div>
              {timedEvents.sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00')).map((event, index) => (
                <div key={event.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: index < timedEvents.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <div style={{ minWidth: 80, fontSize: 12, fontWeight: 500, color: '#6b7280', textAlign: 'right', paddingTop: 2 }}>
                    {event.startTime}
                    {event.endTime && <div style={{ fontSize: 11, color: '#9ca3af' }}>- {event.endTime}</div>}
                  </div>
                  <div style={{ flex: 1, background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: '10px 12px', borderLeft: `3px solid ${categories.find(cat => cat.key === event.type)?.color || '#1890ff'}` }}>
                    <div style={{ fontWeight: 500, color: '#1f2937', marginBottom: 4 }}>{event.title}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{categories.find(cat => cat.key === event.type)?.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {filteredEvents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>今日暂无事件安排</div>
              <div style={{ fontSize: 14 }}>享受一个轻松的一天吧！</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDates = getCurrentWeekDates();
    const activeKeys = categories.filter(cat => cat.checked).map(cat => cat.key);
    const getCatColor = (type) => categories.find(cat => cat.key === type)?.color || '#1890ff';
    return (
      <div style={{ height: '100%' }}>
        <Card title={<span>📅 本周安排</span>} size="small" bodyStyle={{ background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
            {/* 顶部星期标题行 */}
            <div style={{ display: 'contents' }}>
              <div style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}></div>
              {weekDates.map((d) => (
                <div key={`head-${d.format('YYYY-MM-DD')}`} style={{ padding: '6px 8px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                  {d.format('MM/DD ddd')}
                </div>
              ))}
            </div>

            {[...Array(24)].map((_, hour) => (
              <div key={`row-${hour}`} style={{ display: 'contents' }}>
                <div style={{ padding: '8px', fontSize: 12, color: '#8c8c8c', borderRight: '1px solid #f0f0f0', background: '#fafafa' }}>
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
                {weekDates.map((d) => {
                  const dayEvents = getDateEvents(d).filter(ev => activeKeys.includes(ev.type));
                  return (
                    <DroppableCell key={`${d.format('YYYY-MM-DD')}-${hour}`} date={d} timeSlot={`${hour.toString().padStart(2, '0')}:00`} className="day-slot">
                      {dayEvents.filter(ev => {
                        if (!ev.startTime) return false;
                        const h = parseInt(String(ev.startTime).split(':')[0], 10);
                        return h === hour;
                      }).map(ev => (
                        <DraggableEvent key={ev.id} event={ev} className="week-event">
                          <div
                            style={{
                              background: '#fff',
                              border: '1px solid #eee',
                              color: '#1f2937',
                              padding: '4px 8px',
                              borderRadius: 6,
                              fontSize: 12,
                              margin: '4px',
                              borderLeft: `3px solid ${getCatColor(ev.type)}`
                            }}
                          >
                            <div style={{ fontWeight: 500 }}>{ev.title}</div>
                            <div style={{ fontSize: 11, color: '#6b7280' }}>
                              {ev.startTime}{ev.endTime ? `-${ev.endTime}` : ''}
                            </div>
                          </div>
                        </DraggableEvent>
                      ))}
                    </DroppableCell>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const handleCategoryChange = (key, checked) => {
    setCategories(prev => prev.map(cat => {
      if (cat.key === key) {
        if (cat.disabled) return cat;
        return { ...cat, checked };
      }
      return cat;
    }));
  };

  const toggleAllCategories = (checked) => {
    setCategories(prev => prev.map(cat => (
      cat.disabled ? cat : { ...cat, checked }
    )));
  };

  const typeColorMap = {
    study: 'blue',
    milestone: 'purple'
  };

  const handleCreateEvent = () => {
    setIsCreateModalVisible(true);
    form.setFieldsValue({
      date: currentDate,
      type: 'study'
    });
  };

  const handleCreateSubmit = (values) => {
    const dateStr = values.date?.format('YYYY-MM-DD');
    const start = values.startTime ? values.startTime.format('HH:mm') : undefined;
    const end = values.endTime ? values.endTime.format('HH:mm') : undefined;
    const timeStr = start && end ? `${start}-${end}` : '全天';
    const newEvent = {
      id: Date.now(),
      date: dateStr,
      title: values.title,
      type: values.type,
      color: typeColorMap[values.type] || 'blue',
      time: timeStr,
      timeLabel: start && end ? '自定义' : '全天',
      startTime: start,
      endTime: end
    };
    setEventList(prev => [...prev, newEvent]);
    setIsCreateModalVisible(false);
    form.resetFields();
    message.success('日程创建成功');
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  // 日历单元格渲染
  const cellRender = (current, info) => {
    if (info.type === 'date') {
      const activeCategories = categories.filter(cat => cat.checked).map(cat => cat.key);
      const events = getDateEvents(current).filter(ev => activeCategories.includes(ev.type));
      return (
        <DroppableCell date={current} className="calendar-cell">
          <div className="events" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {events.slice(0, 3).map((event) => (
              <DraggableEvent key={event.id} event={event} className="event-item">
                <Tooltip title={`${event.time} - ${event.title}`}>
                  <Badge
                    color={event.color}
                    text={
                      <span style={{ fontSize: '10px', color: '#666', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>
                        {event.title}
                      </span>
                    }
                  />
                </Tooltip>
              </DraggableEvent>
            ))}
            {events.length > 3 && (
              <span style={{ fontSize: '10px', color: '#999' }}>+{events.length - 3} 更多</span>
            )}
          </div>
        </DroppableCell>
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
  const onPanelChange = (value) => {
    setCurrentMonth(value);
  };

  // 导航功能
  const goToPrevMonth = () => {
    setCurrentMonth(prev => prev.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => prev.add(1, 'month'));
  };

  const goToToday = () => {
    const today = dayjs();
    setCurrentMonth(today);
    setCurrentDate(today);
    onDateChange && onDateChange(today);
  };

  const goToPrevDay = () => {
    const prevDay = currentDate.subtract(1, 'day');
    setCurrentDate(prevDay);
    setCurrentMonth(prevDay);
    onDateChange && onDateChange(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = currentDate.add(1, 'day');
    setCurrentDate(nextDay);
    setCurrentMonth(nextDay);
    onDateChange && onDateChange(nextDay);
  };

  // 获取当前周的日期范围
  const getCurrentWeekDates = () => {
    const startOfWeek = currentDate.startOf('week')
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'))
  }

  // 检查是否有学习计划数据
  if (!plan || !plan.phases || plan.phases.length === 0) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
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
    <>
      {/* 学习计划日历组件 - 适配三栏布局 */}
      <DndProvider backend={HTML5Backend}>
      <div style={{ 
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f5f5'
      }}>
        {/* 头部导航区域 */}
        <div style={{
          background: '#f5f5f5',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '8px 8px 0 0',
          borderBottom: '1px solid #eaeaea'
        }}>
          {/* 左侧视图切换 */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type={calendarView === 'day' ? 'primary' : 'default'}
              size="small"
              onClick={() => setCalendarView('day')}
            >
              日
            </Button>
            <Button
              type={calendarView === 'week' ? 'primary' : 'default'}
              size="small"
              onClick={() => setCalendarView('week')}
            >
              周
            </Button>
            <Button
              type={calendarView === 'month' ? 'primary' : 'default'}
              size="small"
              onClick={() => setCalendarView('month')}
            >
              月
            </Button>
          </div>

          {/* 中间日期导航 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              size="small"
              icon={<LeftOutlined />}
              onClick={() => {
                if (calendarView === 'day') {
                  goToPrevDay();
                } else if (calendarView === 'week') {
                  const prevWeek = currentDate.subtract(1, 'week');
                  setCurrentDate(prevWeek);
                  setCurrentMonth(prevWeek);
                } else {
                  goToPrevMonth();
                }
              }}
            />
            
            <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '120px', textAlign: 'center' }}>
              {calendarView === 'day' && currentDate.format('YYYY年MM月DD日')}
              {calendarView === 'week' && `${getCurrentWeekDates()[0].format('MM月DD日')} - ${getCurrentWeekDates()[6].format('MM月DD日')}`}
              {calendarView === 'month' && currentMonth.format('YYYY年MM月')}
            </span>
            
            <Button
              size="small"
              icon={<RightOutlined />}
              onClick={() => {
                if (calendarView === 'day') {
                  goToNextDay();
                } else if (calendarView === 'week') {
                  const nextWeek = currentDate.add(1, 'week');
                  setCurrentDate(nextWeek);
                  setCurrentMonth(nextWeek);
                } else {
                  goToNextMonth();
                }
              }}
            />
          </div>

          {/* 右侧操作按钮 */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {onBackToThreeColumn && (
              <Button
                size="small"
                icon={<LeftOutlined />}
                onClick={onBackToThreeColumn}
              >
                返回三栏视图
              </Button>
            )}
            <Button
              size="small"
              onClick={goToToday}
            >
              今天
            </Button>
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateEvent}
            >
              添加日程
            </Button>
          </div>
        </div>

        {/* 主内容区域 */}
        <div style={{ 
          flex: 1, 
          background: '#fff',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden',
          padding: '16px'
        }}>
          {calendarView === 'month' && (
            <Row gutter={16}>
              <Col span={6}>
                <Card size="small" title="分类筛选">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Checkbox
                      checked={categories.length > 0 && categories.every(cat => cat.checked)}
                      indeterminate={!(categories.length > 0 && categories.every(cat => cat.checked)) && categories.some(cat => cat.checked)}
                      onChange={(e) => toggleAllCategories(e.target.checked)}
                    >
                      全选
                    </Checkbox>
                  </div>
                  <div>
                    {categories.map(category => (
                      <div key={category.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Checkbox
                          checked={category.checked}
                          disabled={category.disabled}
                          onChange={(e) => handleCategoryChange(category.key, e.target.checked)}
                        >
                          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: category.color, marginRight: 6 }}></span>
                          {category.label}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card size="small" title="搜索" style={{ marginTop: 12 }}>
                  <Input placeholder="搜索日程、人员或会议室" prefix={<SearchOutlined />} />
                </Card>
                <Card size="small" title="迷你月历" style={{ marginTop: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                    {Array.from({ length: currentMonth.startOf('month').day() }, (_, i) => (
                      <div key={`empty-${i}`} style={{ height: 24 }}></div>
                    ))}
                    {Array.from({ length: currentMonth.daysInMonth() }, (_, i) => {
                      const d = currentMonth.startOf('month').add(i, 'day');
                      const isToday = d.isSame(dayjs(), 'day');
                      const isSelected = d.isSame(currentDate, 'day');
                      return (
                        <div
                          key={d.format('YYYY-MM-DD')}
                          onClick={() => { setCurrentMonth(d); setCurrentDate(d); onDateChange && onDateChange(d); }}
                          style={{
                            height: 24,
                            lineHeight: '24px',
                            textAlign: 'center',
                            borderRadius: 4,
                            cursor: 'pointer',
                            background: isSelected ? '#e6f7ff' : (isToday ? '#fffbe6' : '#fafafa')
                          }}
                        >
                          {d.date()}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </Col>
              <Col span={18}>
                <Calendar
                  value={currentMonth}
                  cellRender={cellRender}
                  onSelect={onSelect}
                  onPanelChange={onPanelChange}
                  style={{ 
                    background: 'transparent',
                    borderRadius: '8px'
                  }}
                />
              </Col>
            </Row>
          )}
          
          {calendarView === 'day' && renderSimpleDayView()}
          
          {calendarView === 'week' && renderWeekView()}
        </div>
      </div>
      </DndProvider>
      <Modal
        title="添加日程"
        open={isCreateModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCreateCancel}
        okText="确定"
        cancelText="取消"
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit}>
          <Form.Item name="title" label="日程标题" rules={[{ required: true, message: '请输入日程标题' }] }>
            <Input placeholder="请输入日程标题" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择日期' }] }>
                <DatePicker style={{ width: '100%' }} format="YYYY年MM月DD日" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="类型" rules={[{ required: true, message: '请选择类型' }] }>
                <Select placeholder="请选择类型">
                  {categories.map(category => (
                    <Select.Option key={category.key} value={category.key}>
                      <span style={{ color: category.color }}>●</span> {category.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="开始时间">
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束时间">
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
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
    </>
  );
};

export default LearningPlanCalendar;
