import React, { useState } from 'react';
import { Input, Button, Space, Modal } from 'antd';
import { MessageSquare, Send, MoreVertical, Type, Smile, AtSign, Scissors, HelpCircle, Maximize2, FileText, Search, Video, UserPlus, Calendar, X } from 'lucide-react';
import './ChatWindow.css';
import CalendarCenter from './CalendarCenter.jsx';

const ChatWindow = ({ 
  activeContact,
  contacts,
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
  onKeyPress,
  onSimulateMe
}) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  // 新增：搜索与日历侧栏状态
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showCalendarPanel, setShowCalendarPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTab, setSearchTab] = useState('消息');
  
  // 模板数据
  const templates = [
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
  ];
  
  const currentContact = contacts.find(c => c.id === activeContact);
  
  // 处理模板选择
  const handleTemplateSelect = (template) => {
    const templateMessage = `请帮我使用"${template.title}"模板创作内容。模板描述：${template.description}`;
    onMessageChange(templateMessage);
    setShowTemplateModal(false);
  };

  if (!activeContact || !currentContact) {
    return (
      <div className="chat-panel">
        <div className="no-chat-selected">
          <MessageSquare size={64} />
          <h3>选择一个联系人开始聊天</h3>
          <p>从左侧选择联系人或群组开始对话</p>
        </div>
      </div>
    );
  }

  // 会话标题栏按钮交互
  const handleConversationSearch = () => {
    setShowSearchPanel(true);
    setShowCalendarPanel(false);
    window.dispatchEvent(new CustomEvent('conversationSearchOpen', { detail: { chatId: activeContact } }));
  };
  const handleStartVideoMeeting = () => {
    window.dispatchEvent(new CustomEvent('startVideoMeeting', { detail: { chatId: activeContact } }));
  };
  const handleAddMember = () => {
    window.dispatchEvent(new CustomEvent('addChatMember', { detail: { chatId: activeContact } }));
  };
  const handleMemberCalendar = () => {
    setShowCalendarPanel(true);
    setShowSearchPanel(false);
    window.dispatchEvent(new CustomEvent('openMemberCalendar', { detail: { chatId: activeContact } }));
  };
  const closeSearchPanel = () => {
    setShowSearchPanel(false);
    setSearchQuery('');
  };
  const closeCalendarPanel = () => {
    setShowCalendarPanel(false);
  };

  // 简单的消息搜索（仅“消息”标签展示）
  const filteredMessages = (messages || []).filter(m => {
    if (!searchQuery) return false;
    const text = (m.content || '') + (m.senderName || '') + (m.time || '');
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`chat-panel ${showSearchPanel ? 'split' : ''} ${showCalendarPanel ? 'calendar-split' : ''}`}>
      {/* 左侧聊天主内容 */}
      <div className="chat-main">
        {/* 聊天头部 */}
        <div className="chat-header">
          <div className="chat-contact-info">
            <div className="contact-avatar small">
              {currentContact.avatar ? (
                // 检查是否是emoji或图片URL
                currentContact.avatar.startsWith('http') || currentContact.avatar.startsWith('/') ? (
                  <img src={currentContact.avatar} alt="" />
                ) : (
                  <div className="avatar-placeholder emoji-avatar">
                    {currentContact.avatar}
                  </div>
                )
              ) : (
                <div className="avatar-placeholder">
                  {currentContact.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="contact-details">
              <div className="contact-name">
                {currentContact.name}
              </div>
              <div className="contact-status">
                {currentContact.online ? '在线' : '离线'}
              </div>
            </div>
          </div>
          
          <div className="chat-actions">
            <button className="action-btn" title="会话搜索" onClick={handleConversationSearch}>
              <Search size={16} />
            </button>
            <button className="action-btn" title="发起视频会议" onClick={handleStartVideoMeeting}>
              <Video size={16} />
            </button>
            <button className="action-btn" title="添加群成员" onClick={handleAddMember}>
              <UserPlus size={16} />
            </button>
            <button className="action-btn" title="成员日历" onClick={handleMemberCalendar}>
              <Calendar size={16} />
            </button>
            <button className="action-btn" title="更多">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
        
        {/* 聊天消息区域 */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <MessageSquare size={48} />
              <p>开始对话吧</p>
            </div>
          ) : (
            messages.map(message => {
              const isGroupChat = currentContact?.type === 'group' || currentContact?.type === 'topic';
              // 计算显示的发言人名称
              const displaySenderName = (
                message.senderName ||
                (message.senderId === 'me'
                  ? '我'
                  : (typeof message.senderId === 'string' && message.senderId)
                    || currentContact?.name
                    || '对方')
              );

              return (
                <div 
                  key={message.id}
                  className={`message-bubble ${message.senderId === 'me' ? 'sent' : 'received'}`}
                >
                  {isGroupChat && (
                    <div className="message-sender">
                      <span className="message-avatar">
                        {(displaySenderName || '').charAt(0)}
                      </span>
                      <span className="message-author">{displaySenderName}</span>
                    </div>
                  )}
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {message.time}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* 聊天输入框 */}
        <div className="chat-input">
          <Input
            placeholder="输入消息..."
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onPressEnter={onKeyPress}
            size="large"
            suffix={
              <Space size={4}>
                <Button 
                  type="dashed" 
                  size="small" 
                  title="模拟我对话"
                  onClick={onSimulateMe}
                >模拟我</Button>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<Type size={16} />} 
                  title="字体大小"
                />
                <Button 
                  type="text" 
                  size="small" 
                  icon={<Smile size={16} />} 
                  title="表情符号"
                />
                <Button 
                  type="text" 
                  size="小" 
                  icon={<AtSign size={16} />} 
                  title="@提及"
                />
                <Button 
                  type="text" 
                  size="small" 
                  icon={<Scissors size={16} />} 
                  title="剪切工具"
                />
                <Button 
                  type="text" 
                  size="small" 
                  icon={<HelpCircle size={16} />} 
                  title="帮助"
                />
                <Button 
                  type="text" 
                  size="small" 
                  icon={<FileText size={16} />} 
                  title="模板"
                  onClick={() => setShowTemplateModal(true)}
                />
                <Button 
                  type="text" 
                  size="small" 
                  icon={<Maximize2 size={16} />} 
                  title="全屏"
                />
                <Button 
                  type="primary"
                  size="small"
                  icon={<Send size={16} />}
                  onClick={onSendMessage}
                  disabled={!newMessage.trim()}
                />
              </Space>
            }
          />
        </div>
      </div>

      {/* 右侧搜索面板 */}
      {showSearchPanel && (
        <div className="search-panel">
          <div className="search-header">
            <div className="search-title">搜索会话内容</div>
            <button className="search-close-btn" title="关闭搜索" onClick={closeSearchPanel}>
              <X size={16} />
            </button>
          </div>

          <div className="search-toolbar">
            <div className="search-tabs">
              {['消息','云文档','文件','图片/视频','链接'].map(tab => (
                <button
                  key={tab}
                  className={`tab-item ${searchTab === tab ? 'active' : ''}`}
                  onClick={() => setSearchTab(tab)}
                >{tab}</button>
              ))}
            </div>
            <div className="search-input-box">
              <Input
                placeholder="搜索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search size={16} />}
              />
            </div>
            <div className="search-filters">
              <button className="filter-chip">来自用户</button>
              <button className="filter-chip">时间</button>
              <button className="filter-chip">高级搜索</button>
            </div>
          </div>

          <div className="search-results">
            {searchTab !== '消息' ? (
              <div className="search-empty">
                <div className="empty-illustration">🔎</div>
                <div className="empty-text">暂未接入{searchTab}搜索，后续可扩展</div>
              </div>
            ) : (
              !searchQuery ? (
                <div className="search-empty">
                  <div className="empty-illustration">🌀</div>
                  <div className="empty-text">输入关键词或使用过滤器提高查找精度</div>
                </div>
              ) : (
                filteredMessages.length === 0 ? (
                  <div className="search-empty">
                    <div className="empty-illustration">📭</div>
                    <div className="empty-text">未找到相关消息</div>
                  </div>
                ) : (
                  <div className="result-list">
                    {filteredMessages.map(item => (
                      <div key={item.id} className="result-item">
                        <div className="result-meta">
                          <span className="result-author">{item.senderName || (item.senderId === 'me' ? '我' : '对方')}</span>
                          <span className="result-time">{item.time}</span>
                        </div>
                        <div className="result-content">{item.content}</div>
                      </div>
                    ))}
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}

      {/* 右侧日历面板（3:7） */}
      {showCalendarPanel && (
        <div className="calendar-panel">
          <div className="calendar-panel-header">
            <div className="calendar-panel-title">主题日历</div>
            <button className="calendar-close-btn" title="关闭日历" onClick={closeCalendarPanel}>
              <X size={16} />
            </button>
          </div>
          <div className="calendar-panel-body">
            <CalendarCenter />
          </div>
        </div>
      )}
      
      {/* 模板选择Modal */}
      <Modal
        open={showTemplateModal}
        title="选择文档模板"
        onCancel={() => setShowTemplateModal(false)}
        onOk={() => setShowTemplateModal(false)}
      >
        <div className="template-grid">
          {templates.map(group => (
            <div key={group.category} className="template-group">
              <h4>{group.category}</h4>
              <div className="template-list">
                {group.templates.map(tpl => (
                  <button 
                    key={tpl.id} 
                    className="template-item"
                    onClick={() => handleTemplateSelect(tpl)}
                  >
                    <div className="template-title">{tpl.title}</div>
                    <div className="template-desc">{tpl.description}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ChatWindow;