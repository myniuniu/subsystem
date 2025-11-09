import React, { useState } from 'react';
import { Modal, Input, Button, Tag, message, Tooltip } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined, ShareAltOutlined, StarOutlined, StarFilled, SmileOutlined, PictureOutlined, ScissorOutlined, SendOutlined } from '@ant-design/icons';
import { Megaphone, Search, Settings, UserPlus, X as CloseIcon } from 'lucide-react';
import './TopicDiscussion.css';

const TopicDiscussion = ({ onBookmarkTopic, openTopicId = null, compact = false, embedded = false, onRequestClose }) => {
  const [activeTab, setActiveTab] = useState('全部');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [expandedIds, setExpandedIds] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // 模拟每个话题的最近回复（用于卡片预览，展示最新2条）
  const mockReplies = React.useMemo(() => ({
    1: [
      { user: '李仕佳', avatar: '👨‍🏫', text: '怪不得你这么考虑', time: '刚刚' },
      { user: '铁冰ice', avatar: '🧊', text: '但无论怎样摘要异步执行就失了这个中间作用', time: '1分钟前' },
      { user: '培训管理员', avatar: '🎓', text: '欢迎补充更多案例与做法', time: '3分钟前' }
    ],
    2: [
      { user: '学员王小明', avatar: '🧑‍🏫', text: '我也在准备观察维度的表格', time: '刚刚' },
      { user: '教研助理', avatar: '🛠', text: '模板已上传至资源区', time: '2分钟前' }
    ],
    3: [
      { user: '培训管理员', avatar: '🎓', text: '评分标准文档已更新至v2', time: '刚刚' },
      { user: '学员李华', avatar: '👩‍🏫', text: '已经下载并阅读', time: '5分钟前' }
    ],
    4: [
      { user: '学员李华', avatar: '👩‍🏫', text: '资源位置找到了，感谢', time: '刚刚' },
      { user: '学员王小明', avatar: '🧑‍🏫', text: '准备把方法融入到微课中', time: '2分钟前' }
    ],
    5: [
      { user: '教研助理', avatar: '📝', text: '欢迎反馈更多课堂观察维度', time: '刚刚' },
      { user: '培训管理员', avatar: '🎓', text: '周日晚研讨，别忘了参与', time: '4分钟前' }
    ]
  }), []);

  const getRecentReplies = (postId, count = 2) => {
    const arr = mockReplies[postId] || [];
    if (arr.length <= count) return arr;
    return arr.slice(-count);
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const openDetail = (post) => {
    setSelectedPost(post);
    setShowDetail(true);
  };
  const closeDetail = () => {
    setShowDetail(false);
    setSelectedPost(null);
  };

  // 主题相关的初始帖子（围绕“新教师教学方法培训”）
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: '培训管理员',
      avatar: '🎓',
      time: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      title: '直播/录播/研讨与实践安排（置顶）',
      content: '欢迎加入“新教师教学方法培训”。直播周五19:30—21:00；录播24小时内上线；研讨周日20:00；实践作业下周三截止。请提前准备10分钟微课的教学流程与互动设计草案。',
      attachments: ['课程主页/资源', '研讨群公告', '课堂观察表模板'],
      pinned: true,
      liked: false,
      likes: 12,
      bookmarked: true,
      comments: 3,
    },
    {
      id: 2,
      author: '学员王小明',
      avatar: '🧑‍🏫',
      time: new Date(Date.now() - 60 * 60 * 1000).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      title: '微课互动设计是否需要准备评估表？',
      content: '请问研讨的“互动设计”是否需要准备课堂观察表或学生反馈问卷？如果有模板能否提供？',
      attachments: ['互动设计示例'],
      liked: false,
      likes: 8,
      bookmarked: false,
      comments: 2,
    },
    {
      id: 3,
      author: '培训管理员',
      avatar: '📌',
      time: new Date(Date.now() - 55 * 60 * 1000).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      title: '评分标准说明',
      content: '实践作业评分包含目标清晰、活动设计、评价方式、课堂管理四项，各25分；优秀≥90分。提交方式：在“作业提交”入口上传PDF与教学演示视频（命名：姓名-学科-微课题目）。',
      attachments: ['评分标准', '提交入口'],
      liked: true,
      likes: 23,
      bookmarked: false,
      comments: 6,
    },
    {
      id: 4,
      author: '学员李华',
      avatar: '👩‍🏫',
      time: new Date(Date.now() - 40 * 60 * 1000).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      title: '课堂管理技巧的资源位置？',
      content: '想请问“课堂管理技巧”的资料在哪个栏目可以找到？我准备把它融入到微课的流程中。',
      attachments: ['资源区/课堂管理', '示例课件'],
      liked: false,
      likes: 5,
      bookmarked: false,
      comments: 1,
    },
    {
      id: 5,
      author: '教研助理',
      avatar: '📝',
      time: new Date(Date.now() - 30 * 60 * 1000).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      title: '研讨话题更新：新教师课堂管理技巧',
      content: '已创建研讨话题“新教师课堂管理技巧”，欢迎提前留言；本话题下方附上观察维度（教师行为、学生参与、时间分配）。',
      attachments: ['研讨话题链接', '观察维度'],
      liked: false,
      likes: 7,
      bookmarked: false,
      comments: 4,
    },
  ]);

  const toggleLike = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? Math.max(0, (p.likes||0) - 1) : (p.likes||0) + 1 } : p));
  };

  const toggleBookmark = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const next = { ...p, bookmarked: !p.bookmarked };
      // 收藏时，将话题显示到会话列表
      if (next.bookmarked && typeof onBookmarkTopic === 'function') {
        onBookmarkTopic(next);
      }
      return next;
    }));
  };

  const handleShare = () => {
    const post = selectedPost;
    if (!post) return;
    const link = `${window.location.origin}${window.location.pathname}#message-center?topic=${post.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link)
        .then(() => message.success('链接已复制到剪贴板'))
        .catch(() => message.success('分享链接已生成'));
    } else {
      message.success('分享链接已生成');
    }
  };

  // 外部请求打开指定话题详情（从会话列表点击）
  React.useEffect(() => {
    if (!openTopicId) return;
    const target = posts.find(p => p.id === openTopicId);
    if (target) {
      setSelectedPost(target);
      // 从会话列表进入：直接显示详情页，而非滑出层
      setShowDetail(false);
    }
  }, [openTopicId]);

  // 会话列表进入话题详情：右侧整页显示详情
  if (openTopicId && selectedPost) {
    return (
      <div className="detail-page">
        <div className="detail-header">
          <div className="detail-title">{selectedPost.title}</div>
          <div className="detail-header-actions">
            <button className="icon-btn" title="分享" onClick={handleShare}><ShareAltOutlined /></button>
            <button className={`icon-btn ${selectedPost.bookmarked ? 'active' : ''}`} title={selectedPost.bookmarked ? '取消收藏' : '收藏'} onClick={() => toggleBookmark(selectedPost.id)}>
              {selectedPost.bookmarked ? <StarFilled /> : <StarOutlined />}
            </button>
          </div>
        </div>

        {/* 设置面板（在左侧内容与右侧工具栏之间） */}
        {showSettings && (
          <div className="settings-panel show">
            <div className="settings-header">
              <div className="settings-title">设置</div>
              <button className="settings-close-btn" onClick={() => setShowSettings(false)} aria-label="关闭设置"><CloseIcon size={16} /></button>
            </div>
            <div className="settings-content">
              <div className="settings-section">
                <div className="section-title">群成员</div>
                <div className="card-row">
                  <span>成员管理</span>
                  <button className="card-btn">打开</button>
                </div>
              </div>
              <div className="settings-section">
                <div className="section-title">标签</div>
                <div className="card-row">
                  <span>添加标签</span>
                  <button className="card-btn">添加</button>
                </div>
              </div>
              <div className="settings-section">
                <div className="section-title">提醒</div>
                <div className="card-row">
                  <span>消息免打扰</span>
                  <input type="checkbox" className="card-checkbox" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="detail-main" style={{ flex: 1, overflowY: 'auto' }}>
          <div className="detail-block">
            <div className="detail-meta">
              <div className="detail-avatar">{selectedPost.avatar || '👤'}</div>
              <div className="detail-meta-info">
                <div className="detail-author">{selectedPost.author || '发布人'}</div>
                <div className="detail-time">{selectedPost.time}</div>
              </div>
            </div>
            <div style={{ color: '#1f2937', lineHeight: 1.7, marginTop: 6 }}>{selectedPost.content}</div>
            {selectedPost.attachments && selectedPost.attachments.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {selectedPost.attachments.map(a => (<span key={a} className="chip">{a}</span>))}
              </div>
            )}
          </div>
          <div className="detail-block">
            <div style={{ fontWeight: 600, marginBottom: 6 }}>话题相关讨论</div>
            <div style={{ color: '#334155' }}>
              本帖围绕“新教师教学方法培训”的研讨安排、互动设计、评分标准与课堂管理等展开。
            </div>
          </div>
          <div className="detail-comments">
            {[ 
              { user: '教研助理', avatar: '🛠', text: '评分标准已同步到资源区，欢迎下载查看。', time: '刚刚' },
              { user: '学员王小明', avatar: '🧑‍🏫', text: '已下载模板，准备按照观察维度完善微课流程。', time: '1分钟前' },
              { user: '培训管理员', avatar: '🎓', text: '周日晚20:00研讨，欢迎提前留言讨论互动设计。', time: '3分钟前' },
            ].map((c, idx) => (
              <div key={idx} className="comment-item">
                <div className="comment-avatar">{c.avatar}</div>
                <div className="comment-content">
                  <div className="comment-meta"><span style={{ fontWeight: 600, color: '#2c3e50' }}>{c.user}</span><span>{c.time}</span></div>
                  <div className="comment-text">{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 底部操作区（点赞/收藏/订阅/提醒）已移除，根据最新需求不再展示 */}
        <div className="detail-input">
          <Input.Search placeholder="输入评论...（与本话题相关）" enterButton="发送" onSearch={(val) => { if (!val) return; message.success('评论已发布（占位）'); }} />
        </div>
      </div>
    );
  }

  const createPost = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      message.warning('请填写标题与内容');
      return;
    }
    const post = {
      id: Date.now(),
      author: '我',
      avatar: '🧑',
      time: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      title: newTitle.trim(),
      content: newContent.trim(),
      attachments: [],
    };
    setPosts(prev => [post, ...prev]);
    setShowNewPost(false);
    setNewTitle('');
    setNewContent('');
    message.success('已发布话题');
  };

  const memberCount = 2;
  return (
    <div className={`topic-page ${embedded ? 'embedded' : ''}`}>
      <div className={`topic-body ${embedded ? 'embedded' : ''}`}>
        <div className="topic-list" aria-label="话题列表">
          {/* 左侧标题区（不跨越右侧工具栏） */}
          <div className="topic-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="topic-title"><span className="emoji">📚</span>【组织培训】新教师教学方法培训讨论</div>
              <div className="topic-header-actions">
                <Tooltip title="添加群成员"><button className="add-member-btn"><UserPlus size={16} /><span style={{ marginLeft: 6 }}>添加群成员</span></button></Tooltip>
                {embedded && (
                  <Tooltip title="关闭">
                    <button className="close-btn" onClick={(e)=>{ e.stopPropagation(); if (typeof onRequestClose==='function') onRequestClose(); }} aria-label="关闭">
                      <CloseIcon size={16} />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className="topic-members"><span className="members-icon">👥</span><span>{memberCount}</span></div>
            <div className="topic-tabs" style={{ marginTop: 8 }}>
              {['全部','我订阅的'].map(tab => (
                <button key={tab} className={`topic-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              ))}
            </div>
          </div>
          {/* 置顶公告 */}
          {posts.filter(p => p.pinned).map(p => (
            <div key={`pinned-${p.id}`} className="pinned-announcement">
              <div className="pinned-title">📌 {p.title}</div>
              <div style={{ color: '#34495e' }}>{p.content}</div>
              <div className="pinned-meta">{p.author} · {p.time}</div>
            </div>
          ))}

          {/* 帖子列表（根据“我订阅的”筛选） */}
          {posts.filter(p => !p.pinned && (activeTab === '全部' || p.bookmarked)).map(post => (
            !post.pinned && (
              <div key={post.id} className="post-card" onClick={() => openDetail(post)} style={{ cursor: 'pointer' }}>
                <div className="post-header">
                  <div className="post-author"><span className="post-avatar">{post.avatar}</span><span>{post.author}</span></div>
                  <div className="post-time">{post.time}</div>
                </div>
                <div className="post-body">
                  <div className="post-title">{post.title}</div>
                  <div>
                    {expandedIds.includes(post.id) ? post.content : (post.content.length > 88 ? post.content.slice(0, 88) + '…' : post.content)}
                  </div>
                  {post.content.length > 88 && (
                    <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleExpand(post.id); }}>{expandedIds.includes(post.id) ? '收起' : '展开'}</button>
                  )}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="post-attachments">
                      {post.attachments.map(a => (<span key={a} className="chip">{a}</span>))}
                    </div>
                  )}
                </div>
                {/* 最近回复预览（展示2条） */}
                {getRecentReplies(post.id).length > 0 && (
                  <div className="replies-preview">
                    <div className="replies-header">查看更早 18 条回复</div>
                    {getRecentReplies(post.id).map((r, idx) => (
                      <div key={`${post.id}-reply-${idx}`} className="reply-item">
                        <div className="reply-avatar">{r.avatar}</div>
                        <div className="reply-content"><span className="reply-author">{r.user}</span>{r.text}</div>
                        <div className="reply-time">{r.time}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="post-actions">
                  <button className={`action-btn ${post.liked ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}>
                    {post.liked ? <LikeFilled /> : <LikeOutlined />}<span>{post.likes || 0}</span>
                  </button>
                  <button className="action-btn" title="评论" onClick={(e) => e.stopPropagation()}>
                    <MessageOutlined /><span>{post.comments || ''}</span>
                  </button>
                  <button className="action-btn" title="分享" onClick={(e) => { e.stopPropagation(); message.success('链接已复制到剪贴板（占位）'); } }>
                    <ShareAltOutlined /><span>分享</span>
                  </button>
                  <button className={`action-btn ${post.bookmarked ? 'active' : ''}`} title="订阅" onClick={(e) => { e.stopPropagation(); toggleBookmark(post.id); }}>
                    {post.bookmarked ? <StarFilled /> : <StarOutlined />}<span>{post.bookmarked ? '已订阅' : '订阅'}</span>
                  </button>
                </div>
              </div>
            )
          ))}
          {showDetail && selectedPost && (
            <div className={`detail-panel ${showDetail ? 'show' : ''}`}>
              <button className="detail-close" onClick={(e) => { e.stopPropagation(); closeDetail(); }} aria-label="关闭详情">×</button>
              <div className="detail-header">
                <div className="detail-title">{selectedPost.title}</div>
                <div className="detail-header-actions absolute">
                  <button className="icon-btn" title="分享" onClick={handleShare}><ShareAltOutlined /></button>
                  <button className={`icon-btn ${selectedPost.bookmarked ? 'active' : ''}`} title={selectedPost.bookmarked ? '取消订阅' : '订阅'} onClick={() => toggleBookmark(selectedPost.id)}>
                    {selectedPost.bookmarked ? <StarFilled /> : <StarOutlined />}
                  </button>
                </div>
              </div>
              <div className="detail-main" style={{ flex: 1, overflowY: 'auto' }}>
                <div className="detail-block">
                  <div className="detail-meta">
                    <div className="detail-avatar">{selectedPost.avatar || '👤'}</div>
                    <div className="detail-meta-info">
                      <div className="detail-author">{selectedPost.author || '发布人'}</div>
                      <div className="detail-time">{selectedPost.time}</div>
                    </div>
                  </div>
                  <div style={{ color: '#1f2937', lineHeight: 1.7, marginTop: 6 }}>{selectedPost.content}</div>
                  {selectedPost.attachments && selectedPost.attachments.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {selectedPost.attachments.map(a => (<span key={a} className="chip">{a}</span>))}
                    </div>
                  )}
                </div>
                <div className="detail-block">
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>话题相关讨论</div>
                  <div style={{ color: '#334155' }}>
                    本帖围绕“新教师教学方法培训”的研讨安排、互动设计、评分标准与课堂管理等展开。
                  </div>
                </div>
                <div className="detail-comments">
                  {[ 
                    { user: '教研助理', avatar: '🛠', text: '评分标准已同步到资源区，欢迎下载查看。', time: '刚刚' },
                    { user: '学员王小明', avatar: '🧑‍🏫', text: '已下载模板，准备按照观察维度完善微课流程。', time: '1分钟前' },
                    { user: '培训管理员', avatar: '🎓', text: '周日晚20:00研讨，欢迎提前留言讨论互动设计。', time: '3分钟前' },
                  ].map((c, idx) => (
                    <div key={idx} className="comment-item">
                      <div className="comment-avatar">{c.avatar}</div>
                      <div className="comment-content">
                        <div className="comment-meta"><span style={{ fontWeight: 600, color: '#2c3e50' }}>{c.user}</span><span>{c.time}</span></div>
                        <div className="comment-text">{c.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 底部操作区（点赞/收藏/订阅/提醒）已移除，根据最新需求不再展示 */}
              <div className="detail-input">
                <Input.Search placeholder="输入评论...（与本话题相关）" enterButton="发送" onSearch={(val) => { if (!val) return; message.success('评论已发布（占位）'); }} />
              </div>
            </div>
          )}
          {/* 右下角新建按钮（在左侧区域，详情页时隐藏） */}
          {!showDetail && (
            <button className="floating-new-btn" title="新建话题" onClick={() => setShowNewPost(true)}>＋</button>
          )}
        </div>

        {/* 设置面板（在左侧内容与右侧工具栏之间） */}
        {showSettings && (
          <div className="settings-panel show">
            <div className="settings-header">
              <div className="settings-title">设置</div>
              <button className="settings-close-btn" onClick={() => setShowSettings(false)} aria-label="关闭设置"><CloseIcon size={16} /></button>
            </div>
            <div className="settings-content">
              {/* 顶部群信息 */}
              <div className="settings-group-header">
                <div className="group-avatar">👥</div>
                <div className="group-meta">
                  <div className="group-name">张洪磊, 金朴峰</div>
                  <div><span className="group-edit-link">编辑群信息</span></div>
                </div>
                <div className="group-actions">
                  <span className="group-action-icon" title="群概览">⎇</span>
                  <span className="group-action-icon" title="外部分享">↗</span>
                </div>
              </div>

              {/* 群成员 */}
              <div className="settings-section">
                <h4>群成员 <span style={{ color:'#9aa3af' }}>{memberCount}</span></h4>
                <input className="settings-search" placeholder="搜索" />
                <div className="members-row">
                  <div className="member-chip"><span>🧑</span><span>张洪磊</span></div>
                  <div className="member-chip"><span>🧑</span><span>林峰</span></div>
                  <button className="circle-btn" title="添加">＋</button>
                  <button className="circle-btn" title="移除">－</button>
                </div>
              </div>

              {/* 群机器人 */}
              <div className="settings-section">
                <div className="list-row">
                  <span>群机器人</span>
                  <span className="chevron">›</span>
                </div>
              </div>

              {/* 群管理 */}
              <div className="settings-section">
                <div className="list-row">
                  <span>群管理</span>
                  <span className="chevron">›</span>
                </div>
              </div>

              {/* 群昵称 */}
              <div className="settings-section">
                <h4>群昵称</h4>
                <input className="settings-input" placeholder="添加我在本群的昵称" />
              </div>

              {/* 标签 */}
              <div className="settings-section">
                <h4>标签 <span style={{ color:'#64748b' }}>添加标签</span></h4>
                <div className="list-row">
                  <span>标签管理</span>
                  <span className="chevron">›</span>
                </div>
              </div>

              {/* 开关选项 */}
              <div className="settings-section">
                <div className="checkbox-list">
                  <label className="checkbox-row"><input type="checkbox" /> 消息免打扰</label>
                  <label className="checkbox-row"><input type="checkbox" /> @所有人的消息不提示</label>
                  <label className="checkbox-row"><input type="checkbox" /> 置顶会话</label>
                  <label className="checkbox-row"><input type="checkbox" /> 添加到标记</label>
                </div>
              </div>

              {/* 翻译助手 */}
              <div className="settings-section">
                <div className="list-row">
                  <span>翻译助手</span>
                  <span className="chevron">›</span>
                </div>
              </div>

              {/* 底部危险操作 */}
              <div className="danger-actions">
                <button className="danger-btn">退出话题群</button>
                <button className="danger-btn">解散群组</button>
              </div>
            </div>
          </div>
        )}

        {/* 右侧竖向工具栏：仅保留公告、搜索、设置 */}
        <div className="topic-toolbar" aria-label="话题工具">
          <Tooltip title="公告"><button className="tool-btn"><Megaphone size={18} /></button></Tooltip>
          <Tooltip title="搜索"><button className="tool-btn"><Search size={18} /></button></Tooltip>
          <Tooltip title="设置"><button className="tool-btn" onClick={() => setShowSettings(true)}><Settings size={18} /></button></Tooltip>
        </div>
      </div>

      <Modal
        open={showNewPost}
        onCancel={() => setShowNewPost(false)}
        footer={null}
        title={null}
        centered
        width={'80%'}
        className="new-topic-editor"
      >
        <div className="editor-toolbar">
          <button className="tool-btn">B</button>
          <button className="tool-btn">S</button>
          <button className="tool-btn">I</button>
          <button className="tool-btn">U</button>
          <button className="tool-btn">“”</button>
          <button className="tool-btn">•</button>
          <button className="tool-btn">#</button>
          <button className="tool-btn">{`{}`}</button>
        </div>
        <div className="editor-area">
          <textarea
            className="editor-input"
            placeholder="分享你的想法..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
        </div>
        {/* 右下角工具按钮（完整复刻） */}
        <div className="editor-bottom-tools">
          <button className="bottom-tool-btn" title="表情"><SmileOutlined /></button>
          <button className="bottom-tool-btn" title="@提及">@</button>
          <button className="bottom-tool-btn" title="图片"><PictureOutlined /></button>
          <button className="bottom-tool-btn" title="剪切"><ScissorOutlined /></button>
          <button className="bottom-tool-btn primary" title="发送" onClick={createPost}><SendOutlined /></button>
        </div>
      </Modal>

      {/* 右侧面板已改为覆盖列表区域的滑出层 */}
    </div>
  );
};

export default TopicDiscussion;