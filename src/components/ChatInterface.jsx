import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader, FileText } from 'lucide-react'
import './ChatInterface.css'

const ChatInterface = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // 写作模版数据
  const writingTemplates = [
    {
      category: '学术写作',
      templates: [
        { id: 'research-paper', title: '学术论文', description: '标准学术论文格式模版' },
        { id: 'literature-review', title: '文献综述', description: '文献回顾与分析模版' },
        { id: 'case-study', title: '案例研究', description: '案例分析报告模版' },
        { id: 'thesis-proposal', title: '论文开题', description: '研究提案与开题报告' }
      ]
    },
    {
      category: '教学文档',
      templates: [
        { id: 'lesson-plan', title: '教学设计', description: '课程教学设计方案' },
        { id: 'teaching-reflection', title: '教学反思', description: '课后教学反思总结' },
        { id: 'student-evaluation', title: '学生评价', description: '学生学习评价报告' },
        { id: 'curriculum-outline', title: '课程大纲', description: '学科课程大纲制定' }
      ]
    },
    {
      category: '工作文档',
      templates: [
        { id: 'work-report', title: '工作报告', description: '定期工作总结报告' },
        { id: 'project-proposal', title: '项目提案', description: '项目申请与提案书' },
        { id: 'meeting-minutes', title: '会议纪要', description: '会议记录与纪要' },
        { id: 'business-plan', title: '商业计划', description: '商业计划书模版' }
      ]
    },
    {
      category: '创意写作',
      templates: [
        { id: 'story-outline', title: '故事大纲', description: '小说故事情节大纲' },
        { id: 'script-writing', title: '剧本创作', description: '影视剧本写作模版' },
        { id: 'poetry-creation', title: '诗歌创作', description: '现代诗歌创作指导' },
        { id: 'creative-essay', title: '创意散文', description: '散文写作技巧模版' }
      ]
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // 检查最后一条消息是否是用户发送的，如果是则显示正在输入状态
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.sender === 'user') {
      setIsTyping(true)
      // 模拟AI思考时间
      const timer = setTimeout(() => {
        setIsTyping(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTemplateSelect = (template) => {
    const templatePrompt = `请帮我创建一个${template.title}，要求：${template.description}`
    onSendMessage(templatePrompt)
    setShowTemplateModal(false)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-title">
          <Bot className="chat-icon" size={24} />
          <div>
            <h2>AI智能助手</h2>
            <p>我可以帮您解答问题、创作内容、编程协助等</p>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-content">
              <Bot size={48} className="welcome-icon" />
              <h3>欢迎使用AI智能助手</h3>
              <p>我可以帮您处理各种任务，请告诉我您需要什么帮助？</p>
              <div className="quick-actions">
                <button 
                  className="quick-action"
                  onClick={() => onSendMessage('帮我写一篇关于人工智能的文章')}
                >
                  写作助手
                </button>
                <button 
                  className="quick-action"
                  onClick={() => onSendMessage('解释一下什么是机器学习')}
                >
                  知识问答
                </button>
                <button 
                  className="quick-action"
                  onClick={() => onSendMessage('帮我写一个Python函数')}
                >
                  编程助手
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? (
                    <User size={20} />
                  ) : (
                    <Bot size={20} />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message ai-message typing">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <Loader className="typing-spinner" size={16} />
                    <span>AI正在思考中...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题或需求..."
            className="chat-input"
            rows={1}
            maxLength={2000}
          />
          <button
            type="button"
            className="template-button"
            onClick={() => setShowTemplateModal(true)}
            title="选择模版"
          >
            <FileText size={20} />
          </button>
          <button
            type="submit"
            className="send-button"
            disabled={!inputValue.trim()}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="input-footer">
          <span className="char-count">{inputValue.length}/2000</span>
          <span className="input-hint">按 Enter 发送，Shift + Enter 换行</span>
        </div>
      </form>

      {/* 模版浮窗 */}
      {showTemplateModal && (
        <div className="template-modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="template-modal-header">
              <h3>选择写作模版</h3>
              <button 
                className="template-modal-close"
                onClick={() => setShowTemplateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="template-modal-content">
              {writingTemplates.map((category, categoryIndex) => (
                <div key={categoryIndex} className="template-category">
                  <h4 className="template-category-title">{category.category}</h4>
                  <div className="template-grid">
                    {category.templates.map((template) => (
                      <div 
                        key={template.id} 
                        className="template-card"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <h5 className="template-title">{template.title}</h5>
                        <p className="template-description">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatInterface