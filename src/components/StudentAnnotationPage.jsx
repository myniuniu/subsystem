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
  Popconfirm,
  Dropdown,
  Popover,
  Collapse,
  Radio
} from 'antd';
import MaterialAddPage from './MaterialAddPage';
import ExploreModal from './ExploreModal';
import RuleAnnotationModal from './RuleAnnotationModal';
import RuleManagementModal from './RuleManagementModal';
import StudentAnnotationTree from './StudentAnnotationTree';
import ruleScheduler from '../utils/ruleScheduler';
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
  UserOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  GlobalOutlined,
  MoreOutlined,
  EditOutlined,
  TagOutlined,
  SettingOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Lightbulb } from 'lucide-react';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const ResourceAnnotationPage = ({ onBack, onViewChange, selectedNeed, mode = 'create' }) => {
  // 资料收集相关状态
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: '教师专业发展指导手册.pdf', type: 'application/pdf', uploadTime: '刚刚' },
    { id: 2, name: '现代教育技术应用培训资料.pdf', type: 'application/pdf', uploadTime: '2分钟前' },
    { id: 3, name: '核心素养导向的课程设计指南.pdf', type: 'application/pdf', uploadTime: '5分钟前' }
  ]);
  
  // 多选功能状态
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showMaterialDetail, setShowMaterialDetail] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [links, setLinks] = useState([
    { id: 2, url: 'https://teacher-training.edu.cn', title: '教师培训资源平台', addTime: '刚刚' },
    { id: 3, url: 'https://education-tech.org', title: '教育技术发展研究网', addTime: '3分钟前' },
    { id: 4, url: 'https://core-competency.edu', title: '核心素养教育资源库', addTime: '8分钟前' }
  ]);
  const [newLink, setNewLink] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMaterialAddModal, setShowMaterialAddModal] = useState(false);
  const [websiteType, setWebsiteType] = useState('normal'); // 'normal' 或 'video'
  const [websiteUrl, setWebsiteUrl] = useState('');
  
  // 文字内容相关状态
  const [textContent, setTextContent] = useState('');
  const [addedTexts, setAddedTexts] = useState([
    { 
      id: 4, 
      title: '教师培训需求分析', 
      content: '在教育改革不断深化、教育技术飞速发展的当下，传统的教学模式和教师知识结构已难以完全适配新时代教育教学的要求。当前，部分教师在教学过程中面临诸多挑战，例如，对核心素养导向的课程设计理解不够深入，难以将核心素养有效融入课堂教学环节；在运用多媒体、人工智能等现代教育技术辅助教学时，存在操作不熟练、应用方式单一等问题，无法充分发挥技术对教学的赋能作用；同时，面对学生个性化发展需求日益增长的情况，教师在差异化教学策略的制定与实施方面能力不足，难以满足不同学习层次、不同兴趣特长学生的学习需求。此外，随着教育评价体系的不断完善，教师对新型教育评价方法的掌握和运用也存在欠缺，影响了教学质量的进一步提升。为解决上述问题，助力教师提升专业素养和教学能力，更好地适应教育发展新形势，特开展本次教师培训。', 
      addTime: '刚刚' 
    },
    { 
      id: 5, 
      title: '教师信息技术能力提升方案', 
      content: '随着信息技术在教育领域的深度融合，教师的信息技术应用能力已成为影响教学质量的关键因素。本方案旨在通过系统性培训，帮助教师掌握现代教育技术工具的使用方法，提升数字化教学设计能力，培养创新教学思维。培训内容包括：多媒体课件制作技巧、在线教学平台操作、教学资源数字化处理、学习分析与数据驱动教学、人工智能辅助教学应用等核心模块。通过理论学习与实践操作相结合的方式，确保教师能够熟练运用信息技术优化教学过程，提高教学效果。', 
      addTime: '10分钟前' 
    },
    { 
      id: 6, 
      title: '差异化教学策略研究', 
      content: '面对学生个体差异日益显著的教学现实，传统的"一刀切"教学模式已无法满足所有学生的学习需求。差异化教学作为一种以学生为中心的教学理念，强调根据学生的学习风格、能力水平、兴趣特点等因素，灵活调整教学内容、方法和评价方式。本研究通过分析不同类型学生的学习特征，提出了多元化的教学策略：包括分层教学法、合作学习模式、项目式学习、翻转课堂等创新教学方法。同时，探讨了如何运用学习分析技术，实现精准教学和个性化学习支持，为教师实施差异化教学提供科学依据和实践指导。', 
      addTime: '15分钟前' 
    }
  ]);
  
  // 课程视频相关状态
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [courseVideos, setCourseVideos] = useState([
    { id: 4, title: '现代教学方法与技巧', url: 'https://edu-video.com/modern-teaching', addTime: '刚刚' },
    { id: 5, title: '信息技术与课程整合', url: 'https://edu-video.com/tech-integration', addTime: '5分钟前' },
    { id: 6, title: '学生心理发展与教育', url: 'https://edu-video.com/student-psychology', addTime: '12分钟前' }
  ]);

  // 标注相关状态
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [annotationTags, setAnnotationTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  


  // 研究论文相关状态
  const [researchPapers, setResearchPapers] = useState([
    { 
      id: 1, 
      title: '基于核心素养的教师专业发展研究', 
      authors: '张明华, 李晓红, 王建国', 
      journal: '教育研究', 
      year: '2023', 
      abstract: '本研究基于核心素养理念，构建了教师专业发展的理论框架，通过对500名中小学教师的调研，分析了当前教师在核心素养导向教学中面临的挑战，提出了系统性的专业发展路径和策略建议。',
      keywords: ['核心素养', '教师专业发展', '教学能力', '培训体系'],
      addTime: '刚刚' 
    },
    { 
      id: 2, 
      title: '信息技术与教育教学深度融合的实证研究', 
      authors: '陈志强, 刘美玲', 
      journal: '中国电化教育', 
      year: '2023', 
      abstract: '研究采用混合研究方法，深入分析了信息技术在教育教学中的应用现状，识别了技术融合的关键影响因素，构建了深度融合的评价指标体系，为教师信息技术能力提升提供了科学依据。',
      keywords: ['信息技术', '教育融合', '数字化教学', '教师培训'],
      addTime: '5分钟前' 
    },
    { 
      id: 3, 
      title: '差异化教学策略对学生学习效果的影响研究', 
      authors: '赵丽娟, 孙文博, 马晓峰', 
      journal: '教育科学研究', 
      year: '2022', 
      abstract: '通过准实验设计，比较分析了差异化教学策略与传统教学方法对不同类型学生学习效果的影响，结果表明差异化教学能显著提升学生的学习动机和学业成就，为教师实施个性化教学提供了实证支持。',
      keywords: ['差异化教学', '个性化学习', '学习效果', '教学策略'],
      addTime: '10分钟前' 
    }
  ]);

  // 调研报告相关状态
  const [surveys, setSurveys] = useState([
    { 
      id: 1, 
      title: '2023年全国中小学教师培训需求调研报告', 
      organization: '教育部教师工作司', 
      date: '2023年8月', 
      summary: '本次调研覆盖全国31个省市自治区，共收集有效问卷15,847份。调研发现，教师在信息技术应用、学科教学能力、学生心理健康教育等方面存在较大培训需求，其中67%的教师希望加强现代教育技术培训。',
      keyFindings: ['信息技术应用能力不足', '缺乏差异化教学方法', '学生心理健康教育知识欠缺', '教育评价方法单一'],
      addTime: '刚刚' 
    },
    { 
      id: 2, 
      title: '教师专业发展现状与需求分析报告', 
      organization: '中国教育科学研究院', 
      date: '2023年6月', 
      summary: '通过深度访谈和问卷调查相结合的方式，对1,200名一线教师进行了专业发展现状调研。结果显示，教师普遍认为当前培训内容与实际教学需求存在脱节，希望获得更多实用性强的培训内容。',
      keyFindings: ['培训内容实用性不强', '培训形式单一', '缺乏持续跟踪指导', '评价反馈机制不完善'],
      addTime: '8分钟前' 
    },
    { 
      id: 3, 
      title: '数字化时代教师能力素养调研分析', 
      organization: '华东师范大学教育学部', 
      date: '2023年4月', 
      summary: '针对数字化转型背景下教师能力素养现状进行深入调研，发现教师在数字化教学设计、在线教学实施、学习数据分析等方面能力有待提升，建议建立分层分类的数字化能力培训体系。',
      keyFindings: ['数字化教学设计能力薄弱', '在线教学技能不足', '数据分析应用缺乏', '数字化评价方法陌生'],
      addTime: '15分钟前' 
    }
  ]);

  // 案例研究相关状态
  const [caseStudies, setCaseStudies] = useState([
    { 
      id: 1, 
      title: '北京市海淀区教师信息技术能力提升培训案例', 
      location: '北京市海淀区', 
      duration: '2022年9月-2023年6月', 
      participants: '全区中小学教师2,800人', 
      description: '海淀区教委实施的大规模教师信息技术能力提升培训项目，采用"理论学习+实践操作+跟踪指导"的培训模式，取得显著成效。',
      methods: ['分层培训', '项目式学习', '同伴互助', '专家指导'],
      outcomes: ['教师信息技术应用能力显著提升', '数字化教学资源使用率提高85%', '学生学习效果明显改善', '形成可复制推广的培训模式'],
      addTime: '刚刚' 
    },
    { 
      id: 2, 
      title: '上海市浦东新区差异化教学实践案例', 
      location: '上海市浦东新区', 
      duration: '2022年3月-2023年2月', 
      participants: '试点学校教师450人', 
      description: '浦东新区选取15所试点学校，开展差异化教学策略培训与实践，通过课堂观察、学生访谈等方式评估培训效果，形成了系统的差异化教学实施方案。',
      methods: ['行动研究', '课例研讨', '反思总结', '经验分享'],
      outcomes: ['教师差异化教学意识增强', '个性化教学策略更加丰富', '学生学习积极性提高', '教学质量稳步提升'],
      addTime: '12分钟前' 
    },
    { 
      id: 3, 
      title: '深圳市南山区教师专业学习共同体建设案例', 
      location: '深圳市南山区', 
      duration: '2021年9月-2023年7月', 
      participants: '区内各学科教师1,200人', 
      description: '南山区教育局构建了以学科为纽带的教师专业学习共同体，通过定期研讨、课题研究、成果分享等活动，促进教师专业成长和教学质量提升。',
      methods: ['学习共同体', '课题研究', '同课异构', '成果展示'],
      outcomes: ['教师专业发展内驱力增强', '学科教学水平整体提升', '形成浓厚的研究氛围', '建立可持续发展机制'],
      addTime: '20分钟前' 
    }
  ]);
  
  // 智能问答相关状态
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedResources, setRecommendedResources] = useState([]); // 新增：推荐的资源列表
  const [selectedSkill, setSelectedSkill] = useState(null); // 新增：选中的技能状态
  const [isRefreshingResourceTree, setIsRefreshingResourceTree] = useState(false); // 资源树刷新状态
  
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
  
  // 工具管理状态
  const [visibleTools, setVisibleTools] = useState(['training-plan', 'schedule', 'participants']); // 可见的工具
  
  // 规则标注相关状态
  const [showRuleAnnotationModal, setShowRuleAnnotationModal] = useState(false);
  const [annotationRules, setAnnotationRules] = useState([]);
  const [showRuleManagementModal, setShowRuleManagementModal] = useState(false);
  
  // 探索弹窗相关状态
  const [showExploreModal, setShowExploreModal] = useState(false);
  
  // 操作记录状态
  const [operationRecords, setOperationRecords] = useState({
    audio: [],
    video: [],
    mindmap: [],
    'training-plan': [],
    report: [],
    ppt: [],
    webcode: [],
    file: [],
    text: [],
    link: []
  });

  // 内容查看弹窗状态
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalContent, setModalContent] = useState('');

  // 预览功能状态
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewType, setPreviewType] = useState('');
  
  // Hover状态管理 - 统一管理所有项目的hover状态
  const [hoveredItems, setHoveredItems] = useState({});
  const [previewData, setPreviewData] = useState(null);
  
  // 智能需求相关状态
  const [smartNotes, setSmartNotes] = useState([]);
  const [showSmartNotesModal, setShowSmartNotesModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // 编辑模式相关状态
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [needTitle, setNeedTitle] = useState('');
  const [needContent, setNeedContent] = useState('');



  // 初始化编辑数据和规则调度器
  useEffect(() => {
    if (selectedNeed && mode === 'edit') {
      setNeedTitle(selectedNeed.title || '');
      setNeedContent(selectedNeed.content || '');
      // 如果有其他需要预填充的数据，也在这里设置
      if (selectedNeed.materials) {
        setUploadedFiles(selectedNeed.materials || []);
      }
      if (selectedNeed.links) {
        setLinks(selectedNeed.links || []);
      }
      if (selectedNeed.texts) {
        setAddedTexts(selectedNeed.texts || []);
      }
      if (selectedNeed.videos) {
        setCourseVideos(selectedNeed.videos || []);
      }
    }

    // 启动规则调度器
    ruleScheduler.start();

    // 组件卸载时停止调度器
    return () => {
      ruleScheduler.stop();
    };
  }, [selectedNeed, mode]);

  // 处理标注按钮点击
  const handleAnnotation = () => {
    setShowAnnotationModal(true);
  };

  // 处理标签添加
  const handleAddTag = () => {
    if (currentTag.trim() && !annotationTags.includes(currentTag.trim())) {
      setAnnotationTags([...annotationTags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  // 处理标签删除
  const handleRemoveTag = (tagToRemove) => {
    setAnnotationTags(annotationTags.filter(tag => tag !== tagToRemove));
  };

  // 处理标注确认
  const handleAnnotationConfirm = () => {
    if (annotationTags.length === 0) {
      message.warning('请至少添加一个标签');
      return;
    }

    // 添加操作记录
    const newRecord = {
      id: Date.now(),
      title: `人员标注 - ${annotationTags.join(', ')}`,
        source: '人员标注系统',
      time: new Date().toLocaleString(),
      type: 'annotation',
      content: `
        <h3 style="color: #1890ff; margin-bottom: 15px;">🏷️ 人员标注记录</h3>
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f6ffed; border-radius: 8px;">
          <h4 style="color: #52c41a; margin-bottom: 10px;">📝 标注详情</h4>
          <div style="margin-left: 15px;">
            <p><strong>标注时间：</strong>${new Date().toLocaleString()}</p>
            <p><strong>标注用户：</strong>当前用户</p>
            <p><strong>添加标签：</strong></p>
            <div style="margin: 10px 0;">
              ${annotationTags.map(tag => `<span style="display: inline-block; background: #1890ff; color: white; padding: 4px 8px; border-radius: 12px; margin: 2px 4px; font-size: 12px;">${tag}</span>`).join('')}
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background-color: #fff7e6; border-radius: 8px;">
          <h4 style="color: #fa8c16; margin-bottom: 10px;">💡 标注说明</h4>
          <p>本次为资源添加了 ${annotationTags.length} 个标签，这些标签将帮助您更好地分类和管理资源。</p>
          <p>标签内容：${annotationTags.join('、')}</p>
        </div>
      `,
      tags: [...annotationTags],
      action: '人员标注',
      user: '当前用户'
    };

    // 将操作记录添加到对应的分类中（使用 'text' 分类存储标注记录）
    setOperationRecords(prev => ({
      ...prev,
      text: [newRecord, ...(prev.text || [])]
    }));
    
    // 重置状态
    setAnnotationTags([]);
    setCurrentTag('');
    setShowAnnotationModal(false);
    
    message.success(`成功添加 ${annotationTags.length} 个标签，操作记录已生成`);
  };

  // 处理标注取消
  const handleAnnotationCancel = () => {
    setAnnotationTags([]);
    setCurrentTag('');
    setShowAnnotationModal(false);
  };

  // 添加资源选择状态
  const [selectedTreeResources, setSelectedTreeResources] = useState([]);
  
  // 添加人员选择状态 - 支持多选
  const [selectedTreePersonnel, setSelectedTreePersonnel] = useState([]);
  


  // 保存需求
  const handleSaveNeed = () => {
    if (!needTitle.trim()) {
      message.error('请输入选课标题');
      return;
    }
    
    const needData = {
      id: selectedNeed?.id || Date.now(),
      title: needTitle,
      content: needContent,
      materials: uploadedFiles,
      links: links,
      texts: addedTexts,
      videos: courseVideos,
      updateTime: new Date().toLocaleString()
    };

    // 这里可以调用保存API
    message.success(mode === 'edit' ? '选课更新成功' : '选课创建成功');
    
    // 返回上一页
    if (onBack) {
      onBack();
    }
  };

  // 处理探索功能
  const handleExplore = (exploreData) => {
    const { query, source } = exploreData;
    
    // 模拟探索结果
    const mockResults = {
      web: [
        {
          id: Date.now() + 1,
          title: `关于"${query}"的网络资源`,
          url: `https://search.example.com/q=${encodeURIComponent(query)}`,
          content: `通过网络搜索找到的关于"${query}"的相关内容...`,
          addTime: '刚刚',
          source: 'Web搜索'
        }
      ],
      'google-drive': [
        {
          id: Date.now() + 2,
          title: `Google云端硬盘中的"${query}"相关文档`,
          url: `https://drive.google.com/search?q=${encodeURIComponent(query)}`,
          content: `从Google云端硬盘中找到的关于"${query}"的文档...`,
          addTime: '刚刚',
          source: 'Google云端硬盘'
        }
      ]
    };
    
    // 根据选择的来源添加结果到对应的资料列表
    const results = mockResults[source] || [];
    
    if (results.length > 0) {
      // 添加到链接列表
      setLinks(prev => [...results.map(r => ({
        id: r.id,
        url: r.url,
        title: r.title,
        addTime: r.addTime
      })), ...prev]);
      
      // 添加到文本内容列表
      setAddedTexts(prev => [...results.map(r => ({
        id: r.id + 1000,
        title: r.title,
        content: r.content,
        addTime: r.addTime,
        source: r.source
      })), ...prev]);
      
      message.success(`成功从${source === 'web' ? 'Web' : 'Google云端硬盘'}探索到${results.length}条相关资源`);
    } else {
      message.info('未找到相关资源，请尝试其他关键词');
    }
  };

  // 工具管理函数
  const handleAddTool = (toolType) => {
    const operationTitles = {
      audio: '音频概览',
      video: '视频概览', 
      mindmap: '思维导图',
      report: '分析报告',
      ppt: 'PPT演示',
      webcode: '网页代码',
      'training-plan': '培训方案',
      schedule: '课表',
      participants: '参训人员清单'
    };
    
    if (!visibleTools.includes(toolType)) {
      setVisibleTools(prev => [...prev, toolType]);
      message.success(`已添加${operationTitles[toolType]}工具`);
    }
  };

  const handleRemoveTool = (toolType) => {
    const operationTitles = {
      audio: '音频概览',
      video: '视频概览', 
      mindmap: '思维导图',
      report: '分析报告',
      ppt: 'PPT演示',
      webcode: '网页代码',
      'training-plan': '培训方案',
      schedule: '课表',
      participants: '参训人员清单'
    };
    
    setVisibleTools(prev => prev.filter(tool => tool !== toolType));
    message.success(`已移除${operationTitles[toolType]}工具`);
  };

  // 操作按钮点击处理函数
  const handleOperationClick = (operationType) => {
    const operationTitles = {
      audio: '音频概览',
      video: '视频概览', 
      mindmap: '思维导图',
      report: '分析报告',
      ppt: 'PPT演示',
      webcode: '网页代码',
      'training-plan': '培训方案',
      schedule: '课表',
      participants: '参训人员清单'
    };

    // 计算所有资料的总数
    const totalMaterials = uploadedFiles.length + addedTexts.length + courseVideos.length + links.length;

    // 对于培训方案，使用独立的培训方案类型；对于课表、参训人员，生成报告类型的操作记录
    const recordType = operationType === 'training-plan' ? 'training-plan' : 
                      ['schedule', 'participants'].includes(operationType) ? 'report' : operationType;

    const newRecord = {
      id: Date.now(),
      title: `基于${totalMaterials}个资料生成${operationTitles[operationType]}`,
      source: `${totalMaterials}个来源`,
      time: '刚刚',
      type: operationType === 'training-plan' ? 'training-plan' : recordType
    };

    setOperationRecords(prev => ({
      ...prev,
      [recordType]: [newRecord, ...prev[recordType]]
    }));

    message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
  };

  // 保存AI回复到需求
  const handleSaveToNote = (content) => {
    const newRecord = {
      id: Date.now(),
      title: `AI问答需求 - ${new Date().toLocaleString()}`,
      source: 'AI智能问答',
      time: '刚刚',
      type: 'report',
      content: content
    };

    setOperationRecords(prev => ({
      ...prev,
      report: [newRecord, ...prev.report]
    }));

    message.success('AI回复已保存到需求');
  };

  // 处理更多操作菜单点击
  const handleMoreAction = (action, record) => {
    switch (action) {
      case 'advancedEdit':
        // 高级编辑知识图谱
        console.log('高级编辑知识图谱:', record);
        Modal.confirm({
          title: '高级编辑知识图谱',
          width: 600,
          content: (
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: 16 }}>
                <Text strong>当前知识图谱：</Text>
                <div style={{ 
                  padding: '12px', 
                  background: '#f6f6f6', 
                  borderRadius: '6px', 
                  margin: '8px 0' 
                }}>
                  <div><Text strong>{record.title}</Text></div>
                  <div><Text type="secondary">来源：{record.source}</Text></div>
                  <div><Text type="secondary">时间：{record.time}</Text></div>
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <Text strong>高级编辑选项：</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 8 }}>
                    🔧 <Text>结构优化</Text> - 重新组织知识点关系
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    📊 <Text>数据增强</Text> - 补充相关概念和属性
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    🎯 <Text>关系映射</Text> - 建立更精确的概念连接
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    🔍 <Text>语义分析</Text> - 深度理解概念含义
                  </div>
                </div>
              </div>
              
              <Text type="secondary" style={{ fontSize: '12px' }}>
                高级编辑将使用AI技术对知识图谱进行深度优化和重构
              </Text>
            </div>
          ),
          okText: '开始高级编辑',
          cancelText: '取消',
          onOk: () => {
            message.loading('正在进行高级编辑...', 2);
            setTimeout(() => {
              // 创建新的优化后的操作记录
              const optimizedRecord = {
                id: Date.now(),
                title: `${record.title} (高级编辑版)`,
                content: `经过AI高级编辑优化的知识图谱，包含：\n• 重新优化的概念结构\n• 增强的关系映射\n• 补充的语义信息\n• 改进的知识点连接`,
                time: '刚刚',
                source: '知识图谱高级编辑系统',
                type: 'knowledge-graph',
                tags: ['高级编辑', '优化版本', 'AI增强'],
                originalRecord: record // 保存原始记录引用
              };
              
              // 添加到操作记录
              setOperationRecords(prev => ({
                ...prev,
                'knowledge-graph': [optimizedRecord, ...(prev['knowledge-graph'] || [])]
              }));
              
              message.success(`知识图谱"${record.title}"高级编辑完成！`);
            }, 2000);
          }
        });
        break;
      case 'submit':
        // 提交培训方案
        message.loading('正在提交培训方案...', 1);
        setTimeout(() => {
          message.success(`培训方案"${record.title}"已成功提交！`);
          // 这里可以添加实际的提交逻辑，比如调用API
          console.log('提交培训方案:', record);
        }, 1000);
        break;
      case 'convertToSource':
        // 将操作记录转换为资料来源
        const newMaterial = {
          id: Date.now(),
          title: record.title,
          content: record.content || `来源于操作记录：${record.title}`,
          addTime: '刚刚',
          source: record.source || '操作记录转换'
        };
        
        // 根据记录类型添加到对应的资料数组
        if (record.type === 'report' || record.type === 'mindmap' || record.type === 'training-plan') {
          setAddedTexts(prev => [newMaterial, ...prev]);
        } else if (record.type === 'video' || record.type === 'audio') {
          setCourseVideos(prev => [{
            ...newMaterial,
            url: record.url || 'https://converted-from-record.com'
          }, ...prev]);
        } else {
          setAddedTexts(prev => [newMaterial, ...prev]);
        }
        
        message.success(`已将"${record.title}"转换为来源并保存到资料`);
        break;
      case 'delete':
        // 从操作记录中删除该记录
        setOperationRecords(prev => {
          const newRecords = { ...prev };
          Object.keys(newRecords).forEach(type => {
            newRecords[type] = newRecords[type].filter(r => r.id !== record.id);
          });
          return newRecords;
        });
        message.success(`已删除"${record.title}"`);
        break;
      default:
        break;
    }
  };

  // 获取更多操作菜单项
  const getMoreMenuItems = (record) => {
    const commonItems = [
      {
        key: 'delete',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🗑️</span>
            <span>删除</span>
          </div>
        ),
        onClick: () => handleMoreAction('delete', record)
      }
    ];

    // 知识图谱类型添加高级编辑功能
    if (record.type === 'knowledge-graph' || record.source === '知识图谱标注系统' || record.title?.includes('知识图谱')) {
      return [
        {
          key: 'advancedEdit',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>⚙️</span>
              <span>高级编辑</span>
            </div>
          ),
          onClick: () => handleMoreAction('advancedEdit', record)
        },
        ...commonItems
      ];
    }

    // 培训方案类型添加提交按钮
    if (record.type === 'training-plan') {
      return [
        {
          key: 'submit',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📤</span>
              <span>提交</span>
            </div>
          ),
          onClick: () => handleMoreAction('submit', record)
        },
        {
          key: 'convertToSource',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              <span>转换为来源</span>
            </div>
          ),
          onClick: () => handleMoreAction('convertToSource', record)
        },
        ...commonItems
      ];
    }

    // 报告类型添加额外选项
    if (record.type === 'report') {
      return [
        {
          key: 'convertToSource',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              <span>转换为来源</span>
            </div>
          ),
          onClick: () => handleMoreAction('convertToSource', record)
        },
        ...commonItems
      ];
    }

    return commonItems;
  };



  // 处理记录点击打开
  const handleRecordClick = (record) => {
    setCurrentRecord(record);
    
    // 直接显示记录的内容，不进行包装
    if (record.content) {
      setModalContent(record.content);
    } else {
      // 如果没有内容，显示简单的提示
      setModalContent(`
        <div style="padding: 20px; text-align: center; color: #999;">
          <p>暂无具体内容</p>
        </div>
      `);
    }
    
    setShowContentModal(true);
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

  // 处理资源推荐回调
  const handleResourceRecommend = (resources) => {
    setRecommendedResources(resources);
    message.success(`为您推荐了 ${resources.length} 个相关资源，正在刷新资源树...`);
    
    // 触发资源树刷新动画
    setIsRefreshingResourceTree(true);
    
    // 模拟2秒刷新时间
    setTimeout(() => {
      setIsRefreshingResourceTree(false);
      message.success('资源树刷新完成，推荐资源已高亮显示');
    }, 2000);
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
    
    // 根据选中的技能处理不同逻辑
    if (selectedSkill && selectedSkill.key === 'knowledge-graph') {
      // 知识图谱技能处理
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `基于您的需求："${inputMessage}"，我为您生成了以下知识图谱：\n\n🔗 核心概念关系图\n📊 相关数据分析\n🎯 关键知识点连接\n\n这个知识图谱展示了主要概念之间的关联关系，帮助您更好地理解和掌握相关知识。`,
          timestamp: new Date().toISOString(),
          hasTransferAction: true // 标记此消息有转来源操作
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 2000);
    } else if (selectedSkill && selectedSkill.key === 'resource-recommend') {
      // 资源推荐技能处理
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `基于您的问题："${inputMessage}"，我正在为您推荐相关资源...`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
        
        // 模拟资源推荐逻辑
        const mockRecommendedResources = [];
        const keywords = inputMessage.toLowerCase();
        
        // 根据关键词推荐相关资源
        if (keywords.includes('心理') || keywords.includes('健康') || keywords.includes('情绪')) {
          mockRecommendedResources.push({ id: 'sm_001' }); // 学生心理健康教育
        }
        if (keywords.includes('管理') || keywords.includes('班级') || keywords.includes('纪律')) {
          mockRecommendedResources.push({ id: 'sm_002' }); // 班级管理实用手册
        }
        if (keywords.includes('激励') || keywords.includes('评价') || keywords.includes('策略')) {
          mockRecommendedResources.push({ id: 'sm_003' }); // 学生激励与评价策略
        }
        
        // 如果有推荐资源，触发推荐回调
        if (mockRecommendedResources.length > 0) {
          handleResourceRecommend(mockRecommendedResources);
        } else {
          // 没有找到相关资源时的提示
          setTimeout(() => {
            const noResourceResponse = {
              id: Date.now() + 2,
              type: 'assistant',
              content: `抱歉，暂时没有找到与"${inputMessage}"相关的资源。请尝试使用其他关键词，如"心理"、"管理"、"激励"等。`,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, noResourceResponse]);
          }, 500);
        }
        
        setIsLoading(false);
      }, 1500);
    } else {
      // 默认处理逻辑（没有选择技能时）
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `基于您上传的资料，我理解您的问题是："${inputMessage}"。根据现有资料分析，我建议您可以选择相应的技能来获得更专业的帮助。`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    }
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
    // 直接预览原材料
    setPreviewData(material);
    setPreviewType(type);
    setShowPreviewModal(true);
  };

  // 预览资料功能
  const handlePreviewMaterial = (material, type) => {
    setPreviewData(material);
    setPreviewType(type);
    setShowPreviewModal(true);
  };

  // 智能需求生成功能
  const generateSmartNote = (material, type) => {
    let smartNote = {
      id: Date.now(),
      type: type,
      title: material.title || material.name,
      originalData: material,
      summary: '',
      keyPoints: [],
      tags: [],
      possibleQuestions: [],
      createdAt: new Date().toLocaleString()
    };

    // 根据不同类型生成智能摘要
    switch (type) {
      case 'file':
        smartNote.summary = `文件资料：${material.name}，类型：${material.type || '未知'}。该文件可能包含重要的教学资源或参考材料，建议进一步分析文件内容以提取关键信息，用于教师培训和教学改进。`;
        smartNote.keyPoints = ['文件已上传', '待内容分析', '可用于AI问答', '支持多种格式'];
        smartNote.tags = ['文件', material.type || '未知类型', '教学资源'];
        smartNote.possibleQuestions = [
          '这个文件的主要内容是什么？',
          '文件中有哪些关键信息点？',
          '如何将这个文件应用到教学中？',
          '文件内容与当前教学目标的关联性如何？'
        ];
        break;
      
      case 'video':
        smartNote.summary = `视频资料：${material.title}。该视频可能包含教学演示、培训内容或案例分析，是重要的视觉学习材料。建议观看并记录要点，提取可用于教师培训的关键信息。`;
        smartNote.keyPoints = ['视频已添加', '包含音视频内容', '适合深度学习', '可重复观看'];
        smartNote.tags = ['视频', '学习资料', '教师培训'];
        if (material.url.includes('bilibili.com')) {
          smartNote.tags.push('B站');
        } else if (material.url.includes('youtube.com')) {
          smartNote.tags.push('YouTube');
        }
        smartNote.possibleQuestions = [
          '视频中展示了哪些教学方法？',
          '视频内容如何应用到实际教学中？',
          '视频中有哪些值得学习的教学技巧？',
          '如何基于视频内容设计培训活动？'
        ];
        break;
      
      case 'link':
        smartNote.summary = `网站链接：${material.title}。该网页可能包含教育资源、研究报告或教学工具，是有价值的在线参考资料。建议浏览并提取关键内容，用于丰富教学资源库。`;
        smartNote.keyPoints = ['网站已添加', '可在线访问', '内容待分析', '实时更新'];
        smartNote.tags = ['网站', '在线资源', '教育工具'];
        smartNote.possibleQuestions = [
          '网站提供了哪些教育资源？',
          '如何利用网站内容进行教学？',
          '网站中的信息如何与课程内容结合？',
          '网站是否提供可下载的教学材料？'
        ];
        break;
      
      case 'text':
        const wordCount = material.content.length;
        const hasMarkdown = /[*_`#\[\]]/g.test(material.content);
        smartNote.summary = `文字内容：${material.title}，共${wordCount}字。${hasMarkdown ? '包含格式化内容，' : ''}该文本可能包含教学理论、实践经验或培训要点，可直接用于AI分析和问答，是重要的知识资源。`;
        smartNote.keyPoints = [
          `文字长度：${wordCount}字`,
          hasMarkdown ? '包含Markdown格式' : '纯文本内容',
          '可直接分析',
          '知识密度高'
        ];
        smartNote.tags = ['文字', hasMarkdown ? 'Markdown' : '纯文本', '知识库'];
        smartNote.possibleQuestions = [
          '文本中的核心观点是什么？',
          '如何将文本内容应用到教学实践中？',
          '文本提到了哪些教学策略？',
          '文本内容如何帮助教师专业发展？'
        ];
        break;

      case 'paper':
        smartNote.summary = `研究论文：${material.title}，作者：${material.author}，发表于${material.year}年。该论文提供了学术研究视角，包含理论基础和实证分析，是教师培训中重要的理论支撑材料。`;
        smartNote.keyPoints = [
          `作者：${material.author}`,
          `发表年份：${material.year}`,
          material.journal ? `期刊：${material.journal}` : '会议论文',
          '学术权威性高'
        ];
        smartNote.tags = ['研究论文', '学术资源', '理论基础', '教师培训'];
        smartNote.possibleQuestions = [
          '论文的主要研究发现是什么？',
          '研究方法对教学实践有何启示？',
          '论文结论如何指导教师培训？',
          '研究成果如何应用到课堂教学中？'
        ];
        break;

      case 'survey':
        smartNote.summary = `调研报告：${material.title}，由${material.organization}于${material.year}年发布。该报告基于实际调研数据，反映了教育现状和趋势，为教师培训提供数据支撑和实践指导。`;
        smartNote.keyPoints = [
          `调研机构：${material.organization}`,
          `调研年份：${material.year}`,
          material.sampleSize ? `样本规模：${material.sampleSize}` : '大规模调研',
          '数据权威可靠'
        ];
        smartNote.tags = ['调研报告', '数据分析', '教育现状', '培训指导'];
        smartNote.possibleQuestions = [
          '调研揭示了哪些教育问题？',
          '调研数据如何指导教师培训方向？',
          '报告中的建议如何落实到教学中？',
          '调研结果对教师发展有何意义？'
        ];
        break;

      case 'case':
        smartNote.summary = `案例研究：${material.title}，实施学校：${material.school}，实施于${material.year}年。该案例展示了具体的教学实践过程和效果，为教师培训提供可借鉴的实践经验和操作指南。`;
        smartNote.keyPoints = [
          `实施学校：${material.school}`,
          `实施年份：${material.year}`,
          material.participants ? `参与人数：${material.participants}` : '实践案例',
          '可操作性强'
        ];
        smartNote.tags = ['案例研究', '实践经验', '教学改进', '培训案例'];
        smartNote.possibleQuestions = [
          '案例中采用了哪些教学策略？',
          '实施过程中遇到了什么挑战？',
          '案例的成功经验如何复制推广？',
          '案例对教师培训有哪些启发？'
        ];
        break;
    }

    return smartNote;
  };

  // 批量生成智能需求
  const handleGenerateSmartNotes = () => {
    const notes = [];
    
    // 为所有资料生成智能需求
    uploadedFiles.forEach(file => {
      notes.push(generateSmartNote(file, 'file'));
    });
    
    addedTexts.forEach(text => {
      notes.push(generateSmartNote(text, 'text'));
    });
    
    courseVideos.forEach(video => {
      notes.push(generateSmartNote(video, 'video'));
    });
    
    links.forEach(link => {
      notes.push(generateSmartNote(link, 'link'));
    });

    // 为新增的材料类型生成智能需求
    researchPapers.forEach(paper => {
      notes.push(generateSmartNote(paper, 'paper'));
    });

    surveys.forEach(survey => {
      notes.push(generateSmartNote(survey, 'survey'));
    });

    caseStudies.forEach(caseStudy => {
      notes.push(generateSmartNote(caseStudy, 'case'));
    });

    if (notes.length > 0) {
      setSmartNotes(notes);
      setShowSmartNotesModal(true);
      message.success(`已生成 ${notes.length} 条智能需求`);
    } else {
      message.info('暂无资料可生成智能需求');
    }
  };

  // 处理规则标注保存
  const handleRuleAnnotationSave = (ruleData) => {
    const newRule = {
      id: Date.now(),
      ...ruleData,
      createdAt: new Date().toISOString(),
      enabled: true,
      executionCount: 0
    };

    setAnnotationRules(prev => [...prev, newRule]);
    setShowRuleAnnotationModal(false);
    
    // 如果是定时执行，添加到调度器
    if (ruleData.scheduleType === 'scheduled') {
      ruleScheduler.addRule(newRule, executeRule);
    }
    
    // 如果是实时执行，立即执行规则
    if (ruleData.scheduleType === 'realtime') {
      executeRule(newRule);
    }
    
    message.success('规则创建成功');
  };

  // 执行规则标注
  const executeRule = async (rule) => {
    message.loading({ content: '正在执行规则...', key: 'execute' });
    
    try {
      // 获取当前所有资源
      const allResources = [
        ...uploadedFiles.map(f => ({ ...f, type: 'file' })),
        ...addedTexts.map(t => ({ ...t, type: 'text' })),
        ...courseVideos.map(v => ({ ...v, type: 'video' })),
        ...links.map(l => ({ ...l, type: 'link' })),
        ...researchPapers.map(p => ({ ...p, type: 'paper' })),
        ...surveys.map(s => ({ ...s, type: 'survey' })),
        ...caseStudies.map(c => ({ ...c, type: 'case' }))
      ];

      let matchedResources = [];

      // 根据规则类型执行匹配
      if (rule.type === 'keyword' && rule.keywords?.length > 0) {
        matchedResources = allResources.filter(resource => {
          const searchText = `${resource.title || resource.name || ''} ${resource.description || ''} ${resource.content || ''}`.toLowerCase();
          return rule.keywords.some(keyword => 
            searchText.includes(keyword.toLowerCase())
          );
        });
      } else if (rule.type === 'condition' && rule.conditions?.length > 0) {
        matchedResources = allResources.filter(resource => {
          return rule.conditions.every(condition => {
            const fieldValue = resource[condition.field];
            if (!fieldValue) return false;
            
            switch (condition.operator) {
              case 'contains':
                return fieldValue.toString().toLowerCase().includes(condition.value.toLowerCase());
              case 'equals':
                return fieldValue.toString() === condition.value;
              case 'not_equals':
                return fieldValue.toString() !== condition.value;
              case 'greater_than':
                return parseFloat(fieldValue) > parseFloat(condition.value);
              case 'less_than':
                return parseFloat(fieldValue) < parseFloat(condition.value);
              default:
                return false;
            }
          });
        });
      } else if (rule.type === 'hybrid') {
        // 混合模式：同时满足关键词和条件
        const keywordMatched = rule.keywords?.length > 0 ? allResources.filter(resource => {
          const searchText = `${resource.title || resource.name || ''} ${resource.description || ''} ${resource.content || ''}`.toLowerCase();
          return rule.keywords.some(keyword => 
            searchText.includes(keyword.toLowerCase())
          );
        }) : allResources;

        matchedResources = keywordMatched.filter(resource => {
          if (!rule.conditions?.length) return true;
          return rule.conditions.every(condition => {
            const fieldValue = resource[condition.field];
            if (!fieldValue) return false;
            
            switch (condition.operator) {
              case 'contains':
                return fieldValue.toString().toLowerCase().includes(condition.value.toLowerCase());
              case 'equals':
                return fieldValue.toString() === condition.value;
              case 'not_equals':
                return fieldValue.toString() !== condition.value;
              case 'greater_than':
                return parseFloat(fieldValue) > parseFloat(condition.value);
              case 'less_than':
                return parseFloat(fieldValue) < parseFloat(condition.value);
              default:
                return false;
            }
          });
        });
      }

      // 执行标注动作
      let taggedCount = 0;
      if (rule.actions?.autoTag && rule.actions?.tags?.length > 0) {
        matchedResources.forEach(resource => {
          // 为匹配的资源添加标签
          const existingTags = resource.tags || [];
          const newTags = rule.actions.tags.filter(tag => !existingTags.includes(tag));
          
          if (newTags.length > 0) {
            resource.tags = [...existingTags, ...newTags];
            taggedCount++;
          }
        });
      }

      // 生成操作记录
      const operationRecord = {
        id: Date.now(),
        title: `规则标注执行 - ${rule.name}`,
        source: '规则标注系统',
        time: new Date().toLocaleString(),
        type: 'rule',
        content: `
          <h3 style="color: #1890ff; margin-bottom: 15px;">⚙️ 规则标注执行记录</h3>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #e6f7ff; border-radius: 8px;">
            <h4 style="color: #1890ff; margin-bottom: 10px;">📋 规则信息</h4>
            <p><strong>规则名称：</strong>${rule.name}</p>
            <p><strong>规则类型：</strong>${rule.type === 'keyword' ? '关键词匹配' : rule.type === 'condition' ? '条件筛选' : '混合模式'}</p>
            <p><strong>执行时间：</strong>${new Date().toLocaleString()}</p>
            <p><strong>执行方式：</strong>${rule.scheduleType === 'manual' ? '手动执行' : rule.scheduleType === 'scheduled' ? '定时执行' : '实时执行'}</p>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f6ffed; border-radius: 8px;">
            <h4 style="color: #52c41a; margin-bottom: 10px;">📊 执行结果</h4>
            <p><strong>处理资源数：</strong>${allResources.length}</p>
            <p><strong>匹配资源数：</strong>${matchedResources.length}</p>
            <p><strong>成功标注数：</strong>${taggedCount}</p>
            <p><strong>执行状态：</strong><span style="color: #52c41a;">成功</span></p>
          </div>
          
          ${matchedResources.length > 0 ? `
          <div style="margin-bottom: 20px; padding: 15px; background-color: #fff7e6; border-radius: 8px;">
            <h4 style="color: #fa8c16; margin-bottom: 10px;">🎯 匹配资源</h4>
            ${matchedResources.slice(0, 5).map(resource => `
              <div style="margin: 8px 0; padding: 8px; background: white; border-radius: 4px; border-left: 3px solid #fa8c16;">
                <strong>${resource.title || resource.name}</strong>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">
                  类型: ${resource.type} | 标签: ${(resource.tags || []).join(', ') || '无'}
                </div>
              </div>
            `).join('')}
            ${matchedResources.length > 5 ? `<p style="color: #666; font-style: italic;">... 还有 ${matchedResources.length - 5} 个资源</p>` : ''}
          </div>
          ` : ''}
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 8px;">
            <h4 style="color: #666; margin-bottom: 10px;">🔧 规则配置</h4>
            ${rule.keywords?.length > 0 ? `<p><strong>关键词：</strong>${rule.keywords.join(', ')}</p>` : ''}
            ${rule.conditions?.length > 0 ? `<p><strong>筛选条件：</strong>${rule.conditions.map(c => `${c.field} ${c.operator} ${c.value}`).join(', ')}</p>` : ''}
            ${rule.actions?.tags?.length > 0 ? `<p><strong>自动标签：</strong>${rule.actions.tags.join(', ')}</p>` : ''}
          </div>
        `,
        rule: rule,
        matchedResources: matchedResources,
        executionResult: {
          success: true,
          processedCount: allResources.length,
          matchedCount: matchedResources.length,
          taggedCount: taggedCount,
          executedAt: new Date().toISOString()
        }
      };

      // 添加到操作记录
      setOperationRecords(prev => ({
        ...prev,
        text: [operationRecord, ...(prev.text || [])]
      }));

      // 更新规则执行统计
      const updatedRules = annotationRules.map(r => 
        r.id === rule.id 
          ? { 
              ...r, 
              lastExecuted: new Date().toISOString(),
              executionCount: (r.executionCount || 0) + 1,
              lastResult: {
                success: true,
                processedCount: allResources.length,
                matchedCount: matchedResources.length,
                taggedCount: taggedCount,
                executedAt: new Date().toISOString()
              }
            }
          : r
      );
      setAnnotationRules(updatedRules);

      message.success({ 
        content: `规则执行完成！处理 ${allResources.length} 个资源，匹配 ${matchedResources.length} 个，标注 ${taggedCount} 个`, 
        key: 'execute' 
      });

    } catch (error) {
      console.error('规则执行失败:', error);
      message.error({ content: '规则执行失败', key: 'execute' });
    }
  };

  // 处理规则管理
  const handleRuleManagement = () => {
    setShowRuleManagementModal(true);
  };

  // 更新规则列表
  const handleRuleUpdate = (updatedRules) => {
    // 比较新旧规则，处理调度器更新
    const oldRules = annotationRules;
    const newRules = updatedRules;
    
    // 找出被删除的规则
    const deletedRules = oldRules.filter(oldRule => 
      !newRules.find(newRule => newRule.id === oldRule.id)
    );
    
    // 找出被修改的规则
    const modifiedRules = newRules.filter(newRule => {
      const oldRule = oldRules.find(old => old.id === newRule.id);
      return oldRule && (
        oldRule.enabled !== newRule.enabled ||
        oldRule.scheduleType !== newRule.scheduleType ||
        oldRule.interval !== newRule.interval
      );
    });
    
    // 从调度器中移除被删除的规则
    deletedRules.forEach(rule => {
      if (rule.scheduleType === 'scheduled') {
        ruleScheduler.removeRule(rule.id);
      }
    });
    
    // 更新调度器中的规则
    modifiedRules.forEach(rule => {
      if (rule.scheduleType === 'scheduled') {
        if (rule.enabled) {
          ruleScheduler.updateRule(rule.id, rule);
        } else {
          ruleScheduler.removeRule(rule.id);
        }
      }
    });
    
    setAnnotationRules(updatedRules);
    message.success('规则更新成功');
  };

  // 渲染文件预览内容
  const renderFilePreview = (file) => {
    const fileType = file.type || file.name.split('.').pop().toLowerCase();
    
    if (fileType.includes('pdf') || fileType === 'pdf') {
      return (
        <div style={{ height: '500px', width: '100%' }}>
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(file.url || '#')}&embedded=true`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={file.name}
          />
          <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
            PDF预览 - {file.name}
          </div>
        </div>
      );
    }
    
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
        <div>
          <h3>{file.name}</h3>
          <p>文件类型: {fileType}</p>
          <p>暂不支持此文件类型的在线预览</p>
        </div>
      </div>
    );
  };

  // 渲染视频预览内容
  const renderVideoPreview = (video) => {
    const getVideoEmbedUrl = (url) => {
      if (url.includes('bilibili.com')) {
        const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
        if (bvMatch) {
          return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&autoplay=0`;
        }
      }
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId[1]}`;
        }
      }
      return url;
    };

    const embedUrl = getVideoEmbedUrl(video.url);
    
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{video.title}</h3>
          <p style={{ color: '#666' }}>视频链接: <a href={video.url} target="_blank" rel="noopener noreferrer">{video.url}</a></p>
        </div>
        <div style={{ height: '400px', width: '100%' }}>
          <iframe
            src={embedUrl}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
            title={video.title}
            allowFullScreen
          />
        </div>
      </div>
    );
  };

  // 渲染链接预览内容
  const renderLinkPreview = (link) => {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{link.title}</h3>
          <p style={{ color: '#666' }}>网站地址: <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
        </div>
        <div style={{ height: '500px', width: '100%' }}>
          <iframe
            src={link.url}
            style={{ width: '100%', height: '100%', border: '1px solid #d9d9d9', borderRadius: '8px' }}
            title={link.title}
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
          网站预览 - 如无法显示，请点击上方链接直接访问
        </div>
      </div>
    );
  };

  // 渲染文字预览内容
  const renderTextPreview = (text) => {
    // 简单的 Markdown 渲染
    const renderMarkdown = (content) => {
      let html = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
        .replace(/`(.*?)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px;">$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #1890ff;">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 4px;" />')
        .replace(/\n/g, '<br />');
      
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{text.title}</h3>
          <p style={{ color: '#666' }}>添加时间: {text.addTime}</p>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          maxHeight: '400px',
          overflow: 'auto',
          lineHeight: '1.6'
        }}>
          {renderMarkdown(text.content)}
        </div>
      </div>
    );
  };

  // 渲染研究论文预览
  const renderPaperPreview = (paper) => {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>📄 {paper.title}</h3>
          <div style={{ color: '#666', marginBottom: '8px' }}>
            <p><strong>作者:</strong> {paper.author}</p>
            <p><strong>发表年份:</strong> {paper.year}</p>
            <p><strong>期刊/会议:</strong> {paper.journal || '未知'}</p>
          </div>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          maxHeight: '400px',
          overflow: 'auto',
          lineHeight: '1.6'
        }}>
          <h4>摘要</h4>
          <p>{paper.abstract || '暂无摘要信息'}</p>
          {paper.keywords && (
            <>
              <h4>关键词</h4>
              <p>{paper.keywords}</p>
            </>
          )}
          {paper.url && (
            <div style={{ marginTop: '16px' }}>
              <a href={paper.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                查看完整论文 →
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染调研报告预览
  const renderSurveyPreview = (survey) => {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>📊 {survey.title}</h3>
          <div style={{ color: '#666', marginBottom: '8px' }}>
            <p><strong>调研机构:</strong> {survey.organization}</p>
            <p><strong>调研年份:</strong> {survey.year}</p>
            <p><strong>样本规模:</strong> {survey.sampleSize || '未知'}</p>
          </div>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          maxHeight: '400px',
          overflow: 'auto',
          lineHeight: '1.6'
        }}>
          <h4>调研概述</h4>
          <p>{survey.summary || '暂无概述信息'}</p>
          {survey.keyFindings && (
            <>
              <h4>主要发现</h4>
              <p>{survey.keyFindings}</p>
            </>
          )}
          {survey.methodology && (
            <>
              <h4>调研方法</h4>
              <p>{survey.methodology}</p>
            </>
          )}
          {survey.url && (
            <div style={{ marginTop: '16px' }}>
              <a href={survey.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                查看完整报告 →
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染案例研究预览
  const renderCasePreview = (caseStudy) => {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>📋 {caseStudy.title}</h3>
          <div style={{ color: '#666', marginBottom: '8px' }}>
            <p><strong>实施学校:</strong> {caseStudy.school}</p>
            <p><strong>实施年份:</strong> {caseStudy.year}</p>
            <p><strong>参与人数:</strong> {caseStudy.participants || '未知'}</p>
          </div>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          maxHeight: '400px',
          overflow: 'auto',
          lineHeight: '1.6'
        }}>
          <h4>案例背景</h4>
          <p>{caseStudy.background || '暂无背景信息'}</p>
          {caseStudy.implementation && (
            <>
              <h4>实施过程</h4>
              <p>{caseStudy.implementation}</p>
            </>
          )}
          {caseStudy.results && (
            <>
              <h4>实施效果</h4>
              <p>{caseStudy.results}</p>
            </>
          )}
          {caseStudy.lessons && (
            <>
              <h4>经验总结</h4>
              <p>{caseStudy.lessons}</p>
            </>
          )}
          {caseStudy.url && (
            <div style={{ marginTop: '16px' }}>
              <a href={caseStudy.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                查看详细案例 →
              </a>
            </div>
          )}
        </div>
      </div>
    );
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
      <div style={{ flex: 2.5, background: '#fff', margin: '16px 0 16px 16px', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '20px' }}>
            {/* 页面头部 - 标题和操作按钮 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {mode === 'edit' && (
                    <Button 
                      type="primary" 
                      icon={<SaveOutlined />}
                      onClick={handleSaveNeed}
                      size="small"
                    >
                      保存
                    </Button>
                  )}
                </div>
              </div>
              

            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
              </div>
            </div>
            {/* 资源记录区域 - 上下分区布局 */}
            <div style={{ height: 'calc(100vh - 240px)', display: 'flex', flexDirection: 'column' }}>
              {/* 上方区域 - 树形菜单区域 (70%) */}
              <div style={{ flex: 7, borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong style={{ fontSize: '14px', color: '#1f1f1f' }}>👥 组织人员</Text>
                </div>
                <StudentAnnotationTree 
                  style={{ height: '100%' }}
                  onPersonnelSelect={(selectedPersonnel) => {
                    // 处理人员选择
                    console.log('选中的人员:', selectedPersonnel);
                    setSelectedTreePersonnel(selectedPersonnel);
                  }}
                  recommendedResources={recommendedResources}
                  isRefreshing={isRefreshingResourceTree}
                />
              </div>
              
            </div>
          </div>
        </div>

      {/* 中间问答区域 */}
      <div style={{ flex: 5, margin: '16px', background: '#fff', borderRadius: '8px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 200px)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
            <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
              💬 智能问答
            </Title>
          </div>
          

          
          {/* 消息列表 */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: messages.length === 0 ? 'center' : 'flex-start' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999' }}>
                <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>开始与AI对话</div>
                <div style={{ fontSize: '12px', marginTop: '8px' }}>您可以询问关于资料的任何问题</div>
              </div>
            ) : (
              <>
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
                        maxWidth: '70%'
                      }}>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: msg.type === 'user' ? '#1890ff' : '#f6f6f6',
                          color: msg.type === 'user' ? '#fff' : '#333'
                        }}>
                          <Text style={{ color: 'inherit' }}>{msg.content}</Text>
                        </div>
                        {msg.type === 'assistant' && (
                          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                            {/* 转来源操作图标已移除 */}
                          </div>
                        )}
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
              </>
            )}
          </div>
          

          
          {/* 输入区域 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
            {/* 选中资料数量提示 - 浮动显示 */}
            {selectedMaterials.length > 0 && (
              <div style={{ 
                marginBottom: '8px',
                padding: '2px 8px', 
                backgroundColor: '#f6ffed', 
                border: '1px solid #b7eb8f', 
                borderRadius: '12px',
                fontSize: '10px',
                color: '#52c41a',
                display: 'inline-block',
                whiteSpace: 'nowrap'
              }}>
                📋 {selectedMaterials.length}个资料
              </div>
            )}
            
            {/* 完全复刻图示样式的输入框 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '24px',
              padding: '8px 16px',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              {/* 输入框 */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* 选中的技能显示 */}
                {selectedSkill && (
                  <Button
                    size="small"
                    style={{
                      backgroundColor: '#e6f7ff',
                      color: '#1677ff',
                      border: '1px solid #91d5ff',
                      borderRadius: '12px',
                      fontSize: '12px',
                      height: '24px',
                      padding: '0 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    onClick={() => setSelectedSkill(null)}
                  >
                    {selectedSkill.icon} {selectedSkill.label}
                    <span style={{ marginLeft: '4px', fontSize: '10px' }}>×</span>
                  </Button>
                )}
                
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={selectedSkill ? `使用 ${selectedSkill.label} 技能，请输入您的问题...` : "发消息或输入 / 选择技能"}
                  bordered={false}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    color: '#333'
                  }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              
              {/* 右侧按钮组 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* 深度思考按钮 */}
                <Button
                  size="small"
                  style={{
                    backgroundColor: '#1677ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '12px',
                    height: '28px',
                    padding: '0 12px'
                  }}
                >
                  🧠 深度思考
                </Button>
                
                {/* 技能按钮 */}
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'knowledge-graph',
                        label: '知识图谱',
                        icon: '🕸️',
                        onClick: () => {
                          setSelectedSkill({
                            key: 'knowledge-graph',
                            label: '知识图谱',
                            icon: '🕸️'
                          });
                        }
                      },
                      {
                        key: 'resource-recommend',
                        label: '资源推荐',
                        icon: '📚',
                        onClick: () => {
                          setSelectedSkill({
                            key: 'resource-recommend',
                            label: '资源推荐',
                            icon: '📚'
                          });
                        }
                      }
                    ]
                  }}
                  trigger={['click']}
                  placement="topRight"
                >
                  <Button
                    size="small"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#666',
                      border: '1px solid #d9d9d9',
                      borderRadius: '16px',
                      fontSize: '12px',
                      height: '28px',
                      padding: '0 12px'
                    }}
                  >
                    🔧 技能
                  </Button>
                </Dropdown>
                
                {/* 功能图标组 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  
                  {/* 发送按钮 */}
                  <Button
                    type="text"
                    size="small"
                    onClick={handleSendMessage}
                    loading={isLoading}
                    disabled={!inputMessage.trim()}
                    style={{
                      backgroundColor: '#e9ecef',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: inputMessage.trim() ? '#1677ff' : '#999',
                      padding: 0
                    }}
                  >
                    <SendOutlined style={{ fontSize: '14px' }} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧操作区域 */}
        <div style={{ flex: 2.5, background: '#fff', margin: '16px 16px 16px 0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* 上半部分 - 功能概览 */}
          <div style={{ padding: '20px', flex: 3 }}>
            <Title level={5} style={{ marginBottom: 16, color: '#1f1f1f' }}>
              🛠️ 操作面板
            </Title>
            
            {/* 标注按钮 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 16 }}>
              <Card 
                size="small" 
                hoverable
                onClick={handleAnnotation}
                style={{ 
                  background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>✏️</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#1890ff' 
                  }}>手动标注</Text>
                </div>
              </Card>
              
              <Card 
                size="small" 
                hoverable
                onClick={() => setShowRuleAnnotationModal(true)}
                style={{ 
                  background: 'linear-gradient(135deg, #fff2e6 0%, #ffd591 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>⚙️</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#fa8c16' 
                  }}>规则标注</Text>
                </div>
              </Card>
            </div>
          </div>
          
          {/* 下半部分 - 操作记录 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', flex: 7, display: 'flex', flexDirection: 'column' }}>
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
                    onClick={() => handleRecordClick(record)}
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
                      {(record.type === 'audio' || record.type === 'video') && (
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<div style={{ fontSize: '12px' }}>▶</div>}
                          style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRecordClick(record);
                          }}
                        />
                      )}
                      <Dropdown
                        menu={{ items: getMoreMenuItems(record) }}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<div style={{ fontSize: '12px' }}>⋯</div>}
                          style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Dropdown>
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
            请选择要上传的文档，NotebookLM 智能需求支持以下格式的资料来源：
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
       


      {/* 资料预览弹窗 */}
      <Modal
        title={`预览 - ${previewData?.title || '资料'}`}
        open={showPreviewModal}
        onCancel={() => setShowPreviewModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowPreviewModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {previewData && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {previewType === 'file' && renderFilePreview(previewData)}
            {previewType === 'video' && renderVideoPreview(previewData)}
            {previewType === 'link' && renderLinkPreview(previewData)}
            {previewType === 'text' && renderTextPreview(previewData)}
            {previewType === 'paper' && renderPaperPreview(previewData)}
            {previewType === 'survey' && renderSurveyPreview(previewData)}
            {previewType === 'case' && renderCasePreview(previewData)}
          </div>
        )}
      </Modal>

      {/* 内容查看弹窗 */}
      <Modal
        title={currentRecord?.title || '内容查看'}
        open={showContentModal}
        onCancel={() => setShowContentModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowContentModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
        style={{ top: 20 }}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: modalContent }}
          style={{ maxHeight: '70vh', overflowY: 'auto' }}
        />
      </Modal>
      
      {/* 资料添加弹窗 */}
      <MaterialAddPage 
        visible={showMaterialAddModal}
        onClose={() => setShowMaterialAddModal(false)}
      />
      
      {/* 智能需求弹窗 */}
      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RobotOutlined style={{ color: '#1890ff' }} />
          {smartNotes.length === 1 ? '资料智能预览' : '智能需求预览'}
        </div>}
        open={showSmartNotesModal}
        onCancel={() => {
          setShowSmartNotesModal(false);
          setSelectedNote(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setShowSmartNotesModal(false);
            setSelectedNote(null);
          }}>
            关闭
          </Button>
        ]}
        width={900}
        style={{ top: 20 }}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {smartNotes.length > 0 ? (
            <div>
              <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae7ff' }}>
                 <Text type="secondary">
                   {smartNotes.length === 1 ? 
                     '🤖 AI智能分析该资料，为您提供摘要、关键要点和标签分类' : 
                     `📝 已为您生成 ${smartNotes.length} 条智能需求，包含资料摘要、关键要点和标签分类`
                   }
                 </Text>
               </div>
              
              <List
                itemLayout="vertical"
                dataSource={smartNotes}
                renderItem={(note, index) => (
                  <List.Item
                    key={note.id}
                    style={{
                      padding: '16px',
                      marginBottom: '12px',
                      backgroundColor: selectedNote?.id === note.id ? '#f6ffed' : '#fafafa',
                      borderRadius: '8px',
                      border: selectedNote?.id === note.id ? '1px solid #b7eb8f' : '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedNote(selectedNote?.id === note.id ? null : note)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                          {note.type === 'file' && '📄'}
                          {note.type === 'video' && '🎥'}
                          {note.type === 'link' && '🔗'}
                          {note.type === 'text' && '📝'}
                          {note.type === 'paper' && '📄'}
                          {note.type === 'survey' && '📊'}
                          {note.type === 'case' && '📋'}
                          {' '}{note.title}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {note.createdAt}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {note.tags.map((tag, tagIndex) => (
                          <Tag key={tagIndex} size="small" color={
                            note.type === 'file' ? 'blue' : 
                            note.type === 'video' ? 'red' : 
                            note.type === 'link' ? 'green' : 
                            note.type === 'text' ? 'orange' :
                            note.type === 'paper' ? 'purple' :
                            note.type === 'survey' ? 'cyan' :
                            note.type === 'case' ? 'magenta' : 'default'
                          }>
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </div>
                    
                    <Paragraph style={{ margin: 0, marginBottom: 12, color: '#666' }}>
                      {note.summary}
                    </Paragraph>
                    
                    {selectedNote?.id === note.id && (
                      <div style={{ marginTop: 12, padding: '12px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e8f4fd' }}>
                        <Title level={5} style={{ margin: 0, marginBottom: 8, color: '#1890ff' }}>关键要点：</Title>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {note.keyPoints.map((point, pointIndex) => (
                            <li key={pointIndex} style={{ marginBottom: 4, color: '#666' }}>{point}</li>
                          ))}
                        </ul>
                        
                        {note.possibleQuestions && note.possibleQuestions.length > 0 && (
                          <div style={{ marginTop: 12 }}>
                            <Title level={5} style={{ margin: 0, marginBottom: 8, color: '#52c41a' }}>可能问的问题：</Title>
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                              {note.possibleQuestions.map((question, questionIndex) => (
                                <li key={questionIndex} style={{ marginBottom: 4, color: '#666' }}>{question}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                          <Button 
                            size="small" 
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewMaterial(note.originalData, note.type);
                            }}
                          >
                            预览原资料
                          </Button>
                          <Button 
                            size="small" 
                            type="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              message.success('需求已保存到操作记录');
                              // 这里可以添加保存到操作记录的逻辑
                            }}
                          >
                            保存需求
                          </Button>
                        </div>
                      </div>
                    )}
                  </List.Item>
                )}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
              <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>暂无智能需求</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>请先添加资料，然后点击"智能需求"按钮生成</div>
            </div>
          )}
        </div>
      </Modal>
      
      {/* 探索弹窗 */}
      <ExploreModal
        visible={showExploreModal}
        onClose={() => setShowExploreModal(false)}
        onExplore={handleExplore}
      />

      {/* 标注弹窗 */}
      <Modal
        title="📝 人员标注"
        open={showAnnotationModal}
        onOk={handleAnnotationConfirm}
        onCancel={handleAnnotationCancel}
        okText="确定"
        cancelText="取消"
        width={600}
        style={{ top: 100 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
              为当前资源添加标签
            </Text>
            <div style={{ marginTop: 8, color: '#666', fontSize: 14 }}>
              标签可以帮助您更好地分类和管理资源，支持添加多个标签
            </div>
          </div>

          {/* 标签输入区域 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <Input
                placeholder="输入标签名称，按回车或点击添加"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onPressEnter={handleAddTag}
                style={{ flex: 1 }}
                maxLength={20}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddTag}
                disabled={!currentTag.trim()}
              >
                添加
              </Button>
            </div>
            
            {/* 已添加的标签显示 */}
            {annotationTags.length > 0 && (
              <div>
                <Text style={{ color: '#666', fontSize: 14, marginBottom: 8, display: 'block' }}>
                  已添加的标签 ({annotationTags.length}):
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {annotationTags.map((tag, index) => (
                    <Tag
                      key={index}
                      closable
                      onClose={() => handleRemoveTag(tag)}
                      color="blue"
                      style={{ 
                        fontSize: 14, 
                        padding: '4px 8px',
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 提示信息 */}
          <div style={{ 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: 6, 
            padding: 12,
            fontSize: 14,
            color: '#52c41a'
          }}>
            💡 提示：标签将帮助您快速筛选和查找相关资源，建议使用简洁明了的词汇
          </div>
        </div>
      </Modal>





    {/* 规则标注弹窗 */}
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SettingOutlined style={{ color: '#1890ff' }} />
          <span>规则标注设置</span>
        </div>
      }
      open={showRuleAnnotationModal}
      onCancel={() => setShowRuleAnnotationModal(false)}
      width={800}
      footer={null}
    >
      <RuleAnnotationModal 
        onClose={() => setShowRuleAnnotationModal(false)}
        onSave={handleRuleAnnotationSave}
        onRuleManage={handleRuleManagement}
        existingRules={annotationRules}
      />
    </Modal>

    {/* 规则管理弹窗 */}
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClockCircleOutlined style={{ color: '#52c41a' }} />
          <span>规则管理</span>
        </div>
      }
      open={showRuleManagementModal}
      onCancel={() => setShowRuleManagementModal(false)}
      width={1000}
      footer={null}
    >
      <RuleManagementModal 
        rules={annotationRules}
        onRuleUpdate={handleRuleUpdate}
        onClose={() => setShowRuleManagementModal(false)}
      />
    </Modal>
  </>
);
};

export default ResourceAnnotationPage;