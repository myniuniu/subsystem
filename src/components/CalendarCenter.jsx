import React, { useState } from 'react'
import { Calendar, Badge, Button, Input, Checkbox, Space, Typography, Modal, Form, Select, DatePicker, TimePicker, message, Row, Col, Divider } from 'antd'
import { SearchOutlined, PlusOutlined, LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import './CalendarCenter.css'

const { Title } = Typography

// 设置dayjs为中文
dayjs.locale('zh-cn')

const CalendarCenter = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [activeView, setActiveView] = useState('month')
  const [calendarView, setCalendarView] = useState('month') // 'month', 'week', 'day'
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [previewDate, setPreviewDate] = useState(dayjs()) // 用于日视图预览的日期状态
  
  // 拖拽事件处理
  const moveEvent = (draggedEvent, newDate, newTime) => {
    setEventList(prevEvents => 
      prevEvents.map(event => {
        if (event.id === draggedEvent.id) {
          return {
            ...event,
            date: newDate,
            time: newTime || event.time
          }
        }
        return event
      })
    )
    message.success('事件已移动')
  }

  // 可拖拽事件组件
  const DraggableEvent = ({ event, children, className }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'event',
      item: { id: event.id, event },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    })

    return (
      <div
        ref={drag}
        className={`${className} ${isDragging ? 'dragging' : ''}`}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move'
        }}
      >
        {children}
      </div>
    )
  }

  // 可放置的日期单元格组件
  const DroppableCell = ({ date, children, className, timeSlot }) => {
    const [{ isOver }, drop] = useDrop({
      accept: 'event',
      drop: (item) => {
        const newDate = date.format('YYYY-MM-DD')
        moveEvent(item.event, newDate, timeSlot)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    })

    return (
      <div
        ref={drop}
        className={`${className} ${isOver ? 'drop-target' : ''}`}
        style={{
          backgroundColor: isOver ? '#e6f7ff' : 'transparent'
        }}
      >
        {children}
      </div>
    )
  }
  
  // 智慧教学平台示例事件数据
  const [eventList, setEventList] = useState([
    // 1月份教研活动
    { id: 1, date: '2025-01-02', title: '新学期教研工作部署会', type: 'meeting', color: 'blue' },
    { id: 2, date: '2025-01-03', title: '课程标准研讨', type: 'work', color: 'green' },
    { id: 3, date: '2025-01-06', title: '信息化教学培训', type: 'training', color: 'orange' },
    { id: 4, date: '2025-01-08', title: '教学质量评估', type: 'business', color: 'red' },
    { id: 5, date: '2025-01-10', title: '学科组教研会议', type: 'meeting', color: 'blue' },
    { id: 6, date: '2025-01-12', title: '教案设计评审', type: 'work', color: 'green' },
    { id: 7, date: '2025-01-15', title: '青年教师座谈会', type: 'meeting', color: 'blue' },
    { id: 8, date: '2025-01-16', title: '课堂观察研讨', type: 'work', color: 'green' },
    { id: 9, date: '2025-01-17', title: '教学方法交流会', type: 'meeting', color: 'blue' },
    { id: 10, date: '2025-01-18', title: 'AI辅助教学培训', type: 'training', color: 'orange' },
    { id: 11, date: '2025-01-20', title: '校际教研交流', type: 'business', color: 'red' },
    { id: 12, date: '2025-01-22', title: '教学资源建设评审', type: 'work', color: 'green' },
    { id: 13, date: '2025-01-24', title: '教研组集体研讨', type: 'meeting', color: 'blue' },
    { id: 14, date: '2025-01-25', title: '教学成果展示会', type: 'milestone', color: 'purple' },
    { id: 15, date: '2025-01-27', title: '家校合作研讨', type: 'business', color: 'red' },
    { id: 16, date: '2025-01-28', title: '期末教学总结', type: 'work', color: 'green' },
    { id: 17, date: '2025-01-29', title: '教育技术应用分享', type: 'training', color: 'orange' },
    { id: 18, date: '2025-01-30', title: '月度教研总结', type: 'milestone', color: 'purple' },
    { id: 19, date: '2025-01-31', title: '教师专业发展规划', type: 'meeting', color: 'blue' },
    
    // 2月份教研活动
    { id: 20, date: '2025-02-03', title: '新学期开学准备会', type: 'meeting', color: 'blue' },
    { id: 21, date: '2025-02-05', title: '新课程实施方案', type: 'work', color: 'green' },
    { id: 22, date: '2025-02-07', title: '教学计划制定会', type: 'meeting', color: 'blue' },
    { id: 23, date: '2025-02-10', title: '多媒体教学技能培训', type: 'training', color: 'orange' },
    { id: 24, date: '2025-02-12', title: '学生学情分析', type: 'business', color: 'red' },
    { id: 25, date: '2025-02-14', title: '师生互动研讨会', type: 'meeting', color: 'blue' },
    { id: 26, date: '2025-02-17', title: '教学模式创新研究', type: 'work', color: 'green' },
    { id: 27, date: '2025-02-19', title: '学期教学目标制定', type: 'milestone', color: 'purple' },
    { id: 28, date: '2025-02-21', title: '跨学科教学研讨', type: 'meeting', color: 'blue' },
    { id: 29, date: '2025-02-24', title: '智慧课堂建设培训', type: 'training', color: 'orange' },
    { id: 30, date: '2025-02-26', title: '教育专家讲座', type: 'business', color: 'red' },
    { id: 31, date: '2025-02-28', title: '教研月度回顾', type: 'milestone', color: 'purple' },
    
    // 9月份教研活动
    { id: 32, date: '2025-09-02', title: '新学期开学工作会议', type: 'meeting', color: 'blue' },
    { id: 33, date: '2025-09-03', title: '教学计划审核', type: 'work', color: 'green' },
    { id: 34, date: '2025-09-05', title: '新教师入职培训', type: 'training', color: 'orange' },
    { id: 35, date: '2025-09-06', title: '教学质量监控启动', type: 'business', color: 'red' },
    { id: 36, date: '2025-09-09', title: '教师节庆祝活动', type: 'meeting', color: 'blue' },
    { id: 37, date: '2025-09-10', title: '优秀教案评选', type: 'work', color: 'green' },
    { id: 38, date: '2025-09-12', title: '信息技术应用培训', type: 'training', color: 'orange' },
    { id: 39, date: '2025-09-13', title: '学科教研组会议', type: 'meeting', color: 'blue' },
    { id: 40, date: '2025-09-16', title: '课程改革研讨', type: 'work', color: 'green' },
    { id: 41, date: '2025-09-18', title: '教学方法创新培训', type: 'training', color: 'orange' },
    { id: 42, date: '2025-09-20', title: '校际交流访问', type: 'business', color: 'red' },
    { id: 43, date: '2025-09-23', title: '教学成果汇报', type: 'milestone', color: 'purple' },
    { id: 44, date: '2025-09-25', title: '青年教师成长计划', type: 'meeting', color: 'blue' },
    { id: 45, date: '2025-09-27', title: '教学资源共享会', type: 'work', color: 'green' },
    { id: 46, date: '2025-09-30', title: '月度教学总结', type: 'milestone', color: 'purple' }
  ])
  
  // 教研活动分类
  const [categories, setCategories] = useState([
    { key: 'meeting', label: '教研会议', color: '#1890ff', checked: true },
    { key: 'work', label: '教学工作', color: '#52c41a', checked: true },
    { key: 'training', label: '培训学习', color: '#fa8c16', checked: true },
    { key: 'business', label: '交流合作', color: '#f5222d', checked: true },
    { key: 'milestone', label: '重要节点', color: '#722ed1', checked: true },
  ])

  // 获取指定日期的事件
  const getListData = (value) => {
    const dateStr = value.format('YYYY-MM-DD')
    return eventList.filter(event => event.date === dateStr)
  }

  // 创建日程处理函数
  const handleCreateEvent = () => {
    setIsCreateModalVisible(true)
  }

  // 提交创建日程表单
  const handleCreateSubmit = (values) => {
    const newEvent = {
      id: Date.now(), // 使用时间戳作为唯一id
      date: values.date.format('YYYY-MM-DD'),
      title: values.title,
      type: values.type,
      color: categories.find(cat => cat.key === values.type)?.color.replace('#', '') || 'blue',
      startTime: values.startTime?.format('HH:mm'),
      endTime: values.endTime?.format('HH:mm'),
      description: values.description
    }
    
    setEventList(prev => [...prev, newEvent])
    setIsCreateModalVisible(false)
    form.resetFields()
    message.success('日程创建成功！')
  }

  // 取消创建日程
  const handleCreateCancel = () => {
    setIsCreateModalVisible(false)
    form.resetFields()
  }

  // 单元格渲染
  const cellRender = (current, info) => {
    if (info.type === 'date') {
      const listData = getListData(current)
      const activeCategories = categories.filter(cat => cat.checked).map(cat => cat.key)
      const filteredData = listData.filter(item => activeCategories.includes(item.type))
      
      return (
        <DroppableCell date={current} className="calendar-cell">
          <ul className="events">
            {filteredData.map((item, index) => {
              // 将颜色值转换为Badge支持的status
              let status = 'default'
              switch(item.color) {
                case 'blue': status = 'processing'; break;
                case 'green': status = 'success'; break;
                case 'orange': status = 'warning'; break;
                case 'red': status = 'error'; break;
                case 'purple': status = 'default'; break;
                default: status = 'default';
              }
              
              return (
                <DraggableEvent key={item.id} event={item} className={`event-item event-${item.type}`}>
                  <li className="event-content">
                    <span className={`event-dot event-${item.color}`}></span>
                    <span className="event-title">{item.title}</span>
                  </li>
                </DraggableEvent>
              )
            })}
          </ul>
        </DroppableCell>
      )
    }
    
    if (info.type === 'month') {
      const monthEvents = eventList.filter(event => 
        dayjs(event.date).month() === current.month() && 
        dayjs(event.date).year() === current.year()
      )
      return monthEvents.length ? (
        <div className="notes-month">
          <section>{monthEvents.length}</section>
          <span>个事件</span>
        </div>
      ) : null
    }
    
    return info.originNode
  }

  // 处理分类复选框变化
  const handleCategoryChange = (key, checked) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.key === key ? { ...cat, checked } : cat
      )
    )
  }

  // 导航到上个时间段
  const goToPrev = () => {
    if (calendarView === 'month') {
      setCurrentMonth(prev => prev.subtract(1, 'month'))
    } else if (calendarView === 'week') {
      setSelectedDate(prev => prev.subtract(1, 'week'))
    } else if (calendarView === 'day') {
      setSelectedDate(prev => prev.subtract(1, 'day'))
    }
  }

  // 导航到下个时间段
  const goToNext = () => {
    if (calendarView === 'month') {
      setCurrentMonth(prev => prev.add(1, 'month'))
    } else if (calendarView === 'week') {
      setSelectedDate(prev => prev.add(1, 'week'))
    } else if (calendarView === 'day') {
      setSelectedDate(prev => prev.add(1, 'day'))
    }
  }

  // 导航到今天
  const goToToday = () => {
    const today = dayjs()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const onPanelChange = (value, mode) => {
    setCurrentMonth(value)
  }

  const onSelect = (value) => {
    setSelectedDate(value)
  }

  // 获取当前周的日期范围
  const getCurrentWeekDates = () => {
    const startOfWeek = selectedDate.startOf('week')
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'))
  }

  // 渲染周视图
  const renderWeekView = () => {
    const weekDates = getCurrentWeekDates()
    const hours = Array.from({ length: 24 }, (_, i) => i)
    
    return (
      <div className="week-view">
        <div className="week-header">
          <div className="time-column"></div>
          {weekDates.map(date => (
            <div key={date.format('YYYY-MM-DD')} className="day-column">
              <div className="day-header">
                <div className="day-name">{date.format('ddd')}</div>
                <div className={`day-number ${date.isSame(dayjs(), 'day') ? 'today' : ''}`}>
                  {date.format('DD')}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="week-body">
          {hours.map(hour => (
            <div key={hour} className="hour-row">
              <div className="time-slot">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {weekDates.map(date => {
                const dayEvents = getListData(date)
                const activeCategories = categories.filter(cat => cat.checked).map(cat => cat.key)
                const filteredEvents = dayEvents.filter(item => activeCategories.includes(item.type))
                
                return (
                  <DroppableCell key={`${date.format('YYYY-MM-DD')}-${hour}`} date={date} timeSlot={`${hour.toString().padStart(2, '0')}:00`} className="day-slot">
                    {hour === 9 && filteredEvents.map((event, index) => (
                      <DraggableEvent key={event.id} event={event} className={`week-event event-${event.color}`}>
                        <div>
                          <span className="event-time">09:00</span>
                          <span className="event-title">{event.title}</span>
                        </div>
                      </DraggableEvent>
                    ))}
                  </DroppableCell>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 渲染日视图
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const dayEvents = getListData(selectedDate)
    const activeCategories = categories.filter(cat => cat.checked).map(cat => cat.key)
    const filteredEvents = dayEvents.filter(item => activeCategories.includes(item.type))
    
    return (
      <div className="day-view">
        <div className="day-header">
          <div className="day-title">
            {selectedDate.format('YYYY年MM月DD日 dddd')}
          </div>
          <div className="day-events-count">
            {filteredEvents.length} 个事件
          </div>
        </div>
        <div className="day-body">
          {hours.map(hour => (
            <div key={hour} className="hour-slot">
              <div className="time-label">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <DroppableCell date={selectedDate} timeSlot={`${hour.toString().padStart(2, '0')}:00`} className="hour-content">
                {hour === 9 && filteredEvents.map((event, index) => (
                  <DraggableEvent key={event.id} event={event} className={`day-event event-${event.color}`}>
                    <div>
                      <div className="event-time">09:00 - 10:00</div>
                      <div className="event-title">{event.title}</div>
                      <div className="event-type">{categories.find(cat => cat.key === event.type)?.label}</div>
                    </div>
                  </DraggableEvent>
                ))}
              </DroppableCell>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-center">
      {/* 顶部工具栏 */}
      <div className="calendar-header">
        <div className="calendar-nav">
          <div className="nav-tabs">
            <span className={`nav-tab ${activeView === 'month' ? 'active' : ''}`} 
                  onClick={() => setActiveView('month')}>日历</span>
          </div>
          <div className="nav-actions">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateEvent}>
              创建日程
            </Button>
          </div>
        </div>
        
        <div className="calendar-controls">
          <div className="date-navigation">
            <Button icon={<LeftOutlined />} onClick={goToPrev} />
            <Button icon={<RightOutlined />} onClick={goToNext} />
            <span className="current-date" onClick={goToToday}>今天</span>
          </div>
          <div className="date-range">
            {calendarView === 'month' && currentMonth.format('YYYY年MM月')}
            {calendarView === 'week' && (
              `${selectedDate.startOf('week').format('MM月DD日')} - ${selectedDate.endOf('week').format('MM月DD日')}`
            )}
            {calendarView === 'day' && selectedDate.format('YYYY年MM月DD日')}
          </div>
          <div className="view-controls">
            <Button 
              type={calendarView === 'month' ? 'primary' : 'default'}
              onClick={() => setCalendarView('month')}
            >
              月
            </Button>
            <Button 
              type={calendarView === 'week' ? 'primary' : 'default'}
              onClick={() => setCalendarView('week')}
            >
              周
            </Button>
            <Button 
              type={calendarView === 'day' ? 'primary' : 'default'}
              onClick={() => setCalendarView('day')}
            >
              日
            </Button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="calendar-content">
        {/* 左侧边栏 */}
        <div className="calendar-sidebar">
          <div className="sidebar-search">
            <Input 
              placeholder="搜索日程、人员或会议室" 
              prefix={<SearchOutlined />}
            />
          </div>
          
          <div className="sidebar-actions">
            <Button type="text" block>公共日历</Button>
          </div>
          
          <div className="sidebar-section">
            <div className="section-title">我的日历</div>
            <div className="calendar-categories">
              {categories.map((category) => (
                <div key={category.key} className="category-item">
                  <Checkbox 
                    checked={category.checked}
                    onChange={(e) => handleCategoryChange(category.key, e.target.checked)}
                  >
                    <span 
                      className="category-dot" 
                      style={{ backgroundColor: category.color }}
                    ></span>
                    {category.label}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>
          
          {/* 小日历 */}
          <div className="sidebar-mini-calendar">
            <div className="mini-calendar-header">
              <Button 
                type="text" 
                size="small" 
                icon={<LeftOutlined />}
                onClick={() => setCurrentMonth(prev => prev.subtract(1, 'month'))}
                className="mini-nav-btn"
              />
              <span className="mini-calendar-title">
                {currentMonth.format('YYYY年MM月')}
              </span>
              <Button 
                type="text" 
                size="small" 
                icon={<RightOutlined />}
                onClick={() => setCurrentMonth(prev => prev.add(1, 'month'))}
                className="mini-nav-btn"
              />
            </div>
            <div className="mini-calendar-grid">
              <div className="weekdays">
                {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>
              <div className="dates">
                {Array.from({ length: 42 }, (_, i) => {
                  const startOfMonth = currentMonth.startOf('month')
                  const startOfWeek = startOfMonth.startOf('week')
                  const date = startOfWeek.add(i, 'day')
                  const isCurrentMonth = date.month() === currentMonth.month()
                  const isToday = date.isSame(dayjs(), 'day')
                  const isSelected = date.isSame(selectedDate, 'day')
                  
                  return (
                    <div 
                      key={i} 
                      className={`date ${
                        isCurrentMonth ? 'current-month' : 'other-month'
                      } ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {date.date()}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 主日历区域 */}
        <div className="calendar-main">
          <div className="main-calendar">
            {calendarView === 'month' && (
              <div style={{ height: '100%', overflow: 'hidden' }}>
                <Calendar
                  value={currentMonth}
                  cellRender={cellRender}
                  onPanelChange={onPanelChange}
                  onSelect={onSelect}
                  style={{ height: '100%', overflow: 'hidden' }}
                  locale={{
                    lang: {
                      locale: 'zh_CN',
                      monthFormat: 'YYYY年MM月',
                      today: '今天',
                      now: '此刻',
                      backToToday: '返回今天',
                      ok: '确定',
                      clear: '清除',
                      month: '月',
                      year: '年',
                      timeSelect: '选择时间',
                      dateSelect: '选择日期',
                      monthSelect: '选择月份',
                      yearSelect: '选择年份',
                      decadeSelect: '选择年代',
                      yearFormat: 'YYYY年',
                      dateFormat: 'YYYY年MM月DD日',
                      dayFormat: 'DD日',
                      dateTimeFormat: 'YYYY年MM月DD日 HH时mm分ss秒',
                      monthBeforeYear: true,
                      previousMonth: '上个月 (PageUp)',
                      nextMonth: '下个月 (PageDown)',
                      previousYear: '上一年 (Control + left)',
                      nextYear: '下一年 (Control + right)',
                      previousDecade: '上一年代',
                      nextDecade: '下一年代',
                      previousCentury: '上一世纪',
                      nextCentury: '下一世纪'
                    }
                  }}
                />
              </div>
            )}
            {calendarView === 'week' && renderWeekView()}
            {calendarView === 'day' && renderDayView()}
          </div>
        </div>
      </div>
      
      {/* 创建日程弹窗 */}
      <Modal
        title="添加日程"
        open={isCreateModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCreateCancel}
        okText="确定"
        cancelText="取消"
        width={1200}
        styles={{ body: { padding: '20px' } }}
        destroyOnHidden={true}
      >
        <Row gutter={24}>
          {/* 左侧表单区域 */}
          <Col span={12}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleCreateSubmit}
              initialValues={{
                date: dayjs(),
                type: 'meeting',
                startTime: dayjs('17:30', 'HH:mm'),
                endTime: dayjs('18:00', 'HH:mm')
              }}
            >
              <Form.Item
                name="title"
                label="日程标题"
                rules={[{ required: true, message: '请输入日程标题' }]}
              >
                <Input placeholder="请输入日程标题" size="large" />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="date"
                    label="日期"
                    rules={[{ required: true, message: '请选择日程日期' }]}
                  >
                    <DatePicker 
                      style={{ width: '100%' }}
                      placeholder="请选择日程日期"
                      format="YYYY年MM月DD日"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="startTime"
                    label="开始时间"
                  >
                    <TimePicker 
                      style={{ width: '100%' }}
                      placeholder="开始时间"
                      format="HH:mm"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="endTime"
                    label="结束时间"
                  >
                    <TimePicker 
                      style={{ width: '100%' }}
                      placeholder="结束时间"
                      format="HH:mm"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Checkbox>全天</Checkbox>
                <span style={{ marginLeft: '16px', color: '#666' }}>不重复</span>
              </Form.Item>
              
              <Form.Item
                name="type"
                label="日程类型"
                rules={[{ required: true, message: '请选择日程类型' }]}
              >
                <Select placeholder="请选择日程类型" size="large">
                  {categories.map(category => (
                    <Select.Option key={category.key} value={category.key}>
                      <span style={{ color: category.color }}>●</span> {category.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="location"
                label="位置"
              >
                <Input placeholder="添加位置" size="large" />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="备注"
              >
                <Input.TextArea 
                  rows={3}
                  placeholder="添加备注"
                  size="large"
                />
              </Form.Item>
            </Form>
          </Col>
          
          {/* 右侧日视图预览区域 */}
          <Col span={12}>
            <div style={{ paddingLeft: '16px' }}>
              {/* 导航头部 */}
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button 
                    size="small" 
                    type="default"
                    onClick={() => {
                      const today = dayjs();
                      form.setFieldsValue({ date: today });
                      setPreviewDate(today);
                    }}
                    style={{ borderRadius: '4px' }}
                  >
                    今天
                  </Button>
                  
                  <Button 
                    size="small" 
                    type="text" 
                    icon={<LeftOutlined />}
                    onClick={() => {
                      const currentDate = previewDate;
                      const prevDay = currentDate.subtract(1, 'day');
                      form.setFieldsValue({ date: prevDay });
                      setPreviewDate(prevDay);
                    }}
                  />
                  
                  <Button 
                    size="small" 
                    type="text" 
                    icon={<RightOutlined />}
                    onClick={() => {
                      const currentDate = previewDate;
                      const nextDay = currentDate.add(1, 'day');
                      form.setFieldsValue({ date: nextDay });
                      setPreviewDate(nextDay);
                    }}
                  />
                  
                  <DatePicker
                    value={previewDate}
                    style={{ minWidth: '120px' }}
                    size="small"
                    suffixIcon={<CalendarOutlined />}
                    format="M月D日 dddd"
                    onChange={(date) => {
                      if (date) {
                        setPreviewDate(date);
                        form.setFieldsValue({ date });
                      }
                    }}
                    allowClear={false}
                  />
                </div>
              </div>
              
              {/* 日视图时间表 */}
              <div className="day-view-preview" style={{ height: '400px', overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
                <div className="day-view-header" style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa', fontWeight: '500', fontSize: '13px' }}>
                  {previewDate.format('YYYY年MM月DD日 dddd')}
                </div>
                
                <div className="day-view-content">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                    const dayEvents = eventList.filter(event => 
                      dayjs(event.date).format('YYYY-MM-DD') === previewDate.format('YYYY-MM-DD')
                    );
                    
                    // 查找当前时间段的事件
                    const hourEvents = dayEvents.filter(event => {
                      if (event.startTime) {
                        const eventHour = parseInt(event.startTime.split(':')[0]);
                        return eventHour === hour;
                      }
                      return false;
                    });
                    
                    return (
                      <div key={hour} className="day-view-hour" style={{ display: 'flex', minHeight: '50px', borderBottom: '1px solid #f5f5f5' }}>
                        <div className="hour-label" style={{ width: '60px', padding: '8px', fontSize: '12px', color: '#8c8c8c', borderRight: '1px solid #f5f5f5', backgroundColor: '#fafafa' }}>
                          {timeStr}
                        </div>
                        <div className="hour-content" style={{ flex: 1, padding: '4px 8px', position: 'relative' }}>
                          {hourEvents.map((event, index) => {
                            const category = categories.find(cat => cat.key === event.type);
                            return (
                              <div
                                key={index}
                                style={{
                                  backgroundColor: category?.color || '#1890ff',
                                  color: 'white',
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  fontSize: '11px',
                                  marginBottom: '2px',
                                  opacity: 0.8
                                }}
                              >
                                {event.startTime && event.endTime ? `${event.startTime}-${event.endTime}` : ''} {event.title}
                              </div>
                            );
                          })}
                          
                          {/* 显示新创建的事件预览 */}
                          {form.getFieldValue('startTime') && 
                           form.getFieldValue('date') && 
                           dayjs(form.getFieldValue('date')).format('YYYY-MM-DD') === previewDate.format('YYYY-MM-DD') &&
                           parseInt(form.getFieldValue('startTime')?.format('HH') || '0') === hour && (
                            <div
                              style={{
                                backgroundColor: '#52c41a',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                fontSize: '11px',
                                border: '1px dashed #fff',
                                opacity: 0.7
                              }}
                            >
                              {(form.getFieldValue('startTime') && form.getFieldValue('endTime')) ? 
                                `${form.getFieldValue('startTime').format('HH:mm')}-${form.getFieldValue('endTime').format('HH:mm')}` : '09:00-10:00'} {form.getFieldValue('title') || '新日程'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
      </div>
    </DndProvider>
  )
};

export default CalendarCenter;