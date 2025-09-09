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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Grid,
  Users,
  BarChart3,
  BookOpen,
  School,
  UserCheck,
  ExternalLink
} from 'lucide-react'
import './Sidebar.css'

// 可拖拽的菜单项组件
// 可拖拽的子菜单项组件
const SortableSubMenuItem = ({ child, isActive, unreadCount, downloadingCount, onClick, parentId, onReorderChildren }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${parentId}-${child.id}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const ChildIcon = child.icon
  const isChildActive = isActive === child.id

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`submenu-item ${isChildActive ? 'active' : ''}`}
        onClick={() => onClick(child.id)}
      >
        <div 
          className="drag-area"
          {...attributes}
          {...listeners}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        />
        <div className="submenu-item-content">
          <div className="submenu-item-icon">
            <div
              className="icon-wrapper"
              style={{
                backgroundColor: isChildActive ? 'transparent' : 'rgba(0, 0, 0, 0.06)',
              }}
            >
              {ChildIcon && React.createElement(ChildIcon, {
                size: 16,
                color: isChildActive ? '#fff' : child.color
              })}
            </div>
          </div>
          <span
            className="submenu-item-label"
            style={{
              fontWeight: isChildActive ? 600 : 400,
              color: isChildActive ? 'white' : 'var(--theme-textSecondary)',
            }}
          >
            {child.label}
          </span>
          {child.id === 'message-center' && unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
          {child.id === 'download-center' && downloadingCount > 0 && (
            <span className="unread-badge">{downloadingCount}</span>
          )}
        </div>
      </div>
    </div>
  )
}

