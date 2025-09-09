import React, { useState } from 'react'
import { 
  Card, 
  Input, 
  Button, 
  Tag as AntTag, 
  Layout, 
  Menu, 
  Space, 
  Typography, 
  Tooltip, 
  Modal, 
  Divider,
  Empty,
  Row,
  Col,
  Avatar,
  Select,
  message,
  Tabs,
  Tree,
  Checkbox
} from 'antd'
import { 
  FileTextOutlined, 
  SearchOutlined, 
  BookOutlined, 
  StarOutlined, 
  ClockCircleOutlined, 
  TagOutlined, 
  EyeOutlined, 
  DownloadOutlined, 
  ShareAltOutlined, 
  BookOutlined as BookmarkOutlined, 
  PlusOutlined, 
  EditOutlined, 
  AppstoreOutlined,
  BarsOutlined,
  SettingOutlined,
  LinkOutlined,
  UserAddOutlined,
  CopyOutlined,
  WechatOutlined,
  QrcodeOutlined,
  MailOutlined,
  RightOutlined,
  FilePptOutlined,
  HighlightOutlined,
  TableOutlined,
  BulbOutlined,
  FormOutlined,
  PieChartOutlined,
  FileMarkdownOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import DocumentEditor from './DocumentEditor'
import './DocsCenter.css'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

const DocsCenter = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [showEditor, setShowEditor] = useState(false)
  const [editingDocument, setEditingDocument] = useState(null)
  const [isNewDocument, setIsNewDocument] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [sharingDocument, setSharingDocument] = useState(null)
  const [sharePermission, setSharePermission] = useState('read')
  const [inviteEmail, setInviteEmail] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedKeys, setExpandedKeys] = useState(['document', 'ppt', 'whiteboard'])
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: '志超', avatar: null, permission: 'edit' }
  ])
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [recentlyAccessed, setRecentlyAccessed] = useState(() => {
    // 从本地存储加载最近访问记录
    const saved = localStorage.getItem('recentlyAccessedDocs')
    if (saved) {
      return JSON.parse(saved)
    } else {
      // 初始化一些示例访问记录
      const initialAccess = [
        {
          id: 1,
          title: '小学数学《分数的认识》教学设计',
          accessTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
          type: 'document',
          category: 'document'
        },
        {
          id: 3,
          title: '初中英语《现在进行时》语法练习',
          accessTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2小时前
          type: 'document',
          category: 'document'
        },
        {
          id: 5,
          title: '高中物理《牛顿运动定律》实验报告',
          accessTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1天前
          type: 'document',
          category: 'document'
        }
      ]
      localStorage.setItem('recentlyAccessedDocs', JSON.stringify(initialAccess))
      return initialAccess
    }
  })
  const [permissionSettings, setPermissionSettings] = useState({
    allowExternalShare: true,
    allowManagePermissions: false,
    allowViewCollaborators: 'all',
    allowAddCollaborators: 'all',
    allowRemoveCollaborators: 'all',
    allowCopyContent: 'all',
    allowPrintDownload: 'all',
    allowComment: 'all',
    showVisitorAvatars: 'all',
    allowRequestAccess: false
  })
  
  // 文档类型定义
  const documentTypes = [
    {
      key: 'multidimensional',
      title: '多维表格',
      description: '支持多种数据类型的智能表格',
      icon: <TableOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      color: '#722ed1'
    },
    {
      key: 'document',
      title: '文档',
      description: '富文本编辑器，支持协作编辑',
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      key: 'table',
      title: '表格',
      description: '在线电子表格，支持公式计算',
      icon: <TableOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      key: 'presentation',
      title: '幻灯片',
      description: '演示文稿制作工具',
      icon: <FilePptOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />,
      color: '#fa8c16'
    },
    {
      key: 'survey',
      title: '问卷',
      description: '在线问卷调查工具',
      icon: <FormOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />,
      color: '#eb2f96'
    },
    {
      key: 'mindmap',
      title: '思维笔记',
      description: '思维导图和笔记工具',
      icon: <BulbOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />,
      color: '#13c2c2'
    },
    {
      key: 'more',
      title: '更多类型',
      description: '查看更多文档类型',
      icon: <RightOutlined style={{ fontSize: '16px', color: '#666' }} />,
      color: '#666',
      isMore: true
    },
    {
      key: 'folder',
      title: '文件夹',
      description: '创建文件夹来组织文档',
      icon: <FileMarkdownOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      color: '#faad14'
    }
  ]
  
  // 用户数据
  const [allUsers] = useState([
    { id: 1, name: '张志超', department: '大数据', avatar: '志超', status: 'online', permission: 'invited' },
    { id: 2, name: '张全奇', department: '技术部', avatar: null, status: 'offline', permission: null },
    { id: 3, name: '张鑫龙', department: '外包工作组', avatar: '鑫龙', status: 'online', permission: null },
    { id: 4, name: '张振兴', department: '外包工作组', avatar: '振兴', status: 'online', permission: null }
  ])
  
  // 部门分组数据
  const [departments] = useState([
    { id: 'dev', name: '研发管理组', count: 3, users: [1, 2, 3] },
    { id: 'ai', name: 'AI杂谈', count: 3, users: [1, 4] }
  ])
  
  const categories = [
    { id: 'all', name: '全部文档', count: 26 },
    { 
      id: 'teaching-preparation', 
      name: '教学准备', 
      count: 12,
      children: [
        { id: 'document-design', name: '教学设计', count: 10 },
        { id: 'whiteboard-planning', name: '教学规划', count: 1 },
        { id: 'document-teaching-other', name: '其他资料', count: 2 }
      ]
    },
    { 
      id: 'teaching-implementation', 
      name: '教学实施', 
      count: 6,
      children: [
        { id: 'ppt-courseware', name: '教学课件', count: 5 },
        { id: 'whiteboard-collaboration', name: '课堂互动', count: 1 }
      ]
    },
    { 
      id: 'teaching-evaluation', 
      name: '教学评估', 
      count: 4,
      children: [
        { id: 'document-research', name: '教学研究', count: 4 }
      ]
    },
    { 
      id: 'teaching-management', 
      name: '教学管理', 
      count: 4,
      children: [
        { id: 'document-admin', name: '行政文档', count: 2 },
        { id: 'whiteboard-brainstorm', name: '教研讨论', count: 1 },
        { id: 'ppt-presentation', name: '汇报展示', count: 0 }
      ]
    }
  ]

  const initialDocuments = [
    {
      id: 1,
      title: '小学数学分数教学课件',
      description: '针对小学三年级学生设计的分数概念教学课件，包含丰富的动画演示和互动练习。',
      content: '<h1>小学数学分数概念课件</h1><h2>教学目标</h2><p>1. 理解分数的基本概念</p><p>2. 掌握分数的表示方法</p><p>3. 能够识别和比较简单分数</p><h2>教学内容</h2><p>分数是表示整体的一部分的数。当我们把一个整体平均分成若干份时，其中的一份或几份可以用分数来表示。</p><h3>分数的组成</h3><p>分数由分子和分母组成：</p><ul><li>分母：表示把整体平均分成多少份</li><li>分子：表示取了其中的多少份</li></ul><p>例如：1/2 表示把整体平均分成2份，取其中的1份。</p>',
      category: 'ppt',
      subCategory: 'ppt-courseware',
      tags: ['数学', '三年级', '分数'],
      author: '张老师',
      lastModified: '2024-01-15',
      views: 1250,
      rating: 4.8,
      type: 'ppt',
      size: '2.3 MB',
      isBookmarked: true,
      isShared: true,
      collaborators: [{ id: 1, name: '李老师', permission: 'edit' }]
    },
    {
      id: 2,
      title: '初中语文古诗词鉴赏课件',
      description: '涵盖唐宋经典诗词的鉴赏方法，配有朗诵音频和背景介绍，适合初中语文教学。',
      content: '<h1>初中语文古诗词鉴赏课件</h1><h2>古诗词鉴赏方法</h2><p>古诗词鉴赏是语文学习的重要组成部分，需要掌握以下方法：</p><h3>1. 理解诗词内容</h3><p>首先要理解诗词的字面意思，包括：</p><ul><li>词语含义</li><li>句子结构</li><li>整体内容</li></ul><h3>2. 分析表现手法</h3><p>常见的表现手法包括：</p><ul><li>比喻、拟人、夸张等修辞手法</li><li>对比、衬托等表现手法</li><li>借景抒情、托物言志等抒情方式</li></ul><h3>3. 体会思想感情</h3><p>通过分析诗词的内容和手法，体会作者要表达的思想感情。</p>',
      category: 'ppt',
      subCategory: 'ppt-courseware',
      tags: ['语文', '初中', '古诗词'],
      author: '李老师',
      lastModified: '2024-01-14',
      views: 2100,
      rating: 4.9,
      type: 'ppt',
      size: '5.7 MB',
      isBookmarked: false,
      isShared: false
    },
    {
      id: 3,
      title: '高中物理力学实验课件',
      description: '包含牛顿定律、动量守恒等核心概念的实验演示课件，配有3D动画和实验视频。',
      content: `<h1>高中物理力学实验课件</h1><h2>实验目标</h2><p>1. 验证牛顿第二定律</p><p>2. 理解力与加速度的关系</p><p>3. 掌握动量守恒定律的应用</p><h2>实验原理</h2><p>牛顿第二定律：F = ma</p><p>其中F为合外力，m为物体质量，a为加速度。</p><h3>实验步骤</h3><ol><li>准备实验器材：小车、砝码、打点计时器等</li><li>测量小车的质量</li><li>在小车上放置不同质量的砝码</li><li>记录小车在不同力作用下的加速度</li><li>分析数据，验证F=ma关系</li></ol><h2>注意事项</h2><p>1. 确保轨道水平</p><p>2. 减小摩擦力的影响</p><p>3. 多次测量取平均值</p>`,
      category: 'ppt',
      subCategory: 'ppt-courseware',
      tags: ['物理', '高中', '力学'],
      author: '王老师',
      isShared: true,
      collaborators: [{ id: 2, name: '张老师', permission: 'view' }, { id: 3, name: '陈老师', permission: 'edit' }],
      lastModified: '2024-01-13',
      views: 1850,
      rating: 4.7,
      type: 'ppt',
      size: '8.2 MB',
      isBookmarked: true
    },
    {
      id: 4,
      title: '小学英语单词记忆课件',
      description: '采用图像联想法和游戏化设计，帮助小学生快速记忆常用英语单词。',
      content: `<h1>小学英语单词记忆课件</h1><h2>教学目标</h2><p>1. 掌握50个常用英语单词</p><p>2. 学会使用图像联想法记忆单词</p><p>3. 提高英语学习兴趣</p><h2>记忆方法</h2><h3>1. 图像联想法</h3><p>将单词与具体的图像联系起来，帮助记忆。</p><p>例如：Apple（苹果）- 想象一个红色的苹果</p><h3>2. 分类记忆法</h3><p>将单词按类别分组记忆：</p><ul><li>动物类：cat, dog, bird, fish</li><li>颜色类：red, blue, green, yellow</li><li>数字类：one, two, three, four</li></ul><h3>3. 游戏记忆法</h3><p>通过有趣的游戏来记忆单词：</p><ul><li>单词接龙</li><li>看图猜词</li><li>单词拼写比赛</li></ul>`,
      category: 'ppt',
      subCategory: 'ppt-courseware',
      tags: ['英语', '小学', '单词'],
      author: '刘老师',
      lastModified: '2024-01-12',
      views: 3200,
      rating: 4.6,
      type: 'ppt',
      size: '4.1 MB',
      isBookmarked: false,
      isShared: true,
      collaborators: [{ id: 4, name: '王老师', permission: 'view' }]
    },
    {
      id: 5,
      title: '初中数学几何课件',
      description: '详细介绍几何图形的性质和计算方法，包含动态图形演示。',
      content: `<h1>初中数学几何课件</h1><h2>几何基础知识</h2><p>几何学是研究空间图形的性质、大小和位置关系的数学分支。</p><h3>基本几何图形</h3><h4>1. 点、线、面</h4><ul><li>点：没有大小，只有位置</li><li>线：由无数个点组成，有长度没有宽度</li><li>面：由线围成，有长度和宽度</li></ul><h4>2. 角</h4><p>角是由两条射线组成的图形，这两条射线有一个公共端点。</p><ul><li>锐角：小于90°的角</li><li>直角：等于90°的角</li><li>钝角：大于90°小于180°的角</li></ul><h4>3. 三角形</h4><p>三角形的性质：</p><ul><li>内角和等于180°</li><li>任意两边之和大于第三边</li><li>外角等于不相邻两内角之和</li></ul>`,
      category: 'ppt',
      subCategory: 'ppt-courseware',
      tags: ['数学', '初中', '几何'],
      author: '陈老师',
      lastModified: '2024-01-11',
      views: 1680,
      rating: 4.8,
      type: 'ppt',
      size: '6.5 MB',
      isBookmarked: true,
      isShared: false
    },
    {
      id: 6,
      title: '小学数学应用题教学设计',
      description: '基于生活情境的数学应用题教学方案，培养学生的数学思维和解决问题的能力。',
      content: '<h1>小学数学应用题教学设计</h1><h2>教学目标</h2><p>1. 培养学生分析和解决实际问题的能力</p><p>2. 提高学生的数学思维和逻辑推理能力</p><p>3. 让学生体会数学与生活的密切联系</p><h2>教学重点</h2><p>1. 理解题意，找出已知条件和所求问题</p><p>2. 分析数量关系，选择合适的解题方法</p><p>3. 列式计算，检验答案的合理性</p><h2>教学过程</h2><h3>一、情境导入</h3><p>通过生活中的实际问题引入，如购物、旅行等情境。</p><h3>二、探究新知</h3><p>引导学生分析问题的结构，找出解题的关键信息。</p><h3>三、巩固练习</h3><p>设计不同类型的应用题，让学生练习解题方法。</p>',
      category: 'document',
      subCategory: 'document-teaching-other',
      tags: ['数学', '小学', '应用题'],
      author: '赵老师',
      lastModified: '2024-01-10',
      views: 980,
      rating: 4.5,
      type: 'document',
      size: '1.2 MB',
      isBookmarked: false,
      isShared: false
    },
    {
      id: 7,
      title: '初中历史项目式学习设计',
      description: '以"丝绸之路"为主题的跨学科项目式学习教学设计，融合历史、地理、文化等多个维度。',
      category: 'whiteboard',
      subCategory: 'whiteboard-collaboration',
      tags: ['历史', '初中', '项目学习'],
      author: '孙老师',
      lastModified: '2024-01-09',
      views: 1420,
      rating: 4.9,
      type: 'whiteboard',
      size: '2.8 MB',
      isBookmarked: true,
      isShared: false
    },
    {
      id: 8,
      title: '高中生物实验教学设计',
      description: '细胞分裂观察实验的完整教学设计，包含实验准备、操作步骤和结果分析。',
      category: 'document',
      subCategory: 'document-research',
      tags: ['生物', '高中', '实验'],
      author: '周老师',
      lastModified: '2024-01-08',
      views: 1150,
      rating: 4.7,
      type: 'document',
      size: '3.4 MB',
      isBookmarked: false,
      isShared: true,
      collaborators: [{ id: 5, name: '赵老师', permission: 'edit' }]
    },
    {
      id: 9,
      title: '小学语文阅读理解教学设计',
      description: '基于整本书阅读的语文教学设计，提升学生的阅读理解和表达能力。',
      category: 'document',
      subCategory: 'document-teaching-other',
      tags: ['语文', '小学', '阅读'],
      author: '吴老师',
      lastModified: '2024-01-07',
      views: 2050,
      rating: 4.6,
      type: 'document',
      size: '1.9 MB',
      isBookmarked: true,
      isShared: false
    },
    {
      id: 10,
      title: '初中地理地图技能教学设计',
      description: '培养学生地图阅读和分析能力的教学设计，包含多种地图类型的教学策略。',
      category: 'whiteboard',
      subCategory: 'whiteboard-planning',
      tags: ['地理', '初中', '地图'],
      author: '郑老师',
      lastModified: '2024-01-06',
      views: 890,
      rating: 4.4,
      type: 'whiteboard',
      size: '2.1 MB',
      isBookmarked: false,
      isShared: false
    },
    {
      id: 11,
      title: '团队头脑风暴白板',
      description: '用于团队创意讨论和思维导图的协作白板，支持实时多人编辑和想法整理。',
      content: '<h1>团队头脑风暴白板</h1><h2>使用说明</h2><p>这是一个专为团队协作设计的数字白板，支持多种创意工具和实时协作功能。</p><h3>主要功能</h3><ul><li>便签贴纸：快速记录想法</li><li>思维导图：结构化整理思路</li><li>流程图：梳理工作流程</li><li>投票功能：民主决策</li></ul><h3>使用场景</h3><p>适用于：</p><ol><li>产品策划会议</li><li>教学研讨活动</li><li>项目启动讨论</li><li>问题解决分析</li></ol>',
      category: 'whiteboard',
      subCategory: 'whiteboard-brainstorm',
      tags: ['协作', '头脑风暴', '创意'],
      author: '李老师',
      lastModified: '2024-01-05',
      views: 1200,
      rating: 4.7,
      type: 'whiteboard',
      size: '1.5 MB',
      isBookmarked: true,
      isShared: true,
      collaborators: [{ id: 6, name: '张老师', permission: 'edit' }, { id: 7, name: '王老师', permission: 'view' }]
    },
    {
      id: 12,
      title: '学生成绩统计表',
      description: '包含各科成绩、排名分析的多维数据表格，支持动态筛选和图表展示。',
      category: 'document',
      subCategory: 'document-admin',
      tags: ['成绩', '统计', '数据分析'],
      author: '教务处',
      lastModified: '2024-01-20',
      views: 850,
      rating: 4.6,
      type: 'multitable',
      size: '3.2 MB',
      isBookmarked: false,
      isShared: true,
      collaborators: [{ id: 8, name: '数学组', permission: 'edit' }]
    },
    {
      id: 13,
      title: '课程安排表',
      description: '本学期各年级课程时间安排表，包含教师、教室、时间等信息。',
      category: 'document',
      subCategory: 'document-admin',
      tags: ['课程', '安排', '时间表'],
      author: '教务处',
      lastModified: '2024-01-19',
      views: 1200,
      rating: 4.5,
      type: 'table',
      size: '1.8 MB',
      isBookmarked: true,
      isShared: false
    },
    {
      id: 14,
      title: '学生学习满意度调查',
      description: '针对本学期教学质量和学习体验的问卷调查，包含多维度评价指标。',
      category: 'document',
      subCategory: 'document-research',
      tags: ['调查', '满意度', '教学质量'],
      author: '质量监控中心',
      lastModified: '2024-01-18',
      views: 650,
      rating: 4.3,
      type: 'survey',
      size: '0.8 MB',
      isBookmarked: false,
      isShared: true,
      collaborators: [{ id: 9, name: '质量监控', permission: 'view' }]
    },
    {
      id: 15,
      title: '教学方法创新思维导图',
      description: '整理各种创新教学方法的思维笔记，包含理论基础和实践案例。',
      category: 'document',
      subCategory: 'document-research',
      tags: ['教学方法', '创新', '思维导图'],
      author: '教研组',
      lastModified: '2024-01-17',
      views: 980,
      rating: 4.8,
      type: 'mindnote',
      size: '2.1 MB',
      isBookmarked: true,
      isShared: false
    },
    {
      id: 16,
      title: 'API接口文档',
      description: '系统后端API接口的详细说明文档，包含请求参数、响应格式等技术规范。',
      category: 'document',
      subCategory: 'document-research',
      tags: ['API', '接口', '技术文档'],
      author: '技术部',
      lastModified: '2024-01-16',
      views: 420,
      rating: 4.7,
      type: 'markdown',
      size: '1.3 MB',
      isBookmarked: false,
      isShared: true,
      collaborators: [{ id: 10, name: '开发团队', permission: 'edit' }]
    },
    {
      id: 17,
      title: '小学数学《分数的认识》教学设计',
      description: '三年级数学分数概念教学设计，包含教学目标、重难点分析、教学过程和板书设计。',
      content: '<h1>小学数学《分数的认识》教学设计</h1><h2>教学目标</h2><p>1. 知识与技能：理解分数的意义，认识分数各部分的名称</p><p>2. 过程与方法：通过动手操作、观察比较，建立分数概念</p><p>3. 情感态度：培养学生的数学思维和合作意识</p><h2>教学重点</h2><p>理解分数的意义，认识分数的各部分名称</p><h2>教学难点</h2><p>理解分数表示的是部分与整体的关系</p><h2>教学过程</h2><h3>一、情境导入</h3><p>通过分蛋糕的生活情境，引出分数概念</p><h3>二、探究新知</h3><p>1. 动手操作：用纸片折分数</p><p>2. 观察发现：分数的组成</p><p>3. 概念建构：分数的意义</p>',
      category: 'document',
      subCategory: 'document-design',
      tags: ['数学', '小学', '分数', '教学设计'],
      author: '李明老师',
      lastModified: '2024-01-25',
      views: 1250,
      rating: 4.8,
      type: 'document',
      size: '2.1 MB',
      isBookmarked: true
    },
    {
      id: 18,
      title: '初中语文《春》教学设计',
      description: '朱自清散文《春》的教学设计，注重朗读指导和写作手法分析。',
      content: '<h1>初中语文《春》教学设计</h1><h2>教学目标</h2><p>1. 能够有感情地朗读课文，感受春天的美好</p><p>2. 学习作者观察景物、抓住特点的写作方法</p><p>3. 体会作者对春天的热爱之情</p><h2>教学重点</h2><p>理解课文内容，学习写景的方法</p><h2>教学难点</h2><p>体会作者的思想感情，学习语言表达技巧</p><h2>教学过程</h2><h3>一、导入新课</h3><p>播放春天的图片，营造氛围</p><h3>二、初读课文</h3><p>1. 自由朗读，解决生字词</p><p>2. 整体感知课文内容</p><h3>三、精读课文</h3><p>分析春草图、春花图、春风图等</p>',
      category: 'document',
      subCategory: 'document-design',
      tags: ['语文', '初中', '散文', '教学设计'],
      author: '王芳老师',
      lastModified: '2024-01-24',
      views: 980,
      rating: 4.7,
      type: 'document',
      size: '1.8 MB',
      isBookmarked: false
    },
    {
      id: 19,
      title: '高中物理《牛顿第一定律》教学设计',
      description: '高中物理力学基础教学设计，通过实验探究牛顿第一定律的内容和意义。',
      content: '<h1>高中物理《牛顿第一定律》教学设计</h1><h2>教学目标</h2><p>1. 理解牛顿第一定律的内容和意义</p><p>2. 掌握惯性的概念，能解释相关现象</p><p>3. 培养科学探究能力和实验操作技能</p><h2>教学重点</h2><p>牛顿第一定律的内容和惯性概念</p><h2>教学难点</h2><p>理解惯性是物体的固有属性</p><h2>教学过程</h2><h3>一、复习导入</h3><p>回顾力和运动的关系</p><h3>二、实验探究</h3><p>1. 演示实验：小车在不同阻力下的运动</p><p>2. 分析讨论：理想情况下的运动状态</p><h3>三、概念建构</h3><p>总结牛顿第一定律的内容</p>',
      category: 'document',
      subCategory: 'document-design',
      tags: ['物理', '高中', '牛顿定律', '教学设计'],
      author: '张强老师',
      lastModified: '2024-01-23',
      views: 1150,
      rating: 4.9,
      type: 'document',
      size: '2.3 MB',
      isBookmarked: true
    },
    {
      id: 20,
      title: '小学英语《My Family》教学设计',
      description: '小学三年级英语家庭成员主题教学设计，注重口语交际和词汇学习。',
      content: '<h1>小学英语《My Family》教学设计</h1><h2>Teaching Objectives</h2><p>1. Students can master family member words: father, mother, brother, sister</p><p>2. Students can use sentence patterns: This is my...</p><p>3. Students can introduce their family members</p><h2>Teaching Key Points</h2><p>Master new vocabulary and sentence patterns</p><h2>Teaching Difficult Points</h2><p>Use English to introduce family members fluently</p><h2>Teaching Procedures</h2><h3>Step 1: Warm-up</h3><p>Sing a song about family</p><h3>Step 2: Presentation</h3><p>1. Show family photos</p><p>2. Teach new words with pictures</p><h3>Step 3: Practice</h3><p>Role-play and group activities</p>',
      category: 'document',
      subCategory: 'document-design',
      tags: ['英语', '小学', '家庭', '教学设计'],
      author: '刘丽老师',
      lastModified: '2024-01-22',
      views: 890,
      rating: 4.6,
      type: 'document',
      size: '1.5 MB',
      isBookmarked: false
    },
    {
      id: 21,
      title: '初中化学《氧气的制取》教学设计',
      description: '初中化学实验教学设计，通过实验探究氧气的制取方法和性质。',
      content: '<h1>初中化学《氧气的制取》教学设计</h1><h2>教学目标</h2><p>1. 掌握实验室制取氧气的方法</p><p>2. 学会氧气的检验和收集方法</p><p>3. 培养实验操作技能和安全意识</p><h2>教学重点</h2><p>氧气的制取原理和实验操作</p><h2>教学难点</h2><p>实验装置的选择和操作要点</p><h2>教学过程</h2><h3>一、复习导入</h3><p>回顾氧气的性质和用途</p><h3>二、实验探究</h3><p>1. 演示实验：加热高锰酸钾制氧气</p><p>2. 学生实验：分组制取氧气</p><h3>三、总结归纳</h3><p>制取氧气的注意事项</p>',
      category: 'document',
      subCategory: 'document-design',
      tags: ['化学', '初中', '氧气', '教学设计'],
      author: '陈华老师',
      lastModified: '2024-01-21',
      views: 1050,
      rating: 4.8,
      type: 'document',
      size: '2.0 MB',
      isBookmarked: true
    },
    {
      id: 22,
      title: '小学美术《色彩的魅力》教学设计',
      description: '小学美术色彩基础教学设计，通过实践活动让学生感受色彩的美感。',
      content: '<h1>小学美术《色彩的魅力》教学设计</h1><h2>教学目标</h2><p>1. 认识三原色，了解色彩的基本知识</p><p>2. 学会调色的基本方法</p><p>3. 培养对色彩的感受能力和审美情趣</p><h2>教学重点</h2><p>三原色的认识和调色方法</p><h2>教学难点</h2><p>色彩搭配的美感体验</p><h2>教学过程</h2><h3>一、导入新课</h3><p>欣赏彩虹图片，感受色彩美</p><h3>二、探索新知</h3><p>1. 认识红、黄、蓝三原色</p><p>2. 实践调色：红+黄=橙</p><h3>三、创作实践</h3><p>用三原色创作一幅色彩画</p>',
      category: 'document',
      subCategory: 'document-design',
      tags: ['美术', '小学', '色彩', '教学设计'],
      author: '赵敏老师',
      lastModified: '2024-01-20',
      views: 720,
      rating: 4.5,
      type: 'document',
      size: '1.6 MB',
      isBookmarked: false
    },
    {
      id: 23,
      title: '高中历史《辛亥革命》教学设计',
      description: '高中历史重要事件教学设计，分析辛亥革命的背景、过程和意义。',
      content: '<h1>高中历史《辛亥革命》教学设计</h1><h2>教学目标</h2><p>1. 了解辛亥革命的背景和过程</p><p>2. 分析辛亥革命的历史意义</p><p>3. 培养史料分析和历史思维能力</p><h2>教学重点</h2><p>辛亥革命的过程和历史意义</p><h2>教学难点</h2><p>辛亥革命的局限性分析</p><h2>教学过程</h2><h3>一、情境导入</h3><p>播放辛亥革命相关视频</p><h3>二、史料研读</h3><p>1. 分析革命背景的史料</p><p>2. 研读孙中山的革命思想</p><h3>三、问题探究</h3><p>讨论辛亥革命的成功与局限</p>',
      category: 'document',
      subCategory: 'document-design',
      tags: ['历史', '高中', '辛亥革命', '教学设计'],
      author: '孙伟老师',
      lastModified: '2024-01-19',
      views: 1320,
      rating: 4.7,
      type: 'document',
      size: '2.4 MB',
      isBookmarked: true
    },
    {
      id: 24,
      title: '初中地理《中国的气候》教学设计',
      description: '初中地理气候专题教学设计，通过地图分析中国气候的特点和分布。',
      content: '<h1>初中地理《中国的气候》教学设计</h1><h2>教学目标</h2><p>1. 了解中国气候的主要特征</p><p>2. 掌握季风气候的形成原因</p><p>3. 学会读气候分布图和气候统计图</p><h2>教学重点</h2><p>中国气候特征和季风气候</p><h2>教学难点</h2><p>气候形成的原因分析</p><h2>教学过程</h2><h3>一、复习导入</h3><p>回顾影响气候的因素</p><h3>二、读图分析</h3><p>1. 观察中国气候分布图</p><p>2. 分析气温和降水特点</p><h3>三、原因探究</h3><p>讨论季风对中国气候的影响</p>',
      category: 'document',
      subCategory: 'document-design',
      tags: ['地理', '初中', '气候', '教学设计'],
      author: '周静老师',
      lastModified: '2024-01-18',
      views: 950,
      rating: 4.6,
      type: 'document',
      size: '1.9 MB',
      isBookmarked: false
    },
    {
      id: 25,
      title: '小学体育《跳绳》教学设计',
      description: '小学体育跳绳技能教学设计，注重动作要领和安全教育。',
      content: '<h1>小学体育《跳绳》教学设计</h1><h2>教学目标</h2><p>1. 学会正确的跳绳动作</p><p>2. 提高身体协调性和耐力</p><p>3. 培养坚持锻炼的良好习惯</p><h2>教学重点</h2><p>跳绳的基本动作要领</p><h2>教学难点</h2><p>手脚协调配合</p><h2>教学过程</h2><h3>一、准备活动</h3><p>热身运动，活动关节</p><h3>二、基本部分</h3><p>1. 示范讲解跳绳动作</p><p>2. 分解练习：摇绳、跳跃</p><p>3. 完整动作练习</p><h3>三、放松整理</h3><p>拉伸运动，放松肌肉</p>',
      category: 'document',
      subCategory: 'document-design',
      tags: ['体育', '小学', '跳绳', '教学设计'],
      author: '马强老师',
      lastModified: '2024-01-17',
      views: 680,
      rating: 4.4,
      type: 'document',
      size: '1.4 MB',
      isBookmarked: true
    },
    {
      id: 26,
      title: '高中生物《细胞分裂》教学设计',
      description: '高中生物细胞分裂教学设计，通过显微镜观察和模型制作理解分裂过程。',
      content: '<h1>高中生物《细胞分裂》教学设计</h1><h2>教学目标</h2><p>1. 理解细胞分裂的过程和意义</p><p>2. 掌握有丝分裂的各个时期特点</p><p>3. 培养观察能力和科学思维</p><h2>教学重点</h2><p>有丝分裂的过程和特点</p><h2>教学难点</h2><p>各时期染色体的变化</p><h2>教学过程</h2><h3>一、问题导入</h3><p>为什么生物体能够生长？</p><h3>二、实验观察</h3><p>1. 显微镜观察洋葱根尖</p><p>2. 识别分裂期细胞</p><h3>三、模型建构</h3><p>制作细胞分裂过程模型</p>',
      category: 'document',
      subCategory: 'document-design',
      tags: ['生物', '高中', '细胞分裂', '教学设计'],
      author: '吴琳老师',
      lastModified: '2024-01-16',
      views: 1180,
      rating: 4.8,
      type: 'document',
      size: '2.2 MB',
      isBookmarked: false
    }
  ]

  const [documentsList, setDocumentsList] = useState(initialDocuments)

  const filteredDocuments = documentsList.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    let matchesCategory = false
    
    if (selectedCategory === 'all') {
      matchesCategory = true
    } else if (selectedCategory === 'recent') {
      // 最近访问：基于用户实际访问记录
      matchesCategory = recentlyAccessed.some(accessed => accessed.id === doc.id)
    } else if (selectedCategory === 'shared') {
      // 与我共享：显示有协作者或被分享的文档
      matchesCategory = doc.isShared || (doc.collaborators && doc.collaborators.length > 0)
    } else if (selectedCategory === 'favorites') {
      // 收藏：显示已收藏的文档
      matchesCategory = doc.isBookmarked === true
    } else {
      // 原有的分类过滤逻辑
      matchesCategory = doc.category === selectedCategory || doc.subCategory === selectedCategory
    }
    
    return matchesSearch && matchesCategory
  })

  // 对最近访问的文档按访问时间排序
  const sortedDocuments = selectedCategory === 'recent' 
    ? filteredDocuments.sort((a, b) => {
        const aAccess = recentlyAccessed.find(item => item.id === a.id)
        const bAccess = recentlyAccessed.find(item => item.id === b.id)
        if (!aAccess) return 1
        if (!bAccess) return -1
        return new Date(bAccess.accessTime) - new Date(aAccess.accessTime)
      })
    : filteredDocuments

  const getTypeIcon = (type) => {
    switch (type) {
      case 'multitable':
        return <TableOutlined style={{ color: '#722ed1' }} />
      case 'document':
        return <FileTextOutlined style={{ color: '#1890ff' }} />
      case 'table':
        return <TableOutlined style={{ color: '#52c41a' }} />
      case 'presentation':
        return <PieChartOutlined style={{ color: '#fa8c16' }} />
      case 'survey':
        return <FormOutlined style={{ color: '#fadb14' }} />
      case 'mindnote':
        return <BulbOutlined style={{ color: '#13c2c2' }} />
      case 'markdown':
        return <FileMarkdownOutlined style={{ color: '#eb2f96' }} />
      case 'ppt':
        return <FilePptOutlined style={{ color: '#fa8c16' }} />
      case 'whiteboard':
        return <HighlightOutlined style={{ color: '#13c2c2' }} />
      default:
        return <FileTextOutlined style={{ color: '#1890ff' }} />
    }
  }

  const handleBookmark = (docId) => {
    setDocumentsList(prev => 
      prev.map(doc => 
        doc.id === docId 
          ? { ...doc, isBookmarked: !doc.isBookmarked }
          : doc
      )
    )
  }

  const handleViewDocument = (document) => {
    setDocumentsList(prev => 
      prev.map(doc => 
        doc.id === document.id 
          ? { ...doc, views: doc.views + 1 }
          : doc
      )
    )
  }

  const handleDownloadDocument = (document) => {
    alert(`正在下载: ${document.title}`)
  }

  const handleShareDocument = (document) => {
    setSharingDocument(document)
    setShowShareModal(true)
  }

  // 搜索过滤用户
  const filteredUsers = allUsers.filter(user => {
    if (!searchQuery.trim()) return true
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.department.toLowerCase().includes(searchQuery.toLowerCase())
  })
  
  // 按部门分组显示用户
  const getUsersByDepartment = () => {
    const grouped = {}
    filteredUsers.forEach(user => {
      if (!grouped[user.department]) {
        grouped[user.department] = []
      }
      grouped[user.department].push(user)
    })
    return grouped
  }
  
  const handleInviteCollaborator = () => {
    if (!inviteEmail.trim()) {
      message.warning('请输入邮箱地址')
      return
    }
    const newCollaborator = {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      avatar: null,
      permission: sharePermission
    }
    setCollaborators(prev => [...prev, newCollaborator])
    setInviteEmail('')
    message.success('邀请已发送')
  }
  
  const handleAddUser = (user) => {
    // 检查是否已经添加过该用户
    const isAlreadyAdded = collaborators.some(c => c.id === user.id)
    if (isAlreadyAdded) {
      message.warning(`${user.name} 已经在协作者列表中`)
      return
    }
    
    const newCollaborator = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      permission: 'read'
    }
    setCollaborators(prev => [...prev, newCollaborator])
    message.success(`已添加 ${user.name}`)
    setSearchQuery('') // 清空搜索框
  }
  
  // 高亮搜索关键词
  const highlightText = (text, query) => {
    if (!query.trim()) return text
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} style={{ backgroundColor: '#fff566', fontWeight: 'bold' }}>{part}</span> : 
        part
    )
  }

  const handleCopyLink = () => {
    const shareLink = `https://example.com/share/${sharingDocument?.id}`
    navigator.clipboard.writeText(shareLink)
    message.success('链接已复制到剪贴板')
  }

  const handleRemoveCollaborator = (collaboratorId) => {
    setCollaborators(prev => prev.filter(c => c.id !== collaboratorId))
  }

  const handleOpenPermissionSettings = () => {
    setShowPermissionModal(true)
  }
  
  const handleClosePermissionSettings = () => {
    setShowPermissionModal(false)
  }
  
  const handlePermissionSettingChange = (key, value) => {
    setPermissionSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  const handleSavePermissionSettings = () => {
    message.success('权限设置已保存')
    setShowPermissionModal(false)
  }

  const handlePermissionChange = (collaboratorId, newPermission) => {
    setCollaborators(prev => 
      prev.map(c => 
        c.id === collaboratorId 
          ? { ...c, permission: newPermission }
          : c
      )
    )
  }

  const handleNewDocument = () => {
    setShowTypeModal(true)
  }
  
  // 记录文档访问
  const recordDocumentAccess = (document) => {
    const accessRecord = {
      id: document.id,
      title: document.title,
      accessTime: new Date().toISOString(),
      type: document.type,
      category: document.category
    }
    
    setRecentlyAccessed(prev => {
      // 移除已存在的记录
      const filtered = prev.filter(item => item.id !== document.id)
      // 添加新记录到开头，保持最多20条记录
      const updated = [accessRecord, ...filtered].slice(0, 20)
      // 保存到本地存储
      localStorage.setItem('recentlyAccessedDocs', JSON.stringify(updated))
      return updated
    })
  }

  // 清空最近访问记录
  const clearRecentAccess = () => {
    setRecentlyAccessed([])
    localStorage.removeItem('recentlyAccessedDocs')
    message.success('已清空最近访问记录')
  }

  const handleTypeSelect = (type) => {
    setShowTypeModal(false)
    if (type.isMore) {
      // 处理"更多类型"点击
      message.info('更多类型功能即将上线')
      return
    }
    
    // 根据选择的类型创建相应的文档
    setEditingDocument(null)
    setIsNewDocument(true)
    setShowEditor(true)
    
    // 可以在这里根据不同类型设置不同的初始内容或配置
    message.success(`正在创建${type.title}...`)
  }

  const handleEditDocument = (document) => {
    // 记录文档访问
    recordDocumentAccess(document)
    setEditingDocument(document)
    setIsNewDocument(false)
    setShowEditor(true)
  }

  const handleSaveDocument = (documentData) => {
    if (isNewDocument) {
      setDocumentsList(prev => [documentData, ...prev])
    } else {
      setDocumentsList(prev => 
        prev.map(doc => doc.id === documentData.id ? documentData : doc)
      )
    }
    setShowEditor(false)
    setEditingDocument(null)
    setIsNewDocument(false)
  }

  const handleCloseEditor = () => {
    setShowEditor(false)
    setEditingDocument(null)
    setIsNewDocument(false)
  }

  return (
    <div className="docs-center">
      <Layout>
        <Header className="docs-header">
          <div className="header-title">
            <FileTextOutlined className="header-icon" />
            <Title level={2} style={{ color: '#262626', margin: 0 }}>文档中心</Title>
          </div>
          <div className="header-actions">
            <Space size="large">
              <div className="search-box">
                <Input
                  placeholder="搜索文档..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 300 }}
                  allowClear
                  prefix={<SearchOutlined />}
                />
              </div>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleNewDocument}
                size="large"
              >
                新建文档
              </Button>
            </Space>
          </div>
        </Header>

        <Layout>
          <Sider width={250} className="docs-sidebar">
            <div className="sidebar-content">
              {/* 快捷入口 */}
              <div className="quick-access">
                <div 
                  className={`quick-access-item ${selectedCategory === 'recent' ? 'active' : ''}`}
                >
                  <div 
                    className="quick-access-main"
                    onClick={() => setSelectedCategory('recent')}
                  >
                    <ClockCircleOutlined className="quick-access-icon" />
                    <span className="quick-access-text">最近访问</span>
                  </div>
                  {selectedCategory === 'recent' && recentlyAccessed.length > 0 && (
                    <Tooltip title="清空最近访问记录">
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation()
                          clearRecentAccess()
                        }}
                        className="clear-recent-btn"
                      />
                    </Tooltip>
                  )}
                </div>
                <div 
                  className={`quick-access-item ${selectedCategory === 'shared' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('shared')}
                >
                  <ShareAltOutlined className="quick-access-icon" />
                  <span className="quick-access-text">与我共享</span>
                </div>
                <div 
                  className={`quick-access-item ${selectedCategory === 'favorites' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('favorites')}
                >
                  <StarOutlined className="quick-access-icon" />
                  <span className="quick-access-text">收藏</span>
                </div>
              </div>
              
              <Divider style={{ margin: '16px 0' }} />
              
              <Title level={4}>文档分类</Title>
              <Tree
                className="category-tree"
                showLine={false}
                showIcon={false}
                treeData={categories.map(category => ({
                  key: category.id,
                  title: (
                    <div className="category-item">
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">{category.count}</span>
                    </div>
                  ),
                  children: category.children ? category.children.map(child => ({
                    key: child.id,
                    title: (
                      <div className="category-item">
                        <span className="category-name">{child.name}</span>
                        <span className="category-count">{child.count}</span>
                      </div>
                    ),
                    children: child.children ? child.children.map(grandChild => ({
                      key: grandChild.id,
                      title: (
                        <div className="category-item">
                          <span className="category-name">{grandChild.name}</span>
                          <span className="category-count">{grandChild.count}</span>
                        </div>
                      )
                    })) : []
                  })) : []
                }))}
                selectedKeys={[selectedCategory]}
                expandedKeys={expandedKeys}
                onSelect={(selectedKeys) => {
                  if (selectedKeys.length > 0) {
                    setSelectedCategory(selectedKeys[0]);
                  } else {
                    setSelectedCategory('all');
                  }
                }}
                onExpand={(keys) => setExpandedKeys(keys)}
                blockNode
              />
            </div>
          </Sider>

          <Content className="docs-main">
            <div className="docs-toolbar">
              <div className="results-info">
                <Text>找到 {sortedDocuments.length} 个文档</Text>
              </div>
              <div className="view-controls">
                <Space.Compact>
                  <Button
                    type={viewMode === 'grid' ? 'primary' : 'default'}
                    icon={<AppstoreOutlined />}
                    onClick={() => setViewMode('grid')}
                  >
                    网格
                  </Button>
                  <Button
                    type={viewMode === 'list' ? 'primary' : 'default'}
                    icon={<BarsOutlined />}
                    onClick={() => setViewMode('list')}
                  >
                    列表
                  </Button>
                </Space.Compact>
              </div>
            </div>

            <Row gutter={[16, 16]} className={`docs-grid ${viewMode}`}>
              {sortedDocuments.map(doc => (
                <Col key={doc.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                  <Card
                    className="doc-card"
                    hoverable
                    actions={[
                      <Tooltip title="查看文档" key="view">
                        <Button 
                          type="text" 
                          icon={<EyeOutlined />} 
                          onClick={() => handleViewDocument(doc)}
                        />
                      </Tooltip>,
                      <Tooltip title="编辑文档" key="edit">
                        <Button 
                          type="text" 
                          icon={<EditOutlined />} 
                          onClick={() => handleEditDocument(doc)}
                        />
                      </Tooltip>,
                      <Tooltip title="下载文档" key="download">
                        <Button 
                          type="text" 
                          icon={<DownloadOutlined />} 
                          onClick={() => handleDownloadDocument(doc)}
                        />
                      </Tooltip>,
                      <Tooltip title="分享文档" key="share">
                        <Button 
                          type="text" 
                          icon={<ShareAltOutlined />} 
                          onClick={() => handleShareDocument(doc)}
                        />
                      </Tooltip>
                    ]}
                    extra={
                      <Button
                        type="text"
                        icon={<BookmarkOutlined />}
                        className={doc.isBookmarked ? 'bookmarked' : ''}
                        onClick={() => handleBookmark(doc.id)}
                      />
                    }
                  >
                    <Card.Meta
                      avatar={getTypeIcon(doc.type)}
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Title level={5} style={{ margin: 0 }}>{doc.title}</Title>
                          {doc.source === 'ai-toolbox' && (
                            <AntTag color="blue" size="small" style={{ fontSize: '10px' }}>
                              AI生成
                            </AntTag>
                          )}
                        </div>
                      }
                      description={
                        <div>
                          <Text type="secondary" ellipsis>
                            {doc.description}
                          </Text>
                          <div className="doc-tags" style={{ marginTop: 8 }}>
                            {doc.tags.map(tag => (
                              <AntTag key={tag} size="small" icon={<TagOutlined />}>
                                {tag}
                              </AntTag>
                            ))}
                            {doc.source === 'ai-toolbox' && (
                              <AntTag color="green" size="small" icon={<BulbOutlined />}>
                                AI工具箱
                              </AntTag>
                            )}
                          </div>
                          <div className="doc-meta" style={{ marginTop: 12 }}>
                            <Space split={<Divider type="vertical" />}>
                              <span><EyeOutlined /> {doc.views}</span>
                              <span><StarOutlined /> {doc.rating}</span>
                              <span><ClockCircleOutlined /> {doc.lastModified}</span>
                              {doc.source === 'ai-toolbox' && (
                                <span style={{ color: '#52c41a' }}>来源: AI工具箱</span>
                              )}
                            </Space>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {sortedDocuments.length === 0 && (
              <Empty
                image={<FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                description={
                  <div>
                    <Title level={4}>未找到相关文档</Title>
                    <Text type="secondary">尝试调整搜索条件或浏览其他分类</Text>
                  </div>
                }
              />
            )}
          </Content>
        </Layout>
      </Layout>
      
      {showEditor && (
        <DocumentEditor
          document={editingDocument}
          onSave={handleSaveDocument}
          onClose={handleCloseEditor}
          isNew={isNewDocument}
        />
      )}
      
      {showShareModal && sharingDocument && (
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>分享文档</span>
              <Button 
                type="text" 
                icon={<SettingOutlined />} 
                onClick={handleOpenPermissionSettings}
              >
                权限设置
              </Button>
            </div>
          }
          open={showShareModal}
          onCancel={() => setShowShareModal(false)}
          width={600}
          footer={null}
        >
          <div style={{ padding: '20px 0' }}>
            {/* 邀请协作者部分 */}
            <div style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginBottom: 16 }}>邀请协作者</Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                {collaborators.map(collaborator => (
                  <Avatar 
                    key={collaborator.id}
                    style={{ backgroundColor: '#1890ff' }}
                  >
                    {collaborator.name.charAt(0)}
                  </Avatar>
                ))}
                <RightOutlined style={{ color: '#999', margin: '0 8px' }} />
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <Input
                  placeholder="搜索用户、群组、部门或用户组"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    flex: 1,
                    borderRadius: 8,
                    fontSize: 14,
                    padding: '8px 12px'
                  }}
                  prefix={<SearchOutlined style={{ color: '#1890ff', fontSize: 16 }} />}
                />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleInviteCollaborator}
                  style={{
                    borderRadius: 8,
                    height: 40,
                    width: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)'
                  }}
                >
                </Button>
              </div>
              
              {/* 搜索结果列表 */}
              {searchQuery && (
                <div style={{ 
                  maxHeight: 300, 
                  overflowY: 'auto', 
                  border: '1px solid #f0f0f0', 
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  marginBottom: 16
                }}>
                  {Object.entries(getUsersByDepartment()).map(([department, users]) => (
                    <div key={department}>
                      {/* 个人用户 */}
                      {users.map(user => (
                        <div 
                          key={user.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            borderBottom: '1px solid #f5f5f5',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          onClick={() => handleAddUser(user)}
                        >
                          <Avatar 
                            size={32}
                            style={{ 
                              backgroundColor: user.status === 'online' ? '#1890ff' : '#999',
                              marginRight: 12
                            }}
                          >
                            {user.avatar || user.name.charAt(0)}
                          </Avatar>
                          <div style={{ flex: 1 }}>
                             <div style={{ fontWeight: 500, marginBottom: 2 }}>
                               {highlightText(user.name, searchQuery)}
                             </div>
                             <div style={{ color: '#999', fontSize: 12 }}>
                               {highlightText(user.department, searchQuery)}
                             </div>
                           </div>
                          {user.permission === 'invited' && (
                            <Text style={{ color: '#999', fontSize: 12 }}>已授予阅读权限</Text>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  {/* 部门分组 */}
                  {departments.filter(dept => 
                    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map(dept => (
                    <div 
                      key={dept.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid #f5f5f5',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <Avatar 
                        size={32}
                        style={{ 
                          backgroundColor: dept.id === 'dev' ? '#52c41a' : '#fa8c16',
                          marginRight: 12,
                          fontSize: 12
                        }}
                      >
                        {dept.id === 'dev' ? '研发管理' : 'AI杂谈'}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                         <div style={{ fontWeight: 500, marginBottom: 2 }}>
                           {highlightText(dept.name, searchQuery)}
                         </div>
                         <div style={{ color: '#999', fontSize: 12 }}>({dept.count})</div>
                       </div>
                    </div>
                  ))}
                  
                  {filteredUsers.length === 0 && departments.filter(dept => 
                    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                      未找到相关用户或部门
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 链接分享部分 */}
            <div style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginBottom: 16 }}>链接分享</Title>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px 16px',
                backgroundColor: '#f5f5f5',
                borderRadius: 8,
                marginBottom: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Avatar 
                    style={{ backgroundColor: '#1890ff', marginRight: 12 }}
                    icon={<FileTextOutlined />}
                  />
                  <div>
                    <div style={{ fontWeight: 500 }}>北京国人通教育科技有限公司</div>
                    <div style={{ color: '#666', fontSize: 12 }}>组织内获得链接的人可阅读</div>
                  </div>
                </div>
                <Select 
                  value={sharePermission}
                  onChange={setSharePermission}
                  style={{ width: 100 }}
                >
                  <Option value="read">可阅读</Option>
                  <Option value="edit">可编辑</Option>
                  <Option value="admin">管理员</Option>
                </Select>
              </div>
            </div>

            {/* 分享按钮组 */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button 
                icon={<CopyOutlined />}
                onClick={handleCopyLink}
                style={{ borderRadius: 20, padding: '8px 16px' }}
              >
                复制链接
              </Button>
              <Button 
                icon={<div style={{ width: 16, height: 16, backgroundColor: '#1890ff', borderRadius: '50%' }} />}
                style={{ borderRadius: 20, padding: '8px 16px' }}
              >
              </Button>
              <Button 
                icon={<div style={{ width: 16, height: 16, backgroundColor: '#52c41a', borderRadius: '50%' }} />}
                style={{ borderRadius: 20, padding: '8px 16px' }}
              >
              </Button>
              <Button 
                icon={<WechatOutlined />}
                style={{ borderRadius: 20, padding: '8px 16px' }}
              >
              </Button>
              <Button 
                icon={<QrcodeOutlined />}
                style={{ borderRadius: 20, padding: '8px 16px' }}
              >
              </Button>
              <Button 
                icon={<MailOutlined />}
                style={{ borderRadius: 20, padding: '8px 16px' }}
              >
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* 权限设置模态框 */}
      {showPermissionModal && (
        <Modal
          title="权限设置"
          open={showPermissionModal}
          onCancel={handleClosePermissionSettings}
          width={600}
          footer={[
            <Button key="cancel" onClick={handleClosePermissionSettings}>
              取消
            </Button>,
            <Button key="save" type="primary" onClick={handleSavePermissionSettings}>
              保存
            </Button>
          ]}
        >
          <div style={{ padding: '20px 0' }}>
            {/* 对外分享 */}
            <div style={{ marginBottom: 32 }}>
              <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                对外分享
                <Tooltip title="设置文档的对外分享权限">
                  <Button type="text" size="small" style={{ marginLeft: 8 }}>
                    ?
                  </Button>
                </Tooltip>
              </Title>
              
              <div style={{ marginBottom: 16 }}>
                <Checkbox 
                  checked={permissionSettings.allowExternalShare}
                  onChange={(e) => handlePermissionSettingChange('allowExternalShare', e.target.checked)}
                >
                  允许内容分享到组织外
                </Checkbox>
              </div>
              
              <div>
                <Checkbox 
                  checked={permissionSettings.allowManagePermissions}
                  onChange={(e) => handlePermissionSettingChange('allowManagePermissions', e.target.checked)}
                >
                  仅"可管理权限"可以将内容分享到组织外
                </Checkbox>
              </div>
            </div>
            
            {/* 谁可以查看、添加、移除协作者 */}
            <div style={{ marginBottom: 32 }}>
              <Title level={5} style={{ marginBottom: 16 }}>谁可以查看、添加、移除协作者</Title>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>可阅读的用户</div>
                <Select 
                  value={permissionSettings.allowViewCollaborators}
                  onChange={(value) => handlePermissionSettingChange('allowViewCollaborators', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="all">可阅读的用户</Option>
                  <Option value="edit">可编辑的用户</Option>
                  <Option value="manage">可管理的用户</Option>
                </Select>
              </div>
              
              <div>
                <Checkbox 
                  checked={permissionSettings.allowManagePermissions}
                  onChange={(e) => handlePermissionSettingChange('allowManagePermissions', e.target.checked)}
                >
                  仅组织内的用户可以查看、添加、移除协作者
                </Checkbox>
              </div>
            </div>
            
            {/* 谁可以复制内容 */}
            <div style={{ marginBottom: 32 }}>
              <Title level={5} style={{ marginBottom: 16 }}>谁可以复制内容</Title>
              
              <div style={{ marginBottom: 8, fontWeight: 500 }}>可阅读的用户</div>
              <Select 
                value={permissionSettings.allowCopyContent}
                onChange={(value) => handlePermissionSettingChange('allowCopyContent', value)}
                style={{ width: '100%' }}
              >
                <Option value="all">可阅读的用户</Option>
                <Option value="edit">可编辑的用户</Option>
                <Option value="manage">可管理的用户</Option>
              </Select>
            </div>
            
            {/* 谁可以创建副本、打印和下载 */}
            <div style={{ marginBottom: 32 }}>
              <Title level={5} style={{ marginBottom: 16 }}>谁可以创建副本、打印和下载</Title>
              
              <div style={{ marginBottom: 8, fontWeight: 500 }}>可阅读的用户</div>
              <Select 
                value={permissionSettings.allowPrintDownload}
                onChange={(value) => handlePermissionSettingChange('allowPrintDownload', value)}
                style={{ width: '100%' }}
              >
                <Option value="all">可阅读的用户</Option>
                <Option value="edit">可编辑的用户</Option>
                <Option value="manage">可管理的用户</Option>
              </Select>
            </div>
            
            {/* 谁可以评论 */}
            <div style={{ marginBottom: 32 }}>
              <Title level={5} style={{ marginBottom: 16 }}>谁可以评论</Title>
              
              <div style={{ marginBottom: 8, fontWeight: 500 }}>可阅读的用户</div>
              <Select 
                value={permissionSettings.allowComment}
                onChange={(value) => handlePermissionSettingChange('allowComment', value)}
                style={{ width: '100%' }}
              >
                <Option value="all">可阅读的用户</Option>
                <Option value="edit">可编辑的用户</Option>
                <Option value="manage">可管理的用户</Option>
              </Select>
            </div>
            
            {/* 更多高级设置 */}
            <div>
              <Title level={5} style={{ marginBottom: 16, cursor: 'pointer' }}>
                ▼ 更多高级设置
              </Title>
              
              <div style={{ marginBottom: 16 }}>
                <Title level={5} style={{ marginBottom: 8, fontSize: 14 }}>谁可以查看访问者头像和点赞者头像</Title>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>可阅读的用户</div>
                <Select 
                  value={permissionSettings.showVisitorAvatars}
                  onChange={(value) => handlePermissionSettingChange('showVisitorAvatars', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="all">可阅读的用户</Option>
                  <Option value="edit">可编辑的用户</Option>
                  <Option value="manage">可管理的用户</Option>
                </Select>
              </div>
              
              <div>
                <Title level={5} style={{ marginBottom: 8, fontSize: 14, display: 'flex', alignItems: 'center' }}>
                  谁可以在文档内申请文档访问权限
                  <Tooltip title="允许用户在文档内申请访问权限">
                    <Button type="text" size="small" style={{ marginLeft: 8 }}>
                      ?
                    </Button>
                  </Tooltip>
                </Title>
                <Checkbox 
                  checked={permissionSettings.allowRequestAccess}
                  onChange={(e) => handlePermissionSettingChange('allowRequestAccess', e.target.checked)}
                >
                  仅可管理权限的用户可以申请
                </Checkbox>
              </div>
            </div>
          </div>
        </Modal>
      )}
      
      {/* 文档类型选择模态框 */}
      <Modal
        title="选择文档类型"
        open={showTypeModal}
        onCancel={() => setShowTypeModal(false)}
        footer={null}
        width={600}
        centered
      >
        <div style={{ padding: '20px 0' }}>
          <Row gutter={[16, 16]}>
            {documentTypes.map((type) => (
              <Col key={type.key} xs={12} sm={8} md={6}>
                <Card
                  hoverable
                  className="type-card"
                  style={{
                    textAlign: 'center',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  bodyStyle={{ padding: '20px 12px' }}
                  onClick={() => handleTypeSelect(type)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = type.color
                    e.currentTarget.style.boxShadow = `0 2px 8px ${type.color}20`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#f0f0f0'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    {type.icon}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    marginBottom: '4px',
                    color: '#262626'
                  }}>
                    {type.title}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#8c8c8c',
                    lineHeight: '1.4'
                  }}>
                    {type.description}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>
    </div>
  )
}

export default DocsCenter