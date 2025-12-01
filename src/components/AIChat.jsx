import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Typography,
  Space,
  message,
  Card,
  Avatar,
  Input,
  Modal,
  Popover,
  Checkbox
} from 'antd';
import {
  SaveOutlined,
  SendOutlined,
  FileTextOutlined,
  RobotOutlined,
  UserOutlined,
  MessageOutlined,
  SlidersOutlined,
  MoreOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import { COMMON_QUESTIONS, CATEGORY_COMMON_QUESTIONS } from '../constants/noteEditConstants';
import './UnifiedAICenter.css';
import notesService from '../services/notesService';
import ChatActionButtons from './ChatActionButtons';
import VideoPlayer from './VideoPlayer';

import { getCategoryKey, getAiTitleForCategory, getAiIconForCategory } from '../constants/categoryMeta';
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const AIChat = ({ state, handlers, selectedCategory, unreadMessageCount = null, onOpenMessageCenter = null, showGifOverlay = true }) => {
  const {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    setIsLoading,
    selectedMaterials,
    uploadedFiles,
    links,
    addedTexts,
    courseVideos,
    organizationalCourses,
    operationRecords,
    setOperationRecords
  } = state;

  const { onSaveToNote } = handlers;
  const [iconError, setIconError] = useState(false);

  // 基于分类动态选择常见问题
  // const normalizeCategory = (val) => {
  //   if (!val) return val;
  //   const map = {
  //     organizational_training: ['organizational_training', '组织培训', '培训管理'],
  //     training_needs_management: ['training_needs_management', '培训需求管理'],
  //     teaching_research_office: ['teaching_research_office', '教研室']
  //   };
  //   for (const key in map) {
  //     if (map[key].includes(val)) return key;
  //   }
  //   return val;
  // };

  const currentCategory = getCategoryKey(state?.note?.category, selectedCategory);
  const aiTitleLabel = getAiTitleForCategory(currentCategory);
  const categoryIcon = getAiIconForCategory(currentCategory);
  const questionsToShow = (CATEGORY_COMMON_QUESTIONS[currentCategory] || CATEGORY_COMMON_QUESTIONS.default);
  const badgeCount = typeof unreadMessageCount === 'number' ? unreadMessageCount : 0;

  // 组织培训分类下显示可拖动的动态图叠层
  const [dragPos, setDragPos] = useState({ x: 40, y: 80 });
  const [dragging, setDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const chatContainerRef = useRef(null);
  const bottomAreaRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMorePopover, setShowMorePopover] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [roleMode, setRoleMode] = useState('default');
  const [responseLength, setResponseLength] = useState('default');
  const [modelProvider, setModelProvider] = useState('deepseek');
  const summaryInjectedRef = useRef(false);
  const [compactMode, setCompactMode] = useState(false);
  const [autoScrollLatest, setAutoScrollLatest] = useState(true);
  const [showSourcesLine, setShowSourcesLine] = useState(true);
  const messagesContainerRef = useRef(null);
// 使用 public 目录下的静态资源路径，便于生产环境直接访问
const gifUrl = '/assets/动态.gif';
  const GIF_SIZE = 220; // 动图更大
  const BUBBLE_SIZE = 40; // 气泡更小
  const BUBBLE_OFFSET_X = 18; // 相对居中再向右偏移一点

  const onDragStart = (e) => {
    setDragging(true);
    dragOffsetRef.current = { x: e.clientX - dragPos.x, y: e.clientY - dragPos.y };
  };
  const onDragMove = (e) => {
    if (!dragging) return;
    let nx = e.clientX - dragOffsetRef.current.x;
    let ny = e.clientY - dragOffsetRef.current.y;
    const cw = chatContainerRef.current?.clientWidth || window.innerWidth;
    const ch = chatContainerRef.current?.clientHeight || window.innerHeight;
    const bottomH = bottomAreaRef.current?.offsetHeight || 160;
    // 约束在容器内，且不覆盖底部固定区
    nx = Math.max(8, Math.min(nx, cw - GIF_SIZE - 8));
    ny = Math.max(8, Math.min(ny, ch - bottomH - GIF_SIZE - 8));
    setDragPos({ x: nx, y: ny });
  };
  const onDragEnd = () => setDragging(false);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e) => onDragMove(e);
    const handleUp = () => onDragEnd();
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, dragPos]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('chat_mode_config');
      if (raw) {
        const cfg = JSON.parse(raw);
        setRoleMode(cfg.roleMode || 'default');
        setResponseLength(cfg.responseLength || 'default');
        setModelProvider(cfg.modelProvider || 'deepseek');
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const cfg = { roleMode, responseLength, modelProvider };
      localStorage.setItem('chat_mode_config', JSON.stringify(cfg));
    } catch {}
  }, [roleMode, responseLength, modelProvider]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('chat_mode_config');
      if (raw) {
        const cfg = JSON.parse(raw);
        setCompactMode(!!cfg.compactMode);
        setAutoScrollLatest(cfg.autoScrollLatest !== false);
        setShowSourcesLine(cfg.showSourcesLine !== false);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const cfg = { compactMode, autoScrollLatest, showSourcesLine };
      localStorage.setItem('chat_mode_config', JSON.stringify(cfg));
    } catch {}
  }, [compactMode, autoScrollLatest, showSourcesLine]);

  useEffect(() => {
    if (!autoScrollLatest) return;
    try {
      const el = messagesContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }, [messages]);

  // 初始定位：右下角（推荐问题上方）
  useEffect(() => {
    if (currentCategory !== 'organizational_training') return;
    const updateInitial = () => {
      const cw = chatContainerRef.current?.clientWidth || window.innerWidth;
      const ch = chatContainerRef.current?.clientHeight || window.innerHeight;
      const bottomH = bottomAreaRef.current?.offsetHeight || 160;
      // 左下角：x 固定为左侧边距；y 贴近底部但不覆盖推荐问题区
      const x = 16;
      const y = Math.max(8, ch - bottomH - GIF_SIZE - 16);
      setDragPos({ x, y });
    };
    updateInitial();
    const onResize = () => updateInitial();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [currentCategory]);

  useEffect(() => {
    if (currentCategory !== 'organizational_training') return;
    const FLAG_KEY = 'organizational_training_summary_injected';
    try {
      const already = localStorage.getItem(FLAG_KEY) === '1';
      if (already || summaryInjectedRef.current) return;
      summaryInjectedRef.current = true;
      localStorage.setItem(FLAG_KEY, '1');
    } catch {}
    const trainingSummary = '本次“新教师教学方法培训”聚焦以学为中心的课堂设计与互动实施，覆盖课堂组织、提问技巧、作业设计与评价、信息技术应用等模块。采用直播讲授、录播微课、在线研讨与作业实践的混合式形式，强调同伴互评与案例反思；结业以过程表现与任务成果为主，帮助新教师快速建立可落地的课堂方法。课程按周设置学习任务与交流时段，提供教案模板与观察表，建议将所学迁移至近期课堂并记录改进点。';
    const msg = { id: Date.now() + 99, type: 'assistant', kind: 'summary', content: trainingSummary, timestamp: new Date().toISOString() };
    setMessages(prev => {
      const hasSummary = Array.isArray(prev) && prev.some(m => m?.type === 'assistant' && m?.kind === 'summary');
      return hasSummary ? prev : [msg, ...prev];
    });
  }, [currentCategory, setMessages]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // 基于个人培训与学习数据生成“学伴”式智能回复
    setTimeout(() => {
      try {
        const notes = notesService.getAllNotes() || [];
        const byCategory = (cat) => notes.filter(n => n.category === cat);
        const study = byCategory('study');
        const personal = byCategory('personal');
        const orgTrain = byCategory('organizational_training');

        const recentTitles = (arr, k = 3) => arr
          .slice()
          .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0))
          .slice(0, k)
          .map(n => n.title)
          .filter(Boolean);

        const studyCount = study.length;
        const personalCount = personal.length;
        const orgCount = orgTrain.length;

        const orgProgress = (() => {
          let totalUnits = 0;
          let completedUnits = 0;
          for (const n of orgTrain) {
            const schedule = n.learningSchedule;
            if (Array.isArray(schedule)) {
              totalUnits += schedule.length;
              completedUnits += schedule.filter(u => u.completed || u.done || u.status === 'completed').length;
            } else if (schedule && Array.isArray(schedule.units)) {
              totalUnits += schedule.units.length;
              completedUnits += schedule.units.filter(u => u.completed || u.done || u.status === 'completed').length;
            }
          }
          const percent = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : null;
          return { totalUnits, completedUnits, percent };
        })();

        const studyRecent = recentTitles(study, 3);
        const personalRecent = recentTitles(personal, 3);
        const orgRecent = recentTitles(orgTrain, 3);

        const progressLine = orgProgress.percent != null
          ? `组织培训总体进度约为 ${orgProgress.percent}%（${orgProgress.completedUnits}/${orgProgress.totalUnits} 单元）。`
          : orgCount > 0
            ? `已记录 ${orgCount} 条组织培训笔记，部分课程包含学习进度。`
            : `尚未记录组织培训数据，建议先添加培训课程或生成模拟数据。`;

        const suggestion = [
          '- 今日建议：复习最近一次组织培训的关键知识点，完成一个未完成单元。',
          '- 学习规划：从最近的学习笔记中挑选一个主题，生成导图或小测验。',
          '- 数据跟踪：开启形成性评价记录（参与度、作业正确率、路径完成度）。'
        ].join('\n');

        const content = [
          `您问到：“${inputMessage}”。以下是基于您个人的培训与学习数据的学伴答复：`,
          '',
          '【个人学习与培训概览】',
          `- 学习笔记：${studyCount} 条；近期主题：${studyRecent.join('、') || '暂无'}`,
          `- 个人笔记：${personalCount} 条；近期主题：${personalRecent.join('、') || '暂无'}`,
          `- 组织培训：${orgCount} 条；近期课程：${orgRecent.join('、') || '暂无'}`,
          `- 进度概况：${progressLine}`,
          '',
          '【学伴建议】',
          suggestion,
          '',
          '如果需要，我可以：',
          '- 生成复习清单或导图',
          '- 汇总本周学习报告',
          '- 提醒下一个学习里程碑'
        ].join('\n');

        const aiResponse = {
          id: Date.now() + 1,
          type: 'assistant',
          content,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      } catch (e) {
        const fallback = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `我理解您的问题：“${inputMessage}”。目前无法读取个人数据，请稍后重试或点击“生成模拟数据”。`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, fallback]);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  // 保存AI回复到笔记
  const handleSaveToNote = (content, userQuestion) => {
    const newRecord = {
      id: Date.now(),
      title: userQuestion || `AI问答笔记 - ${new Date().toLocaleString()}`,
      source: aiTitleLabel,
      time: '刚刚',
      type: 'note',
      content: content
    };

    setOperationRecords(prev => ({
      ...prev,
      note: [newRecord, ...prev.note]
    }));

    message.success('AI回复已保存到笔记');
  };

  // 操作按钮点击处理函数
  const handleOperationClick = (operationType) => {
    const operationTitles = {
      audio: '音频概览',
      video: '视频概览', 
      mindmap: '思维导图',
      report: '分析报告',
      ppt: 'PPT演示',
      webcode: '网页代码',
      scenario: '场景模拟',
      'training-plan': '培训方案',
      schedule: '课表',
      participants: '参训人员清单',
      note: '笔记'
    };

    // 计算所有资料的总数
    const totalMaterials = uploadedFiles.length + addedTexts.length + courseVideos.length + links.length;

    const newRecord = {
      id: Date.now(),
      title: `基于${totalMaterials}个资料生成${operationTitles[operationType]}`,
      source: `${totalMaterials}个来源`,
      time: '刚刚',
      type: operationType
    };

    // 对于培训方案和课表工具，不显示文字生成效果，直接添加记录
    if (operationType === 'training-plan' || operationType === 'schedule') {
      setOperationRecords(prev => ({
        ...prev,
        [operationType]: [newRecord, ...prev[operationType]]
      }));
      message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
    } else {
      // 其他工具保持原有的进度效果
      message.loading(`正在生成${operationTitles[operationType]}...`, 3);
      setTimeout(() => {
        setOperationRecords(prev => ({
          ...prev,
          [operationType]: [newRecord, ...prev[operationType]]
        }));
        message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
      }, 3000);
    }
  };
  // 推荐视频弹窗状态
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [videoData, setVideoData] = useState(null);

  const openVideoFromRecommendation = (rec) => {
    const url = rec.videoSrc || '/assets/demo1.mp4';
    setVideoData({ title: rec.title || '推荐视频', url });
    setVideoModalVisible(true);
  };

  return (
    <div ref={chatContainerRef} style={{ 
      flex: 5, 
      margin: '16px', 
      background: '#fff', 
      borderRadius: '0px', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'flex 0.3s ease',
      position: 'relative',
      height: '100%'
    }}>
      {currentCategory === 'organizational_training' && showGifOverlay && (
        <img
          src={gifUrl}
          alt="动态图"
          style={{
            position: 'absolute',
            left: dragPos.x,
            top: dragPos.y,
            width: GIF_SIZE,
            height: 'auto',
            cursor: 'move',
            zIndex: 30,
            pointerEvents: 'auto'
          }}
          onMouseDown={onDragStart}
        />
      )}
      {/* 中部区域不再显示聊天气泡（统一由右下角整体承载） */}
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {categoryIcon && !iconError ? (
              <img src={categoryIcon} alt="AI助手" onError={() => setIconError(true)} style={{ width: 28, height: 28, borderRadius: '50%' }} />
            ) : (
              <span style={{ fontSize: '16px' }}>💬</span>
            )}
            <Title level={4} style={{ margin: 0, color: '#1f1f1f' }}>
              {aiTitleLabel}
            </Title>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Button type="text" icon={<SlidersOutlined />} style={{ color: '#4b5563' }} onClick={() => setShowSettingsModal(true)} />
            <Popover
              open={showMorePopover}
              onOpenChange={(v) => setShowMorePopover(v)}
              trigger="click"
              placement="bottomRight"
              overlayStyle={{ pointerEvents: 'auto' }}
              content={(
                <div onClick={() => { setShowMorePopover(false); setShowDeleteModal(true) }} style={{ padding: '12px 14px', width: 260, cursor: 'pointer' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>删除聊天记录</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>聊天记录仅对你可见。</div>
                </div>
              )}
            >
              <Button type="text" icon={<MoreOutlined />} style={{ color: '#4b5563' }} />
            </Popover>
          </div>
        </div>
      </div>
      
      
      
      {/* 消息列表（统一为 AI智能中心样式结构）*/}
      <div ref={messagesContainerRef} className="messages-container" style={{ flex: 1, paddingBottom: '140px', minHeight: 0 }}>
        <div className="messages-list">
        {messages.map((msg, index) => {
          // 查找对应的用户问题
          const correspondingUserMessage = msg.type === 'assistant' ? 
            messages.slice(0, index).reverse().find(m => m.type === 'user') : null;
          
          return (
            <div key={msg.id} className={`message-item ${msg.type === 'user' ? 'user' : 'ai'}`}>
              {msg.kind === 'summary' ? (
                <div style={{ width: '100%' }}>
                  <div style={{ padding: '0', maxWidth: 860, margin: '0 auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <Title level={5} style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{state?.note?.title || '新教师教学方法培训'}</Title>
                       </div>
                    {showSourcesLine && (
                      <Text style={{ color: '#6b7280', fontSize: 14, display: 'block', marginBottom: 16 }}>{`${uploadedFiles.length + addedTexts.length + courseVideos.length + links.length + (Array.isArray(organizationalCourses) ? organizationalCourses.length : 0)} 个来源`}</Text>
                    )}
                    <Paragraph style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: '#374151' }}>
                      {msg.content}
                    </Paragraph>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
                      <Button size="middle" style={{ borderRadius: 24, height: 40 }} icon={<SaveOutlined />} onClick={() => handleSaveToNote(msg.content, correspondingUserMessage?.content)}>保存到笔记</Button>
                      <Button size="middle" style={{ borderRadius: 24, height: 40 }} icon={<VideoCameraOutlined />} onClick={() => handleOperationClick('video')}>视频概览</Button>
                      <Button size="middle" style={{ borderRadius: 24, height: 40 }} icon={<AudioOutlined />} onClick={() => handleOperationClick('audio')}>音频概览</Button>
                      <Button size="middle" style={{ borderRadius: 24, height: 40 }} icon={<BranchesOutlined />} onClick={() => handleOperationClick('mindmap')}>思维导图</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  
                  <div className="message-text" style={compactMode ? { padding: '8px 12px' } : undefined}>
                    {msg.content}
                    {Array.isArray(msg.recommendations) && msg.recommendations.length > 0 && (
                      <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
                        {msg.recommendations.map((rec, ri) => (
                          <div key={`rec-${ri}`} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, alignItems: 'start' }}>
                            <div
                              onClick={() => openVideoFromRecommendation(rec)}
                              style={{
                                width: '100%',
                                aspectRatio: '4 / 3',
                                background: '#f1f5f9',
                                border: '1px solid #e5e7eb',
                                borderRadius: 8,
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                              title="点击播放视频"
                            >
                              <img src={rec.thumbSrc} alt={rec.thumbAlt || '课程缩略图'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: 6 }}>{rec.title}</div>
                              {Array.isArray(rec.bullets) && (
                                <ul style={{ margin: 0, paddingLeft: 18, color: '#334155', lineHeight: 1.7 }}>
                                  {rec.bullets.map((b, bi) => (
                                    <li key={`b-${ri}-${bi}`}>{b}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                  )}
                </div>
                {msg.type === 'user' && (
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
                )}
                  {msg.type !== 'user' && (
                    <div className="message-actions">
                      <Button
                        size="small"
                        type="text"
                        icon={<SaveOutlined />}
                        onClick={() => handleSaveToNote(msg.content, correspondingUserMessage?.content)}
                        style={{ fontSize: '12px', color: '#6b7280' }}
                      >
                        保存到笔记
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="message-item ai">
            <div className="message-text">
              <div className="typing-indicator"><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        </div>
      </div>
      
      {/* 底部固定区域 */}
      <div ref={bottomAreaRef} style={{ 
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        borderTop: '1px solid #f0f0f0',
        backgroundColor: '#fff',
        zIndex: 10,
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px'
      }}>
        {/* 常见问题按钮 */}
        <div style={{ padding: '16px 20px 0 20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflow: 'hidden' }}>
            {questionsToShow.map(question => (
              <Button 
                key={question.key}
                size="small" 
                style={{ 
                  borderRadius: '16px', 
                  fontSize: '11px',
                  flex: '1 1 0',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => setInputMessage(question.message)}
                title={question.text}
              >
                {question.text}
              </Button>
            ))}
          </div>
        </div>
        
        {/* 输入区域（统一 AI中心样式容器）*/}
        <div className="chat-input-container" style={{ width: '100%' }}>
          <div className="input-container" style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 选中资料数量提示 - 浮动显示 */}
            {selectedMaterials.length > 0 && (
              <div style={{ 
                position: 'absolute',
                top: '-24px',
                left: '0',
                padding: '2px 8px', 
                backgroundColor: '#f6ffed', 
                border: '1px solid #b7eb8f', 
                borderRadius: '12px',
                fontSize: '10px',
                color: '#52c41a',
                zIndex: 10,
                whiteSpace: 'nowrap'
              }}>
                📋 {selectedMaterials.length}个资料
              </div>
            )}
            <Input.TextArea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={selectedMaterials.length > 0 ? `基于已选择的 ${selectedMaterials.length} 个资料，请输入您的问题...` : "请输入您的问题..."}
              autoSize={{ minRows: 1, maxRows: 3 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="custom-textarea"
            />
            <ChatActionButtons 
              onSend={handleSendMessage}
              disabledSend={!inputMessage.trim()}
              loading={isLoading}
              setInputMessage={setInputMessage}
            />
          </div>
        </div>
      </div>
      {videoModalVisible && (
        <VideoPlayer
          visible={videoModalVisible}
          onClose={() => setVideoModalVisible(false)}
          videoData={videoData || { title: '推荐视频', url: '/assets/demo1.mp4' }}
        />
      )}
      <Modal
        open={showDeleteModal}
        title={null}
        centered
        closable
        maskClosable={false}
        onCancel={() => setShowDeleteModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowDeleteModal(false)}>取消</Button>,
          <Button key="delete" type="primary" onClick={() => { setMessages([]); setShowDeleteModal(false); message.success('聊天记录已删除'); }}>删除</Button>
        ]}
      >
        <div style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 12 }}>删除此笔记的聊天记录</div>
        <div style={{ fontSize: 14, color: '#6b7280' }}>你将删除此笔记的全部聊天记录，该操作不可撤销。</div>
      </Modal>
      <Modal
        open={showSettingsModal}
        title={null}
        centered
        closable
        maskClosable={true}
        onCancel={() => setShowSettingsModal(false)}
        footer={[
          <Button key="save" type="primary" onClick={() => setShowSettingsModal(false)}>保存</Button>
        ]}
      >
        <div style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 6 }}>配置对话</div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>可以根据不同目标定制笔记助手：做研究、帮助学习、展示多视角，或采用特定语气与风格。</div>
        <div style={{ marginBottom: 12, fontSize: 13, color: '#374151' }}>选择对话目标/风格/角色</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <Button type={roleMode === 'default' ? 'primary' : 'default'} onClick={() => setRoleMode('default')}>默认</Button>
          <Button type={roleMode === 'learning' ? 'primary' : 'default'} onClick={() => setRoleMode('learning')}>学习指导</Button>
          <Button type={roleMode === 'custom' ? 'primary' : 'default'} onClick={() => setRoleMode('custom')}>自定义</Button>
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>适合通用研究与头脑风暴任务。</div>
        <div style={{ marginBottom: 12, fontSize: 13, color: '#374151' }}>选择回复长度</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type={responseLength === 'default' ? 'primary' : 'default'} onClick={() => setResponseLength('default')}>默认</Button>
          <Button type={responseLength === 'longer' ? 'primary' : 'default'} onClick={() => setResponseLength('longer')}>更长</Button>
          <Button type={responseLength === 'shorter' ? 'primary' : 'default'} onClick={() => setResponseLength('shorter')}>更短</Button>
        </div>
        <div style={{ marginTop: 16, marginBottom: 12, fontSize: 13, color: '#374151' }}>选择模型</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type={modelProvider === 'deepseek' ? 'primary' : 'default'} onClick={() => setModelProvider('deepseek')}>DeepSeek</Button>
          <Button type={modelProvider === 'doubao' ? 'primary' : 'default'} onClick={() => setModelProvider('doubao')}>豆包</Button>
          <Button type={modelProvider === 'qwen' ? 'primary' : 'default'} onClick={() => setModelProvider('qwen')}>阿里千问</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AIChat;
