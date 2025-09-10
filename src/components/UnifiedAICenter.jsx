import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  MessageCircle, 
  MessageSquare,
  Code, 
  Languages, 
  Calculator, 
  Music, 
  BarChart3,
  PenTool,
  Image,
  Search,
  Mic,
  Send,
  User,
  Loader,
  Sparkles,
  FileText,
  Brain,
  Zap,
  Star,
  Settings,
  Plus,
  ArrowRight,
  Play,
  Copy,
  Edit3,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Volume2,
  RefreshCw,
  Check,
  X,
  Maximize2,
  Minimize2,
  Download,
  Upload,
  Folder,
  Save,
  Paperclip,
  Phone,
  MicOff,
  VolumeX,
  Trash2,
  Video,
  Headphones,
  Lightbulb,
  Heart,
  Crown,
  Flame
} from 'lucide-react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Avatar, 
  Space, 
  Typography, 
  message as antdMessage, 
  Statistic, 
  Badge, 
  Tooltip, 
  Divider,
  List,
  Tag,
  Progress,
  Tabs,
  Modal,
  Drawer,
  Switch,
  Slider,
  Select,
  Radio,
  Menu,
  Empty,
  Spin,
  Popover
} from 'antd';
import './UnifiedAICenter.css';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const UnifiedAICenter = () => {
  // 基础状态
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      type: 'ai',
      content: '👋 欢迎使用AI工具箱！\n\n我是您的智能助手，可以帮助您：\n\n🔧 **编程开发** - 代码生成、调试、优化\n🌐 **多语言翻译** - 支持多种语言互译\n📊 **数据分析** - 图表制作、数据处理\n🎵 **音乐创作** - 旋律生成、和弦编配\n✏️ **文本创作** - 写作辅助、内容生成\n🖼️ **图像处理** - 图片分析、创意设计\n🔍 **智能搜索** - 信息检索、知识问答\n🎤 **语音交互** - 语音识别、对话交流\n\n💡 **使用提示：**\n- 选择左侧工具开始对话\n- 点击快速模板获取灵感\n- 使用语音输入更便捷\n- 支持文件上传和下载\n\n现在就开始您的AI之旅吧！',
      timestamp: new Date(),
      tool: null
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [deepThinking, setDeepThinking] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  
  // 界面状态
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateSearchText, setTemplateSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedImageCategory, setSelectedImageCategory] = useState('featured');
  
  // 附件上传状态
  const [showAttachmentPopover, setShowAttachmentPopover] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // 文档中心选择弹窗状态
  const [showDocumentCenter, setShowDocumentCenter] = useState(false);
  const [selectedCloudFiles, setSelectedCloudFiles] = useState([]);
  
  // 编辑器状态
  const [editorContent, setEditorContent] = useState('');
  const [editorMode, setEditorMode] = useState('markdown');
  const [splitScreenMode, setSplitScreenMode] = useState(false);
  
  // 预览区域状态
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // 图片预览状态
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // 代码查看状态
  const [sourceCode, setSourceCode] = useState('');
  const [codeFileName, setCodeFileName] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);

  // 工具函数
  const getDemoName = (url) => {
    if (url.includes('lens')) return '透镜成像演示';
    if (url.includes('spring')) return '弹簧振动模拟器';
    if (url.includes('circuit')) return '电路演示';
    if (url.includes('projectile')) return '抛物运动模拟器';
    if (url.includes('molecular')) return '分子结构3D查看器';
    if (url.includes('function')) return '数学函数图形计算器';
    return '演示程序';
  };

  const getDemoIcon = (url) => {
    if (url.includes('lens')) return '🔬';
    if (url.includes('spring')) return '🌊';
    if (url.includes('circuit')) return '⚡';
    if (url.includes('projectile')) return '🎯';
    if (url.includes('molecular')) return '🧪';
    if (url.includes('function')) return '📊';
    return '🖥️';
  };
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [richTextEditor, setRichTextEditor] = useState(null);
  
  // 消息滚动引用
  const messagesEndRef = useRef(null);
  
  // 模板按钮引用
  const templateButtonRef = useRef(null);
  
  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 渲染消息内容，检测静态网页链接并显示为卡片
  const renderMessageContent = (content) => {
    if (!content) return content;
    
    // 检测URL的正则表达式
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    const elements = [];
    let textContent = '';
    
    parts.forEach((part, index) => {
      // 重新创建正则表达式来测试每个部分
      const testRegex = /^https?:\/\/[^\s]+$/;
      if (testRegex.test(part)) {
        // 检测是否为静态网页链接（html文件或常见的静态网站）
        const isStaticPage = part.includes('.html') || 
                            part.includes('github.io') || 
                            part.includes('netlify.app') || 
                            part.includes('vercel.app') ||
                            part.includes('surge.sh') ||
                            part.match(/\.(html|htm)$/i);
        
        if (isStaticPage) {
          // 如果有文本内容，先添加文本
          if (textContent.trim()) {
            elements.push(
              <div key={`text-${index}`} style={{ marginBottom: '12px' }}>
                {textContent}
              </div>
            );
            textContent = '';
          }
          

          
          // 添加演示卡片
          elements.push(
            <Card
              key={`demo-${index}`}
              size="small"
              hoverable
              style={{
                marginTop: '8px',
                marginBottom: '8px',
                borderRadius: '8px',
                border: '1px solid #e8f4fd',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // 修正URL：处理端口和路径
                let correctedUrl = part;
                // 处理5173端口到3000端口的转换
                correctedUrl = correctedUrl.replace('localhost:5173/', 'localhost:3000/');
                // 处理路径中的空格编码和实际空格
                correctedUrl = correctedUrl.replace('/gen%20html/', '/gen-html/').replace('/gen html/', '/gen-html/');
                // 截取URL到.html结束，去掉后面的编码参数
                const htmlIndex = correctedUrl.indexOf('.html');
                if (htmlIndex !== -1) {
                  correctedUrl = correctedUrl.substring(0, htmlIndex + 5);
                }
                console.log('Original URL:', part);
                console.log('Corrected URL:', correctedUrl);
                setPreviewUrl(correctedUrl);
                setShowPreview(true);
                antdMessage.success('已在右侧预览区域打开演示页面');
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* 缩略图区域 */}
                <div style={{
                  width: '60px',
                  height: '45px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  position: 'relative',
                  background: '#f5f5f5',
                  border: '1px solid #e0e0e0'
                }}>
                  <img
                    src={`https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(part)}&dimension=300x225&format=png&cacheLimit=0&delay=1000`}
                    alt="网页预览"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      // 如果缩略图加载失败，显示图标
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: 'white'
                  }}>
                    {getDemoIcon(part)}
                  </div>
                </div>
                
                {/* 内容区域 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#1e40af',
                    fontSize: '14px',
                    marginBottom: '2px'
                  }}>
                    {getDemoName(part)}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {part}
                  </div>
                </div>
                
                {/* 播放按钮 */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#1890ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  <Play size={14} />
                </div>
              </div>
            </Card>
          );
        } else {
          // 普通链接，添加到文本内容中
          textContent += (
            <a
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1890ff' }}
            >
              {part}
            </a>
          );
        }
      } else {
        // 普通文本，添加到文本内容中
        textContent += part;
      }
    });
    
    // 如果还有剩余的文本内容，添加到元素数组中
    if (textContent.trim()) {
      elements.push(
        <div key="final-text">
          {textContent}
        </div>
      );
    }
    
    return elements.length > 0 ? elements : content;
  };

  // 文件上传处理函数
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFilesUpload(files);
  };

  const handleFilesUpload = async (files) => {
    if (files.length === 0) return;

    setIsUploading(true);
    const newFiles = [];

    for (const file of files) {
      // 文件验证
      if (!validateFile(file)) {
        continue;
      }

      const fileData = {
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: null,
        uploadProgress: 0
      };

      // 如果是图片，生成预览
      if (file.type.startsWith('image/')) {
        try {
          const preview = await generateImagePreview(file);
          fileData.preview = preview;
        } catch (error) {
          console.error('生成图片预览失败:', error);
        }
      }

      newFiles.push(fileData);
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(false);
    
    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 文件验证
  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (file.size > maxSize) {
      antdMessage.error(`文件 "${file.name}" 大小超过10MB限制`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      antdMessage.error(`不支持的文件类型: ${file.type}`);
      return false;
    }

    return true;
  };

  // 生成图片预览
  const generateImagePreview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 删除上传的文件
  const removeUploadedFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取文件图标
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📕';
    if (fileType.includes('word')) return '📄';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📊';
    if (fileType === 'text/plain') return '📝';
    return '📎';
  };
  
  // 获取图像模版数据
  const getImageTemplatesByCategory = (category) => {
    const templates = {
      featured: [
        { id: 1, title: '课堂讲解', prompt: '教师在黑板前讲课，学生认真听讲，明亮的教室环境', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '1 / 1 / 3 / 2', textColor: 'white' },
        { id: 2, title: '实验操作', prompt: '学生在实验室进行科学实验，专业设备，安全操作', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', gridArea: '1 / 2 / 2 / 3', textColor: 'white' },
        { id: 3, title: '小组讨论', prompt: '学生围坐讨论学习问题，协作学习，积极互动', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '1 / 3 / 2 / 4', textColor: '#333' },
        { id: 4, title: '数字化教学', prompt: '智能黑板，多媒体教学，现代化教室设备', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', gridArea: '1 / 4 / 3 / 5', textColor: 'white' },
        { id: 5, title: '课外活动', prompt: '学生参与课外实践活动，户外教学，寓教于乐', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', gridArea: '2 / 2 / 3 / 3', textColor: '#333' },
        { id: 6, title: '图书阅读', prompt: '学生在图书馆安静阅读，书香环境，知识氛围', gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', gridArea: '2 / 3 / 3 / 4', textColor: '#333' },
        { id: 7, title: '成果展示', prompt: '学生展示学习成果，自信表达，成就感满满', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', gridArea: '3 / 1 / 4 / 2', textColor: 'white' },
        { id: 8, title: '师生互动', prompt: '教师与学生亲切交流，答疑解惑，和谐师生关系', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '3 / 2 / 4 / 3', textColor: 'white' },
        { id: 9, title: '在线学习', prompt: '学生使用电脑进行在线学习，远程教育，数字化学习', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', gridArea: '3 / 3 / 4 / 4', textColor: '#333' },
        { id: 10, title: '毕业典礼', prompt: '学生毕业典礼场景，学位帽，庄严仪式，人生里程碑', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '3 / 4 / 4 / 5', textColor: '#333' }
      ],
      courseware: [
        { id: 1, title: '数学公式', prompt: '数学公式板书，清晰的数学符号，教学黑板背景', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '1 / 1 / 3 / 2', textColor: 'white' },
        { id: 2, title: '化学实验', prompt: '化学实验器材，试管烧杯，实验室场景，科学教学', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', gridArea: '1 / 2 / 2 / 3', textColor: 'white' },
        { id: 3, title: '历史时间轴', prompt: '历史时间轴图表，重要历史事件，教学图表设计', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '1 / 3 / 2 / 4', textColor: '#333' },
        { id: 4, title: '地理地图', prompt: '世界地图，地理教学，国家边界，教育用途', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', gridArea: '1 / 4 / 3 / 5', textColor: 'white' },
        { id: 5, title: '生物结构图', prompt: '生物细胞结构图，教学插图，科学示意图', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', gridArea: '2 / 2 / 3 / 3', textColor: '#333' },
        { id: 6, title: '物理实验', prompt: '物理实验装置，力学演示，教学实验器材', gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', gridArea: '2 / 3 / 3 / 4', textColor: '#333' },
        { id: 7, title: '语文古诗', prompt: '古诗词配图，中国古典文学，诗意画面，文化教学', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', gridArea: '3 / 1 / 4 / 2', textColor: 'white' },
        { id: 8, title: '英语单词卡', prompt: '英语单词卡片，词汇教学，图文并茂，语言学习', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '3 / 2 / 4 / 3', textColor: 'white' },
        { id: 9, title: '课程封面', prompt: '课程封面设计，教学主题，专业排版，教育品牌', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', gridArea: '3 / 3 / 4 / 4', textColor: '#333' },
        { id: 10, title: '知识导图', prompt: '思维导图，知识结构图，学习框架，教学工具', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '3 / 4 / 4 / 5', textColor: '#333' }
      ],
      art: [
        { id: 1, title: '科学插图', prompt: '科学教学插图，清晰准确，教育用途，专业绘制', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '1 / 1 / 3 / 2', textColor: 'white' },
        { id: 2, title: '历史插画', prompt: '历史教学插画，古代场景，历史人物，教育素材', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', gridArea: '1 / 2 / 2 / 3', textColor: 'white' },
        { id: 3, title: '地理示意图', prompt: '地理教学示意图，地形地貌，气候现象，教学图表', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '1 / 3 / 2 / 4', textColor: '#333' },
        { id: 4, title: '文学配图', prompt: '文学作品配图，诗词意境，文学场景，艺术表现', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', gridArea: '1 / 4 / 3 / 5', textColor: 'white' },
        { id: 5, title: '数学图形', prompt: '数学教学图形，几何图案，数学概念，教学辅助', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', gridArea: '2 / 2 / 3 / 3', textColor: '#333' },
        { id: 6, title: '体育运动', prompt: '体育教学插图，运动姿势，体育项目，健康教育', gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', gridArea: '2 / 3 / 3 / 4', textColor: '#333' },
        { id: 7, title: '音乐艺术', prompt: '音乐教学插图，乐器展示，音乐符号，艺术教育', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', gridArea: '3 / 1 / 4 / 2', textColor: 'white' },
        { id: 8, title: '美术作品', prompt: '美术教学作品，绘画技法，色彩搭配，艺术创作', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '3 / 2 / 4 / 3', textColor: 'white' },
        { id: 9, title: '手工制作', prompt: '手工教学插图，制作步骤，工艺展示，实践教学', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', gridArea: '3 / 3 / 4 / 4', textColor: '#333' },
        { id: 10, title: '安全教育', prompt: '安全教育插图，安全标识，防护措施，教育宣传', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '3 / 4 / 4 / 5', textColor: '#333' }
      ],
      'chinese-style': [
        { id: 1, title: '古诗词教学', prompt: '古诗词教学配图，诗意画面，传统文化教育', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '1 / 1 / 3 / 2', textColor: 'white' },
        { id: 2, title: '历史人物', prompt: '中国历史人物插图，古代名人，历史教学素材', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', gridArea: '1 / 2 / 2 / 3', textColor: 'white' },
        { id: 3, title: '传统节日', prompt: '中国传统节日插图，节庆文化，民俗教育', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '1 / 3 / 2 / 4', textColor: '#333' },
        { id: 4, title: '古代建筑', prompt: '中国古代建筑教学图，建筑文化，历史遗迹', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', gridArea: '1 / 4 / 3 / 5', textColor: 'white' },
        { id: 5, title: '书法教学', prompt: '书法教学示范，汉字文化，传统艺术教育', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', gridArea: '2 / 2 / 3 / 3', textColor: '#333' },
        { id: 6, title: '传统工艺', prompt: '中国传统工艺教学，手工技艺，文化传承', gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', gridArea: '2 / 3 / 3 / 4', textColor: '#333' },
        { id: 7, title: '民族服饰', prompt: '中国民族服饰教学，传统服装，文化多样性', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', gridArea: '3 / 1 / 4 / 2', textColor: 'white' },
        { id: 8, title: '古代科技', prompt: '中国古代科技发明，四大发明，科技史教学', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '3 / 2 / 4 / 3', textColor: 'white' },
        { id: 9, title: '传统音乐', prompt: '中国传统音乐教学，民族乐器，音乐文化', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', gridArea: '3 / 3 / 4 / 4', textColor: '#333' },
        { id: 10, title: '文化符号', prompt: '中国文化符号教学，龙凤图腾，文化内涵', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '3 / 4 / 4 / 5', textColor: '#333' }
      ],
      anime: [
        { id: 1, title: '教学动画', prompt: '教学动画制作，知识点讲解，生动有趣的教育内容', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '1 / 1 / 3 / 2', textColor: 'white' },
        { id: 2, title: '科普动画', prompt: '科普知识动画，科学原理解释，寓教于乐', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', gridArea: '1 / 2 / 2 / 3', textColor: 'white' },
        { id: 3, title: '历史动画', prompt: '历史事件动画，历史人物故事，时间线展示', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '1 / 3 / 2 / 4', textColor: '#333' },
        { id: 4, title: '数学动画', prompt: '数学概念动画，几何图形演示，数学公式可视化', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', gridArea: '1 / 4 / 3 / 5', textColor: 'white' },
        { id: 5, title: '语言学习', prompt: '语言学习动画，单词记忆，语法教学动画', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', gridArea: '2 / 2 / 3 / 3', textColor: '#333' },
        { id: 6, title: '实验演示', prompt: '实验过程动画，化学反应，物理现象演示', gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', gridArea: '2 / 3 / 3 / 4', textColor: '#333' },
        { id: 7, title: '地理动画', prompt: '地理知识动画，地形地貌，气候变化演示', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', gridArea: '3 / 1 / 4 / 2', textColor: 'white' },
        { id: 8, title: '生物动画', prompt: '生物过程动画，细胞分裂，生命循环演示', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '3 / 2 / 4 / 3', textColor: 'white' },
        { id: 9, title: '安全教育', prompt: '安全教育动画，安全知识普及，防护措施演示', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', gridArea: '3 / 3 / 4 / 4', textColor: '#333' },
        { id: 10, title: '品德教育', prompt: '品德教育动画，道德故事，价值观培养', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '3 / 4 / 4 / 5', textColor: '#333' }
      ],
      '3d-render': [
        { id: 1, title: '教学模型', prompt: '3D教学模型，立体展示，教育演示用途', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '1 / 1 / 3 / 2', textColor: 'white' },
        { id: 2, title: '解剖模型', prompt: '3D解剖模型，人体结构，医学教学用图', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', gridArea: '1 / 2 / 2 / 3', textColor: 'white' },
        { id: 3, title: '分子结构', prompt: '3D分子结构模型，化学教学，原子分子展示', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '1 / 3 / 2 / 4', textColor: '#333' },
        { id: 4, title: '地理模型', prompt: '3D地理模型，地形地貌，地理教学演示', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', gridArea: '1 / 4 / 3 / 5', textColor: 'white' },
        { id: 5, title: '物理模型', prompt: '3D物理模型，力学演示，物理教学用图', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', gridArea: '2 / 2 / 3 / 3', textColor: '#333' },
        { id: 6, title: '建筑模型', prompt: '3D建筑模型，建筑结构，工程教学展示', gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', gridArea: '2 / 3 / 3 / 4', textColor: '#333' },
        { id: 7, title: '机械模型', prompt: '3D机械模型，机械原理，工程技术教学', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', gridArea: '3 / 1 / 4 / 2', textColor: 'white' },
        { id: 8, title: '天体模型', prompt: '3D天体模型，太阳系，天文教学演示', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '3 / 2 / 4 / 3', textColor: 'white' },
        { id: 9, title: '细胞模型', prompt: '3D细胞模型，细胞结构，生物教学用图', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', gridArea: '3 / 3 / 4 / 4', textColor: '#333' },
        { id: 10, title: '数学图形', prompt: '3D数学图形，几何体，数学概念可视化', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '3 / 4 / 4 / 5', textColor: '#333' }
      ],
      product: [
        { id: 1, title: '教学设备', prompt: '教学设备展示，投影仪、电子白板等教育科技产品', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '1 / 1 / 3 / 2', textColor: 'white' },
        { id: 2, title: '学习用品', prompt: '学习用品摄影，文具、书籍、学习工具展示', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', gridArea: '1 / 2 / 2 / 3', textColor: 'white' },
        { id: 3, title: '实验器材', prompt: '实验器材展示，科学仪器、化学试剂、实验工具', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '1 / 3 / 2 / 4', textColor: '#333' },
        { id: 4, title: '教学模具', prompt: '教学模具展示，教学道具、演示工具、教育模型', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', gridArea: '1 / 4 / 3 / 5', textColor: 'white' },
        { id: 5, title: '图书教材', prompt: '图书教材摄影，教科书、参考书、学习资料展示', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', gridArea: '2 / 2 / 3 / 3', textColor: '#333' },
        { id: 6, title: '电子设备', prompt: '教育电子设备，平板电脑、学习机、教育软件', gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', gridArea: '2 / 3 / 3 / 4', textColor: '#333' },
        { id: 7, title: '体育用品', prompt: '体育教学用品，运动器材、体育设施展示', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', gridArea: '3 / 1 / 4 / 2', textColor: 'white' },
        { id: 8, title: '音乐器材', prompt: '音乐教学器材，乐器、音响设备展示', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '3 / 2 / 4 / 3', textColor: 'white' },
        { id: 9, title: '美术用品', prompt: '美术教学用品，画笔、颜料、画板等艺术工具', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', gridArea: '3 / 3 / 4 / 4', textColor: '#333' },
        { id: 10, title: '办公用品', prompt: '教学办公用品，文件夹、打印机、办公设备', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '3 / 4 / 4 / 5', textColor: '#333' }
      ],
      landscape: [
        { id: 1, title: '校园风景', prompt: '校园风景摄影，教学楼、操场、校园环境', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '1 / 1 / 3 / 2', textColor: 'white' },
        { id: 2, title: '教室场景', prompt: '教室场景摄影，课桌椅、黑板、教学环境', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', gridArea: '1 / 2 / 2 / 3', textColor: 'white' },
        { id: 3, title: '图书馆', prompt: '图书馆场景，书架、阅读区、学习氛围', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '1 / 3 / 2 / 4', textColor: '#333' },
        { id: 4, title: '实验室', prompt: '实验室场景，科学设备、实验台、研究环境', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', gridArea: '1 / 4 / 3 / 5', textColor: 'white' },
        { id: 5, title: '户外教学', prompt: '户外教学场景，自然环境、野外课堂、实地学习', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', gridArea: '2 / 2 / 3 / 3', textColor: '#333' },
        { id: 6, title: '多媒体室', prompt: '多媒体教室，投影设备、电脑、现代化教学', gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', gridArea: '2 / 3 / 3 / 4', textColor: '#333' },
        { id: 7, title: '体育场馆', prompt: '体育场馆场景，运动场地、体育设施、运动环境', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', gridArea: '3 / 1 / 4 / 2', textColor: 'white' },
        { id: 8, title: '艺术教室', prompt: '艺术教室场景，画室、音乐室、创作环境', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gridArea: '3 / 2 / 4 / 3', textColor: 'white' },
        { id: 9, title: '会议室', prompt: '教学会议室，讨论环境、培训场所、学术交流', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', gridArea: '3 / 3 / 4 / 4', textColor: '#333' },
        { id: 10, title: '学习角落', prompt: '学习角落场景，安静环境、个人学习空间', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', gridArea: '3 / 4 / 4 / 5', textColor: '#333' }
      ]
    };
    return templates[category] || templates.featured;
  };
  
  // 消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 点击外部区域关闭附件弹窗
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAttachmentPopover && !event.target.closest('.attachment-popover-container')) {
        setShowAttachmentPopover(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAttachmentPopover]);
  
  // 设置状态
  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  });
  
  // 历史对话状态
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      title: '数学教学计划制定',
      lastMessage: '帮我制定七年级数学上学期教学计划',
      timestamp: new Date(Date.now() - 7200000),
      messages: []
    },
    {
      id: '2', 
      title: '语文课程设计优化',
      lastMessage: '这个语文阅读课程设计有什么可以优化的地方？',
      timestamp: new Date(Date.now() - 10800000),
      messages: []
    },
    {
      id: '3',
      title: '班级管理策略',
      lastMessage: '请帮我制定有效的班级管理策略',
      timestamp: new Date(Date.now() - 86400000),
      messages: []
    },
    {
      id: '4',
      title: '教师教研系统设计',
      lastMessage: '设计一个教师教研管理系统',
      timestamp: new Date(Date.now() - 86400000),
      messages: []
    },
    {
      id: '5',
      title: '学生评价体系',
      lastMessage: '请介绍多元化学生评价体系的构建方法',
      timestamp: new Date(Date.now() - 172800000),
      messages: []
    },
    {
      id: '6',
      title: '课堂互动设计',
      lastMessage: '如何设计有效的课堂互动环节',
      timestamp: new Date(Date.now() - 172800000),
      messages: []
    },
    {
      id: '7',
      title: '教学资源整合',
      lastMessage: '如何有效整合多媒体教学资源',
      timestamp: new Date(Date.now() - 259200000),
      messages: []
    },
    {
      id: '8',
      title: '家校沟通技巧',
      lastMessage: '介绍有效的家校沟通方法和技巧',
      timestamp: new Date(Date.now() - 259200000),
      messages: []
    },
    {
      id: '9',
      title: '教学成果展示',
      lastMessage: '如何制作教学成果展示材料',
      timestamp: new Date(Date.now() - 604800000),
      messages: []
    },
    {
      id: '10',
      title: '课程评估方法',
      lastMessage: '如何设计科学的课程评估方法',
      timestamp: new Date(Date.now() - 604800000),
      messages: []
    },
    {
      id: '11',
      title: '教学反思写作',
      lastMessage: '教学反思的写作要点和方法',
      timestamp: new Date(Date.now() - 604800000),
      messages: []
    },
    {
      id: '12',
      title: '创新教学方法',
      lastMessage: '探索创新的互动教学方法',
      timestamp: new Date(Date.now() - 1209600000),
      messages: []
    },
    {
      id: '13',
      title: '创建三角形交互式页面',
      lastMessage: '设计三角形交互式网页',
      timestamp: new Date(Date.now() - 1209600000),
      messages: []
    },
    {
      id: '14',
      title: '制作三角形互动动画',
      lastMessage: '三角形动画制作教程',
      timestamp: new Date(Date.now() - 1209600000),
      messages: []
    },
    {
      id: '15',
      title: '解释国内内容',
      lastMessage: '解释相关国内内容政策',
      timestamp: new Date(Date.now() - 1209600000),
      messages: []
    },
    {
      id: '16',
      title: '适合合适基础设施',
      lastMessage: '基础设施建设方案讨论',
      timestamp: new Date(Date.now() - 1814400000),
      messages: []
    },
    {
      id: '17',
      title: '生成菜单型动画',
      lastMessage: '制作菜单动画效果',
      timestamp: new Date(Date.now() - 1814400000),
      messages: []
    },
    {
      id: '18',
      title: '设计网页接口',
      lastMessage: '网页API接口设计',
      timestamp: new Date(Date.now() - 1814400000),
      messages: []
    },
    {
      id: '19',
      title: '图片黑白化',
      lastMessage: '如何将图片转换为黑白',
      timestamp: new Date(Date.now() - 2592000000),
      messages: []
    },
    {
      id: '20',
      title: 'Excel表格合并',
      lastMessage: '多个Excel表格合并方法',
      timestamp: new Date(Date.now() - 2592000000),
      messages: []
    }
  ]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [selectedTool, setSelectedTool] = useState({ key: 'coding', label: 'AI编程', icon: Code, description: '编程教学辅助和代码示例生成' });
  
  // 分享状态
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSettings, setShareSettings] = useState({
    isPublic: false,
    allowComments: true,
    allowDownload: false
  });
  const [collaborators, setCollaborators] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [shareLink, setShareLink] = useState('https://ai-center.example.com/share/abc123');
  const [linkCopied, setLinkCopied] = useState(false);

  // AI工具配置
  const aiTools = [
    { key: 'new-chat', label: '新对话', icon: MessageCircle, description: '开始新的教学对话，获得个性化教学支持' },
    { key: 'ai-search', label: 'AI搜索', icon: Search, description: '智能搜索教学资源和教育信息' },
    { key: 'writing', label: '帮我写作', icon: PenTool, description: '协助撰写教学文档和教研材料' },
    { key: 'coding', label: 'AI编程', icon: Code, description: '编程教学辅助和代码示例生成', badge: 1 },
    { key: 'image-gen', label: '图像生成', icon: Image, description: '生成教学图片和课件素材' },
    { key: 'more', label: '更多', icon: Bot, description: '更多教育AI工具' }
  ];

  // 快速模板数据
  const quickTemplates = [
    {
      category: '教学设计',
      templates: [
        { title: '教学计划', content: '请帮我制定[学科][年级]的教学计划，包含教学目标、重点难点、教学方法和评价方式。' },
        { title: '课程大纲', content: '请帮我设计[课程名称]的课程大纲，包含课程介绍、学习目标、教学内容安排和考核方式。' },
        { title: '教学反思', content: '请帮我写一份关于[课程主题]的教学反思，分析教学效果、学生反馈和改进建议。' }
      ]
    },
    {
      category: '教研文档',
      templates: [
        { title: '教研报告', content: '请帮我撰写[教研主题]的教研报告，包含研究背景、方法、发现和教学建议。' },
        { title: '听课记录', content: '请帮我整理[教师姓名][学科]课程的听课记录，包含教学亮点、问题分析和改进建议。' },
        { title: '教学评估', content: '请帮我制定[课程/教师]的教学评估方案，包含评估指标、评估方法和评分标准。' }
      ]
    },
    {
      category: '学生管理',
      templates: [
        { title: '学生评语', content: '请帮我为[学生姓名]写一份期末评语，突出学习表现、品格特点和发展建议。' },
        { title: '家长沟通', content: '请帮我起草与[学生姓名]家长的沟通内容，关于[具体事项]，语气友善专业。' },
        { title: '班级总结', content: '请帮我写一份[时间段]的班级工作总结，包含班级情况、活动开展和管理成效。' }
      ]
    }
  ];

  // AI编程模板数据
  const codingTemplates = [
    {
      category: '游戏开发',
      templates: [
        { title: '贪吃蛇游戏', content: '请帮我开发一个贪吃蛇游戏，包含游戏逻辑、界面设计和得分系统。' },
        { title: '飞机大战', content: '请帮我制作一个飞机大战游戏，包含飞机控制、敌机生成、碰撞检测和射击功能。' },
        { title: '简易钢琴', content: '请帮我开发一个网页钢琴应用，包含音符播放、键盘交互和音效处理。' }
      ]
    },
    {
      category: '工具应用',
      templates: [
        { title: '待办清单', content: '请帮我创建一个待办事项管理应用，包含任务添加、删除、标记完成和数据持久化功能。' },
        { title: '图表可视化工具', content: '请帮我开发一个数据可视化工具，支持多种图表类型和数据导入功能。' },
        { title: 'APP原型', content: '请帮我设计一个移动应用原型，包含界面布局、交互设计和功能模块规划。' }
      ]
    },
    {
      category: '网站开发',
      templates: [
        { title: '独立音乐人网站', content: '请帮我开发一个音乐人展示网站，包含作品展示、个人介绍和联系方式模块。' },
        { title: '智能外呼网站', content: '请帮我创建一个智能客服外呼系统，包含用户管理、通话记录和数据统计功能。' },
        { title: '电商数据看板', content: '请帮我开发一个电商数据分析看板，包含销售统计、用户分析和实时数据展示。' }
      ]
    },
    {
      category: '教育科学',
      templates: [
        { title: '太阳系模拟器', content: '请帮我制作一个太阳系运行模拟器，包含行星轨道、运行动画和天体信息展示。' },
        { title: '凸透镜成像', content: '请帮我开发一个凸透镜成像演示程序，包含光路图绘制、成像规律和交互操作。' },
        { title: '豆包编程AI家教', content: '请帮我设计一个编程学习辅导系统，包含代码检查、学习建议和进度跟踪功能。' }
      ]
    },
    {
      category: '科学演示',
      templates: [
        { title: '大气压强演示', content: '请帮我制作一个大气压强演示程序，包含压强变化动画和交互操作。', url: '/gen-html/atmospheric_pressure_demo.html' },
        { title: '透镜成像演示', content: '请帮我开发一个透镜成像演示程序，包含光路图绘制和成像规律展示。', url: '/gen-html/lens_demo.html' },
        { title: '透镜成像模拟器', content: '请帮我制作一个透镜成像模拟器，包含交互式光路模拟和成像特性分析。', url: '/gen-html/lens_demo.html' },
        { title: '硝化纤维压缩演示', content: '请帮我开发一个硝化纤维压缩演示程序，包含压缩过程动画和物理原理说明。', url: '/gen-html/nitrocellulose_compression_demo.html' },
        { title: '并联电路演示', content: '请帮我制作一个并联电路演示程序，包含电路连接动画和电流分析。', url: '/gen-html/parallel_circuit_demo.html' },
        { title: '弹簧振动模拟器', content: '请帮我开发一个弹簧振动模拟器，包含振动动画和物理参数调节。', url: '/gen-html/spring_simulator.html' }
      ]
    }
  ];

  // 处理工具选择
  const handleToolSelect = (toolKey) => {
    setCurrentTool(toolKey);
    // 清除当前对话记录，确保工具切换时对话记录正确重置
    setCurrentChatId(null);
    setMessages([]);
    
    // 写作和编程工具不显示欢迎消息，使用专用界面
    if (toolKey === 'writing' || toolKey === 'coding') {
      return;
    }
    // 其他工具设置欢迎消息
    const tool = aiTools.find(t => t.key === toolKey);
    if (tool) {
      const welcomeMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `您好！我是${tool.label}，${tool.description}。请告诉我您需要什么帮助？`,
        timestamp: new Date(),
        tool: toolKey
      };
      setMessages([welcomeMessage]);
    }
  };

  // 处理模板选择
  const handleTemplateSelect = (template) => {
    // 所有模板都设置到输入框
    setInputMessage(template.content);
    setShowTemplates(false);
    setTemplateSearchText('');
    setSelectedCategory('all');
  };

  // 根据当前工具获取模版数据
  const getCurrentTemplates = () => {
    if (currentTool === 'coding') {
      return codingTemplates;
    }
    return quickTemplates;
  };

  // 过滤模板
  const filteredTemplates = getCurrentTemplates().map(category => ({
    ...category,
    templates: category.templates.filter(template => 
      template.title.toLowerCase().includes(templateSearchText.toLowerCase()) ||
      template.content.toLowerCase().includes(templateSearchText.toLowerCase())
    )
  })).filter(category => 
    selectedCategory === 'all' || category.category === selectedCategory
  ).filter(category => category.templates.length > 0);

  // 获取所有分类
  const templateCategories = ['all', ...getCurrentTemplates().map(cat => cat.category)];

  // 发送消息
  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && uploadedFiles.length === 0) || isLoading || !selectedTool) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      tool: currentTool,
      files: uploadedFiles.length > 0 ? uploadedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.preview || (file.source === 'cloud' ? file.url : URL.createObjectURL(file)),
        source: file.source || 'upload'
      })) : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setUploadedFiles([]); // 清空已上传的文件
    setIsLoading(true);
    
    // 根据选择的工具生成不同的AI回复
    setTimeout(() => {
      let aiResponse = '';
      
      // 检查用户消息是否包含演示相关内容，添加对应的预览链接
      const addDemoLinks = (response) => {
        const content = userMessage.content.toLowerCase();
        if (content.includes('透镜') || content.includes('成像')) {
          response += '\n\n🔬 透镜成像模拟器演示：http://localhost:3000/gen-html/lens_demo.html';
        }
        if (content.includes('弹簧') || content.includes('振动')) {
          response += '\n\n🌊 弹簧振动模拟器演示：http://localhost:3000/gen-html/spring_simulator.html';
        }
        if (content.includes('电路') || content.includes('欧姆定律')) {
          response += '\n\n⚡ 电路演示：http://localhost:3000/gen-html/parallel_circuit_demo.html';
        }
        if (content.includes('抛物') || content.includes('运动')) {
          response += '\n\n🎯 抛物运动模拟器演示：http://localhost:3000/demos/projectile-motion.html';
        }
        if (content.includes('化学') || content.includes('分子')) {
          response += '\n\n🧪 分子结构3D查看器演示：http://localhost:3000/demos/molecular-viewer.html';
        }
        if (content.includes('数学') || content.includes('函数')) {
          response += '\n\n📊 数学函数图形计算器演示：http://localhost:3000/demos/function-grapher.html';
        }
        return response;
      };
      
      switch(selectedTool.key) {
        case 'chat':
          aiResponse = `你好！我是智能聊天助手。关于"${userMessage.content}"，我很乐意为您提供帮助。请告诉我更多详细信息，我会尽力为您解答。`;
          break;
        case 'code':
          aiResponse = `作为编程助手，我理解您想要了解"${userMessage.content}"。我可以帮您：\n\n• 编写代码示例\n• 解释技术概念\n• 调试程序问题\n• 优化代码性能\n\n请提供更多技术细节，我会给出具体的解决方案。`;
          break;
        case 'translate':
          aiResponse = `我是翻译助手。关于"${userMessage.content}"，请告诉我：\n\n1. 需要翻译的源语言\n2. 目标语言\n3. 翻译场景（商务、学术、日常等）\n\n这样我可以为您提供更准确的翻译服务。`;
          break;
        case 'math':
          aiResponse = `作为数学计算助手，我正在分析"${userMessage.content}"。我可以帮您：\n\n📊 数学公式求解\n📈 统计分析\n🔍 几何计算\n📋 数据处理\n\n请提供具体的数学问题，我会为您详细解答。`;
          break;
        case 'creative':
          aiResponse = `我是创意写作助手，关于"${userMessage.content}"的创作需求，我可以协助您：\n\n🎨 创意构思\n📝 内容创作\n🌈 风格优化\n✨ 文案润色\n\n请描述您的创作目标和风格偏好，我会提供专业建议。`;
          break;
        case 'analysis':
          aiResponse = `作为数据分析助手，我正在分析"${userMessage.content}"。我可以帮您：\n\n📊 数据可视化\n📈 趋势分析\n🔍 深度洞察\n📋 报告生成\n\n请提供具体的数据或分析需求，我会为您制定分析方案。`;
          break;
        case 'image':
          aiResponse = `我是图像处理助手，关于"${userMessage.content}"的图像需求，我可以协助您：\n\n🖼️ 图像生成\n🎨 图像编辑\n🔍 图像分析\n✨ 效果优化\n\n请描述您的图像处理需求，我会提供专业方案。`;
          break;
        case 'music':
          aiResponse = `我是音乐创作助手，关于"${userMessage.content}"的音乐创作，我可以帮您：\n\n🎵 旋律创作\n🎼 和声编配\n🎹 编曲建议\n🎤 歌词创作\n\n请告诉我您的音乐风格和创作需求。`;
          break;
        case 'writing':
          aiResponse = `我是专业写作助手，正在为您分析"${userMessage.content}"的写作需求。我可以帮您：\n\n📝 文章结构规划\n✍️ 内容创作与润色\n📚 素材收集与整理\n🎯 风格调整与优化\n\n基于您的主题，我建议从以下几个方面展开：\n\n1. 明确写作目标和受众\n2. 构建清晰的文章框架\n3. 收集相关素材和论据\n4. 进行创作和反复修改\n\n请告诉我您希望的文章类型、字数要求和具体风格偏好，我会为您提供更详细的写作指导。`;
          break;
        case 'new-chat':
          // 检查特殊关键词并返回对应图片
          const content = userMessage.content.toLowerCase();
          if (content.includes('狗')) {
            aiResponse = `这是一张可爱的狗狗图片：\n\n<img src="https://picsum.photos/800/600?random=1" alt="狗狗图片" style="max-width: 100%; border-radius: 8px; margin: 10px 0;" />`;
          } else if (content.includes('微缩')) {
            // 创建包含文字块和图片块的单个消息
            aiResponse = `
              <div style="margin-bottom: 1px; padding: 2px 4px; background: #f8f9fa; border-radius: 4px; border-left: 2px solid #1890ff;">
                <p style="margin: 0; line-height: 1.2; color: #333; font-size: 12px;">画面风格是移轴摄影风格，呈现强烈移轴模糊效果与浅景深，具有微缩模型质感，以倾斜视角展示热闹的火车站台。</p>
                <p style="margin: 0; line-height: 1.2; color: #333; font-size: 12px;">站台上人们背着行李来来往往，火车停靠在轨道旁，车厢门打开，乘客们肩膀上下车，周围有卖小吃和纪念品的摊位，采用暖黄色调，阳光照亮站台。</p>
                <p style="margin: 0; line-height: 1.2; color: #333; font-size: 12px;">我将按照你的需求生成一张移轴摄影风格的热闹火车站台俯视角图片。</p>
              </div>
              <div style="text-align: center; padding: 1px; background: transparent; border-radius: 4px; margin-top: 1px;">
                <img src="/微缩.png" alt="移轴摄影风格的热闹火车站台" style="width: 180px; height: 135px; object-fit: cover; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); background: transparent;" />
              </div>
            `;
          } else {
            aiResponse = `您好！我是新对话助手。关于"${userMessage.content}"，我很乐意为您提供帮助。请告诉我更多详细信息，我会尽力为您解答。`;
          }
          break;
        default:
          aiResponse = `感谢您使用${selectedTool.label}！关于"${userMessage.content}"，我正在为您处理。请稍等片刻，我会为您提供详细的回复。`;
      }
      
      // 为所有回复添加演示链接检查
      aiResponse = addDemoLinks(aiResponse);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        tool: currentTool
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // 渲染消息
  const renderMessage = (msg) => {
    const isUser = msg.type === 'user';
    
    return (
      <div 
        key={msg.id} 
        className={`message-item ${isUser ? 'user' : 'ai'}`}
        ref={(el) => {
          if (el) {
            // 为图片添加点击事件
            const images = el.querySelectorAll('img');
            console.log('找到图片数量:', images.length);
            images.forEach((img, index) => {
              console.log(`图片${index + 1}:`, img.src);
              img.style.cursor = 'pointer';
              img.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('图片被点击:', img.src);
                handleImageClick(img.src, img.alt);
              };
            });
          }
        }}
      >
        <Avatar 
          size={32} 
          icon={isUser ? <User size={16} /> : <Bot size={16} />}
          style={{ 
            backgroundColor: isUser ? '#1890ff' : '#52c41a',
            flexShrink: 0
          }}
        />
        <div className="message-content">
          <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.content }}>
          </div>
          <div className="message-time">
            {msg.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  // 新建对话
  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: '新对话',
      lastMessage: '',
      timestamp: new Date(),
      messages: []
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  // 选择历史对话
  const handleChatSelect = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages || []);
      // 清除当前选择的工具，确保对话记录正确切换
      setSelectedTool(null);
      setCurrentTool(null);
    }
  };

  // 分享功能
  const handleAddCollaborator = () => {
    if (inviteEmail.trim()) {
      setCollaborators(prev => [...prev, { email: inviteEmail, permission: 'readable' }]);
      setInviteEmail('');
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    message.success('链接已复制到剪贴板');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // 图片点击处理函数
  const handleImageClick = (imageSrc, imageAlt) => {
    setSelectedImage(imageSrc);
    setShowImagePreview(true);
  };

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="unified-ai-center" style={{ display: 'flex', height: '100%' }}>
      {/* 左侧工具箱区域 */}
      <div style={{ 
        width: '380px', 
        display: 'flex', 
        flexDirection: 'column',
        marginRight: '0',
        borderRight: '1px solid #f0f0f0'
      }}>
        {/* 工具选择区域 */}
        <Card 
          style={{ 
            margin: '16px',
            borderRadius: '12px',
            flex: 1
          }}
          styles={{ body: { padding: '16px' } }}
        >
          <div className="sidebar-header" style={{ marginBottom: '16px' }}>
            <div className="sidebar-title" style={{ display: 'flex', alignItems: 'center' }}>
              <Brain size={24} color="#1890ff" />
              <Title level={4} style={{ margin: 0, marginLeft: 8 }}>
                AI工具箱
              </Title>
            </div>
          </div>
          
          <Menu
            mode="vertical"
            selectedKeys={currentTool ? [currentTool] : []}
            style={{ 
              border: 'none',
              fontSize: '14px',
              width: '100%'
            }}
            className="ai-tools-menu"
            items={aiTools.map(tool => {
              const IconComponent = tool.icon;
              return {
                key: tool.key,
                icon: <IconComponent size={16} />,
                label: (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{tool.label}</span>
                    {tool.badge && (
                      <span style={{
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '8px'
                      }}>
                        {tool.badge}
                      </span>
                    )}
                  </div>
                ),
                onClick: () => {
                  handleToolSelect(tool.key);
                  setSelectedTool(tool);
                }
              };
            })}
          />
        </Card>
        
        {/* 历史对话区域 */}
        <Card 
          style={{ 
            margin: '0 16px 16px 16px',
            borderRadius: '12px',
            flex: 1,
            maxHeight: '300px',
            overflow: 'hidden'
          }}
          styles={{ body: { padding: '16px' } }}
        >
          <div className="sidebar-header" style={{ marginBottom: '16px' }}>
            <div className="sidebar-title" style={{ display: 'flex', alignItems: 'center' }}>
              <MessageSquare size={20} color="#1890ff" />
              <Title level={5} style={{ margin: 0, marginLeft: 8 }}>
                历史对话
              </Title>
            </div>
          </div>
          
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {[
              { id: 1, title: '手机聊对话', time: '2小时前' },
              { id: 2, title: '对111的处理', time: '3小时前' },
              { id: 3, title: '生成小白兔图片', time: '昨天' },
              { id: 4, title: '教师教研系统设计', time: '昨天' },
              { id: 5, title: '介绍代码文件', time: '2天前' },
              { id: 6, title: '内卡管理', time: '2天前' },
              { id: 7, title: 'Ragflow 接错及解决', time: '3天前' },
              { id: 8, title: '介绍Copilot功能', time: '3天前' },
              { id: 9, title: '展示作品集', time: '1周前' },
              { id: 10, title: 'nano 编辑器退出', time: '1周前' },
              { id: 11, title: '核验色取演示', time: '1周前' },
              { id: 12, title: '创建三角形互动动画', time: '2周前' },
              { id: 13, title: '创建三角形交互式页面', time: '2周前' },
              { id: 14, title: '制作三角形互动动画', time: '2周前' },
              { id: 15, title: '解释国内内容', time: '2周前' },
              { id: 16, title: '适合合适基础设施', time: '3周前' },
              { id: 17, title: '生成菜单型动画', time: '3周前' },
              { id: 18, title: '设计网页接口', time: '3周前' },
              { id: 19, title: '图片黑白化', time: '1个月前' },
              { id: 20, title: 'Excel表格合并', time: '1个月前' }
            ].map(chat => (
              <div 
                key={chat.id} 
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  marginBottom: '2px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontSize: '13px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => handleChatSelect(chat.id)}
              >
                <div style={{ 
                  fontWeight: '500', 
                  color: '#262626',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {chat.title}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* 中间对话区域 */}
      <div style={{ 
        width: showEditor ? '600px' : (showPreview ? '40%' : (showImagePreview ? '40%' : '100%')), 
        display: 'flex', 
        flexDirection: 'column',
        borderRight: (showEditor || showPreview || showImagePreview) ? '1px solid #f0f0f0' : 'none',
        background: '#fff',
        borderRadius: '8px',
        margin: '16px 0',
        marginRight: (showEditor || showPreview || showImagePreview) ? '0' : '16px'
      }}>
        {/* 对话记录区 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          overflowY: 'auto'
        }}>
          {!selectedTool ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                position: 'relative'
              }}>
                <Sparkles size={32} color="white" />
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Plus size={12} color="white" />
                </div>
              </div>
              <Title level={4}>选择AI工具开始对话</Title>
              <Text type="secondary">选择左侧的AI工具，开始您的智能对话之旅</Text>
            </div>
          ) : messages.length === 0 && selectedTool && selectedTool.key === 'writing' ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              padding: '40px 20px'
            }}>
              {/* 写作工具专用界面 - 根据图示重新设计 */}
              <div style={{
                width: '100%',
                maxWidth: '900px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                {/* 标题区域 */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <Title level={2} style={{ 
                    color: '#1890ff', 
                    marginBottom: '8px',
                    fontWeight: 500
                  }}>帮我写作</Title>
                  <Text type="secondary" style={{ fontSize: '16px' }}>输入主题和写作要求</Text>
                </div>
                
                {/* 写作提示信息 */}
                <div style={{
                  textAlign: 'center',
                  color: '#8c8c8c',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  请在下方输入框中输入您的写作主题和要求，或点击输入框左侧的模板按钮选择写作模板
                </div>
              </div>
            </div>
          ) : messages.length === 0 && selectedTool && selectedTool.key === 'coding' ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              padding: '40px 20px'
            }}>
              {/* AI编程工具专用界面 */}
              <div style={{
                width: '100%',
                maxWidth: '900px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                {/* 标题区域 */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <Title level={2} style={{ 
                    color: '#52c41a', 
                    marginBottom: '8px',
                    fontWeight: 500
                  }}>AI编程助手</Title>
                  <Text type="secondary" style={{ fontSize: '16px' }}>输入编程需求和项目要求</Text>
                </div>
                
                {/* 编程提示信息 */}
                <div style={{
                  textAlign: 'center',
                  color: '#8c8c8c',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  请在下方输入框中输入您的编程需求和项目要求，或点击输入框左侧的模板按钮选择编程模板
                </div>
              </div>
            </div>
          ) : messages.length === 0 && selectedTool && selectedTool.key === 'new-chat' ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              padding: '40px 20px'
            }}>
              {/* 新对话工具专用界面 - 参考图示红框样式 */}
              <div style={{
                width: '100%',
                maxWidth: '900px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '2px solid #ff4d4f',
                borderRadius: '12px',
                padding: '60px 40px',
                backgroundColor: '#fff'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <Title level={2} style={{ 
                    color: '#1890ff', 
                    marginBottom: '8px',
                    fontWeight: 500
                  }}>新对话</Title>
                  <Text type="secondary" style={{ fontSize: '16px' }}>开启全新的AI对话体验</Text>
                </div>
                <div style={{
                  textAlign: 'center',
                  color: '#8c8c8c',
                  fontSize: '14px',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  开启智能对话新篇章，探索AI的无限可能。无论是日常咨询、学习辅导还是创意讨论，AI助手都将为您提供专业、贴心的服务，让每一次交流都充满价值。
                </div>
              </div>
            </div>
          ) : messages.length === 0 && selectedTool && selectedTool.key === 'ai-search' ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              padding: '40px 20px'
            }}>
              {/* AI搜索工具专用界面 - 参考图示红框样式 */}
              <div style={{
                width: '100%',
                maxWidth: '900px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '2px solid #ff4d4f',
                borderRadius: '12px',
                padding: '60px 40px',
                backgroundColor: '#fff'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <Title level={2} style={{ 
                    color: '#722ed1', 
                    marginBottom: '8px',
                    fontWeight: 500
                  }}>AI搜索</Title>
                  <Text type="secondary" style={{ fontSize: '16px' }}>输入搜索关键词和需求</Text>
                </div>
                <div style={{
                  textAlign: 'center',
                  color: '#8c8c8c',
                  fontSize: '14px',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  智能搜索，精准获取信息。输入您的搜索关键词和具体需求，AI将为您提供准确、全面的搜索结果和深度分析，帮助您快速找到所需信息。
                </div>
              </div>
            </div>
          ) : messages.length === 0 && selectedTool && selectedTool.key === 'image-gen' ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              padding: '40px 20px'
            }}>
              {/* 图像生成工具专用界面 - 参考图示红框样式 */}
              <div style={{
                width: '100%',
                maxWidth: '900px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '2px solid #ff4d4f',
                borderRadius: '12px',
                padding: '60px 40px',
                backgroundColor: '#fff'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <Title level={2} style={{ 
                    color: '#eb2f96', 
                    marginBottom: '8px',
                    fontWeight: 500
                  }}>图像生成</Title>
                  <Text type="secondary" style={{ fontSize: '16px' }}>选择风格模版或描述需求</Text>
                </div>
                
                {/* 风格模版选择区域 */}
                <div style={{ width: '100%', marginBottom: '30px' }}>
                  <Text style={{ fontSize: '16px', fontWeight: 500, marginBottom: '16px', display: 'block' }}>选择风格模版：</Text>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    justifyContent: 'center'
                  }}>
                    {[
                      { key: 'featured', label: '精选', color: '#1890ff' },
                      { key: 'portrait', label: '人像摄影', color: '#f759ab' },
                      { key: 'art', label: '艺术', color: '#fa8c16' },
                      { key: 'chinese-style', label: '国风插画', color: '#52c41a' },
                      { key: 'anime', label: '动漫', color: '#13c2c2' },
                      { key: '3d-render', label: '3D渲染', color: '#722ed1' },
                      { key: 'product', label: '商品', color: '#595959' },
                      { key: 'landscape', label: '风景', color: '#096dd9' }
                    ].map(template => (
                      <Button
                        key={template.key}
                        type="default"
                        style={{
                          borderColor: template.color,
                          color: template.color,
                          borderRadius: '20px',
                          padding: '4px 16px',
                          height: 'auto',
                          fontSize: '14px'
                        }}
                        onClick={() => {
                          const templatePrompts = {
                            'featured': '精选高质量风格，专业级别，细节丰富',
                            'portrait': '人像摄影风格，专业打光，肖像特写',
                            'art': '艺术创作风格，创意表现，艺术感强',
                            'chinese-style': '中国风插画，传统元素，水墨意境',
                            'anime': '日式动漫风格，色彩鲜艳，二次元',
                            '3d-render': '3D渲染风格，立体效果，现代科技',
                            'product': '商品展示风格，清晰背景，产品摄影',
                            'landscape': '风景摄影风格，自然光线，景观大片'
                          };
                          setInputMessage(templatePrompts[template.key]);
                        }}
                      >
                        {template.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div style={{
                  textAlign: 'center',
                  color: '#8c8c8c',
                  fontSize: '14px',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  选择上方风格模版快速开始，或在下方输入框中详细描述您需要的图片内容。AI将为您生成高质量的图像作品。
                </div>
              </div>
            </div>
          ) : messages.length === 0 && selectedTool && selectedTool.key === 'more' ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              padding: '40px 20px'
            }}>
              {/* 更多工具专用界面 - 参考图示红框样式 */}
              <div style={{
                width: '100%',
                maxWidth: '900px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '2px solid #ff4d4f',
                borderRadius: '12px',
                padding: '60px 40px',
                backgroundColor: '#fff'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <Title level={2} style={{ 
                    color: '#fa8c16', 
                    marginBottom: '8px',
                    fontWeight: 500
                  }}>更多工具</Title>
                  <Text type="secondary" style={{ fontSize: '16px' }}>探索更多AI功能</Text>
                </div>
                <div style={{
                  textAlign: 'center',
                  color: '#8c8c8c',
                  fontSize: '14px',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  发现更多AI工具的无限可能。告诉我您的具体需求和使用场景，我将为您推荐最合适的AI工具和解决方案，助您高效完成各种任务。
                </div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '32px',
                marginBottom: '16px'
              }}>
                {React.createElement(selectedTool.icon, { size: 32, color: '#1890ff' })}
              </div>
              <Title level={4}>{selectedTool.label}</Title>
              <Text type="secondary" style={{ marginBottom: '16px' }}>
                {selectedTool.description}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                输入消息开始对话
              </Text>
            </div>
          ) : (
            <div className="messages-container" style={{ height: '100%' }}>
              <div className="messages-list">
                <List
                  dataSource={messages}
                  renderItem={(message, index) => {
                    const isUser = message.type === 'user';
                    return (
                      <List.Item
                        key={message.id || index}
                        style={{
                          border: 'none',
                          padding: '8px 0',
                          justifyContent: isUser ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {isUser ? (
                          <Card
                            size="small"
                            style={{
                              maxWidth: '80%',
                              backgroundColor: '#1890ff',
                              border: 'none',
                              borderRadius: '12px'
                            }}
                            styles={{
                              body: {
                                padding: '12px 16px',
                                color: 'white'
                              }
                            }}
                          >
                            {message.content && (
                              <Text style={{ color: 'white', marginBottom: message.files ? '8px' : '0' }}>
                                {message.content}
                              </Text>
                            )}
                            {message.files && message.files.length > 0 && (
                              <div style={{ marginTop: message.content ? '8px' : '0' }}>
                                {message.files.map((file, fileIndex) => (
                                  <div key={fileIndex} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '6px 8px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '6px',
                                    marginBottom: fileIndex < message.files.length - 1 ? '4px' : '0',
                                    fontSize: '12px'
                                  }}>
                                    {(file.type && file.type.startsWith('image/')) || 
                                     (file.source === 'cloud' && ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'image'].includes(file.type)) ? (
                                      <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Image size={14} style={{ marginRight: '6px', color: 'white' }} />
                                        {file.url && (
                                          <img 
                                            src={file.url} 
                                            alt={file.name}
                                            style={{
                                              width: '40px',
                                              height: '40px',
                                              objectFit: 'cover',
                                              borderRadius: '4px',
                                              marginRight: '8px'
                                            }}
                                          />
                                        )}
                                      </div>
                                    ) : (
                                      <FileText size={14} style={{ marginRight: '6px', color: 'white' }} />
                                    )}
                                    <div style={{ flex: 1, color: 'white' }}>
                                      <div style={{ fontWeight: 500 }}>{file.name}</div>
                                      <div style={{ fontSize: '10px', opacity: 0.8 }}>
                                        {(file.size / 1024 / 1024).toFixed(1)}MB
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </Card>
                        ) : (
                          <div style={{ maxWidth: '90%', width: '100%' }}>
                            {/* AI消息头部 */}
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              marginBottom: '8px',
                              gap: '8px'
                            }}>
                              <Avatar 
                                size={32} 
                                icon={<Bot size={16} />}
                                style={{ 
                                  backgroundColor: '#667eea',
                                  flexShrink: 0
                                }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}>
                                  <Text strong style={{ 
                                    fontSize: '14px',
                                    color: '#1f2937'
                                  }}>
                                    {selectedTool?.label || 'AI助手'}
                                  </Text>
                                  <div style={{
                                     padding: '2px 8px',
                                     backgroundColor: '#f0f9ff',
                                     borderRadius: '12px',
                                     border: '1px solid #e0f2fe'
                                   }}>
                                     <Text style={{ 
                                       fontSize: '11px',
                                       color: '#0369a1',
                                       fontWeight: 500
                                     }}>
                                       {selectedTool?.description || '智能助手回复'}
                                     </Text>
                                   </div>
                                </div>
                                <Text type="secondary" style={{ 
                                  fontSize: '12px',
                                  color: '#6b7280'
                                }}>
                                  创建时间：{message.timestamp ? new Date(message.timestamp).toLocaleString('zh-CN', {
                                    year: 'numeric',
                                    month: '2-digit', 
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : '09:19'}
                                </Text>
                              </div>
                            </div>
                            
                            <Card
                              size="small"
                              style={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                marginBottom: '4px',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
                                width: 'fit-content',
                                maxWidth: '80%'
                              }}
                              styles={{
                                body: {
                                  padding: '8px 12px'
                                }
                              }}
                              ref={(el) => {
                                if (el) {
                                  // 为图片添加点击事件
                                  const images = el.querySelectorAll('img');
                                  console.log('找到图片数量:', images.length);
                                  images.forEach((img, index) => {
                                    console.log(`图片${index + 1}:`, img.src);
                                    img.style.cursor = 'pointer';
                                    img.onclick = (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      console.log('图片被点击:', img.src);
                                      handleImageClick(img.src, img.alt);
                                    };
                                  });
                                }
                              }}
                            >
                              {/* AI回复内容 */}
                              <div style={{ marginBottom: '4px' }}>
                                <div style={{ 
                                  color: '#374151', 
                                  lineHeight: '1.4', 
                                  whiteSpace: 'pre-wrap',
                                  fontSize: '13px'
                                }} dangerouslySetInnerHTML={{ __html: message.content }}>
                                </div>
                              </div>
                              
                              {/* 操作按钮 */}
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                paddingTop: '4px',
                                borderTop: '1px solid #f3f4f6'
                              }}>
                                <Space size={4}>
                                  <Tooltip title="朗读">
                                    <Button 
                                      type="text" 
                                      size="small" 
                                      icon={<Volume2 size={14} />}
                                      style={{
                                        color: '#6b7280',
                                        borderRadius: '8px'
                                      }}
                                    />
                                  </Tooltip>
                                  <Tooltip title="复制">
                                    <Button 
                                      type="text" 
                                      size="small" 
                                      icon={<Copy size={14} />}
                                      onClick={() => {
                                        navigator.clipboard.writeText(message.content);
                                        antdMessage.success('内容已复制到剪贴板');
                                      }}
                                      style={{
                                        color: '#6b7280',
                                        borderRadius: '8px'
                                      }}
                                    />
                                  </Tooltip>
                                  <Tooltip title="重新生成">
                                    <Button 
                                      type="text" 
                                      size="small" 
                                      icon={<RefreshCw size={14} />}
                                      style={{
                                        color: '#6b7280',
                                        borderRadius: '8px'
                                      }}
                                    />
                                  </Tooltip>
                                  <Tooltip title="分享">
                                    <Button 
                                      type="text" 
                                      size="small" 
                                      icon={<Share2 size={14} />}
                                      onClick={() => setShowShareModal(true)}
                                      style={{
                                        color: '#6b7280',
                                        borderRadius: '8px'
                                      }}
                                    />
                                  </Tooltip>
                                  <Tooltip title="更多">
                                    <Button 
                                      type="text" 
                                      size="small" 
                                      icon={<MoreHorizontal size={14} />}
                                      style={{
                                        color: '#6b7280',
                                        borderRadius: '8px'
                                      }}
                                    />
                                  </Tooltip>
                                </Space>
                                <Space size={4}>
                                  <Tooltip title="点赞">
                                    <Button 
                                      type="text" 
                                      size="small" 
                                      icon={<ThumbsUp size={14} />}
                                      style={{
                                        color: '#6b7280',
                                        borderRadius: '8px'
                                      }}
                                    />
                                  </Tooltip>
                                  <Tooltip title="点踩">
                                    <Button 
                                      type="text" 
                                      size="small" 
                                      icon={<ThumbsDown size={14} />}
                                      style={{
                                        color: '#6b7280',
                                        borderRadius: '8px'
                                      }}
                                    />
                                  </Tooltip>
                                </Space>
                              </div>
                            </Card>
                          </div>
                        )}
                      </List.Item>
                    );
                  }}
                />
                {isLoading && (
                  <div className="message-item ai">
                    <Avatar 
                      size={32} 
                      icon={<Bot size={16} />}
                      style={{ backgroundColor: '#52c41a', flexShrink: 0 }}
                    />
                    <div className="message-content">
                      <div className="message-text">
                        正在思考中...
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        

        
        {/* 聊天输入区 */}
        <div style={{ 
          padding: '16px 24px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e8e9ea'
        }}>
          {/* 已上传文件预览区域 */}
          {uploadedFiles.length > 0 && (
            <div style={{
              marginBottom: '12px',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e1e5e9'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginBottom: '8px',
                fontWeight: 500
              }}>
                已上传文件 ({uploadedFiles.length})
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {uploadedFiles.map((file, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '6px',
                    border: '1px solid #d9d9d9',
                    fontSize: '12px',
                    maxWidth: '200px'
                  }}>
                    {(file.type && file.type.startsWith('image/')) || 
                     (file.source === 'cloud' && ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'].includes(file.type)) ? (
                      <Image size={14} style={{ marginRight: '6px', color: '#52c41a' }} />
                    ) : (
                      <FileText size={14} style={{ marginRight: '6px', color: '#1890ff' }} />
                    )}
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}>
                      {file.name}
                    </span>
                    <Button
                      type="text"
                      size="small"
                      icon={<X size={12} />}
                      onClick={() => removeFile(index)}
                      style={{
                        marginLeft: '4px',
                        padding: '0',
                        width: '16px',
                        height: '16px',
                        minWidth: '16px',
                        color: '#999'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="chat-input-container" style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: '24px',
            border: '1px solid #e1e5e9',
            padding: '8px 12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}>

            
            {/* 输入框 */}
            <Input.TextArea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey && selectedTool) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="请帮我写一份产品名称/产品介绍，突出核心功能和竞争优势。"
              autoSize={{ minRows: 1, maxRows: 3 }}
              disabled={!selectedTool}
              style={{ 
                border: 'none',
                padding: '8px 12px',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'none',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                flex: 1
              }}
              className="custom-textarea"
            />
            
            {/* 右侧功能按钮组 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {/* 模版按钮 - 写作和编程工具使用Popover */}
              {(currentTool === 'writing' || currentTool === 'coding') && (
                <Popover
                  content={
                    <div style={{ width: '800px', maxHeight: '600px', overflow: 'auto' }}>
                      <div style={{ marginBottom: '16px' }}>
                        <Text type="secondary" style={{ fontSize: '14px', marginBottom: '16px', display: 'block' }}>
                          {currentTool === 'writing' ? '选择一个模版快速开始写作，或者作为灵感参考' : '选择一个编程模版快速开始开发，或者作为项目参考'}
                        </Text>
                        
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Input.Search
                            placeholder="搜索模版标题或内容..."
                            value={templateSearchText}
                            onChange={(e) => setTemplateSearchText(e.target.value)}
                            style={{ flex: 1, minWidth: '200px', maxWidth: '300px' }}
                            allowClear
                          />
                          
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {templateCategories.map(category => (
                              <Tag.CheckableTag
                                key={category}
                                checked={selectedCategory === category}
                                onChange={() => setSelectedCategory(category)}
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '16px',
                                  fontSize: '13px'
                                }}
                              >
                                {category === 'all' ? '全部' : category}
                              </Tag.CheckableTag>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="template-content">
                        {filteredTemplates.length === 0 ? (
                          <Empty
                            description="没有找到匹配的模版"
                            style={{ margin: '40px 0' }}
                          />
                        ) : (
                          filteredTemplates.map((category, categoryIndex) => (
                          <div key={categoryIndex} style={{ marginBottom: '24px' }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              marginBottom: '12px',
                              paddingBottom: '6px',
                              borderBottom: '1px solid #f0f0f0'
                            }}>
                              <Title level={5} style={{ 
                                margin: 0, 
                                color: '#1890ff',
                                fontSize: '14px',
                                fontWeight: 600
                              }}>
                                {category.category}
                              </Title>
                              <div style={{
                                marginLeft: '8px',
                                padding: '1px 6px',
                                backgroundColor: '#f6ffed',
                                border: '1px solid #b7eb8f',
                                borderRadius: '8px',
                                fontSize: '11px',
                                color: '#52c41a'
                              }}>
                                {category.templates.length} 个模版
                              </div>
                            </div>
                            
                            <Row gutter={[12, 12]}>
                              {category.templates.map((template, templateIndex) => (
                                <Col xs={24} sm={12} md={8} key={templateIndex}>
                                  <Card 
                                    hoverable
                                    onClick={() => {
                                      handleTemplateSelect(template);
                                      setShowTemplates(false);
                                    }}
                                    style={{
                                      height: '120px',
                                      cursor: 'pointer',
                                      borderRadius: '8px',
                                      transition: 'all 0.3s ease',
                                      border: template.type === 'link' ? '1px solid #52c41a' : '1px solid #f0f0f0',
                                      background: template.type === 'link' ? 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)' : '#fff'
                                    }}
                                    styles={{
                                      body: {
                                        padding: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        height: '100%'
                                      }
                                    }}
                                  >
                                    <div>
                                      <Title level={5} style={{ 
                                        margin: 0, 
                                        marginBottom: '6px', 
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: '#262626',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}>
                                        {template.title}
                                        {template.type === 'link' && (
                                          <div style={{
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '50%',
                                            backgroundColor: '#52c41a',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '8px',
                                            color: 'white'
                                          }}>
                                            🔗
                                          </div>
                                        )}
                                      </Title>
                                      <Text type="secondary" style={{ 
                                        fontSize: '12px', 
                                        lineHeight: '1.4',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                      }}>
                                        {template.content.length > 50 ? template.content.substring(0, 50) + '...' : template.content}
                                      </Text>
                                    </div>
                                    {template.type === 'link' && (
                                      <div style={{ 
                                        color: '#52c41a', 
                                        fontSize: '11px',
                                        fontWeight: 500,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        marginTop: '8px'
                                      }}>
                                        <ArrowRight size={10} />
                                        打开演示
                                      </div>
                                    )}
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          </div>
                          ))
                        )}
                      </div>
                    </div>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {currentTool === 'writing' ? <FileText size={16} color="#1890ff" /> : <Code size={16} color="#1890ff" />}
                      <span>{currentTool === 'writing' ? '选择写作模版' : '选择编程模版'}</span>
                    </div>
                  }
                  trigger="click"
                  placement="bottomLeft"
                  open={showTemplates}
                  onOpenChange={setShowTemplates}
                  overlayStyle={{ maxWidth: '850px' }}
                >
                  <Button
                    ref={templateButtonRef}
                    type="text"
                    icon={currentTool === 'writing' ? <FileText size={18} /> : <Code size={18} />}
                    style={{
                      width: '36px',
                      height: '36px',
                      padding: 0,
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%'
                    }}
                    title={
                      currentTool === 'writing' ? "选择写作模板" : 
                      "选择编程模板"
                    }
                  />
                </Popover>
              )}
              {/* 图像生成工具的模版按钮 */}
              {currentTool === 'image-gen' && (
                <Popover
                  content={
                    <div style={{ width: '800px', maxHeight: '600px', overflow: 'auto' }}>
                      <div style={{ marginBottom: '16px' }}>
                        <Text type="secondary" style={{ fontSize: '14px', marginBottom: '16px', display: 'block' }}>
                          选择一个图像风格模版快速开始创作，或者作为创意参考
                        </Text>
                        
                        {/* 分类标签 */}
                        <div style={{ 
                          display: 'flex', 
                          gap: '8px',
                          marginBottom: '16px',
                          flexWrap: 'wrap'
                        }}>
                          {[
                            { key: 'featured', label: '精选' },
                            { key: 'courseware', label: '课件制作' },
                            { key: 'art', label: '教学插图' },
                            { key: 'chinese-style', label: '传统文化' },
                            { key: 'anime', label: '卡通动画' },
                            { key: '3d-render', label: '3D教学' },
                            { key: 'product', label: '实物展示' },
                            { key: 'landscape', label: '自然科学' }
                          ].map((category) => (
                            <Tag.CheckableTag
                              key={category.key}
                              checked={selectedImageCategory === category.key}
                              onChange={() => setSelectedImageCategory(category.key)}
                              style={{
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '13px'
                              }}
                            >
                              {category.label}
                            </Tag.CheckableTag>
                          ))}
                        </div>
                      </div>
                      
                      {/* 图像模版网格 */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '16px',
                        gridAutoRows: 'minmax(120px, auto)'
                      }}>
                        {getImageTemplatesByCategory(selectedImageCategory).map((template, index) => (
                          <Card
                            key={template.id}
                            hoverable
                            onClick={() => {
                              setInputMessage(template.prompt);
                            }}
                            style={{
                              background: template.gradient,
                              border: 'none',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              gridArea: template.gridArea,
                              minHeight: '120px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            styles={{
                              body: {
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                textAlign: 'center'
                              }
                            }}
                          >
                            <Title level={5} style={{
                              color: template.textColor,
                              margin: 0,
                              fontSize: '14px',
                              fontWeight: 600
                            }}>
                              {template.title}
                            </Title>
                          </Card>
                        ))}
                      </div>
                    </div>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Image size={16} color="#1890ff" />
                      <span>选择图像风格模版</span>
                    </div>
                  }
                  trigger="click"
                  placement="bottomLeft"

                  overlayStyle={{ maxWidth: '850px' }}
                >
                  <Button
                    type="text"
                    icon={<Image size={18} />}
                    style={{
                      width: '36px',
                      height: '36px',
                      padding: 0,
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%'
                    }}
                    title="选择图像风格模板"
                  />
                </Popover>
              )}
              {/* 附件按钮 - 仅在新对话工具中显示 */}
              {currentTool === 'new-chat' && (
                <div className="attachment-popover-container" style={{ position: 'relative' }}>
                  <Button
                    type="text"
                    icon={<Paperclip size={18} />}
                    onClick={() => setShowAttachmentPopover(!showAttachmentPopover)}
                    style={{
                      width: '36px',
                      height: '36px',
                      padding: 0,
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%'
                    }}
                    title="添加附件"
                  />
                  {/* 附件弹出浮窗 */}
                  {showAttachmentPopover && (
                    <div style={{
                      position: 'absolute',
                      bottom: '45px',
                      right: '0',
                      width: '280px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                      border: '1px solid #e8e9ea',
                      padding: '16px',
                      zIndex: 1000
                    }}>
                      <div style={{ marginBottom: '12px' }}>
                        <Text style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>从云盘添加</Text>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        {[
                          { icon: '🌐', name: 'triangle-altitude.html', type: 'html' },
                          { icon: '📄', name: '清晰版-中国教育干部网络学院人工智能...', type: 'doc' },
                          { icon: '📊', name: '各分公司销售额_示例数据.xlsx', type: 'excel' },
                          { icon: '📕', name: 'difv介绍.pdf', type: 'pdf' },
                          { icon: '📊', name: '德育骨干-工作案例150.xlsx', type: 'excel' }
                        ].map((file, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 0',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                            <span style={{ fontSize: '16px', marginRight: '8px' }}>{file.icon}</span>
                            <Text style={{ fontSize: '13px', color: '#333', flex: 1 }} ellipsis>{file.name}</Text>
                          </div>
                        ))}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 0',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          transition: 'background-color 0.2s'
                        }}
                        onClick={() => {
                          setShowDocumentCenter(true);
                          setShowAttachmentPopover(false);
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                          <span style={{ fontSize: '16px', marginRight: '8px' }}>⋯</span>
                          <Text style={{ fontSize: '13px', color: '#666' }}>选择云盘文件</Text>
                        </div>
                      </div>
                      <Divider style={{ margin: '12px 0' }} />
                      <div>
                        <Text style={{ fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '8px', display: 'block' }}>从本地添加</Text>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                          onChange={handleFileSelect}
                          style={{ display: 'none' }}
                        />
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 0',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          transition: 'background-color 0.2s'
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                          <Upload size={16} style={{ marginRight: '8px', color: '#666' }} />
                          <Text style={{ fontSize: '13px', color: '#333' }}>上传文件或图片</Text>
                          {isUploading && <Spin size="small" style={{ marginLeft: '8px' }} />}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 0',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                          <Code size={16} style={{ marginRight: '8px', color: '#666' }} />
                          <div>
                            <Text style={{ fontSize: '13px', color: '#333', display: 'block' }}>上传代码</Text>
                            <ArrowRight size={12} style={{ color: '#999', float: 'right', marginTop: '-16px' }} />
                          </div>
                        </div>
                        
                        {/* 已上传文件列表 */}
                        {uploadedFiles.length > 0 && (
                          <>
                            <Divider style={{ margin: '12px 0' }} />
                            <div style={{ marginBottom: '8px' }}>
                              <Text style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>已上传文件</Text>
                            </div>
                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {uploadedFiles.map((file) => (
                                <div key={file.id} style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '8px',
                                  marginBottom: '4px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '6px',
                                  border: '1px solid #e9ecef'
                                }}>
                                  {file.preview ? (
                                    <img 
                                      src={file.preview} 
                                      alt={file.name}
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        marginRight: '8px'
                                      }}
                                    />
                                  ) : (
                                    <span style={{ fontSize: '16px', marginRight: '8px' }}>
                                      {getFileIcon(file.type)}
                                    </span>
                                  )}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <Text style={{ fontSize: '12px', color: '#333' }} ellipsis>
                                      {file.name}
                                    </Text>
                                    <div style={{ fontSize: '11px', color: '#666' }}>
                                      {formatFileSize(file.size)}
                                    </div>
                                  </div>
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<X size={14} />}
                                    onClick={() => removeUploadedFile(file.id)}
                                    style={{
                                      color: '#999',
                                      padding: '2px',
                                      minWidth: 'auto',
                                      height: 'auto'
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Button
                type="text"
                icon={<Phone size={18} />}
                style={{
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%'
                }}
                title="语音通话"
              />
              <Button
                type="text"
                icon={<Mic size={18} />}
                style={{
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%'
                }}
                title="语音输入"
              />
              <Button
                type="primary"
                shape="circle"
                icon={<Send size={16} />}
                onClick={handleSendMessage}
                loading={isLoading}
                disabled={!selectedTool || !inputMessage.trim()}
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: (selectedTool && inputMessage.trim()) ? '#7c3aed' : '#e5e7eb',
                  borderColor: (selectedTool && inputMessage.trim()) ? '#7c3aed' : '#e5e7eb',
                  color: (selectedTool && inputMessage.trim()) ? 'white' : '#9ca3af'
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 右侧编辑器区域 */}
      {showEditor && (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          background: '#fff',
          borderRadius: '8px',
          margin: '16px 16px 16px 16px'
        }}>
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Title level={4} style={{ margin: 0 }}>编辑器</Title>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              size="small" 
              icon={<X size={14} />}
              onClick={() => setShowEditor(false)}
              title="关闭编辑器"
            />
            <Select
              value={editorMode}
              onChange={setEditorMode}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="markdown">Markdown</Option>
              <Option value="html">HTML</Option>
              <Option value="text">纯文本</Option>
            </Select>
            <Button size="small" icon={<Save size={14} />}>保存</Button>
          </div>
        </div>
        <div style={{ flex: 1, padding: '16px' }}>
          <TextArea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="在此输入内容..."
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              resize: 'none',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          />
        </div>
        </div>
      )}
      
      {/* 右侧预览区域 */}
      {showPreview && (
        <div style={{ 
          width: '70%', 
          display: 'flex', 
          flexDirection: 'column',
          background: '#fff',
          borderRadius: '8px',
          margin: '16px 16px 16px 0'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Title level={4} style={{ margin: 0 }}>演示内容 {previewUrl && `(${previewUrl.split('/').pop()})`}</Title>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Tooltip title="下载文件">
                <Button 
                  size="small" 
                  icon={<Download size={14} />}
                  onClick={() => {
                    if (previewUrl) {
                      // 创建下载链接
                      const link = document.createElement('a');
                      link.href = previewUrl;
                      link.download = previewUrl.split('/').pop() || 'demo.html';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      antdMessage.success('文件下载已开始');
                    }
                  }}
                  title="下载文件"
                />
              </Tooltip>
              <Button 
                size="small" 
                icon={<X size={14} />}
                onClick={() => setShowPreview(false)}
                title="关闭预览"
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Tabs
              defaultActiveKey="preview"
              style={{ height: '100%' }}
              onChange={async (activeKey) => {
                // 当切换到代码页签且还没有加载源代码时，自动加载
                if (activeKey === 'code' && !sourceCode && previewUrl && !codeLoading) {
                  setCodeLoading(true);
                  try {
                    // 获取文件名
                    const fileName = previewUrl.split('/').pop();
                    setCodeFileName(fileName);
                    
                    // 获取源代码
                    const response = await fetch(previewUrl);
                    const code = await response.text();
                    setSourceCode(code);
                    antdMessage.success('源代码加载成功');
                  } catch (error) {
                    console.error('获取源代码失败:', error);
                    antdMessage.error('获取源代码失败');
                  } finally {
                    setCodeLoading(false);
                  }
                }
              }}
              items={[
                {
                  key: 'preview',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Play size={14} />
                      预览
                    </span>
                  ),
                  children: (
                    <div style={{ height: 'calc(100vh - 200px)', padding: '8px' }}>
                      {previewUrl ? (
                        <iframe
                          src={previewUrl}
                          style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: '4px'
                          }}
                          title="静态页面预览"
                          onLoad={() => console.log('iframe loaded:', previewUrl)}
                          onError={() => console.log('iframe error:', previewUrl)}
                        />
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: '#999',
                          fontSize: '16px'
                        }}>
                          请点击演示链接查看内容
                        </div>
                      )}
                    </div>
                  )
                },
                {
                  key: 'code',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Code size={14} />
                      代码
                    </span>
                  ),
                  children: (
                    <div style={{ height: 'calc(100vh - 200px)', padding: '16px' }}>
                      <Spin spinning={codeLoading}>
                        {sourceCode ? (
                          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

                            <div style={{ flex: 1, overflow: 'auto' }}>
                              <pre style={{
                                background: '#f6f8fa',
                                border: '1px solid #e1e4e8',
                                borderRadius: '6px',
                                padding: '16px',
                                fontSize: '12px',
                                lineHeight: '1.45',
                                overflow: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all',
                                margin: 0,
                                height: '100%'
                              }}>
                                <code>{sourceCode}</code>
                              </pre>
                            </div>
                          </div>
                        ) : (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: '#999',
                            fontSize: '16px'
                          }}>
                            <Code size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                            <div>正在自动加载源代码...</div>
                          </div>
                        )}
                      </Spin>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>
      )}
      
      {/* 右侧图片预览区域 */}
      {showImagePreview && selectedImage && (
        <div style={{ 
          width: '60%', 
          display: 'flex', 
          flexDirection: 'column',
          background: '#fff',
          borderRadius: '8px',
          margin: '16px 16px 16px 0'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Title level={4} style={{ margin: 0 }}>图片预览</Title>
            <Space>
              <Button 
                size="small" 
                icon={<Download size={14} />}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = selectedImage;
                  link.download = `image_${Date.now()}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  antdMessage.success('图片下载成功');
                }}
                title="下载原图"
              />
              <Button 
                size="small" 
                icon={<X size={14} />}
                onClick={() => {
                  setShowImagePreview(false);
                  setSelectedImage(null);
                }}
                title="关闭预览"
              />
            </Space>
          </div>
          <div style={{ 
            flex: 1, 
            padding: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto'
          }}>
            <img 
              src={selectedImage} 
              alt="预览图片"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        </div>
      )}

      {/* 文档中心选择弹窗 */}
      <Modal
        title="从文档中心选择文件"
        open={showDocumentCenter}
        onCancel={() => setShowDocumentCenter(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setShowDocumentCenter(false)}>
            取消
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={() => {
              // 将选中的云盘文件添加到上传文件列表
              const newFiles = selectedCloudFiles.map(file => ({
                ...file,
                id: Date.now() + Math.random(),
                source: 'cloud'
              }));
              setUploadedFiles(prev => [...prev, ...newFiles]);
              setSelectedCloudFiles([]);
              setShowDocumentCenter(false);
              antdMessage.success(`已添加 ${newFiles.length} 个文件`);
            }}
            disabled={selectedCloudFiles.length === 0}
          >
            确定添加 ({selectedCloudFiles.length})
          </Button>
        ]}
      >
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {/* 文档分类标签 */}
          <div style={{ marginBottom: '16px' }}>
            <Space wrap>
              {['全部', '教学文档', '课件资料', '图片素材', '视频资源', '表格数据'].map(category => (
                <Tag 
                  key={category}
                  color={category === '全部' ? 'blue' : 'default'}
                  style={{ cursor: 'pointer' }}
                >
                  {category}
                </Tag>
              ))}
            </Space>
          </div>
          
          {/* 文档列表 */}
          <List
            dataSource={[
              { id: 1, name: 'triangle-altitude.html', type: 'html', size: '2.3KB', icon: '🌐', updateTime: '2024-01-15' },
              { id: 2, name: '清晰版-中国教育干部网络学院人工智能课程.pdf', type: 'pdf', size: '15.2MB', icon: '📕', updateTime: '2024-01-14' },
              { id: 3, name: '各分公司销售额_示例数据.xlsx', type: 'excel', size: '856KB', icon: '📊', updateTime: '2024-01-13' },
              { id: 4, name: 'difv介绍.pdf', type: 'pdf', size: '3.7MB', icon: '📕', updateTime: '2024-01-12' },
              { id: 5, name: '德育骨干-工作案例150.xlsx', type: 'excel', size: '1.2MB', icon: '📊', updateTime: '2024-01-11' },
              { id: 6, name: '数学教学课件-函数图像.pptx', type: 'ppt', size: '8.9MB', icon: '📊', updateTime: '2024-01-10' },
              { id: 7, name: '语文阅读理解训练.docx', type: 'doc', size: '456KB', icon: '📄', updateTime: '2024-01-09' },
              { id: 8, name: '物理实验视频-光的折射.mp4', type: 'video', size: '125MB', icon: '🎬', updateTime: '2024-01-08' },
              { id: 9, name: '化学元素周期表.png', type: 'image', size: '2.1MB', icon: '🖼️', updateTime: '2024-01-07' },
              { id: 10, name: '历史时间轴模板.xlsx', type: 'excel', size: '678KB', icon: '📊', updateTime: '2024-01-06' }
            ]}
            renderItem={(file) => (
              <List.Item
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: selectedCloudFiles.find(f => f.id === file.id) ? '#e6f7ff' : 'transparent',
                  borderRadius: '8px',
                  margin: '4px 0',
                  border: selectedCloudFiles.find(f => f.id === file.id) ? '1px solid #1890ff' : '1px solid transparent'
                }}
                onClick={() => {
                  const isSelected = selectedCloudFiles.find(f => f.id === file.id);
                  if (isSelected) {
                    setSelectedCloudFiles(prev => prev.filter(f => f.id !== file.id));
                  } else {
                    setSelectedCloudFiles(prev => [...prev, file]);
                  }
                }}
              >
                <List.Item.Meta
                  avatar={<span style={{ fontSize: '20px' }}>{file.icon}</span>}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text strong style={{ fontSize: '14px' }}>{file.name}</Text>
                      {selectedCloudFiles.find(f => f.id === file.id) && (
                        <Check size={16} color="#1890ff" />
                      )}
                    </div>
                  }
                  description={
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                      <span>{file.size}</span>
                      <span>{file.updateTime}</span>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>

    </div>
  );
};

export default UnifiedAICenter;