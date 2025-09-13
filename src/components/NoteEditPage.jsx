import React, { useState, useEffect } from 'react';
import {
  Layout,
  Input,
  Button,
  Typography,
  Space,
  message,
  Upload,
  List,
  Card,
  Divider,
  Tag,
  Avatar,
  Tooltip,
  Select,
  Row,
  Col,
  Modal,
  Checkbox,
  Popconfirm
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  FileTextOutlined,
  LinkOutlined,
  SendOutlined,
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CopyOutlined,
  ShareAltOutlined,
  RobotOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const NoteEditPage = ({ onBack }) => {
  // 资料收集相关状态
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 14, name: '成都美食调研报告.pdf', size: 2048000, type: 'application/pdf', uploadTime: '10分钟前' },
    { id: 15, name: '川菜菜谱大全.docx', size: 1536000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadTime: '30分钟前' },
    { id: 16, name: '成都餐厅数据表.xlsx', size: 1024000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uploadTime: '1小时前' },
    { id: 38, name: '川菜历史文献资料.pdf', size: 3072000, type: 'application/pdf', uploadTime: '1.5小时前' },
    { id: 39, name: '成都火锅店分布图.png', size: 512000, type: 'image/png', uploadTime: '2小时前' },
    { id: 40, name: '川菜调料配方表.xlsx', size: 768000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uploadTime: '3小时前' },
    { id: 41, name: '成都小吃制作视频.mp4', size: 10240000, type: 'video/mp4', uploadTime: '4小时前' },
    { id: 42, name: '川菜营养成分分析.docx', size: 1280000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadTime: '5小时前' }
  ]);
  
  // 多选功能状态
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showMaterialDetail, setShowMaterialDetail] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [links, setLinks] = useState([
    { id: 20, url: 'https://zhuanlan.zhihu.com/chengdu-food', title: '成都美食攻略 - 知乎专栏', addTime: '8分钟前' },
    { id: 21, url: 'https://www.sichuancuisinemuseum.com', title: '川菜博物馆官网', addTime: '18分钟前' },
    { id: 22, url: 'https://guide.michelin.com/chengdu', title: '成都米其林餐厅指南', addTime: '28分钟前' },
    { id: 48, url: 'https://www.dianping.com/chengdu/hotpot', title: '大众点评成都火锅排行榜', addTime: '40分钟前' },
    { id: 49, url: 'https://www.cdta.gov.cn/food', title: '成都文化旅游局美食推荐', addTime: '1小时前' },
    { id: 50, url: 'https://www.bilibili.com/sichuancuisine', title: '川菜制作技法视频教程', addTime: '1.5小时前' },
    { id: 51, url: 'https://baike.baidu.com/chengdu-snacks', title: '成都小吃地图 - 百度百科', addTime: '2小时前' },
    { id: 52, url: 'https://www.tmall.com/sichuan-spices', title: '川菜调料采购指南', addTime: '3小时前' },
    { id: 53, url: 'https://www.chengdufoodfestival.com', title: '成都美食节官方网站', addTime: '4小时前' }
  ]);
  const [newLink, setNewLink] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [websiteType, setWebsiteType] = useState('normal'); // 'normal' 或 'video'
  const [websiteUrl, setWebsiteUrl] = useState('');// 文字内容相关状态
  const [textContent, setTextContent] = useState('');
  const [addedTexts, setAddedTexts] = useState([
    { id: 17, title: '成都美食个人体验笔记', content: '在成都生活了三年，深深被这座城市的美食文化所吸引。从街头巷尾的小吃到高档餐厅的精致川菜，每一道菜都承载着深厚的文化底蕴...', addTime: '5分钟前' },
    { id: 18, title: '川菜口味特点总结', content: '川菜以麻、辣、鲜、香为主要特色，讲究一菜一格，百菜百味。其调味方法多样，有鱼香、宫保、怪味、酸辣等24种基本味型...', addTime: '15分钟前' },
    { id: 19, title: '成都小吃街探访记录', content: '今天走访了锦里、宽窄巷子、春熙路等著名小吃街，品尝了龙抄手、钟水饺、夫妻肺片、三大炮等经典小吃，每一样都有其独特的制作工艺...', addTime: '25分钟前' },
    { id: 43, title: '火锅底料制作心得', content: '经过多次尝试，总结出制作正宗成都火锅底料的关键：选用优质郫县豆瓣酱，配以干辣椒、花椒、香料等，小火慢炒出红油...', addTime: '45分钟前' },
    { id: 44, title: '成都茶馆文化观察', content: '成都的茶馆不仅是品茶的地方，更是社交和文化交流的重要场所。在这里可以听川剧、打麻将、聊天，体验慢生活的魅力...', addTime: '1小时前' },
    { id: 45, title: '川菜调味技巧笔记', content: '川菜调味的精髓在于复合调味，通过多种调料的巧妙搭配，形成层次丰富的口感。豆瓣酱是川菜之魂，花椒提供麻味...', addTime: '2小时前' },
    { id: 46, title: '宽窄巷子美食攻略', content: '宽窄巷子作为成都的文化名片，汇聚了众多特色美食。推荐必吃：叶儿粑、糖油果子、三大炮、冰粉等传统小吃...', addTime: '3小时前' },
    { id: 47, title: '成都夜市小吃推荐', content: '成都的夜市文化丰富多彩，建设路小吃街、玉林路、电子科大万人坑等都是夜宵的好去处，烧烤、串串、冒菜应有尽有...', addTime: '4小时前' }
  ]);
  
  // 课程视频相关状态
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [courseVideos, setCourseVideos] = useState([
    { id: 3, title: '成都米其林美食与地道风味之旅', url: 'https://www.bilibili.com/video/BV1xx411c7mu', addTime: '2小时前' },
    { id: 4, title: '川菜制作工艺详解', url: 'https://www.bilibili.com/video/BV2yy411d8kl', addTime: '3小时前' },
    { id: 5, title: '成都火锅文化纪录片', url: 'https://www.bilibili.com/video/BV3zz411e9wx', addTime: '4小时前' },
    { id: 26, title: '宽窄巷子美食探店', url: 'https://www.xiaohongshu.com/explore/chengdu-food', addTime: '5小时前' },
    { id: 27, title: '川菜大师烹饪示范', url: 'https://www.bilibili.com/video/BV4aa411b7cd', addTime: '6小时前' },
    { id: 28, title: '成都小吃制作全程', url: 'https://www.bilibili.com/video/BV5bb411c8ef', addTime: '1天前' }
  ]);
  
  // 问答区域相关状态
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: '您好！我是您的AI助手。请上传相关资料，我将基于这些内容为您提供专业的问答服务。',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 快捷操作相关状态
  const [quickActions] = useState([
    { key: 'summarize', label: '内容总结', icon: <FileTextOutlined /> },
    { key: 'extract', label: '关键信息提取', icon: <CopyOutlined /> },
    { key: 'translate', label: '翻译', icon: <ShareAltOutlined /> },
    { key: 'analyze', label: '深度分析', icon: <RobotOutlined /> }
  ]);
  
  // 操作结果相关状态
  const [operationResults, setOperationResults] = useState([]);
  
  // 操作面板相关状态
  const [selectedOperation, setSelectedOperation] = useState('audio'); // 当前选中的操作类型
  
  // 操作记录数据状态管理
  const [operationRecords, setOperationRecords] = useState({
    audio: [],
    video: [],
    mindmap: [],
    report: [],
    ppt: [],
    webcode: [],
    file: [],
    text: [],
    link: []
  });

  // 新建笔记功能
  const handleCreateNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: '新建笔记',
      source: '手动创建',
      time: '刚刚',
      type: 'text'
    };
    
    setOperationRecords(prev => ({
      ...prev,
      text: [newNote, ...prev.text]
    }));
    
    message.success('新建笔记已添加到操作记录');
  };

  // 操作按钮点击处理函数
  const handleOperationClick = (operationType) => {
    if (selectedMaterials.length === 0) {
      message.warning('请先选择要操作的资料');
      return;
    }

    const operationTitles = {
      audio: '音频概览',
      video: '视频概览', 
      mindmap: '思维导图',
      report: '分析报告',
      ppt: 'PPT演示',
      webcode: '网页代码'
    };

    const newRecord = {
      id: Date.now(),
      title: `基于${selectedMaterials.length}个资料生成${operationTitles[operationType]}`,
      source: `${selectedMaterials.length}个来源`,
      time: '刚刚',
      type: operationType
    };

    setOperationRecords(prev => ({
      ...prev,
      [operationType]: [newRecord, ...prev[operationType]]
    }));

    message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
  };

  // 文件上传处理
  const handleFileUpload = (info) => {
    const { status, originFileObj, response } = info.file;
    
    if (status === 'done') {
      const newFile = {
        id: Date.now(),
        name: originFileObj.name,
        size: originFileObj.size,
        type: originFileObj.type,
        uploadTime: new Date().toISOString(),
        content: '文件内容预览...'
      };
      setUploadedFiles(prev => [...prev, newFile]);
      message.success(`${originFileObj.name} 上传成功`);
    } else if (status === 'error') {
      message.error(`${originFileObj.name} 上传失败`);
    }
  };

  // 添加链接
  const handleAddLink = () => {
    if (!newLink.trim()) {
      message.warning('请输入有效的链接地址');
      return;
    }
    
    const linkObj = {
      id: Date.now(),
      url: newLink,
      title: '链接标题',
      addTime: new Date().toISOString()
    };
    
    setLinks(prev => [...prev, linkObj]);
    setNewLink('');
    message.success('链接添加成功');
  };

  // 添加网站地址处理函数
  const handleAddWebsite = () => {
    if (!websiteUrl.trim()) {
      message.warning('请输入有效的网站地址');
      return;
    }

    // 验证视频网站地址
    if (websiteType === 'video') {
      const isBilibili = websiteUrl.includes('bilibili.com') || websiteUrl.includes('b23.tv');
      const isXiaohongshu = websiteUrl.includes('xiaohongshu.com') || websiteUrl.includes('xhslink.com');
      
      if (!isBilibili && !isXiaohongshu) {
        message.warning('视频地址仅支持B站和小红书链接');
        return;
      }
    }
    
    const websiteObj = {
      id: Date.now(),
      url: websiteUrl,
      type: websiteType,
      title: websiteType === 'video' ? '视频链接' : '网站链接',
      platform: websiteType === 'video' ? 
        (websiteUrl.includes('bilibili.com') || websiteUrl.includes('b23.tv') ? 'B站' : '小红书') : 
        '普通网站',
      addTime: new Date().toISOString()
    };
    
    setLinks(prev => [...prev, websiteObj]);
    setWebsiteUrl('');
     message.success(`${websiteType === 'video' ? '视频' : '网站'}地址添加成功`);
   };

   // 添加文字内容处理函数
   const handleAddText = () => {
     if (!textContent.trim()) {
       message.warning('请输入文字内容');
       return;
     }

     const textObj = {
       id: Date.now(),
       content: textContent.trim(),
       type: 'text',
       title: textContent.trim().length > 20 ? textContent.trim().substring(0, 20) + '...' : textContent.trim(),
       addTime: new Date().toISOString()
     };

     setAddedTexts(prev => [...prev, textObj]);
     setTextContent('');
     message.success('文字内容添加成功');
   };

   // 删除文字内容
   const handleDeleteText = (textId) => {
     setAddedTexts(prev => prev.filter(text => text.id !== textId));
     message.success('文字内容删除成功');
   };

   // 添加课程视频
   const handleAddVideo = () => {
     if (!videoTitle.trim()) {
       message.error('请输入视频标题');
       return;
     }
     if (!videoUrl.trim()) {
       message.error('请输入视频链接');
       return;
     }

     // 简单的URL验证
     const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.*)?$/;
     if (!urlPattern.test(videoUrl)) {
       message.error('请输入有效的视频链接');
       return;
     }

     const videoObj = {
       id: Date.now(),
       title: videoTitle.trim(),
       url: videoUrl.trim(),
       addedAt: new Date().toLocaleString()
     };

     setCourseVideos(prev => [...prev, videoObj]);
     setVideoTitle('');
     setVideoUrl('');
     message.success('课程视频添加成功');
   };

   // 删除课程视频
   const handleDeleteVideo = (videoId) => {
     setCourseVideos(prev => prev.filter(video => video.id !== videoId));
     message.success('课程视频删除成功');
   };

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
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `基于您上传的资料，我理解您的问题是："${inputMessage}"。根据现有资料分析，我建议...`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // 执行快捷操作
  const handleQuickAction = (actionKey) => {
    const action = quickActions.find(a => a.key === actionKey);
    const result = {
      id: Date.now(),
      action: action.label,
      content: `${action.label}的结果内容...`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    setOperationResults(prev => [result, ...prev]);
    message.success(`${action.label}操作完成`);
  };

  // 删除文件
  const handleDeleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    message.success('文件删除成功');
  };

  // 删除链接
  const handleDeleteLink = (linkId) => {
    setLinks(links.filter(link => link.id !== linkId));
    message.success('链接删除成功');
  };

  // 多选功能处理函数
  const handleSelectMaterial = (materialId, checked) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, materialId]);
    } else {
      setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allMaterialIds = [
        ...uploadedFiles.map(file => `file-${file.id}`),
        ...addedTexts.map(text => `text-${text.id}`),
        ...courseVideos.map(video => `video-${video.id}`),
        ...links.map(link => `link-${link.id}`)
      ];
      setSelectedMaterials(allMaterialIds);
    } else {
      setSelectedMaterials([]);
    }
  };

  const handleBatchDelete = () => {
    selectedMaterials.forEach(materialId => {
      const [type, id] = materialId.split('-');
      const numId = parseInt(id);
      
      switch (type) {
        case 'file':
          setUploadedFiles(prev => prev.filter(file => file.id !== numId));
          break;
        case 'text':
          setAddedTexts(prev => prev.filter(text => text.id !== numId));
          break;
        case 'video':
          setCourseVideos(prev => prev.filter(video => video.id !== numId));
          break;
        case 'link':
          setLinks(prev => prev.filter(link => link.id !== numId));
          break;
      }
    });
    setSelectedMaterials([]);
    message.success(`已删除 ${selectedMaterials.length} 个资料`);
  };

  const handleViewMaterial = (material, type) => {
    setCurrentMaterial({ ...material, type });
    setShowMaterialDetail(true);
  };

  // 计算选中状态
  const allMaterials = [
    ...uploadedFiles.map(file => `file-${file.id}`),
    ...addedTexts.map(text => `text-${text.id}`),
    ...courseVideos.map(video => `video-${video.id}`),
    ...links.map(link => `link-${link.id}`)
  ];
  const isAllSelected = allMaterials.length > 0 && selectedMaterials.length === allMaterials.length;
  const isIndeterminate = selectedMaterials.length > 0 && selectedMaterials.length < allMaterials.length;



  // 返回
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.close();
    }
  };

  return (
    <>
      <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5' }}>
      {/* 左侧资料收集区域 */}
      <div style={{ width: 320, background: '#fff', margin: '16px 0 16px 16px', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
                  📚 资料收集
                </Title>
                {allMaterials.length > 0 && (
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  >
                    {selectedMaterials.length > 0 ? `已选 ${selectedMaterials.length}` : '全选'}
                  </Checkbox>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {selectedMaterials.length > 0 && (
                  <Popconfirm
                    title="确认删除"
                    description={`确定要删除选中的 ${selectedMaterials.length} 个资料吗？`}
                    onConfirm={handleBatchDelete}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button 
                      type="text" 
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                    >
                      删除选中
                    </Button>
                  </Popconfirm>
                )}
                {onBack && (
                  <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={handleBack}
                    style={{ color: '#666' }}
                  >
                    返回
                  </Button>
                )}
              </div>
            </div>
            
            {/* 操作按钮区域 */}
            <div style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  block
                  style={{ marginBottom: 8 }}
                  onClick={() => setShowUploadModal(true)}
                >
                  添加
                </Button>
                <Button 
                  type="default" 
                  block
                >
                  探索
                </Button>
              </Space>
            </div>
            
            <Divider style={{ margin: '16px 0' }} />
            
            {/* 统一的资料列表 */}
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {/* 已上传文件 */}
              {uploadedFiles.map(file => (
                <Card 
                  key={`file-${file.id}`} 
                  size="small" 
                  style={{ 
                    marginBottom: 8,
                    border: selectedMaterials.includes(`file-${file.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    backgroundColor: selectedMaterials.includes(`file-${file.id}`) ? '#f6ffed' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Checkbox
                      checked={selectedMaterials.includes(`file-${file.id}`)}
                      onChange={(e) => handleSelectMaterial(`file-${file.id}`, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div 
                      style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: 8, cursor: 'pointer' }}
                      onClick={() => handleViewMaterial(file, 'file')}
                    >
                      <FileTextOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                      <div style={{ flex: 1 }}>
                        <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{file.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 10 }}>
                          {(file.size / 1024).toFixed(1)}KB
                        </Text>
                      </div>
                    </div>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id);
                      }}
                      danger
                    />
                  </div>
                </Card>
              ))}
              
              {/* 添加的文字 */}
              {addedTexts.map(text => (
                <Card 
                  key={`text-${text.id}`} 
                  size="small" 
                  style={{ 
                    marginBottom: 8,
                    border: selectedMaterials.includes(`text-${text.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    backgroundColor: selectedMaterials.includes(`text-${text.id}`) ? '#f6ffed' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Checkbox
                      checked={selectedMaterials.includes(`text-${text.id}`)}
                      onChange={(e) => handleSelectMaterial(`text-${text.id}`, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div 
                      style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: 8, cursor: 'pointer' }}
                      onClick={() => handleViewMaterial(text, 'text')}
                    >
                      <FileTextOutlined style={{ fontSize: 16, color: '#52c41a', marginRight: 8 }} />
                      <div style={{ flex: 1 }}>
                        <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{text.title}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                          {text.content.length > 50 ? text.content.substring(0, 50) + '...' : text.content}
                        </Text>
                      </div>
                    </div>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteText(text.id);
                      }}
                      danger
                    />
                  </div>
                </Card>
              ))}
              
              {/* 课程视频 */}
              {courseVideos.map(video => (
                <Card 
                  key={`video-${video.id}`} 
                  size="small" 
                  style={{ 
                    marginBottom: 8,
                    border: selectedMaterials.includes(`video-${video.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    backgroundColor: selectedMaterials.includes(`video-${video.id}`) ? '#f6ffed' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Checkbox
                      checked={selectedMaterials.includes(`video-${video.id}`)}
                      onChange={(e) => handleSelectMaterial(`video-${video.id}`, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div 
                      style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: 8, cursor: 'pointer' }}
                      onClick={() => handleViewMaterial(video, 'video')}
                    >
                      <div style={{ fontSize: 16, marginRight: 8 }}>🎥</div>
                      <div style={{ flex: 1 }}>
                        <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{video.title}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                          {video.url}
                        </Text>
                      </div>
                    </div>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVideo(video.id);
                      }}
                      danger
                    />
                  </div>
                </Card>
              ))}
              
              {/* 保存的链接 */}
              {links.map(link => (
                <Card 
                  key={`link-${link.id}`} 
                  size="small" 
                  style={{ 
                    marginBottom: 8,
                    border: selectedMaterials.includes(`link-${link.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    backgroundColor: selectedMaterials.includes(`link-${link.id}`) ? '#f6ffed' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Checkbox
                      checked={selectedMaterials.includes(`link-${link.id}`)}
                      onChange={(e) => handleSelectMaterial(`link-${link.id}`, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div 
                      style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: 8, cursor: 'pointer' }}
                      onClick={() => handleViewMaterial(link, 'link')}
                    >
                      <LinkOutlined style={{ fontSize: 16, color: '#fa8c16', marginRight: 8 }} />
                      <div style={{ flex: 1 }}>
                        <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{link.title}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                          {link.url}
                        </Text>
                      </div>
                    </div>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLink(link.id);
                      }}
                      danger
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
      </div>

      {/* 中间问答区域 */}
      <div style={{ flex: 1, margin: '16px', background: '#fff', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
              💬 智能问答
            </Title>
          </div>
          
          {/* 消息列表 */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: 16 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 8
                }}>
                  {msg.type === 'assistant' && (
                    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  )}
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: msg.type === 'user' ? '#1890ff' : '#f6f6f6',
                    color: msg.type === 'user' ? '#fff' : '#333'
                  }}>
                    <Text style={{ color: 'inherit' }}>{msg.content}</Text>
                  </div>
                  {msg.type === 'user' && (
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <div style={{ padding: '12px 16px', backgroundColor: '#f6f6f6', borderRadius: '12px' }}>
                  <Text>正在思考中...</Text>
                </div>
              </div>
            )}
          </div>
          
          {/* 输入区域 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="请输入您的问题..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={isLoading}
                disabled={!inputMessage.trim()}
              >
                发送
              </Button>
            </Space.Compact>
          </div>
        </div>

        {/* 右侧操作区域 */}
        <div style={{ width: 320, background: '#fff', margin: '16px 16px 16px 0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* 上半部分 - 功能概览 */}
          <div style={{ padding: '20px', flex: 1 }}>
            <Title level={5} style={{ marginBottom: 16, color: '#1f1f1f' }}>
              🛠️ 操作面板
            </Title>
            
            {/* 功能卡片网格 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: 16 }}>
              {/* 音频概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('audio')}
                style={{ 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>🎵</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#1565c0' 
                  }}>音频概览</Text>
                </div>
              </Card>
              
              {/* 视频概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('video')}
                style={{ 
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>📹</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#2e7d32' 
                  }}>视频概览</Text>
                </div>
              </Card>
              
              {/* 思维导图 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('mindmap')}
                style={{ 
                  background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>🧠</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#c2185b' 
                  }}>思维导图</Text>
                </div>
              </Card>
              
              {/* 报告 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('report')}
                style={{ 
                  background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>📊</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#ef6c00' 
                  }}>报告</Text>
                </div>
              </Card>
              
              {/* PPT概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('ppt')}
                style={{ 
                  background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                   <div style={{ fontSize: '20px', marginBottom: '6px' }}>📽️</div>
                   <Text style={{ 
                     fontSize: '11px', 
                     fontWeight: 500, 
                     color: '#d32f2f' 
                   }}>PPT概览</Text>
                 </div>
              </Card>
              
              {/* 网页代码 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('webcode')}
                style={{ 
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                   <div style={{ fontSize: '20px', marginBottom: '6px' }}>💻</div>
                   <Text style={{ 
                     fontSize: '11px', 
                     fontWeight: 500, 
                     color: '#7b1fa2' 
                   }}>网页代码</Text>
                 </div>
              </Card>
            </div>
          </div>
          
          {/* 下半部分 - 操作记录 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Title level={5} style={{ marginBottom: 16, color: '#1f1f1f', fontSize: '14px' }}>
              📋 操作记录
            </Title>
            
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '300px' }}>
              {Object.values(operationRecords).flat().map(record => {
                const getIcon = (type) => {
                    switch(type) {
                      case 'audio': return '🎵';
                      case 'video': return '📹';
                      case 'mindmap': return '🧠';
                      case 'report': return '📊';
                      case 'ppt': return '📽️';
                      case 'webcode': return '💻';
                      case 'file': return '📄';
                      case 'text': return '📝';
                      case 'link': return '🔗';
                      default: return '📄';
                    }
                  };
                
                return (
                  <Card 
                    key={record.id}
                    size="small" 
                    hoverable
                    style={{ 
                      marginBottom: '8px',
                      borderRadius: '8px',
                      border: '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ fontSize: '16px', marginTop: '2px' }}>
                        {getIcon(record.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text 
                          style={{ 
                            fontSize: '12px', 
                            fontWeight: 500, 
                            color: '#1f1f1f',
                            display: 'block',
                            marginBottom: '4px',
                            lineHeight: '1.4'
                          }}
                          ellipsis={{ tooltip: record.title }}
                        >
                          {record.title}
                        </Text>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: '10px', color: '#999' }}>
                            {record.source}
                          </Text>
                          <Text style={{ fontSize: '10px', color: '#999' }}>
                            {record.time}
                          </Text>
                        </div>
                      </div>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<div style={{ fontSize: '12px' }}>▶</div>}
                        style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                      />
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<div style={{ fontSize: '12px' }}>⋯</div>}
                        style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                      />
                    </div>
                  </Card>
                );
              })}
              
              {Object.values(operationRecords).flat().length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
                  暂无操作记录
                </div>
              )}
            </div>
            
            {/* 新建笔记按钮 */}
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateNewNote}
                style={{
                  borderRadius: '6px',
                  fontSize: '12px',
                  height: '32px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                新建笔记
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 上传弹窗 */}
      <Modal
      title="添加来源"
      open={showUploadModal}
      onCancel={() => setShowUploadModal(false)}
      footer={null}
      width={600}
    >
      <div style={{ padding: '20px 0' }}>
        {/* 文档上传区域 */}
        <div style={{ marginBottom: 32 }}>
          <Title level={5} style={{ marginBottom: 16 }}>文档上传</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            请选择要上传的文档，NotebookLM 智能笔记支持以下格式的资料来源：
          </Text>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
            (示例：教育方案、课程设计材料、研究报告、会议文档内容、辅导文档等)
          </Text>
          <Upload.Dragger
            multiple
            onChange={handleFileUpload}
            showUploadList={false}
            accept=".pdf,.doc,.docx,.txt,.md"
            style={{ marginBottom: 16 }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">上传文档</p>
            <p className="ant-upload-hint">
              拖放文档文件到此处，或点击上传
            </p>
          </Upload.Dragger>
          <Text type="secondary" style={{ fontSize: 12 }}>
            支持的文档类型：PDF, txt, Markdown 等格式（例如 .md）
          </Text>
        </div>

        <Divider />

        {/* 网站地址添加区域 */}
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>添加网站地址</Title>
          
          {/* 网站类型选择 */}
          <div style={{ marginBottom: 16 }}>
            <Text style={{ marginRight: 8 }}>网站类型：</Text>
            <Select
              value={websiteType}
              onChange={setWebsiteType}
              style={{ width: 120, marginRight: 16 }}
            >
              <Option value="normal">普通网站</Option>
              <Option value="video">视频网站</Option>
            </Select>
            {websiteType === 'video' && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                支持B站、小红书视频
              </Text>
            )}
          </div>
          
          {/* 网站地址输入 */}
          <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
            <Input
              placeholder={websiteType === 'video' ? '输入B站或小红书视频链接' : '输入网站地址'}
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              onPressEnter={handleAddWebsite}
              prefix={<LinkOutlined />}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddWebsite}>
              添加
            </Button>
          </Space.Compact>
          
          {/* 示例说明 */}
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            {websiteType === 'video' ? 
              '示例：https://www.bilibili.com/video/BV1xx411c7mu 或 https://www.xiaohongshu.com/explore/xxx' :
              '示例：https://www.example.com'
            }
          </Text>
         </div>

         <Divider />

         {/* 文字内容添加区域 */}
         <div>
           <Title level={5} style={{ marginBottom: 16 }}>添加文字</Title>
           
           {/* 文字内容输入 */}
           <div style={{ marginBottom: 16 }}>
             <TextArea
               placeholder="输入文字内容..."
               value={textContent}
               onChange={(e) => setTextContent(e.target.value)}
               rows={4}
               maxLength={1000}
               showCount
               style={{ marginBottom: 12 }}
             />
             <Button 
               type="primary" 
               icon={<PlusOutlined />} 
               onClick={handleAddText}
               block
             >
               添加文字
             </Button>
           </div>
           
           {/* 说明文字 */}
           <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
             添加的文字内容将作为资料来源，可用于AI问答和分析
           </Text>
         </div>

         <Divider />

         {/* 课程视频添加区域 */}
         <div>
           <Title level={5} style={{ marginBottom: 16 }}>添加课程视频</Title>
           
           {/* 视频标题输入 */}
           <div style={{ marginBottom: 12 }}>
             <Input
               placeholder="输入视频标题..."
               value={videoTitle}
               onChange={(e) => setVideoTitle(e.target.value)}
               maxLength={100}
               showCount
             />
           </div>
           
           {/* 视频链接输入 */}
           <div style={{ marginBottom: 16 }}>
             <Input
               placeholder="输入视频链接..."
               value={videoUrl}
               onChange={(e) => setVideoUrl(e.target.value)}
               addonBefore="🎥"
             />
             <Button 
               type="primary" 
               icon={<PlusOutlined />} 
               onClick={handleAddVideo}
               block
               style={{ marginTop: 12 }}
             >
               添加视频
             </Button>
           </div>
           
           {/* 说明文字 */}
           <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
             支持各类视频平台链接，如B站、YouTube、腾讯视频等
           </Text>
           <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
             示例：https://www.bilibili.com/video/BV1xx411c7mu
           </Text>
         </div>

      </div>
       </Modal>
       
      {/* 资料详情查看弹窗 */}
      <Modal
        title={`查看${currentMaterial?.type === 'file' ? '文件' : 
                currentMaterial?.type === 'text' ? '文字' : 
                currentMaterial?.type === 'video' ? '视频' : '链接'}详情`}
        open={showMaterialDetail}
        onCancel={() => {
          setShowMaterialDetail(false);
          setCurrentMaterial(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setShowMaterialDetail(false);
            setCurrentMaterial(null);
          }}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {currentMaterial && currentMaterial.data && (
           <div>
             {currentMaterial.type === 'file' && (
               <div>
                 <p><strong>文件名：</strong>{currentMaterial.data.name}</p>
                 <p><strong>文件大小：</strong>{(currentMaterial.data.size / 1024).toFixed(1)}KB</p>
                 <p><strong>文件类型：</strong>{currentMaterial.data.type || '未知'}</p>
                 <p><strong>上传时间：</strong>{new Date().toLocaleString()}</p>
               </div>
             )}
             {currentMaterial.type === 'text' && (
               <div>
                 <p><strong>标题：</strong>{currentMaterial.data.title}</p>
                 <p><strong>内容：</strong></p>
                 <div style={{ 
                   padding: '12px', 
                   backgroundColor: '#f5f5f5', 
                   borderRadius: '6px',
                   whiteSpace: 'pre-wrap',
                   maxHeight: '300px',
                   overflow: 'auto'
                 }}>
                   {currentMaterial.data.content}
                 </div>
               </div>
             )}
             {currentMaterial.type === 'video' && (
               <div>
                 <p><strong>视频标题：</strong>{currentMaterial.data.title}</p>
                 <p><strong>视频链接：</strong>
                   <a href={currentMaterial.data.url} target="_blank" rel="noopener noreferrer">
                     {currentMaterial.data.url}
                   </a>
                 </p>
               </div>
             )}
             {currentMaterial.type === 'link' && (
               <div>
                 <p><strong>链接标题：</strong>{currentMaterial.data.title}</p>
                 <p><strong>链接地址：</strong>
                   <a href={currentMaterial.data.url} target="_blank" rel="noopener noreferrer">
                     {currentMaterial.data.url}
                   </a>
                 </p>
               </div>
             )}
           </div>
         )}
      </Modal>
    </>
  );
};

export default NoteEditPage;