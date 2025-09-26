import React, { useState, useEffect, useRef } from 'react';
import {
  Layout,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  message,
  Tooltip,
  Dropdown,
  Menu,
  Tabs,
  Badge,
  Empty,
  Spin,
  Row,
  Col,
  Typography,
  Divider,
  Avatar,
  Popconfirm,
  Statistic,
  Progress,
  Alert,
  Tree
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  TagOutlined,
  FolderOutlined,
  BulbOutlined,
  ExportOutlined,
  ImportOutlined,
  MoreOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  RobotOutlined,
  DownloadOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  DownOutlined,
  CalendarOutlined,
  UploadOutlined,
  ReloadOutlined,
  TeamOutlined,
  LaptopOutlined,
  FolderAddOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import NoteEditor from './NoteEditor';
import CategoryTagManager from './CategoryTagManager';
import AIAssistant from './AIAssistant';
import AdvancedSearch from './AdvancedSearch';
import ImportExport from './ImportExport';
import NoteCreateModal from './NoteCreateModal';
import needsService from '../services/needsService';
import courseSelectionService from '../services/courseSelectionService';
import mockDataGenerator from '../utils/mockDataGenerator';
import { generateMockCourseData } from '../utils/mockCourseData';
import './CourseSelection.css';
import CourseSelectionEditPage from './CourseSelectionEditPage';

const { Content, Sider } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const CourseSelection = ({ onViewChange, pageState }) => {
  // 状态管理
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [noteCategories, setNoteCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isCategoryManagerVisible, setIsCategoryManagerVisible] = useState(false);
  const [isAIAssistantVisible, setIsAIAssistantVisible] = useState(false);
  const [aiSelectedNote, setAISelectedNote] = useState(null);
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const [importExportVisible, setImportExportVisible] = useState(false);
  const [noteCreateModalVisible, setNoteCreateModalVisible] = useState(false);
  const [editorMode, setEditorMode] = useState('create');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [showCourseSelectionEditPage, setShowCourseSelectionEditPage] = useState(false);
  const [trainingNeedsModalVisible, setTrainingNeedsModalVisible] = useState(false);
  
  // 子分类相关状态
  const [subcategoryModalVisible, setSubcategoryModalVisible] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(['organizational_training', 'self_learning']);
  const [customSubcategories, setCustomSubcategories] = useState([]);
  
  const [form] = Form.useForm();
  const [subcategoryForm] = Form.useForm();

  // 选课分类 - 基于组织培训和自主学习两大类别
  const categories = [
    { value: 'all', label: '全部课程', icon: '文档' },
    { value: 'organizational_training', label: '组织培训', icon: '🏢', description: '基于培训选课的组织安排课程' },
    { value: 'self_learning', label: '自主学习', icon: '📚', description: '个人主动选择的学习课程' }
  ];

  // 组织培训子分类
  const organizationalCategories = [
    { value: 'teaching_methods', label: '教学方法', icon: '📚', parent: 'organizational_training' },
    { value: 'student_management', label: '学生管理', icon: '👥', parent: 'organizational_training' },
    { value: 'educational_tech', label: '教育技术', icon: '技术', parent: 'organizational_training' },
    { value: 'curriculum_design', label: '课程设计', icon: '📋', parent: 'organizational_training' },
    { value: 'policy_compliance', label: '政策合规', icon: '⚖️', parent: 'organizational_training' }
  ];

  // 自主学习子分类
  const selfLearningCategories = [
    { value: 'research_innovation', label: '科研创新', icon: '🔬', parent: 'self_learning' },
    { value: 'mental_health', label: '心理健康', icon: '💚', parent: 'self_learning' },
    { value: 'professional_dev', label: '专业发展', icon: '📈', parent: 'self_learning' },
    { value: 'skill_enhancement', label: '技能提升', icon: '🎯', parent: 'self_learning' },
    { value: 'personal_interest', label: '兴趣爱好', icon: '🎨', parent: 'self_learning' }
  ];

  // 常用标签
  const commonTags = [
    '紧急', '重要', '计划中', '已完成', '待审批',
    '新员工', '在职', '管理层', '技术', '销售'
  ];

  // 获取培训选课数据，用于组织培训的关联
  const [trainingNeeds, setTrainingNeeds] = useState([]);

  // 获取所有分类（包含子分类）
  const getAllCategories = () => {
    return [...categories, ...organizationalCategories, ...selfLearningCategories];
  };

  // 根据培训选课创建组织培训课程
  const createOrganizationalCourse = (trainingNeed) => {
    return {
      id: `org_${trainingNeed.id}`,
      title: `${trainingNeed.title} - 组织培训`,
      type: 'organizational_training',
      trainingNeedId: trainingNeed.id,
      category: trainingNeed.category || 'teaching_methods',
      description: `基于培训选课"${trainingNeed.title}"创建的组织培训课程`,
      status: '待开课',
      participants: [],
      instructor: '',
      schedule: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  // 加载培训选课数据
  const loadTrainingNeeds = async () => {
    try {
      const needs = await needsService.getAllNeeds();
      setTrainingNeeds(needs);
    } catch (error) {
      console.error('加载培训选课失败:', error);
    }
  };

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      // 检查是否有选课数据，如果没有则生成模拟数据
      let coursesData = await courseSelectionService.getAllCourses();
      if (coursesData.length === 0) {
        console.log('没有选课数据，生成模拟数据...');
        generateMockCourseData();
        coursesData = await courseSelectionService.getAllCourses();
      }
      
      const categoriesData = await courseSelectionService.getCategories();
      const tagsData = await courseSelectionService.getTags();
      const statsData = await courseSelectionService.getCoursesStats();
      const customSubcategoriesData = await courseSelectionService.getCustomSubcategories();
      
      setNotes(coursesData);
      setNoteCategories(categoriesData);
      setTags(tagsData);
      setStats(statsData);
      setCustomSubcategories(customSubcategoriesData);
      setFilteredNotes(coursesData);
      
      // 加载培训需求数据
      await loadTrainingNeeds();
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // 初始化培训来源数据
    initializeTrainingSources();
  }, []);

  // 初始化培训来源数据
  const initializeTrainingSources = async () => {
    try {
      await needsService.initializeTrainingSources();
      console.log('培训来源数据初始化完成');
    } catch (error) {
      console.error('培训来源数据初始化失败:', error);
    }
  };

  // 搜索和过滤
  useEffect(() => {
    const filtered = needsService.searchNeeds(searchTerm, {
      category: selectedCategory,
      tags: selectedTags
    });
    setFilteredNotes(filtered);
  }, [notes, selectedCategory, selectedTags, searchTerm]);

  // 创建新选课
  const handleCreateNote = () => {
    // 跳转到选课编辑页面，传递创建模式
    setSelectedNote(null);
    setEditorMode('create');
    setIsEditing(true);
    
    // 使用新的编辑页面
    setShowCourseSelectionEditPage(true);
  };

  const handleBackFromEditPage = () => {
    setShowCourseSelectionEditPage(false);
  };

  // 编辑选课
  const handleEditNote = (note) => {
    // 跳转到选课编辑页面，传递选中的需求和编辑模式
    setSelectedNote(note);
    setEditorMode('edit');
    setShowCourseSelectionEditPage(true);
  };

  // 查看选课
  const handleViewNote = (note) => {
    // 跳转到选课编辑页面（查看模式），传递选中的需求和查看模式
    setSelectedNote(note);
    setEditorMode('view');
    setShowCourseSelectionEditPage(true);
  };

  // 搜索功能
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // 保存选课
  const handleSaveNote = async (noteData) => {
    try {
      if (editorMode === 'create') {
        // 创建新选课
        await courseSelectionService.createCourse(noteData);
      } else if (editorMode === 'edit') {
        // 更新现有选课
        await courseSelectionService.updateCourse(selectedNote.id, noteData);
      } else if (editorMode === 'create-from-modal') {
        // 从新弹窗创建新选课
        await courseSelectionService.createCourse(noteData);
      }
      
      await loadData();
      setIsEditing(false);
      setSelectedNote(null);
      setNoteCreateModalVisible(false);
      message.success('选课保存成功');
    } catch (error) {
      console.error('保存选课失败:', error);
      message.error('保存选课失败');
    }
  };

  // 删除选课
  const handleDeleteNote = async (noteId) => {
    try {
      await courseSelectionService.deleteCourse(noteId);
      await loadData();
      message.success('选课删除成功');
    } catch (error) {
      console.error('删除选课失败:', error);
      message.error('删除选课失败');
    }
  };

  // 导出选课
  const handleExportNotes = async () => {
    try {
      const result = await courseSelectionService.exportCourses();
      
      // 创建下载链接
      const blob = new Blob([result.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      message.success('选课导出成功');
    } catch (error) {
      console.error('导出选课失败:', error);
      message.error('导出选课失败');
    }
  };

  // 导入选课
  const handleImportNotes = async (file) => {
    try {
      const result = await courseSelectionService.importCourses(file);
      
      if (result.success) {
        await loadData();
        message.success(`导入成功：新增 ${result.imported} 条选课，跳过 ${result.skipped} 条重复记录`);
      } else {
        message.error(result.message || '导入失败');
      }
    } catch (error) {
      console.error('导入选课失败:', error);
      message.error('导入选课失败');
    }
  };

  // 高级搜索
  const handleAdvancedSearch = async (searchParams) => {
    try {
      setLoading(true);
      const searchResults = await courseSelectionService.searchCourses(searchParams);
      
      // 更新选课列表为搜索结果
      setFilteredNotes(searchResults);
      setAdvancedSearchVisible(false);
      
      if (searchResults.length === 0) {
        message.info('未找到匹配的选课');
      } else {
        message.success(`找到 ${searchResults.length} 条匹配的选课`);
      }
    } catch (error) {
      console.error('搜索选课失败:', error);
      message.error('搜索选课失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理导入导出完成
  const handleImportExportComplete = async (type, result) => {
    if (type === 'import' && result.success) {
      loadData(); // 重新加载选课列表
      message.success('导入完成，选课列表已更新');
    }
  };

  // AI助手生成报告
  const generateAIReport = (type) => {
    let reportTitle = '';
    let reportContent = '';
    
    switch (type) {
      case 'summary':
        reportTitle = '选课简报';
        break;
      case 'guide':
        reportTitle = '选课指南';
        break;
      case 'faq':
        reportTitle = '选课FAQ';
        break;
      case 'timeline':
        reportTitle = '选课时间轴';
        break;
      default:
        reportTitle = '选课报告';
    }

    // 生成选课简报
    if (type === 'summary') {
      const totalNotes = notes.length;
      const recentNotes = notes.slice(0, 5);
      const popularTags = [...new Set(notes.flatMap(note => note.tags || []))].slice(0, 10);
      
      reportContent = `# 选课简报文档

## 概览
- 总选课数：${totalNotes}
- 最近更新：${new Date().toLocaleDateString()}
- 活跃标签：${popularTags.join('、')}

## 最近选课
${recentNotes.map(note => `- ${note.title}`).join('\n')}

*此报告由选课管理系统自动生成*`;
    }
    
    // 生成选课指南
    if (type === 'guide') {
      const technicalNotes = notes.filter(note => note.category === 'educational_tech');
      const managementNotes = notes.filter(note => note.category === 'student_management');
      
      reportContent = `# 选课管理指南

## 技术选课总结
共有${technicalNotes.length}条技术选课

${technicalNotes.slice(0, 3).map(note => `- ${note.title}`).join('\n')}

## 管理选课
共有${managementNotes.length}条管理选课

## 最佳实践
1. 定期评估和更新选课
2. 使用标签进行分类管理
3. 建立选课优先级体系

*此指南基于您的选课内容自动生成*`;
    }
    
    // 生成FAQ
    if (type === 'faq') {
      const popularTags = [...new Set(notes.flatMap(note => note.tags || []))].slice(0, 5);
      
      reportContent = `# 选课管理FAQ

## Q: 如何更好地管理选课？
A: 建议使用分类和标签功能，将相关选课归类整理。目前您使用的标签有：${popularTags.join('、')}

## Q: 如何快速找到需要的选课？
A: 可以使用搜索功能，支持按标题、内容、标签等多维度搜索。

## Q: 如何提高选课管理质量？
A: 建议定期回顾和更新选课内容，删除过时信息，补充新的见解。

## Q: 如何备份选课数据？
A: 可以使用导入导出功能，定期备份您的选课数据。

## 功能提示
- 生成选课摘要
- 智能标签建议  
- 相关选课推荐
- 优化选课结构`;
    }
    
    // 生成时间轴
    if (type === 'timeline') {
      const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      reportContent = `# 选课时间轴

## 最近创建的选课
${sortedNotes.slice(0, 10).map(note => {
        const date = new Date(note.createdAt).toLocaleDateString();
        return `**${date}** - ${note.title}`;
      }).join('\n')}

## 统计信息
- 总选课数：${notes.length}
- 本月新增：${sortedNotes.filter(note => {
        const noteDate = new Date(note.createdAt);
        const now = new Date();
        return noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
      }).length}

*按时间顺序展示的选课创建记录*`;
    }

    // 将摘要添加到选课开头
    if (type === 'summary-enhance') {
      if (selectedNote) {
        const enhancedContent = `## 📋 AI生成摘要
${selectedNote.title}的核心要点：
- 主要内容概述
- 关键知识点提取
- 实践应用建议

---

${selectedNote.content}`;
        
        handleSaveNote({
          ...selectedNote,
          content: enhancedContent
        });
      }
      return;
    }

    // 将建议作为注释添加到选课末尾
    if (type === 'suggestion-enhance') {
      if (selectedNote) {
        const enhancedContent = `${selectedNote.content}

---

## 🤖 AI优化建议
基于当前选课内容，建议：
1. 补充相关案例和实践经验
2. 添加参考资料和延伸阅读
3. 考虑与其他选课的关联性
4. 定期更新和完善内容

*此建议由AI助手自动生成*`;
        
        handleSaveNote({
          ...selectedNote,
          content: enhancedContent
        });
      }
      return;
    }

    // 显示生成的报告
    setAISelectedNote({
      title: reportTitle,
      content: reportContent
    });
    setIsAIAssistantVisible(true);
  };

  // 子分类管理函数
  const handleCreateSubcategory = (parentId) => {
    setSelectedParentCategory(parentId);
    setSubcategoryModalVisible(true);
  };

  const handleSubcategorySubmit = async (values) => {
    try {
      const subcategoryData = {
        ...values,
        parent: selectedParentCategory
      };
      
      const newSubcategory = await courseSelectionService.createSubcategory(subcategoryData);
      setCustomSubcategories(prev => [...prev, newSubcategory]);
      setSubcategoryModalVisible(false);
      subcategoryForm.resetFields();
      message.success('子分类创建成功');
    } catch (error) {
      console.error('创建子分类失败:', error);
      message.error('创建子分类失败: ' + error.message);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    try {
      await courseSelectionService.deleteSubcategory(subcategoryId);
      setCustomSubcategories(prev => prev.filter(sub => sub.id !== subcategoryId));
      message.success('子分类删除成功');
    } catch (error) {
      console.error('删除子分类失败:', error);
      message.error('删除子分类失败');
    }
  };

  // 获取分类树数据
  const getCategoryTreeData = () => {
    const allCategories = courseSelectionService.getAllCategories();
    const mainCategories = allCategories.filter(cat => !cat.parent);
    
    return mainCategories.map(mainCat => {
      const subcategories = [
        ...allCategories.filter(cat => cat.parent === mainCat.id),
        ...customSubcategories.filter(cat => cat.parent === mainCat.id)
      ];
      
      const iconMap = {
        FileTextOutlined,
        TeamOutlined,
        BookOutlined,
        UserOutlined,
        BulbOutlined,
        StarOutlined,
        FolderOutlined
      };
      
      const MainIcon = iconMap[mainCat.icon] || FileTextOutlined;
      const count = stats.categories?.[mainCat.id] || 0;
      
      return {
        key: mainCat.id,
        title: (
          <div className="category-tree-item">
            <div className="category-info">
              <MainIcon className="category-icon" />
              <span className="category-label">{mainCat.name}</span>
              <span className="category-count">{count}</span>
            </div>
            {(mainCat.id === 'organizational_training' || mainCat.id === 'self_learning') && (
              <Button
                type="text"
                size="small"
                icon={<FolderAddOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateSubcategory(mainCat.id);
                }}
                className="add-subcategory-btn"
              />
            )}
          </div>
        ),
        children: subcategories.map(subCat => {
          const SubIcon = iconMap[subCat.icon] || FolderOutlined;
          const subCount = stats.categories?.[subCat.id] || 0;
          
          return {
            key: subCat.id,
            title: (
              <div className="subcategory-tree-item">
                <div className="category-info">
                  <SubIcon className="category-icon" />
                  <span className="category-label">{subCat.name}</span>
                  <span className="category-count">{subCount}</span>
                </div>
                {subCat.isCustom && (
                  <Popconfirm
                    title="确定删除此子分类吗？"
                    onConfirm={(e) => {
                      e.stopPropagation();
                      handleDeleteSubcategory(subCat.id);
                    }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<MinusCircleOutlined />}
                      onClick={(e) => e.stopPropagation()}
                      className="delete-subcategory-btn"
                      danger
                    />
                  </Popconfirm>
                )}
              </div>
            )
          };
        })
      };
    });
  };

  // 选课卡片操作菜单
  const getCardMenuItems = (note) => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看',
      onClick: () => handleViewNote(note)
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
      onClick: () => handleEditNote(note)
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      onClick: () => handleDeleteNote(note.id),
      danger: true
    }
  ];

  // 如果显示编辑页面，渲染编辑页面
  if (showCourseSelectionEditPage) {
    return (
      <CourseSelectionEditPage
        onBack={handleBackFromEditPage}
        onViewChange={onViewChange}
        selectedNeed={selectedNote}
        mode={editorMode}
      />
    );
  }

  return (
    <div className="course-selection">
      <Layout>
        {/* 侧边栏 */}
        <Sider width={280} className="course-sidebar">
          <div className="sidebar-content">
            {/* 搜索框 */}
            <Search
              placeholder="搜索选课..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            {/* 分类列表 */}
            <div className="category-section">
              <Text strong>分类</Text>
              <Tree
                treeData={getCategoryTreeData()}
                selectedKeys={[selectedCategory]}
                expandedKeys={expandedCategories}
                onSelect={(keys) => {
                  if (keys.length > 0) {
                    setSelectedCategory(keys[0]);
                  }
                }}
                onExpand={(keys) => {
                  setExpandedCategories(keys);
                }}
                showIcon={false}
                className="category-tree"
              />
            </div>
          </div>
        </Sider>

        {/* 主内容区 */}
        <Content className="course-content">
          <div className="content-header">
            <div className="header-left">
              <Title level={3}>选课管理</Title>
              <Text type="secondary">
                共 {filteredNotes.length} 门课程
              </Text>
            </div>
            <div className="header-right">
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateNote}
                >
                  新建选课
                </Button>
                <Button
                  type="default"
                  icon={<BookOutlined />}
                  onClick={() => setTrainingNeedsModalVisible(true)}
                >
                  基于培训选课创建
                </Button>
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setAdvancedSearchVisible(true)}
                >
                  高级搜索
                </Button>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'generate-mock',
                        icon: <DatabaseOutlined />,
                        label: '生成模拟数据',
                        onClick: async () => {
                          const mockData = mockDataGenerator.generateCourseSelectionData(10);
                          await courseSelectionService.importNotes(mockData);
                          await loadData();
                          message.success('模拟数据生成成功');
                        }
                      },
                      {
                        key: 'import-export',
                        icon: <ExportOutlined />,
                        label: '导入导出',
                        onClick: () => setImportExportVisible(true)
                      },
                      {
                        key: 'category-manager',
                        icon: <TagOutlined />,
                        label: '分类管理',
                        onClick: () => setIsCategoryManagerVisible(true)
                      },
                      {
                        key: 'ai-assistant',
                        icon: <RobotOutlined />,
                        label: 'AI助手',
                        onClick: () => setIsAIAssistantVisible(true)
                      }
                    ]
                  }}
                  trigger={['click']}
                >
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              </Space>
            </div>
          </div>

          <div className="content-body">
            <Spin spinning={loading}>
              {filteredNotes.length === 0 ? (
                <Empty
                  description="暂无选课数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNote}>
                    创建第一门课程
                  </Button>
                </Empty>
              ) : (
                <Row gutter={[16, 16]}>
                  {filteredNotes.map(note => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={note.id}>
                      <Card
                        className="course-card"
                        hoverable
                        actions={[
                          <Tooltip title="查看详情">
                            <EyeOutlined onClick={() => handleViewNote(note)} />
                          </Tooltip>,
                          <Tooltip title="编辑">
                            <EditOutlined onClick={() => handleEditNote(note)} />
                          </Tooltip>,
                          <Tooltip title="删除">
                            <Popconfirm
                              title="确定要删除这门课程吗？"
                              onConfirm={() => handleDeleteNote(note.id)}
                              okText="确定"
                              cancelText="取消"
                            >
                              <DeleteOutlined />
                            </Popconfirm>
                          </Tooltip>
                        ]}
                      >
                        <Card.Meta
                          avatar={
                            <Avatar
                              style={{
                                backgroundColor: categories.find(c => c.value === note.category)?.color || '#1890ff'
                              }}
                              icon={<FileTextOutlined />}
                            />
                          }
                          title={
                            <div>
                              <Tooltip title={note.title}>
                                <div style={{ 
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis', 
                                  whiteSpace: 'nowrap',
                                  marginBottom: 4
                                }}>
                                  {note.title}
                                </div>
                              </Tooltip>
                              {/* 课程类型标识 */}
                              <Space size="small">
                                {note.type === 'organizational_training' && (
                                  <Tag color="orange" size="small">
                                    🏢 组织培训
                                  </Tag>
                                )}
                                {note.type === 'self_learning' && (
                                  <Tag color="green" size="small">
                                    📚 自主学习
                                  </Tag>
                                )}
                                {note.trainingNeedId && (
                                  <Tag color="blue" size="small">
                                    关联选课
                                  </Tag>
                                )}
                              </Space>
                            </div>
                          }
                          description={
                            <div>
                              <Paragraph
                                ellipsis={{ rows: 2 }}
                                style={{ marginBottom: 8, minHeight: 44 }}
                              >
                                {note.content}
                              </Paragraph>
                              <div style={{ marginBottom: 8 }}>
                                {(note.tags || []).slice(0, 2).map(tag => (
                                  <Tag key={tag} size="small" style={{ marginBottom: 4 }}>
                                    {tag}
                                  </Tag>
                                ))}
                                {(note.tags || []).length > 2 && (
                                  <Tag size="small" style={{ marginBottom: 4 }}>
                                    +{(note.tags || []).length - 2}
                                  </Tag>
                                )}
                              </div>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                <ClockCircleOutlined style={{ marginRight: 4 }} />
                                {new Date(note.updatedAt).toLocaleDateString()}
                              </Text>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Spin>
          </div>
        </Content>
      </Layout>

      {/* 选课编辑器 */}
        {isEditorVisible && (
          <NoteEditor
            visible={isEditorVisible}
            note={selectedNote}
            mode={editorMode}
            onSave={handleSaveNote}
            onCancel={() => {
              setIsEditorVisible(false);
              setSelectedNote(null);
            }}
            categories={noteCategories}
            tags={tags}
          />
        )}

        {/* 分类管理 */}
        {isCategoryManagerVisible && (
          <CategoryTagManager
            visible={isCategoryManagerVisible}
            onClose={() => setIsCategoryManagerVisible(false)}
            categories={noteCategories}
            tags={tags}
            onCategoriesChange={setNoteCategories}
            onTagsChange={setTags}
          />
        )}

        {/* AI助手 */}
        {isAIAssistantVisible && (
          <AIAssistant
            visible={isAIAssistantVisible}
            onClose={() => setIsAIAssistantVisible(false)}
            note={aiSelectedNote}
            onGenerate={generateAIReport}
          />
        )}

        {/* 高级搜索 */}
        {advancedSearchVisible && (
          <AdvancedSearch
            visible={advancedSearchVisible}
            onClose={() => setAdvancedSearchVisible(false)}
            onSearch={handleAdvancedSearch}
            categories={noteCategories}
            tags={tags}
          />
        )}

        {/* 导入导出 */}
        {importExportVisible && (
          <ImportExport
            visible={importExportVisible}
            onClose={() => setImportExportVisible(false)}
            onImport={handleImportNotes}
            onExport={handleExportNotes}
            onComplete={handleImportExportComplete}
          />
        )}

        {/* 新建选课弹窗 */}
        {noteCreateModalVisible && (
          <NoteCreateModal
            visible={noteCreateModalVisible}
            onClose={() => setNoteCreateModalVisible(false)}
            onSave={(noteData) => {
              setEditorMode('create-from-modal');
              handleSaveNote(noteData);
            }}
            categories={noteCategories}
            tags={tags}
          />
        )}

        {/* 培训选课选择模态框 */}
        <Modal
          title="基于培训选课创建组织培训课程"
          open={trainingNeedsModalVisible}
          onCancel={() => setTrainingNeedsModalVisible(false)}
          footer={null}
          width={800}
        >
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {trainingNeeds.length === 0 ? (
              <Empty description="暂无培训选课" />
            ) : (
              <Row gutter={[16, 16]}>
                {trainingNeeds.map(need => (
                  <Col span={24} key={need.id}>
                    <Card
                      hoverable
                      size="small"
                      onClick={async () => {
                        try {
                          const organizationalCourse = createOrganizationalCourse(need);
                          // 使用courseSelectionService创建组织培训课程
                          const createdCourse = await courseSelectionService.createCourse(organizationalCourse);
                          
                          // 重新加载数据以显示新创建的课程
                          await loadData();
                          
                          setTrainingNeedsModalVisible(false);
                          message.success('组织培训课程创建成功');
                        } catch (error) {
                          console.error('创建组织培训课程失败:', error);
                          message.error('创建组织培训课程失败');
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <Row justify="space-between" align="middle">
                        <Col flex="auto">
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text strong>{need.title}</Text>
                            <Text type="secondary" ellipsis>
                              {need.description || need.content}
                            </Text>
                            <Space>
                              <Tag color="blue">{need.category}</Tag>
                              {need.tags?.map(tag => (
                                <Tag key={tag} color="default">{tag}</Tag>
                              ))}
                            </Space>
                          </Space>
                        </Col>
                        <Col>
                          <Button type="primary" size="small">
                            创建课程
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Modal>

        {/* 子分类创建模态框 */}
        <Modal
          title={`为 "${selectedParentCategory === 'organizational' ? '组织培训' : '自主学习'}" 创建子分类`}
          open={subcategoryModalVisible}
          onCancel={() => {
            setSubcategoryModalVisible(false);
            subcategoryForm.resetFields();
          }}
          onOk={handleSubcategorySubmit}
          confirmLoading={false}
        >
          <Form
            form={subcategoryForm}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="子分类名称"
              rules={[
                { required: true, message: '请输入子分类名称' },
                { max: 20, message: '子分类名称不能超过20个字符' }
              ]}
            >
              <Input placeholder="请输入子分类名称" />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
              rules={[
                { max: 100, message: '描述不能超过100个字符' }
              ]}
            >
              <TextArea 
                rows={3} 
                placeholder="请输入子分类描述（可选）" 
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

export default CourseSelection;