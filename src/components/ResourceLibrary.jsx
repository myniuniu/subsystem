import React, { useState, useRef, useMemo, useEffect } from 'react'
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
  Checkbox,
  Upload,
  Radio,
  Popconfirm,
  Table
} from 'antd'
import { 
  FileTextOutlined, 
  SearchOutlined, 
  LinkOutlined,
  FilePptOutlined,
  HighlightOutlined,
  TableOutlined,
  BulbOutlined,
  FormOutlined,
  PieChartOutlined,
  FileMarkdownOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  UploadOutlined,
  RightOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  EyeOutlined,
  PushpinOutlined,
  PushpinFilled,
  BookOutlined,
  ExperimentOutlined,
  TeamOutlined,
  FolderOpenOutlined,
  HeartTwoTone,
  TagsOutlined,
  PlusOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  RocketOutlined
} from '@ant-design/icons'
// 新增：取消发布图标与删除区分
import { StopOutlined } from '@ant-design/icons'

import './SmartNotes.css'
import './ResourceLibrary.css'
import { initialResources } from '../data/resourceLibraryData'
import ResourceSidebar from './ResourceSidebar'
import ResourceCategorySidebar from './ResourceCategorySidebar'
import { getMockCourseContentHierarchy } from '../utils/mockCourseData'
import { getSystemCategoryConfig, saveSystemCategoryConfig } from '../services/categoryConfigService'
import { resourceCategoryData, mockResourcesForCategories } from '../data/resourceCategoryData'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

const ResourceLibrary = () => {
  const [expandedKeys, setExpandedKeys] = useState(['document', 'ppt', 'whiteboard'])
const [showCollectionView, setShowCollectionView] = useState(false)
  const [activeCollection, setActiveCollection] = useState(null)
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(null)
  const [configVersion, setConfigVersion] = useState(0)
  const prevSystemConfigRef = useRef(null)
  
  const DEFAULT_SPACE = '技术部-研发'
  const [currentSpace, setCurrentSpace] = useState(() => {
    try { return localStorage.getItem('current_knowledge_space') || DEFAULT_SPACE } catch { return DEFAULT_SPACE }
  })
  useEffect(() => {
    const onSpaceChanged = (e) => {
      const name = e?.detail?.name || localStorage.getItem('current_knowledge_space') || DEFAULT_SPACE
      console.log('[ResourceLibrary] knowledgeSpaceChanged ->', name, e?.detail)
      setCurrentSpace(name)
    }
    window.addEventListener('knowledgeSpaceChanged', onSpaceChanged)
    return () => window.removeEventListener('knowledgeSpaceChanged', onSpaceChanged)
  }, [])

  useEffect(() => {
    console.log('[ResourceLibrary] currentSpace =', currentSpace)
  }, [currentSpace])
  
  // 资源分类相关状态
  const [selectedResourceCategory, setSelectedResourceCategory] = useState('all')
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


  // 资料集合与云盘整合相关状态
  const [resourceCollections, setResourceCollections] = useState(() => createDefaultCollections())
const [collectionViewMode, setCollectionViewMode] = useState('grid') // 'grid' | 'list'

  // 接收试题页签的AI试题PDF同步事件，插入到对应资料集
  useEffect(() => {
    const onAiSync = (e) => {
      const detail = e?.detail || {};
      const { collectionId, item } = detail;
      if (!collectionId || !item) return;
      setResourceCollections(prev => prev.map(rc => (
        rc.id === collectionId ? { ...rc, items: [item, ...(rc.items || [])] } : rc
      )));
      if (activeCollection && activeCollection.id === collectionId) {
        setActiveCollection(prev => ({ ...prev, items: [item, ...(prev.items || [])] }));
      }
      message.success(`已接收AI试题PDF到资料集：${collectionId}`);
    };
    window.addEventListener('aiQuestionSync', onAiSync);
    return () => window.removeEventListener('aiQuestionSync', onAiSync);
  }, [activeCollection]);


  // 资源库分类（业务主题）
  const computeCount = (catId) => initialResources.filter(doc => doc.category === catId).length

  const categories = [
  { id: 'all', name: '全部资源', count: initialResources.length },
  { id: 'teaching_resources', name: '教学资源库', count: computeCount('teaching_resources') },
  { id: 'technology_training', name: '技术培训资源库', count: computeCount('technology_training') },
  { id: 'family_education', name: '家庭教育资源库', count: computeCount('family_education') },
  { id: 'school_management', name: '学校管理资源库', count: computeCount('school_management') },
  { id: 'mental_health', name: '心理健康资源库', count: computeCount('mental_health') },
  { id: 'new_teacher_resources', name: '新教师资源库', count: computeCount('new_teacher_resources') },
  { id: 'related_materials', name: '相关资料', count: 1 }
]

  // 通过“资源分类”侧栏值过滤集合的匹配函数
  const matchesSelectedCategory = (rc, selected) => {
    if (!rc) return false
    if (!selected || selected === 'all') return true
    // 顶级业务分类直接匹配集合的 category
    if (['teaching_resources','technology_training','family_education','school_management','mental_health','new_teacher_resources','related_materials'].includes(selected)) {
      return rc.category === selected
    }
    // 内容类型匹配（集合内任一条目命中即可）
    const typeMap = {
      documents: (it) => it.type === 'document' || it.type === 'pdf',
      videos: (it) => it.type === 'video',
      audio: (it) => it.type === 'audio',
      presentations: (it) => it.type === 'ppt'
    }
    // 学科通过标签近似匹配
    const subjectTagMap = {
      chinese: ['语文','古诗','作文','阅读'],
      math: ['数学'],
      english: ['英语','English'],
      science: ['科学','物理','化学','生物'],
      history: ['历史'],
      geography: ['地理']
    }
    // 年级通过标签近似匹配
    const gradeTagMap = {
      elementary: ['小学'],
      middle_school: ['初中','七年级','八年级','九年级'],
      high_school: ['高中'],
      university: ['大学']
    }
    // 特殊分类
    const specialMap = {
      starred: () => rc.isBookmarked === true,
      shared: () => rc.isShared === true,
      recent: () => (rc.items || []).some(it => {
        const d = new Date(it.lastModified)
        return !isNaN(d.getTime()) && (Date.now() - d.getTime()) < 1000*60*60*24*30
      })
    }
    if (typeMap[selected]) {
      return (rc.items || []).some(it => typeMap[selected](it))
    }
    if (subjectTagMap[selected]) {
      const keys = subjectTagMap[selected]
      return (rc.items || []).some(it => (it.tags || []).some(tag => keys.some(k => tag.includes(k))))
    }
    if (gradeTagMap[selected]) {
      const keys = gradeTagMap[selected]
      return (rc.items || []).some(it => (it.tags || []).some(tag => keys.some(k => tag.includes(k))))
    }
    if (specialMap[selected]) {
      return specialMap[selected]()
    }
    return false
  }

  // 集合列表视图：数据与列定义（放在 categories 之后以保证依赖可用）
  const collectionListData = useMemo(() => {
    const list = (selectedResourceCategory==='all' ? resourceCollections : resourceCollections.filter(rc => matchesSelectedCategory(rc, selectedResourceCategory)));
    const withFiltered = list.map(rc => ({
      rc,
      // 数量与显示使用当前空间的组织盘资源
      filteredOrgItems: (rc.items || []).filter(it => it.drive === 'org' && ((it.space || DEFAULT_SPACE) === currentSpace))
    }))
    return withFiltered
      .filter(x => x.filteredOrgItems.length > 0)
      .map(({ rc, filteredOrgItems }) => ({
        key: rc.id,
        id: rc.id,
        title: rc.title,
        categoryLabel: (categories.find(c => c.id === rc.category)?.name) || '资料集合',
        tags: (rc.tags || []).slice(0, 6),
        itemsCount: filteredOrgItems.length,
        createdAt: rc.createdAt,
        rc
      }))
  }, [resourceCollections, selectedResourceCategory, currentSpace]);

  const displayCollections = useMemo(() => {
    const list = (selectedResourceCategory==='all' ? resourceCollections : resourceCollections.filter(rc => matchesSelectedCategory(rc, selectedResourceCategory)));
    const withFiltered = list.map(rc => ({
      ...rc,
      // 卡片显示数量与是否展示，基于当前空间的组织盘资源
      filteredOrgItems: (rc.items || []).filter(it => it.drive === 'org' && ((it.space || DEFAULT_SPACE) === currentSpace))
    }))
    return withFiltered.filter(rc => rc.filteredOrgItems.length > 0)
  }, [resourceCollections, selectedResourceCategory, currentSpace])

  const collectionColumns = [
    {
      title: '缩略图',
      dataIndex: 'rc',
      key: 'thumb',
      width: 120,
      render: (rc) => (
        <div style={{ width: 100, height: 50, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0' }}>
          <img src={getCollectionThumbnail(rc)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <span style={{ fontWeight: 600 }}>{text}</span>
      )
    },
    {
      title: '分类',
      dataIndex: 'categoryLabel',
      key: 'category'
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(tags || []).map(tag => <AntTag key={tag}>{tag}</AntTag>)}
        </div>
      )
    },
    {
      title: '数量',
      dataIndex: 'itemsCount',
      key: 'count',
      width: 80
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140
    },
    {
      title: '状态',
      key: 'publishStatus',
      width: 100,
      render: (_, record) => {
        const s = record.rc?.publish?.status
        if (!s) return <AntTag>未发布</AntTag>
        return (
          <AntTag color={s === 'published' ? 'green' : 'volcano'}>
            {s === 'published' ? '已发布' : '草稿'}
          </AntTag>
        )
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 220,
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="编辑集合">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); handleEditCollection(record.rc); }} />
          </Tooltip>
          <Tooltip title="编辑标签">
            <Button type="text" size="small" icon={<TagsOutlined />} onClick={(e) => { e.stopPropagation(); handleEditCollection(record.rc); }} />
          </Tooltip>
          <Tooltip title="预览集合">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); handlePreviewCollection(record.rc); }} />
          </Tooltip>
          {record.rc?.publish?.status ? (
            <Tooltip title="取消发布">
              <Button type="text" size="small" danger icon={<StopOutlined />} onClick={(e) => { e.stopPropagation(); handleUnpublishCollection(record.rc); }} />
            </Tooltip>
          ) : (
            <Tooltip title="发布集合">
              <Button type="text" size="small" icon={<RocketOutlined />} onClick={(e) => { e.stopPropagation(); handleOpenPublishModal(record.rc); }} />
            </Tooltip>
          )}
          <Tooltip title="分享集合">
            <Button type="text" size="small" icon={<ShareAltOutlined />} onClick={(e) => { e.stopPropagation(); handleShareCollection(record.id); }} />
          </Tooltip>
          <Popconfirm title="确定删除该集合？" onConfirm={() => handleDeleteCollection(record.id)} okText="删除" cancelText="取消">
            <Tooltip title="删除集合">
              <Button type="text" size="small" icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

