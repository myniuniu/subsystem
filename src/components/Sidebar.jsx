import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  Home, 
  Download,
  FileText,
  Bot,
  Eye,
  BookMarked,
  Video,
  MessageSquare,
  Calendar,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Grid,
  Users,
  BarChart3
} from 'lucide-react'
import './Sidebar.css'

// 可拖拽的菜单项组件
const SortableMenuItem = ({ item, isActive, unreadCount, downloadingCount, onClick, isCollapsed, onRemove, isDynamic }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Icon = item.icon

  const handleRemove = (e) => {
    e.stopPropagation()
    if (onRemove && isDynamic) {
      Modal.confirm({
        title: '确认移除应用',
        content: `确定要从菜单中移除「${item.label}」吗？`,
        okText: '确认移除',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          onRemove(item.id)
        },
      })
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={() => onClick(item.id)}
    >
      <div className="menu-item-content">
        <div className="menu-item-icon">
          <div
            className="icon-wrapper"
            style={{
              backgroundColor: isActive ? 'transparent' : 'rgba(0, 0, 0, 0.06)',
            }}
          >
            {Icon && React.createElement(Icon, {
              size: 18,
              color: isActive ? '#fff' : item.color
            })}
          </div>
          {isCollapsed && item.id === 'message-center' && unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
          {isCollapsed && item.id === 'download-center' && downloadingCount > 0 && (
            <span className="unread-badge">{downloadingCount}</span>
          )}
        </div>
        {!isCollapsed && (
          <>
            <span
              className="menu-item-label"
              style={{
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'white' : 'var(--theme-textSecondary)',
              }}
            >
              {item.label}
            </span>
            {item.id === 'message-center' && unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
            {item.id === 'download-center' && downloadingCount > 0 && (
              <span className="unread-badge">{downloadingCount}</span>
            )}
            {isDynamic && (
              <button 
                className="remove-button"
                onClick={handleRemove}
                title="移除应用"
              >
                ×
              </button>
            )}
          </>
        )}
      </div>
      {!isCollapsed ? (
        <div className="drag-handle" {...attributes} {...listeners}>
          <GripVertical size={16} color="#ccc" />
        </div>
      ) : (
        <div className="drag-handle-collapsed" {...attributes} {...listeners}>
          <div className="drag-indicator"></div>
        </div>
      )}
    </div>
  )
}

const Sidebar = ({ onViewChange, currentView, unreadMessageCount = 0, downloadingCount = 0, onAddApp, onRemoveApp }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })

  // 动态应用菜单项
  const [dynamicApps, setDynamicApps] = useState(() => {
    const saved = localStorage.getItem('dynamic-menu-apps')
    if (saved) {
      try {
        const parsedApps = JSON.parse(saved)
        // 确保icon字段是有效的React组件
        return parsedApps.map(app => ({
          ...app,
          icon: Grid // 重新设置为Grid组件
        }))
      } catch (e) {
        return []
      }
    }
    return []
  })

  const defaultMenuItems = [
    { id: 'home', icon: Home, label: '个人工作台', color: '#667eea' },
    { id: 'ai-assistant', icon: Bot, label: 'AI智能中心', color: '#667eea' },
    { id: 'homework-center', icon: BookMarked, label: '作业管理中心', color: '#13c2c2' },
    { id: 'learning-analytics-center', icon: BarChart3, label: '学情分析中心', color: '#52c41a' },
    { id: 'assessment-center', icon: BarChart3, label: '能力测评中心', color: '#722ed1' },
    { id: 'message-center', icon: MessageSquare, label: '消息中心', color: '#f39c12' },
    { id: 'calendar-center', icon: Calendar, label: '日历中心', color: '#52c41a' },
    { id: 'docs-center', icon: FileText, label: '文档中心', color: '#a18cd1' },
    { id: 'lesson-observation', icon: Eye, label: '听课评课', color: '#e74c3c' },
    { id: 'meeting-center', icon: Video, label: '会议中心', color: '#e74c3c' },
    { id: 'download-center', icon: Download, label: '下载中心', color: '#ff9a9e' },
    { id: 'app-center', icon: Grid, label: '应用中心', color: '#1890ff' }
  ]

  // 添加动态应用到菜单
  const addDynamicApp = (app) => {
    const newApp = {
      id: app.id,
      icon: Grid, // 默认图标
      label: app.label,
      color: app.color || '#1890ff'
    }
    
    const newDynamicApps = [...dynamicApps, newApp]
    setDynamicApps(newDynamicApps)
    localStorage.setItem('dynamic-menu-apps', JSON.stringify(newDynamicApps))
    
    // 更新菜单项
    const allItems = [...defaultMenuItems, ...newDynamicApps]
    setMenuItems(allItems)
    localStorage.setItem('sidebar-menu-order', JSON.stringify(allItems.map(item => item.id)))
  }

  // 移除动态应用
  const removeDynamicApp = (appId) => {
    const newDynamicApps = dynamicApps.filter(app => app.id !== appId)
    setDynamicApps(newDynamicApps)
    localStorage.setItem('dynamic-menu-apps', JSON.stringify(newDynamicApps))
    
    // 更新菜单项
    const allItems = [...defaultMenuItems, ...newDynamicApps]
    setMenuItems(allItems)
    localStorage.setItem('sidebar-menu-order', JSON.stringify(allItems.map(item => item.id)))
    
    // 同步更新AppCenter的状态
    const currentAddedApps = JSON.parse(localStorage.getItem('added-apps') || '[]')
    const updatedAddedApps = currentAddedApps.filter(id => id !== appId)
    localStorage.setItem('added-apps', JSON.stringify(updatedAddedApps))
    
    // 触发自定义事件通知AppCenter更新
    window.dispatchEvent(new Event('menuAppsChanged'))
  }

  const [menuItems, setMenuItems] = useState(() => {
    // 合并默认菜单和动态应用
    const allMenuItems = [...defaultMenuItems, ...dynamicApps]
    
    const saved = localStorage.getItem('sidebar-menu-order')
    if (saved) {
      try {
        const savedOrder = JSON.parse(saved)
        const orderedItems = savedOrder.map(id => {
          const item = allMenuItems.find(item => item.id === id)
          return item
        }).filter(Boolean)
        return orderedItems
      } catch (e) {
        return allMenuItems
      }
    }
    return allMenuItems
  })

  // 当动态应用变化时更新菜单项
  React.useEffect(() => {
    const allMenuItems = [...defaultMenuItems, ...dynamicApps]
    setMenuItems(allMenuItems)
  }, [dynamicApps])

  // 暴露添加和移除应用的方法给父组件
  React.useEffect(() => {
    if (onAddApp) {
      window.addAppToMenu = addDynamicApp
    }
    if (onRemoveApp) {
      window.removeAppFromMenu = removeDynamicApp
    }
  }, [onAddApp, onRemoveApp])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        const newOrder = arrayMove(items, oldIndex, newIndex)
        
        // 保存到本地存储
        localStorage.setItem('sidebar-menu-order', JSON.stringify(newOrder.map(item => item.id)))
        
        return newOrder
      })
    }
  }

  const handleItemClick = (itemId) => {
    onViewChange(itemId)
  }

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed))
  }

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h4 className="sidebar-title">功能菜单</h4>}
        <button className="collapse-toggle" onClick={toggleCollapse}>
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={menuItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="menu-list">
            {menuItems.map((item) => {
              const isDynamic = dynamicApps.some(app => app.id === item.id)
              return (
                <SortableMenuItem
                  key={item.id}
                  item={item}
                  isActive={currentView === item.id}
                  unreadCount={item.id === 'message-center' ? unreadMessageCount : 0}
                  downloadingCount={item.id === 'download-center' ? downloadingCount : 0}
                  onClick={handleItemClick}
                  isCollapsed={isCollapsed}
                  onRemove={removeDynamicApp}
                  isDynamic={isDynamic}
                />
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default Sidebar