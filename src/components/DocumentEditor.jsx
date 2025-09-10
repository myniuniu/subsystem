import React, { useState, useRef, useEffect } from 'react'
import {
  Button,
  Input,
  Modal,
  Layout,
  Avatar,
  Card,
  Space,
  Typography,
  Spin,
  message,
  Tooltip,
  Badge,
  Divider
} from 'antd'
import { 
  SaveOutlined,
  CloseOutlined,
  FileTextOutlined,
  MessageOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  VideoCameraOutlined,
  TeamOutlined,
  LeftOutlined,
  CommentOutlined
} from '@ant-design/icons'
import { Bot, User, Send, X, Users, Video } from 'lucide-react'
import { createEditor, createToolbar } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import editorInstanceManager from '../utils/editorInstanceManager'
import './DocumentEditor.css'

const { Header, Content } = Layout
const { Title, Text } = Typography
const { TextArea } = Input

const DocumentEditor = ({ document, onSave, onClose, isNew = false }) => {
  const [content, setContent] = useState(document?.content || document?.markdown || '')
  const [showAIChat, setShowAIChat] = useState(false)
  const [aiMessages, setAiMessages] = useState([])
  const [aiInput, setAiInput] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [meetingTitle, setMeetingTitle] = useState('')
  const [selectedCollaborators, setSelectedCollaborators] = useState([])
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [editorLoaded, setEditorLoaded] = useState(false)
  
  const editorRef = useRef(null)
  const toolbarRef = useRef(null)
  const aiChatRef = useRef(null)
  const editorInstanceRef = useRef(null)
  const instanceIdRef = useRef(null)

  // 模拟文档协同人员数据
  const collaborators = [
    { id: 1, name: '张老师', avatar: '👨‍🏫', department: '数学组', online: true },
    { id: 2, name: '李老师', avatar: '👩‍🏫', department: '语文组', online: true },
    { id: 3, name: '王老师', avatar: '👨‍🏫', department: '英语组', online: false },
    { id: 4, name: '陈老师', avatar: '👩‍🏫', department: '物理组', online: true },
    { id: 5, name: '刘老师', avatar: '👨‍🏫', department: '化学组', online: true },
    { id: 6, name: '赵老师', avatar: '👩‍🏫', department: '生物组', online: false }
  ]

  useEffect(() => {
    if (aiChatRef.current) {
      aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight
    }
  }, [aiMessages, isAiTyping])

  // 初始化wangEditor
  useEffect(() => {
    const initEditorAsync = async () => {
      // 检查DOM元素是否存在
      if (!editorRef.current || !toolbarRef.current) {
        console.warn('编辑器DOM元素未准备就绪')
        return
      }

      // 如果已经有实例在初始化或已初始化，先清理
      if (instanceIdRef.current) {
        try {
          await editorInstanceManager.destroyEditor(instanceIdRef.current)
        } catch (e) {
          console.warn('清理旧实例失败:', e)
        }
        editorInstanceRef.current = null
        instanceIdRef.current = null
      }

      try {
        // 生成唯一实例ID
        const instanceId = `editor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        instanceIdRef.current = instanceId
        
        // 使用全局实例管理器创建编辑器
        const instance = await editorInstanceManager.createEditor({
          instanceId,
          editorContainer: editorRef.current,
          toolbarContainer: toolbarRef.current,
          initialContent: document?.content || content || '<p><br></p>',
          onChange: (html) => {
            setContent(html)
          },
          onReady: () => {
            setEditorLoaded(true)
          }
        })
        
        editorInstanceRef.current = instance
        
      } catch (error) {
        console.error('wangEditor 初始化失败:', error)
        setEditorLoaded(false)
        // 确保清理初始化状态
        if (editorRef.current) {
          editorInstanceManager.clearInitializingState(editorRef.current)
        }
      }
    }

    // 添加延迟确保DOM完全准备
     const timer = setTimeout(initEditorAsync, 100)
     
     return () => {
       clearTimeout(timer)
       if (instanceIdRef.current) {
         editorInstanceManager.destroyEditor(instanceIdRef.current)
         editorInstanceRef.current = null
         instanceIdRef.current = null
       }
     }
  }, [])

  const handleSave = () => {
    let currentContent = content
    
    // 如果编辑器已加载，从编辑器实例获取最新内容
    if (editorInstanceRef.current?.editor) {
      currentContent = editorInstanceRef.current.editor.getHtml()
    }
    
    if (!currentContent.trim() || currentContent === '<p><br></p>') {
      message.warning('请输入文档内容')
      return
    }
    
    const documentData = {
      id: document?.id || Date.now(),
      title: '文档',
      content: currentContent,
      category: 'other',
      tags: [],
      createdAt: document?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    message.success('文档保存成功')
    onSave(documentData)
  }

  const handleAiSend = async () => {
    if (!aiInput.trim() || isAiTyping) return
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: aiInput.trim()
    }
    
    setAiMessages(prev => [...prev, userMessage])
    setAiInput('')
    setIsAiTyping(true)
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = generateAiResponse(userMessage.content)
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse
      }
      
      setAiMessages(prev => [...prev, aiMessage])
      setIsAiTyping(false)
    }, 1500)
  }

  const generateAiResponse = (userInput) => {
    const responses = [
      '我建议您可以在这个段落中添加更多具体的例子来支持您的观点。',
      '这个主题很有趣！您可以考虑从不同角度来分析这个问题。',
      '建议您重新组织一下段落结构，让逻辑更加清晰。',
      '您可以添加一些数据或统计信息来增强说服力。',
      '这个开头很好，建议在结尾部分呼应开头的主题。'
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const toggleAiChat = () => {
    setShowAIChat(!showAIChat)
  }

  const handleStartMeeting = () => {
    setMeetingTitle(`关于"${document?.title || '新文档'}"的协作讨论`)
    setShowMeetingModal(true)
  }

  const handleCollaboratorToggle = (collaboratorId) => {
    setSelectedCollaborators(prev => 
      prev.includes(collaboratorId)
        ? prev.filter(id => id !== collaboratorId)
        : [...prev, collaboratorId]
    )
  }

  const handleCreateMeeting = () => {
    if (!meetingTitle.trim()) {
      message.warning('请输入会议主题')
      return
    }
    
    if (selectedCollaborators.length === 0) {
      message.warning('请至少选择一位参会人员')
      return
    }

    const selectedNames = collaborators
      .filter(c => selectedCollaborators.includes(c.id))
      .map(c => c.name)
      .join('、')

    message.success(`会议创建成功！会议主题：${meetingTitle}，参会人员：${selectedNames}。会议邀请已发送。`)
    
    // 关闭模态框并重置状态
    setShowMeetingModal(false)
    setMeetingTitle('')
    setSelectedCollaborators([])
  }

  const closeMeetingModal = () => {
    setShowMeetingModal(false)
    setMeetingTitle('')
    setSelectedCollaborators([])
  }

  const handleHistoryClick = () => {
    setShowHistoryDialog(true)
  }

  const closeHistoryDialog = () => {
    setShowHistoryDialog(false)
  }



  return (
    <div className="document-editor-fullscreen">
      <div className="document-editor-container">
        <Header className="editor-header">
          <div className="header-left">
            <FileTextOutlined className="editor-icon" />
            <Title level={3} style={{ margin: 0, color: 'white' }}>
              {isNew ? '新建文档' : '编辑文档'}
            </Title>
          </div>
          <div className="header-actions">
            <Space>
              <Tooltip title="发起协作会议">
                <Button 
                  type="default"
                  icon={<VideoCameraOutlined />}
                  onClick={handleStartMeeting}
                >
                  发起会议
                </Button>
              </Tooltip>
              <Tooltip title={showAIChat ? '隐藏AI助手' : '显示AI助手'}>
                <Button 
                  type={showAIChat ? 'primary' : 'default'}
                  icon={<MessageOutlined />}
                  onClick={toggleAiChat}
                >
                  AI助手
                </Button>
              </Tooltip>
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                onClick={handleSave}
              >
                保存
              </Button>
              <Button 
                type="text" 
                icon={<CloseOutlined />} 
                onClick={onClose}
                style={{ color: 'white' }}
              />
            </Space>
          </div>
        </Header>

        <Content className="editor-main">
          <div className="editor-layout">
            {/* 左侧编辑器区域 */}
            <div className={`editor-section ${showAIChat ? 'with-ai-panel' : 'full-width'}`}>
              <div className="editor-form">
                <div className="form-group">
                  <div className="wang-editor-container">
                    {!editorLoaded && (
                      <div className="editor-loading">
                        <div className="loading-spinner"></div>
                        <p>正在加载编辑器...</p>
                      </div>
                    )}
                    <div style={{ display: editorLoaded ? 'block' : 'none' }}>
                      <div 
                        ref={toolbarRef}
                        className="wang-editor-toolbar"
                      ></div>
                      <div 
                        ref={editorRef}
                        className="wang-editor-content"
                        style={{ minHeight: '500px', height: 'auto' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧AI助手区域 */}
            {showAIChat && (
              <div className="ai-chat-panel">
                {!showHistoryDialog ? (
                  <>
                    <div className="ai-chat-header">
                      <Button 
                        type="text"
                        size="small"
                        onClick={handleHistoryClick}
                        style={{ 
                          color: '#8c8c8c',
                          fontSize: '12px',
                          padding: '4px 8px',
                          height: 'auto'
                        }}
                      >
                        历史对话
                      </Button>
                      <Button 
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={toggleAiChat}
                        size="small"
                        style={{ marginLeft: 'auto' }}
                      />
                    </div>
              
                    <div className="ai-chat-messages" ref={aiChatRef}>
                      {aiMessages.length === 0 && (
                        <div className="ai-welcome-message">
                          <div className="welcome-avatar">
                            👋
                          </div>
                          <div className="welcome-content">
                            <div className="welcome-title">你好，张洪磊</div>
                            <div className="welcome-subtitle">你可以在这里向内容，查找资料</div>
                          </div>
                        </div>
                      )}
                      {aiMessages.map(message => (
                        <div key={message.id} className={`ai-message ${message.type}`}>
                          <div className="message-avatar">
                            {message.type === 'ai' ? (
                              <Avatar size={32} style={{ backgroundColor: '#f0f0f0', color: '#666' }}>
                                <RobotOutlined />
                              </Avatar>
                            ) : (
                              <Avatar size={32} style={{ backgroundColor: '#1890ff' }}>
                                <UserOutlined />
                              </Avatar>
                            )}
                          </div>
                          <div className="message-content">
                            {message.content}
                          </div>
                        </div>
                      ))}
                      {isAiTyping && (
                        <div className="ai-message ai typing">
                          <div className="message-avatar">
                            <Avatar size={32} style={{ backgroundColor: '#f0f0f0', color: '#666' }}>
                              <RobotOutlined />
                            </Avatar>
                          </div>
                          <div className="message-content">
                            <div className="typing-indicator">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
              
                    <div className="ai-chat-input">
                      <div className="input-container">
                        <Input
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          onPressEnter={handleAiSend}
                          placeholder="问个问题，或者告诉我你想要什么"
                          className="ai-input-field"
                          suffix={
                            <Button
                              type="text"
                              icon={<SendOutlined />}
                              onClick={handleAiSend}
                              disabled={!aiInput.trim()}
                              className="send-button"
                            />
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="history-dialog">
                    <div className="history-header">
                      <Button 
                        type="text"
                        icon={<LeftOutlined />}
                        onClick={closeHistoryDialog}
                        size="small"
                        style={{ 
                          color: '#8c8c8c',
                          fontSize: '12px',
                          padding: '4px 8px',
                          height: 'auto'
                        }}
                      >
                        返回
                      </Button>
                      <span style={{ 
                        color: '#262626',
                        fontSize: '14px',
                        fontWeight: 500,
                        marginLeft: '8px'
                      }}>
                        新对话
                      </span>
                      <Button 
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={toggleAiChat}
                        size="small"
                        style={{ marginLeft: 'auto' }}
                      />
                    </div>
                    
                    <div className="history-content">
                       <div className="history-time-section">
                         <div className="time-label">最近 30 天</div>
                         <div className="history-item active">
                           总结文档
                         </div>
                       </div>
                       
                       <div className="new-chat-section">
                         <Button 
                           type="primary"
                           block
                           size="large"
                           onClick={() => {
                             closeHistoryDialog();
                             // 延迟聚焦以确保DOM更新完成
                             setTimeout(() => {
                               const inputElement = document.querySelector('.ai-chat-input input') || 
                                                   document.querySelector('input[placeholder*="问个问题"]') ||
                                                   document.querySelector('.ant-input');
                               if (inputElement) {
                                 inputElement.focus();
                               }
                             }, 200);
                           }}
                           style={{
                             marginTop: '20px',
                             borderRadius: '8px',
                             height: '40px'
                           }}
                         >
                         </Button>
                       </div>
                     </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Content>
      </div>

      {/* 会议创建模态框 - 使用Ant Design重构 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <VideoCameraOutlined style={{ color: 'white', fontSize: 16 }} />
            </div>
            <Text strong style={{ fontSize: 16 }}>发起协作会议</Text>
          </div>
        }
        open={showMeetingModal}
        onCancel={closeMeetingModal}
        footer={[
          <Button key="cancel" onClick={closeMeetingModal}>
            取消
          </Button>,
          <Button 
            key="create" 
            type="primary" 
            onClick={handleCreateMeeting}
            disabled={selectedCollaborators.length === 0}
            icon={<VideoCameraOutlined />}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: 6
            }}
          >
            立即发起会议
          </Button>
        ]}
        width={520}
        centered
        maskClosable={false}
        destroyOnHidden
      >
        <div style={{ padding: '8px 0' }}>
          {/* 会议主题输入 */}
          <div style={{ marginBottom: 24 }}>
            <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>会议主题</Text>
            <Input
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="请输入会议主题"
              size="large"
              style={{ 
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                fontSize: 14
              }}
            />
          </div>
          
          {/* 邀请协同人员 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              <Text strong style={{ fontSize: 14 }}>邀请协同人员</Text>
              <div style={{ 
                marginLeft: 8,
                padding: '2px 8px',
                background: selectedCollaborators.length > 0 ? '#f6ffed' : '#f5f5f5',
                border: `1px solid ${selectedCollaborators.length > 0 ? '#b7eb8f' : '#d9d9d9'}`,
                borderRadius: 12,
                fontSize: 12,
                color: selectedCollaborators.length > 0 ? '#52c41a' : '#8c8c8c'
              }}>
                {selectedCollaborators.length}人已选择
              </div>
            </div>
            
            <div style={{ 
              maxHeight: 240, 
              overflowY: 'auto',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              padding: 8
            }}>
              {collaborators.map(collaborator => (
                <div 
                  key={collaborator.id}
                  onClick={() => handleCollaboratorToggle(collaborator.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    margin: '4px 0',
                    borderRadius: 8,
                    cursor: 'pointer',
                    border: selectedCollaborators.includes(collaborator.id) 
                      ? '2px solid #1890ff' 
                      : '1px solid transparent',
                    background: selectedCollaborators.includes(collaborator.id) 
                      ? '#f0f8ff' 
                      : '#fafafa',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedCollaborators.includes(collaborator.id)) {
                      e.target.style.background = '#f5f5f5'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedCollaborators.includes(collaborator.id)) {
                      e.target.style.background = '#fafafa'
                    }
                  }}
                >
                  <Badge 
                    status={collaborator.online ? 'success' : 'default'} 
                    offset={[-2, 28]}
                  >
                    <Avatar 
                      size={40}
                      style={{ 
                        backgroundColor: collaborator.online ? '#52c41a' : '#d9d9d9',
                        fontSize: 16,
                        fontWeight: 'bold'
                      }}
                    >
                      {collaborator.avatar}
                    </Avatar>
                  </Badge>
                  
                  <div style={{ marginLeft: 12, flex: 1 }}>
                    <div style={{ 
                      fontSize: 14, 
                      fontWeight: 500, 
                      color: '#262626',
                      marginBottom: 2
                    }}>
                      {collaborator.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {collaborator.department}
                      </Text>
                      <div style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#d9d9d9'
                      }} />
                      <Text 
                        type={collaborator.online ? 'success' : 'secondary'}
                        style={{ fontSize: 12 }}
                      >
                        {collaborator.online ? '在线' : '离线'}
                      </Text>
                    </div>
                  </div>
                  
                  {selectedCollaborators.includes(collaborator.id) && (
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#1890ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ color: 'white', fontSize: 12 }}>✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 会议说明 */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)',
            border: '1px solid #91d5ff',
            borderRadius: 8,
            padding: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#1890ff',
                marginRight: 8
              }} />
              <Text style={{ fontSize: 13, color: '#1890ff', fontWeight: 500 }}>会议将基于当前文档内容进行协作讨论</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#52c41a',
                marginRight: 8
              }} />
              <Text style={{ fontSize: 13, color: '#52c41a', fontWeight: 500 }}>邀请通知将自动发送给选中的协同人员</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#722ed1',
                marginRight: 8
              }} />
              <Text style={{ fontSize: 13, color: '#722ed1', fontWeight: 500 }}>会议支持屏幕共享和文档同步编辑</Text>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DocumentEditor