import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Table,
  Tag,
  Avatar,
  Progress,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Tabs,
  Statistic,
  List,
  Badge,
  Tooltip,
  Popconfirm,
  Steps,
  Timeline,
  Rate,
  Divider,
  Empty,
  Dropdown,
  Menu,
  Drawer,
  Switch,
  Slider,
  Radio,
  Checkbox,
  Alert,
  Spin,
  Result
} from 'antd';
import {
  ArrowLeftOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  UserOutlined,
  BookOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  SettingOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  StarOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  BulbOutlined,
  MoreOutlined,
  CalendarOutlined,
  TagOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  SyncOutlined,
  SaveOutlined,
  SendOutlined,
  HistoryOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import needsService from '../services/needsService';
import AIAssistant from './AIAssistant';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

const CourseWorkspace = ({ trainingNeed, onBack, onSave, hideHeader = false }) => {
  // 基础状态
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ai-recommend');
  const [workspaceMode, setWorkspaceMode] = useState('collaborative'); // collaborative, ai-only, manual-only
  
  // AI推荐相关状态
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  
  // 人工配课相关状态
  const [manualCourses, setManualCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseLibrary, setCourseLibrary] = useState([]);
  
  // 协同工作状态
  const [comparisonMode, setComparisonMode] = useState(false);
  const [finalPlan, setFinalPlan] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  
  // 表单和模态框状态
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form] = Form.useForm();

  // 初始化数据
  useEffect(() => {
    initializeWorkspace();
  }, [trainingNeed]);

  // 初始化工作台
  const initializeWorkspace = async () => {
    setLoading(true);
    try {
      // 加载课程库
      await loadCourseLibrary();
      
      // 生成AI推荐
      await generateAIRecommendations();
      
      // 初始化历史记录
      loadPlanHistory();
    } catch (error) {
      console.error('初始化工作台失败:', error);
      message.error('初始化工作台失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载课程库
  const loadCourseLibrary = async () => {
    // 模拟课程库数据
    const mockCourses = [
      {
        id: 'course-001',
        title: '现代教学方法与实践',
        category: 'teaching_methods',
        duration: 16,
        level: 'intermediate',
        instructor: '张教授',
        rating: 4.8,
        students: 1250,
        tags: ['教学方法', '课堂管理', '互动教学'],
        description: '深入学习现代教学理念和方法，提升课堂教学效果',
        objectives: ['掌握多种教学方法', '提升课堂互动能力', '改善教学效果'],
        price: 299,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-002',
        title: '数字化课程设计与开发',
        category: 'curriculum_design',
        duration: 24,
        level: 'advanced',
        instructor: '李老师',
        rating: 4.9,
        students: 890,
        tags: ['课程设计', '数字化教学', '在线教育'],
        description: '学习数字化时代的课程设计理念和技术实现',
        objectives: ['掌握数字化课程设计', '学会使用开发工具', '提升技术能力'],
        price: 499,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-003',
        title: '学生心理健康与辅导',
        category: 'mental_health',
        duration: 20,
        level: 'intermediate',
        instructor: '王心理师',
        rating: 4.7,
        students: 1100,
        tags: ['心理健康', '学生辅导', '危机干预'],
        description: '了解学生心理特点，掌握心理辅导技巧',
        objectives: ['识别心理问题', '掌握辅导技巧', '建立支持体系'],
        price: 399,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-004',
        title: '教育技术应用基础',
        category: 'educational_tech',
        duration: 18,
        level: 'beginner',
        instructor: '陈老师',
        rating: 4.6,
        students: 980,
        tags: ['教育技术', '多媒体教学', '在线工具'],
        description: '掌握现代教育技术工具的使用方法',
        objectives: ['学会使用教学软件', '制作多媒体课件', '提升技术素养'],
        price: 199,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-005',
        title: '班级管理艺术',
        category: 'class_management',
        duration: 14,
        level: 'intermediate',
        instructor: '刘老师',
        rating: 4.5,
        students: 1350,
        tags: ['班级管理', '学生工作', '沟通技巧'],
        description: '提升班级管理能力，建立良好师生关系',
        objectives: ['掌握管理技巧', '提升沟通能力', '营造良好氛围'],
        price: 259,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-006',
        title: '创新教学设计',
        category: 'teaching_design',
        duration: 22,
        level: 'advanced',
        instructor: '赵博士',
        rating: 4.8,
        students: 750,
        tags: ['教学设计', '创新思维', '课程开发'],
        description: '培养创新教学设计思维和实践能力',
        objectives: ['掌握设计原理', '培养创新思维', '提升设计能力'],
        price: 399,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-007',
        title: '学习评价与测量',
        category: 'assessment',
        duration: 16,
        level: 'intermediate',
        instructor: '孙教授',
        rating: 4.4,
        students: 890,
        tags: ['学习评价', '测量方法', '数据分析'],
        description: '学习科学的学习评价方法和测量技术',
        objectives: ['掌握评价方法', '学会数据分析', '提升评价能力'],
        price: 299,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-008',
        title: '多元智能理论应用',
        category: 'learning_theory',
        duration: 20,
        level: 'advanced',
        instructor: '周老师',
        rating: 4.7,
        students: 650,
        tags: ['多元智能', '个性化教学', '因材施教'],
        description: '运用多元智能理论指导个性化教学实践',
        objectives: ['理解理论基础', '掌握应用方法', '实现因材施教'],
        price: 359,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-009',
        title: '课堂互动技巧',
        category: 'interaction_skills',
        duration: 12,
        level: 'beginner',
        instructor: '吴老师',
        rating: 4.3,
        students: 1200,
        tags: ['课堂互动', '参与度', '活跃氛围'],
        description: '提升课堂互动效果，激发学生参与热情',
        objectives: ['掌握互动技巧', '提升参与度', '活跃课堂氛围'],
        price: 179,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-010',
        title: '教师专业发展规划',
        category: 'professional_dev',
        duration: 18,
        level: 'intermediate',
        instructor: '郑老师',
        rating: 4.6,
        students: 820,
        tags: ['专业发展', '职业规划', '能力提升'],
        description: '制定个人专业发展计划，提升职业素养',
        objectives: ['明确发展方向', '制定发展计划', '提升专业能力'],
        price: 279,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-011',
        title: '信息化教学实践',
        category: 'digital_teaching',
        duration: 26,
        level: 'advanced',
        instructor: '何教授',
        rating: 4.9,
        students: 560,
        tags: ['信息化教学', '数字资源', '智慧课堂'],
        description: '深入学习信息化教学的理念、方法和实践',
        objectives: ['掌握信息化理念', '学会资源整合', '建设智慧课堂'],
        price: 459,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-012',
        title: '学科教学法',
        category: 'subject_pedagogy',
        duration: 24,
        level: 'intermediate',
        instructor: '马老师',
        rating: 4.5,
        students: 940,
        tags: ['学科教学', '教学方法', '专业技能'],
        description: '针对具体学科的教学方法和技巧培训',
        objectives: ['掌握学科特点', '学会教学方法', '提升专业技能'],
        price: 329,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-013',
        title: '家校合作策略',
        category: 'home_school',
        duration: 15,
        level: 'beginner',
        instructor: '田老师',
        rating: 4.4,
        students: 1100,
        tags: ['家校合作', '沟通技巧', '协同育人'],
        description: '建立有效的家校合作机制，促进协同育人',
        objectives: ['掌握合作策略', '提升沟通技巧', '实现协同育人'],
        price: 219,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-014',
        title: '教育研究方法',
        category: 'research_methods',
        duration: 28,
        level: 'advanced',
        instructor: '冯博士',
        rating: 4.7,
        students: 480,
        tags: ['教育研究', '研究方法', '学术写作'],
        description: '掌握教育研究的基本方法和学术写作技巧',
        objectives: ['学会研究方法', '掌握写作技巧', '提升研究能力'],
        price: 499,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-015',
        title: '特殊教育基础',
        category: 'special_education',
        duration: 22,
        level: 'intermediate',
        instructor: '邓老师',
        rating: 4.6,
        students: 670,
        tags: ['特殊教育', '融合教育', '个别化教学'],
        description: '了解特殊教育理念，掌握融合教育方法',
        objectives: ['理解特教理念', '掌握融合方法', '实施个别化教学'],
        price: 369,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-016',
        title: '教学反思与改进',
        category: 'reflection',
        duration: 14,
        level: 'intermediate',
        instructor: '许老师',
        rating: 4.3,
        students: 890,
        tags: ['教学反思', '持续改进', '专业成长'],
        description: '培养教学反思习惯，促进专业持续成长',
        objectives: ['养成反思习惯', '掌握改进方法', '促进专业成长'],
        price: 239,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-017',
        title: '课程思政设计',
        category: 'curriculum_ideology',
        duration: 18,
        level: 'intermediate',
        instructor: '胡老师',
        rating: 4.5,
        students: 780,
        tags: ['课程思政', '价值引领', '育人功能'],
        description: '将思政元素融入专业课程，发挥育人功能',
        objectives: ['理解思政理念', '掌握融入方法', '发挥育人功能'],
        price: 289,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-018',
        title: '学习动机激发',
        category: 'motivation',
        duration: 16,
        level: 'beginner',
        instructor: '罗老师',
        rating: 4.4,
        students: 1050,
        tags: ['学习动机', '激发策略', '学习兴趣'],
        description: '掌握激发学生学习动机的有效策略',
        objectives: ['理解动机理论', '掌握激发策略', '提升学习兴趣'],
        price: 259,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-019',
        title: '教育法律法规',
        category: 'education_law',
        duration: 20,
        level: 'beginner',
        instructor: '高律师',
        rating: 4.2,
        students: 920,
        tags: ['教育法律', '法规政策', '权益保护'],
        description: '了解教育相关法律法规，保护师生权益',
        objectives: ['了解法律法规', '掌握政策要点', '保护合法权益'],
        price: 199,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'course-020',
        title: '国际教育比较',
        category: 'comparative_education',
        duration: 24,
        level: 'advanced',
        instructor: '林教授',
        rating: 4.8,
        students: 420,
        tags: ['国际教育', '比较研究', '教育改革'],
        description: '比较分析国际教育经验，借鉴先进理念',
        objectives: ['了解国际经验', '掌握比较方法', '借鉴先进理念'],
        price: 429,
        thumbnail: '/api/placeholder/300/200'
      }
    ];
    
    setCourseLibrary(mockCourses);
  };

  // 生成AI推荐
  const generateAIRecommendations = async () => {
    setAiLoading(true);
    try {
      // 模拟AI分析过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = {
        needsAnalysis: {
          primarySkills: trainingNeed?.tags || ['教学方法', '课程设计'],
          urgencyLevel: 'high',
          targetAudience: '新入职教师',
          estimatedDuration: '40学时',
          recommendedApproach: '理论与实践结合'
        },
        recommendations: [
          {
            id: 'ai-rec-001',
            courseId: 'course-001',
            title: '现代教学方法与实践',
            matchScore: 95,
            reasons: ['完全匹配培训需求', '适合新教师', '实践性强'],
            priority: 'high',
            estimatedImpact: '显著提升教学能力',
            duration: '16',
            level: 'Intermediate',
            rating: 4.8,
            instructor: '张教授',
            category: '教学方法'
          },
          {
            id: 'ai-rec-002',
            courseId: 'course-002',
            title: '数字化课程设计与开发',
            matchScore: 88,
            reasons: ['符合现代教育趋势', '技能互补性强', '长期发展价值'],
            priority: 'medium',
            estimatedImpact: '提升技术应用能力',
            duration: '20',
            level: 'Advanced',
            rating: 4.6,
            instructor: '李博士',
            category: '课程设计'
          },
          {
            id: 'ai-rec-003',
            courseId: 'course-003',
            title: '学生心理学与教育引导',
            matchScore: 85,
            reasons: ['提升师生互动', '心理健康重要', '全面发展'],
            priority: 'medium',
            estimatedImpact: '改善教学效果',
            duration: '12',
            level: 'Beginner',
            rating: 4.7,
            instructor: '王老师',
            category: '心理学'
          },
          {
            id: 'ai-rec-004',
            courseId: 'course-004',
            title: '多媒体教学技术应用',
            matchScore: 82,
            reasons: ['技术融合教学', '提升课堂效果', '现代化教学'],
            priority: 'medium',
            estimatedImpact: '增强教学互动性',
            duration: '18',
            level: 'Intermediate',
            rating: 4.5,
            instructor: '陈工程师',
            category: '教育技术'
          },
          {
            id: 'ai-rec-005',
            courseId: 'course-005',
            title: '课堂管理与纪律维护',
            matchScore: 80,
            reasons: ['基础管理技能', '新教师必备', '实用性强'],
            priority: 'high',
            estimatedImpact: '提升课堂控制力',
            duration: '14',
            level: 'Beginner',
            rating: 4.4,
            instructor: '刘主任',
            category: '课堂管理'
          },
          {
            id: 'ai-rec-006',
            courseId: 'course-006',
            title: '教育评估与反馈机制',
            matchScore: 78,
            reasons: ['科学评估方法', '改进教学质量', '数据驱动'],
            priority: 'medium',
            estimatedImpact: '优化教学策略',
            duration: '16',
            level: 'Advanced',
            rating: 4.3,
            instructor: '赵专家',
            category: '教育评估'
          },
          {
            id: 'ai-rec-007',
            courseId: 'course-007',
            title: '创新思维与教学创意',
            matchScore: 76,
            reasons: ['激发创造力', '教学方法创新', '学生参与度'],
            priority: 'low',
            estimatedImpact: '提升教学创新能力',
            duration: '22',
            level: 'Intermediate',
            rating: 4.6,
            instructor: '孙导师',
            category: '创新教育'
          },
          {
            id: 'ai-rec-008',
            courseId: 'course-008',
            title: '跨文化教育与国际视野',
            matchScore: 74,
            reasons: ['全球化教育', '文化包容性', '国际交流'],
            priority: 'low',
            estimatedImpact: '拓展教育视野',
            duration: '20',
            level: 'Advanced',
            rating: 4.2,
            instructor: '周教授',
            category: '国际教育'
          },
          {
            id: 'ai-rec-009',
            courseId: 'course-009',
            title: '教师职业发展规划',
            matchScore: 72,
            reasons: ['职业生涯指导', '长远发展', '自我提升'],
            priority: 'medium',
            estimatedImpact: '明确发展方向',
            duration: '10',
            level: 'Beginner',
            rating: 4.1,
            instructor: '吴顾问',
            category: '职业发展'
          },
          {
            id: 'ai-rec-010',
            courseId: 'course-010',
            title: '教学研究方法与论文写作',
            matchScore: 70,
            reasons: ['学术能力提升', '研究方法掌握', '论文发表'],
            priority: 'low',
            estimatedImpact: '提升学术水平',
            duration: '24',
            level: 'Advanced',
            rating: 4.0,
            instructor: '郑研究员',
            category: '学术研究'
          },
          {
            id: 'ai-rec-011',
            courseId: 'course-011',
            title: '在线教学平台操作与管理',
            matchScore: 88,
            reasons: ['数字化转型', '远程教学必备', '技术应用'],
            priority: 'high',
            estimatedImpact: '掌握在线教学技能',
            duration: '15',
            level: 'Intermediate',
            rating: 4.7,
            instructor: '马技术总监',
            category: '在线教育'
          },
          {
            id: 'ai-rec-012',
            courseId: 'course-012',
            title: '学习分析与数据挖掘',
            matchScore: 75,
            reasons: ['数据驱动教学', '学习效果分析', '个性化教育'],
            priority: 'medium',
            estimatedImpact: '提升教学精准度',
            duration: '18',
            level: 'Advanced',
            rating: 4.3,
            instructor: '冯数据专家',
            category: '教育数据'
          },
          {
            id: 'ai-rec-013',
            courseId: 'course-013',
            title: '特殊教育需求学生支持',
            matchScore: 73,
            reasons: ['包容性教育', '特殊需求关注', '全面发展'],
            priority: 'medium',
            estimatedImpact: '提升教育公平性',
            duration: '16',
            level: 'Intermediate',
            rating: 4.4,
            instructor: '何特教专家',
            category: '特殊教育'
          },
          {
            id: 'ai-rec-014',
            courseId: 'course-014',
            title: '项目式学习设计与实施',
            matchScore: 81,
            reasons: ['实践导向教学', '综合能力培养', '创新教学模式'],
            priority: 'medium',
            estimatedImpact: '提升学生实践能力',
            duration: '20',
            level: 'Intermediate',
            rating: 4.5,
            instructor: '谢项目经理',
            category: '项目教学'
          },
          {
            id: 'ai-rec-015',
            courseId: 'course-015',
            title: '教育游戏化设计与应用',
            matchScore: 77,
            reasons: ['趣味性教学', '学生参与度', '寓教于乐'],
            priority: 'low',
            estimatedImpact: '增强学习兴趣',
            duration: '14',
            level: 'Beginner',
            rating: 4.2,
            instructor: '韩游戏设计师',
            category: '游戏化教学'
          },
          {
            id: 'ai-rec-016',
            courseId: 'course-016',
            title: '教师沟通技巧与家校合作',
            matchScore: 79,
            reasons: ['沟通能力提升', '家校协作', '关系建设'],
            priority: 'medium',
            estimatedImpact: '改善教育生态',
            duration: '12',
            level: 'Beginner',
            rating: 4.6,
            instructor: '曹沟通专家',
            category: '沟通技巧'
          },
          {
            id: 'ai-rec-017',
            courseId: 'course-017',
            title: 'STEAM教育理念与实践',
            matchScore: 83,
            reasons: ['跨学科教学', '创新能力培养', '未来教育趋势'],
            priority: 'medium',
            estimatedImpact: '培养综合素养',
            duration: '22',
            level: 'Advanced',
            rating: 4.8,
            instructor: '袁STEAM专家',
            category: 'STEAM教育'
          },
          {
            id: 'ai-rec-018',
            courseId: 'course-018',
            title: '批判性思维教学方法',
            matchScore: 76,
            reasons: ['思维能力培养', '逻辑思维训练', '分析能力提升'],
            priority: 'medium',
            estimatedImpact: '提升学生思辨能力',
            duration: '16',
            level: 'Intermediate',
            rating: 4.4,
            instructor: '卢思维导师',
            category: '思维训练'
          },
          {
            id: 'ai-rec-019',
            courseId: 'course-019',
            title: '教育法律法规与师德建设',
            matchScore: 71,
            reasons: ['法律意识培养', '师德规范', '职业操守'],
            priority: 'high',
            estimatedImpact: '规范教学行为',
            duration: '8',
            level: 'Beginner',
            rating: 4.1,
            instructor: '姚法律顾问',
            category: '师德法规'
          },
          {
            id: 'ai-rec-020',
            courseId: 'course-020',
            title: '人工智能在教育中的应用',
            matchScore: 84,
            reasons: ['前沿技术应用', 'AI辅助教学', '未来教育发展'],
            priority: 'low',
            estimatedImpact: '掌握AI教学工具',
            duration: '18',
            level: 'Advanced',
            rating: 4.7,
            instructor: '邵AI专家',
            category: 'AI教育'
          }
        ],
        learningPath: {
          phase1: {
            title: '基础理论学习',
            duration: '2周',
            courses: ['course-001']
          },
          phase2: {
            title: '技能实践应用',
            duration: '3周',
            courses: ['course-002']
          },
          phase3: {
            title: '综合能力提升',
            duration: '2周',
            courses: ['course-003']
          }
        }
      };
      
      setAiAnalysis(analysis);
      setAiRecommendations(analysis.recommendations);
    } catch (error) {
      console.error('AI推荐生成失败:', error);
      message.error('AI推荐生成失败');
    } finally {
      setAiLoading(false);
    }
  };

  // 加载计划历史
  const loadPlanHistory = () => {
    const history = [
      {
        id: 'plan-001',
        name: '初始AI推荐方案',
        type: 'ai',
        createdAt: new Date(),
        courses: ['course-001', 'course-002'],
        status: 'draft'
      }
    ];
    setPlanHistory(history);
  };

  // 添加课程到人工配课
  const addToManualPlan = (course) => {
    if (!manualCourses.find(c => c.id === course.id)) {
      setManualCourses([...manualCourses, course]);
      message.success(`已添加课程：${course.title}`);
    } else {
      message.warning('课程已存在于配课方案中');
    }
  };

  // 从人工配课中移除课程
  const removeFromManualPlan = (courseId) => {
    setManualCourses(manualCourses.filter(c => c.id !== courseId));
    message.success('已移除课程');
  };

  // 保存配课方案
  const savePlan = async (planData) => {
    try {
      const newPlan = {
        id: `plan-${Date.now()}`,
        trainingNeedId: trainingNeed.id,
        name: planData.name,
        description: planData.description,
        courses: planData.courses,
        type: planData.type,
        createdAt: new Date(),
        status: 'saved'
      };
      
      setPlanHistory([newPlan, ...planHistory]);
      setFinalPlan(newPlan);
      
      if (onSave) {
        onSave(newPlan);
      }
      
      message.success('配课方案已保存');
      setShowPlanModal(false);
    } catch (error) {
      console.error('保存方案失败:', error);
      message.error('保存方案失败');
    }
  };

  // 渲染培训需求详情栏
  const renderNeedDetails = () => (
    <Card 
      title={
        <Space>
          <FileTextOutlined />
          <span>培训需求详情</span>
        </Space>
      }
      size="small"
      style={{ height: '100%' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>需求标题：</Text>
          <Paragraph>{trainingNeed?.title}</Paragraph>
        </div>
        
        <div>
          <Text strong>需求描述：</Text>
          <Paragraph>{trainingNeed?.description}</Paragraph>
        </div>
        
        <div>
          <Text strong>目标人群：</Text>
          <Tag color="blue">{trainingNeed?.targetAudience || '新入职教师'}</Tag>
        </div>
        
        <div>
          <Text strong>技能标签：</Text>
          <Space wrap>
            {(trainingNeed?.tags || []).map(tag => (
              <Tag key={tag} color="green">{tag}</Tag>
            ))}
          </Space>
        </div>
        
        <div>
          <Text strong>优先级：</Text>
          <Tag color={trainingNeed?.priority === 'high' ? 'red' : 'orange'}>
            {trainingNeed?.priority === 'high' ? '高' : '中'}
          </Tag>
        </div>
        
        <div>
          <Text strong>预期时长：</Text>
          <Text>{trainingNeed?.expectedDuration || '40学时'}</Text>
        </div>
      </Space>
    </Card>
  );

  // 渲染AI推荐栏
  const renderAIRecommendations = () => (
    <Card 
      title={
        <Space>
          <RobotOutlined />
          <span>AI智能推荐</span>
          {aiLoading && <Spin size="small" />}
        </Space>
      }
      size="small"
      style={{ height: '100%' }}
      extra={
        <Button 
          size="small" 
          icon={<ReloadOutlined />}
          onClick={generateAIRecommendations}
          loading={aiLoading}
        >
          重新分析
        </Button>
      }
    >
      {aiLoading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>AI正在分析培训需求...</Text>
          </div>
        </div>
      ) : (
        <Tabs size="small" defaultActiveKey="recommendations">
          <TabPane tab="推荐课程" key="recommendations">
            <List
              size="small"
              dataSource={aiRecommendations}
              grid={{ gutter: [8, 8], column: 4 }}
              renderItem={item => {
                const course = courseLibrary.find(c => c.id === item.courseId) || item;
                return (
                  <List.Item style={{ marginBottom: 0 }}>
                    <Card
                      size="small"
                      style={{ 
                        width: '100%', 
                        height: '140px',
                        borderRadius: '6px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      bodyStyle={{ 
                        padding: '8px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                      actions={[
                        <Button 
                          size="small" 
                          type="primary"
                          onClick={() => addToManualPlan(course)}
                          style={{ fontSize: '10px', height: '20px' }}
                        >
                          采纳
                        </Button>
                      ]}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <Avatar 
                          size={24} 
                          style={{ backgroundColor: '#52c41a', marginBottom: '6px' }}
                          icon={<RobotOutlined />}
                        />
                        <Text strong style={{ 
                          fontSize: '11px', 
                          display: 'block', 
                          marginBottom: '6px',
                          lineHeight: '1.2',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {item.title}
                        </Text>
                        <div style={{ 
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '2px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <Tag color="green" size="small" style={{ 
                            margin: 0, 
                            fontSize: '8px', 
                            padding: '0 3px', 
                            lineHeight: '14px' 
                          }}>
                            {item.duration}学时
                          </Tag>
                          <Tag color="cyan" size="small" style={{ 
                            margin: 0, 
                            fontSize: '8px', 
                            padding: '0 3px', 
                            lineHeight: '14px' 
                          }}>
                            {item.level}
                          </Tag>
                          <Tag color="blue" size="small" style={{ 
                            margin: 0, 
                            fontSize: '8px', 
                            padding: '0 3px', 
                            lineHeight: '14px' 
                          }}>
                            {item.matchScore}%
                          </Tag>
                        </div>
                        <Rate 
                          disabled 
                          defaultValue={item.rating} 
                          style={{ fontSize: '7px' }}
                        />
                      </div>
                    </Card>
                  </List.Item>
                );
              }}
            />
          </TabPane>
          
          <TabPane tab="学习路径" key="path">
            {aiAnalysis?.learningPath && (
              <Steps direction="vertical" size="small">
                {Object.entries(aiAnalysis.learningPath).map(([key, phase]) => (
                  <Step
                    key={key}
                    title={phase.title}
                    description={
                      <Space direction="vertical">
                        <Text>预计时长：{phase.duration}</Text>
                        <Text>包含课程：{phase.courses.length}门</Text>
                      </Space>
                    }
                    status="wait"
                  />
                ))}
              </Steps>
            )}
          </TabPane>
          
          <TabPane tab="需求分析" key="analysis">
            {aiAnalysis?.needsAnalysis && (
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>核心技能：</Text>
                  <div>
                    {aiAnalysis.needsAnalysis.primarySkills.map(skill => (
                      <Tag key={skill} color="purple">{skill}</Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <Text strong>紧急程度：</Text>
                  <Tag color="red">{aiAnalysis.needsAnalysis.urgencyLevel}</Tag>
                </div>
                <div>
                  <Text strong>目标群体：</Text>
                  <Text>{aiAnalysis.needsAnalysis.targetAudience}</Text>
                </div>
                <div>
                  <Text strong>建议时长：</Text>
                  <Text>{aiAnalysis.needsAnalysis.estimatedDuration}</Text>
                </div>
              </Space>
            )}
          </TabPane>
        </Tabs>
      )}
    </Card>
  );

  // 渲染人工配课栏
  const renderManualCourseSelection = () => (
    <Card 
      title={
        <Space>
          <UserOutlined />
          <span>人工配课</span>
        </Space>
      }
      size="small"
      style={{ height: '100%' }}
      extra={
        <Button 
          size="small" 
          icon={<SearchOutlined />}
          onClick={() => setShowCourseModal(true)}
        >
          浏览课程库
        </Button>
      }
    >
      <Tabs size="small" defaultActiveKey="selected">
        <TabPane tab={`已选课程 (${manualCourses.length})`} key="selected">
          {manualCourses.length === 0 ? (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无选择的课程"
            />
          ) : (
            <List
              size="small"
              dataSource={manualCourses}
              grid={{ gutter: [8, 8], column: 4 }}
              renderItem={course => (
                <List.Item style={{ marginBottom: 0 }}>
                  <Card
                    size="small"
                    style={{ 
                      width: '100%',
                      height: '140px',
                      borderRadius: '6px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    bodyStyle={{ 
                      padding: '8px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                    actions={[
                      <Button 
                        size="small" 
                        danger
                        type="text"
                        onClick={() => removeFromManualPlan(course.id)}
                        style={{ fontSize: '10px', height: '20px' }}
                      >
                        移除
                      </Button>
                    ]}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <Avatar 
                        size={24} 
                        style={{ backgroundColor: '#1890ff', marginBottom: '6px' }}
                        icon={<BookOutlined />}
                      />
                      <Text strong style={{ 
                        fontSize: '11px', 
                        display: 'block', 
                        marginBottom: '6px',
                        lineHeight: '1.2',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {course.title}
                      </Text>
                      <div style={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '2px',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Tag color="geekblue" size="small" style={{ 
                          margin: 0, 
                          fontSize: '8px', 
                          padding: '0 3px', 
                          lineHeight: '14px' 
                        }}>
                          {course.duration}学时
                        </Tag>
                        <Tag color="blue" size="small" style={{ 
                          margin: 0, 
                          fontSize: '8px', 
                          padding: '0 3px', 
                          lineHeight: '14px' 
                        }}>
                          {course.level}
                        </Tag>
                        <Rate 
                          disabled 
                          defaultValue={course.rating} 
                          style={{ fontSize: '7px' }}
                        />
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </TabPane>
        
        <TabPane tab="推荐课程" key="recommended">
          <List
              size="small"
              dataSource={courseLibrary.slice(0, 20)}
              grid={{ gutter: [8, 6], column: 4 }}
              renderItem={course => (
                <List.Item style={{ marginBottom: 0 }}>
                  <Card
                    size="small"
                    style={{ 
                      width: '100%',
                      height: '100px',
                      borderRadius: '6px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    bodyStyle={{ 
                      padding: '4px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                    actions={[
                      <Button 
                        size="small" 
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => addToManualPlan(course)}
                        style={{ fontSize: '10px', height: '20px' }}
                      >
                        添加
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      avatar={
                        <Avatar 
                          size={20} 
                          style={{ backgroundColor: '#52c41a' }}
                          icon={<BookOutlined />}
                        />
                      }
                      title={
                        <Text 
                          strong 
                          style={{ 
                            fontSize: '10px',
                            lineHeight: '1.1',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            marginBottom: '2px'
                          }}
                        >
                          {course.title}
                        </Text>
                      }
                      description={
                        <div style={{ 
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '1px',
                          marginTop: '1px'
                        }}>
                          <Tag color="geekblue" size="small" style={{ margin: 0, fontSize: '8px', padding: '0 3px', lineHeight: '14px' }}>
                            {course.duration}学时
                          </Tag>
                          <Tag color="blue" size="small" style={{ margin: 0, fontSize: '8px', padding: '0 3px', lineHeight: '14px' }}>
                            {course.level}
                          </Tag>
                          <Rate 
                            disabled 
                            defaultValue={course.rating} 
                            style={{ fontSize: '7px' }}
                          />
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
        </TabPane>
      </Tabs>
    </Card>
  );

  // 渲染协同对比栏
  const renderCollaborativeComparison = () => (
    <Card 
      title={
        <Space>
          <SyncOutlined />
          <span>方案对比</span>
        </Space>
      }
      size="small"
      style={{ height: '100%' }}
      extra={
        <Switch
          checked={comparisonMode}
          onChange={setComparisonMode}
          checkedChildren="对比模式"
          unCheckedChildren="单独模式"
        />
      }
    >
      {comparisonMode ? (
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="AI推荐方案" type="inner">
              <Statistic 
                title="推荐课程数" 
                value={aiRecommendations.length} 
                suffix="门"
              />
              <Statistic 
                title="平均匹配度" 
                value={aiRecommendations.reduce((acc, rec) => acc + rec.matchScore, 0) / aiRecommendations.length || 0} 
                suffix="%" 
                precision={1}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="人工配课方案" type="inner">
              <Statistic 
                title="选择课程数" 
                value={manualCourses.length} 
                suffix="门"
              />
              <Statistic 
                title="总学时" 
                value={manualCourses.reduce((acc, course) => acc + course.duration, 0)} 
                suffix="学时"
              />
            </Card>
          </Col>
        </Row>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="协同配课建议"
            description="结合AI推荐和人工经验，制定最优的培训方案"
            type="info"
            showIcon
          />
          
          <Button 
            type="primary" 
            block
            icon={<SaveOutlined />}
            onClick={() => setShowPlanModal(true)}
            disabled={manualCourses.length === 0 && aiRecommendations.length === 0}
          >
            保存最终方案
          </Button>
        </Space>
      )}
    </Card>
  );

  return (
    <Layout style={{ height: hideHeader ? '100%' : '100vh', background: '#f0f2f5' }}>
      {/* 头部工具栏 - 根据hideHeader属性决定是否显示 */}
      {!hideHeader && (
        <div style={{ 
          background: '#fff', 
          padding: '16px 24px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
              返回
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              配课工作台 - {trainingNeed?.title}
            </Title>
          </Space>
          
          <Space>
            <Radio.Group 
              value={workspaceMode} 
              onChange={e => setWorkspaceMode(e.target.value)}
              size="small"
            >
              <Radio.Button value="collaborative">协同模式</Radio.Button>
              <Radio.Button value="ai-only">AI模式</Radio.Button>
              <Radio.Button value="manual-only">人工模式</Radio.Button>
            </Radio.Group>
            
            <Button icon={<HistoryOutlined />}>
              历史方案
            </Button>
            
            <Button type="primary" icon={<SaveOutlined />}>
              保存草稿
            </Button>
          </Space>
        </div>
      )}

      {/* 主要内容区域 */}
      <Content style={{ padding: hideHeader ? '0' : '16px', height: hideHeader ? '100%' : 'auto' }}>
        <Row gutter={16} style={{ height: '100%' }}>
          {/* 左侧：培训需求详情 */}
          <Col span={4}>
            {renderNeedDetails()}
          </Col>
          
          {/* 中间：AI推荐和人工配课 */}
          <Col span={16}>
            <Row gutter={[16, 16]} style={{ height: '100%' }}>
              {(workspaceMode === 'collaborative' || workspaceMode === 'ai-only') && (
                <Col span={24} style={{ height: '50%' }}>
                  {renderAIRecommendations()}
                </Col>
              )}
              
              {(workspaceMode === 'collaborative' || workspaceMode === 'manual-only') && (
                <Col span={24} style={{ height: workspaceMode === 'collaborative' ? '50%' : '100%' }}>
                  {renderManualCourseSelection()}
                </Col>
              )}
            </Row>
          </Col>
          
          {/* 右侧：协同对比和操作 */}
          <Col span={4}>
            {renderCollaborativeComparison()}
          </Col>
        </Row>
      </Content>

      {/* 课程库浏览模态框 */}
      <Modal
        title="课程库"
        open={showCourseModal}
        onCancel={() => setShowCourseModal(false)}
        width={800}
        footer={null}
      >
        <List
          dataSource={courseLibrary}
          renderItem={course => (
            <List.Item
              actions={[
                <Button 
                  type="primary"
                  onClick={() => {
                    addToManualPlan(course);
                    setShowCourseModal(false);
                  }}
                >
                  选择课程
                </Button>
              ]}
            >
              <List.Item.Meta
                title={course.title}
                description={
                  <Space direction="vertical">
                    <Text>{course.description}</Text>
                    <Space>
                      <Tag>{course.duration}学时</Tag>
                      <Tag color="blue">{course.level}</Tag>
                      <Tag color="green">¥{course.price}</Tag>
                      <Rate disabled defaultValue={course.rating} size="small" />
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* 保存方案模态框 */}
      <Modal
        title="保存配课方案"
        open={showPlanModal}
        onCancel={() => setShowPlanModal(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const planData = {
              ...values,
              courses: [...manualCourses, ...aiRecommendations.map(rec => 
                courseLibrary.find(c => c.id === rec.courseId)
              ).filter(Boolean)],
              type: 'collaborative'
            };
            savePlan(planData);
          }}
        >
          <Form.Item
            name="name"
            label="方案名称"
            rules={[{ required: true, message: '请输入方案名称' }]}
          >
            <Input placeholder="请输入配课方案名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="方案描述"
          >
            <TextArea rows={4} placeholder="请描述配课方案的特点和目标" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CourseWorkspace;