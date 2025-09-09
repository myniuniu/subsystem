import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  Table,
  Modal,
  Space,
  Typography,
  Tag,
  Progress,
  Row,
  Col,
  Divider,
  List,
  Avatar,
  message,
  Tooltip,
  Popconfirm,
  Badge,
  Empty,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  TeamOutlined,
  HistoryOutlined,
  BookOutlined,
  SaveOutlined,
  CopyOutlined,
  SearchOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  FolderOutlined,
  CommentOutlined,
  SendOutlined,
  SettingOutlined,
  MessageOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { createEditor, createToolbar } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';
import editorInstanceManager from '../utils/editorInstanceManager';
import './LessonPreparation.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const LessonPreparation = () => {
  const [activeTab, setActiveTab] = useState('planning');
  const [form] = Form.useForm();
  
  // 编辑器相关状态
  const [editorContent, setEditorContent] = useState('');
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  // 编辑器引用
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const instanceIdRef = useRef(null);
  const initTimerRef = useRef(null);
  const aiChatRef = useRef(null);
  
  const [lessonPlans, setLessonPlans] = useState([
    {
      id: 1,
      title: '分数的加减法',
      subject: '数学',
      grade: '五年级',
      teacher: '张老师',
      collaborators: ['李老师', '王老师'],
      status: 'progress',
      progress: 75,
      createDate: '2024-01-10',
      lastModified: '2024-01-15',
      objectives: '掌握同分母分数的加减法运算',
      duration: 45
    }
  ]);

  const [importedDocuments, setImportedDocuments] = useState([]);
  const [docImportVisible, setDocImportVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [collaborationMessages, setCollaborationMessages] = useState([
    {
      id: 1,
      user: '张老师',
      message: '这个教学设计的重点部分需要再完善一下',
      timestamp: '2024-01-15 10:30',
      type: 'comment'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // 协作相关状态
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: '张老师', role: '主讲教师', status: 'online', avatar: 'Z', permission: 'edit', joinTime: '2024-01-15 09:00' },
    { id: 2, name: '李老师', role: '协作教师', status: 'offline', avatar: 'L', permission: 'edit', joinTime: '2024-01-15 09:15' },
    { id: 3, name: '王老师', role: '观摩教师', status: 'online', avatar: 'W', permission: 'view', joinTime: '2024-01-15 10:00' }
  ]);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteForm] = Form.useForm();
  const [collaborationSettings, setCollaborationSettings] = useState({
    allowComments: true,
    allowEdit: true,
    autoSave: true,
    notifyChanges: true
  });
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [settingsForm] = Form.useForm();

  // 文档中心的文档数据
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [documentCategories, setDocumentCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documentSearchText, setDocumentSearchText] = useState('');
  
  // 模拟从文档中心获取文档数据
  useEffect(() => {
    // 模拟文档中心的数据
    const mockDocuments = [
      {
        id: 1,
        title: '小学数学-分数的认识',
        description: '适用于小学四年级的分数概念教学课件，包含丰富的图形演示和互动练习。',
        category: '教学课件',
        tags: ['数学', '分数', '小学'],
        author: '张老师',
        lastModified: '2024-01-15',
        type: 'courseware',
        size: '12.5 MB',
        content: '<h2>分数的认识</h2><p>分数是表示整体的一部分的数...</p>'
      },
      {
        id: 2,
        title: '语文阅读理解教学设计',
        description: '小学语文阅读理解的教学方法和策略，提高学生阅读能力。',
        category: '教学设计',
        tags: ['语文', '阅读', '理解'],
        author: '李老师',
        lastModified: '2024-01-14',
        type: 'design',
        size: '8.3 MB',
        content: '<h2>阅读理解教学设计</h2><p>本课程旨在提高学生的阅读理解能力...</p>'
      },
      {
        id: 3,
        title: '英语口语练习素材',
        description: '适合小学生的英语口语练习材料，包含对话和情景练习。',
        category: '教学素材',
        tags: ['英语', '口语', '练习'],
        author: '王老师',
        lastModified: '2024-01-13',
        type: 'material',
        size: '15.7 MB',
        content: '<h2>English Speaking Practice</h2><p>Daily conversation practice...</p>'
      },
      {
        id: 4,
        title: '科学实验-水的三态变化',
        description: '通过实验演示水的固态、液态、气态三种状态的变化过程。',
        category: '实验指导',
        tags: ['科学', '实验', '物态变化'],
        author: '赵老师',
        lastModified: '2024-01-12',
        type: 'experiment',
        size: '6.9 MB',
        content: '<h2>水的三态变化实验</h2><p>实验目的：观察水在不同温度下的状态变化...</p>'
      }
    ];
    
    setAvailableDocuments(mockDocuments);
    
    // 提取文档分类
    const categories = [...new Set(mockDocuments.map(doc => doc.category))];
    setDocumentCategories(categories);
  }, []);

  const [lessonStructure, setLessonStructure] = useState([
    {
      id: 1,
      phase: '导入新课',
      duration: 10,
      activities: '复习旧知识，引入新概念',
      methods: '提问法、演示法',
      materials: 'PPT、教具',
      notes: '激发学生兴趣'
    },
    {
      id: 2,
      phase: '新课讲授',
      duration: 25,
      activities: '讲解新知识点，示例演示',
      methods: '讲授法、演示法、互动法',
      materials: '课件、黑板、实物教具',
      notes: '重点突出，难点突破'
    },
    {
      id: 3,
      phase: '练习巩固',
      duration: 8,
      activities: '课堂练习，学生展示',
      methods: '练习法、讨论法',
      materials: '练习题、学生作品',
      notes: '及时反馈，个别指导'
    },
    {
      id: 4,
      phase: '总结反思',
      duration: 2,
      activities: '知识梳理，布置作业',
      methods: '总结法',
      materials: '板书、作业单',
      notes: '系统总结，预习指导'
    }
  ]);

  // 课程结构相关状态
  const [structureModalVisible, setStructureModalVisible] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [structureForm] = Form.useForm();

  // 状态辅助函数
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'progress': return 'processing';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'progress': return '进行中';
      case 'draft': return '草稿';
      default: return '未知';
    }
  };

  // 创建备课计划
  const handleCreatePlan = (values) => {
    const newPlan = {
      id: Date.now(),
      ...values,
      teacher: '当前用户',
      collaborators: [],
      status: 'draft',
      progress: 0,
      createDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    setLessonPlans([...lessonPlans, newPlan]);
    form.resetFields();
    message.success('备课计划创建成功！');
  };

  // 课程结构管理函数
  const handleAddStructure = () => {
    setEditingStructure(null);
    structureForm.resetFields();
    setStructureModalVisible(true);
  };

  const handleEditStructure = (record) => {
    setEditingStructure(record);
    structureForm.setFieldsValue(record);
    setStructureModalVisible(true);
  };

  const handleDeleteStructure = (id) => {
    setLessonStructure(lessonStructure.filter(item => item.id !== id));
    message.success('删除成功！');
  };

  const handleStructureSubmit = (values) => {
    if (editingStructure) {
      // 编辑模式
      setLessonStructure(lessonStructure.map(item => 
        item.id === editingStructure.id ? { ...item, ...values } : item
      ));
      message.success('修改成功！');
    } else {
      // 新增模式
      const newStructure = {
        id: Date.now(),
        ...values
      };
      setLessonStructure([...lessonStructure, newStructure]);
      message.success('添加成功！');
    }
    setStructureModalVisible(false);
    structureForm.resetFields();
  };

  const handleStructureCancel = () => {
    setStructureModalVisible(false);
    structureForm.resetFields();
    setEditingStructure(null);
  };

  // 计算总时长
  const getTotalDuration = () => {
    return lessonStructure.reduce((total, item) => total + (item.duration || 0), 0);
  };

  // 导入文档处理
  const handleImportDocument = () => {
    if (selectedDocument) {
      // 将文档内容导入到编辑器中
      if (editorInstanceRef.current?.editor) {
        const currentContent = editorInstanceRef.current.editor.getHtml();
        const newContent = currentContent + '<br/>' + selectedDocument.content;
        editorInstanceRef.current.editor.setHtml(newContent);
      } else {
        // 如果编辑器还未初始化，直接设置内容
        setEditorContent(prev => prev + '<br/>' + selectedDocument.content);
      }
      
      const newDoc = {
        ...selectedDocument,
        importedAt: new Date().toLocaleString()
      };
      setImportedDocuments([...importedDocuments, newDoc]);
      setDocImportVisible(false);
      setSelectedDocument(null);
      message.success(`文档 "${selectedDocument.title}" 已导入到教学设计编辑器中！`);
    }
  };

  // AI聊天功能
  const toggleAiChat = () => {
    setShowAIChat(!showAIChat);
  };

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: aiInput,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setAiMessages([...aiMessages, userMessage]);
    setAiInput('');
    setIsAiTyping(true);
    
    // 模拟AI回复
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '我理解您的问题。根据您的教学设计，我建议可以增加更多的互动环节来提高学生的参与度。',
        timestamp: new Date().toLocaleTimeString()
      };
      setAiMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
    }, 2000);
  };

  // 编辑器初始化
  const initEditor = async () => {
    if (!editorRef.current || !toolbarRef.current) {
      console.log('编辑器DOM元素未准备好，3秒后重试...');
      setTimeout(initEditor, 3000);
      return;
    }

    try {
      console.log('开始初始化教学设计编辑器...');
      
      // 清理旧实例
      if (instanceIdRef.current) {
        await editorInstanceManager.destroyEditor(instanceIdRef.current);
        instanceIdRef.current = null;
      }
      
      // 生成唯一实例ID
      instanceIdRef.current = editorInstanceManager.generateInstanceId('lesson-preparation');
      
      // 使用全局菜单注册管理器注册评论菜单
      const { registerCommentMenu } = await import('../utils/editorMenuRegistry');
      await registerCommentMenu();
      
      // 使用全局实例管理器创建编辑器
      const { editor, toolbar } = await editorInstanceManager.createEditor({
        instanceId: instanceIdRef.current,
        editorContainer: editorRef.current,
        toolbarContainer: toolbarRef.current,
        initialContent: editorContent,
        onChange: (html) => {
          setEditorContent(html);
        }
      });

      editorInstanceRef.current = { editor, toolbar };
      setEditorLoaded(true);
      console.log('教学设计编辑器初始化成功');
    } catch (error) {
      console.error('教学设计编辑器初始化失败:', error);
      // 添加延迟重试机制
      if (initTimerRef.current) {
        clearTimeout(initTimerRef.current);
      }
      initTimerRef.current = setTimeout(initEditor, 3000);
    }
  };

  // 编辑器初始化效果
  useEffect(() => {
    if (activeTab === 'design') {
      setEditorLoaded(false);
      const timer = setTimeout(initEditor, 100);

      return () => {
        clearTimeout(timer);
        if (editorInstanceRef.current) {
          const { editor, toolbar } = editorInstanceRef.current;
          if (toolbar) toolbar.destroy();
          if (editor) editor.destroy();
          editorInstanceRef.current = null;
        }
      };
    }
  }, [activeTab]);

  // 组件卸载时清理编辑器实例
  useEffect(() => {
    return () => {
      // 清理定时器
      if (initTimerRef.current) {
        clearTimeout(initTimerRef.current);
        initTimerRef.current = null;
      }
      
      // 使用全局实例管理器清理编辑器
      if (instanceIdRef.current) {
        editorInstanceManager.destroyEditor(instanceIdRef.current)
          .then(() => {
            console.log('教学设计编辑器实例已清理');
          })
          .catch(error => {
            console.warn('教学设计编辑器清理失败:', error);
          });
        instanceIdRef.current = null;
      }
      
      // 清理本地引用
      if (editorInstanceRef.current) {
        editorInstanceRef.current = null;
      }
    };
  }, []);

  // 协作消息发送
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const messageObj = {
      id: Date.now(),
      user: '当前用户',
      message: newMessage,
      timestamp: new Date().toLocaleString(),
      type: 'comment'
    };
    
    setCollaborationMessages([...collaborationMessages, messageObj]);
    setNewMessage('');
  };

  // 协作管理功能
  const handleInviteCollaborator = (values) => {
    const newCollaborator = {
      id: Date.now(),
      name: values.name,
      role: values.role,
      status: 'offline',
      avatar: values.name.charAt(0).toUpperCase(),
      permission: values.permission,
      joinTime: new Date().toLocaleString()
    };
    setCollaborators([...collaborators, newCollaborator]);
    setInviteModalVisible(false);
    inviteForm.resetFields();
    message.success(`已邀请 ${values.name} 加入协作`);
  };

  const handleRemoveCollaborator = (id) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
    message.success('已移除协作成员');
  };

  const handleUpdatePermission = (id, permission) => {
    setCollaborators(collaborators.map(c => 
      c.id === id ? { ...c, permission } : c
    ));
    message.success('权限已更新');
  };

  const getPermissionColor = (permission) => {
    switch (permission) {
      case 'edit': return 'green';
      case 'comment': return 'orange';
      case 'view': return 'blue';
      default: return 'default';
    }
  };

  const getPermissionText = (permission) => {
     switch (permission) {
       case 'edit': return '编辑权限';
       case 'comment': return '评论权限';
       case 'view': return '查看权限';
       default: return '未知权限';
     }
   };

   // 协作设置管理
   const handleOpenSettings = () => {
     settingsForm.setFieldsValue(collaborationSettings);
     setSettingsModalVisible(true);
   };

   const handleSaveSettings = (values) => {
     setCollaborationSettings(values);
     setSettingsModalVisible(false);
     message.success('协作设置已保存');
   };

   const handleResetCollaboration = () => {
     setCollaborationMessages([]);
     message.success('协作记录已清空');
   };

  // AI聊天滚动到底部
  useEffect(() => {
    if (aiChatRef.current) {
      aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
    }
  }, [aiMessages, isAiTyping]);

  // 备课计划表格列定义
  const planColumns = [
    {
      title: '课程标题',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Space>
          <BookOutlined />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: '学科',
      dataIndex: 'subject',
      key: 'subject',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge status={getStatusColor(status)} text={getStatusText(status)} />
      )
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Progress percent={progress} size="small" />
      )
    },
    {
      title: '最后修改',
      dataIndex: 'lastModified',
      key: 'lastModified'
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm title="确定删除这个备课计划吗？" okText="确定" cancelText="取消">
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  // 课程结构表格列定义
  const structureColumns = [
    {
      title: '教学环节',
      dataIndex: 'phase',
      key: 'phase',
      width: 120
    },
    {
      title: '时长(分钟)',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration) => `${duration}分钟`
    },
    {
      title: '教学活动',
      dataIndex: 'activities',
      key: 'activities'
    },
    {
      title: '教学方法',
      dataIndex: 'methods',
      key: 'methods'
    },
    {
      title: '教学材料',
      dataIndex: 'materials',
      key: 'materials'
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes'
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => handleEditStructure(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm 
              title="确定删除这个教学环节吗？" 
              onConfirm={() => handleDeleteStructure(record.id)}
              okText="确定" 
              cancelText="取消"
            >
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="lesson-preparation">
      <Card>
        <div className="preparation-header">
          <Title level={2}>
            <BookOutlined /> 备课模块
          </Title>
          <Text type="secondary">
            智能化备课工具，支持教学设计、课程结构规划、协作讨论等功能
          </Text>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
          tabBarExtraContent={activeTab === 'design' ? (
            <Space>
              <Button 
                type="default" 
                icon={<DownloadOutlined />}
                onClick={() => setDocImportVisible(true)}
              >
                导入文档
              </Button>
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
                onClick={() => {
                  let currentContent = editorContent;
                  if (editorInstanceRef.current?.editor) {
                    currentContent = editorInstanceRef.current.editor.getHtml();
                  }
                  message.success('教学设计已保存');
                }}
              >
                保存
              </Button>
            </Space>
          ) : null}
          items={[
            {
              key: 'planning',
              label: <span><PlusOutlined />备课计划</span>,
              children: (
                <Card title="创建备课计划">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreatePlan}
                    initialValues={{
                      duration: 45,
                      grade: '五年级'
                    }}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="课程标题"
                          name="title"
                          rules={[{ required: true, message: '请输入课程标题' }]}
                        >
                          <Input placeholder="请输入课程标题" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="学科"
                          name="subject"
                          rules={[{ required: true, message: '请选择学科' }]}
                        >
                          <Select placeholder="请选择学科">
                            <Option value="语文">语文</Option>
                            <Option value="数学">数学</Option>
                            <Option value="英语">英语</Option>
                            <Option value="科学">科学</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      label="教学目标"
                      name="objectives"
                      rules={[{ required: true, message: '请输入教学目标' }]}
                    >
                      <TextArea rows={3} placeholder="请描述本课的教学目标" />
                    </Form.Item>
                    <Form.Item>
                      <Space>
                        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                          创建计划
                        </Button>
                        <Button htmlType="reset">
                          重置
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                  
                  <Divider />
                  
                  <Table
                    columns={planColumns}
                    dataSource={lessonPlans}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              )
            },
            {
              key: 'design',
              label: <span><FileTextOutlined />教学设计</span>,
              children: (
                <Card>
                  <div className="document-editor-section">
                    <div className="editor-layout">
                      <div className={`editor-section ${showAIChat ? 'with-ai-panel' : 'full-width'}`}>
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
                      
                      {showAIChat && (
                        <div className="ai-chat-panel">
                          <div className="ai-chat-header">
                            <Space>
                              <RobotOutlined />
                              <Text strong>AI 教学助手</Text>
                            </Space>
                          </div>
                          <div className="ai-chat-messages" ref={aiChatRef}>
                            {aiMessages.map((msg) => (
                              <div key={msg.id} className={`ai-message ${msg.type}`}>
                                <div className="message-content">
                                  {msg.content}
                                </div>
                                <div className="message-time">
                                  {msg.timestamp}
                                </div>
                              </div>
                            ))}
                            {isAiTyping && (
                              <div className="ai-message ai typing">
                                <div className="typing-indicator">
                                  <span></span>
                                  <span></span>
                                  <span></span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="ai-chat-input">
                            <div className="input-container">
                              <Input
                                className="ai-input-field"
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                                placeholder="向AI助手提问..."
                                onPressEnter={handleAiSend}
                                disabled={isAiTyping}
                              />
                              <Button
                                type="text"
                                icon={<SendOutlined />}
                                onClick={handleAiSend}
                                disabled={!aiInput.trim() || isAiTyping}
                                className="send-button"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>

                  {importedDocuments.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                      <Divider orientation="left">导入的文档</Divider>
                      <List
                        itemLayout="horizontal"
                        dataSource={importedDocuments}
                        renderItem={(doc) => (
                          <List.Item
                            key={doc.id}
                            actions={[
                              <Button key="edit" type="text" icon={<EditOutlined />}>编辑</Button>,
                              <Button key="copy" type="text" icon={<CopyOutlined />}>复制</Button>,
                              <Button key="download" type="text" icon={<DownloadOutlined />}>下载</Button>,
                              <Popconfirm key="delete" title="确定删除这个文档吗？" okText="确定" cancelText="取消">
                                <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
                              </Popconfirm>
                            ]}
                          >
                            <List.Item.Meta
                              avatar={<Avatar icon={<FileTextOutlined />} />}
                              title={doc.title}
                              description={
                                <Space>
                                  <Text type="secondary">作者: {doc.author}</Text>
                                  <Text type="secondary">大小: {doc.size}</Text>
                                  <Text type="secondary">修改: {doc.lastModified}</Text>
                                </Space>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </Card>
              )
            },
            {
              key: 'structure',
              label: <span><SettingOutlined />课程结构</span>,
              children: (
                <Card 
                  title="课程结构设计"
                  extra={
                    <Space>
                      <Text type="secondary">总时长: {getTotalDuration()}分钟</Text>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={handleAddStructure}
                      >
                        添加环节
                      </Button>
                    </Space>
                  }
                >
                  <Table
                    columns={structureColumns}
                    dataSource={lessonStructure}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                    summary={() => (
                      <Table.Summary>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}>
                            <Text strong>总计</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text strong>{getTotalDuration()}分钟</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2} colSpan={4}>
                            <Text type="secondary">完整课程时长统计</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                </Card>
              )
            },
            {
              key: 'resources',
              label: <span><FolderOutlined />教学资源</span>,
              children: (
                <Card title="教学资源库">
                  <Row gutter={[16, 16]}>
                    {availableDocuments.map((doc) => (
                      <Col span={8} key={doc.id}>
                        <Card
                          size="small"
                          title={doc.title}
                          extra={[
                            <Button key="download" type="text" icon={<DownloadOutlined />} />,
                            <Button key="share" type="text" icon={<ShareAltOutlined />} />
                          ]}
                        >
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {doc.description}
                          </Paragraph>
                          <Space wrap>
                            {doc.tags.map(tag => (
                              <Tag key={tag} color="blue">{tag}</Tag>
                            ))}
                          </Space>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
              )
            },
            {
              key: 'collaboration',
              label: <span><TeamOutlined />协作讨论</span>,
              children: (
                <Card 
                  title="协作管理" 
                  extra={
                    <Space>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setInviteModalVisible(true)}
                      >
                        邀请协作
                      </Button>
                      <Button icon={<SettingOutlined />} onClick={handleOpenSettings}>
                         协作设置
                       </Button>
                    </Space>
                  }
                >
                  <Row gutter={16}>
                    <Col span={16}>
                      <Card title="讨论区" size="small">
                        <div style={{ height: 400, overflowY: 'auto', marginBottom: 16 }}>
                          <List
                            dataSource={collaborationMessages}
                            renderItem={(item) => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={<Avatar icon={<UserOutlined />} />}
                                  title={<Space><Text strong>{item.user}</Text><Text type="secondary" style={{ fontSize: '12px' }}>{item.timestamp}</Text></Space>}
                                  description={item.message}
                                />
                              </List.Item>
                            )}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="输入讨论内容..."
                            onPressEnter={handleSendMessage}
                          />
                          <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
                            发送
                          </Button>
                        </div>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card 
                        title="协作成员" 
                        size="small"
                        extra={<Text type="secondary">{collaborators.length}人</Text>}
                      >
                        <List
                          size="small"
                          dataSource={collaborators}
                          renderItem={(member) => (
                            <List.Item
                              actions={[
                                <Select
                                  key="permission"
                                  size="small"
                                  value={member.permission}
                                  onChange={(value) => handleUpdatePermission(member.id, value)}
                                  style={{ width: 80 }}
                                >
                                  <Option value="edit">编辑</Option>
                                  <Option value="comment">评论</Option>
                                  <Option value="view">查看</Option>
                                </Select>,
                                <Popconfirm
                                  key="remove"
                                  title="确定移除此成员吗？"
                                  onConfirm={() => handleRemoveCollaborator(member.id)}
                                  okText="确定"
                                  cancelText="取消"
                                >
                                  <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                              ]}
                            >
                              <List.Item.Meta
                                avatar={
                                  <Badge status={member.status === 'online' ? 'success' : 'default'}>
                                    <Avatar size="small">{member.avatar}</Avatar>
                                  </Badge>
                                }
                                title={
                                  <Space>
                                    <Text strong>{member.name}</Text>
                                    <Tag color={getPermissionColor(member.permission)} size="small">
                                      {getPermissionText(member.permission)}
                                    </Tag>
                                  </Space>
                                }
                                description={
                                  <Space direction="vertical" size={0}>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>{member.role}</Text>
                                    <Text type="secondary" style={{ fontSize: '11px' }}>加入时间: {member.joinTime}</Text>
                                  </Space>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                  </Row>
                </Card>
              )
            },
            {
              key: 'history',
              label: <span><HistoryOutlined />备课历史</span>,
              children: (
                <Card title="备课历史">
                  <Table
                    columns={planColumns}
                    dataSource={lessonPlans}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              )
            }
          ]}
        />
      </Card>

      <Modal
        title="从文档中心导入文档"
        open={docImportVisible}
        onOk={handleImportDocument}
        onCancel={() => {
          setDocImportVisible(false);
          setSelectedDocument(null);
          setDocumentSearchText('');
          setSelectedCategory('all');
        }}
        width={900}
        okText="确认导入"
        cancelText="取消"
        okButtonProps={{ disabled: !selectedDocument }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>选择文档中心的文档导入到教学设计编辑器中，导入的内容将添加到当前编辑器内容的末尾。</Text>
        </div>
        
        {/* 搜索和筛选 */}
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Input
                placeholder="搜索文档标题或描述..."
                prefix={<SearchOutlined />}
                value={documentSearchText}
                onChange={(e) => setDocumentSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={12}>
              <Select
                style={{ width: '100%' }}
                placeholder="选择文档分类"
                value={selectedCategory}
                onChange={setSelectedCategory}
              >
                <Option value="all">全部分类</Option>
                {documentCategories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
        
        {/* 文档列表 */}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <Row gutter={[16, 16]}>
            {availableDocuments
              .filter(doc => {
                const matchesSearch = documentSearchText === '' || 
                  doc.title.toLowerCase().includes(documentSearchText.toLowerCase()) ||
                  doc.description.toLowerCase().includes(documentSearchText.toLowerCase());
                const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
                return matchesSearch && matchesCategory;
              })
              .map((doc) => (
                <Col span={12} key={doc.id}>
                  <Card
                    size="small"
                    className={selectedDocument?.id === doc.id ? 'selected-document' : ''}
                    onClick={() => setSelectedDocument(doc)}
                    style={{ 
                      cursor: 'pointer',
                      border: selectedDocument?.id === doc.id ? '2px solid #1890ff' : '1px solid #d9d9d9'
                    }}
                    hoverable
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text strong style={{ flex: 1 }}>{doc.title}</Text>
                        <Tag color="blue" size="small">{doc.category}</Tag>
                      </div>
                      <Text type="secondary" ellipsis={{ rows: 2 }}>
                        {doc.description}
                      </Text>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space size="small">
                          <Text type="secondary" style={{ fontSize: '12px' }}>作者: {doc.author}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>大小: {doc.size}</Text>
                        </Space>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{doc.lastModified}</Text>
                      </div>
                      <Space wrap>
                        {doc.tags.map(tag => (
                          <Tag key={tag} size="small" color="geekblue">{tag}</Tag>
                        ))}
                      </Space>
                    </Space>
                  </Card>
                </Col>
              ))
            }
          </Row>
          
          {availableDocuments
            .filter(doc => {
              const matchesSearch = documentSearchText === '' || 
                doc.title.toLowerCase().includes(documentSearchText.toLowerCase()) ||
                doc.description.toLowerCase().includes(documentSearchText.toLowerCase());
              const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
              return matchesSearch && matchesCategory;
            }).length === 0 && (
            <Empty 
              description="没有找到匹配的文档" 
              style={{ margin: '40px 0' }}
            />
          )}
        </div>
        
        {selectedDocument && (
          <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6f8fa', borderRadius: 6 }}>
            <Text strong>已选择文档：</Text>
            <div style={{ marginTop: 8 }}>
              <Text>{selectedDocument.title}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {selectedDocument.description}
              </Text>
            </div>
          </div>
        )}
      </Modal>

      {/* 课程结构编辑模态框 */}
      <Modal
        title={editingStructure ? '编辑教学环节' : '添加教学环节'}
        open={structureModalVisible}
        onCancel={handleStructureCancel}
        footer={null}
        width={600}
        destroyOnHidden={true}
      >
        <Form
          form={structureForm}
          layout="vertical"
          onFinish={handleStructureSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="教学环节"
                name="phase"
                rules={[{ required: true, message: '请输入教学环节名称' }]}
              >
                <Input placeholder="如：导入新课、新课讲授等" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="时长(分钟)"
                name="duration"
                rules={[{ required: true, message: '请输入时长' }]}
              >
                <Input type="number" placeholder="请输入时长" min={1} max={60} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="教学活动"
            name="activities"
            rules={[{ required: true, message: '请输入教学活动内容' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="请描述本环节的主要教学活动" 
            />
          </Form.Item>
          
          <Form.Item
            label="教学方法"
            name="methods"
            rules={[{ required: true, message: '请输入教学方法' }]}
          >
            <Input placeholder="如：讲授法、演示法、讨论法等" />
          </Form.Item>
          
          <Form.Item
            label="教学材料"
            name="materials"
          >
            <Input placeholder="如：PPT、教具、实验器材等" />
          </Form.Item>
          
          <Form.Item
            label="备注"
            name="notes"
          >
            <TextArea 
              rows={2} 
              placeholder="教学要点、注意事项等" 
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingStructure ? '保存修改' : '添加环节'}
              </Button>
              <Button onClick={handleStructureCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 邀请协作成员模态框 */}
      <Modal
        title="邀请协作成员"
        open={inviteModalVisible}
        onCancel={() => {
          setInviteModalVisible(false);
          inviteForm.resetFields();
        }}
        footer={null}
        width={500}
        destroyOnHidden={true}
      >
        <Form
          form={inviteForm}
          layout="vertical"
          onFinish={handleInviteCollaborator}
        >
          <Form.Item
            label="成员姓名"
            name="name"
            rules={[{ required: true, message: '请输入成员姓名' }]}
          >
            <Input placeholder="请输入要邀请的成员姓名" />
          </Form.Item>
          
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="主讲教师">主讲教师</Option>
              <Option value="协作教师">协作教师</Option>
              <Option value="观摩教师">观摩教师</Option>
              <Option value="教研员">教研员</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="权限"
            name="permission"
            rules={[{ required: true, message: '请选择权限' }]}
            initialValue="view"
          >
            <Select placeholder="请选择权限">
              <Option value="edit">编辑权限 - 可以编辑所有内容</Option>
              <Option value="comment">评论权限 - 可以添加评论和建议</Option>
              <Option value="view">查看权限 - 只能查看内容</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                发送邀请
              </Button>
              <Button onClick={() => {
                setInviteModalVisible(false);
                inviteForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
       </Modal>

       {/* 协作设置模态框 */}
       <Modal
         title="协作设置"
         open={settingsModalVisible}
         onCancel={() => setSettingsModalVisible(false)}
         footer={null}
         width={600}
         destroyOnHidden={true}
       >
         <Form
           form={settingsForm}
           layout="vertical"
           onFinish={handleSaveSettings}
           initialValues={collaborationSettings}
         >
           <Row gutter={16}>
             <Col span={12}>
               <Form.Item
                 label="允许评论"
                 name="allowComments"
                 valuePropName="checked"
               >
                 <Switch checkedChildren="开启" unCheckedChildren="关闭" />
               </Form.Item>
             </Col>
             <Col span={12}>
               <Form.Item
                 label="允许编辑"
                 name="allowEdit"
                 valuePropName="checked"
               >
                 <Switch checkedChildren="开启" unCheckedChildren="关闭" />
               </Form.Item>
             </Col>
           </Row>
           
           <Row gutter={16}>
             <Col span={12}>
               <Form.Item
                 label="自动保存"
                 name="autoSave"
                 valuePropName="checked"
               >
                 <Switch checkedChildren="开启" unCheckedChildren="关闭" />
               </Form.Item>
             </Col>
             <Col span={12}>
               <Form.Item
                 label="变更通知"
                 name="notifyChanges"
                 valuePropName="checked"
               >
                 <Switch checkedChildren="开启" unCheckedChildren="关闭" />
               </Form.Item>
             </Col>
           </Row>
           
           <Divider />
           
           <Form.Item label="协作统计">
             <Row gutter={16}>
               <Col span={8}>
                 <Card size="small" style={{ textAlign: 'center' }}>
                   <Text type="secondary">协作成员</Text>
                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                     {collaborators.length}
                   </div>
                 </Card>
               </Col>
               <Col span={8}>
                 <Card size="small" style={{ textAlign: 'center' }}>
                   <Text type="secondary">讨论消息</Text>
                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                     {collaborationMessages.length}
                   </div>
                 </Card>
               </Col>
               <Col span={8}>
                 <Card size="small" style={{ textAlign: 'center' }}>
                   <Text type="secondary">在线成员</Text>
                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                     {collaborators.filter(c => c.status === 'online').length}
                   </div>
                 </Card>
               </Col>
             </Row>
           </Form.Item>
           
           <Form.Item>
             <Space>
               <Button type="primary" htmlType="submit">
                 保存设置
               </Button>
               <Button onClick={() => setSettingsModalVisible(false)}>
                 取消
               </Button>
               <Popconfirm
                 title="确定要清空所有协作记录吗？"
                 onConfirm={handleResetCollaboration}
                 okText="确定"
                 cancelText="取消"
               >
                 <Button danger>
                   清空记录
                 </Button>
               </Popconfirm>
             </Space>
           </Form.Item>
         </Form>
       </Modal>
     </div>
   );
 };

 export default LessonPreparation;