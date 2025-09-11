import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Modal, 
  Upload, 
  message,
  Tabs,
  Space,
  Tooltip,
  Badge,
  Avatar,
  Rate,
  Dropdown,
  Menu,
  Pagination,
  Empty,
  Spin,
  Divider,
  Typography,
  Statistic,
  Progress
} from 'antd'
import { 
  Play, 
  Eye, 
  Edit, 
  Delete, 
  Upload as UploadIcon, 
  Search, 
  Filter,
  Plus,
  Download,
  Share2,
  Star,
  Clock,
  User,
  Tag as TagIcon,
  Settings
} from 'lucide-react'
import './ScenarioLibrary.css'
import CategoryManagement from './CategoryManagement'
import ScenarioPreview from './ScenarioPreview'
import ScenarioUpload from './ScenarioUpload'

const { Search: AntSearch } = Input
const { Option } = Select
const { TabPane } = Tabs

const ScenarioLibrary = () => {
  const [scenarios, setScenarios] = useState([])
  const [filteredScenarios, setFilteredScenarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [uploadVisible, setUploadVisible] = useState(false)
  const [editingScenario, setEditingScenario] = useState(null)
  const [categoryManagementVisible, setCategoryManagementVisible] = useState(false)
  const [categories, setCategories] = useState([])
  const [scenarioPreviewVisible, setScenarioPreviewVisible] = useState(false)
  const [previewScenario, setPreviewScenario] = useState(null)

  // 模拟分类数据
  const mockCategories = [
    { id: 'psychology', name: '学生心理', description: '学生心理健康与情感支持相关场景', color: '#52c41a', scenarioCount: 2 },
    { id: 'family', name: '家庭教育', description: '家长教育与亲子关系相关场景', color: '#1890ff', scenarioCount: 3 },
    { id: 'teacher', name: '教师培训', description: '教师专业发展与教学技能场景', color: '#722ed1', scenarioCount: 3 },
    { id: 'management', name: '班级管理', description: '班主任工作与班级建设场景', color: '#fa8c16', scenarioCount: 3 },
    { id: 'leadership', name: '学校管理', description: '校长管理与学校发展场景', color: '#eb2f96', scenarioCount: 3 },
    { id: 'special', name: '特殊教育', description: '特殊需要学生教育支持场景', color: '#13c2c2', scenarioCount: 2 }
  ]

  // 模拟场景数据
  const mockScenarios = [
    // 学生心理健康场景
    {
      id: '1',
      title: '考试焦虑缓解训练',
      description: '针对即将面临重要考试的学生，通过放松技巧和认知重构帮助缓解考试焦虑，提升考试表现。包含呼吸练习、正念冥想和积极自我对话等技巧。',
      category: 'psychology',
      tags: ['考试焦虑', '放松技巧', '心理调适', '学生'],
      author: '陈心理老师',
      createTime: '2024-01-20',
      lastModified: '2024-01-20',
      views: 1850,
      likes: 142,
      difficulty: 'medium',
      duration: '35分钟',
      thumbnail: '/gen-html/exam_anxiety_relief.html',
      files: {
        html: '/gen-html/exam_anxiety_relief.html',
        css: '/gen-html/exam_anxiety_relief.css',
        js: '/gen-html/exam_anxiety_relief.js'
      }
    },
    {
      id: '2',
      title: '校园霸凌应对策略',
      description: '帮助遭受校园霸凌的学生学会自我保护，建立自信心，同时教授旁观者如何正确介入和寻求帮助。',
      category: 'psychology',
      tags: ['校园霸凌', '自我保护', '心理创伤', '同伴支持'],
      author: '李心理咨询师',
      createTime: '2024-01-18',
      lastModified: '2024-01-18',
      views: 2340,
      likes: 198,
      difficulty: 'hard',
      duration: '40分钟',
      thumbnail: '/gen-html/bullying_response.html',
      files: {
        html: '/gen-html/bullying_response.html',
        css: '/gen-html/bullying_response.css',
        js: '/gen-html/bullying_response.js'
      }
    },
    
    // 家长教育场景
    {
      id: '3',
      title: '青春期亲子沟通艺术',
      description: '专为青春期孩子的家长设计，学习如何与叛逆期的孩子有效沟通，理解青春期心理特点，建立良好的亲子关系。',
      category: 'family',
      tags: ['青春期', '亲子沟通', '家长教育', '叛逆期'],
      author: '王家庭教育专家',
      createTime: '2024-01-16',
      lastModified: '2024-01-16',
      views: 3200,
      likes: 267,
      difficulty: 'medium',
      duration: '50分钟',
      thumbnail: '/gen-html/parent_teen_communication.html',
      files: {
        html: '/gen-html/parent_teen_communication.html',
        css: '/gen-html/parent_teen_communication.css',
        js: '/gen-html/parent_teen_communication.js'
      }
    },
    {
      id: '4',
      title: '单亲家庭孩子心理关怀',
      description: '针对单亲家庭的特殊情况，帮助单亲家长了解孩子可能面临的心理挑战，学习给予适当的情感支持和引导。',
      category: 'family',
      tags: ['单亲家庭', '心理关怀', '情感支持', '家庭结构'],
      author: '张家庭咨询师',
      createTime: '2024-01-14',
      lastModified: '2024-01-14',
      views: 1680,
      likes: 134,
      difficulty: 'hard',
      duration: '45分钟',
      thumbnail: '/gen-html/single_parent_care.html',
      files: {
        html: '/gen-html/single_parent_care.html',
        css: '/gen-html/single_parent_care.css',
        js: '/gen-html/single_parent_care.js'
      }
    },
    {
      id: '5',
      title: '隔代教育协调技巧',
      description: '解决祖辈与父母在教育理念上的分歧，学习如何协调不同代际的教育观念，为孩子创造和谐的成长环境。',
      category: 'family',
      tags: ['隔代教育', '教育理念', '家庭和谐', '代际沟通'],
      author: '刘教育顾问',
      createTime: '2024-01-12',
      lastModified: '2024-01-12',
      views: 1420,
      likes: 89,
      difficulty: 'medium',
      duration: '35分钟',
      thumbnail: '/gen-html/intergenerational_education.html',
      files: {
        html: '/gen-html/intergenerational_education.html',
        css: '/gen-html/intergenerational_education.css',
        js: '/gen-html/intergenerational_education.js'
      }
    },
    
    // 教师专业发展场景
    {
      id: '6',
      title: '课堂管理与纪律维护',
      description: '帮助新手教师掌握有效的课堂管理技巧，学会处理课堂突发事件，建立良好的师生关系和课堂秩序。',
      category: 'teacher',
      tags: ['课堂管理', '纪律维护', '师生关系', '新手教师'],
      author: '赵资深教师',
      createTime: '2024-01-19',
      lastModified: '2024-01-19',
      views: 2890,
      likes: 234,
      difficulty: 'easy',
      duration: '30分钟',
      thumbnail: '/gen-html/classroom_management.html',
      files: {
        html: '/gen-html/classroom_management.html',
        css: '/gen-html/classroom_management.css',
        js: '/gen-html/classroom_management.js'
      }
    },
    {
      id: '7',
      title: '差异化教学策略实施',
      description: '针对班级中不同学习能力和风格的学生，学习如何设计和实施差异化教学，确保每个学生都能得到适合的教育。',
      category: 'teacher',
      tags: ['差异化教学', '个性化学习', '教学策略', '因材施教'],
      author: '孙教学专家',
      createTime: '2024-01-17',
      lastModified: '2024-01-17',
      views: 1950,
      likes: 178,
      difficulty: 'hard',
      duration: '55分钟',
      thumbnail: '/gen-html/differentiated_teaching.html',
      files: {
        html: '/gen-html/differentiated_teaching.html',
        css: '/gen-html/differentiated_teaching.css',
        js: '/gen-html/differentiated_teaching.js'
      }
    },
    {
      id: '8',
      title: '学生心理危机识别与干预',
      description: '培训教师识别学生心理危机的早期信号，学习基本的心理急救技能和转介流程，保障学生心理健康。',
      category: 'teacher',
      tags: ['心理危机', '危机干预', '心理急救', '学生安全'],
      author: '周心理教师',
      createTime: '2024-01-15',
      lastModified: '2024-01-15',
      views: 2150,
      likes: 189,
      difficulty: 'hard',
      duration: '60分钟',
      thumbnail: '/gen-html/crisis_intervention.html',
      files: {
        html: '/gen-html/crisis_intervention.html',
        css: '/gen-html/crisis_intervention.css',
        js: '/gen-html/crisis_intervention.js'
      }
    },
    
    // 班主任工作场景
    {
      id: '9',
      title: '班级文化建设与凝聚力提升',
      description: '指导班主任如何营造积极向上的班级氛围，建立班级文化，增强班级凝聚力，促进学生全面发展。',
      category: 'management',
      tags: ['班级文化', '凝聚力', '班级管理', '学生发展'],
      author: '吴优秀班主任',
      createTime: '2024-01-13',
      lastModified: '2024-01-13',
      views: 2680,
      likes: 221,
      difficulty: 'medium',
      duration: '40分钟',
      thumbnail: '/gen-html/class_culture_building.html',
      files: {
        html: '/gen-html/class_culture_building.html',
        css: '/gen-html/class_culture_building.css',
        js: '/gen-html/class_culture_building.js'
      }
    },
    {
      id: '10',
      title: '问题学生教育转化策略',
      description: '针对行为问题学生，学习科学的教育转化方法，通过个别辅导、行为矫正等手段帮助学生健康成长。',
      category: 'management',
      tags: ['问题学生', '教育转化', '行为矫正', '个别辅导'],
      author: '郑德育主任',
      createTime: '2024-01-11',
      lastModified: '2024-01-11',
      views: 1890,
      likes: 156,
      difficulty: 'hard',
      duration: '50分钟',
      thumbnail: '/gen-html/problem_student_transformation.html',
      files: {
        html: '/gen-html/problem_student_transformation.html',
        css: '/gen-html/problem_student_transformation.css',
        js: '/gen-html/problem_student_transformation.js'
      }
    },
    {
      id: '11',
      title: '家校合作沟通技巧',
      description: '提升班主任与家长沟通的技巧，建立良好的家校合作关系，共同促进学生成长和发展。',
      category: 'management',
      tags: ['家校合作', '沟通技巧', '家长工作', '协同教育'],
      author: '何资深班主任',
      createTime: '2024-01-09',
      lastModified: '2024-01-09',
      views: 2340,
      likes: 198,
      difficulty: 'medium',
      duration: '35分钟',
      thumbnail: '/gen-html/home_school_cooperation.html',
      files: {
        html: '/gen-html/home_school_cooperation.html',
        css: '/gen-html/home_school_cooperation.css',
        js: '/gen-html/home_school_cooperation.js'
      }
    },
    
    // 校长管理场景
    {
      id: '12',
      title: '学校危机管理与应急处置',
      description: '培训校长处理各类校园突发事件的能力，建立完善的危机管理体系，确保校园安全稳定。',
      category: 'leadership',
      tags: ['危机管理', '应急处置', '校园安全', '管理体系'],
      author: '马校长',
      createTime: '2024-01-08',
      lastModified: '2024-01-08',
      views: 1560,
      likes: 134,
      difficulty: 'hard',
      duration: '70分钟',
      thumbnail: '/gen-html/crisis_management.html',
      files: {
        html: '/gen-html/crisis_management.html',
        css: '/gen-html/crisis_management.css',
        js: '/gen-html/crisis_management.js'
      }
    },
    {
      id: '13',
      title: '教师团队建设与激励机制',
      description: '指导校长如何建设高效的教师团队，设计合理的激励机制，提升教师工作积极性和专业发展水平。',
      category: 'leadership',
      tags: ['团队建设', '激励机制', '教师发展', '管理艺术'],
      author: '冯教育专家',
      createTime: '2024-01-06',
      lastModified: '2024-01-06',
      views: 1780,
      likes: 145,
      difficulty: 'hard',
      duration: '65分钟',
      thumbnail: '/gen-html/team_building.html',
      files: {
        html: '/gen-html/team_building.html',
        css: '/gen-html/team_building.css',
        js: '/gen-html/team_building.js'
      }
    },
    {
      id: '14',
      title: '学校文化建设与品牌塑造',
      description: '帮助校长理解学校文化的重要性，学习如何塑造独特的学校文化和教育品牌，提升学校影响力。',
      category: 'leadership',
      tags: ['学校文化', '品牌建设', '文化传承', '特色发展'],
      author: '田文化顾问',
      createTime: '2024-01-04',
      lastModified: '2024-01-04',
      views: 1420,
      likes: 112,
      difficulty: 'medium',
      duration: '55分钟',
      thumbnail: '/gen-html/school_culture.html',
      files: {
        html: '/gen-html/school_culture.html',
        css: '/gen-html/school_culture.css',
        js: '/gen-html/school_culture.js'
      }
    },
    
    // 特殊教育场景
    {
      id: '15',
      title: '特殊需要学生融合教育',
      description: '指导教师如何在普通班级中有效支持特殊需要学生，促进融合教育的实施，创建包容性学习环境。',
      category: 'special',
      tags: ['融合教育', '特殊需要', '包容性', '个别化支持'],
      author: '邓特教专家',
      createTime: '2024-01-02',
      lastModified: '2024-01-02',
      views: 980,
      likes: 87,
      difficulty: 'hard',
      duration: '45分钟',
      thumbnail: '/gen-html/inclusive_education.html',
      files: {
        html: '/gen-html/inclusive_education.html',
        css: '/gen-html/inclusive_education.css',
        js: '/gen-html/inclusive_education.js'
      }
    },
    {
      id: '16',
      title: '学习困难学生辅导策略',
      description: '针对学习困难学生的特点，提供个性化的辅导策略和方法，帮助他们克服学习障碍，重建学习信心。',
      category: 'special',
      tags: ['学习困难', '个性化辅导', '学习策略', '信心重建'],
      author: '许学习顾问',
      createTime: '2023-12-30',
      lastModified: '2023-12-30',
      views: 1230,
      likes: 98,
      difficulty: 'medium',
      duration: '40分钟',
      thumbnail: '/gen-html/learning_difficulties.html',
      files: {
        html: '/gen-html/learning_difficulties.html',
        css: '/gen-html/learning_difficulties.css',
        js: '/gen-html/learning_difficulties.js'
      }
    }
  ]

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setScenarios(mockScenarios)
      setFilteredScenarios(mockScenarios)
      setCategories(mockCategories)
      setLoading(false)
    }, 1000)
  }, [])

  // 搜索和筛选
  useEffect(() => {
    let filtered = scenarios

    // 按分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(scenario => scenario.category === selectedCategory)
    }

    // 按搜索文本筛选
    if (searchText) {
      filtered = filtered.filter(scenario => 
        scenario.title.toLowerCase().includes(searchText.toLowerCase()) ||
        scenario.description.toLowerCase().includes(searchText.toLowerCase()) ||
        scenario.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      )
    }

    setFilteredScenarios(filtered)
  }, [scenarios, selectedCategory, searchText])

  // 获取难度标签颜色
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#52c41a'
      case 'medium': return '#fa8c16'
      case 'hard': return '#f5222d'
      default: return '#1890ff'
    }
  }

  // 获取难度标签文本
  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '简单'
      case 'medium': return '中等'
      case 'hard': return '困难'
      default: return '未知'
    }
  }

  // 运行场景
  const handleRunScenario = (scenario) => {
    window.open(scenario.files.html, '_blank')
  }

  // 预览场景
  const handlePreviewScenario = (scenario) => {
    setSelectedScenario(scenario)
    setPreviewVisible(true)
  }

  // 编辑场景
  const handleEditScenario = (scenario) => {
    message.info('编辑功能开发中...')
  }

  // 删除场景
  const handleDeleteScenario = (scenario) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除场景 "${scenario.title}" 吗？`,
      onOk: () => {
        const newScenarios = scenarios.filter(s => s.id !== scenario.id)
        setScenarios(newScenarios)
        message.success('删除成功')
      }
    })
  }

  // 收藏场景
  const handleLikeScenario = (scenario) => {
    const newScenarios = scenarios.map(s => 
      s.id === scenario.id 
        ? { ...s, likes: s.likes + 1 }
        : s
    )
    setScenarios(newScenarios)
    message.success('收藏成功')
  }

  // 处理分类变更
  const handleCategoriesChange = (newCategories) => {
    setCategories(newCategories)
    // 这里可以添加保存到后端的逻辑
  }

  // 处理场景预览
  const handlePreview = (scenario) => {
    setPreviewScenario(scenario)
    setScenarioPreviewVisible(true)
  }

  // 处理场景运行
  const handleRun = (scenario) => {
    // 在新窗口中打开场景
    window.open(scenario.thumbnail, '_blank')
  }

  // 处理场景上传
  const handleUpload = (scenarioData) => {
    if (editingScenario) {
      // 编辑模式：更新现有场景
      setScenarios(scenarios.map(s => 
        s.id === editingScenario.id ? { ...scenarioData, id: editingScenario.id } : s
      ))
    } else {
      // 新增模式：添加新场景
      setScenarios([scenarioData, ...scenarios])
    }
    setEditingScenario(null)
  }

  // 处理场景编辑
  const handleEdit = (scenario) => {
    setEditingScenario(scenario)
    setUploadVisible(true)
  }

  // 处理场景删除
  const handleDelete = (scenarioId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个场景吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setScenarios(scenarios.filter(s => s.id !== scenarioId))
        message.success('场景删除成功')
      }
    })
  }

  return (
    <div className="scenario-library">
      <div className="scenario-library-header">
        <div className="header-title">
          <h2>场景库管理</h2>
          <p>管理和运行交互式教学场景</p>
        </div>
        <div className="header-actions">
          <Space>
            <Button 
              icon={<Settings size={16} />}
              onClick={() => setCategoryManagementVisible(true)}
            >
              分类管理
            </Button>
            <Button 
              type="primary" 
              icon={<Plus size={16} />}
              onClick={() => {
                setEditingScenario(null)
                setUploadVisible(true)
              }}
            >
              新建场景
            </Button>
          </Space>
        </div>
      </div>

      <div className="scenario-library-filters">
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <AntSearch
              placeholder="搜索场景名称、描述或标签..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
              prefix={<Search size={16} />}
            />
          </Col>
          <Col>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 150 }}
              placeholder="选择分类"
            >
              <Option value="all">
                <Tag color="#1890ff" style={{ margin: 0 }}>
                  全部场景
                </Tag>
              </Option>
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  <Tag color={category.color} style={{ margin: 0 }}>
                    {category.name}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <div className="scenario-library-content">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p>加载场景中...</p>
          </div>
        ) : filteredScenarios.length === 0 ? (
          <Empty 
            description="暂无场景数据"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredScenarios.map(scenario => (
              <Col xs={24} sm={12} lg={8} xl={6} key={scenario.id}>
                <Card
                  className="scenario-card"
                  cover={
                    <div className="scenario-thumbnail">
                      <iframe 
                        src={scenario.thumbnail}
                        title={scenario.title}
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          border: 'none',
                          pointerEvents: 'none'
                        }}
                      />
                      <div className="scenario-overlay">
                        <Button 
                          type="primary" 
                          icon={<Play size={16} />}
                          onClick={() => handleRunScenario(scenario)}
                        >
                          运行
                        </Button>
                      </div>
                    </div>
                  }
                  actions={[
                    <Tooltip title="预览">
                      <Button 
                        type="text" 
                        icon={<Eye size={16} />}
                        onClick={() => handlePreview(scenario)}
                      />
                    </Tooltip>,
                    <Tooltip title="编辑">
                      <Button 
                        type="text" 
                        icon={<Edit size={16} />}
                        onClick={() => handleEdit(scenario)}
                      />
                    </Tooltip>,
                    <Tooltip title="收藏">
                      <Button 
                        type="text" 
                        icon={<Star size={16} />}
                        onClick={() => handleLikeScenario(scenario)}
                      />
                    </Tooltip>,
                    <Tooltip title="删除">
                      <Button 
                        type="text" 
                        danger
                        icon={<Delete size={16} />}
                        onClick={() => handleDelete(scenario.id)}
                      />
                    </Tooltip>
                  ]}
                >
                  <Card.Meta
                    title={
                      <div className="scenario-title">
                        <span>{scenario.title}</span>
                        <Tag 
                          color={getDifficultyColor(scenario.difficulty)}
                          size="small"
                        >
                          {getDifficultyText(scenario.difficulty)}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="scenario-description">
                        <p>{scenario.description}</p>
                        <div className="scenario-tags">
                          {scenario.tags.map(tag => (
                            <Tag key={tag} size="small">{tag}</Tag>
                          ))}
                        </div>
                        <div className="scenario-meta">
                          <Space size="small">
                            <span><User size={12} /> {scenario.author}</span>
                            <span><Clock size={12} /> {scenario.duration}</span>
                            <span><Eye size={12} /> {scenario.views}</span>
                            <span><Star size={12} /> {scenario.likes}</span>
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* 预览模态框 */}
      <Modal
        title="场景预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="run" 
            type="primary" 
            icon={<Play size={16} />}
            onClick={() => {
              handleRunScenario(selectedScenario)
              setPreviewVisible(false)
            }}
          >
            运行场景
          </Button>
        ]}
      >
        {selectedScenario && (
          <div className="scenario-preview">
            <iframe 
              src={selectedScenario.files.html}
              title={selectedScenario.title}
              style={{ 
                width: '100%', 
                height: '600px', 
                border: '1px solid #d9d9d9',
                borderRadius: '6px'
              }}
            />
          </div>
        )}
      </Modal>

      {/* 上传场景模态框 */}
      <Modal
        title="新建场景"
        open={uploadVisible}
        onCancel={() => setUploadVisible(false)}
        footer={null}
      >
        <div className="upload-scenario">
          <p>上传功能开发中，敬请期待...</p>
        </div>
      </Modal>

      {/* 分类管理弹窗 */}
      <CategoryManagement
        visible={categoryManagementVisible}
        onClose={() => setCategoryManagementVisible(false)}
        categories={categories}
        onCategoriesChange={handleCategoriesChange}
      />
      
      {/* 场景预览弹窗 */}
      <ScenarioPreview
        visible={scenarioPreviewVisible}
        onClose={() => setScenarioPreviewVisible(false)}
        scenario={previewScenario}
        onRun={handleRun}
      />
      
      {/* 场景上传/编辑弹窗 */}
      <ScenarioUpload
        visible={uploadVisible}
        onClose={() => {
          setUploadVisible(false)
          setEditingScenario(null)
        }}
        onUpload={handleUpload}
        categories={categories}
        editingScenario={editingScenario}
      />
    </div>
  )
}

export default ScenarioLibrary