// === 课程大纲驱动的“我的分类”模拟 ===
const courseHierarchy = useMemo(() => getMockCourseContentHierarchy()?.[0] || null, [])
const courseGroups = useMemo(() => {
  if (!courseHierarchy) return []
  const chapterGroups = (courseHierarchy.chapters || []).map(ch => ({
    key: `group_${ch.id}`,
    title: ch.title,
    templateId: null,
    icon: 'FolderOpenOutlined',
    // 章下直接挂节为叶子分类
    childrenValues: (ch.sections || []).map(sec => `${sec.id}`),
    groups: []
  }))
  const relatedGroup = {
    key: 'group_related_materials',
    title: '相关资料',
    templateId: null,
    icon: 'FolderOpenOutlined',
    childrenValues: ['related_materials'],
    groups: []
  }
  return [...chapterGroups, relatedGroup]
}, [courseHierarchy])

// 节级分类（用于“我的分类”计数）：每个节作为叶子分类
const sectionCategories = useMemo(() => {
  if (!courseHierarchy) return []
  const cats = []
  ;(courseHierarchy.chapters || []).forEach(ch => {
    (ch.sections || []).forEach(sec => {
      cats.push({ value: `${sec.id}`, label: sec.title, icon: 'FileTextOutlined', type: 'system' })
    })
  })
  // 追加“相关资料”单一叶子分类
  cats.push({ value: 'related_materials', label: '相关资料', icon: 'FileTextOutlined', type: 'system' })
  return cats
}, [courseHierarchy])

// 所有节ID，用于将集合项均匀映射到节，生成计数
const sectionIds = useMemo(() => (
  (courseHierarchy?.chapters || []).flatMap(ch => (ch.sections || []).map(sec => sec.id))
), [courseHierarchy])

const getItemCategoryValue = (item) => {
  if (!sectionIds.length) return null
  const idx = Math.abs((item.title || '').length + String(item.id || '').length) % sectionIds.length
  return sectionIds[idx]
}

const notesForCounts = useMemo(() => {
  const items = activeCollection?.items || []
  const sectionMapped = items.map(it => ({
    id: it.id,
    category: getItemCategoryValue(it) || 'unknown',
    starred: !!it.isBookmarked,
    tags: it.tags || [],
    source: it.drive === 'org' ? '组织盘' : '个人盘'
  }))
  const typeSet = new Set(['document','pdf','ppt','table','whiteboard'])
  const typeMapped = items
    .map(it => {
      if (!typeSet.has(it.type)) return null
      return {
        id: `${it.id}-related`,
        category: 'related_materials',
        starred: !!it.isBookmarked,
        tags: it.tags || [],
        source: it.drive === 'org' ? '组织盘' : '个人盘'
      }
    })
    .filter(Boolean)
  return [...sectionMapped, ...typeMapped]
}, [activeCollection, sectionIds])

useEffect(() => {
  if (showCollectionView) {
    const prev = getSystemCategoryConfig()
    prevSystemConfigRef.current = prev
    const nextConfig = { groups: courseGroups, extraCategories: [] }
    saveSystemCategoryConfig(nextConfig)
    setConfigVersion(v => v + 1)
  } else if (prevSystemConfigRef.current) {
    saveSystemCategoryConfig(prevSystemConfigRef.current)
    prevSystemConfigRef.current = null
    setConfigVersion(v => v + 1)
  }
}, [showCollectionView, courseGroups])

// 分类图标映射（用于 note-header 左侧展示）
const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'teaching_resources':
      return <BookOutlined style={{ color: '#1f2937' }} />
    case 'technology_training':
      return <ExperimentOutlined style={{ color: '#3b82f6' }} />
    case 'family_education':
      return <TeamOutlined style={{ color: '#f59e0b' }} />
    case 'school_management':
      return <FolderOpenOutlined style={{ color: '#10b981' }} />
    case 'mental_health':
      return <HeartTwoTone twoToneColor="#eb2f96" />
    case 'new_teacher_resources':
      return <BookOutlined style={{ color: '#6d28d9' }} />
    default:
      return <FileTextOutlined />
  }
}

