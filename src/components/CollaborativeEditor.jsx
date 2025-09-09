import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Avatar,
  Tooltip,
  Badge,
  Space,
  Typography,
  Tabs,
  List,
  Form,
  message,
  Divider,
  Tag,
  Popover,
  Modal,
  Upload,
  Progress,
  Spin
} from 'antd';
import {
  SaveOutlined,
  ShareAltOutlined,
  CommentOutlined,
  UserAddOutlined,
  HistoryOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  BellOutlined,
  SettingOutlined,
  FullscreenOutlined,
  CompressOutlined
} from '@ant-design/icons';
import './CollaborativeEditor.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CollaborativeEditor = ({ projectId, projectTitle, onBack }) => {
  // 编辑器状态
  const [content, setContent] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(true);
  const [documentHistory, setDocumentHistory] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // 文档管理状态
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: '教学大纲',
      type: 'outline',
      content: '# 高中数学-函数与导数教学大纲\n\n## 教学目标\n1. 理解函数的概念和性质\n2. 掌握导数的定义和计算方法\n3. 能够运用导数解决实际问题\n\n## 教学重点\n- 函数的单调性\n- 导数的几何意义\n- 导数的应用\n\n## 教学难点\n- 复合函数的导数\n- 导数在优化问题中的应用',
      author: '张老师',
      lastModified: '2024-01-15 16:30',
      status: 'editing',
      collaborators: ['张老师', '李老师']
    },
    {
      id: 2,
      name: '课件内容',
      type: 'slides',
      content: '# 函数与导数\n\n## 第一节：函数的概念\n\n### 定义\n函数是一种特殊的对应关系...\n\n### 性质\n1. 单调性\n2. 奇偶性\n3. 周期性',
      author: '李老师',
      lastModified: '2024-01-15 15:20',
      status: 'reviewing',
      collaborators: ['李老师', '王老师']
    },
    {
      id: 3,
      name: '练习题库',
      type: 'exercises',
      content: '# 函数与导数练习题\n\n## 基础题\n1. 求函数f(x) = x² + 2x + 1的导数\n2. 判断函数的单调性\n\n## 提高题\n1. 利用导数求函数的极值\n2. 导数的实际应用问题',
      author: '王老师',
      lastModified: '2024-01-15 16:10',
      status: 'completed',
      collaborators: ['王老师']
    }
  ]);
  
  const [currentDocument, setCurrentDocument] = useState(documents[0]);
  const [activeTab, setActiveTab] = useState('editor');
  
  // 模拟在线用户
  useEffect(() => {
    const users = [
      { id: 'user1', name: '张老师', avatar: '👨‍🏫', status: 'editing', cursor: 120 },
      { id: 'user2', name: '李老师', avatar: '👩‍🏫', status: 'viewing', cursor: 0 },
      { id: 'user3', name: '王老师', avatar: '👨‍💼', status: 'commenting', cursor: 250 }
    ];
    setActiveUsers(users);
    
    // 模拟评论数据
    const mockComments = [
      {
        id: 1,
        author: '李老师',
        avatar: '👩‍🏫',
        content: '这个教学目标设定得很好，建议在第二点中增加具体的计算方法说明。',
        time: '2024-01-15 14:30',
        position: 150,
        replies: [
          {
            id: 11,
            author: '张老师',
            avatar: '👨‍🏫',
            content: '好的，我会补充更详细的计算步骤。',
            time: '2024-01-15 14:35'
          }
        ]
      },
      {
        id: 2,
        author: '王老师',
        avatar: '👨‍💼',
        content: '教学难点部分可以考虑增加一些具体的例题来帮助学生理解。',
        time: '2024-01-15 15:10',
        position: 280,
        replies: []
      }
    ];
    setComments(mockComments);
    
    // 模拟文档历史
    const history = [
      {
        id: 1,
        action: '创建文档',
        user: '张老师',
        time: '2024-01-15 09:00',
        changes: '创建了教学大纲文档'
      },
      {
        id: 2,
        action: '编辑内容',
        user: '李老师',
        time: '2024-01-15 14:30',
        changes: '修改了教学目标部分'
      },
      {
        id: 3,
        action: '添加评论',
        user: '王老师',
        time: '2024-01-15 15:10',
        changes: '在教学难点部分添加了建议'
      }
    ];
    setDocumentHistory(history);
  }, []);
  
  // 模拟自动保存
  useEffect(() => {
    const timer = setInterval(() => {
      if (content !== currentDocument.content) {
        handleSave();
      }
    }, 30000); // 30秒自动保存
    
    return () => clearInterval(timer);
  }, [content, currentDocument.content]);
  
  // 处理内容变化
  const handleContentChange = (e) => {
    setContent(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };
  
  // 处理文本选择
  const handleTextSelect = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    if (start !== end) {
      setSelectedText(e.target.value.substring(start, end));
    } else {
      setSelectedText('');
    }
  };
  
  // 保存文档
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 模拟保存API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新文档内容
      const updatedDocuments = documents.map(doc => 
        doc.id === currentDocument.id 
          ? { ...doc, content, lastModified: new Date().toLocaleString('zh-CN') }
          : doc
      );
      setDocuments(updatedDocuments);
      setCurrentDocument(prev => ({ ...prev, content, lastModified: new Date().toLocaleString('zh-CN') }));
      
      setLastSaved(new Date());
      message.success('文档已保存');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };
  
  // 切换文档
  const handleDocumentChange = (doc) => {
    if (content !== currentDocument.content) {
      Modal.confirm({
        title: '未保存的更改',
        content: '当前文档有未保存的更改，是否保存？',
        onOk: async () => {
          await handleSave();
          setCurrentDocument(doc);
          setContent(doc.content);
        },
        onCancel: () => {
          setCurrentDocument(doc);
          setContent(doc.content);
        }
      });
    } else {
      setCurrentDocument(doc);
      setContent(doc.content);
    }
  };
  
  // 添加评论
  const handleAddComment = (commentText) => {
    const newComment = {
      id: Date.now(),
      author: '当前用户',
      avatar: '👤',
      content: commentText,
      time: new Date().toLocaleString('zh-CN'),
      position: cursorPosition,
      replies: []
    };
    setComments(prev => [...prev, newComment]);
    message.success('评论已添加');
  };
  
  // 回复评论
  const handleReplyComment = (commentId, replyText) => {
    const newReply = {
      id: Date.now(),
      author: '当前用户',
      avatar: '👤',
      content: replyText,
      time: new Date().toLocaleString('zh-CN')
    };
    
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, newReply] }
        : comment
    ));
    message.success('回复已添加');
  };
  
  // 获取状态标签
  const getStatusTag = (status) => {
    const statusMap = {
      editing: { color: 'blue', text: '编辑中' },
      reviewing: { color: 'orange', text: '审核中' },
      completed: { color: 'green', text: '已完成' }
    };
    const config = statusMap[status] || statusMap.editing;
    return <Tag color={config.color}>{config.text}</Tag>;
  };
  
  // 初始化内容
  useEffect(() => {
    setContent(currentDocument.content);
  }, [currentDocument]);
  
  return (
    <div className={`collaborative-editor ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* 顶部工具栏 */}
      <Card className="editor-toolbar">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button type="text" onClick={onBack}>
                ← 返回项目
              </Button>
              <Divider type="vertical" />
              <Title level={4} style={{ margin: 0 }}>
                {projectTitle} - {currentDocument.name}
              </Title>
              {getStatusTag(currentDocument.status)}
            </Space>
          </Col>
          
          <Col>
            <Space>
              {/* 在线用户 */}
              <Avatar.Group maxCount={3} size="small">
                {activeUsers.map(user => (
                  <Tooltip key={user.id} title={`${user.name} (${user.status})`}>
                    <Badge status={user.status === 'editing' ? 'processing' : 'default'} dot>
                      <Avatar size="small">{user.avatar}</Avatar>
                    </Badge>
                  </Tooltip>
                ))}
              </Avatar.Group>
              
              {/* 连接状态 */}
              <Badge 
                status={isConnected ? 'success' : 'error'} 
                text={isConnected ? '已连接' : '连接断开'}
              />
              
              {/* 保存状态 */}
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {isSaving ? (
                  <><SyncOutlined spin /> 保存中...</>
                ) : lastSaved ? (
                  <>已保存 {lastSaved.toLocaleTimeString()}</>
                ) : (
                  '未保存'
                )}
              </Text>
              
              {/* 工具按钮 */}
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                onClick={handleSave}
                loading={isSaving}
              >
                保存
              </Button>
              
              <Button 
                icon={<ShareAltOutlined />}
                onClick={() => message.info('分享功能开发中')}
              >
                分享
              </Button>
              
              <Button 
                icon={isFullscreen ? <CompressOutlined /> : <FullscreenOutlined />}
                onClick={() => setIsFullscreen(!isFullscreen)}
              />
            </Space>
          </Col>
        </Row>
      </Card>
      
      <div className="editor-content">
        <Row gutter={16} style={{ height: '100%' }}>
          {/* 左侧文档列表 */}
          <Col span={4} className="document-sidebar">
            <Card size="small" title="文档列表" style={{ height: '100%' }}>
              <List
                size="small"
                dataSource={documents}
                renderItem={doc => (
                  <List.Item
                    className={`document-item ${doc.id === currentDocument.id ? 'active' : ''}`}
                    onClick={() => handleDocumentChange(doc)}
                  >
                    <List.Item.Meta
                      avatar={<FileTextOutlined />}
                      title={doc.name}
                      description={
                        <div>
                          <div>{getStatusTag(doc.status)}</div>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            {doc.author} · {doc.lastModified}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          {/* 中间编辑区域 */}
          <Col span={showComments ? 14 : 20} className="editor-main">
            <Card style={{ height: '100%' }}>
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                items={[
                  {
                    key: 'editor',
                    label: '编辑器',
                    children: (
                      <div className="editor-container">
                        <TextArea
                          value={content}
                          onChange={handleContentChange}
                          onSelect={handleTextSelect}
                          placeholder="开始编写文档内容..."
                          className="main-editor"
                          style={{ 
                            height: isFullscreen ? 'calc(100vh - 200px)' : '500px',
                            fontSize: '14px',
                            lineHeight: '1.6'
                          }}
                        />
                        
                        {/* 光标位置指示器 */}
                        {activeUsers.map(user => (
                          user.cursor > 0 && (
                            <div
                              key={user.id}
                              className="cursor-indicator"
                              style={{
                                position: 'absolute',
                                top: Math.floor(user.cursor / 50) * 22 + 'px',
                                left: (user.cursor % 50) * 8 + 'px'
                              }}
                            >
                              <Tooltip title={user.name}>
                                <div className="cursor-line" style={{ borderColor: user.id === 'user1' ? '#1890ff' : '#52c41a' }} />
                              </Tooltip>
                            </div>
                          )
                        ))}
                      </div>
                    )
                  },
                  {
                    key: 'preview',
                    label: '预览',
                    children: (
                      <div className="preview-container">
                        <div className="markdown-preview">
                          {content.split('\n').map((line, index) => {
                            if (line.startsWith('# ')) {
                              return <h1 key={index}>{line.substring(2)}</h1>;
                            } else if (line.startsWith('## ')) {
                              return <h2 key={index}>{line.substring(3)}</h2>;
                            } else if (line.startsWith('### ')) {
                              return <h3 key={index}>{line.substring(4)}</h3>;
                            } else if (line.trim() === '') {
                              return <br key={index} />;
                            } else {
                              return <p key={index}>{line}</p>;
                            }
                          })}
                        </div>
                      </div>
                    )
                  },
                  {
                    key: 'history',
                    label: '历史',
                    children: (
                      <List
                        dataSource={documentHistory}
                        renderItem={item => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<HistoryOutlined />}
                              title={`${item.user} ${item.action}`}
                              description={
                                <div>
                                  <div>{item.changes}</div>
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {item.time}
                                  </Text>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    )
                  }
                ]}
              />
            </Card>
          </Col>
          
          {/* 右侧评论区域 */}
          {showComments && (
            <Col span={6} className="comments-sidebar">
              <Card 
                size="small" 
                title="评论与讨论" 
                extra={
                  <Button 
                    type="text" 
                    size="small" 
                    onClick={() => setShowComments(false)}
                  >
                    隐藏
                  </Button>
                }
                style={{ height: '100%' }}
              >
                <div className="comments-container">
                  {/* 添加评论 */}
                  <div className="add-comment">
                    <Form
                      onFinish={(values) => {
                        handleAddComment(values.comment);
                        values.comment = '';
                      }}
                    >
                      <Form.Item name="comment">
                        <TextArea 
                          rows={3} 
                          placeholder={selectedText ? `对"${selectedText}"添加评论...` : '添加评论...'}
                        />
                      </Form.Item>
                      <Form.Item style={{ marginBottom: 16 }}>
                        <Button type="primary" htmlType="submit" size="small" block>
                          添加评论
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  {/* 评论列表 */}
                  <div className="comments-list">
                    {comments.map(comment => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-wrapper">
                          <div className="comment-header">
                            <Avatar size="small">{comment.avatar}</Avatar>
                            <div className="comment-meta">
                              <span className="comment-author">{comment.author}</span>
                              <span className="comment-time">{comment.time}</span>
                            </div>
                          </div>
                          <div className="comment-content">{comment.content}</div>
                          
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="comment-reply">
                              <div className="comment-header">
                                <Avatar size="small">{reply.avatar}</Avatar>
                                <div className="comment-meta">
                                  <span className="comment-author">{reply.author}</span>
                                  <span className="comment-time">{reply.time}</span>
                                </div>
                              </div>
                              <div className="comment-content">{reply.content}</div>
                            </div>
                          ))}
                          
                          <Form
                            onFinish={(values) => {
                              handleReplyComment(comment.id, values.reply);
                              values.reply = '';
                            }}
                          >
                            <Form.Item name="reply">
                              <TextArea rows={2} placeholder="回复..." />
                            </Form.Item>
                            <Form.Item>
                              <Button type="link" htmlType="submit" size="small">
                                回复
                              </Button>
                            </Form.Item>
                          </Form>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          )}
        </Row>
      </div>
      
      {/* 底部状态栏 */}
      <div className="editor-status-bar">
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="large">
              <Text type="secondary">行 {Math.floor(cursorPosition / 50) + 1}, 列 {cursorPosition % 50 + 1}</Text>
              <Text type="secondary">字符数: {content.length}</Text>
              <Text type="secondary">协作者: {activeUsers.length} 人在线</Text>
            </Space>
          </Col>
          
          <Col>
            <Space>
              {!showComments && (
                <Button 
                  type="text" 
                  size="small" 
                  icon={<CommentOutlined />}
                  onClick={() => setShowComments(true)}
                >
                  显示评论 ({comments.length})
                </Button>
              )}
              
              <Button type="text" size="small" icon={<SettingOutlined />}>
                设置
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CollaborativeEditor;