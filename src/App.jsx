import React, { useState, useEffect } from 'react'
import { Layout } from 'antd'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import UnifiedAICenter from './components/UnifiedAICenter'
import AssessmentCenter from './components/AssessmentCenter'
import DownloadCenter from './components/DownloadCenter'
import DocsCenter from './components/DocsCenter'
import LessonObservation from './components/LessonObservation'
import MeetingCenter from './components/MeetingCenter'
import MessageCenter from './components/MessageCenter'
import CalendarCenter from './components/CalendarCenter'
import AppCenter from './components/AppCenter'
import LearningAnalytics from './components/LearningAnalytics'
import HomeworkCenter from './components/HomeworkCenter'
import CourseManagement from './components/CourseManagement'
import ClassManagement from './components/ClassManagement'
import StudentManagement from './components/StudentManagement'
import SimulationCenter from './components/SimulationCenter'
import ResourceLibrary from './components/ResourceLibrary'

import MentalHealthCoach from './components/MentalHealthCoach'
import MyProgress from './components/MyProgress'

import ScenarioLibrary from './components/ScenarioLibrary'
import MentalHealthCoaching from './components/MentalHealthCoaching'
import ScienceDemo from './components/ScienceDemo'

import MyEvaluation from './components/MyEvaluation'
import SimulationPlatform from './components/SimulationPlatform'

import LearningAnalyticsCenter from './components/LearningAnalyticsCenter'
import SmartNotes from './components/SmartNotes'
import NoteEditPage from './components/NoteEditPage'
import TrainingNeeds from './components/TrainingNeeds'
import NeedEditPage from './components/NeedEditPage'
import ResourceAnnotation from './components/ResourceAnnotation'
import ResourceAnnotationPage from './components/ResourceAnnotationPage'
import StudentAnnotationPage from './components/StudentAnnotationPage'
import CourseSelection from './components/CourseSelection'
import CourseSelectionEditPage from './components/CourseSelectionEditPage'

import './App.css'

const { Header: AntHeader, Sider, Content } = Layout