const SortableMenuItem = ({ item, isActive, unreadCount, downloadingCount, onClick, isCollapsed, onRemove, isDynamic, onToggleExpand, onReorderChildren }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  // 为子菜单拖拽准备sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

  const handleClick = (e) => {
    if (item.type === 'group') {
      e.stopPropagation()
      onToggleExpand(item.id)
    } else {
      onClick(item.id)
    }
  }

  const handleChildClick = (childId) => {
    // 查找子菜单项
    const childItem = item.children && item.children.find(child => child.id === childId)
    
    // 如果是外部链接类型，在新窗口打开
    if (childItem && childItem.type === 'external' && childItem.url) {
      window.open(childItem.url, '_blank')
      return
    }
    
    // 否则正常处理
    onClick(childId)
  }

  // 检查子菜单中是否有激活项
  const hasActiveChild = item.children && item.children.some(child => isActive === child.id)
  const isGroupActive = item.type === 'single' ? isActive === item.id : (isActive === item.id || hasActiveChild)

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`menu-item ${item.type === 'group' ? 'menu-group' : ''} ${isGroupActive ? 'active' : ''}`}
        onClick={handleClick}
      >
        <div 
           className="drag-area"
           {...attributes}
           {...listeners}
           style={{ 
             cursor: isDragging ? 'grabbing' : 'grab'
           }}
         />
        <div className="menu-item-content">
          <div className="menu-item-icon">
            <div
              className="icon-wrapper"
              style={{
                backgroundColor: isGroupActive ? 'transparent' : 'rgba(0, 0, 0, 0.06)',
              }}
            >
              {Icon && React.createElement(Icon, {
                size: 18,
                color: isGroupActive ? '#fff' : item.color
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
                  fontWeight: isGroupActive ? 600 : 400,
                  color: isGroupActive ? 'white' : 'var(--theme-textSecondary)',
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
              {item.type === 'group' && (
                <ChevronDown 
                  size={16} 
                  className={`expand-icon ${item.expanded ? 'expanded' : ''}`}
                  style={{ color: isGroupActive ? 'white' : 'var(--theme-textSecondary)' }}
                />
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
      </div>
      
      {/* 子菜单 */}
      {item.type === 'group' && item.expanded && !isCollapsed && item.children && (
        <div className="submenu">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event
              if (over && active.id !== over.id) {
                const activeId = active.id.replace(`${item.id}-`, '')
                const overId = over.id.replace(`${item.id}-`, '')
                onReorderChildren(item.id, activeId, overId)
              }
            }}
          >
            <SortableContext 
              items={item.children.map(child => `${item.id}-${child.id}`)} 
              strategy={verticalListSortingStrategy}
            >
              {item.children.map((child) => (
                <SortableSubMenuItem
                  key={child.id}
                  child={child}
                  isActive={isActive}
                  unreadCount={unreadCount}
                  downloadingCount={downloadingCount}
                  onClick={handleChildClick}
                  parentId={item.id}
                  onReorderChildren={onReorderChildren}
                />
              ))}
            </SortableContext>
          </DndContext>
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

  // 2级菜单数据结构
  const defaultMenuItems = [
    { 
      id: 'home', 
      icon: Home, 
      label: '个人工作台', 
      color: '#667eea',
      type: 'single' // 单级菜单
    },
    { 
      id: 'ai-assistant', 
      icon: Bot, 
      label: 'AI智能中心', 
      color: '#667eea',
      type: 'single'
    },
    {
      id: 'teaching-management',
      icon: BookOpen,
      label: '教学管理',
      color: '#1890ff',
      type: 'group', // 分组菜单
      expanded: false, // 是否展开
      children: [
        { id: 'course-management', icon: BookOpen, label: '课程管理', color: '#1890ff' },
        { id: 'class-management', icon: School, label: '班级管理', color: '#52c41a' },
        { id: 'student-management', icon: UserCheck, label: '学生管理', color: '#722ed1' },
        { id: 'homework-center', icon: BookMarked, label: '作业管理中心', color: '#13c2c2' }
      ]
    },
    {
      id: 'analytics-assessment',
      icon: BarChart3,
      label: '分析评测',
      color: '#52c41a',
      type: 'group',
      expanded: false,
      children: [
        { id: 'learning-analytics-center', icon: BarChart3, label: '学情分析中心', color: '#52c41a' },
        { id: 'assessment-center', icon: BarChart3, label: '能力测评中心', color: '#722ed1' }
      ]
    },
    { 
      id: 'message-center', 
      icon: MessageSquare, 
      label: '消息中心', 
      color: '#f39c12',
      type: 'single'
    },
    { 
      id: 'meeting-center', 
      icon: Video, 
      label: '会议中心', 
      color: '#e74c3c',
      type: 'single'
    },
    { 
      id: 'lesson-observation', 
      icon: Eye, 
      label: '听课评课', 
      color: '#e74c3c',
      type: 'single'
    },
    { 
      id: 'docs-center', 
      icon: FileText, 
      label: '文档中心', 
      color: '#a18cd1',
      type: 'single'
    },
    { 
      id: 'download-center', 
      icon: Download, 
      label: '下载中心', 
      color: '#ff9a9e',
      type: 'single'
    },
    { 
      id: 'calendar-center', 
      icon: Calendar, 
      label: '日历中心', 
      color: '#52c41a',
      type: 'single'
    },
    { 
      id: 'app-center', 
      icon: Grid, 
      label: '应用中心', 
      color: '#1890ff',
      type: 'single'
    }
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

  // 菜单展开状态管理
  const [menuExpandState, setMenuExpandState] = useState(() => {
    const saved = localStorage.getItem('menu-expand-state')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return {}
      }
    }
    return {}
  })

  // 合并默认菜单项和动态应用，并应用展开状态和子菜单排序
  const [menuItems, setMenuItems] = useState(() => {
    const itemsWithState = defaultMenuItems.map(item => ({
      ...item,
      expanded: item.type === 'group' ? (menuExpandState[item.id] || false) : undefined
    }))
    const allMenuItems = [...itemsWithState, ...dynamicApps]
    
    // 应用保存的子菜单排序
    const savedChildrenOrder = localStorage.getItem('submenu-order')
    let itemsWithChildrenOrder = allMenuItems
    if (savedChildrenOrder) {
      try {
        const childrenOrder = JSON.parse(savedChildrenOrder)
        itemsWithChildrenOrder = allMenuItems.map(item => {
          if (item.children && childrenOrder[item.id]) {
            const orderedChildren = childrenOrder[item.id].map(childId => 
              item.children.find(child => child.id === childId)
            ).filter(Boolean)
            // 添加任何新的子菜单项（不在保存的顺序中的）
            const newChildren = item.children.filter(child => 
              !childrenOrder[item.id].includes(child.id)
            )
            return { ...item, children: [...orderedChildren, ...newChildren] }
          }
          return item
        })
      } catch (e) {
        itemsWithChildrenOrder = allMenuItems
      }
    }
    
    const saved = localStorage.getItem('sidebar-menu-order')
    if (saved) {
      try {
        const savedOrder = JSON.parse(saved)
        const orderedItems = savedOrder.map(id => {
          const item = itemsWithChildrenOrder.find(item => item.id === id)
          return item
        }).filter(Boolean)
        return orderedItems
      } catch (e) {
        return itemsWithChildrenOrder
      }
    }
    return itemsWithChildrenOrder
  })

  // 切换菜单组展开/收缩状态
  const toggleMenuExpand = (groupId) => {
    const newExpandState = {
      ...menuExpandState,
      [groupId]: !menuExpandState[groupId]
    }
    setMenuExpandState(newExpandState)
    localStorage.setItem('menu-expand-state', JSON.stringify(newExpandState))
    
    // 更新菜单项的展开状态
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === groupId 
          ? { ...item, expanded: newExpandState[groupId] }
          : item
      )
    )
  }

  // 子菜单重排序处理函数
  const handleReorderChildren = (parentId, activeChildId, overChildId) => {
    setMenuItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.id === parentId && item.children) {
          const oldIndex = item.children.findIndex(child => child.id === activeChildId)
          const newIndex = item.children.findIndex(child => child.id === overChildId)
          const newChildren = arrayMove(item.children, oldIndex, newIndex)
          return { ...item, children: newChildren }
        }
        return item
      })
      
      // 保存子菜单排序到本地存储
      const childrenOrder = {}
      newItems.forEach(item => {
        if (item.children) {
          childrenOrder[item.id] = item.children.map(child => child.id)
        }
      })
      localStorage.setItem('submenu-order', JSON.stringify(childrenOrder))
      
      return newItems
    })
  }

  // 当动态应用变化时更新菜单项
  React.useEffect(() => {
    const itemsWithState = defaultMenuItems.map(item => ({
      ...item,
      expanded: item.type === 'group' ? (menuExpandState[item.id] || false) : undefined
    }))
    const allMenuItems = [...itemsWithState, ...dynamicApps]
    setMenuItems(allMenuItems)
  }, [dynamicApps, menuExpandState])

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

    if (over && active.id !== over.id) {
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
    // 查找菜单项
    const menuItem = menuItems.find(item => item.id === itemId)
    
    // 如果是外部链接类型，在新窗口打开
    if (menuItem && menuItem.type === 'external' && menuItem.url) {
      window.open(menuItem.url, '_blank')
      return
    }
    
    // 否则正常处理视图切换
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
                  isActive={currentView}
                  unreadCount={item.id === 'message-center' ? unreadMessageCount : 0}
                  downloadingCount={item.id === 'download-center' ? downloadingCount : 0}
                  onClick={handleItemClick}
                  isCollapsed={isCollapsed}
                  onRemove={removeDynamicApp}
                  isDynamic={isDynamic}
                  onToggleExpand={toggleMenuExpand}
                  onReorderChildren={handleReorderChildren}
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