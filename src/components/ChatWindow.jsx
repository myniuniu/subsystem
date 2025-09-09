import React, { useState } from 'react';
import { Input, Button, Space, Modal } from 'antd';
import { MessageSquare, Send, MoreVertical, Type, Smile, AtSign, Scissors, HelpCircle, Maximize2, FileText } from 'lucide-react';
import './ChatWindow.css';

const ChatWindow = ({ 
  activeContact,
  contacts,
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
  onKeyPress
}) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
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

  return (
    <div className="chat-panel">
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
          messages.map(message => (
            <div 
              key={message.id}
              className={`message-bubble ${message.senderId === 'me' ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {message.time}
              </div>
            </div>
          ))
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
                size="small" 
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
      
      {/* 模板选择Modal */}
      <Modal
        title="选择模板"
        open={showTemplateModal}
        onCancel={() => setShowTemplateModal(false)}
        footer={null}
        width={1000}
        className="template-modal"
      >
        <div className="template-content">
          {templates.map((category, categoryIndex) => (
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
      </Modal>
    </div>
  );
};

export default ChatWindow;