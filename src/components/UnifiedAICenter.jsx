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
  Spin
} from 'antd';
import './UnifiedAICenter.css';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const UnifiedAICenter = () => {
  // 基础状态
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [deepThinking, setDeepThinking] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  
  // 界面状态
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showImageTemplates, setShowImageTemplates] = useState(false);
  const [templateSearchText, setTemplateSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedImageCategory, setSelectedImageCategory] = useState('featured');
  
  // 编辑器状态
  const [editorContent, setEditorContent] = useState('');
  const [editorMode, setEditorMode] = useState('markdown');
  const [splitScreenMode, setSplitScreenMode] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [richTextEditor, setRichTextEditor] = useState(null);
  
  // 消息滚动引用
  const messagesEndRef = useRef(null);
  
  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
  const [selectedTool, setSelectedTool] = useState(null);
  
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
    if (!inputMessage.trim() || isLoading || !selectedTool) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      tool: currentTool
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // 根据选择的工具生成不同的AI回复
    setTimeout(() => {
      let aiResponse = '';
      
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
        default:
          aiResponse = `感谢您使用${selectedTool.label}！关于"${userMessage.content}"，我正在为您处理。请稍等片刻，我会为您提供详细的回复。`;
      }
      
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
      <div key={msg.id} className={`message-item ${isUser ? 'user' : 'ai'}`}>
        <Avatar 
          size={32} 
          icon={isUser ? <User size={16} /> : <Bot size={16} />}
          style={{ 
            backgroundColor: isUser ? '#1890ff' : '#52c41a',
            flexShrink: 0
          }}
        />
        <div className="message-content">
          <div className="message-text">
            {msg.content}
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
        width: showEditor ? '600px' : '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRight: showEditor ? '1px solid #f0f0f0' : 'none',
        background: '#fff',
        borderRadius: '8px',
        margin: '16px 0',
        marginRight: showEditor ? '0' : '16px'
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
                            <Text style={{ color: 'white' }}>{message.content}</Text>
                          </Card>
                        ) : (
                          <div style={{ maxWidth: '90%', width: '100%' }}>
                            <Card
                              size="small"
                              style={{
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                marginBottom: '8px'
                              }}
                              styles={{
                                body: {
                                  padding: '16px'
                                }
                              }}
                            >
                              {/* AI回复内容 */}
                              <div style={{ marginBottom: '16px' }}>
                                <Text style={{ color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                  {message.content}
                                </Text>
                              </div>
                              

                              
                              {/* 操作按钮 */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Space size={8}>
                                  <Tooltip title="朗读">
                                    <Button type="text" size="small" icon={<Volume2 size={14} />} />
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
                                    />
                                  </Tooltip>
                                  <Tooltip title="重新生成">
                                    <Button type="text" size="small" icon={<RefreshCw size={14} />} />
                                  </Tooltip>
                                  <Tooltip title="编辑">
                                    <Button 
                                      type="text" 
                                      size="small" 
                                      icon={<Edit3 size={14} />}
                                      onClick={() => {
                                        setEditorContent(message.content);
                                        setShowEditor(true);
                                        antdMessage.success('内容已加载到编辑器');
                                      }}
                                    />
                                  </Tooltip>
                                  <Tooltip title="分享">
                                    <Button 
                                      type="text" 
                                      size="small" 
                                      icon={<Share2 size={14} />}
                                      onClick={() => setShowShareModal(true)}
                                    />
                                  </Tooltip>
                                </Space>
                                <Space size={8}>
                                  <Tooltip title="点赞">
                                    <Button type="text" size="small" icon={<ThumbsUp size={14} />} />
                                  </Tooltip>
                                  <Tooltip title="点踩">
                                    <Button type="text" size="small" icon={<ThumbsDown size={14} />} />
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
              {/* 模版按钮 - 写作、编程和图像生成工具显示 */}
              {(currentTool === 'writing' || currentTool === 'coding' || currentTool === 'image-gen') && (
                <Button
                  type="text"
                  icon={
                    currentTool === 'writing' ? <FileText size={18} /> : 
                    currentTool === 'coding' ? <Code size={18} /> : 
                    <Image size={18} />
                  }
                  onClick={() => {
                    if (currentTool === 'image-gen') {
                      setShowImageTemplates(true);
                    } else {
                      setShowTemplates(true);
                    }
                  }}
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
                    currentTool === 'coding' ? "选择编程模板" : 
                    "选择图像风格模板"
                  }
                />
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
      
      {/* 模版选择弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentTool === 'writing' ? <FileText size={20} color="#1890ff" /> : <Code size={20} color="#1890ff" />}
            <span>{currentTool === 'writing' ? '选择写作模版' : '选择编程模版'}</span>
          </div>
        }
        open={showTemplates}
        onCancel={() => setShowTemplates(false)}
        footer={null}
        width={1200}
        className="template-modal"
        styles={{
          body: { padding: '24px' }
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Text type="secondary" style={{ fontSize: '14px', marginBottom: '16px', display: 'block' }}>
            {currentTool === 'writing' ? '选择一个模版快速开始写作，或者作为灵感参考' : '选择一个编程模版快速开始开发，或者作为项目参考'}
          </Text>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Input.Search
              placeholder="搜索模版标题或内容..."
              value={templateSearchText}
              onChange={(e) => setTemplateSearchText(e.target.value)}
              style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}
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
            <div key={categoryIndex} style={{ marginBottom: '32px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <Title level={4} style={{ 
                  margin: 0, 
                  color: '#1890ff',
                  fontSize: '16px',
                  fontWeight: 600
                }}>
                  {category.category}
                </Title>
                <div style={{
                  marginLeft: '12px',
                  padding: '2px 8px',
                  backgroundColor: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#52c41a'
                }}>
                  {category.templates.length} 个模版
                </div>
              </div>
              
              <Row gutter={[16, 16]}>
                {category.templates.map((template, templateIndex) => (
                  <Col xs={24} sm={12} md={8} key={templateIndex}>
                    <Card 
                      hoverable
                      onClick={() => handleTemplateSelect(template)}
                      style={{
                        height: '140px',
                        cursor: 'pointer',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        border: '1px solid #f0f0f0'
                      }}
                      styles={{
                        body: {
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%'
                        }
                      }}
                      actions={[
                        <div key="use" style={{ 
                          color: '#1890ff', 
                          fontSize: '12px',
                          fontWeight: 500
                        }}>
                          点击使用
                        </div>
                      ]}
                    >
                      <div>
                        <Title level={5} style={{ 
                          margin: 0, 
                          marginBottom: '8px', 
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#262626'
                        }}>
                          {template.title}
                        </Title>
                        <Text type="secondary" style={{ 
                          fontSize: '13px', 
                          lineHeight: '1.5',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {template.content.length > 60 ? template.content.substring(0, 60) + '...' : template.content}
                        </Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
            ))
          )}
        </div>
      </Modal>

      {/* 图像模版选择弹窗 */}
      <Modal
        title={null}
        open={showImageTemplates}
        onCancel={() => setShowImageTemplates(false)}
        footer={null}
        width={900}
        className="template-modal"
        styles={{
          body: { padding: '0' }
        }}
      >
        <div style={{ 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px 8px 0 0',
          padding: '20px 24px 16px'
        }}>
          {/* 分类标签 */}
          <div style={{ 
            display: 'flex', 
            gap: '8px',
            marginBottom: '0'
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
              <Button
                key={category.key}
                type={selectedImageCategory === category.key ? "primary" : "default"}
                size="small"
                onClick={() => setSelectedImageCategory(category.key)}
                style={{
                  borderRadius: '16px',
                  fontSize: '13px',
                  height: '32px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  backgroundColor: selectedImageCategory === category.key ? '#1a1a1a' : '#ffffff',
                  borderColor: selectedImageCategory === category.key ? '#1a1a1a' : '#d9d9d9',
                  color: selectedImageCategory === category.key ? '#ffffff' : '#666666'
                }}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* 图片网格区域 */}
        <div style={{ 
          padding: '24px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            height: '400px'
          }}>
            {getImageTemplatesByCategory(selectedImageCategory).map((template) => (
              <div
                key={template.id}
                style={{
                  gridArea: template.gridArea,
                  backgroundImage: template.gradient,
                  borderRadius: '12px',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease',
                }}
                onClick={() => {
                  setInputMessage(template.prompt);
                  setShowImageTemplates(false);
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  right: '8px',
                  color: template.textColor,
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  {template.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnifiedAICenter;