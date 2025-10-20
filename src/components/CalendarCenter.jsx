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
  const [activeView, setActiveView] = useState('week')
  const [calendarView, setCalendarView] = useState('week') // 'month', 'week', 'day'
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
  
  // 事件列表（通过生成器填充）
  const [eventList, setEventList] = useState([])

  // 类型与颜色映射（与现有样式一致）
  const typeColorMap = {
    meeting: 'blue',
    work: 'green',
    training: 'orange',
    business: 'red',
    milestone: 'purple',
    new_teacher_methods_training: 'orange',
  }

  const titlesByType = {
    meeting: '教研会议',
    work: '教学工作',
    training: '培训学习',
    business: '交流合作',
    milestone: '重要节点',
    new_teacher_methods_training: '新教师教学方法培训',
  }

  // 生成测试事件：按当前月与勾选分类，每日不超过3条（支持学习计划类目）
  const generateTestEvents = (month, categories, maxPerDay = 3) => {
    const activeCategories = categories.filter(c => c.checked)
    const start = month.startOf('month')
    const days = month.daysInMonth()
    let id = 1
    const events = []
    const timeSlots = ['08:00', '09:30', '11:00', '14:00', '16:00', '19:00', '20:30']
    const timeSlotsEnd = ['09:00', '10:30', '12:00', '15:00', '17:00', '20:00', '21:30']

    const hexToColorName = (hex) => {
      switch ((hex || '').toLowerCase()) {
        case '#1890ff': return 'blue'
        case '#52c41a': return 'green'
        case '#fa8c16': return 'orange'
        case '#f5222d': return 'red'
        case '#722ed1': return 'purple'
        default: return 'blue'
      }
    }

    for (let d = 0; d < days; d++) {
      const dateStr = start.add(d, 'day').format('YYYY-MM-DD')
      const count = Math.floor(Math.random() * (maxPerDay + 1))
      const dayCount = Math.min(count, maxPerDay)
      const usedSlots = new Set()
      for (let i = 0; i < dayCount; i++) {
        const cat = activeCategories[Math.floor(Math.random() * (activeCategories.length || 1))] || { key: 'meeting', label: '教研会议', color: '#1890ff', type: 'meeting' }
        const type = cat.key
        const color = typeColorMap[type] || hexToColorName(cat.color)

        // 选择一个未使用的时间段，分布到不同时间
        let slotIndex = Math.floor(Math.random() * timeSlots.length)
        let guard = 0
        while (usedSlots.has(slotIndex) && guard < timeSlots.length) {
          slotIndex = (slotIndex + 1) % timeSlots.length
          guard++
        }
        usedSlots.add(slotIndex)
        const startTime = timeSlots[slotIndex]
        const endTime = timeSlotsEnd[slotIndex]

        // 生成标题：学习计划使用计划标题，其它按映射
        let title
        if (cat.type === 'learning-plan') {
          const planTitle = (cat.planTitle || cat.label || '学习计划').replace(/^学习计划[:：]\s*/, '')
          title = `${planTitle} 学习任务${i + 1}`
        } else {
          title = `${titlesByType[type] || cat.label || '事件'}示例${i + 1}`
        }

        events.push({
          id: id++,
          date: dateStr,
          title,
          type, // 与分类key保持一致，便于过滤
          color,
          startTime,
          endTime,
        })
      }
    }
    // 专题：新教师教学方法培训主题事件（固定时间分布）
    const specialType = 'new_teacher_methods_training'
    const hasSpecialCat = activeCategories.some(c => c.key === specialType)
    if (hasSpecialCat) {
      const scheduleDefs = [
        { offset: 3, title: '线上直播课程：课堂设计与互动', startTime: '19:00', endTime: '20:30' },
        { offset: 8, title: '录播视频：教学组织与提问技巧' },
        { offset: 15, title: '在线研讨：小组讨论与同伴互评', startTime: '20:00', endTime: '21:30' },
        { offset: 22, title: '实践作业：提交微课教学方案', startTime: '18:00', endTime: '19:00' },
      ]
      scheduleDefs.forEach(def => {
        if (def.offset <= days) {
          const dateStrFixed = start.add(def.offset - 1, 'day').format('YYYY-MM-DD')
          events.push({
            id: id++,
            date: dateStrFixed,
            title: def.title,
            type: specialType,
            color: typeColorMap[specialType] || 'orange',
            startTime: def.startTime,
            endTime: def.endTime,
          })
        }
      })
    }
    return events
  }
  
  // 教研活动分类
  const [categories, setCategories] = useState([
    { key: 'meeting', label: '教研会议', color: '#1890ff', checked: true },
    { key: 'work', label: '教学工作', color: '#52c41a', checked: true },
    { key: 'training', label: '培训学习', color: '#fa8c16', checked: true },
    { key: 'business', label: '交流合作', color: '#f5222d', checked: true },
    { key: 'milestone', label: '重要节点', color: '#722ed1', checked: true },
    { key: 'new_teacher_methods_training', label: '新教师教学方法培训', color: '#13c2c2', checked: true },
  ])

  // 根据当前月与分类生成测试数据（每日不超过3条）
  React.useEffect(() => {
    const generated = generateTestEvents(currentMonth, categories, 3)
    setEventList(generated)
  }, [currentMonth, categories])

  // 监听日历分类变化事件
  React.useEffect(() => {
    const handleCategoriesChanged = (event) => {
      const { categories: newCategories } = event.detail;
      // 合并现有分类和新的学习计划分类
      const existingCategories = categories.filter(cat => cat.type !== 'learning-plan');
      const learningPlanCategories = newCategories.filter(cat => cat.type === 'learning-plan');

      // 工具函数：规范化与双重去重（按ID与标签）
      const normalize = (cat) => ({
        ...cat,
        label: cat.planTitle ? `学习计划: ${cat.planTitle}` : (cat.label?.startsWith('学习计划') ? cat.label : `学习计划: ${cat.label || '未命名'}`)
      })
      const dedupeById = (arr) => {
        const seen = new Set()
        return arr.filter(cat => {
          const id = cat.planId ?? cat.key
          if (!id) return true
          if (seen.has(id)) return false
          seen.add(id)
          return true
        })
      }
      const dedupeByLabel = (arr) => {
        const picked = new Map()
        for (const cat of arr) {
          const label = cat.label || ''
          if (!picked.has(label)) {
            picked.set(label, cat)
          } else {
            const existing = picked.get(label)
            // 优先选择有 planId 的项，其次保留已存在项
            if (!existing.planId && cat.planId) {
              picked.set(label, cat)
            }
          }
        }
        return Array.from(picked.values())
      }

      const normalized = learningPlanCategories.map(normalize)
      const idDeduped = dedupeById(normalized)
      const fullyDeduped = dedupeByLabel(idDeduped)
      setCategories([...existingCategories, ...fullyDeduped])
    };

    window.addEventListener('calendarCategoriesChanged', handleCategoriesChanged);
    
    // 初始化时加载已保存的分类
    const savedCategories = JSON.parse(localStorage.getItem('calendar-categories') || '[]');
    if (savedCategories.length > 0) {
      const existingCategories = categories.filter(cat => cat.type !== 'learning-plan');
      const learningPlanCategories = savedCategories.filter(cat => cat.type === 'learning-plan');
      // 初始化加载时也进行去重并规范化（ID + 标签 双重去重）
      const normalize = (cat) => ({
        ...cat,
        label: cat.planTitle ? `学习计划: ${cat.planTitle}` : (cat.label?.startsWith('学习计划') ? cat.label : `学习计划: ${cat.label || '未命名'}`)
      })
      const dedupeById = (arr) => {
        const seen = new Set()
        return arr.filter(cat => {
          const id = cat.planId ?? cat.key
          if (!id) return true
          if (seen.has(id)) return false
          seen.add(id)
          return true
        })
      }
      const dedupeByLabel = (arr) => {
        const picked = new Map()
        for (const cat of arr) {
          const label = cat.label || ''
          if (!picked.has(label)) {
            picked.set(label, cat)
          } else {
            const existing = picked.get(label)
            if (!existing.planId && cat.planId) {
              picked.set(label, cat)
            }
          }
        }
        return Array.from(picked.values())
      }

      const normalized = learningPlanCategories.map(normalize)
      const idDeduped = dedupeById(normalized)
      const fullyDeduped = dedupeByLabel(idDeduped)
      setCategories([...existingCategories, ...fullyDeduped])
      // 回写规范化后的去重结果，清理历史重复项
      localStorage.setItem('calendar-categories', JSON.stringify(fullyDeduped))
    }

    return () => {
      window.removeEventListener('calendarCategoriesChanged', handleCategoriesChanged);
    };
  }, []);

  // 保存分类到localStorage
  React.useEffect(() => {
    const learningPlanCategories = categories.filter(cat => cat.type === 'learning-plan');
    if (learningPlanCategories.length > 0) {
      // 保存前双重去重，避免历史重复项继续累积
      const dedupeById = (arr) => {
        const seen = new Set()
        return arr.filter(cat => {
          const id = cat.planId ?? cat.key
          if (!id) return true
          if (seen.has(id)) return false
          seen.add(id)
          return true
        })
      }
      const dedupeByLabel = (arr) => {
        const picked = new Map()
        for (const cat of arr) {
          const label = cat.label || ''
          if (!picked.has(label)) {
            picked.set(label, cat)
          } else {
            const existing = picked.get(label)
            if (!existing.planId && cat.planId) {
              picked.set(label, cat)
            }
          }
        }
        return Array.from(picked.values())
      }
      const idDeduped = dedupeById(learningPlanCategories)
      const fullyDeduped = dedupeByLabel(idDeduped)
      localStorage.setItem('calendar-categories', JSON.stringify(fullyDeduped))
    }
  }, [categories]);

  // 新增：响应外部“打开成员日历”事件，切换到日视图并仅显示“新教师教学方法培训”
  React.useEffect(() => {
    const handleOpenMemberCalendar = (e) => {
      // 切换到日视图
      setCalendarView('day')
      // 仅勾选“新教师教学方法培训”类型
      setCategories(prev => prev.map(cat => ({
        ...cat,
        checked: cat.key === 'new_teacher_methods_training'
      })))
      // 优先定位到最近的“新教师教学方法培训”事件日期（若无则今天）
      const todayStr = dayjs().format('YYYY-MM-DD')
      const upcoming = eventList
        .filter(ev => ev.type === 'new_teacher_methods_training' && ev.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date))
      const next = upcoming[0]
      if (next) {
        setSelectedDate(dayjs(next.date))
        setCurrentMonth(dayjs(next.date))
      } else {
        setSelectedDate(dayjs())
        setCurrentMonth(dayjs())
      }
    }
    window.addEventListener('openMemberCalendar', handleOpenMemberCalendar)
    return () => {
      window.removeEventListener('openMemberCalendar', handleOpenMemberCalendar)
    }
  }, [eventList])

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
          <div className="events">
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
                  <div className="event-content">
                    <span className={`event-dot event-${item.color}`}></span>
                    <span className="event-title">{item.title}</span>
                  </div>
                </DraggableEvent>
              )
            })}
          </div>
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

  // 全选/取消全选控件逻辑
  const toggleAllCategories = (checked) => {
    setCategories(prev => prev.map(cat => ({ ...cat, checked })))
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
    // 点击日期时自动切换到日视图
    setCalendarView('day')
    message.info(`已切换到 ${value.format('YYYY年MM月DD日')} 的日视图`)
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
                    {filteredEvents
                      .filter(event => {
                        if (!event.startTime) return false
                        const eventHour = parseInt(String(event.startTime).split(':')[0], 10)
                        return eventHour === hour
                      })
                      .map(event => (
                        <DraggableEvent key={event.id} event={event} className={`week-event event-${event.color}`}>
                          <div>
                            <span className="event-time">{event.startTime}</span>
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

  // 渲染简洁版日视图
  const renderSimpleDayView = () => {
    const dayEvents = getListData(selectedDate)
    const activeCategories = categories.filter(cat => cat.checked).map(cat => cat.key)
    const filteredEvents = dayEvents.filter(item => activeCategories.includes(item.type))
    
    // 分组事件：全天事件和定时事件
    const allDayEvents = filteredEvents.filter(event => !event.startTime)
    const timedEvents = filteredEvents.filter(event => event.startTime)
    
    return (
      <div className="simple-day-view" style={{ height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        {/* 日视图头部 */}
        <div style={{ 
          padding: '16px 20px',
          borderBottom: '1px solid #f0f0f0',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#0369a1', marginBottom: '4px' }}>
              {selectedDate.format('YYYY年MM月DD日 dddd')}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              {filteredEvents.length > 0 ? `共有 ${filteredEvents.length} 个事件` : '今日无事件安排'}
            </div>
          </div>
          <Button 
            type="text"
            onClick={() => setCalendarView('month')}
            style={{ color: '#0369a1' }}
          >
            返回月视图
          </Button>
        </div>

        <div style={{ padding: '16px', height: 'calc(100% - 80px)', overflow: 'auto' }}>
          {/* 全天事件 */}
          {allDayEvents.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>📅</span>
                全天事件
              </div>
              {allDayEvents.map((event, index) => (
                <div
                  key={event.id}
                  style={{
                    background: `linear-gradient(135deg, ${categories.find(cat => cat.key === event.type)?.color}15 0%, ${categories.find(cat => cat.key === event.type)?.color}08 100%)`,
                    border: `1px solid ${categories.find(cat => cat.key === event.type)?.color}30`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '8px',
                    borderLeft: `4px solid ${categories.find(cat => cat.key === event.type)?.color}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {categories.find(cat => cat.key === event.type)?.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 定时事件 */}
          {timedEvents.length > 0 && (
            <div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>⏰</span>
                定时事件
              </div>
              {timedEvents
                .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'))
                .map((event, index) => (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: index < timedEvents.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}
                >
                  <div style={{
                    minWidth: '80px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textAlign: 'right',
                    paddingTop: '2px'
                  }}>
                    {event.startTime}
                    {event.endTime && (
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        - {event.endTime}
                      </div>
                    )}
                  </div>
                  <div style={{
                    flex: 1,
                    background: `linear-gradient(135deg, ${categories.find(cat => cat.key === event.type)?.color}10 0%, ${categories.find(cat => cat.key === event.type)?.color}05 100%)`,
                    border: `1px solid ${categories.find(cat => cat.key === event.type)?.color}20`,
                    borderRadius: '6px',
                    padding: '10px 12px',
                    borderLeft: `3px solid ${categories.find(cat => cat.key === event.type)?.color}`
                  }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                      {event.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {categories.find(cat => cat.key === event.type)?.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 无事件时的显示 */}
          {filteredEvents.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#9ca3af'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
              <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                今日暂无事件安排
              </div>
              <div style={{ fontSize: '14px' }}>
                享受一个轻松的一天吧！
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-center">
      {/* 顶部工具栏 */}
      <div className="calendar-header">
        
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
          <div className="right-actions">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateEvent}>
              创建日程
            </Button>
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
            <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox
                checked={categories.length > 0 && categories.every(cat => cat.checked)}
                indeterminate={!(categories.length > 0 && categories.every(cat => cat.checked)) && categories.some(cat => cat.checked)}
                onChange={(e) => toggleAllCategories(e.target.checked)}
                title="全选/取消全选"
              >
                全选
              </Checkbox>
              <span>我的日历</span>
            </div>
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
            {calendarView === 'day' && renderSimpleDayView()}
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