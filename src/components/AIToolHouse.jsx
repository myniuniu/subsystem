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
import { EditOutlined } from '@ant-design/icons'
import { AI_TOOL_CATEGORIES, AI_TOOL_CATEGORY_LABELS, AI_TOOL_STATUS } from '../constants/noteEditConstants'
import './AIToolHouse.css'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const AIToolHouse = ({ onAddToOperationPanel, noteCategory = null }) => {
  // 输入类型与输出类型：统一枚举与标签
  const INPUT_TYPE_LABELS = {
    knowledge_graph: '知识图谱',
    capability_model: '能力模型',
    micro_major: '微专业',
    training_project: '培训项目',
    training_product: '培训产品',
    course_video: '课程视频',
    cloud_drive: '云盘',
    exam_practice: '考试/练习',
    live_course: '直播课',
    knowledge_market: '知识广场',
    link: '链接',
    pasted_text: '粘贴文字'
  }

  const DEFAULT_INPUT_TYPES_BY_CATEGORY = {
    [AI_TOOL_CATEGORIES.TEACHING]: ['cloud_drive', 'course_video', 'link', 'pasted_text'],
    [AI_TOOL_CATEGORIES.ANALYSIS]: ['cloud_drive', 'link'],
    [AI_TOOL_CATEGORIES.WRITING]: ['cloud_drive', 'link', 'pasted_text'],
    [AI_TOOL_CATEGORIES.CREATIVE]: ['cloud_drive', 'link', 'pasted_text'],
    [AI_TOOL_CATEGORIES.PRODUCTIVITY]: ['cloud_drive', 'link']
  }

  const DEFAULT_OUTPUT_TYPES_BY_CATEGORY = {
    [AI_TOOL_CATEGORIES.TEACHING]: ['文档', '模版'],
    [AI_TOOL_CATEGORIES.ANALYSIS]: ['文档'],
    [AI_TOOL_CATEGORIES.WRITING]: ['文档'],
    [AI_TOOL_CATEGORIES.CREATIVE]: ['文档', '白板'],
    [AI_TOOL_CATEGORIES.PRODUCTIVITY]: ['文档']
  }

  const resolveInputTypes = (tool) => {
    const arr = tool.supportedInputTypes || DEFAULT_INPUT_TYPES_BY_CATEGORY[tool.category] || []
    return Array.isArray(arr) ? arr : []
  }

  const resolveOutputTypes = (tool) => {
    const arr = tool.outputTypes || DEFAULT_OUTPUT_TYPES_BY_CATEGORY[tool.category] || []
    return Array.isArray(arr) ? arr : []
  }
  // 覆盖与编辑：本地配置（localStorage）+ 编辑态
  const getOverrides = () => {
    try { return JSON.parse(localStorage.getItem('aitool_overrides') || '{}') } catch { return {} }
  }
  const applyToolOverrides = (tool) => {
    const o = getOverrides()[tool.id] || {}
    return { ...tool, ...o }
  }
  const INPUT_TYPE_OPTIONS = Object.entries(INPUT_TYPE_LABELS).map(([value, label]) => ({ value, label }))
  const OUTPUT_TYPE_OPTIONS = ['文档','白板','模版'].map(v => ({ value: v, label: v }))
  const [isEditMode, setIsEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', description: '', usage: '', supportedInputTypes: [], outputTypes: [] })
  const openEditForTool = (tool) => {
    const t = applyToolOverrides(tool)
    setSelectedTool(t)
    setEditForm({
      name: t.name || '',
      description: t.description || '',
      usage: t.usage || '',
      supportedInputTypes: resolveInputTypes(t),
      outputTypes: resolveOutputTypes(t)
    })
    setIsEditMode(true)
    setDetailModalVisible(true)
  }
  const saveToolEdits = () => {
    if (!selectedTool) return
    const overrides = getOverrides()
    overrides[selectedTool.id] = {
      name: editForm.name,
      description: editForm.description,
      usage: editForm.usage,
      supportedInputTypes: editForm.supportedInputTypes,
      outputTypes: editForm.outputTypes
    }
    localStorage.setItem('aitool_overrides', JSON.stringify(overrides))
    message.success('工具属性已保存')
    setIsEditMode(false)
  }
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
      applicableNoteCategories: ['organizational_training', 'learning_square', 'homework_system'],
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
    // 教研室分类新增工具
    {
      id: 'verbatim-transcript',
      name: '逐字稿工具',
      description: '将音视频内容转写为逐字稿，支持段落结构与说话人标注',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教研室工具组',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 3200,
      tags: ['转写', '逐字稿', '音视频'],
      icon: '稿',
      color: '#2f54eb',
      featured: true,
      applicableNoteCategories: ['teaching_research_office'],
      menuConfig: {
        key: 'verbatim-transcript',
        title: '逐字稿工具',
        icon: '稿',
        gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
        color: '#2f54eb'
      },
      features: ['音视频自动转写', '说话人识别', '段落分段', '时间轴标注'],
      usage: '上传音频或视频文件，系统自动生成逐字稿并支持导出'
    },
    {
      id: 'large-unit-design',
      name: '大单元设计',
      description: '支持基于核心素养的大单元教学设计与目标任务分解',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教研室工具组',
      version: 'v1.0.0',
      rating: 4.8,
      downloads: 4100,
      tags: ['大单元', '教学设计', '核心素养'],
      icon: '单',
      color: '#0958d9',
      featured: true,
      applicableNoteCategories: ['teaching_research_office'],
      menuConfig: {
        key: 'large-unit-design',
        title: '大单元设计',
        icon: '单',
        gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
        color: '#0958d9'
      },
      features: ['学习目标设计', '任务群拆解', '评价标准建议'],
      usage: '输入学科主题与学段，生成大单元整体教学设计方案'
    },
    {
      id: 'interdisciplinary-design',
      name: '跨学科设计',
      description: '围绕真实情境与综合任务进行跨学科项目化学习设计',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教研室工具组',
      version: 'v1.0.0',
      rating: 4.8,
      downloads: 3860,
      tags: ['跨学科', '项目化学习', '综合素养'],
      icon: '跨',
      color: '#13c2c2',
      featured: true,
      applicableNoteCategories: ['teaching_research_office'],
      menuConfig: {
        key: 'interdisciplinary-design',
        title: '跨学科设计',
        icon: '跨',
        gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
        color: '#13c2c2'
      },
      features: ['主题情境设计', '多学科融合', '评价维度建议'],
      usage: '选择跨学科主题，系统生成项目化学习方案与活动安排'
    },
    {
      id: 'unit-assignment-design',
      name: '单元作业设计',
      description: '依据学习目标与内容设计分层作业与任务单',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教研室工具组',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 2950,
      tags: ['作业设计', '分层任务', '学习评价'],
      icon: '作',
      color: '#fa8c16',
      featured: true,
      applicableNoteCategories: ['teaching_research_office', 'homework_system'],
      menuConfig: {
        key: 'unit-assignment-design',
        title: '单元作业设计',
        icon: '作',
        gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
        color: '#fa8c16'
      },
      features: ['作业类型建议', '分层与个性化', '评分与反馈模板'],
      usage: '输入单元主题与学生差异，生成分层作业与评价建议'
    },
    // 作业中心（课后作业）
    {
      id: 'homework-center',
      name: '作业中心',
      description: '统一管理作业设计、布置、批改与分析的中心工具',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.8,
      downloads: 12580,
      tags: ['作业', '布置', '批改', '分析', '课后作业'],
      icon: '📘',
      color: '#1890ff',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: {
        key: 'homework-center',
        title: '作业中心',
        icon: '📘',
        gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
        color: '#1890ff'
      },
      features: ['作业设计与模板', '一键布置与收集', '智能批改与评语', '成绩统计与学情分析'],
      usage: '选择班级与作业类型，快速完成从设计到批改的完整流程'
    },
    // 作业系统 · 扩展工具
    {
      id: 'knowledge-point-question-generator',
      name: '知识点出题',
      description: '根据知识点生成分层题目与解析',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 3580,
      tags: ['出题', '知识点', '分层训练'],
      icon: '知',
      color: '#722ed1',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'knowledge-point-question-generator', title: '知识点出题', icon: '知', gradient: 'linear-gradient(135deg, #f0e6ff 0%, #e6d7ff 100%)', color: '#722ed1' },
      features: ['知识点识别', '难度分层', '答案解析生成'],
      usage: '选择知识点与难度层级，自动生成配套题目与解析'
    },
    {
      id: 'chapter-question-generator',
      name: '章节出题',
      description: '围绕教材章节自动生成练习题',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 3420,
      tags: ['出题', '章节', '练习'],
      icon: '章',
      color: '#1890ff',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'chapter-question-generator', title: '章节出题', icon: '章', gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', color: '#1890ff' },
      features: ['章节要点抽取', '题型覆盖', '分层训练'],
      usage: '选择章节与目标，系统生成配套练习题及答案'
    },
    {
      id: 'unit-question-generator',
      name: '单元出题',
      description: '基于单元目标生成全面练习',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 3280,
      tags: ['出题', '单元', '试卷'],
      icon: '单',
      color: '#fa8c16',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'unit-question-generator', title: '单元出题', icon: '单', gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)', color: '#fa8c16' },
      features: ['目标任务分解', '题型分配', '试卷生成'],
      usage: '设置单元目标与难度，生成覆盖全面的练习与试卷'
    },
    {
      id: 'question-set-generator',
      name: '题组出题',
      description: '按题组结构生成梯度训练题',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 3150,
      tags: ['题组', '出题', '分层'],
      icon: '组',
      color: '#eb2f96',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'question-set-generator', title: '题组出题', icon: '组', gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)', color: '#eb2f96' },
      features: ['能力维度映射', '梯度训练设计', '针对性巩固'],
      usage: '选择能力维度与梯度层级，生成题组训练方案'
    },
    {
      id: 'logic-question-generator',
      name: '逻辑出题',
      description: '强调推理能力的题目生成',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 3020,
      tags: ['逻辑', '推理', '出题'],
      icon: '逻',
      color: '#52c41a',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'logic-question-generator', title: '逻辑出题', icon: '逻', gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)', color: '#52c41a' },
      features: ['逻辑链构建', '多步推理', '过程性评价'],
      usage: '输入主题与逻辑要求，生成强调推理步骤的题目集合'
    },
    {
      id: 'multiple-choice-generator',
      name: '选择题出题',
      description: '批量生成高质量选择题并附解析',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 3890,
      tags: ['选择题', '客观题', '解析'],
      icon: '选',
      color: '#13c2c2',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'multiple-choice-generator', title: '选择题出题', icon: '选', gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)', color: '#13c2c2' },
      features: ['题干生成', '干扰项优化', '解析与知识点标注'],
      usage: '设定知识点与难度，批量生成选择题并附详细解析'
    },
    {
      id: 'image-question-generator',
      name: '图像题出题',
      description: '基于图片与图形信息自动生成题目',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.5,
      downloads: 2680,
      tags: ['图像', '题目生成', '视觉理解'],
      icon: '图',
      color: '#531dab',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'image-question-generator', title: '图像题出题', icon: '图', gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)', color: '#531dab' },
      features: ['图片识别', '情境构建', '答案生成'],
      usage: '上传或选择图片，系统生成理解与应用类题目'
    },
    {
      id: 'smart-question-bank-manager',
      name: '智能题库管理',
      description: '支持标签、难度评估与检索的题库管理',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 4980,
      tags: ['题库', '标签', '检索'],
      icon: '库',
      color: '#0958d9',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'smart-question-bank-manager', title: '智能题库管理', icon: '库', gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', color: '#0958d9' },
      features: ['标签管理', '难度评估', '题库检索', '去重合并'],
      usage: '管理与检索题目资源，支持标签与难度维度筛选'
    },
    {
      id: 'primary-chinese-essay-grader',
      name: '小学语文作文批改',
      description: '面向小学语文作文的智能批改与评语',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '作文批改团队',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 6120,
      tags: ['作文批改', '语文', '小学'],
      icon: '语',
      color: '#fa541c',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'primary-chinese-essay-grader', title: '小学语文作文批改', icon: '语', gradient: 'linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%)', color: '#fa541c' },
      features: ['结构与语言评价', '重点句优化建议', '评语生成'],
      usage: '提交作文文本，系统进行多维度评价并生成针对性评语'
    },
    {
      id: 'primary-english-essay-grader',
      name: '小学英文作文批改',
      description: '面向小学英文作文的智能批改',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '作文批改团队',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 5280,
      tags: ['作文批改', '英文', '小学'],
      icon: '英',
      color: '#13c2c2',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'primary-english-essay-grader', title: '小学英文作文批改', icon: '英', gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)', color: '#13c2c2' },
      features: ['语法检查', '词汇与表达建议', '评语生成'],
      usage: '提交英文作文文本，系统进行语法与表达评价并生成评语'
    },
    {
      id: 'junior-chinese-essay-grader',
      name: '初中语文作文批改',
      description: '面向初中语文作文的智能批改',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '作文批改团队',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 4890,
      tags: ['作文批改', '语文', '初中'],
      icon: '语',
      color: '#faad14',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'junior-chinese-essay-grader', title: '初中语文作文批改', icon: '语', gradient: 'linear-gradient(135deg, #fffbe6 0%, #ffe58f 100%)', color: '#faad14' },
      features: ['主题契合度分析', '结构与语言评价', '评语生成'],
      usage: '提交作文文本，系统生成评价与修改建议'
    },
    {
      id: 'junior-english-essay-grader',
      name: '初中英文作文批改',
      description: '面向初中英文作文的智能批改',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '作文批改团队',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 4650,
      tags: ['作文批改', '英文', '初中'],
      icon: '英',
      color: '#1890ff',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'junior-english-essay-grader', title: '初中英文作文批改', icon: '英', gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', color: '#1890ff' },
      features: ['语法与结构评价', '表达与逻辑建议', '评语生成'],
      usage: '提交英文作文文本，系统进行评价并生成修改建议'
    },
    {
      id: 'senior-chinese-essay-grader',
      name: '高中语文作文批改',
      description: '面向高中语文作文的智能批改',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '作文批改团队',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 5380,
      tags: ['作文批改', '语文', '高中'],
      icon: '语',
      color: '#722ed1',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'senior-chinese-essay-grader', title: '高中语文作文批改', icon: '语', gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)', color: '#722ed1' },
      features: ['论证结构分析', '语言风格建议', '评语生成'],
      usage: '提交作文文本，系统从论证与表达维度进行评价'
    },
    {
      id: 'senior-english-essay-grader',
      name: '高中英文作文批改',
      description: '面向高中英文作文的智能批改',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '作文批改团队',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 5120,
      tags: ['作文批改', '英文', '高中'],
      icon: '英',
      color: '#52c41a',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'senior-english-essay-grader', title: '高中英文作文批改', icon: '英', gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)', color: '#52c41a' },
      features: ['学术表达建议', '逻辑结构评价', '评语生成'],
      usage: '提交英文作文文本，系统生成学术化表达建议与评价'
    },
    {
      id: 'chinese-dictation-correction',
      name: '语文默写改错',
      description: '识别默写错误并生成巩固练习',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 4580,
      tags: ['默写', '改错', '巩固'],
      icon: '默',
      color: '#fa541c',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'chinese-dictation-correction', title: '语文默写改错', icon: '默', gradient: 'linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%)', color: '#fa541c' },
      features: ['错误识别', '纠错建议', '巩固练习生成'],
      usage: '上传或输入默写内容，系统识别错误并生成纠错练习'
    },
    {
      id: 'english-dictation-correction',
      name: '英语默写改错',
      description: '识别英文拼写与语法错误并生成纠错练习',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 4390,
      tags: ['默写', '英文', '改错'],
      icon: '默',
      color: '#13c2c2',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'english-dictation-correction', title: '英语默写改错', icon: '默', gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)', color: '#13c2c2' },
      features: ['拼写错误识别', '语法纠错', '词汇巩固练习'],
      usage: '输入英文默写内容，系统识别错误并生成针对性练习'
    },
    {
      id: 'custom-unit-homework-design',
      name: '自定义单元作业',
      description: '自由组合题型与任务生成个性化作业包',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 4250,
      tags: ['作业设计', '个性化', '任务单'],
      icon: '自',
      color: '#1d4ed8',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'custom-unit-homework-design', title: '自定义单元作业', icon: '自', gradient: 'linear-gradient(135deg, #e6f7ff 0%, #d6e4ff 100%)', color: '#1d4ed8' },
      features: ['作业模板库', '组件化组合', '评价标准生成'],
      usage: '从模板库选择并组合任务，生成个性化单元作业包'
    },
    {
      id: 'recompose-unit-assignment-design',
      name: '重组单元作业设计',
      description: '基于既有作业与题库快速重组新作业包',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '智能教育团队',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 3920,
      tags: ['作业重组', '题库', '快速生成'],
      icon: '重',
      color: '#fa8c16',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'recompose-unit-assignment-design', title: '重组单元作业设计', icon: '重', gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)', color: '#fa8c16' },
      features: ['作业重组', '重复题去重', '结构优化'],
      usage: '选择已有作业或题库，系统自动重组为新的作业包'
    },
    {
      id: 'graphic-homework-design',
      name: '图形设计',
      description: '作业版式与图形元素设计生成',
      category: AI_TOOL_CATEGORIES.CREATIVE,
      status: AI_TOOL_STATUS.NEW,
      author: '创意工作室',
      version: 'v1.0.0',
      rating: 4.5,
      downloads: 2860,
      tags: ['版式设计', '图形元素', '海报'],
      icon: '图',
      color: '#531dab',
      featured: true,
      applicableNoteCategories: ['homework_system'],
      menuConfig: { key: 'graphic-homework-design', title: '图形设计', icon: '图', gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)', color: '#531dab' },
      features: ['作业版式模板', '题目配图生成', '页眉页脚设计'],
      usage: '选择模板或描述需求，生成规范美观的作业版式与图形'
    },
    {
      id: 'large-unit-academic-case',
      name: '大单元学历案',
      description: '生成结构化的学历案，包括环节目标、活动任务与评价要点',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教研室工具组',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 2600,
      tags: ['学历案', '教学活动', '目标评价'],
      icon: '案',
      color: '#722ed1',
      featured: true,
      applicableNoteCategories: ['teaching_research_office'],
      menuConfig: {
        key: 'large-unit-academic-case',
        title: '大单元学历案',
        icon: '案',
        gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
        color: '#722ed1'
      },
      features: ['学习任务链路', '环节目标与评价', '资源与工具建议'],
      usage: '选择单元主题与年级，生成完整的学历案结构'
    },
    // 教学设计分类扩展工具（如图）
    {
      id: 'open-class-design',
      name: '公开课设计',
      description: '生成公开课流程、教案与课件要点，支持评课要素',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教学设计组',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 3100,
      tags: ['公开课', '教案', '评课'],
      icon: '公',
      color: '#1890ff',
      featured: true,
      applicableNoteCategories: ['teaching_design'],
      menuConfig: { key: 'open-class-design', title: '公开课设计', icon: '公', gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', color: '#1890ff' },
      features: ['公开课流程', '教案生成', '评课要点'],
      usage: '输入学科与主题，生成公开课方案与教案结构'
    },
    {
      id: 'guided-learning-plan',
      name: '导学案',
      description: '按照学习目标与任务链生成导学案，支持分层与自评',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教学设计组',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 2980,
      tags: ['导学案', '学习任务', '分层'],
      icon: '导',
      color: '#fa8c16',
      featured: true,
      applicableNoteCategories: ['teaching_design'],
      menuConfig: { key: 'guided-learning-plan', title: '导学案', icon: '导', gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)', color: '#fa8c16' },
      features: ['学习任务分解', '分层提示', '学习单生成'],
      usage: '输入单元目标与内容，生成导学案与任务单'
    },
    {
      id: 'lesson-presentation',
      name: '说课稿',
      description: '生成说课稿结构与关键阐述，支持教学目标与方法说明',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教学设计组',
      version: 'v1.0.0',
      rating: 4.5,
      downloads: 2540,
      tags: ['说课', '教案', '教学方法'],
      icon: '说',
      color: '#13c2c2',
      featured: true,
      applicableNoteCategories: ['teaching_design'],
      menuConfig: { key: 'lesson-presentation', title: '说课稿', icon: '说', gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)', color: '#13c2c2' },
      features: ['说课结构', '重难点阐述', '课堂流程'],
      usage: '选择内容主题，生成完整的说课稿提纲'
    },
    {
      id: 'evaluation-rubric',
      name: '评价量规',
      description: '根据目标维度生成可量化评价量规，支持等级描述与示例',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教学评价组',
      version: 'v1.0.0',
      rating: 4.7,
      downloads: 3350,
      tags: ['评价量规', '标准', '等级'],
      icon: '评',
      color: '#531dab',
      featured: true,
      applicableNoteCategories: ['teaching_design'],
      menuConfig: { key: 'evaluation-rubric', title: '评价量规', icon: '评', gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)', color: '#531dab' },
      features: ['维度定义', '等级描述', '示例条目'],
      usage: '输入学习目标与活动，生成评价量规表'
    },
    {
      id: 'unit-academic-case',
      name: '单元学历案',
      description: '面向单元的学历案结构生成，包含环节目标与任务设计',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教学设计组',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 2805,
      tags: ['学历案', '单元', '任务链'],
      icon: '单',
      color: '#0958d9',
      featured: true,
      applicableNoteCategories: ['teaching_design', 'classroom_integration'],
      menuConfig: { key: 'unit-academic-case', title: '单元学历案', icon: '单', gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', color: '#0958d9' },
      features: ['环节目标', '活动任务', '评价要点'],
      usage: '输入单元主题，生成结构化学历案'
    },
    {
      id: 'ai-picture-book',
      name: 'AI绘本',
      description: '基于文本与图片提示生成教学绘本，支持分镜与旁白',
      category: AI_TOOL_CATEGORIES.CREATIVE,
      status: AI_TOOL_STATUS.NEW,
      author: '创意工作室',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 4200,
      tags: ['绘本', '分镜', '旁白'],
      icon: '📖',
      color: '#fa8c16',
      featured: true,
      applicableNoteCategories: ['teaching_design', 'classroom_integration'],
      menuConfig: { key: 'ai-picture-book', title: 'AI绘本', icon: '📖', gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)', color: '#fa8c16' },
      features: ['分镜生成', '配图', '旁白脚本'],
      usage: '输入主题与故事梗概，生成教学绘本'
    },
    {
      id: 'cloud-word-cards',
      name: '云朵字卡',
      description: '快速生成云朵风格字卡，支持词语例句与练习任务',
      category: AI_TOOL_CATEGORIES.CREATIVE,
      status: AI_TOOL_STATUS.NEW,
      author: '创意工作室',
      version: 'v1.0.0',
      rating: 4.4,
      downloads: 2100,
      tags: ['字卡', '词语', '练习'],
      icon: '☁️',
      color: '#40a9ff',
      featured: true,
      applicableNoteCategories: ['teaching_design', 'classroom_integration'],
      menuConfig: { key: 'cloud-word-cards', title: '云朵字卡', icon: '☁️', gradient: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)', color: '#40a9ff' },
      features: ['字卡生成', '例句', '练习题'],
      usage: '输入词语列表，生成字卡并附带练习'
    },
    {
      id: 'sticker-materials',
      name: '贴纸素材',
      description: '生成课堂贴纸与图标素材，用于教具或白板',
      category: AI_TOOL_CATEGORIES.CREATIVE,
      status: AI_TOOL_STATUS.NEW,
      author: '创意工作室',
      version: 'v1.0.0',
      rating: 4.3,
      downloads: 1850,
      tags: ['贴纸', '素材', '白板'],
      icon: '🎯',
      color: '#722ed1',
      featured: true,
      applicableNoteCategories: ['teaching_design', 'classroom_integration'],
      menuConfig: { key: 'sticker-materials', title: '贴纸素材', icon: '🎯', gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)', color: '#722ed1' },
      features: ['图标库', '贴纸生成', '下载导出'],
      usage: '选择风格与主题，生成课堂贴纸素材'
    },
    {
      id: 'digital-human-speech',
      name: '数字人说话',
      description: '将文本转为数字人朗读视频，支持角色与语速选择',
      category: AI_TOOL_CATEGORIES.MEDIA,
      status: AI_TOOL_STATUS.NEW,
      author: '媒体实验室',
      version: 'v1.0.0',
      rating: 4.5,
      downloads: 3620,
      tags: ['数字人', '语音合成', '讲解'],
      icon: '🧑‍🎤',
      color: '#fa8c16',
      featured: true,
      applicableNoteCategories: ['teaching_design', 'classroom_integration'],
      menuConfig: { key: 'digital-human-speech', title: '数字人说话', icon: '🧑‍🎤', gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)', color: '#fa8c16' },
      features: ['角色选择', '语速控制', '字幕生成'],
      usage: '输入讲解文本，生成数字人讲解视频'
    },
    {
      id: 'comic-strip',
      name: '连环画',
      description: '生成教学连环画分镜与画面，支持台词与镜头',
      category: AI_TOOL_CATEGORIES.CREATIVE,
      status: AI_TOOL_STATUS.NEW,
      author: '创意工作室',
      version: 'v1.0.0',
      rating: 4.4,
      downloads: 2400,
      tags: ['连环画', '分镜', '台词'],
      icon: '🎞️',
      color: '#13c2c2',
      featured: true,
      applicableNoteCategories: ['teaching_design', 'classroom_integration'],
      menuConfig: { key: 'comic-strip', title: '连环画', icon: '🎞️', gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)', color: '#13c2c2' },
      features: ['分镜脚本', '画面生成', '台词自动化'],
      usage: '输入主题故事，生成连环画分镜与画面'
    },
    {
      id: 'quick-designer',
      name: '快速设计师',
      description: '快速生成教学活动与素材方案，适合备课速成',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教学设计组',
      version: 'v1.0.0',
      rating: 4.5,
      downloads: 3700,
      tags: ['快速', '活动设计', '素材建议'],
      icon: '速',
      color: '#1890ff',
      featured: true,
      applicableNoteCategories: ['teaching_design', 'classroom_integration'],
      menuConfig: { key: 'quick-designer', title: '快速设计师', icon: '速', gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', color: '#1890ff' },
      features: ['活动模板', '素材清单', '时间规划'],
      usage: '选择场景，生成可执行的活动与素材方案'
    },
    {
      id: 'children-simple-drawings',
      name: '儿童简笔画',
      description: '生成儿童风格简笔画教程图片与步骤说明',
      category: AI_TOOL_CATEGORIES.CREATIVE,
      status: AI_TOOL_STATUS.NEW,
      author: '创意工作室',
      version: 'v1.0.0',
      rating: 4.3,
      downloads: 1980,
      tags: ['简笔画', '儿童', '教程'],
      icon: '🖍️',
      color: '#40a9ff',
      featured: true,
      applicableNoteCategories: ['teaching_design', 'classroom_integration'],
      menuConfig: { key: 'children-simple-drawings', title: '儿童简笔画', icon: '🖍️', gradient: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)', color: '#40a9ff' },
      features: ['步骤图', '练习稿', '素材包'],
      usage: '输入主题或对象，生成简笔画教程'
    },
    {
      id: 'ai-video',
      name: 'AI视频',
      description: '根据脚本与素材生成课堂视频，支持字幕与配音',
      category: AI_TOOL_CATEGORIES.MEDIA,
      status: AI_TOOL_STATUS.NEW,
      author: '媒体实验室',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 4500,
      tags: ['视频', '字幕', '配音'],
      icon: '🎬',
      color: '#fa8c16',
      featured: true,
      applicableNoteCategories: ['teaching_design', 'classroom_integration'],
      menuConfig: { key: 'ai-video', title: 'AI视频', icon: '🎬', gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)', color: '#fa8c16' },
      features: ['脚本到视频', '字幕自动', '配音合成'],
      usage: '输入讲解脚本与素材，生成课堂视频'
    },
    {
      id: 'ppt-courseware',
      name: 'PPT课件',
      description: '根据课程结构自动生成PPT课件大纲与页面',
      category: AI_TOOL_CATEGORIES.TEACHING,
      status: AI_TOOL_STATUS.NEW,
      author: '教学设计组',
      version: 'v1.0.0',
      rating: 4.5,
      downloads: 4020,
      tags: ['PPT', '课件', '大纲'],
      icon: '📊',
      color: '#fa8c16',
      featured: true,
      applicableNoteCategories: ['teaching_design', 'classroom_integration'],
      menuConfig: { key: 'ppt-courseware', title: 'PPT课件', icon: '📊', gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)', color: '#fa8c16' },
      features: ['课件大纲', '页面生成', '图片建议'],
      usage: '输入课程目标与结构，生成PPT课件'
    },
    {
      id: 'audio-video-text-converter',
      name: '音视频文本互转',
      description: '支持音视频转文本与文本生成语音，适配课堂素材',
      category: AI_TOOL_CATEGORIES.MEDIA,
      status: AI_TOOL_STATUS.NEW,
      author: '媒体实验室',
      version: 'v1.0.0',
      rating: 4.6,
      downloads: 3880,
      tags: ['转写', '合成', '音视频'],
      icon: '🔄',
      color: '#13c2c2',
      featured: true,
      applicableNoteCategories: ['teaching_design', 'classroom_integration'],
      menuConfig: { key: 'audio-video-text-converter', title: '音视频文本互转', icon: '🔄', gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)', color: '#13c2c2' },
      features: ['音视频转写', '文本转语音', '字幕导出'],
      usage: '上传音频/视频或输入文本，进行互转处理'
    },
    {
      id: 'teacher-research-project',
      name: '教师课题研究',
      description: '提供课题选题、研究设计、数据分析与报告撰写辅助',
      category: AI_TOOL_CATEGORIES.RESEARCH,
      status: AI_TOOL_STATUS.NEW,
      author: '教研室工具组',
      version: 'v1.0.0',
      rating: 4.8,
      downloads: 3320,
      tags: ['课题研究', '研究方法', '报告撰写'],
      icon: '研',
      color: '#f5222d',
      featured: true,
      applicableNoteCategories: ['teaching_research_office'],
      menuConfig: {
        key: 'teacher-research-project',
        title: '教师课题研究',
        icon: '研',
        gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
        color: '#f5222d'
      },
      features: ['选题方向建议', '研究设计模板', '数据分析指导', '报告结构生成'],
      usage: '输入研究主题与目标，生成研究方案、数据分析流程与报告框架'
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
    },
    {
      id: 'training-dashboard',
      name: '培训报表',
      description: '智能培训数据报表工具，提供培训数据的可视化分析和统计报表功能',
      category: AI_TOOL_CATEGORIES.ANALYSIS,
      status: AI_TOOL_STATUS.ACTIVE,
      author: '培训管理团队',
      version: 'v1.2.0',
      rating: 4.8,
      downloads: 3650,
      tags: ['培训报表', '数据可视化', '统计分析', '报表生成'],
      icon: '报',
      color: '#0369a1',
      featured: true,
      applicableNoteCategories: ['training_needs_management'],
      menuConfig: {
        key: 'training-dashboard',
        title: '培训报表',
        icon: '报',
        gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        color: '#0369a1'
      },
      features: [
        '培训数据统计分析',
        '可视化图表生成',
        '多维度数据展示',
        '培训效果对比',
        '报表自动生成',
        '数据导出功能'
      ],
      usage: '基于培训数据生成各类统计报表和可视化图表，帮助管理者全面了解培训情况和效果'
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
    
    // 特殊处理：培训产品研发分类下默认显示课程研发工具和视频切片工具
    if (category === 'training_product_development') {
      const filtered = tools.filter(tool => ['course-development', 'video-slice'].includes(tool.id));
      console.log('getFilteredToolsByNoteCategory - 培训产品研发分类，过滤后的工具:', filtered);
      return filtered;
    }
    
    // 特殊处理：培训需求与管理分类下显示特定的工具
    if (category === 'training_needs_management') {
      const filtered = tools.filter(tool => 
        ['training-plan', 'schedule', 'training-report', 'training-dashboard'].includes(tool.id)
      );
      console.log('getFilteredToolsByNoteCategory - 培训需求与管理分类，过滤后的工具:', filtered);
      return filtered;
    }

    // 特殊处理：教研室分类仅显示新增的六个工具
    if (category === 'teaching_research_office') {
      const ids = [
        'verbatim-transcript',
        'large-unit-design',
        'interdisciplinary-design',
        'unit-assignment-design',
        'large-unit-academic-case',
        'teacher-research-project'
      ];
      const filtered = tools.filter(tool => ids.includes(tool.id));
      console.log('getFilteredToolsByNoteCategory - 教研室分类，过滤后的工具:', filtered);
      return filtered;
    }

    // 特殊处理：教学设计分类仅显示教学设计相关工具（扩展至更多工具）
    if (category === 'teaching_design') {
      const ids = [
        'teaching-assistant',
        'verbatim-transcript',
        'large-unit-design',
        'interdisciplinary-design',
        'unit-assignment-design',
        'open-class-design',
        'guided-learning-plan',
        'lesson-presentation',
        'evaluation-rubric',
        'unit-academic-case',
        'ai-picture-book',
        'cloud-word-cards',
        'sticker-materials',
        'digital-human-speech',
        'comic-strip',
        'quick-designer',
        'children-simple-drawings',
        'ai-video',
        'audio-video-text-converter',
        'ppt-courseware'
      ];
      const filtered = tools.filter(tool => ids.includes(tool.id));
      console.log('getFilteredToolsByNoteCategory - 教学设计分类，过滤后的工具:', filtered);
      return filtered;
    }

    // 特殊处理：课堂融合分类仅显示课堂融合相关工具
    if (category === 'classroom_integration') {
      const ids = [
        'ai-picture-book',
        'cloud-word-cards',
        'sticker-materials',
        'digital-human-speech',
        'comic-strip',
        'quick-designer',
        'children-simple-drawings',
        'ai-video',
        'ppt-courseware',
        'audio-video-text-converter'
      ];
      const filtered = tools.filter(tool => ids.includes(tool.id));
      console.log('getFilteredToolsByNoteCategory - 课堂融合分类，过滤后的工具:', filtered);
      return filtered;
    }
    
// 特殊处理：课后作业分类显示作业相关工具
    if (category === 'homework_system') {
      const ids = [
        'homework-center',
        'grading-assistant',
        'unit-assignment-design'
      ];
      const filtered = tools.filter(tool => ids.includes(tool.id) || tool.applicableNoteCategories?.includes('homework_system'));
      console.log('getFilteredToolsByNoteCategory - 作业系统分类，过滤后的工具:', filtered);
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Title level={3} style={{ color: 'var(--theme-textPrimary)', margin: 0 }}>AI工具屋</Title>
          </div>
          <div className="header-search" style={{ flexShrink: 0 }}>
            <Input
              placeholder="搜索AI工具名称、描述或标签"
              allowClear
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="middle"
              style={{ width: 360 }}
            />
          </div>
        </div>
      </div>

      {/* 过滤控件已移除 */}

      <div className="ai-tool-house-content">
        {/* 推荐工具区域 */}
        <div className="featured-tools" style={{ display: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <FireOutlined style={{ color: 'var(--theme-primary)', marginRight: 8 }} />
            <Title level={3} style={{ margin: 0 }}>热门推荐</Title>
          </div>
          <Row gutter={[16, 16]}>
            {aiTools.filter(tool => tool.featured).map(tool => (
              <Col key={tool.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    className="ai-tool-card featured"
                    hoverable
                    onClick={() => showToolDetail(tool)}
                    actions={[
                      (
                        <Tooltip title={favoriteTools.includes(tool.id) ? '取消收藏' : '收藏工具'}>
                          <Button
                            key={`fav-${tool.id}`}
                            type="text"
                            size="small"
                            icon={favoriteTools.includes(tool.id) ? <HeartFilled /> : <HeartOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(tool.id);
                            }}
                            style={{ color: favoriteTools.includes(tool.id) ? '#eb2f96' : undefined }}
                          />
                        </Tooltip>
                      ),
                      (
                        <Tooltip title="修改工具属性">
                          <Button
                            key={`edit-${tool.id}`}
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={(e) => { e.stopPropagation(); openEditForTool(tool); }}
                          />
                        </Tooltip>
                      ),
                      (
                        <Tooltip title="查看详情">
                          <Button
                            key={`detail-${tool.id}`}
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={(e) => { e.stopPropagation(); showToolDetail(tool); }}
                          />
                        </Tooltip>
                      )
                    ]}
                    cover={
                      <div className="tool-cover">
                        <div className="tool-icon" style={{ color: tool.color }}>
                          {tool.icon}
                        </div>
                        <div className="tool-badges">
                          {tool.platform && (
                          <Tag 
                            size="small" 
                            style={{
                              background: 'transparent',
                              borderColor: 'var(--theme-border)',
                              color: 'var(--theme-textSecondary)'
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
                      {/* 移除悬停提示：点击查看详情 */}
                    </div>
                  }
                  
                >
                  <div className="tool-info">
                    <div className="tool-header">
                      <h4 className="tool-name">{tool.name}</h4>
                      {getStatusBadge(tool.status)}
                    </div>
                    <div className="tool-description">
                      {tool.description}
                    </div>
                    {/* 简化卡片元信息：去掉评分与下载 */}
                    <div className="tool-tags">
                      {tool.tags.slice(0, 3).map((tag, tagIndex) => {
                        // 为不同标签设置清新的颜色
                        return (
                          <Tag key={tag} size="small">{tag}</Tag>
                        );
                      })}
                      {/* 支持的输入类型 */}
                      <div style={{ marginTop: 6 }}>
                        <Text type="secondary" style={{ fontSize: 12, marginRight: 6 }}>输入:</Text>
                        {resolveInputTypes(tool).map((t) => (
                          <Tag key={`${tool.id}-in-${t}`} color="blue" style={{ marginBottom: 4 }}>{INPUT_TYPE_LABELS[t] || t}</Tag>
                        ))}
                      </div>
                      {/* 输出类型 */}
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12, marginRight: 6 }}>输出:</Text>
                        {resolveOutputTypes(tool).map((t) => (
                          <Tag key={`${tool.id}-out-${t}`} color="geekblue" style={{ marginBottom: 4 }}>{t}</Tag>
                        ))}
                      </div>
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
            {/* 分类标题已移除，直接展示所有工具 */}
          
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
                    actions={[
                      (
                        <Tooltip title={favoriteTools.includes(tool.id) ? '取消收藏' : '收藏工具'}>
                          <Button
                            key={`fav-${tool.id}`}
                            type="text"
                            size="small"
                            icon={favoriteTools.includes(tool.id) ? <HeartFilled /> : <HeartOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(tool.id);
                            }}
                            style={{ color: favoriteTools.includes(tool.id) ? '#eb2f96' : undefined }}
                          />
                        </Tooltip>
                      ),
                      (
                        <Tooltip title="修改工具属性">
                          <Button
                            key={`edit-${tool.id}`}
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={(e) => { e.stopPropagation(); openEditForTool(tool); }}
                          />
                        </Tooltip>
                      ),
                      (
                        <Tooltip title="查看详情">
                          <Button
                            key={`detail-${tool.id}`}
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              showToolDetail(tool);
                            }}
                          />
                        </Tooltip>
                      )
                    ]}
                    cover={
                      <div className="tool-cover">
                        <div className="tool-icon" style={{ color: tool.color }}>
                          {tool.icon}
                        </div>
                        <div className="tool-badges">
                          {tool.platform && (
                            <Tag 
                              size="small"
                              style={{
                                background: 'transparent',
                                borderColor: 'var(--theme-border)',
                                color: 'var(--theme-textSecondary)'
                              }}
                            >
                              {tool.platform}
                            </Tag>
                          )}
                          {/* 移除“热门推荐”标签 */}
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
                        {/* 移除悬停提示：点击查看详情 */}
                      </div>
                    }
                    
                  >
                    <div className="tool-info">
                      <div className="tool-header">
                        <h4 className="tool-name">{tool.name}</h4>
                        {getStatusBadge(tool.status)}
                      </div>
                      <div className="tool-description">
                        {tool.description}
                      </div>
                      {/* 简化卡片元信息：去掉评分与下载 */}
                      <div className="tool-tags">
                        {tool.tags.slice(0, 3).map((tag, tagIndex) => {
                          return (
                            <Tag key={tag} size="small">{tag}</Tag>
                          );
                        })}
                        <div style={{ marginTop: 6 }}>
                          <Text type="secondary" style={{ fontSize: 12, marginRight: 6 }}>输入:</Text>
                          {resolveInputTypes(tool).map((t) => (
                            <Tag key={`${tool.id}-in-${t}`} color="blue" style={{ marginBottom: 4 }}>{INPUT_TYPE_LABELS[t] || t}</Tag>
                          ))}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12, marginRight: 6 }}>输出:</Text>
                          {resolveOutputTypes(tool).map((t) => (
                            <Tag key={`${tool.id}-out-${t}`} color="geekblue" style={{ marginBottom: 4 }}>{t}</Tag>
                          ))}
                        </div>
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
              <Title level={4} style={{ margin: 0 }}>{isEditMode ? '修改工具属性' : selectedTool?.name}</Title>
              <Text type="secondary">by {selectedTool?.author} · {isEditMode ? '编辑' : '工具详情'}</Text>
            </div>
          </div>
        )}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          isEditMode ? (<Button key="save" type="primary" onClick={saveToolEdits}>保存修改</Button>) : null,
          <Tooltip title={selectedTool && favoriteTools.includes(selectedTool.id) ? '取消收藏' : '收藏工具'}>
            <Button
              key="fav"
              type="text"
              icon={selectedTool && favoriteTools.includes(selectedTool.id) ? <HeartFilled /> : <HeartOutlined />}
              onClick={() => selectedTool && toggleFavorite(selectedTool.id)}
              style={{ color: selectedTool && favoriteTools.includes(selectedTool.id) ? '#eb2f96' : undefined }}
            />
          </Tooltip>,
          <Button key="cancel" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={1000}
        bodyStyle={{ overflowY: 'visible' }}
        style={{ top: 32 }}
      >
        {selectedTool && !isEditMode && (
          <div className="tool-detail">
            <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="版本">{selectedTool.version}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusBadge(selectedTool.status)}</Descriptions.Item>
              {selectedTool.platform && (
                <Descriptions.Item label="平台">
                  <Tag 
                    style={{
                      background: 'transparent',
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-textSecondary)'
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
                  return (
                    <Tag key={tag} style={{ marginBottom: '4px' }}>{tag}</Tag>
                  );
                })}
              </div>
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <div>
              <Title level={5}>支持的输入类型</Title>
              <div>
                {resolveInputTypes(selectedTool).map((t) => (
                  <Tag key={`detail-in-${t}`} color="blue" style={{ marginBottom: 4 }}>{INPUT_TYPE_LABELS[t] || t}</Tag>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Title level={5}>输出类型</Title>
              <div>
                {resolveOutputTypes(selectedTool).map((t) => (
                  <Tag key={`detail-out-${t}`} color="geekblue" style={{ marginBottom: 4 }}>{t}</Tag>
                ))}
              </div>
            </div>
          </div>
        )}
        {selectedTool && isEditMode && (
          <div className="tool-detail">
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>基础信息</Title>
              <Row gutter={12}>
                <Col span={12}>
                  <Paragraph type="secondary">名称</Paragraph>
                  <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </Col>
                <Col span={12}>
                  <Paragraph type="secondary">使用方法</Paragraph>
                  <Input value={editForm.usage} onChange={(e) => setEditForm({ ...editForm, usage: e.target.value })} />
                </Col>
              </Row>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>描述</Title>
              <Input.TextArea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={4} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>支持的输入类型</Title>
              <Select
                mode="multiple"
                value={editForm.supportedInputTypes}
                options={INPUT_TYPE_OPTIONS}
                style={{ width: '100%' }}
                onChange={(vals) => setEditForm({ ...editForm, supportedInputTypes: vals })}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>输出类型</Title>
              <Select
                mode="multiple"
                value={editForm.outputTypes}
                options={OUTPUT_TYPE_OPTIONS}
                style={{ width: '100%' }}
                onChange={(vals) => setEditForm({ ...editForm, outputTypes: vals })}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AIToolHouse