function App() {
  const [currentView, setCurrentView] = useState('home') // 'home', 'chat', 'image', 'search', etc.
  const [messages, setMessages] = useState([])
  
  // 页面状态管理
  const [pageState, setPageState] = useState({
    selectedNote: null,
    selectedNeed: null,
    editorMode: 'create' // 'create', 'edit', 'view'
  })
  
  // 调试信息
  useEffect(() => {
    console.log('Current view changed to:', currentView)
  }, [currentView])
  
  // 监听URL哈希变化
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // 去掉 # 号
      if (hash) {
        setCurrentView(hash);
      }
    };
    
    // 初始化时检查哈希
    handleHashChange();
    
    // 监听哈希变化
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  // 监听来自iframe的postMessage事件
  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Received postMessage:', event.data)
      if (event.data && event.data.type === 'NAVIGATE_TO_EVALUATION') {
        console.log('Navigating to my-evaluation')
        setCurrentView('my-evaluation')
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])
  
  // 消息中心联系人数据
  const [contacts] = useState([
    {
      id: 'system',
      name: '系统消息',
      type: 'system',
      avatar: '⚙️',
      lastMessage: '系统将于今晚22:00-24:00进行维护升级',
      lastTime: '2024-01-15 10:00',
      unreadCount: 2,
      online: true
    },
    {
      id: 'user1',
      name: '张老师',
      type: 'user',
      avatar: '👨‍🏫',
      lastMessage: '明天的教研会议资料准备好了吗？',
      lastTime: '2024-01-15 14:30',
      unreadCount: 1,
      online: true
    },
    {
      id: 'user2',
      name: '李主任',
      type: 'user',
      avatar: '👩‍💼',
      lastMessage: '课程大纲已经审核通过',
      lastTime: '2024-01-15 09:15',
      unreadCount: 0,
      online: false
    },
    {
      id: 'user3',
      name: '王同事',
      type: 'user',
      avatar: '👨‍💻',
      lastMessage: '文档评论已回复，请查看',
      lastTime: '2024-01-14 16:45',
      unreadCount: 3,
      online: true
    },
    {
      id: 'group1',
      name: '教研组群',
      type: 'group',
      avatar: '👥',
      lastMessage: '下周教学计划讨论',
      lastTime: '2024-01-14 15:20',
      unreadCount: 5,
      online: true
    }
  ])
  
  // 下载中心数据
  const [downloads] = useState([
    {
      id: 1,
      name: 'AI模型训练数据集.zip',
      size: '2.5 GB',
      progress: 100,
      status: 'completed',
      type: 'dataset',
      downloadTime: '2024-01-15 14:30'
    },
    {
      id: 2,
      name: '机器学习算法文档.pdf',
      size: '15.2 MB',
      progress: 75,
      status: 'downloading',
      type: 'document',
      downloadTime: '2024-01-15 15:45'
    },
    {
      id: 3,
      name: 'Python代码示例.zip',
      size: '8.7 MB',
      progress: 0,
      status: 'paused',
      type: 'code',
      downloadTime: '2024-01-15 16:20'
    },
    {
      id: 4,
      name: '深度学习模型.h5',
      size: '156 MB',
      progress: 100,
      status: 'completed',
      type: 'model',
      downloadTime: '2024-01-14 09:15'
    }
  ])
  
  // 计算实际的未读消息数量
  const unreadMessageCount = contacts.reduce((total, contact) => total + contact.unreadCount, 0)
  
  // 计算实际的下载中任务数量
  const downloadingCount = downloads.filter(d => d.status === 'downloading').length

  const handleViewChange = (view, data = null) => {
    console.log('View change requested:', view, data)
    
    // 处理页面状态
    if (data) {
      setPageState(prev => ({
        ...prev,
        ...data
      }))
    }
    
    setCurrentView(view)
    
    // 更新URL哈希
    if (view !== 'home') {
      window.location.hash = view
    } else {
      window.location.hash = ''
    }
  }

  const handleSendMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: `我收到了您的消息："${message}"。作为AI助手，我可以帮您处理各种任务，包括写作、搜索、编程、翻译等。请告诉我您需要什么帮助？`,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  // 处理应用添加到菜单
  const handleAddAppToMenu = (app) => {
    if (window.addAppToMenu) {
      window.addAppToMenu(app)
    }
  }

  // 处理应用从菜单移除
  const handleRemoveAppFromMenu = (appId) => {
    if (window.removeAppFromMenu) {
      window.removeAppFromMenu(appId)
    }
  }

  return (
    <Layout className="app" style={{ height: '100vh' }}>
      <AntHeader 
        style={{ 
          padding: 0, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          height: '64px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Header 
          currentView={currentView}
        />
      </AntHeader>
      
      <Layout style={{ height: 'calc(100vh - 64px)' }}>
        <Sider 
          width="auto"
          style={{
            background: 'var(--theme-cardBackground)',
            backdropFilter: 'blur(10px)',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            height: '100%',
            overflow: 'auto',
            flex: '0 0 auto'
          }}
          theme="light"
        >
          <Sidebar 
            onViewChange={handleViewChange}
            currentView={currentView}
            unreadMessageCount={unreadMessageCount}
            downloadingCount={downloadingCount}
            onAddApp={handleAddAppToMenu}
            onRemoveApp={handleRemoveAppFromMenu}
          />
        </Sider>
        
        <Layout style={{ height: '100%' }}>
          <Content 
            style={{
              margin: '16px',
              padding: '0',
              background: 'var(--theme-cardBackground)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              height: 'calc(100% - 32px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {(currentView === 'chat' || currentView === 'ai-assistant') ? (
              <UnifiedAICenter />
            ) : currentView === 'assessment-center' ? (
              <AssessmentCenter />
            ) : currentView === 'message-center' ? (
              <MessageCenter contacts={contacts} />
            ) : currentView === 'calendar-center' ? (
              <CalendarCenter />
            ) : currentView === 'download-center' ? (
              <DownloadCenter downloads={downloads} />
            ) : currentView === 'docs-center' ? (
              <DocsCenter />
            ) : currentView === 'lesson-observation' ? (
              <LessonObservation />
            ) : currentView === 'meeting-center' ? (
              <MeetingCenter />
            ) : currentView === 'app-center' ? (
              <AppCenter 
                onAddToMenu={handleAddAppToMenu}
                onRemoveFromMenu={handleRemoveAppFromMenu}
              />
            ) : currentView === 'learning-analytics' ? (
              <LearningAnalytics />
            ) : currentView === 'homework-center' ? (
              <HomeworkCenter />
            ) : currentView === 'learning-analytics-center' ? (
              <LearningAnalyticsCenter />
            ) : currentView === 'course-management' ? (
              <CourseManagement />
            ) : currentView === 'class-management' ? (
              <ClassManagement />
            ) : currentView === 'student-management' ? (
              <StudentManagement />
            ) : currentView === 'simulation-center' ? (
              <SimulationCenter />
            ) : currentView === 'resource-library' ? (
              <ResourceLibrary />
            ) : currentView === 'mental-health-coach' ? (
              <MentalHealthCoach onNavigate={setCurrentView} />
            ) : currentView === 'my-progress' ? (
              <MyProgress />
            ) : currentView === 'scenario-library' ? (
              <ScenarioLibrary onViewChange={handleViewChange} />
            ) : currentView === 'mental-health-coaching' ? (
              <MentalHealthCoaching onBack={handleViewChange} />
            ) : currentView === 'science-demo' ? (
              <ScienceDemo onNavigate={setCurrentView} />
            ) : currentView === 'my-evaluation' ? (
              <MyEvaluation onBack={() => setCurrentView('home')} />
            ) : currentView === 'simulation-platform' ? (
              <SimulationPlatform onViewChange={handleViewChange} />
            ) : currentView === 'smart-notes' ? (
              <SmartNotes onViewChange={handleViewChange} />
            ) : currentView === 'note-edit-page' ? (
              <NoteEditPage 
                onBack={() => handleViewChange('smart-notes')}
                onViewChange={handleViewChange}
              />
            ) : currentView === 'training-needs' ? (
              <TrainingNeeds 
                onViewChange={handleViewChange}
                pageState={pageState}
              />
            ) : currentView === 'resource-annotation' ? (
              <ResourceAnnotationPage 
                onBack={() => handleViewChange('home')}
                onViewChange={handleViewChange}
                selectedNeed={pageState.selectedNeed}
                mode={pageState.editorMode}
              />
            ) : currentView === 'student-annotation' ? (
              <StudentAnnotationPage 
                onBack={() => handleViewChange('home')}
                onViewChange={handleViewChange}
                selectedNeed={pageState.selectedNeed}
                mode={pageState.editorMode}
              />
            ) : currentView === 'course-selection' ? (
              <CourseSelection 
                onViewChange={handleViewChange}
                pageState={pageState}
              />
            ) : currentView === 'need-edit-page' ? (
              <NeedEditPage 
                onBack={() => handleViewChange('training-needs')}
                onViewChange={handleViewChange}
                selectedNeed={pageState.selectedNeed}
                mode={pageState.editorMode}
              />
            ) : currentView === 'course-selection-edit-page' ? (
              <CourseSelectionEditPage 
                onBack={() => handleViewChange('course-selection')}
                onViewChange={handleViewChange}
                selectedNeed={pageState.selectedNeed}
                mode={pageState.editorMode}
              />
            ) : (
              <MainContent 
                currentView={currentView}
                onViewChange={handleViewChange}
                onStartChat={() => setCurrentView('ai-assistant')}
              />
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App