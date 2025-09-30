import React, { useState, useEffect } from 'react'
import {
  Card,
  Input,
  Button,
  Tag,
  Avatar,
  Typography,
  Row,
  Col,
  Select,
  Empty,
  message,
  Modal,
  Rate,
  Descriptions,
  Badge,
  Tooltip,
  Space,
  Divider
} from 'antd'
import {
  SearchOutlined,
  StarFilled,
  StarOutlined,
  PlusOutlined,
  CheckOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  RobotOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  GiftOutlined
} from '@ant-design/icons'
import { AI_TOOL_CATEGORIES, AI_TOOL_CATEGORY_LABELS, AI_TOOL_STATUS } from '../constants/noteEditConstants'
import './AIToolHouse.css'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const AIToolHouse = ({ onAddToOperationPanel, noteCategory = null }) => {
  console.log('=== AIToolHouse 组件渲染 ===');
  console.log('接收到的 noteCategory:', noteCategory);
  console.log('noteCategory 类型:', typeof noteCategory);
  console.log('================================');
  // 添加调试日志
  console.log('AIToolHouse - 接收到的 noteCategory:', noteCategory);
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [favoriteTools, setFavoriteTools] = useState(() => {
    const saved = localStorage.getItem('favorite-ai-tools')
    return saved ? JSON.parse(saved) : []
  })
  const [addedTools, setAddedTools] = useState(() => {
    const saved = localStorage.getItem('added-ai-tools-to-panel')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedTool, setSelectedTool] = useState(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)

  // 社区AI工具数据
  const aiTools = [
    {
      id: 'grading-assistant',
      name: '智能阅卷助手',
      description: '专业的智能阅卷工具，支持试卷自动评阅、成绩分析、评语生成等功能',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.2.0',
      rating: 4.9,
      downloads: 18960,
      tags: ['阅卷', '评分', '试卷分析', '自动批改'],
      icon: '阅',
      color: '#c41d7f',
      featured: true,
      applicableNoteCategories: ['organizational_training', 'learning_square'],
      menuConfig: {
        key: 'grading',
        title: '阅卷工具',
        icon: '阅',
        gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
        color: '#c41d7f'
      },
      features: [
        '智能试卷识别扫描',
        '自动答案匹配评分',
        '个性化评语生成',
        '成绩统计分析',
        '学情报告生成',
        '批改结果导出'
      ],
      usage: '上传试卷文件或图片，系统将自动识别答题内容并进行智能评阅，生成详细的评阅报告'
    },
    {
      id: 'course-development',
      name: '课程研发',
      description: '专业的课程开发和设计工具，支持课程大纲制定、教学内容规划、评估体系设计等功能',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '培训产品研发团队',
      version: 'v1.0.0',
      rating: 4.8,
      downloads: 5420,
      tags: ['课程研发', '教学设计', '课程规划', '培训产品'],
      icon: '📚',
      color: '#1890ff',
      featured: true,
      applicableNoteCategories: ['training_product_development'],
      menuConfig: {
        key: 'course-development',
        title: '课程研发',
        icon: '📚',
        gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
        color: '#1890ff'
      },
      features: [
        '智能课程大纲生成',
        '教学目标设定',
        '学习路径规划',
        '评估体系设计',
        '教学资源整合',
        '课程质量评估'
      ],
      usage: '输入课程主题和培训目标，AI将协助生成完整的课程开发方案和教学设计'
    },
    {
      id: 'video-slicing',
      name: '视频切片',
      description: '专业的视频编辑和切片工具，支持视频分段、时间轴编辑、片段导出等功能，专为培训内容制作优化',
      category: AI_TOOL_CATEGORIES.CREATIVE,
      status: AI_TOOL_STATUS.NEW,
      author: '培训产品研发团队',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 3280,
      tags: ['视频编辑', '视频切片', '培训制作', '多媒体'],
      icon: '🎬',
      color: '#722ed1',
      featured: true,
      applicableNoteCategories: ['training_product_development'],
      menuConfig: {
        key: 'video-slicing',
        title: '视频切片',
        icon: '🎬',
        gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
        color: '#722ed1'
      },
      features: [
        '智能视频分段',
        '精确时间轴编辑',
        '多格式视频支持',
        '批量片段导出',
        '实时预览功能',
        '培训场景优化'
      ],
      usage: '上传培训视频文件，通过时间轴工具进行精确切片，生成适合教学使用的视频片段'
    },
    {
      id: 'smart-writer',
      name: '智能写作助手',
      description: '基于GPT技术的智能写作工具，支持文章生成、润色、翻译等功能',
      category: AI_TOOL_CATEGORIES.WRITING,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '教育AI团队',
      version: 'v2.1.0',
      rating: 4.8,
      downloads: 12580,
      tags: ['写作', 'GPT', '润色', '翻译'],
      icon: '✍️',
      color: '#52c41a',
      featured: true,
      applicableNoteCategories: ['organizational_training', 'learning_square', 'training_product_development'],
      menuConfig: {
        key: 'smart-writer',
        title: '智能写作',
        icon: '✍',
        gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        color: '#52c41a'
      },
      features: [
        '支持多种文体写作',
        '智能语法检查',
        '多语言翻译',
        '文本润色优化',
        '创意灵感生成'
      ],
      usage: '在操作面板中点击智能写作工具，输入写作需求即可获得AI辅助'
    },
    {
      id: 'data-analyst',
      name: '数据分析大师',
      description: '强大的数据分析和可视化工具，支持多种图表生成和统计分析',
      category: AI_TOOL_CATEGORIES.ANALYSIS,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '数据科学实验室',
      version: 'v1.8.3',
      rating: 4.7,
      downloads: 8960,
      tags: ['数据分析', '可视化', '统计', '图表'],
      icon: '📊',
      color: '#722ed1',
      featured: true,
      applicableNoteCategories: ['organizational_training', 'learning_square'],
      menuConfig: {
        key: 'data-analyst',
        title: '数据分析',
        icon: '📊',
        gradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
        color: '#722ed1'
      },
      features: [
        '智能数据清洗',
        '多维度统计分析',
        '交互式图表生成',
        '趋势预测分析',
        '报告自动生成'
      ],
      usage: '上传数据文件，选择分析维度，AI将自动生成分析报告和可视化图表'
    },
    {
      id: 'teaching-assistant',
      name: '教学智能助手',
      description: '专为教育工作者设计的AI助手，支持课程设计、题目生成、学情分析',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智慧教育研发组',
      version: 'v1.0.2',
      rating: 4.9,
      downloads: 15620,
      tags: ['教学', '课程设计', '题目生成', '学情分析'],
      icon: '🎓',
      color: '#fa8c16',
      featured: true,
      menuConfig: {
        key: 'teaching-assistant',
        title: '教学助手',
        icon: '🎓',
        gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
        color: '#fa8c16'
      },
      features: [
        '智能课程大纲生成',
        '个性化题目创建',
        '学生学习分析',
        '教学资源推荐',
        '作业批改辅助'
      ],
      usage: '输入教学主题和要求，AI将生成完整的教学方案和配套资源'
    },
    {
      id: 'creative-designer',
      name: '创意设计师',
      description: 'AI驱动的创意设计工具，支持图像生成、LOGO设计、海报制作',
      category: AI_TOOL_CATEGORIES.CREATIVE,
      status: AI_TOOL_STATUS.BETA,
      author: '创意工作室',
      version: 'v0.9.1',
      rating: 4.5,
      downloads: 6780,
      tags: ['设计', '创意', '图像生成', 'LOGO'],
      icon: '🎨',
      color: '#eb2f96',
      featured: false,
      menuConfig: {
        key: 'creative-designer',
        title: '创意设计',
        icon: '🎨',
        gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
        color: '#eb2f96'
      },
      features: [
        'AI图像生成',
        '智能LOGO设计',
        '海报模板定制',
        '配色方案推荐',
        '设计风格转换'
      ],
      usage: '描述设计需求，选择风格偏好，AI将生成多个设计方案供选择'
    },
    {
      id: 'efficiency-master',
      name: '效率提升大师',
      description: '全能的效率工具集，包含时间管理、任务规划、自动化处理等功能',
      category: AI_TOOL_CATEGORIES.PRODUCTIVITY,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '效率优化团队',
      version: 'v3.2.1',
      rating: 4.6,
      downloads: 9840,
      tags: ['效率', '时间管理', '任务规划', '自动化'],
      icon: '⚡',
      color: '#13c2c2',
      featured: false,
      menuConfig: {
        key: 'efficiency-master',
        title: '效率大师',
        icon: '⚡',
        gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
        color: '#13c2c2'
      },
      features: [
        '智能任务分解',
        '时间分配优化',
        '工作流程自动化',
        '进度实时跟踪',
        '效率报告生成'
      ],
      usage: '设定工作目标，AI将智能分解任务并优化时间安排'
    },
    {
      id: 'research-helper',
      name: '学术研究助手',
      description: '专业的学术研究工具，支持文献检索、论文分析、引用管理',
      category: AI_TOOL_CATEGORIES.RESEARCH,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '学术研究中心',
      version: 'v2.0.5',
      rating: 4.7,
      downloads: 5620,
      tags: ['学术', '研究', '文献', '论文'],
      icon: '🔬',
      color: '#f5222d',
      featured: false,
      menuConfig: {
        key: 'research-helper',
        title: '研究助手',
        icon: '🔬',
        gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
        color: '#f5222d'
      },
      features: [
        '智能文献检索',
        '论文结构分析',
        '引用格式管理',
        '研究趋势分析',
        '学术写作辅助'
      ],
      usage: '输入研究领域和关键词，AI将提供相关文献和研究建议'
    },
    {
      id: 'coze-smart-assistant',
      name: 'Coze智能助手',
      description: '基于Coze平台开发的智能对话助手，支持多轮对话和个性化服务',
      category: AI_TOOL_CATEGORIES.PRODUCTIVITY,
      status: AI_TOOL_STATUS.NEW,
      author: 'Coze开发者',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 3250,
      tags: ['Coze', '智能对话', '个性化', '多轮对话'],
      icon: '🤖',
      color: '#722ed1',
      featured: true,
      platform: 'Coze',
      menuConfig: {
        key: 'coze-assistant',
        title: 'Coze助手',
        icon: '🤖',
        gradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
        color: '#722ed1'
      },
      features: [
        '多轮对话理解',
        '个性化响应',
        '上下文记忆',
        '多模态交互',
        '插件扩展支持'
      ],
      usage: '通过Coze平台配置的智能助手，支持文本、语音等多种交互方式'
    },
    {
      id: 'dify-workflow',
      name: 'Dify工作流',
      description: '基于Dify平台构建的智能工作流工具，支持低代码AI应用开发',
      category: AI_TOOL_CATEGORIES.PRODUCTIVITY,
      status: AI_TOOL_STATUS.ACTIVE,
      author: 'Dify社区',
      version: 'v2.0.1',
      rating: 4.7,
      downloads: 4680,
      tags: ['Dify', '工作流', '低代码', 'RAG'],
      icon: '⚡',
      color: '#13c2c2',
      featured: true,
      platform: 'Dify',
      menuConfig: {
        key: 'dify-workflow',
        title: 'Dify工作流',
        icon: '⚡',
        gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
        color: '#13c2c2'
      },
      features: [
        '可视化工作流编辑',
        'RAG知识库集成',
        '多模型支持',
        'API自动生成',
        '企业级部署'
      ],
      usage: '通过拖拽的方式构建复杂的AI应用工作流，无需编程基础'
    },
    {
      id: 'zhipu-qingyan',
      name: '智谱清言助手',
      description: '基于智谱AI清言模型开发的智能写作和翻译助手',
      category: AI_TOOL_CATEGORIES.WRITING,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '智谱AI',
      version: 'v1.5.0',
      rating: 4.8,
      downloads: 6890,
      tags: ['智谱AI', '清言', '写作', '翻译'],
      icon: '✍️',
      color: '#52c41a',
      featured: false,
      platform: '智谱清言',
      menuConfig: {
        key: 'zhipu-assistant',
        title: '清言助手',
        icon: '✍️',
        gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        color: '#52c41a'
      },
      features: [
        '中文优化生成',
        '多语言翻译',
        '文本概括总结',
        '代码生成辅助',
        '逻辑推理能力'
      ],
      usage: '基于智谱清言模型的强大中文理解和生成能力，提供高质量内容输出'
    },
    {
      id: 'classroom-evaluation',
      name: '课堂评价',
      description: '基于用户提交的评价要求，生成评价量表，基于该量表以评价老师在课堂上的表现',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.8,
      downloads: 2150,
      tags: ['课堂评价', '教学评估', '量表生成', '教师评价'],
      icon: '📊',
      color: '#1890ff',
      featured: true,
      menuConfig: {
        key: 'classroom-evaluation',
        title: '课堂评价',
        icon: '📊',
        gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
        color: '#1890ff'
      },
      features: [
        '智能评价量表生成',
        '多维度教学评估',
        '个性化评价指标',
        '数据统计分析',
        '评价报告生成',
        '历史数据对比'
      ],
      usage: '输入评价要求和标准，系统将自动生成专业的课堂评价量表，并基于量表对教师课堂表现进行全面评估'
    },
    {
      id: 'code-generator',
      name: '代码生成器',
      description: '智能代码生成和优化工具，支持多种编程语言和框架',
      category: AI_TOOL_CATEGORIES.PRODUCTIVITY,
      status: AI_TOOL_STATUS.NEW,
      author: '开发者联盟',
      version: 'v1.1.0',
      rating: 4.4,
      downloads: 7230,
      tags: ['编程', '代码生成', '优化', '多语言'],
      icon: '💻',
      color: '#1890ff',
      featured: true,
      menuConfig: {
        key: 'code-generator',
        title: '代码生成',
        icon: '💻',
        gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
        color: '#1890ff'
      },
      features: [
        '自然语言转代码',
        '代码智能补全',
        '错误检测修复',
        '性能优化建议',
        '多语言支持'
      ],
      usage: '描述功能需求，选择编程语言，AI将生成对应的代码实现'
    },
    {
      id: 'translation-pro',
      name: '专业翻译家',
      description: '高精度的多语言翻译工具，支持文档翻译和实时对话翻译',
      category: AI_TOOL_CATEGORIES.WRITING,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '语言技术团队',
      version: 'v2.3.2',
      rating: 4.8,
      downloads: 18750,
      tags: ['翻译', '多语言', '文档', '实时'],
      icon: '🌐',
      color: '#52c41a',
      featured: false,
      menuConfig: {
        key: 'translation-pro',
        title: '专业翻译',
        icon: '🌐',
        gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
        color: '#52c41a'
      },
      features: [
        '99种语言支持',
        '专业术语识别',
        '文档格式保持',
        '语音实时翻译',
        '翻译质量评估'
      ],
      usage: '上传文档或输入文本，选择目标语言，AI将提供高质量翻译'
    },
    {
      id: 'training-plan',
      name: '培训方案',
      description: '智能培训方案生成工具，基于培训需求和目标，生成完整的培训计划和实施方案',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '培训管理团队',
      version: 'v1.3.0',
      rating: 4.9,
      downloads: 8650,
      tags: ['培训方案', '培训计划', '教学设计', '培训管理'],
      icon: '📚',
      color: '#1890ff',
      featured: true,
      applicableNoteCategories: ['training_needs_management'],
      menuConfig: {
        key: 'training-plan',
        title: '培训方案',
        icon: '📚',
        gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
        color: '#1890ff'
      },
      features: [
        '智能培训方案生成',
        '培训目标设定',
        '课程内容规划',
        '时间安排优化',
        '资源配置建议',
        '效果评估设计'
      ],
      usage: '输入培训需求和目标，AI将生成完整的培训方案，包括课程安排、时间规划和评估体系'
    },
    {
      id: 'schedule',
      name: '课表',
      description: '智能课表生成和管理工具，支持课程安排、时间冲突检测、资源优化配置',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '教务管理团队',
      version: 'v2.1.0',
      rating: 4.7,
      downloads: 12340,
      tags: ['课表', '课程安排', '时间管理', '资源配置'],
      icon: '📅',
      color: '#52c41a',
      featured: true,
      applicableNoteCategories: ['training_needs_management'],
      menuConfig: {
        key: 'schedule',
        title: '课表',
        icon: '📅',
        gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
        color: '#52c41a'
      },
      features: [
        '智能课表生成',
        '时间冲突检测',
        '教室资源分配',
        '教师安排优化',
        '课程负载均衡',
        '个性化课表定制'
      ],
      usage: '输入课程信息和约束条件，AI将自动生成最优的课表安排，避免时间冲突并优化资源利用'
    },
    {
      id: 'training-report',
      name: '培训报告',
      description: '智能培训报告生成工具，对培训整体情况进行总结分析，生成专业的培训效果评估报告',
      category: AI_TOOL_CATEGORIES.ANALYSIS,
      status: AI_TOOL_STATUS.NEW,
      author: '培训管理团队',
      version: 'v1.0.0',
      rating: 4.9,
      downloads: 1250,
      tags: ['培训报告', '数据分析', '效果评估', '总结分析'],
      icon: '📋',
      color: '#722ed1',
      featured: true,
      applicableNoteCategories: ['training_needs_management'],
      menuConfig: {
        key: 'training-report',
        title: '培训报告',
        icon: '📋',
        gradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
        color: '#722ed1'
      },
      features: [
        '培训数据智能收集',
        '多维度效果分析',
        '学员满意度统计',
        '培训ROI计算',
        '可视化报告生成',
        '改进建议输出'
      ],
      usage: '系统将自动收集培训相关数据，包括参与人数、完成率、满意度等，生成全面的培训效果分析报告'
    }
  ]

  // 状态选项
  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: AI_TOOL_STATUS.ACTIVE, label: '✅ 稳定版' },
    { value: AI_TOOL_STATUS.NEW, label: '🆕 最新版' },
    { value: AI_TOOL_STATUS.BETA, label: '🧪 测试版' },
    { value: AI_TOOL_STATUS.DEPRECATED, label: '⚠️ 已废弃' }
  ]

  // 根据笔记分类过滤工具
  const getFilteredToolsByNoteCategory = (tools, category) => {
    console.log('getFilteredToolsByNoteCategory - 输入参数:', { tools: tools.length, category });
    
    if (!category || category === 'all') {
      console.log('getFilteredToolsByNoteCategory - 返回所有工具');
      return tools;
    }
    
    // 特殊处理：培训产品研发分类下显示课程研发和视频切片工具
    if (category === 'training_product_development') {
      const filtered = tools.filter(tool => 
        ['course-development', 'video-slicing'].includes(tool.id)
      );
      console.log('getFilteredToolsByNoteCategory - 培训产品研发分类，过滤后的工具:', filtered);
      return filtered;
    }
    
    // 特殊处理：培训需求与管理分类下显示特定的工具
    if (category === 'training_needs_management') {
      const filtered = tools.filter(tool => 
        ['training-plan', 'schedule', 'training-report'].includes(tool.id)
      );
      console.log('getFilteredToolsByNoteCategory - 培训需求与管理分类，过滤后的工具:', filtered);
      return filtered;
    }
    
    // 对于其他分类，使用常规的applicableNoteCategories过滤
    const filtered = tools.filter(tool => {
      // 如果工具没有applicableNoteCategories属性，则不显示
      if (!tool.applicableNoteCategories) {
        return false;
      }
      
      // 检查工具是否适用于当前笔记分类
      return tool.applicableNoteCategories.includes(category);
    });
    
    console.log(`getFilteredToolsByNoteCategory - ${category}分类，过滤后的工具:`, filtered);
    return filtered;
  };

  // 筛选工具
  const filteredTools = (() => {
    console.log('=== 开始筛选工具 ===');
    console.log('初始工具数量:', aiTools.length);
    console.log('当前 noteCategory:', noteCategory);
    console.log('noteCategory 类型:', typeof noteCategory);
    console.log('noteCategory === "training_needs_management":', noteCategory === 'training_needs_management');
    
    let tools = aiTools;
    
    // 首先根据笔记分类过滤
    if (noteCategory) {
      console.log('开始根据笔记分类过滤...');
      tools = getFilteredToolsByNoteCategory(tools, noteCategory);
      console.log('分类过滤后的工具数量:', tools.length);
      console.log('分类过滤后的工具列表:', tools.map(t => ({ id: t.id, name: t.name })));
    } else {
      console.log('noteCategory 为空，不进行分类过滤');
    }
    
    // 然后应用其他过滤条件
    const finalTools = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || tool.status === selectedStatus
      
      console.log(`工具 ${tool.name} 过滤检查:`, {
        matchesSearch,
        matchesCategory,
        matchesStatus,
        searchTerm,
        selectedCategory,
        selectedStatus,
        toolCategory: tool.category,
        toolStatus: tool.status
      });
      
      return matchesSearch && matchesCategory && matchesStatus
    });
    
    console.log('最终过滤后的工具数量:', finalTools.length);
    console.log('最终工具列表:', finalTools.map(t => t.name));
    console.log('=== 筛选工具完成 ===');
    
    return finalTools;
  })();

  // 切换收藏状态
  const toggleFavorite = (toolId) => {
    const newFavorites = favoriteTools.includes(toolId)
      ? favoriteTools.filter(id => id !== toolId)
      : [...favoriteTools, toolId]
    
    setFavoriteTools(newFavorites)
    localStorage.setItem('favorite-ai-tools', JSON.stringify(newFavorites))
    
    const tool = aiTools.find(t => t.id === toolId)
    message.success(newFavorites.includes(toolId) 
      ? `已收藏 ${tool.name}` 
      : `已取消收藏 ${tool.name}`
    )
  }

  // 添加工具到操作面板
  const addToOperationPanel = (tool) => {
    try {
      const newAddedTools = [...addedTools, tool.id]
      setAddedTools(newAddedTools)
      localStorage.setItem('added-ai-tools-to-panel', JSON.stringify(newAddedTools))
      
      // 保存AI工具配置信息
      const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}')
      aiToolsConfig[tool.id] = tool.menuConfig
      localStorage.setItem('ai-tools-config', JSON.stringify(aiToolsConfig))
      
      // 触发自定义事件通知操作面板更新
      window.dispatchEvent(new Event('aiToolsChanged'))
      
      // 调用传入的回调函数，将工具添加到操作面板
      if (onAddToOperationPanel) {
        onAddToOperationPanel(tool.menuConfig)
      }
      
      message.success(`${tool.name} 已添加到操作面板`)
    } catch (error) {
      message.error('添加失败，请重试')
    }
  }

  // 从操作面板移除工具
  const removeFromOperationPanel = (tool) => {
    try {
      const newAddedTools = addedTools.filter(id => id !== tool.id)
      setAddedTools(newAddedTools)
      localStorage.setItem('added-ai-tools-to-panel', JSON.stringify(newAddedTools))
      
      // 从配置中移除工具
      const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}')
      delete aiToolsConfig[tool.id]
      localStorage.setItem('ai-tools-config', JSON.stringify(aiToolsConfig))
      
      // 触发自定义事件通知操作面板更新
      window.dispatchEvent(new Event('aiToolsChanged'))
      
      message.success(`${tool.name} 已从操作面板移除`)
    } catch (error) {
      message.error('移除失败，请重试')
    }
  }

  // 检查工具是否已添加
  const isToolAdded = (toolId) => {
    return addedTools.includes(toolId)
  }

  // 显示工具详情
  const showToolDetail = (tool) => {
    setSelectedTool(tool)
    setDetailModalVisible(true)
  }

  // 获取状态标签
  const getStatusBadge = (status) => {
    const statusConfig = {
      [AI_TOOL_STATUS.ACTIVE]: { color: 'green', text: '稳定' },
      [AI_TOOL_STATUS.NEW]: { color: 'blue', text: '最新' },
      [AI_TOOL_STATUS.BETA]: { color: 'orange', text: '测试' },
      [AI_TOOL_STATUS.DEPRECATED]: { color: 'red', text: '废弃' }
    }
    const config = statusConfig[status] || { color: 'default', text: '未知' }
    return <Badge status={config.color} text={config.text} />
  }

  return (
    <div className="ai-tool-house">
      <div className="ai-tool-house-header">
        <div className="header-title">
          <RobotOutlined className="header-icon" />
          <Title level={2} style={{ color: '#262626', margin: 0 }}>AI工具屋</Title>
          <Tag color="gold" style={{ marginLeft: 8 }}>社区贡献</Tag>
        </div>
        <Paragraph type="secondary" style={{ margin: '8px 0 0 0' }}>
          发现社区贡献的优质AI工具，一键添加到果仁操作面板
        </Paragraph>
        
        {/* 第三方平台支持提示 */}
        <div style={{
          background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)',
          border: '1px solid #91d5ff',
          borderRadius: '8px',
          padding: '12px 16px',
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ fontSize: '20px' }}>🤖</div>
          <div style={{ flex: 1 }}>
            <Text strong style={{ color: '#1890ff' }}>支持第三方智能体平台</Text>
            <div style={{ marginTop: '4px', fontSize: '13px', color: '#666' }}>
              支持集成 <Tag size="small" color="blue">Coze</Tag> <Tag size="small" color="cyan">Dify</Tag> <Tag size="small" color="geekblue">智谱清言</Tag> <Tag size="small" color="purple">ChatGPT</Tag> 等平台开发的智能体工具
            </div>
          </div>
        </div>
      </div>

      <div className="ai-tool-house-filters">
        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="搜索AI工具名称、描述或标签"
              allowClear
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
            />
          </Col>
          <Col>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              size="large"
              style={{ width: 140 }}
            >
              {Object.entries(AI_TOOL_CATEGORY_LABELS).map(([key, config]) => (
                <Option key={key} value={key}>
                  <Space>
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              size="large"
              style={{ width: 120 }}
            >
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <div className="ai-tool-house-content">
        {/* 推荐工具区域 */}
        <div className="featured-tools">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <FireOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
            <Title level={3} style={{ margin: 0 }}>热门推荐</Title>
          </div>
          <Row gutter={[16, 16]}>
            {aiTools.filter(tool => tool.featured).map(tool => (
              <Col key={tool.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  className="ai-tool-card featured"
                  hoverable
                  onClick={() => showToolDetail(tool)}
                  cover={
                    <div className="tool-cover">
                      <div className="tool-icon" style={{ color: tool.color }}>
                        {tool.icon}
                      </div>
                      <div className="tool-badges">
                        {tool.platform && (
                          <Tag 
                            color="processing" 
                            size="small" 
                            style={{ 
                              background: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
                              borderColor: '#40a9ff',
                              color: '#096dd9'
                            }}
                          >
                            {tool.platform}
                          </Tag>
                        )}
                        {tool.featured && (
                          <Tag color="gold" size="small" icon={<CrownOutlined />}>
                            推荐
                          </Tag>
                        )}
                        {tool.status === AI_TOOL_STATUS.NEW && (
                          <Tag color="blue" size="small">
                            最新
                          </Tag>
                        )}
                      </div>
                      <div className="click-hint">
                        <EyeOutlined style={{ fontSize: 12, color: '#999' }} />
                      </div>
                    </div>
                  }
                  actions={[
                    <Tooltip title={favoriteTools.includes(tool.id) ? '取消收藏' : '收藏工具'}>
                      <Button
                        key="favorite"
                        type="text"
                        size="small"
                        icon={favoriteTools.includes(tool.id) ? <HeartFilled /> : <HeartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tool.id);
                        }}
                        style={{ color: favoriteTools.includes(tool.id) ? '#eb2f96' : undefined }}
                      />
                    </Tooltip>,
                    <Tooltip title="查看详情">
                      <Button
                        key="detail"
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          showToolDetail(tool);
                        }}
                      />
                    </Tooltip>
                  ]}
                >
                  <div className="tool-info">
                    <div className="tool-header">
                      <h4 className="tool-name">{tool.name}</h4>
                      {getStatusBadge(tool.status)}
                    </div>
                    <div className="tool-description">
                      {tool.description}
                    </div>
                    <div className="tool-meta">
                      <div className="tool-rating">
                        <Rate disabled defaultValue={tool.rating} style={{ fontSize: 12 }} />
                        <span className="rating-text">{tool.rating}</span>
                      </div>
                      <div className="tool-downloads">
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {tool.downloads.toLocaleString()} 下载
                        </Text>
                      </div>
                    </div>
                    <div className="tool-tags">
                      {tool.tags.slice(0, 3).map((tag, tagIndex) => {
                        // 为不同标签设置清新的颜色
                        const tagColors = ['#e6f7ff', '#f6ffed', '#fff2e8', '#f9f0ff', '#fff0f6'];
                        const tagBorderColors = ['#91d5ff', '#b7eb8f', '#ffc069', '#d3adf7', '#ffadd2'];
                        const tagTextColors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96'];
                        
                        const colorIndex = tagIndex % tagColors.length;
                        
                        return (
                          <Tag 
                            key={tag} 
                            size="small" 
                            style={{
                              background: tagColors[colorIndex],
                              borderColor: tagBorderColors[colorIndex],
                              color: tagTextColors[colorIndex],
                              opacity: 0.8
                            }}
                          >
                            {tag}
                          </Tag>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        {/* 全部工具区域 */}
        <div className="all-tools">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ThunderboltOutlined style={{ color: '#1890ff', marginRight: 8 }} />
              <Title level={3} style={{ margin: 0 }}>全部工具</Title>
              <Text type="secondary" style={{ marginLeft: 8 }}>({filteredTools.length})</Text>
            </div>
          </div>
          
          {filteredTools.length === 0 ? (
            <Empty
              description="没有找到匹配的AI工具"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: '40px 0' }}
            />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredTools.map(tool => (
                <Col key={tool.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    className="ai-tool-card"
                    hoverable
                    onClick={() => showToolDetail(tool)}
                    cover={
                      <div className="tool-cover">
                        <div className="tool-icon" style={{ color: tool.color }}>
                          {tool.icon}
                        </div>
                        <div className="tool-badges">
                          {tool.platform && (
                            <Tag 
                              color="processing" 
                              size="small" 
                              style={{ 
                                background: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
                                borderColor: '#40a9ff',
                                color: '#096dd9'
                              }}
                            >
                              {tool.platform}
                            </Tag>
                          )}
                          {tool.featured && (
                            <Tag color="gold" size="small" icon={<CrownOutlined />}>
                              推荐
                            </Tag>
                          )}
                          {tool.status === AI_TOOL_STATUS.NEW && (
                            <Tag color="blue" size="small">
                              最新
                            </Tag>
                          )}
                          {tool.status === AI_TOOL_STATUS.BETA && (
                            <Tag color="orange" size="small">
                              测试
                            </Tag>
                          )}
                        </div>
                        <div className="click-hint">
                          <EyeOutlined style={{ fontSize: 12, color: '#999' }} />
                        </div>
                      </div>
                    }
                    actions={[
                      <Tooltip title={favoriteTools.includes(tool.id) ? '取消收藏' : '收藏工具'}>
                        <Button
                          key="favorite"
                          type="text"
                          size="small"
                          icon={favoriteTools.includes(tool.id) ? <HeartFilled /> : <HeartOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          style={{ color: favoriteTools.includes(tool.id) ? '#eb2f96' : undefined }}
                        />
                      </Tooltip>,
                      <Tooltip title="查看详情">
                        <Button
                          key="detail"
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            showToolDetail(tool);
                          }}
                        />
                      </Tooltip>
                    ]}
                  >
                    <div className="tool-info">
                      <div className="tool-header">
                        <h4 className="tool-name">{tool.name}</h4>
                        {getStatusBadge(tool.status)}
                      </div>
                      <div className="tool-description">
                        {tool.description}
                      </div>
                      <div className="tool-meta">
                        <div className="tool-rating">
                          <Rate disabled defaultValue={tool.rating} style={{ fontSize: 12 }} />
                          <span className="rating-text">{tool.rating}</span>
                        </div>
                        <div className="tool-downloads">
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {tool.downloads.toLocaleString()} 下载
                          </Text>
                        </div>
                      </div>
                      <div className="tool-tags">
                        {tool.tags.slice(0, 3).map((tag, tagIndex) => {
                          // 为不同标签设置清新的颜色
                          const tagColors = ['#e6f7ff', '#f6ffed', '#fff2e8', '#f9f0ff', '#fff0f6'];
                          const tagBorderColors = ['#91d5ff', '#b7eb8f', '#ffc069', '#d3adf7', '#ffadd2'];
                          const tagTextColors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96'];
                          
                          const colorIndex = tagIndex % tagColors.length;
                          
                          return (
                            <Tag 
                              key={tag} 
                              size="small" 
                              style={{
                                background: tagColors[colorIndex],
                                borderColor: tagBorderColors[colorIndex],
                                color: tagTextColors[colorIndex],
                                opacity: 0.8
                              }}
                            >
                              {tag}
                            </Tag>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>

      {/* 工具详情弹窗 */}
      <Modal
        title={(
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24, color: selectedTool?.color }}>
              {selectedTool?.icon}
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>{selectedTool?.name}</Title>
              <Text type="secondary">by {selectedTool?.author} · 工具详情</Text>
            </div>
          </div>
        )}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedTool && (
          <div className="tool-detail">
            <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="版本">{selectedTool.version}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusBadge(selectedTool.status)}</Descriptions.Item>
              {selectedTool.platform && (
                <Descriptions.Item label="平台">
                  <Tag 
                    color="processing" 
                    style={{ 
                      background: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
                      borderColor: '#40a9ff',
                      color: '#096dd9'
                    }}
                  >
                    {selectedTool.platform}
                  </Tag>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="评分">
                <Rate disabled defaultValue={selectedTool.rating} style={{ fontSize: 14 }} />
                <span style={{ marginLeft: 8 }}>{selectedTool.rating}</span>
              </Descriptions.Item>
              <Descriptions.Item label="下载量">
                {selectedTool.downloads.toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>工具描述</Title>
              <Paragraph>{selectedTool.description}</Paragraph>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>主要功能</Title>
              <ul>
                {selectedTool.features?.map((feature, index) => (
                  <li key={index} style={{ marginBottom: 4 }}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>使用方法</Title>
              <Paragraph>{selectedTool.usage}</Paragraph>
            </div>
            
            <div>
              <Title level={5}>标签</Title>
              <div>
                {selectedTool.tags?.map((tag, tagIndex) => {
                  // 为不同标签设置清新的颜色
                  const tagColors = ['#e6f7ff', '#f6ffed', '#fff2e8', '#f9f0ff', '#fff0f6'];
                  const tagBorderColors = ['#91d5ff', '#b7eb8f', '#ffc069', '#d3adf7', '#ffadd2'];
                  const tagTextColors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96'];
                  
                  const colorIndex = tagIndex % tagColors.length;
                  
                  return (
                    <Tag 
                      key={tag} 
                      style={{
                        background: tagColors[colorIndex],
                        borderColor: tagBorderColors[colorIndex],
                        color: tagTextColors[colorIndex],
                        opacity: 0.8,
                        marginBottom: '4px'
                      }}
                    >
                      {tag}
                    </Tag>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AIToolHouse