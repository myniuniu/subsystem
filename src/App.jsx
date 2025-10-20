import React, { useState, useEffect } from 'react'
import { Layout } from 'antd'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import UnifiedAICenter from './components/UnifiedAICenter'
import AssessmentCenter from './components/AssessmentCenter'
import DownloadCenter from './components/DownloadCenter'
import DocsCenter from './components/DocsCenter'
import AdminCenter from './components/AdminCenter'
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
// import TrainingNeeds from './components/TrainingNeeds'
import MentalHealthCoach from './components/MentalHealthCoach'
import MyProgress from './components/MyProgress'
// import CourseSelection from './components/CourseSelection'
import ScenarioLibrary from './components/ScenarioLibrary'
import MyMedals from './components/MyMedals'
import MentalHealthCoaching from './components/MentalHealthCoaching'
import ScienceDemo from './components/ScienceDemo'
// import CourseSelectionEditPage from './components/CourseSelectionEditPage'
import MyEvaluation from './components/MyEvaluation'
import SimulationPlatform from './components/SimulationPlatform'
// import NeedEditPage from './components/NeedEditPage'
import LearningAnalyticsCenter from './components/LearningAnalyticsCenter'
import SmartNotes from './components/SmartNotes'
import AIToolHouse from './components/AIToolHouse'
import NoteEditPage from './components/NoteEditPage'
import ResourceAnnotation from './components/ResourceAnnotation'
import ResourceAnnotationPage from './components/ResourceAnnotationPage'
import StudentAnnotationPage from './components/StudentAnnotationPage'
import LearningSquare from './components/LearningSquare'
import ProgressTestPage from './components/ProgressTestPage'
import ThemeTemplateCenter from './components/ThemeTemplateCenter'
import AIExperience from './components/AIExperience'
import PWAInstallButton from './components/PWAInstallButton'
import ModelRegistry from './components/ModelRegistry'
import ModelTrainingTemplate from './components/ModelTrainingTemplate'
import ModelTrainingDetail from './components/ModelTrainingDetail'

import './App.css'
import notesService from './services/notesService'
import { generateTrainingProductDevelopmentData } from './data/trainingProductDevelopmentData'

const { Sider, Content } = Layout

function App() {
  const [currentView, setCurrentView] = useState('smart-notes') // 'home', 'chat', 'image', 'search', etc.
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
  const getTrainingProductDevelopmentTopicContacts = () => {
    const allNotes = notesService.getAllNotes() || [];
    const tpNotes = allNotes.filter(n => n.category === 'training_product_development');
    const sourceNotes = tpNotes.length > 0 ? tpNotes : (generateTrainingProductDevelopmentData() || []);
    const extractBaseTitle = (title) => {
      const noBracket = title.replace(/^【[^】]*】/, '');
      const base = noBracket.split(' - ')[0].trim();
      return base || noBracket.trim();
    };
    const uniqueTitles = Array.from(new Set(sourceNotes.map(n => extractBaseTitle(n.title))));
    const now = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    return uniqueTitles.slice(0, 8).map((t, idx) => ({
      id: `tpd_topic_${idx + 1}`,
      name: t,
      type: 'topic',
      avatar: '🚀',
      lastMessage: '进入主题讨论',
      lastTime: now,
      unreadCount: 0,
      online: true
    }));
  };

  const defaultContacts = [
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
    },
    {
      id: 'new_teacher_training',
      name: '新教师教学方法培训',
      type: 'group',
      avatar: '🎓',
      lastMessage: '欢迎加入培训群，请先查看公告与日程',
      lastTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      unreadCount: 8,
      online: true
    }
  ];

  const [contacts] = useState(defaultContacts)
  
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

  // 处理AI工具添加到操作面板
  const handleAddAIToolToOperationPanel = (toolConfig) => {
    // 这里可以实现将AI工具添加到操作面板的逻辑
    // 目前只是保存到localStorage，由OperationPanel组件读取
    console.log('Adding AI tool to operation panel:', toolConfig)
  }

  return (
    <Layout className="app" style={{ height: '100vh', background: currentView === 'admin-center' ? '#f5f7fa' : undefined }}>
      <Layout style={{ height: '100vh' }}>
        {currentView !== 'admin-center' && (
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
        )}
        
        <Layout style={{ height: '100%' }}>
          <Content 
            style={{
              margin: '0', // 移除margin，让内容区域完全填满
              padding: '0',
              background: currentView === 'admin-center' ? 'transparent' : 'var(--theme-cardBackground)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0', // 移除圆角，让内容区域完全贴合
              boxShadow: 'none', // 移除阴影
              height: '100%', // 改为100%，完全填满父容器
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
            ) : currentView === 'model-training-template' ? (
              <ModelTrainingTemplate />
            ) : currentView === 'model-training-detail' ? (
              <ModelTrainingDetail />
            ) : currentView === 'ai-experience' ? (
              <AIExperience />
            ) : currentView === 'model-registry' ? (
              <ModelRegistry />
            ) : currentView === 'smart-notes' ? (
              <SmartNotes onViewChange={handleViewChange} />
            ) : currentView === 'my-medals' ? (
              <MyMedals />
            ) : currentView === 'ai-tool-house' ? (
              <AIToolHouse onAddToOperationPanel={handleAddAIToolToOperationPanel} />
            ) : currentView === 'note-edit-page' ? (
              <NoteEditPage 
                onBack={() => handleViewChange('smart-notes')}
                onViewChange={handleViewChange}
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

            ) : currentView === 'learning-square' ? (
              <LearningSquare />
            ) : currentView === 'progress-test' ? (
              <ProgressTestPage />
            ) : currentView === 'theme-template-center' ? (
              <ThemeTemplateCenter onBack={() => handleViewChange('home')} />
            ) : currentView === 'admin-center' ? (
              <AdminCenter />
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
      
      {/* PWA安装按钮 */}
      <PWAInstallButton />
    </Layout>
  )
}

export default App