// 初始化默认资料集合，进入页面即可看到内容（按五大分类动态生成）
  function createDefaultCollections() {
    const pickByCategory = (cat, limit = 8) => initialResources.filter(r => r.category === cat).slice(0, limit)
    const today = new Date().toLocaleDateString('zh-CN')
    const cats = [
      { id: 'teaching_resources', title: '教学资源精选' },
      { id: 'technology_training', title: '技术培训精选' },
      { id: 'family_education', title: '家庭教育精选' },
      { id: 'school_management', title: '学校管理精选' },
      { id: 'mental_health', title: '心理健康研修' }
    ]
    const uniqueTags = (items, limit = 12) => {
      const set = new Set()
      items.forEach(i => (i.tags || []).forEach(t => set.add(t)))
      return Array.from(set).slice(0, limit)
    }

    // 基础五大分类的集合
    const baseCollections = cats.map((c, idx) => {
      const items = pickByCategory(c.id, 8)
      // 添加“场景模拟”类型的模拟数据
      if (c.id === 'technology_training') {
        items.push({ id: 'scn-phy-1', title: '科学演示：电磁感应虚拟实验', type: 'scenario', drive: 'org', size: 'N/A', lastModified: today, tags: ['科学演示','物理','虚拟仿真'] })
      }
      if (c.id === 'mental_health') {
        items.push({ id: 'scn-psy-1', title: '心理健康辅导：校园压力疏导', type: 'scenario', drive: 'my', size: 'N/A', lastModified: today, tags: ['心理健康','辅导','情绪管理'] })
      }
      return {
        id: `rc-${c.id}-${idx+1}`,
        title: c.title,
        category: c.id,
        createdAt: today,
        items,
        tags: uniqueTags(items),
        isBookmarked: false,
        isShared: false,
        publish: c.id === 'technology_training' ? { status: 'published', space: DEFAULT_SPACE, title: c.title } : undefined
      }
    })

    // 新教师资源库：初始化8个集合，每个包含视频课程、试卷、教辅
    const newTeacherCollections = [
      {
        id: 'rc-new_teacher_resources-1',
        title: '新教师入职培训 · 教学方法入门',
        category: 'new_teacher_resources',
        createdAt: today,
        publish: { status: 'published', space: DEFAULT_SPACE, title: '新教师入职培训 · 教学方法入门' },
        items: [
          { id: 'nt-1-v1', title: '课堂组织与管理（视频课程）', type: 'video', drive: 'org', size: '320 MB', lastModified: '2024-01-12', tags: ['新教师','视频课程','课堂组织'] },
          { id: 'nt-1-p1', title: '第一次课堂教学设计范例（教辅PPT）', type: 'ppt', drive: 'org', size: '2.4 MB', lastModified: '2024-01-11', tags: ['教辅','课件','教学设计'] },
          { id: 'nt-1-e1', title: '中小学新任教师公开招聘模拟考试', type: 'pdf', drive: 'my', size: '210 KB', lastModified: '2024-01-10', tags: ['试卷','评价','表格'], url: '/assets/新教师入职线上培训具体方案.pdf' },
          { id: 'nt-1-d1', title: '备课流程与清单（PDF 教辅）', type: 'document', drive: 'my', size: '1.6 MB', lastModified: '2024-01-09', tags: ['教辅','备课','流程'] },
          { id: 'nt-1-w1', title: '白板笔记模板（教学白板）', type: 'whiteboard', drive: 'org', size: 'N/A', lastModified: '2024-01-08', tags: ['白板','互动','教学'] },
          { id: 'nt-1-q1', title: '教师招聘考试常考题题库', type: 'pdf', drive: 'org', size: '3.2 MB', lastModified: today, tags: ['试题库','教师招聘','考试'], url: '/assets/试题库1-附答案.pdf', space: DEFAULT_SPACE }
        ],
        tags: ['新教师','课堂管理','教学方法','备课'],
        isBookmarked: false,
        isShared: false
      },
      {
        id: 'rc-new_teacher_resources-2',
        title: '新教师课堂设计 · 示范课案例',
        category: 'new_teacher_resources',
        createdAt: today,
        items: [
          { id: 'nt-2-v1', title: '示范课：导入与提问技巧（视频）', type: 'video', drive: 'org', size: '280 MB', lastModified: '2024-01-12', tags: ['视频课程','示范课','课堂提问'] },
          { id: 'nt-2-p1', title: '课堂流程设计模板（PPT 教辅）', type: 'ppt', drive: 'my', size: '3.1 MB', lastModified: '2024-01-11', tags: ['PPT','教辅','流程模板'] },
          { id: 'nt-2-e1', title: '课堂观察记录表（试卷/表格）', type: 'table', drive: 'org', size: '180 KB', lastModified: '2024-01-10', tags: ['表格','观察','评价'] },
          { id: 'nt-2-d1', title: '教学目标编写指南（PDF 教辅）', type: 'document', drive: 'my', size: '2.0 MB', lastModified: '2024-01-09', tags: ['指南','目标','教辅'] }
        ],
        tags: ['示范课','课堂设计','教学目标','观察'],
        isBookmarked: false,
        isShared: false
      },
      {
        id: 'rc-new_teacher_resources-3',
        title: '班级管理 · 沟通与家校协作',
        category: 'new_teacher_resources',
        createdAt: today,
        items: [
          { id: 'nt-3-v1', title: '与学生沟通的关键点（视频）', type: 'video', drive: 'org', size: '310 MB', lastModified: '2024-01-12', tags: ['沟通','视频课程','学生发展'] },
          { id: 'nt-3-p1', title: '家校沟通通知模板（PPT 教辅）', type: 'ppt', drive: 'org', size: '1.2 MB', lastModified: '2024-01-11', tags: ['家校沟通','模板','教辅'] },
          { id: 'nt-3-e1', title: '班级常规检查表（试卷/表格）', type: 'table', drive: 'my', size: '160 KB', lastModified: '2024-01-10', tags: ['班级管理','检查','表格'] },
          { id: 'nt-3-d1', title: '班级管理手册（PDF 教辅）', type: 'document', drive: 'my', size: '2.7 MB', lastModified: '2024-01-09', tags: ['管理手册','教辅','班级'] }
        ],
        tags: ['班级管理','家校沟通','常规检查','手册'],
        isBookmarked: false,
        isShared: false
      },
      {
        id: 'rc-new_teacher_resources-4',
        title: '评价与作业 · 试卷与批改策略',
        category: 'new_teacher_resources',
        createdAt: today,
        items: [
          { id: 'nt-4-v1', title: '作业设计与批改要点（视频）', type: 'video', drive: 'org', size: '290 MB', lastModified: '2024-01-12', tags: ['作业','视频课程','批改'] },
          { id: 'nt-4-p1', title: '试卷命题规范（PPT 教辅）', type: 'ppt', drive: 'my', size: '2.9 MB', lastModified: '2024-01-11', tags: ['试卷','命题','规范'] },
          { id: 'nt-4-e1', title: '作业批改记录表（试卷/表格）', type: 'table', drive: 'org', size: '140 KB', lastModified: '2024-01-10', tags: ['批改','记录','表格'] },
          { id: 'nt-4-d1', title: '形成性评价工具包（PDF 教辅）', type: 'document', drive: 'my', size: '1.8 MB', lastModified: '2024-01-09', tags: ['评价','工具包','教辅'] }
        ],
        tags: ['作业设计','批改','命题规范','形成性评价'],
        isBookmarked: false,
        isShared: false
      },
      {
        id: 'rc-new_teacher_resources-5',
        title: '课堂互动 · 问题设计与反馈',
        category: 'new_teacher_resources',
        createdAt: today,
        items: [
          { id: 'nt-5-v1', title: '高效提问的技巧（视频）', type: 'video', drive: 'org', size: '260 MB', lastModified: '2024-01-12', tags: ['课堂互动','视频课程','提问'] },
          { id: 'nt-5-p1', title: '互动活动库（PPT 教辅）', type: 'ppt', drive: 'org', size: '3.5 MB', lastModified: '2024-01-11', tags: ['互动','活动库','教辅'] },
          { id: 'nt-5-e1', title: '课堂反馈记录表（试卷/表格）', type: 'table', drive: 'my', size: '135 KB', lastModified: '2024-01-10', tags: ['反馈','记录','表格'] },
          { id: 'nt-5-d1', title: '提问层级与分类（PDF 教辅）', type: 'document', drive: 'my', size: '2.2 MB', lastModified: '2024-01-09', tags: ['提问','层级','教辅'] }
        ],
        tags: ['课堂互动','反馈','活动设计','提问技巧'],
        isBookmarked: false,
        isShared: false
      },
      {
        id: 'rc-new_teacher_resources-6',
        title: '学科课堂 · 新教师示例课（语数英）',
        category: 'new_teacher_resources',
        createdAt: today,
        items: [
          { id: 'nt-6-v1', title: '小学数学：数与代数（视频）', type: 'video', drive: 'org', size: '300 MB', lastModified: '2024-01-12', tags: ['数学','视频课程','小学'] },
          { id: 'nt-6-p1', title: '语文古诗教学模板（PPT 教辅）', type: 'ppt', drive: 'my', size: '2.6 MB', lastModified: '2024-01-11', tags: ['语文','模板','教辅'] },
          { id: 'nt-6-e1', title: '英语听力练习卷（试卷/表格）', type: 'table', drive: 'org', size: '120 KB', lastModified: '2024-01-10', tags: ['英语','试卷','练习'] },
          { id: 'nt-6-d1', title: '跨学科教学设计案例（PDF 教辅）', type: 'document', drive: 'my', size: '2.1 MB', lastModified: '2024-01-09', tags: ['跨学科','教学设计','教辅'] }
        ],
        tags: ['数学','语文','英语','示例课'],
        isBookmarked: false,
        isShared: false
      },
      {
        id: 'rc-new_teacher_resources-7',
        title: '信息化教学 · 白板与多媒体',
        category: 'new_teacher_resources',
        createdAt: today,
        items: [
          { id: 'nt-7-v1', title: '白板互动与资源整合（视频）', type: 'video', drive: 'org', size: '275 MB', lastModified: '2024-01-12', tags: ['信息化','白板','视频课程'] },
          { id: 'nt-7-p1', title: '多媒体课件制作指南（PPT 教辅）', type: 'ppt', drive: 'org', size: '4.0 MB', lastModified: '2024-01-11', tags: ['多媒体','课件','指南'] },
          { id: 'nt-7-e1', title: '课堂技术应用效果评估表（试卷/表格）', type: 'table', drive: 'my', size: '150 KB', lastModified: '2024-01-10', tags: ['评估','技术应用','表格'] },
          { id: 'nt-7-d1', title: '信息化教学最佳实践（PDF 教辅）', type: 'document', drive: 'my', size: '2.8 MB', lastModified: '2024-01-09', tags: ['最佳实践','教辅','信息化'] }
        ],
        tags: ['白板','多媒体','评估','最佳实践'],
        isBookmarked: false,
        isShared: false
      },
      {
        id: 'rc-new_teacher_resources-8',
        title: '职业发展 · 师德师风与成长',
        category: 'new_teacher_resources',
        createdAt: today,
        items: [
          { id: 'nt-8-v1', title: '师德师风建设（视频）', type: 'video', drive: 'org', size: '240 MB', lastModified: '2024-01-12', tags: ['师德师风','视频课程','职业发展'] },
          { id: 'nt-8-p1', title: '新教师成长路线图（PPT 教辅）', type: 'ppt', drive: 'my', size: '3.3 MB', lastModified: '2024-01-11', tags: ['成长','路线图','教辅'] },
          { id: 'nt-8-e1', title: '研修计划与考核表（试卷/表格）', type: 'table', drive: 'org', size: '200 KB', lastModified: '2024-01-10', tags: ['研修','考核','表格'] },
          { id: 'nt-8-d1', title: '新教师读书清单（PDF 教辅）', type: 'document', drive: 'my', size: '1.4 MB', lastModified: '2024-01-09', tags: ['读书清单','教辅','成长'] }
        ],
        tags: ['职业发展','研修','师德师风','成长'],
        isBookmarked: false,
        isShared: false
      }
    ]

    // 相关资料分类的资源集合
    const relatedMaterialsCollections = [
      {
        id: 'rc-related_materials-1',
        title: '教师招聘考试资料库',
        category: 'related_materials',
        createdAt: today,
        items: [
          { 
            id: 'rm-1-q1', 
            title: '教师招聘考试常考题题库', 
            type: 'pdf', 
            drive: 'org', 
            size: '3.2 MB', 
            lastModified: today, 
            tags: ['试题库','教师招聘','考试'], 
            url: '/assets/试题库1-附答案.pdf',
            space: DEFAULT_SPACE  // 明确指定空间，确保显示
          }
        ],
        tags: ['试题库','教师招聘','考试资料'],
        isBookmarked: false,
        isShared: false
      }
    ]

    return [...baseCollections, ...newTeacherCollections, ...relatedMaterialsCollections].map(rc => ({
      ...rc,
      items: (rc.items || []).map((it, idx) => ({
        ...it,
        // 仅组织盘参与空间过滤；为演示效果将部分组织盘资源分配到“帮助文档”
        space: it.space || (it.drive === 'org' ? (idx % 2 === 0 ? DEFAULT_SPACE : '帮助文档') : undefined)
      }))
    }))
  }
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [resourceTitle, setResourceTitle] = useState('')
  const [cloudFilters, setCloudFilters] = useState({ drive: 'all', type: 'all', q: '' })
  const [selectedCloudIds, setSelectedCloudIds] = useState([])
  const [showResourceDetail, setShowResourceDetail] = useState(false)
  const [activeResource, setActiveResource] = useState(null)
  // 编辑集合相关状态
  const [showEditCollectionModal, setShowEditCollectionModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState(null)
  const [editCollectionTitle, setEditCollectionTitle] = useState('')
  const [editCollectionTags, setEditCollectionTags] = useState([])

  // 发布集合相关状态与处理
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishingCollection, setPublishingCollection] = useState(null)
  const [publishSpace, setPublishSpace] = useState(currentSpace)
  const [publishImages, setPublishImages] = useState([])
  const [publishTitle, setPublishTitle] = useState('')
  const [publishSummary, setPublishSummary] = useState('')
  const [publishLecturer, setPublishLecturer] = useState('')

  const handleOpenPublishModal = (rc) => {
    setPublishingCollection(rc)
    setPublishSpace(currentSpace)
    setPublishImages([])
    setPublishTitle(rc?.title || '')
    setPublishSummary('')
    setPublishLecturer('')
    setShowPublishModal(true)
  }

  const savePublishInfo = (status) => {
    if (!publishingCollection) return
    const imgUrls = (publishImages || []).map(f => f.url || f.thumbUrl).filter(Boolean)
    const payload = {
      space: publishSpace,
      images: imgUrls,
      title: publishTitle,
      summary: publishSummary,
      lecturer: publishLecturer,
      status
    }
    setResourceCollections(prev => prev.map(c => c.id === publishingCollection.id ? { ...c, publish: payload } : c))
    setActiveCollection(prev => prev && prev.id === publishingCollection.id ? { ...prev, publish: payload } : prev)

    // 同步到本地存储，供学习广场读取
    try {
      const raw = localStorage.getItem('published_collections')
      const map = raw ? JSON.parse(raw) : {}
      map[publishingCollection.id] = payload
      localStorage.setItem('published_collections', JSON.stringify(map))
    } catch (e) {}
  }

  const handleSaveDraftPublish = () => {
    savePublishInfo('draft')
    setShowPublishModal(false)
    setPublishingCollection(null)
    message.success('已暂存发布信息')
  }

  const handleConfirmPublish = () => {
    Modal.confirm({
      title: '确认发布',
      content: '是否要发布到学习广场？',
      okText: '发布',
      cancelText: '取消',
      onOk: () => {
        savePublishInfo('published')
        setShowPublishModal(false)
        setPublishingCollection(null)
        message.success('集合已发布到学习广场')
      }
    })
  }
  const handleUnpublishCollection = (rc) => {
    if (!rc) return
    Modal.confirm({
      title: '取消发布',
      content: '确认将该集合取消发布？此操作不会删除内容。',
      okText: '取消发布',
      cancelText: '保留发布',
      onOk: () => {
        setResourceCollections(prev => prev.map(c => c.id === rc.id ? { ...c, publish: undefined } : c))
        if (activeResource && activeResource.id === rc.id) {
          setActiveResource(prev => ({ ...prev, publish: undefined }))
        }
        try {
          const raw = localStorage.getItem('published_collections')
          const map = raw ? JSON.parse(raw) : {}
          delete map[rc.id]
          localStorage.setItem('published_collections', JSON.stringify(map))
        } catch (e) {}
        message.success('已取消发布该集合')
      }
    })
  }
  
  // 恢复云盘数据状态，供“从云盘添加”使用
  const [cloudDriveItems, setCloudDriveItems] = useState([
    { id: 'c-vid-1', title: '高中物理：匀加速直线运动.mp4', type: 'video', drive: 'org', category: 'video', subCategory: 'course-video', size: '512 MB', lastModified: '2024-01-11', tags: ['物理','高中','课程视频'] },
    { id: 'c-vid-2', title: '初中化学：酸碱反应实验.mp4', type: 'video', drive: 'my', category: 'video', subCategory: 'course-video', size: '430 MB', lastModified: '2024-01-09', tags: ['化学','初中','课程视频'] },
    { id: 'c-aud-1', title: '英语课：自然拼读音频.mp3', type: 'audio', drive: 'my', category: 'audio', subCategory: 'course-audio', size: '45 MB', lastModified: '2024-01-10', tags: ['英语','小学','课程音频'] },
    { id: 'c-doc-1', title: '教学设计：分数的认识.docx', type: 'document', drive: 'org', category: 'document', subCategory: 'document-design', size: '1.2 MB', lastModified: '2024-01-08', tags: ['数学','小学','教学设计'] },
    { id: 'c-ppt-1', title: '幻灯片：函数图像.pptx', type: 'ppt', drive: 'my', category: 'ppt', subCategory: 'office-ppt', size: '3.2 MB', lastModified: '2024-01-07', tags: ['数学','高中','课件'] },
    { id: 'c-white-1', title: '白板：项目式学习思维导图', type: 'whiteboard', drive: 'org', category: 'whiteboard', subCategory: 'whiteboard-mindmap', size: 'N/A', lastModified: '2024-01-06', tags: ['项目式','思维导图'] },
    { id: 'c-file-1', title: '课堂讲义.pdf', type: 'document', drive: 'my', category: 'file', subCategory: 'office-pdf', size: '6.8 MB', lastModified: '2024-01-05', tags: ['讲义','PDF'] },
    { id: 'c-xlsx-1', title: '教学进度表.xlsx', type: 'table', drive: 'org', category: 'table', subCategory: 'office-excel', size: '420 KB', lastModified: '2024-01-04', tags: ['进度表','Excel'] },
    { id: 'c-scn-1', title: '科学演示：电磁感应虚拟实验', type: 'scenario', drive: 'org', category: 'scenario', subCategory: 'science_demo', size: 'N/A', lastModified: '2024-01-03', tags: ['科学演示','物理','虚拟仿真'] },
    { id: 'c-scn-2', title: '心理健康辅导：校园压力疏导', type: 'scenario', drive: 'my', category: 'scenario', subCategory: 'mental_health_counseling', size: 'N/A', lastModified: '2024-01-02', tags: ['心理健康','辅导','情绪管理'] }
  ].map((it, idx) => ({
    ...it,
    // 仅组织盘参与空间过滤；为演示效果将部分组织盘资源分配到“帮助文档”
    space: it.drive === 'org' ? (idx % 2 === 0 ? DEFAULT_SPACE : '帮助文档') : undefined
  })))
  
  const [newCloudTarget, setNewCloudTarget] = useState('org')

  // 收集可选空间（发布位置）
  const availableSpaces = useMemo(() => {
    const set = new Set([DEFAULT_SPACE])
    ;(resourceCollections || []).forEach(rc => (rc.items || []).forEach(it => {
      if (it.drive === 'org' && (it.space || DEFAULT_SPACE)) set.add(it.space || DEFAULT_SPACE)
    }))
    cloudDriveItems.forEach(it => { if (it.drive === 'org' && (it.space || DEFAULT_SPACE)) set.add(it.space || DEFAULT_SPACE) })
    return Array.from(set)
  }, [resourceCollections, cloudDriveItems])

  // 集合卡片动作处理（编辑/置顶/分享/删除）
  const handleEditCollection = (rc) => {
    setEditingCollection(rc)
    setEditCollectionTitle(rc.title)
    setEditCollectionTags(rc.tags || [])
    setShowEditCollectionModal(true)
  }
  const handleSaveCollectionEdit = () => {
    if (!editingCollection) return
    setResourceCollections(prev => prev.map(c => c.id === editingCollection.id ? { ...c, title: editCollectionTitle, tags: editCollectionTags } : c))
    if (activeResource && activeResource.id === editingCollection.id) {
      setActiveResource(prev => ({ ...prev, title: editCollectionTitle, tags: editCollectionTags }))
    }
    setShowEditCollectionModal(false)
    setEditingCollection(null)
    message.success('集合已更新')
  }
  const handleToggleStar = (id) => {
    setResourceCollections(prev => prev.map(c => c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c))
  }
  const handleShareCollection = (id) => {
    setResourceCollections(prev => prev.map(c => c.id === id ? { ...c, isShared: true } : c))
    message.success('已分享该集合')
  }
  const handleDeleteCollection = (id) => {
    setResourceCollections(prev => prev.filter(c => c.id !== id))
    if (activeResource && activeResource.id === id) {
      setShowResourceDetail(false)
      setActiveResource(null)
    }
    message.success('集合已删除')
  }

  // 重置示例数据：重新生成集合（包含空间标注）
  const handleResetDemoData = () => {
    setResourceCollections(createDefaultCollections())
    message.success('已重置示例数据（含空间标注）')
  }

  // 资源项标签编辑（在集合详情中对单个资源打标签）
  const [showEditItemTagsModal, setShowEditItemTagsModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editingItemParentId, setEditingItemParentId] = useState(null)
  const [editingItemTags, setEditingItemTags] = useState([])

  const handleOpenEditItemTags = (item, parentRc) => {
    setEditingItem(item)
    setEditingItemParentId(parentRc?.id)
    setEditingItemTags(item.tags || [])
    setShowEditItemTagsModal(true)
  }
  const handleSaveItemTags = () => {
    if (!editingItem || !editingItemParentId) return
    setResourceCollections(prev => prev.map(rc => rc.id === editingItemParentId ? {
      ...rc,
      items: (rc.items || []).map(it => it.id === editingItem.id ? { ...it, tags: editingItemTags } : it)
    } : rc))
    if (activeResource && activeResource.id === editingItemParentId) {
      setActiveResource(prev => ({
        ...prev,
        items: (prev.items || []).map(it => it.id === editingItem.id ? { ...it, tags: editingItemTags } : it)
      }))
    }
    setShowEditItemTagsModal(false)
    setEditingItem(null)
    setEditingItemParentId(null)
    setEditingItemTags([])
    message.success('资源标签已更新')
  }

  // 新增：集合内添加/删除资源的状态与处理函数
  const [showAddItemsModal, setShowAddItemsModal] = useState(false)
  const [addCloudFilters, setAddCloudFilters] = useState({ drive: 'all', type: 'all', q: '' })
  const [selectedAddCloudIds, setSelectedAddCloudIds] = useState([])

  const handleOpenAddItemsModal = () => {
    setSelectedAddCloudIds([])
    setAddCloudFilters({ drive: 'all', type: 'all', q: '' })
    setShowAddItemsModal(true)
  }
  const handleToggleAddCloudSelect = (id) => {
    setSelectedAddCloudIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }
  const handleAddItemsToCollection = () => {
    if (!activeResource) return
    if (selectedAddCloudIds.length === 0) {
      message.warning('请先选择要添加的资源')
      return
    }
    const itemsToAdd = cloudDriveItems
      .filter(it => selectedAddCloudIds.includes(it.id))
      .map(it => ({ ...it }))

    setResourceCollections(prev => prev.map(rc => {
      if (rc.id !== activeResource.id) return rc
      const existingIds = new Set((rc.items || []).map(it => it.id))
      const merged = [...(rc.items || []), ...itemsToAdd.filter(it => !existingIds.has(it.id))]
      return { ...rc, items: merged }
    }))
    setActiveResource(prev => {
      if (!prev || prev.id !== activeResource.id) return prev
      const existingIds = new Set((prev.items || []).map(it => it.id))
      const merged = [...(prev.items || []), ...itemsToAdd.filter(it => !existingIds.has(it.id))]
      return { ...prev, items: merged }
    })

    setShowAddItemsModal(false)
    setSelectedAddCloudIds([])
    message.success('已添加到集合')
  }
  const handleDeleteItemFromCollection = (parentId, itemId) => {
    setResourceCollections(prev => prev.map(rc => rc.id === parentId ? {
      ...rc,
      items: (rc.items || []).filter(it => it.id !== itemId)
    } : rc))
    setActiveResource(prev => {
      if (!prev || prev.id !== parentId) return prev
      return { ...prev, items: (prev.items || []).filter(it => it.id !== itemId) }
    })
    message.success('已从集合删除该资源')
  }

  const formatFileSize = (size) => {
    if (typeof size !== 'number') return size || 'N/A'
    const units = ['B', 'KB', 'MB', 'GB']
    let i = 0
    let s = size
    while (s >= 1024 && i < units.length - 1) { s /= 1024; i++ }
    return `${s.toFixed( (i===0)?0: 1)} ${units[i]}`
  }
  const formatDate = (d = new Date()) => {
    const y = d.getFullYear()
    const m = `${d.getMonth()+1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  const inferTypeFromFilename = (name = '') => {
    const ext = name.split('.').pop().toLowerCase()
    if (['mp4','mov','m4v','avi','mkv','webm'].includes(ext)) return 'video'
    if (['mp3','wav','aac','flac','ogg'].includes(ext)) return 'audio'
    if (['ppt','pptx','key'].includes(ext)) return 'ppt'
    if (['xls','xlsx','csv'].includes(ext)) return 'table'
    if (['md'].includes(ext)) return 'markdown'
    if (['pdf','doc','docx','txt','rtf'].includes(ext)) return 'document'
    return 'document'
  }
  const handleBeforeUpload = (file) => {
    const type = inferTypeFromFilename(file.name)
    const newItem = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      title: file.name,
      type,
      drive: newCloudTarget,
      space: currentSpace,
      category: type,
      subCategory: 'uploaded',
      size: formatFileSize(file.size),
      lastModified: formatDate(),
      tags: ['上传','本地']
    }
    setCloudDriveItems(prev => [newItem, ...prev])
    setSelectedCloudIds(prev => [...prev, newItem.id])
    message.success(`已上传到${newCloudTarget==='org'?'组织盘':'个人盘'}：${file.name}`)
    return false
  }
  const handleCreateCloudItem = (type) => {
    const titleMap = {
      document: '未命名文档',
      ppt: '未命名PPT',
      table: '未命名表格',
      whiteboard: '未命名白板'
    }
    const newItem = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      title: titleMap[type] || '未命名项',
      type,
      drive: newCloudTarget,
      space: currentSpace,
      category: type,
      subCategory: 'new',
      size: type==='whiteboard' ? 'N/A' : '0 KB',
      lastModified: formatDate(),
      tags: ['新建']
    }
    setCloudDriveItems(prev => [newItem, ...prev])
    setSelectedCloudIds(prev => [...prev, newItem.id])
    message.success(`已在${newCloudTarget==='org'?'组织盘':'个人盘'}新建：${newItem.title}`)
  }
  
  // 文档类型定义
  const documentTypes = [
    {
      key: 'multidimensional',
      title: '多维表格',
      description: '支持多种数据类型的智能表格',
      icon: <TableOutlined style={{ fontSize: '18px', color: '#722ed1' }} />,
      color: '#722ed1'
    },
    {
      key: 'document',
      title: '文档',
      description: '富文本编辑器，支持协作编辑',
      icon: <FileTextOutlined style={{ fontSize: '18px', color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      key: 'table',
      title: '表格',
      description: '在线电子表格，支持公式计算',
      icon: <TableOutlined style={{ fontSize: '18px', color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      key: 'presentation',
      title: '幻灯片',
      description: '演示文稿制作工具',
      icon: <FilePptOutlined style={{ fontSize: '18px', color: '#fa8c16' }} />,
      color: '#fa8c16'
    },
    {
      key: 'survey',
      title: '问卷',
      description: '在线问卷调查工具',
      icon: <FormOutlined style={{ fontSize: '18px', color: '#eb2f96' }} />,
      color: '#eb2f96'
    },
    {
      key: 'mindmap',
      title: '思维笔记',
      description: '思维导图和笔记工具',
      icon: <BulbOutlined style={{ fontSize: '18px', color: '#13c2c2' }} />,
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
      icon: <FileMarkdownOutlined style={{ fontSize: '18px', color: '#faad14' }} />,
      color: '#faad14'
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

  // 旧文档列表与过滤逻辑已移除，仅保留资源集合与云盘相关功能

  const getTypeIcon = (type) => {
    switch (type) {
      case 'multitable':
        return <TableOutlined style={{ color: '#722ed1', fontSize: '18px' }} />
      case 'document':
        return <FileTextOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
      case 'table':
        return <TableOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
      case 'presentation':
        return <PieChartOutlined style={{ color: '#fa8c16', fontSize: '18px' }} />
      case 'survey':
        return <FormOutlined style={{ color: '#fadb14', fontSize: '18px' }} />
      case 'mindnote':
        return <BulbOutlined style={{ color: '#13c2c2', fontSize: '18px' }} />
      case 'markdown':
        return <FileMarkdownOutlined style={{ color: '#eb2f96', fontSize: '18px' }} />
      case 'ppt':
        return <FilePptOutlined style={{ color: '#fa8c16', fontSize: '18px' }} />
      case 'whiteboard':
        return <HighlightOutlined style={{ color: '#13c2c2', fontSize: '18px' }} />
      case 'video':
        return <VideoCameraOutlined style={{ color: '#f5222d', fontSize: '18px' }} />
      case 'audio':
        return <AudioOutlined style={{ color: '#faad14', fontSize: '18px' }} />
      case 'scenario':
        return <ExperimentOutlined style={{ color: '#3b82f6', fontSize: '18px' }} />
      default:
        return <FileTextOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
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


  // ===== 资料集合相关处理 =====
  const handleToggleCloudSelect = (id) => {
    setSelectedCloudIds(prev => (
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    ))
  }

  const handleCreateResource = () => {
    if (!resourceTitle.trim()) {
      message.warning('请输入资料标题')
      return
    }
    const items = cloudDriveItems.filter(item => selectedCloudIds.includes(item.id))
    if (items.length === 0) {
      message.warning('请至少选择一项云盘数据')
      return
    }
    const newResource = {
      id: `rc-${Date.now()}`,
      title: resourceTitle.trim(),
      items,
      createdAt: new Date().toLocaleDateString('zh-CN')
    }
    setResourceCollections(prev => [newResource, ...prev])
    setShowResourceModal(false)
    setResourceTitle('')
    setSelectedCloudIds([])
    setCloudFilters({ drive: 'all', type: 'all', q: '' })
    message.success('资料已创建')
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

  // 快速预览：集合项预览
  const [previewItem, setPreviewItem] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  // 新增：集合内联 PDF 预览状态（仅用于本区域预览）
  const [inlinePreviewPdfUrl, setInlinePreviewPdfUrl] = useState(null)
  const [inlinePreviewOriginalUrl, setInlinePreviewOriginalUrl] = useState(null)
  const handlePreviewItem = (item) => {
    setPreviewItem(item)
    setShowPreviewModal(true)
  }
  const getItemThumbnail = (item) => {
    if (!item) return '/微缩.png'
    if (item.type === 'video') return '/课堂讲解.png'
    return '/微缩.png'
  }
  const renderItemPreviewContent = (item) => {
    if (!item) return null
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {getTypeIcon(item.type)}
          <span style={{ fontSize: 16, fontWeight: 600 }}>{item.title}</span>
        </div>
        <div style={{ color: '#666', marginBottom: 8 }}>
          {(item.tags || []).join(' · ')}
        </div>
        <div style={{ fontSize: 12, color: '#999' }}>盘：{item.drive === 'org' ? '组织盘' : '个人盘'}；大小：{item.size}；更新：{item.lastModified}</div>
        {item.url && (
          <div style={{ marginTop: 6 }}>
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
              原链接：{item.url}
            </a>
          </div>
        )}
        {/* 播放器在下方渲染 */}
      </div>
    )
  }

  // 集合项内容播放器渲染（视频、文档、音频）
  const getVideoEmbedUrl = (url) => {
    if (!url) return null
    // Bilibili
    if (/bilibili\.com/.test(url)) {
      const match = url.match(/BV[\w]+/)
      const bv = match ? match[0] : null
      if (bv) return `https://player.bilibili.com/player.html?bvid=${bv}&high_quality=1&danmaku=0`
      return url
    }
    // YouTube
    if (/youtube\.com|youtu\.be/.test(url)) {
      const idMatch = url.match(/(?:v=|youtu\.be\/)([\w-]+)/)
      const id = idMatch ? idMatch[1] : null
      if (id) return `https://www.youtube.com/embed/${id}`
      return url
    }
    return url
  }

  const renderItemContentPlayer = (item) => {
    if (!item) return null

    const boxStyle = { width: '100%', height: 300, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0' }

    if (item.type === 'video') {
      const src = item.url || '/assets/demo1.mp4'
      const embed = getVideoEmbedUrl(src)
      return (
        <div>
          <div style={{ fontWeight: 600, margin: '4px 0 8px' }}>内容预览</div>
          <div style={boxStyle}>
            {/youtube|bilibili/.test((embed || '').toLowerCase()) ? (
              <iframe
                src={embed}
                title={item.title || '视频预览'}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                controls
                src={embed || src}
                poster={getItemThumbnail(item)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
      )
    }

    if (item.type === 'document' || item.type === 'pdf') {
      const fileUrl = item.url || 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
      const isAbsolute = /^https?:\/\//.test(fileUrl)
      const viewerSrc = isAbsolute 
        ? `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(fileUrl)}`
        : fileUrl
      return (
        <div>
          <div style={{ fontWeight: 600, margin: '4px 0 8px' }}>内容预览</div>
          <div style={boxStyle}>
            <iframe
              src={viewerSrc}
              title={item.title || '文档预览'}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
      )
    }

    if (item.type === 'audio') {
      const audioUrl = item.url || '/assets/sample.mp3'
      return (
        <div>
          <div style={{ fontWeight: 600, margin: '4px 0 8px' }}>内容预览</div>
          <div style={{ ...boxStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <audio controls src={audioUrl} style={{ width: '100%' }} />
          </div>
        </div>
      )
    }

    // 新增：PPT/演示文稿预览（使用 Google Docs Viewer）
    if (item.type === 'ppt' || item.type === 'presentation') {
      const fileUrl = item.url
      if (!fileUrl) {
        return (
          <div>
            <div style={{ fontWeight: 600, margin: '4px 0 8px' }}>内容预览</div>
            <div style={{ padding: 12, color: '#999' }}>当前数据无PPT链接，暂不支持在线预览</div>
          </div>
        )
      }
      const viewer = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(fileUrl)}`
      return (
        <div>
          <div style={{ fontWeight: 600, margin: '4px 0 8px' }}>内容预览</div>
          <div style={boxStyle}>
            <iframe
              src={viewer}
              title={item.title || 'PPT 预览'}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
      )
    }

    // 新增：图片预览
    if (item.type === 'image') {
      const imgUrl = item.url
      return (
        <div>
          <div style={{ fontWeight: 600, margin: '4px 0 8px' }}>内容预览</div>
          <div style={{ ...boxStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {imgUrl ? (
              <img src={imgUrl} alt={item.title || '图片预览'} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ color: '#999' }}>当前数据无图片链接，暂不支持在线预览</div>
            )}
          </div>
        </div>
      )
    }

    // 新增：白板预览（占位提示）
    if (item.type === 'whiteboard') {
      return (
        <div>
          <div style={{ fontWeight: 600, margin: '4px 0 8px' }}>内容预览</div>
          <div style={{ ...boxStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#666' }}>
              暂不支持白板在线预览，可在白板编辑器中打开。
            </div>
          </div>
        </div>
      )
    }

    // 新增：表格预览（优先使用 Google Docs Viewer）
    if (item.type === 'table' || item.type === 'multitable') {
      const fileUrl = item.url
      if (!fileUrl) {
        return (
          <div>
            <div style={{ fontWeight: 600, margin: '4px 0 8px' }}>内容预览</div>
            <div style={{ padding: 12, color: '#999' }}>当前数据无表格链接，暂不支持在线预览</div>
          </div>
        )
      }
      const viewer = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(fileUrl)}`
      return (
        <div>
          <div style={{ fontWeight: 600, margin: '4px 0 8px' }}>内容预览</div>
          <div style={boxStyle}>
            <iframe
              src={viewer}
              title={item.title || '表格预览'}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
      )
    }

    return null
  }

  // 集合预览：集合卡片预览
  const [previewCollection, setPreviewCollection] = useState(null)
  const [showCollectionPreview, setShowCollectionPreview] = useState(false)
  const getCollectionThumbnail = (rc) => {
    if (!rc || !rc.items || rc.items.length === 0) return '/微缩.png'
    const hasVideo = rc.items.some(i => i.type === 'video')
    return hasVideo ? '/课堂讲解.png' : '/微缩.png'
  }
  const handlePreviewCollection = (rc) => {
    setPreviewCollection(rc)
    setShowCollectionPreview(true)
  }
  const renderCollectionPreviewContent = (rc) => {
    if (!rc) return null
    const items = (rc.items || []).slice(0, 5)
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {getCategoryIcon(rc.category)}
          <span style={{ fontSize: 16, fontWeight: 600 }}>{rc.title}</span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary">共 {rc.items?.length || 0} 项 · 标签：</Text>
          {(rc.tags || []).slice(0, 10).map(tag => (
            <AntTag key={`preview-tag-${tag}`}>{tag}</AntTag>
          ))}
        </div>
        <Divider style={{ margin: '8px 0' }} />
        <div>
          {items.map(i => (
            <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
              {getTypeIcon(i.type)}
              <span style={{ flex: 1 }}>{i.title}</span>
              <Text type="secondary" style={{ fontSize: 12 }}>{i.drive === 'org' ? '组织盘' : '个人盘'} · {i.size}</Text>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="docs-center">
      <Layout>
        <Header className="docs-header">
          <div className="header-title">
            <Title level={2} style={{ color: '#262626', margin: 0 }}>资料库</Title>
          </div>
          <div className="header-actions">
            <Space size="large">
              <div className="search-box">
                <Input
                  placeholder="搜索云盘项..."
                  value={cloudFilters.q}
                  onChange={(e) => setCloudFilters(prev => ({ ...prev, q: e.target.value }))}
                  style={{ width: 300 }}
                  allowClear
                  prefix={<SearchOutlined />}
                />
              </div>
              {/* 已移除分类视图切换按钮，直接使用新分类侧栏 */}
              {/* 旧的"新建文档"功能移除 */}
              <Button 
                type="default" 
                icon={<LinkOutlined />} 
                onClick={() => setShowResourceModal(true)}
                size="large"
              >
                新建资料
              </Button>
            </Space>
          </div>
        </Header>

        <Layout>
          {showCollectionView ? (
            <ResourceSidebar
              selectedCategory={selectedCategoryKey}
              onCategoryChange={setSelectedCategoryKey}
              notes={notesForCounts}
              categories={sectionCategories}
              configVersion={configVersion}
            />
          ) : (
            <ResourceCategorySidebar
              selectedCategory={selectedResourceCategory}
              onCategoryChange={setSelectedResourceCategory}
              resources={mockResourcesForCategories}
              categories={resourceCategoryData}
              configVersion={configVersion}
            />
          )}

          <Content className="docs-main">
            {/* 资源集合视图 / 分类资源视图（左右布局） */}
            {showCollectionView ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Title level={4} style={{ margin: 0 }}>{activeCollection?.title || '分类资源'}</Title>
                  <Space>
                    <Button size="small" onClick={() => { setShowCollectionView(false); setActiveCollection(null); setSelectedCategoryKey(null); }}>返回集合列表</Button>
                    <Button size="small" icon={<PlusOutlined />} onClick={handleOpenAddItemsModal}>添加资源</Button>
                  </Space>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                {!selectedCategoryKey ? (
                  <Empty description={<div><Text>请选择左侧“我的分类”中的具体叶子分类</Text></div>} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
                    {inlinePreviewPdfUrl ? (
                      <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text type="secondary">PDF 预览</Text>
                          <Space>
                            {inlinePreviewOriginalUrl && (
                              <a href={inlinePreviewOriginalUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                                查看原文件
                              </a>
                            )}
                            <Button size="small" onClick={() => { setInlinePreviewPdfUrl(null); setInlinePreviewOriginalUrl(null); }}>关闭预览</Button>
                          </Space>
                        </div>
                        <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, overflow: 'hidden', marginTop: 8, flex: 1, minHeight: 0 }}>
                          <iframe src={inlinePreviewPdfUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF 预览" />
                        </div>
                      </div>
                    ) : (
                      <Row gutter={[12, 12]} className="notes-grid" style={{ flex: 1, overflow: 'auto' }}>
                        {(activeCollection?.items || [])
                          .filter(it => it.drive !== 'org' || ((it.space || DEFAULT_SPACE) === currentSpace))
                          .filter(it => {
                            if (selectedCategoryKey === 'related_materials') {
                              return ['document','pdf','ppt','table','whiteboard'].includes(it.type)
                            }
                            return getItemCategoryValue(it) === selectedCategoryKey
                          })
                          .map(item => (
                            <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                              <div className="note-card resource-card">
                                <Card
                                  hoverable
                                  onClick={() => {
                                    // 通用化：文档/PDF/PPT点击卡片进行内联预览，其它类型打开弹窗
                                    if (["pdf", "document", "ppt", "presentation"].includes(item.type) && item.url) {
                const isAbsolute = /^https?:\/\//.test(item.url)
                const viewer = isAbsolute 
                  ? `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(item.url)}`
                  : item.url
                setInlinePreviewPdfUrl(viewer)
                setInlinePreviewOriginalUrl(item.url)
              } else {
                handlePreviewItem(item)
              }
                                  }}
                                  actions={[
                                    <Tooltip key={`preview-${item.id}`} title="预览">
                                      <EyeOutlined onClick={(e) => { e.stopPropagation(); handlePreviewItem(item); }} />
                                    </Tooltip>,
                                    <Tooltip key={`tags-${item.id}`} title="编辑标签">
                                      <TagsOutlined onClick={(e) => { e.stopPropagation(); handleOpenEditItemTags(item, activeCollection); }} />
                                    </Tooltip>,
                                    <Popconfirm key={`del-${item.id}`} title="确认删除该资源？" okText="删除" cancelText="取消" onConfirm={() => handleDeleteItemFromCollection(activeCollection.id, item.id)}>
                                      <DeleteOutlined />
                                    </Popconfirm>
                                  ]}
                                >
                                  <div style={{ width: '100%', height: 150, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0', marginBottom: 8 }}>
                                    <img src={getItemThumbnail(item)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                  <div className="note-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      {getTypeIcon(item.type)}
                                      <span className="category-text">{item.drive === 'org' ? '组织盘' : '个人盘'}</span>
                                    </div>
                                    <Text type="secondary">{item.size}</Text>
                                  </div>
                                  <div className="note-title">{item.title}</div>
                                  <div className="note-tags">
                                    <AntTag size="small" color="#e6fffb">空间：{item.drive === 'org' ? (item.space || DEFAULT_SPACE) : '个人盘'}</AntTag>
                                    {(item.tags || []).slice(0, 10).map(tag => (
                                      <AntTag key={`item-${item.id}-tag-${tag}`}>{tag}</AntTag>
                                    ))}
                                  </div>
                                  <div className="note-meta">
                                    <div className="meta-item"><FileTextOutlined /> 更新于 {item.lastModified}</div>
                                  </div>
                                </Card>
                              </div>
                            </Col>
                          ))}
                      </Row>
                    )}
                  </div>
                )}
                </div>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Title level={4} style={{ margin: 0 }}>资源集合</Title>
                  <Space>
                    {displayCollections.length > 0 && (
                      <Text type="secondary">共 {displayCollections.length} 个集合</Text>
                    )}
                    <Tooltip title="重置示例数据">
                      <Button size="small" type="text" onClick={() => handleResetDemoData()}>重置</Button>
                    </Tooltip>
                    <Tooltip title="网格视图">
                      <Button size="small" type={collectionViewMode==='grid' ? 'primary' : 'text'} icon={<AppstoreOutlined />} onClick={() => setCollectionViewMode('grid')} />
                    </Tooltip>
                    <Tooltip title="列表视图">
                      <Button size="small" type={collectionViewMode==='list' ? 'primary' : 'text'} icon={<UnorderedListOutlined />} onClick={() => setCollectionViewMode('list')} />
                    </Tooltip>
                  </Space>
                </div>
                {displayCollections.length === 0 ? (
                  <Empty
                    description={<div><Text>该分类下暂无资料集合</Text><br /><Text type="secondary">点击上方“新建资料”开始组装</Text></div>}
                    style={{ marginTop: 8 }}
                  />
                ) : (
                  collectionViewMode === 'list' ? (
                    <div className="notes-content list-mode" style={{ marginTop: 12 }}>
                      <Table
                        dataSource={collectionListData}
                        columns={collectionColumns}
                        size="small"
                        pagination={false}
                        rowKey="id"
                        onRow={(record) => ({
                          onClick: () => { setActiveCollection(record.rc); setActiveResource(record.rc); setShowCollectionView(true); setSelectedCategoryKey(null); }
                        })}
                      />
                    </div>
                  ) : (
                    <Row gutter={[16, 16]} style={{ marginTop: 12 }} className="notes-grid">
                      {displayCollections.map(rc => (
                        <Col key={rc.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                          <div className="note-card resource-card" style={{ position: 'relative' }} onClick={() => { setActiveCollection(rc); setActiveResource(rc); setShowCollectionView(true); setSelectedCategoryKey(null); }}>
                            {rc.publish?.status && (
                              <div style={{ position: 'absolute', top: -6, left: -6, zIndex: 10 }}>
                                <AntTag color={rc.publish.status === 'published' ? 'green' : 'volcano'}>
                                  {rc.publish.status === 'published' ? '已发布' : '草稿'}
                                </AntTag>
                              </div>
                            )}
                            <Card
                              hoverable
                              actions={[
                                <EditOutlined key={`edit-${rc.id}`} onClick={(e) => { e.stopPropagation(); handleEditCollection(rc) }} />, 
                                <Tooltip key={`tags-${rc.id}`} title="编辑标签">
                                  <TagsOutlined onClick={(e) => { e.stopPropagation(); handleEditCollection(rc) }} />
                                </Tooltip>,
                                <EyeOutlined key={`preview-${rc.id}`} onClick={(e) => { e.stopPropagation(); handlePreviewCollection(rc) }} />, 
                                rc.publish?.status ? (
                                  <Tooltip key={`unpublish-${rc.id}`} title="取消发布">
                                    <StopOutlined onClick={(e) => { e.stopPropagation(); handleUnpublishCollection(rc) }} />
                                  </Tooltip>
                                ) : (
                                  <RocketOutlined key={`publish-${rc.id}`} onClick={(e) => { e.stopPropagation(); handleOpenPublishModal(rc) }} />
                                ), 
                                <ShareAltOutlined key={`share-${rc.id}`} onClick={(e) => { e.stopPropagation(); handleShareCollection(rc.id) }} />, 
                                <DeleteOutlined key={`del-${rc.id}`} onClick={(e) => { e.stopPropagation(); handleDeleteCollection(rc.id) }} />
                              ]}
                            >
                              <div style={{ width: '100%', height: 150, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0', marginBottom: 8 }}>
                                <img src={getCollectionThumbnail(rc)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div className="note-header">
                                <div className="note-category">
                                  {getCategoryIcon(rc.category)}
                                  <span className="category-text">
                                    {categories.find(c => c.id === rc.category)?.name || '资料集合'}
                                  </span>
                                </div>
                                <Text type="secondary">{(rc.filteredOrgItems || []).length} 项</Text>
                              </div>
                              <div className="note-title">
                                {rc.title}
                              </div>
                              <div className="note-content">
                                精选 {(rc.filteredOrgItems || []).length} 项组织盘资源（当前空间），快速查看与使用。
                              </div>
                              <div className="note-tags">
                                {(rc.tags || []).slice(0, 10).map(tag => (
                                  <AntTag key={`${rc.id}-tag-${tag}`}>{tag}</AntTag>
                                ))}
                              </div>
                              <div className="note-meta">
                                <div className="meta-item"><FileTextOutlined /> 创建于 {rc.createdAt}</div>
                              </div>
                            </Card>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )
                )}
              </div>
            )}

          </Content>
        </Layout>
      </Layout>
      
      





      {/* 新建资料弹窗：整合云盘多类型数据 */}
      <Modal
        title="新建资料"
        open={showResourceModal}
        onCancel={() => setShowResourceModal(false)}
        onOk={handleCreateResource}
        okText="创建资料"
        width={800}
        centered
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="请输入资料标题"
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
          />
        </div>
        {/* 云盘操作：目标盘选择 + 上传 + 新建 */}
        <Space style={{ marginBottom: 12, justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <Text>目标盘：</Text>
            <Radio.Group value={newCloudTarget} onChange={(e) => setNewCloudTarget(e.target.value)}>
              <Radio.Button value="org">组织盘</Radio.Button>
              <Radio.Button value="my">个人盘</Radio.Button>
            </Radio.Group>
          </Space>
          <Space>
            <Upload beforeUpload={handleBeforeUpload} showUploadList={false} multiple>
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
            <Button onClick={() => handleCreateCloudItem('document')}>新建文档</Button>
            <Button onClick={() => handleCreateCloudItem('table')}>新建表格</Button>
            <Button onClick={() => handleCreateCloudItem('ppt')}>新建PPT</Button>
            <Button onClick={() => handleCreateCloudItem('whiteboard')}>新建白板</Button>
          </Space>
        </Space>
        <Space wrap style={{ marginBottom: 12 }}>
          <Select
            value={cloudFilters.drive}
            onChange={(v) => setCloudFilters(prev => ({ ...prev, drive: v }))}
            style={{ width: 120 }}
          >
            <Option value="all">全部盘</Option>
            <Option value="org">组织盘</Option>
            <Option value="my">个人盘</Option>
          </Select>
          <Select
            value={cloudFilters.type}
            onChange={(v) => setCloudFilters(prev => ({ ...prev, type: v }))}
            style={{ width: 140 }}
          >
            <Option value="all">全部类型</Option>
            <Option value="document">文档</Option>
            <Option value="ppt">PPT</Option>
            <Option value="table">表格</Option>
            <Option value="whiteboard">白板</Option>
            <Option value="video">视频</Option>
            <Option value="audio">音频</Option>
            <Option value="scenario">场景</Option>
          </Select>
          <Input
            allowClear
            placeholder="搜索云盘项..."
            value={cloudFilters.q}
            onChange={(e) => setCloudFilters(prev => ({ ...prev, q: e.target.value }))}
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
          />
          <Text type="secondary">已选 {selectedCloudIds.length} 项</Text>
        </Space>
        <Divider style={{ margin: '8px 0' }} />
        <Row gutter={[12, 12]}>
          {cloudDriveItems
            .filter(item => (cloudFilters.drive === 'all' || item.drive === cloudFilters.drive))
            .filter(item => (cloudFilters.type === 'all' || item.type === cloudFilters.type))
            .filter(item => (item.drive !== 'org' || ((item.space || DEFAULT_SPACE) === currentSpace)))
            .filter(item => (!cloudFilters.q || item.title.toLowerCase().includes(cloudFilters.q.toLowerCase())))
            .map(item => (
              <Col key={item.id} xs={24} sm={12} md={8}>
                <Card
                  size="small"
                  hoverable
                  title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {getTypeIcon(item.type)}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                  </div>}
                  extra={<Checkbox checked={selectedCloudIds.includes(item.id)} onChange={() => handleToggleCloudSelect(item.id)} />}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span>{item.drive === 'org' ? '组织盘' : '个人盘'}</span>
                    <span>{item.size}</span>
                    <span>{item.lastModified}</span>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <AntTag size="small" color="#e6fffb">空间：{item.drive === 'org' ? (item.space || DEFAULT_SPACE) : '个人盘'}</AntTag>
                    {(item.tags || []).map(tag => (
                      <AntTag key={tag} size="small">{tag}</AntTag>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
      </Modal>

      {/* 发布集合弹窗 */}
      <Modal
        title="发布集合"
        open={showPublishModal}
        onCancel={() => { setShowPublishModal(false); setPublishingCollection(null) }}
        footer={null}
        width={640}
        centered
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>标题</div>
            <Input
              value={publishTitle}
              onChange={(e) => setPublishTitle(e.target.value)}
              placeholder="请输入集合标题"
            />
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>发布位置</div>
            <Select
              value={publishSpace}
              onChange={setPublishSpace}
              style={{ width: '100%' }}
              placeholder="选择发布的空间"
            >
              {availableSpaces.map(sp => (
                <Option key={sp} value={sp}>{sp}</Option>
              ))}
            </Select>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>轮播图（可多张）</div>
            <Upload
              listType="picture-card"
              accept="image/*"
              multiple
              fileList={publishImages}
              onChange={({ fileList }) => setPublishImages(fileList)}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            </Upload>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>内容简介</div>
            <Input.TextArea
              rows={3}
              value={publishSummary}
              onChange={(e) => setPublishSummary(e.target.value)}
              placeholder="内容简介"
            />
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>讲师介绍</div>
            <Input.TextArea
              rows={3}
              value={publishLecturer}
              onChange={(e) => setPublishLecturer(e.target.value)}
              placeholder="讲师介绍"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={handleSaveDraftPublish}>暂存</Button>
            <Button type="primary" onClick={handleConfirmPublish}>发布</Button>
            <Button onClick={() => { setShowPublishModal(false); setPublishingCollection(null) }}>取消</Button>
          </div>
        </Space>
      </Modal>

      {/* 集合项快速预览弹窗 */}
      <Modal
        open={showPreviewModal}
        title="资源预览"
        footer={null}
        onCancel={() => setShowPreviewModal(false)}
        width={560}
        centered
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: '100%', height: 160, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0' }}>
            <img src={getItemThumbnail(previewItem)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {renderItemPreviewContent(previewItem)}
          {renderItemContentPlayer(previewItem)}
        </div>
      </Modal>

      {/* 集合快速预览弹窗 */}
      <Modal
        open={showCollectionPreview}
        title="集合预览"
        footer={null}
        onCancel={() => setShowCollectionPreview(false)}
        width={640}
        centered
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: '100%', height: 180, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0' }}>
            <img src={getCollectionThumbnail(previewCollection)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {renderCollectionPreviewContent(previewCollection)}
        </div>
      </Modal>

      {/* 资料集合详情弹窗 */}
      <Modal
        title={activeResource ? activeResource.title : '资料详情'}
        open={showResourceDetail}
        onCancel={() => setShowResourceDetail(false)}
        footer={null}
        width={700}
        centered
      >
        {activeResource && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary">共 { (activeResource.items || []).filter(it => it.drive !== 'org' || ((it.space || DEFAULT_SPACE) === currentSpace)).length } 项</Text>
              <Button size="small" icon={<PlusOutlined />} onClick={handleOpenAddItemsModal}>添加资源</Button>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <Row gutter={[12, 12]}>
              {(activeResource.items || []).filter(it => it.drive !== 'org' || ((it.space || DEFAULT_SPACE) === currentSpace)).map(item => (
                <Col key={item.id} xs={24} sm={12}>
                  <Card size="small" hoverable bodyStyle={{ padding: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ width: '100%', height: 120, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0' }}>
                        <img src={getItemThumbnail(item)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {getTypeIcon(item.type)}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500 }}>{item.title}</div>
                          <div style={{ fontSize: 12, color: '#999' }}>
                            {(item.tags || []).join(' · ')}
                          </div>
                        </div>
                        <Space align="center" size={6}>
                          <Tooltip title="预览">
                            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handlePreviewItem(item)} />
                          </Tooltip>
                          <Text type="secondary" style={{ fontSize: 12 }}>{item.drive === 'org' ? '组织盘' : '个人盘'}</Text>
                          <Tooltip title="编辑标签">
                            <Button type="text" size="small" icon={<TagsOutlined />} onClick={() => handleOpenEditItemTags(item, activeResource)} />
                          </Tooltip>
                          <Popconfirm title="确认删除该资源？" okText="删除" cancelText="取消" onConfirm={() => handleDeleteItemFromCollection(activeResource.id, item.id)}>
                            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </Space>
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        <AntTag size="small" color="#e6fffb">空间：{item.drive === 'org' ? (item.space || DEFAULT_SPACE) : '个人盘'}</AntTag>
                        {(item.tags || []).map(tag => (
                          <AntTag key={tag} size="small">{tag}</AntTag>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Modal>

      {/* 添加资源到集合弹窗 */}
      <Modal
        title="添加资源到集合"
        open={showAddItemsModal}
        onCancel={() => setShowAddItemsModal(false)}
        onOk={handleAddItemsToCollection}
        okText="添加"
        width={800}
        centered
      >
        <Space wrap style={{ marginBottom: 12 }}>
          <Select
            value={addCloudFilters.drive}
            onChange={(v) => setAddCloudFilters(prev => ({ ...prev, drive: v }))}
            style={{ width: 120 }}
          >
            <Option value="all">全部盘</Option>
            <Option value="org">组织盘</Option>
            <Option value="my">个人盘</Option>
          </Select>
          <Select
            value={addCloudFilters.type}
            onChange={(v) => setAddCloudFilters(prev => ({ ...prev, type: v }))}
            style={{ width: 140 }}
          >
            <Option value="all">全部类型</Option>
            <Option value="document">文档</Option>
            <Option value="ppt">PPT</Option>
            <Option value="table">表格</Option>
            <Option value="whiteboard">白板</Option>
            <Option value="video">视频</Option>
            <Option value="audio">音频</Option>
            <Option value="scenario">场景</Option>
          </Select>
          <Input
            allowClear
            placeholder="搜索云盘项..."
            value={addCloudFilters.q}
            onChange={(e) => setAddCloudFilters(prev => ({ ...prev, q: e.target.value }))}
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
          />
          <Text type="secondary">已选 {selectedAddCloudIds.length} 项</Text>
        </Space>
        <Divider style={{ margin: '8px 0' }} />
        <Row gutter={[12, 12]}>
          {cloudDriveItems
            .filter(item => (addCloudFilters.drive === 'all' || item.drive === addCloudFilters.drive))
            .filter(item => (item.drive !== 'org' || ((item.space || DEFAULT_SPACE) === currentSpace)))
            .filter(item => (addCloudFilters.type === 'all' || item.type === addCloudFilters.type))
            .filter(item => (!addCloudFilters.q || item.title.toLowerCase().includes(addCloudFilters.q.toLowerCase())))
            .map(item => (
              <Col key={item.id} xs={24} sm={12} md={8}>
                <Card
                  size="small"
                  hoverable
                  title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {getTypeIcon(item.type)}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                  </div>}
                  extra={<Checkbox checked={selectedAddCloudIds.includes(item.id)} onChange={() => handleToggleAddCloudSelect(item.id)} />}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span>{item.drive === 'org' ? '组织盘' : '个人盘'}</span>
                    <span>{item.size}</span>
                    <span>{item.lastModified}</span>
                  </div>
                  {item.tags && (
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {item.tags.map(tag => (
                        <AntTag key={tag} size="small">{tag}</AntTag>
                      ))}
                    </div>
                  )}
                </Card>
              </Col>
            ))}
        </Row>
      </Modal>

      {/* 编辑集合弹窗 */}
      <Modal
        title="编辑集合"
        open={showEditCollectionModal}
        onCancel={() => setShowEditCollectionModal(false)}
        onOk={handleSaveCollectionEdit}
        okText="保存"
        width={520}
        centered
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input value={editCollectionTitle} onChange={(e) => setEditCollectionTitle(e.target.value)} placeholder="集合标题" />
          <Select
            mode="tags"
            value={editCollectionTags}
            onChange={(vals) => setEditCollectionTags(vals)}
            style={{ width: '100%' }}
            placeholder="集合标签（可输入新标签回车确认）"
          />
        </Space>
      </Modal>


      {/* 编辑资源标签弹窗 */}
      <Modal
        title="编辑资源标签"
        open={showEditItemTagsModal}
        onCancel={() => setShowEditItemTagsModal(false)}
        onOk={handleSaveItemTags}
        okText="保存"
        width={520}
        centered
      >
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary">常用标签</Text>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['试卷','视频课程','音频课程','练习题'].map(tag => (
              <AntTag
                key={`common-tag-${tag}`}
                style={{ cursor: 'pointer' }}
                color={(editingItemTags || []).includes(tag) ? 'processing' : undefined}
                onClick={() => {
                  const exists = (editingItemTags || []).includes(tag)
                  setEditingItemTags(exists ? (editingItemTags || []).filter(t => t !== tag) : [ ...(editingItemTags || []), tag ])
                }}
              >{tag}</AntTag>
            ))}
          </div>
        </div>
        <Select
          mode="tags"
          value={editingItemTags}
          onChange={(vals) => setEditingItemTags(vals)}
          style={{ width: '100%' }}
          placeholder="资源标签（可输入新标签回车确认）"
        />
      </Modal>
    </div>
  )
}

export default ResourceLibrary
