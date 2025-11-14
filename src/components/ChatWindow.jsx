import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Input, Button, Space, Modal, Tooltip, Slider, Avatar, Switch, Dropdown } from 'antd';
import { MessageSquare, Send, MoreVertical, Type, Smile, AtSign, Scissors, HelpCircle, Maximize2, FileText, Search, Video, UserPlus, Calendar, X, Mic, MicOff, VideoOff, Volume2, VolumeX, ChevronRight, Users, User, Layers, Folder, Pin, Megaphone } from 'lucide-react';
import { AudioOutlined, VideoCameraOutlined, DownOutlined, SettingOutlined, ShareAltOutlined, PhoneOutlined, MoreOutlined, FullscreenOutlined, TranslationOutlined, SafetyOutlined, TeamOutlined, UserOutlined, CloseOutlined, SearchOutlined, LikeOutlined, PushpinOutlined } from '@ant-design/icons';
import './ChatWindow.css';
import './MeetingCenter.css';
import CalendarCenter from './CalendarCenter.jsx';

const ORG_NAMES = [
  '陈安', '李雪', '王明', '赵丽', '孙浩', '周洋', '吴倩', '郑宇', '冯晨', '褚凯',
  '卫婷', '蒋磊', '沈静', '韩博', '杨帆', '朱敏', '秦峰', '尤然', '许泽', '何佳',
  '吕倩', '施乐', '张越', '孔扬', '曹楠', '严宁', '华清', '金波', '魏巍', '陶然',
  '姜楠', '戚鑫', '谢婧', '邹昊', '喻辰', '柏林', '水晶', '窦羽', '章琴', '云舒',
  '苏航', '潘磊', '葛亮', '奚悦', '范慧', '彭越', '鲁宁', '韦华', '昌乐', '苗云'
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTab, setSearchTab] = useState('消息');
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showCalendarPanel, setShowCalendarPanel] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showContactCard, setShowContactCard] = useState(false);
  const avatarRef = useRef(null);
  const cardRef = useRef(null);
  const [showReplayModal, setShowReplayModal] = useState(false);
  const [replayItems, setReplayItems] = useState([]);
  const replayTimerRef = useRef(null);

  // 会议弹窗相关状态（对齐 MeetingCenter 发起会议样式）
  const [startMeetingOpen, setStartMeetingOpen] = useState(false);
  const [inMeetingOpen, setInMeetingOpen] = useState(false);
  const [aiSummaryOn, setAiSummaryOn] = useState(false);
  const [showAIView, setShowAIView] = useState(true);
  const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('be bay.');
  const [showCaptionsPanel, setShowCaptionsPanel] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('新教师教学方法培训');
  // 添加成员弹窗相关状态
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [selectedAddMembers, setSelectedAddMembers] = useState([]);
  const [addMembersSearch, setAddMembersSearch] = useState('');
  const currentContact = contacts.find(c => c.id === activeContact);
  const isGroupHeader = currentContact?.type === 'group' || currentContact?.type === 'topic';
  const [groupHeaderTab, setGroupHeaderTab] = useState('消息');
  // @提及：面板与关键词
  const [mentionVisible, setMentionVisible] = useState(false);
  const [mentionKeyword, setMentionKeyword] = useState('');
  const memberObjects = useMemo(() => {
    const map = new Map();
    (contacts || []).forEach(c => {
      if (!c?.name) return;
      map.set(c.name, { name: c.name, avatar: c.avatar || '', motto: c.motto || '', isAI: !!c.isAI });
    });
    (messages || []).forEach(m => {
      const n = m?.senderName;
      if (!n) return;
      if (map.has(n)) return;
      const c = (contacts || []).find(x => x.name === n);
      map.set(n, { name: n, avatar: c?.avatar || '', motto: c?.motto || '', isAI: !!c?.isAI });
    });
    try {
      const raw = localStorage.getItem('theme-templates');
      let templates = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(templates) || templates.length === 0) {
        templates = [
          { id: 'teaching-research', name: '教研智能体', avatarUrl: '/images/agents/teacher.svg', description: '' },
          { id: 'class-teacher', name: '班主任智能体', avatarUrl: '', description: '' },
          { id: 'counselor', name: '辅导员智能体', avatarUrl: '', description: '' },
          { id: 'supervisor', name: '督学智能体', avatarUrl: '', description: '' },
          { id: 'principal', name: '校长智能体', avatarUrl: '', description: '' },
          { id: 'scientific-research', name: '科研智能体', avatarUrl: '', description: '' }
        ];
      }
      templates.forEach(t => {
        const nm = t?.name;
        if (!nm || map.has(nm)) return;
        map.set(nm, { name: nm, avatar: t?.avatarUrl || '', motto: t?.description || '', isAI: true });
      });
    } catch {}
    if (!map.has('李明')) {
      map.set('李明', { name: '李明', avatar: '/assets/场景模拟/小男孩头像.png', motto: '保持热爱，奔赴山海', isAI: true });
    }
    ORG_NAMES.forEach(n => { if (!map.has(n)) map.set(n, { name: n, avatar: '', motto: '', isAI: false }); });
    return Array.from(map.values());
  }, [contacts, messages]);
  const DEFAULT_SUGGESTION_OBJS = useMemo(() => (
    [
      { name: '张老师', avatar: '', motto: '', isAI: false },
      { name: '李主任', avatar: '', motto: '', isAI: false },
      { name: '李明', avatar: '/assets/场景模拟/小男孩头像.png', motto: '保持热爱，奔赴山海', isAI: true },
      { name: '教研智能体', avatar: '/images/agents/teacher.svg', motto: '', isAI: true },
      { name: '辅导员智能体', avatar: '', motto: '', isAI: true },
      { name: '班主任智能体', avatar: '', motto: '', isAI: true }
    ]
  ), []);
  const mentionCandidates = useMemo(() => {
    const kwRaw = (mentionKeyword || '').toLowerCase();
    const kw = kwRaw.replace(/[^\w\u4e00-\u9fa5]/g, '');
    const base = (memberObjects && memberObjects.length) ? memberObjects : DEFAULT_SUGGESTION_OBJS;
    const filtered = kw
      ? base.filter(o => String(o.name || '').toLowerCase().includes(kw)).slice(0, 6)
      : base.slice(0, 6);
    return filtered.length ? filtered : base.slice(0, 6);
  }, [mentionKeyword, memberObjects, DEFAULT_SUGGESTION_OBJS]);

  const openContactSourceReplay = () => {
    const snap = currentContact?.sourceSnapshot;
    if (!snap) {
      const href = currentContact?.sourceLink;
      if (href) window.open(href, '_blank', 'noopener');
      return;
    }
    try {
      const temp = document.createElement('div');
      temp.innerHTML = snap;
      const nodes = Array.from(temp.querySelectorAll('.message-bubble'));
      setReplayItems([]);
      setShowReplayModal(true);
      if (replayTimerRef.current) { clearInterval(replayTimerRef.current); replayTimerRef.current = null; }
      let idx = 0;
      const appendNext = () => {
        if (idx >= nodes.length) {
          if (replayTimerRef.current) { clearInterval(replayTimerRef.current); replayTimerRef.current = null; }
          return;
        }
        const html = nodes[idx].outerHTML;
        setReplayItems(prev => [...prev, html]);
        idx++;
      };
      appendNext();
      replayTimerRef.current = setInterval(appendNext, 1000);
    } catch {}
  };

  const closeReplayModal = () => {
    if (replayTimerRef.current) { clearInterval(replayTimerRef.current); replayTimerRef.current = null; }
    setShowReplayModal(false);
    setReplayItems([]);
  };

  // 模板数据与处理函数（保持原有功能）
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

  const handleTemplateSelect = (template) => {
    const templateMessage = `请帮我使用"${template.title}"模板创作内容。模板描述：${template.description}`;
    onMessageChange(templateMessage);
    setShowTemplateModal(false);
  };

  // 会话标题栏按钮交互
  const handleConversationSearch = () => {
    setShowSearchPanel(true);
    setShowCalendarPanel(false);
    window.dispatchEvent(new CustomEvent('conversationSearchOpen', { detail: { chatId: activeContact } }));
  };
  const handleStartVideoMeeting = () => {
    setStartMeetingOpen(true);
    window.dispatchEvent(new CustomEvent('startVideoMeeting', { detail: { chatId: activeContact } }));
  };
  const handleAddMember = () => {
    setShowAddMembersModal(true);
    window.dispatchEvent(new CustomEvent('addChatMember', { detail: { chatId: activeContact } }));
  };
  const handleStartVoiceCall = () => {
    setMicEnabled(true);
    setCameraEnabled(false);
    setShowMeetingModal(true);
    window.dispatchEvent(new CustomEvent('startVoiceCall', { detail: { chatId: activeContact } }));
  };
  const handleMemberCalendar = () => {
    setShowCalendarPanel(true);
    setShowSearchPanel(false);
    // 延迟到下一轮事件循环，确保 CalendarCenter 已挂载并注册监听
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openMemberCalendar', { detail: { chatId: activeContact } }));
    }, 0);
  };
  const closeSearchPanel = () => {
    setShowSearchPanel(false);
    setSearchQuery('');
    window.dispatchEvent(new CustomEvent('conversationSearchClose', { detail: { chatId: activeContact } }));
  };
  const closeCalendarPanel = () => {
    setShowCalendarPanel(false);
    window.dispatchEvent(new CustomEvent('closeMemberCalendar', { detail: { chatId: activeContact } }));
  };

  // 简单的消息搜索（仅“消息”标签展示）
  const filteredMessages = (messages || []).filter(m => {
    if (!searchQuery) return false;
    const text = (m.content || '') + (m.senderName || '') + (m.time || '');
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    const onDocClick = (e) => {
      if (!showContactCard) return;
      const a = avatarRef.current;
      const c = cardRef.current;
      if (!a || !c) return;
      if (a.contains(e.target) || c.contains(e.target)) return;
      setShowContactCard(false);
    };
    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, [showContactCard]);

  return (
    <div className={`chat-panel ${showSearchPanel ? 'split' : ''} ${showCalendarPanel ? 'calendar-split' : ''}`}>
      {/* 左侧聊天主内容 */}
      <div className="chat-main">
        {/* 聊天头部 */}
        <div className="chat-header">
          <div className="chat-contact-info">
            <div className="contact-avatar small" ref={avatarRef} onClick={() => setShowContactCard(v => !v)}>
              {currentContact.avatar ? (
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
              {showContactCard && (
                <div className="contact-detail-card" ref={cardRef}>
                  <div className="detail-header">
                    <div className="detail-avatar">
                      {currentContact?.avatar ? (
                        currentContact.avatar.startsWith('http') || currentContact.avatar.startsWith('/') ? (
                          <img src={currentContact.avatar} alt="avatar" />
                        ) : (
                          <div className="detail-avatar-emoji">{currentContact.avatar}</div>
                        )
                      ) : (
                        <div className="detail-avatar-initial">{(currentContact?.name || '').charAt(0)}</div>
                      )}
                    </div>
                    <div className="detail-info">
                      <div className="detail-name">{currentContact?.name || ''}</div>
                      <div className="detail-motto">{currentContact?.motto || '保持热爱，奔赴山海'}</div>
                    </div>
                    <button className="detail-close-btn" onClick={() => setShowContactCard(false)}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className="detail-actions">
                    <button className="detail-action" onClick={() => setShowContactCard(false)}>
                      <MessageSquare size={14} />
                      <span>消息</span>
                    </button>
                    <button className="detail-action" onClick={handleStartVoiceCall}>
                      <Mic size={14} />
                      <span>语音</span>
                    </button>
                    <button className="detail-action" onClick={handleStartVideoMeeting}>
                      <Video size={14} />
                      <span>视频</span>
                    </button>
                  </div>
                  <div className="detail-links">
                    <button className="detail-link" onClick={handleMemberCalendar}>
                      <Calendar size={14} />
                      <span>查看日程</span>
                    </button>
                  </div>
                   <div className="detail-fields">
                    <div className="detail-field">
                      <span className="field-label">部门</span>
                      <span className="field-value">{currentContact?.department || '暂无'}</span>
                    </div>
                    <div className="detail-field">
                      <span className="field-label">来源</span>
                      <span className="field-value">
                        {(
                          currentContact?.source || (
                            (currentContact?.id === 'new_teacher_training' || currentContact?.id === 'org_training_new_teacher_discuss')
                              ? '果仁空间 · 组织培训'
                              : '—'
                          )
                        )}
                        {(currentContact?.sourceLink || currentContact?.sourceSnapshot) ? (
                          <a className="detail-source-link" href={currentContact.sourceLink || '#'} onClick={(e) => { e.preventDefault(); openContactSourceReplay(); }}>
                            {currentContact?.sourceTitle || '【组织培训】新教师教学方法培训'}
                          </a>
                        ) : (
                          (currentContact?.id === 'new_teacher_training' || currentContact?.id === 'org_training_new_teacher_discuss') && (
                            <span style={{ marginLeft: 6, color: '#666' }}>【组织培训】新教师教学方法培训</span>
                          )
                        )}
                      </span>
                    </div>
                    <div className="detail-field">
                      <span className="field-label">备注与描述</span>
                      <button className="detail-edit">编辑内容</button>
                    </div>
                    <div className="detail-note">{currentContact?.description || '暂无'}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="contact-details">
              <div className="contact-title">
                <span className="contact-name">{currentContact.name}</span>
                <span className="contact-motto">{currentContact?.motto || '路虽远，行则将至；事虽难，做则必成。'}</span>
              </div>
              {isGroupHeader ? (
                <div className="group-header-tabs">
                  <button
                    className={`group-tab ${groupHeaderTab === '消息' ? 'active' : ''}`}
                    onClick={() => setGroupHeaderTab('消息')}
                    title="消息"
                  >
                    <MessageSquare size={16} className="tab-icon messages" />
                    <span>消息</span>
                  </button>
                  <button
                    className={`group-tab ${groupHeaderTab === '云文档' ? 'active' : ''}`}
                    onClick={() => setGroupHeaderTab('云文档')}
                    title="云文档"
                  >
                    <FileText size={16} className="tab-icon docs" />
                    <span>云文档</span>
                  </button>
                  <button
                    className={`group-tab ${groupHeaderTab === '文件' ? 'active' : ''}`}
                    onClick={() => setGroupHeaderTab('文件')}
                    title="文件"
                  >
                    <Folder size={16} className="tab-icon files" />
                    <span>文件</span>
                  </button>
                  <button
                    className={`group-tab ${groupHeaderTab === 'Pin' ? 'active' : ''}`}
                    onClick={() => setGroupHeaderTab('Pin')}
                    title="Pin"
                  >
                    <Pin size={16} className="tab-icon pin" />
                    <span>Pin</span>
                  </button>
                  <button
                    className={`group-tab ${groupHeaderTab === '群公告' ? 'active' : ''}`}
                    onClick={() => setGroupHeaderTab('群公告')}
                    title="群公告"
                  >
                    <Megaphone size={16} className="tab-icon notice" />
                    <span>群公告</span>
                  </button>
                </div>
              ) : (
                <div className="group-header-tabs">
                  <button
                    className={`group-tab ${groupHeaderTab === '消息' ? 'active' : ''}`}
                    onClick={() => setGroupHeaderTab('消息')}
                    title="消息"
                  >
                    <MessageSquare size={16} className="tab-icon messages" />
                    <span>消息</span>
                  </button>
                  <button
                    className={`group-tab ${groupHeaderTab === '云文档' ? 'active' : ''}`}
                    onClick={() => setGroupHeaderTab('云文档')}
                    title="云文档"
                  >
                    <FileText size={16} className="tab-icon docs" />
                    <span>云文档</span>
                  </button>
                  <button
                    className={`group-tab ${groupHeaderTab === '文件' ? 'active' : ''}`}
                    onClick={() => setGroupHeaderTab('文件')}
                    title="文件"
                  >
                    <Folder size={16} className="tab-icon files" />
                    <span>文件</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="chat-actions">
            <button className="action-btn" title="会话搜索" onClick={handleConversationSearch}>
              <Search size={16} />
            </button>
            <Tooltip title="会议">
              <button className="action-btn" title="会议" onClick={handleStartVideoMeeting}>
                <Video size={16} />
              </button>
            </Tooltip>
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
              const displaySenderName = (
                message.senderName ||
                (message.senderId === 'me'
                  ? '我'
                  : (typeof message.senderId === 'string' && message.senderId)
                    || currentContact?.name
                    || '对方')
              );

              // 模拟彩色头像：根据用户名哈希生成稳定的渐变色
              const avatarPalettes = [
                ['#4C8DF8', '#5EA0FF'],
                ['#34C759', '#2ECC71'],
                ['#FF9F0A', '#FF7F50'],
                ['#AF52DE', '#9B59B6'],
                ['#FF3B30', '#E74C3C'],
                ['#00C7BE', '#1ABC9C'],
                ['#5856D6', '#6C5CE7'],
                ['#FFCC00', '#F1C40F']
              ];
              const hash = (displaySenderName || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
              const palette = avatarPalettes[hash % avatarPalettes.length];
              const avatarBg = `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`;
              const isSupervisorExpert = (displaySenderName || '').includes('督学专家') || message.senderId === '督学专家';

              return (
                <div 
                  key={message.id}
                  className={`message-bubble ${message.senderId === 'me' ? 'sent' : 'received'} ${isGroupChat ? 'group' : ''}`}
                >
                  {isGroupChat && (
                    <div className="message-sender">
                      {isSupervisorExpert ? (
                        <img src="/assets/督学专家.png" alt="督学专家" style={{ width: 24, height: 24, borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }} />
                      ) : (
                        <span className="message-avatar" style={{ background: avatarBg }}>
                          {(displaySenderName || '').charAt(0)}
                        </span>
                      )}
                      <span className="message-author">{displaySenderName}</span>
                    </div>
                  )}
                  <div className={`message-content ${typeof message.content === 'string' && !message.content.includes('\n') && message.content.trim().length <= 28 ? 'single-line' : ''}`}>
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
          <div style={{ position: 'relative' }}>
          <Input
            value={newMessage}
            onChange={(e) => {
              const val = e.target.value;
              onMessageChange(val);
              // 面板触发：只要包含 @ 就显示；关键词按最后一个 @ 提取
              const atIndex = val.lastIndexOf('@');
              if (atIndex >= 0) {
                const tail = val.slice(atIndex + 1);
                const m = /^([^@\s,，。\.\!！\?？；;:\\/\-]*)/.exec(tail);
                setMentionKeyword((m && m[1]) ? m[1] : '');
                setMentionVisible(true);
                try { console.debug('mentionKeyword=', (m && m[1]) ? m[1] : '', 'memberNamesCount=', (memberNames || []).length); } catch {}
              } else {
                setMentionVisible(false);
                setMentionKeyword('');
              }
            }}
            onPressEnter={onSendMessage}
            placeholder="输入消息"
            allowClear
            suffix={
              <div className="input-suffix-tools">
                <Button type="text" size="small" icon={<Type size={16} />} title="文本工具" />
                <Button type="text" size="small" icon={<Smile size={16} />} title="表情" />
                <Button type="text" size="small" icon={<AtSign size={16} />} title="@提及" />
                <Button type="text" size="small" icon={<Scissors size={16} />} title="剪切板" />
                <Button type="text" size="small" icon={<HelpCircle size={16} />} title="帮助" />
                <Button type="text" size="small" icon={<FileText size={16} />} title="模板" onClick={() => setShowTemplateModal(true)} />
                <Button type="text" size="small" icon={<Maximize2 size={16} />} title="全屏" />
                <Button type="primary" size="small" icon={<Send size={16} />} onClick={onSendMessage} disabled={!newMessage.trim()} />
              </div>
            }
          />
          {/* 工具已移入输入框右侧 suffix */}
          {mentionVisible && (
            <div style={{ position: 'absolute', bottom: 40, left: 8, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.12)', border: '1px solid #e5e5e5', borderRadius: 8, padding: 8, minWidth: 220, maxHeight: 220, overflowY: 'auto', zIndex: 1000 }}>
              <div style={{ fontSize: 12, color: '#666', padding: '0 4px 6px 4px' }}>提及联系人</div>
              {(mentionCandidates.length === 0 ? DEFAULT_SUGGESTION_OBJS.slice(0,6) : mentionCandidates).map(item => (
                <button key={item.name} onClick={() => {
                  const updated = newMessage.replace(/@([^@\s]*)$/u, `@${item.name} `);
                  onMessageChange(updated);
                  setMentionVisible(false);
                  setMentionKeyword('');
                }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#333' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.avatar ? (
                      item.avatar.startsWith('http') || item.avatar.startsWith('/') ? (
                        <img src={item.avatar} alt="avatar" style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <span style={{ fontSize: 12 }}>{item.avatar}</span>
                      )
                    ) : (
                      <span style={{ fontSize: 12 }}>{(item.name || '').slice(0,1)}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, color: '#333' }}>{item.name}</span>
                    {!!item.motto && <span style={{ fontSize: 12, color: '#999' }}>{item.motto}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
          </div>
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
                placeholder="搜索关键词..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                allowClear
              />
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
      
      {/* 添加群成员弹窗 */}
      <Modal
        open={showAddMembersModal}
        onCancel={() => setShowAddMembersModal(false)}
        footer={null}
        width={820}
        className="add-members-modal"
        title={null}
      >
        <div className="add-members-body">
          <div className="add-left">
            <div className="add-search">
              <Input
                allowClear
                placeholder="搜索"
                value={addMembersSearch}
                onChange={(e) => setAddMembersSearch(e.target.value)}
                prefix={<Search size={16} />}
              />
            </div>
            <div className="add-categories">
              <button className="add-category">
                <div className="cat-left">
                  <Users size={18} color="#22c55e" />
                  <span>组织内联系人</span>
                </div>
                <ChevronRight size={16} className="cat-right" />
              </button>
              <button className="add-category">
                <div className="cat-left">
                  <User size={18} color="#4c8df8" />
                  <span>外部联系人</span>
                </div>
                <ChevronRight size={16} className="cat-right" />
              </button>
              <button className="add-category">
                <div className="cat-left">
                  <Layers size={18} color="#22c55e" />
                  <span>我管理的群组</span>
                </div>
                <ChevronRight size={16} className="cat-right" />
              </button>
            </div>
            <div className="add-bottom-left">
              <Button>批量导入</Button>
            </div>
          </div>
          <div className="add-right">
            <div className="add-selected-title">已选：{selectedAddMembers.length} 人</div>
            <div className="add-selected-list">
              {selectedAddMembers.length === 0 ? (
                <div className="add-empty">暂无选择</div>
              ) : (
                <div>/* 已选成员列表 */</div>
              )}
            </div>
          </div>
        </div>
        <div className="add-members-footer">
          <Button onClick={() => setShowAddMembersModal(false)}>取消</Button>
          <Button type="primary" disabled={selectedAddMembers.length === 0}>
            确定(⌘+Enter)
          </Button>
        </div>
      </Modal>

      <Modal
        open={showReplayModal}
        onCancel={closeReplayModal}
        footer={null}
        title="回放"
        width={720}
      >
        <div style={{ marginBottom: 8, color: '#64748b', fontSize: 12 }}>
          {(currentContact?.sourceTitle || '历史记录') + (currentContact?.sourceTime ? ` · ${currentContact.sourceTime}` : '')}
        </div>
        <div className="chat-messages" style={{ maxHeight: 480, overflow: 'auto', padding: 0 }}>
          {replayItems.map((html, idx) => (
            <div key={idx} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </div>
      </Modal>

      {/* 会议弹窗（对齐 MeetingCenter 的“发起会议”） */}
      <Modal
        open={startMeetingOpen}
        onCancel={() => setStartMeetingOpen(false)}
        footer={null}
        width={880}
        closable={false}
        className="start-meeting-modal"
      >
        <div className="start-meeting-title">
          <Input
            className="meeting-title-input"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            bordered={false}
            spellCheck={false}
            size="large"
          />
        </div>
        <div className="preview-area">
          <button className="preview-settings"><SettingOutlined /></button>
          <div
            className="avatar-circle"
            style={{
              backgroundImage: `url(${(currentContact?.avatar && (currentContact.avatar.startsWith('http') || currentContact.avatar.startsWith('/'))) ? currentContact.avatar : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop'})`
            }}
          />
        </div>
        <div className="controls-bar">
          <div className="controls-left">
            <Button icon={<AudioOutlined style={{ color: '#ff4d4f' }} />}>麦克风 <DownOutlined /></Button>
            <Button icon={<VideoCameraOutlined style={{ color: '#ff4d4f' }} />}>摄像头 <DownOutlined /></Button>
          </div>
          <div className="controls-volume">
            <AudioOutlined />
            <Slider style={{ width: 220 }} />
            <DownOutlined />
          </div>
          <div className="controls-right">
            <Button
              type="primary"
              size="large"
              shape="round"
              onClick={() => { setStartMeetingOpen(false); setInMeetingOpen(true); }}
            >
              开始会议
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={inMeetingOpen}
        onCancel={() => setInMeetingOpen(false)}
        footer={null}
        width={'95vw'}
        closable={false}
        className="in-meeting-modal"
      >
        <div className="meeting-topbar">
          <div className="topbar-left">
            <span className="meeting-name">{meetingTitle}</span>
            <span className="meeting-time">00:17（60 分钟）</span>
            <span className="signal">▮▮▮</span>
          </div>
          <div className="topbar-right">田 常用</div>
        </div>
        <div className="meeting-main" style={{ gridTemplateColumns: (showParticipantsPanel || showCaptionsPanel) ? (showAIView ? '1fr 1fr 320px' : '1fr 320px') : (showAIView ? '1fr 1fr' : '1fr') }}>
          {showAIView && (
            <div className="ai-card">
              <div className="ai-card-actions">
                <Button className="ai-action-btn" icon={<FullscreenOutlined />} />
                <Button className="ai-action-btn" icon={<MoreOutlined />} />
              </div>
              <div className="ai-mind">
                <div className="ai-center-line"></div>
                <div className="branch primary">会议主题一</div>
                <div className="branch light"></div>
                <div className="branch light"></div>
                <div className="branch secondary">会议主题二</div>
                <div className="branch light"></div>
                <div className="branch light"></div>
              </div>
              <div className="ai-card-label">AI 视图</div>
            </div>
          )}
          <div className="preview-card">
            <div
              className="avatar-octagon"
              style={{
                backgroundImage: `url(${(currentContact?.avatar && (currentContact.avatar.startsWith('http') || currentContact.avatar.startsWith('/'))) ? currentContact.avatar : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop'})`
              }}
            />
            <div className="preview-name"><AudioOutlined style={{ color: '#ff4d4f' }} /> {(currentContact?.name || '我')}</div>
          </div>
          {showParticipantsPanel && (
            <div className="participants-panel">
              <div className="pp-header">
                <div className="pp-title">参会人</div>
                <Space>
                  <Button type="text" icon={<UserOutlined />} />
                  <Button type="text" icon={<MoreOutlined />} />
                  <Button type="text" icon={<CloseOutlined />} onClick={() => setShowParticipantsPanel(false)} />
                </Space>
              </div>
              <div className="pp-search">
                <Input prefix={<SearchOutlined />} placeholder="搜索或呼叫" allowClear />
                <Button>邀请</Button>
              </div>
              <div className="pp-tabs">
                <Button type="link" className="active">全部 (1)</Button>
                <Button type="link">建议参会 (0)</Button>
              </div>
              <div className="pp-list">
                <div className="pp-item">
                  <Avatar size={28} style={{ background: '#eef2ff', color: '#1f2937' }}>张</Avatar>
                  <div className="pp-info">
                    <div className="pp-name">张洪磊 <span className="pp-me">我</span></div>
                    <div className="pp-role">主持人</div>
                  </div>
                  <Space className="pp-status">
                    <AudioOutlined style={{ color: '#ff4d4f' }} />
                    <VideoCameraOutlined style={{ color: '#ff4d4f' }} />
                  </Space>
                </div>
              </div>
              <div className="pp-actions">
                <Button>全员静音</Button>
                <Button>请求全员开麦</Button>
              </div>
            </div>
          )}
          {showCaptionsPanel && (
            <div className="captions-panel">
              <div className="cp-header">
                <div className="cp-title">字幕</div>
                <Space>
                  <Button type="text" icon={<MoreOutlined />} />
                  <Button type="text" icon={<CloseOutlined />} onClick={() => setShowCaptionsPanel(false)} />
                </Space>
              </div>
              <div className="cp-search">
                <Input prefix={<SearchOutlined />} placeholder="搜索" allowClear />
              </div>
              <div className="cp-list">
                {[{ time: '09:22:45', name: '张洪磊', text: '这个点在市办一个专家的这个部门，知道吗？然后这个是相的问题。' }].map((l, idx) => (
                  <div key={idx} className="cp-item">
                    <Avatar size={24} style={{ background: '#eef2ff', color: '#1f2937' }}>{l.name[0]}</Avatar>
                    <div className="cp-content">
                      <div className="cp-head">
                        <span className="cp-name">{l.name}</span>
                        <span className="cp-time">{l.time}</span>
                      </div>
                      <div className="cp-text">{l.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="meeting-toolbar" style={{ right: (showParticipantsPanel || showCaptionsPanel) ? 336 : 16 }}>
          <div className="toolbar-group left-group">
            <Button className="toolbar-btn" icon={<LikeOutlined />} />
            <Button className="toolbar-btn">OK</Button>
            <Button className="toolbar-btn">+1</Button>
            <Button className="toolbar-btn">@</Button>
            <Button className="toolbar-btn" icon={<PushpinOutlined />} />
          </div>
          <div className="toolbar-group center-group">
            <Button className="toolbar-btn" icon={<AudioOutlined />}>麦克风 <DownOutlined /></Button>
            <span className="toolbar-divider" />
            <Button className="toolbar-btn" icon={<VideoCameraOutlined />}>摄像头 <DownOutlined /></Button>
            <span className="toolbar-divider" />
            <Button className="toolbar-btn" icon={<ShareAltOutlined />}>共享 <DownOutlined /></Button>
            <span className="toolbar-divider" />
            <Button className="toolbar-btn record-btn"><span className="record-dot" /> 录制 <DownOutlined /></Button>
            <div className="toolbar-toggle"><span>AI 总结</span><Switch size="small" checked={aiSummaryOn} onChange={setAiSummaryOn} /></div>
            <Button className="hangup-btn" type="primary" danger shape="round" icon={<PhoneOutlined />} onClick={() => setInMeetingOpen(false)} />
          </div>
          <div className="toolbar-group right-group">
            <Button className="toolbar-btn" icon={<TeamOutlined />} onClick={() => setShowParticipantsPanel(true)}>1 <DownOutlined /></Button>
            <Button className="toolbar-btn" icon={<SafetyOutlined />}>安全</Button>
            <Button className="toolbar-btn" icon={<TranslationOutlined />} onClick={() => { setShowCaptions(true); setShowCaptionsPanel(false); }}>字幕</Button>
            <Dropdown menu={{ items: [{ key: 'close-ai', label: '关闭AI视图' }], onClick: ({ key }) => { if (key === 'close-ai') setShowAIView(false); } }}>
              <Button className="toolbar-btn" icon={<MoreOutlined />} />
            </Dropdown>
          </div>
        </div>
        {showCaptions && (
          <div className="captions-overlay">
            <div className="captions-header">
              <div className="cap-left">
                <Avatar size={24} style={{ background: '#1f2937', color: '#fff' }}>张</Avatar>
                <span className="cap-name">张洪磊</span>
              </div>
              <div className="cap-actions">
                <Tooltip title="查看完整字幕">
                  <div className="cap-icon" onClick={() => { setShowCaptionsPanel(true); setShowParticipantsPanel(false); }}>
                    CC
                  </div>
                </Tooltip>
                <div className="cap-icon">a</div>
                <Button type="text" icon={<MoreOutlined />} />
                <Button type="text" icon={<CloseOutlined />} onClick={() => setShowCaptions(false)} />
              </div>
            </div>
            <div className="captions-text">{currentCaption}</div>
          </div>
        )}
      </Modal>
      
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