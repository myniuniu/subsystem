import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Typography, Button, Tag, Tooltip, Progress, Modal, Card, Form, Input, InputNumber, Switch, Select, Table, Avatar, Space, Divider, Tabs, Row, Col, Empty } from 'antd';
import { message } from 'antd';
import { DownOutlined, RightOutlined, UserAddOutlined, DeleteOutlined, TeamOutlined, EyeOutlined, CheckCircleTwoTone, AppstoreOutlined, ProfileOutlined, PlusOutlined, RobotOutlined, CloudSyncOutlined, SyncOutlined } from '@ant-design/icons';
import { createMockOrganizationPersonnelTree } from '../../data/organizationPersonnelMockData';
import { TreeNodeType } from '../../types/organizationPersonnelTree';
import OnDemandResourceLibrary from './OnDemandResourceLibrary'
import { initialResources } from '../../data/resourceLibraryData.js'
import BasicConfigTab from './tabs/BasicConfigTab'
import VideoContentTab from './tabs/VideoContentTab'
import ExamNotifyTab from './tabs/ExamNotifyTab'
import QuestionSelectionTab from './tabs/QuestionSelectionTab'
import ReviewSettingsTab from './tabs/ReviewSettingsTab'

const { Text } = Typography;
const { CheckableTag } = Tag;

// 右侧"实施方案"：包含参训人员管理和培训模块配置
const ImplementationPlan = ({ plan, externalTagSeeds = [], initialSelectedTags = [] }) => {
  const schedule = Array.isArray(plan?.schedule) ? plan.schedule : [];

  // 右侧筛选状态（分类/关键词）
  const [rightFilterQuery, setRightFilterQuery] = useState('')
  const [rightFilterCategory, setRightFilterCategory] = useState('all')

  // 顶部标题栏页签：基础配置 / 课程内容
  const [configTabKey, setConfigTabKey] = useState('content')

  // 左侧拖拽排序视觉提示状态
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [hoveredCardId, setHoveredCardId] = useState(null)

  // 参训人员状态管理
  const [participants, setParticipants] = useState([
    { id: 1, name: '张三', department: '技术部', position: '前端工程师', email: 'zhangsan@company.com', status: '已确认' },
    { id: 2, name: '李四', department: '产品部', position: '产品经理', email: 'lisi@company.com', status: '待确认' },
    { id: 3, name: '王五', department: '设计部', position: 'UI设计师', email: 'wangwu@company.com', status: '已确认' }
  ]);
  const [participantModalVisible, setParticipantModalVisible] = useState(false);

  // 训练阶段定义：优先使用左侧方案的模块(plan.phases)，回退到 schedule
  const trainingPhases = useMemo(() => {
    // 若 schedule 有值，直接使用
    if (Array.isArray(schedule) && schedule.length > 0) {
      return schedule.map((item, idx) => ({
        id: idx + 1,
        week: `第${idx + 1}阶段`,
        content: item.content,
        type: item.type,
        hours: item.hours
      }));
    }
    // 否则从 plan.phases 提取 modules 作为阶段来源
    const phases = Array.isArray(plan?.phases) ? plan.phases : [];
    const modules = phases.flatMap(ph => Array.isArray(ph.modules) ? ph.modules : []);
    return modules.map((m, idx) => {
      const title = m.title || m.module || `模块${idx + 1}`;
      const type = m.format || m.type || '';
      const hours = (() => {
        const d = String(m.duration || '').trim();
        if (/学时/.test(d)) {
          const match = d.match(/(\d+)/);
          return match ? Number(match[1]) : 0;
        }
        if (/周/.test(d)) {
          // 每周默认6学时作为显示用（可按需调整）
          return 6;
        }
        return Number(m.hours || 6);
      })();
      return { id: idx + 1, week: `第${idx + 1}阶段`, content: title, type, hours };
    });
  }, [schedule, plan]);

  // 日期格式化与阶段时间生成：每阶段默认1周，从今天开始
  const formatDateShort = (d) => {
    try {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch (e) {
      return '';
    }
  };

  const enrichedTrainingPhases = useMemo(() => {
    const base = new Date();
    return trainingPhases.map((p, idx) => {
      const start = new Date(base.getTime());
      start.setDate(start.getDate() + idx * 7);
      const end = new Date(start.getTime());
      end.setDate(end.getDate() + 6);
      return { ...p, startTime: formatDateShort(start), endTime: formatDateShort(end) };
    });
  }, [trainingPhases]);

  // 按模块标题在 plan.phases 中查找模块（用于判断含考试/作业）
  const findModuleByTitle = (title) => {
    try {
      const phases = Array.isArray(plan?.phases) ? plan.phases : [];
      for (const ph of phases) {
        const mods = Array.isArray(ph.modules) ? ph.modules : [];
        const match = mods.find(m => String(m.title || '') === String(title || ''));
        if (match) return match;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // 阶段素材分配（仅用于标签与简化统计展示）
  const phaseMaterials = useMemo(() => {
    // 辅助：解析培训形式字符串为数组（与编辑态保持一致）
    const parseFormats = (val) => Array.isArray(val)
      ? val
      : (typeof val === 'string'
        ? val.split(/[+、，,;；\/\s]+/).map(s => s.trim()).filter(Boolean)
        : []);
    // 辅助：类型推断（无法判断默认归为文档）
    const inferTypeKeyFromText = (text) => {
      const s = String(text || '').toLowerCase();
      if (/考试|测评|测试/.test(text || '')) return 'exam';
      if (/录播|视频/.test(text || '')) return 'videos';
      // 将“经验交流/经验分享/交流会”等默认绑定为线上交流研讨
      if (/(经验交流|经验分享|交流会)/.test(text || '')) return 'seminar';
      // 线上交流研讨：必须同时包含“线上/在线”与“交流/研讨/讨论”
      if (/线上|在线/.test(text || '') && /(交流|研讨|讨论)/.test(text || '')) return 'seminar';
      // 线下活动识别（线下/线下活动/实地/参观/走访/调研/观摩）
      if (/线下活动|线下|实地|参观|走访|调研|观摩/.test(text || '')) return 'offline';
      if (/直播|讲座|工作坊|案例/.test(text || '')) return 'live';
      if (/文档|资料|报告|方案|作业|反思/.test(text || '')) return 'document';
      return 'document';
    };

    return enrichedTrainingPhases.map(p => {
      const moduleInfo = findModuleByTitle(p.content);
      const boundFmtTypeMap = moduleInfo?.formatTypeMap || {};
      const normalizedBoundFmtTypeMap = { ...boundFmtTypeMap };
      ['经验交流', '经验分享', '交流会'].forEach(k => {
        if (normalizedBoundFmtTypeMap[k] === 'document') normalizedBoundFmtTypeMap[k] = 'seminar';
      });
      const boundAssessType = moduleInfo?.assessmentTypeKey;
      const fmtEntries = parseFormats(moduleInfo?.format || p.type || '');
      const asmtStr = String(moduleInfo?.assessment || '').trim();
      // 聚合：按类型键收集对应的显示名称（来自左侧形式项）
      const byType = { live: [], seminar: [], videos: [], offline: [], exam: [], document: [] };
      fmtEntries.forEach(f => {
        const typeKey = normalizedBoundFmtTypeMap[f] || inferTypeKeyFromText(f);
        if (typeKey === 'live') byType.live.push(f);
        else if (typeKey === 'seminar') byType.seminar.push(f);
        else if (typeKey === 'offline') byType.offline.push(f);
        else if (typeKey === 'videos') byType.videos.push(f);
        else if (typeKey === 'exam') byType.exam.push(f);
        else byType.document.push(f);
      });
      // 根据考核文本补齐 exam/document 类型（优先作为显示名称）
      if (asmtStr) {
        const aKey = boundAssessType || inferTypeKeyFromText(asmtStr);
        if (aKey === 'exam') {
          // 使用完整考核文案作为名称（如“在线测试/试卷”），放到前面以优先展示
          byType.exam.unshift(asmtStr);
        } else if (aKey === 'document') {
          // 使用完整文案（如“案例分析报告”），避免丢失关键信息，放到前面以优先展示
          byType.document.unshift(asmtStr);
        }
      }

      const startTime = p.startTime;
      const endTime = p.endTime;

      const baseMaterials = {
        live: byType.live.map(name => ({ id: p.id, title: name, startTime, endTime })),
        seminar: byType.seminar.map(name => ({ id: p.id, title: name, startTime, endTime })),
        offline: byType.offline.map(name => ({ id: p.id, title: name, startTime, endTime })),
        videos: byType.videos.map(name => ({ id: p.id, videoInfo: { duration: 0, progress: 0 }, name })),
        exam: byType.exam.map(name => ({ id: p.id, name, score: null })),
        document: byType.document.map(name => ({ id: p.id, name })),
        links: [],
        texts: [],
        trainingProjects: []
      };

      // 移除“教案设计作业”作为独立类型：保留为文档类中的文案即可

      // 各类型卡片的显示名称：取该类型的第一个形式项名称
      const displayNames = {
        ...(byType.videos.length > 0 ? { videos: byType.videos[0] } : {}),
        ...(byType.live.length > 0 ? { live: byType.live[0] } : {}),
        ...(byType.seminar.length > 0 ? { seminar: byType.seminar[0] } : {}),
        ...(byType.offline.length > 0 ? { offline: byType.offline[0] } : {}),
        ...(byType.exam.length > 0 ? { exam: byType.exam[0] } : {}),
        ...(byType.document.length > 0 ? { document: byType.document[0] } : {}),
      };
      // 模块2的作业显示名称
      // 不再设置 assignment 显示名称

      return { ...p, materials: baseMaterials, displayNames };
    });
  }, [enrichedTrainingPhases]);

  // 汇总：进度与分类学时（简化）
  const computePhaseCategorySummary = (phase) => {
    const m = phase?.materials || {};
    const lives = Array.isArray(m.live) ? m.live : [];
    const exams = Array.isArray(m.exam) ? m.exam : [];
    const videos = Array.isArray(m.videos) ? m.videos : [];

    const liveHours = (lives.length > 0) ? (Number(phase.hours || 0)) : 0;

    const categories = [];
    if (videos.length > 0) categories.push({ key: 'videos', label: '课程视频', hours: 0, score: null });
    if (lives.length > 0) categories.push({ key: 'live', label: '直播课程', hours: liveHours, score: null });
    if (exams.length > 0) categories.push({ key: 'exam', label: '考试/试卷', hours: 0, score: 0 });

    const totalHours = categories.reduce((sum, c) => sum + (Number(c.hours) || 0), 0);
    const totalScore = categories.reduce((sum, c) => {
      const s = (c.score == null ? 0 : Number(c.score));
      return isNaN(s) ? sum : sum + s;
    }, 0);

    return { categories, totalHours: Math.round(totalHours * 10) / 10, totalScore };
  };

  const assessPhasePass = (phase) => {
    const ps = computePhaseCategorySummary(phase);
    const examCat = ps?.categories?.find(c => c.key === 'exam');
    const examScore = examCat?.score;
    const totalHours = ps?.totalHours ?? (phase?.hours ?? 0);

    const progress = 0;
    const PASS_PROGRESS = 60;
    const PASS_SCORE = 60;
    const passProgress = progress >= PASS_PROGRESS;
    const passScore = (examScore == null) ? true : Number(examScore) >= PASS_SCORE;
    const pass = passProgress && passScore;

    const completedMinutes = 0;
    const tooltip = `考试：${totalHours * 60}分钟；已完成：${completedMinutes}分钟；进度：${progress}%；学时：${totalHours}；成绩：${examScore == null ? '未评分' : examScore + '分'}`;
    return { pass, tooltip, progress, examScore, totalHours, completedMinutes };
  };

  // 折叠控制
  const [collapsedPhases, setCollapsedPhases] = useState(new Set(enrichedTrainingPhases.map(p => p.id)));
  const [phaseViewCompactMode, setPhaseViewCompactMode] = useState(true);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [leftGridColumns, setLeftGridColumns] = useState(2); // 左侧展开态卡片每行列数，默认两列
  const [leftViewMode, setLeftViewMode] = useState('double'); // 视图模式：single | double
  useEffect(() => {
    const update = () => setIsSmallScreen(window.innerWidth < 768);
    if (typeof window !== 'undefined') {
      update();
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
  }, []);
  useEffect(() => {
    // 小屏自动单列，并自动收缩左栏；大屏默认两列
    setLeftGridColumns(isSmallScreen ? 1 : 2);
    if (isSmallScreen) setLeftCollapsed(true);
  }, [isSmallScreen]);
  useEffect(() => {
    // 收缩时单列，展开时双列（在非小屏下生效）
    if (!isSmallScreen) {
      setLeftGridColumns(leftCollapsed ? 1 : 2);
    }
  }, [leftCollapsed, isSmallScreen]);
  const expandAllPhases = () => setCollapsedPhases(new Set());
  const collapseAllPhases = () => setCollapsedPhases(new Set(enrichedTrainingPhases.map(p => p.id)));
  const togglePhase = (phaseId) => {
    const wasCompact = phaseViewCompactMode;
    setPhaseViewCompactMode(false);
    setCollapsedPhases(prev => {
      if (wasCompact) {
        const allIds = enrichedTrainingPhases.map(p => p.id);
        return new Set(allIds.filter(id => id !== phaseId));
      }
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId); else next.add(phaseId);
      return next;
    });
  };

  const overallProgress = (Array.isArray(phaseMaterials) && phaseMaterials.length > 0)
    ? Math.round(phaseMaterials.reduce((sum, p) => sum + (assessPhasePass(p)?.progress ?? 0), 0) / phaseMaterials.length)
    : 0;

  const formatLabelByKey = (k) => ({
    live: '直播课',
    seminar: '线上交流研讨',
    offline: '线下活动',
    videos: '点播课',
    exam: '考试',
    document: '文档'
  }[k] || '培训形式');

  // 格式类型映射：除点播课/直播课/考试外，默认归为“文档”
  const formatTypeByKey = (k) => ({
    videos: '点播课',
    live: '直播课',
    seminar: '线上交流研讨',
    offline: '线下活动',
    exam: '考试'
  }[k] || '文档');

  // 左侧“考核方式”明确标注映射：仅当左侧 assessment 文案明确指出该形式是考核时，右侧才加标注
  const ASSESS_EXAM_KEYWORDS = ['考试', '试卷', '测试'];
  const ASSESS_DOC_KEYWORDS = ['作业', '报告', '方案', '反思', '模拟授课', '教学设计', '教案设计'];

  const isExplicitAssessmentForFormat = (phase, fmtKey) => {
    try {
      const moduleInfo = findModuleByTitle(phase?.content);
      // 若左侧已绑定考核类型，优先依据绑定类型判断
      if (moduleInfo?.assessmentTypeKey) {
        if (fmtKey === 'exam') return moduleInfo.assessmentTypeKey === 'exam';
        if (fmtKey === 'document') return moduleInfo.assessmentTypeKey === 'document';
        return false;
      }
      const asmtStr = String(moduleInfo?.assessment || '').trim();
      if (!asmtStr) return false;
      if (fmtKey === 'exam') {
        return ASSESS_EXAM_KEYWORDS.some(k => asmtStr.includes(k));
      }
      if (fmtKey === 'document') {
        return ASSESS_DOC_KEYWORDS.some(k => asmtStr.includes(k));
      }
      // 直播/点播通常不是“考核方式”本身，默认不标注
      return false;
    } catch {
      return false;
    }
  };

  const numberToChinese = (n) => {
    const map = ['零','一','二','三','四','五','六','七','八','九','十'];
    if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return '';
    if (n <= 10) return map[n];
    if (n < 20) return '十' + map[n - 10];
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    if (ones === 0) return map[tens] + '十';
    return map[tens] + '十' + map[ones];
  };

  // 配置状态：按阶段 + 形式存储
  const [formatConfigs, setFormatConfigs] = useState({}); // { [phaseId]: { live: {...}, videos: {...}, exam: {...} } }
  const [configModal, setConfigModal] = useState({ visible: false, phaseId: null, formatKey: null, typeKey: null, draft: null });
  // 新增：AI试卷弹窗状态与确认处理
  const [aiPaperModalVisible, setAiPaperModalVisible] = useState(false);
  const [aiPaperForm] = Form.useForm();
  const openAiPaperModal = () => {
    const rules = configModal?.draft?.questions?.aiRules || {};
    const dist = rules.distribution || {};
    const difficulty = rules.difficulty || {};
    // 初始化表单值：试卷名称默认使用当前模块名称
    const phaseForPaper = configModal?.phaseId ? phaseMaterials.find(p => p.id === configModal.phaseId) : null;
    const defaultModuleName = phaseForPaper?.content || `模块${numberToChinese(configModal?.phaseId || 1)}`;
    aiPaperForm.setFieldsValue({
      paperName: defaultModuleName,
      setCount: 1,
      totalCount: rules.totalCount || 20,
      singleCount: dist.single?.count || 10,
      singleScore: dist.single?.score || 2,
      multipleCount: dist.multiple?.count || 5,
      multipleScore: dist.multiple?.score || 4,
      judgeCount: dist.judge?.count || 3,
      judgeScore: dist.judge?.score || 2,
      essayCount: dist.essay?.count || 2,
      essayScore: dist.essay?.score || 10,
      easyPercent: difficulty.easy || 30,
      mediumPercent: difficulty.medium || 50,
      hardPercent: difficulty.hard || 20,
      keywords: rules.keywords || '',
      contentSource: rules.contentSource || '默认题库'
    });
    setAiPaperModalVisible(true);
  };
  const handleAiPaperConfirm = async () => {
    try {
      const values = await aiPaperForm.validateFields();
      const selected = Array.isArray(configModal?.draft?.questions?.selected) ? configModal.draft.questions.selected : [];
      
      // 计算总分
      const totalScore = 
        (values.singleCount * values.singleScore) +
        (values.multipleCount * values.multipleScore) +
        (values.judgeCount * values.judgeScore) +
        (values.essayCount * values.essayScore);
      
      // 计算实际题数
      const actualQuestionCount = values.singleCount + values.multipleCount + values.judgeCount + values.essayCount;
      
      // 批量创建试卷
      const setCount = Math.max(1, Number(values.setCount || 1));
      const baseName = values.paperName?.trim() || `AI试卷 ${new Date().toLocaleString('zh-CN', { hour12: false })}`;
      const nowTs = Date.now();
      const newPapers = Array.from({ length: setCount }).map((_, idx) => {
        const index = idx + 1;
        const suffix = setCount > 1 ? ` - 第${numberToChinese(index)}套` : '';
        return {
          id: `paper-ai-${nowTs}-${index}`,
          name: `${baseName}${suffix}`,
          questionCount: actualQuestionCount,
          totalScore: totalScore,
          aiGenerated: true,
          config: {
            distribution: {
              single: { count: values.singleCount, score: values.singleScore },
              multiple: { count: values.multipleCount, score: values.multipleScore },
              judge: { count: values.judgeCount, score: values.judgeScore },
              essay: { count: values.essayCount, score: values.essayScore }
            },
            difficulty: {
              easy: values.easyPercent,
              medium: values.mediumPercent,
              hard: values.hardPercent
            },
            keywords: values.keywords,
            contentSource: (configModal?.draft?.questions?.aiRules?.contentSource || '默认题库')
          }
        };
      });
      
      // 更新AI规则到draft中（总题数以各题型数量累加）
      const updatedAiRules = {
        totalCount: actualQuestionCount,
        distribution: {
          single: { count: values.singleCount, score: values.singleScore },
          multiple: { count: values.multipleCount, score: values.multipleScore },
          judge: { count: values.judgeCount, score: values.judgeScore },
          essay: { count: values.essayCount, score: values.essayScore }
        },
        difficulty: {
          easy: values.easyPercent,
          medium: values.mediumPercent,
          hard: values.hardPercent
        },
        keywords: values.keywords,
        contentSource: (configModal?.draft?.questions?.aiRules?.contentSource || '默认题库')
      };
      
      // 更新questions的aiRules
      updateDraft('questions', {
        ...(configModal?.draft?.questions || {}),
        aiRules: updatedAiRules
      });
      
      // 添加新试卷到exam.papers
      const nextExam = {
        ...(configModal?.draft?.exam || {}),
        papers: [ ...(configModal?.draft?.exam?.papers || []), ...newPapers ]
      };
      updateDraft('exam', nextExam);
      
      setAiPaperModalVisible(false);
    } catch (e) {
      console.error('AI试卷生成失败:', e);
    }
  };

  const handleCreatePaper = () => {
    const nowTs = Date.now();
    const existing = Array.isArray(configModal?.draft?.exam?.papers) ? configModal.draft.exam.papers : [];
    const index = existing.length + 1;
    const aiRules = configModal?.draft?.questions?.aiRules || {};
    const dist = aiRules.distribution || {};
    const defaultQuestionCount = (
      (dist.single?.count || 0) + (dist.multiple?.count || 0) + (dist.judge?.count || 0) + (dist.essay?.count || 0)
    ) || (aiRules.totalCount || 20);
    const defaultTotalScore = (
      (dist.single?.count || 0) * (dist.single?.score || 0) +
      (dist.multiple?.count || 0) * (dist.multiple?.score || 0) +
      (dist.judge?.count || 0) * (dist.judge?.score || 0) +
      (dist.essay?.count || 0) * (dist.essay?.score || 0)
    ) || 100;
    const newPaper = {
      id: `paper-manual-${nowTs}-${index}`,
      name: `新试卷 ${index}`,
      questionCount: defaultQuestionCount,
      totalScore: defaultTotalScore
    };
    const nextExam = {
      ...(configModal?.draft?.exam || {}),
      papers: [...existing, newPaper]
    };
    updateDraft('exam', nextExam);
  };

  const handleDeletePaper = (paperId) => {
    const existing = Array.isArray(configModal?.draft?.exam?.papers) ? configModal.draft.exam.papers : [];
    const nextPapers = existing.filter(p => p.id !== paperId);
    const nextExam = {
      ...(configModal?.draft?.exam || {}),
      papers: nextPapers
    };
    updateDraft('exam', nextExam);
  };

  const configAreaRef = useRef(null);

  const getDefaultConfig = (phase, formatKey) => {
    const defaultEnabled = isExplicitAssessmentForFormat(phase, formatKey);
    if (formatKey === 'live') {
      return {
        name: formatLabelByKey(formatKey),
        details: '',
        enabled: defaultEnabled,
        assessment: { method: '固定成绩', weight: 30, fixedScore: 100 },
        watch: { requiredPercent: 80 }
      };
    }
    if (formatKey === 'seminar') {
      return {
        name: formatLabelByKey(formatKey),
        details: '',
        enabled: defaultEnabled,
        assessment: { method: '固定成绩', weight: 30, fixedScore: 100 },
        watch: { requiredPercent: 80 }
      };
    }
    if (formatKey === 'videos') {
      const aiDefaults = [
        'rc-teaching_resources-1',
        'rc-technology_training-2',
        'rc-family_education-3',
        'rc-school_management-4',
      ];
      return {
        name: formatLabelByKey(formatKey),
        details: '',
        enabled: defaultEnabled,
        assessment: { method: '固定成绩', weight: 30, fixedScore: 100 },
        watch: { requiredPercent: 80 },
        selectedCollections: aiDefaults,
        aiSelectedIds: aiDefaults,
      };
    }
    if (formatKey === 'document') {
      return {
        name: formatLabelByKey(formatKey),
        details: '',
        enabled: defaultEnabled,
        assessment: { method: '文档', weight: 30, passScore: 60, fullScore: 100 }
      };
    }
    if (formatKey === 'exam') {
      return {
        name: formatLabelByKey(formatKey),
        details: '',
        enabled: defaultEnabled,
        assessment: { method: '考试', weight: 30, passScore: 60, fullScore: 100 },
        questions: {
          selected: [], // 从资料库选择的试题
          aiRules: {   // AI出题规则
            subject: '',
            totalCount: 20,
            distribution: {
              single: { count: 10, score: 2 },
              multiple: { count: 5, score: 3 },
              judge: { count: 3, score: 2 },
              essay: { count: 2, score: 10 }
            },
            difficulty: {
              easy: 30,
              medium: 50,
              hard: 20
            },
            contentSource: 'module_videos',
            keywords: ''
          }
        },
        // 试卷配置：初始化3套模拟试卷
        exam: {
          durationMinutes: 90,
          retakeEnabled: false,
          retakeCount: 0,
          retakeScorePolicy: '最高分',
          papers: [
            { id: 'paper-1', name: '试卷 A', questionCount: 20, totalScore: 100 },
            { id: 'paper-2', name: '试卷 B', questionCount: 25, totalScore: 100 },
            { id: 'paper-3', name: '试卷 C', questionCount: 15, totalScore: 100 }
          ]
        },
        notify: {
          pre_day: { enabled: true, title: '准考提醒：{examName}', content: '您报名的考试将于{startTime}开始，请合理安排时间并按时参加。', channels: ['公众号','短信'], audience: '业务内全部学员', timing: '考试前1天 09:00' },
          start_30m: { enabled: false, title: '开考倒计时：30分钟', content: '考试即将开始，请提前检查设备与网络，进入考试入口做好准备。', channels: ['公众号','短信'], audience: '业务内全部学员', timing: '开考前30分钟' },
          start_10m: { enabled: true, title: '开考倒计时：10分钟', content: '考试即将开始，请尽快进入考试页面，避免迟到影响考试。', channels: ['公众号','短信'], audience: '业务内全部学员', timing: '开考前10分钟' },
          result_publish: { enabled: true, title: '成绩公布：{examName}', content: '您的考试成绩已发布，请前往成绩页面查看详情。', channels: ['公众号','短信'], audience: '业务内全部学员', timing: '评分完成后' },
          not_submitted: { enabled: false, title: '考试未提交提醒：{examName}', content: '系统检测到您未提交试卷，如有疑问请联系管理员。', channels: ['公众号','短信'], audience: '业务内全部学员', timing: '考试结束后未交卷' },
          retake_open: { enabled: false, title: '重考开启：{examName}', content: '本次考试已开启重考机会，请在规定时间内重新参加考试。', channels: ['公众号','短信'], audience: '业务内全部学员', timing: '允许重考开启时' },
          review_assign: { enabled: true, title: '评阅任务分派：{paperName}', content: '您被分派评阅任务：{paperName}，待评数量：{pendingCount}，请在{deadline}前完成。', channels: ['短信','公众号'], audience: '评阅老师/助教', timing: '即时发送' },
          review_reminder: { enabled: true, title: '评阅提醒：{paperName}', content: '评阅任务即将到期，请尽快在{deadline}前完成评阅。', channels: ['短信','公众号'], audience: '评阅老师/助教', timing: '距离截止前1天' },
          review_complete_student: { enabled: true, title: '评阅完成：{examName}', content: '您的试卷评阅已完成，成绩：{score}分，请前往成绩页面查看详情。', channels: ['短信','公众号'], audience: '业务内全部学员', timing: '评分完成后' },
          review_overdue: { enabled: false, title: '逾期未评：{paperName}', content: '您有评阅任务已超过截止时间仍未完成，请及时处理。', channels: ['短信','公众号'], audience: '评阅老师/助教', timing: '超过截止未完成' }
        }
      };
    }
    return { name: formatLabelByKey(formatKey), details: '', enabled: false, assessment: { method: '未设置', weight: 0 } };
  };

  // 形式 -> 类型 的键映射：配置UI按类型展示，但数据仍以原始形式键存储
  const mapFormatKeyToTypeKey = (k) => ({
    live: 'live',
    seminar: 'seminar',
    videos: 'videos',
    exam: 'exam',
    document: 'document'
  }[k] || 'document');

  const openConfigModal = (phaseId, formatKey) => {
    const phase = phaseMaterials.find(p => p.id === phaseId);
    const baseAll = formatConfigs[phaseId] || {};
    const base = baseAll[formatKey] || getDefaultConfig(phase, formatKey);
    const typeKey = mapFormatKeyToTypeKey(formatKey);
    setConfigModal({ visible: true, phaseId, formatKey, typeKey, draft: { ...base } });
    // 当打开考试类型配置时，默认切换到“试题”页签
    setConfigTabKey(typeKey === 'exam' ? 'exam-paper' : 'content');
  };



  useEffect(() => {
    if (configModal.visible && configAreaRef.current) {
      configAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [configModal.visible]);

  // 首次加载：按 localStorage 记忆的左右分割比例设置宽度
  useEffect(() => {
    try {
      const stored = localStorage.getItem('course_content_split_ratio')
      if (!stored) return
      const ratio = Number(stored)
      if (!Number.isFinite(ratio) || ratio <= 0) return
      const left = document.getElementById('course-content-left')
      const right = document.getElementById('course-content-right')
      const row = left?.parentElement?.parentElement
      const total = row?.clientWidth || ((left?.clientWidth || 0) + (right?.clientWidth || 0))
      if (!total || !left || !right) return
      const min = 240
      let newLeft = Math.max(min, Math.min(total - min, Math.round(total * ratio)))
      const newRight = total - newLeft
      left.style.flex = '0 0 auto'; left.style.width = newLeft + 'px'
      right.style.flex = '0 0 auto'; right.style.width = newRight + 'px'
    } catch {}
  }, [])

  const updateDraft = (path, value) => {
    setConfigModal(prev => {
      if (!prev.draft) return prev;
      const nextDraft = { ...prev.draft };
      if (path.includes('.')) {
        const [k1, k2] = path.split('.');
        nextDraft[k1] = { ...(nextDraft[k1] || {}), [k2]: value };
      } else {
        nextDraft[path] = value;
      }
      return { ...prev, draft: nextDraft };
    });
  };

  const saveConfig = () => {
    setFormatConfigs(prev => ({
      ...prev,
      [configModal.phaseId]: {
        ...(prev[configModal.phaseId] || {}),
        [configModal.formatKey]: configModal.draft
      }
    }));
    setConfigModal({ visible: false, phaseId: null, formatKey: null, draft: null });
  };

  // 右侧：与左侧同步（根据当前左侧的模块与考核类型，重建右侧配置初始值）
  const handleSyncWithLeft = () => {
    try {
      const nextConfigs = {};
      (Array.isArray(phaseMaterials) ? phaseMaterials : []).forEach((phase) => {
        const m = phase.materials || {};
        const fmtKeys = ['live','seminar','offline','videos','exam','document'];
        fmtKeys.forEach((k) => {
          if (Array.isArray(m[k]) && m[k].length > 0) {
            nextConfigs[phase.id] = nextConfigs[phase.id] || {};
            nextConfigs[phase.id][k] = getDefaultConfig(phase, k);
          }
        });
      });
      setFormatConfigs(nextConfigs);
      // 广播同步事件，便于其他视图（如左侧）侦听刷新
      window.dispatchEvent(new CustomEvent('trainingPlanSync', { detail: { timestamp: Date.now() } }));
      message.success('已与左侧同步');
    } catch (e) {
      console.error('同步失败：', e);
      message.error('同步失败，请稍后重试');
    }
  };

  // 人员标签与圈选：引入组织人员树并抽取所有人员与标签
  const personnelManager = useMemo(() => createMockOrganizationPersonnelTree(), []);
  const allPersonnelNodes = useMemo(() => personnelManager.getNodesByType(TreeNodeType.PERSONNEL), [personnelManager]);
  const allTags = useMemo(() => {
    const acc = [];
    allPersonnelNodes.forEach(n => {
      if (Array.isArray(n.tags)) {
        n.tags.forEach(t => acc.push(t));
      }
    });
    return Array.from(new Set(acc));
  }, [allPersonnelNodes]);
  // 默认标签种子：当数据源无标签时用于展示；同时与已有标签合并增强选择
  const defaultTagSeeds = useMemo(() => (
    [
      '技术部','产品部','设计部','教学部门',
      '数学','物理','化学','生物','英语','地理','历史',
      '高中','函数','导数','实验','电磁感应',
      '新入职','骨干','待确认','已确认'
    ]
  ), []);
  const displayTags = useMemo(() => {
    const set = new Set(allTags);
    // 合并默认种子，保证有一批可选标签
    defaultTagSeeds.forEach(t => set.add(t));
    // 合并外部标签（来自左侧参训人员的标签）
    if (Array.isArray(externalTagSeeds)) {
      externalTagSeeds.forEach(t => set.add(t));
    }
    return Array.from(set);
  }, [allTags, defaultTagSeeds, externalTagSeeds]);
  const [selectedTags, setSelectedTags] = useState([]);
  // 同步初始选中标签（来自左侧）
  React.useEffect(() => {
    if (Array.isArray(initialSelectedTags) && initialSelectedTags.length > 0) {
      setSelectedTags(initialSelectedTags);
    }
  }, [initialSelectedTags]);
  const toggleTag = (tag) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };
  // 标签筛选查询
  const [tagQuery, setTagQuery] = useState('');
  const filteredDisplayTags = useMemo(() => {
    if (!tagQuery) return displayTags;
    const q = tagQuery.trim().toLowerCase();
    return displayTags.filter(t => String(t).toLowerCase().includes(q));
  }, [displayTags, tagQuery]);
  const [excludedPersonnelIds, setExcludedPersonnelIds] = useState(new Set());
  const matchedPersonnel = useMemo(() => {
    if (!selectedTags.length) return [];
    return allPersonnelNodes
      .filter(n => Array.isArray(n.tags) && selectedTags.some(t => n.tags.includes(t)))
      .filter(n => !excludedPersonnelIds.has(n.personnelId));
  }, [allPersonnelNodes, selectedTags, excludedPersonnelIds]);

  const excludeNode = (node) => {
    setExcludedPersonnelIds(prev => {
      const next = new Set(prev);
      next.add(node.personnelId);
      return next;
    });
  };
  const clearExcluded = () => setExcludedPersonnelIds(new Set());

  // 通过匹配的人员节点加入参训列表（去重按 personnelId）
  const addParticipantFromNode = (node) => {
    setParticipants(prev => {
      if (prev.some(p => p.sourceId === node.personnelId)) return prev;
      const newItem = {
        id: Date.now(),
        sourceId: node.personnelId,
        name: node.name,
        department: node.department || '',
        position: node.position || '',
        email: node.email || '',
        status: '已确认'
      };
      return [...prev, newItem];
    });
  };

  // 匹配人员表格列
  const matchedColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#52c41a' }}>{text?.charAt(0)}</Avatar>
          {text}
        </Space>
      )
    },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '职位', dataIndex: 'position', key: 'position' },
    {
      title: '标签',
      key: 'tags',
      render: (_, record) => (
        <Space size={4} wrap>
          {(record.tags || []).map((t) => (
            <Tag key={`${record.id}-${t}`} color="blue">{t}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size={8}>
          <Button
            type="link"
            size="small"
            onClick={() => addParticipantFromNode(record)}
            disabled={participants.some(p => p.sourceId === record.personnelId)}
          >
            加入参训
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => excludeNode(record)}
          >
            剔除
          </Button>
        </Space>
      )
    }
  ];

  // 参训人员表格列定义
  const participantColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>{String(text || '').charAt(0)}</Avatar>
          {text}
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === '已确认' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => setParticipants(prev => prev.filter(p => p.id !== record.id))}
        >
          移除
        </Button>
      ),
    },
  ];

  // 合并“匹配人员”和“当前参训人员”到一个表
  const combinedData = useMemo(() => {
    const matched = (matchedPersonnel || []).map(n => ({
      __type: 'matched',
      key: `m-${n.personnelId}`,
      personnelId: n.personnelId,
      name: n.name,
      department: n.department || '',
      position: n.position || '',
      email: n.email || '',
      tags: Array.isArray(n.tags) ? n.tags : [],
      status: participants.some(p => p.sourceId === n.personnelId) ? '已加入' : '待加入'
    }));
    const joined = (participants || []).map(p => ({
      __type: 'participant',
      key: `p-${p.id}`,
      id: p.id,
      sourceId: p.sourceId,
      name: p.name,
      department: p.department || '',
      position: p.position || '',
      email: p.email || '',
      tags: [],
      status: p.status || '已确认'
    }));
    return [...matched, ...joined];
  }, [matchedPersonnel, participants]);

  const compact = isSmallScreen || leftCollapsed;

  const combinedColumns = [
    {
      title: '人员',
      key: 'person',
      onCell: () => ({ style: { padding: compact ? '4px 6px' : '6px 8px' } }),
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <Avatar size="small" style={{ backgroundColor: record.__type === 'participant' ? '#52c41a' : '#1890ff' }}>{String(record.name || '').charAt(0)}</Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            {!compact && (record.department || record.position) && (
              <div style={{ fontSize: 12, color: '#888' }}>
                {[record.department, record.position].filter(Boolean).join(' · ')}
              </div>
            )}
            {!compact && record.email && (
              <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
            )}
            {!compact && record.__type === 'matched' && (record.tags || []).length > 0 && (
              <div style={{ marginTop: 4 }}>
                <Space size={4} wrap>
                  {(record.tags || []).map((t) => (
                    <Tag key={`${record.key}-tag-${t}`} color="blue">{t}</Tag>
                  ))}
                </Space>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: '类型',
      key: '__type',
      width: 80,
      onCell: () => ({ style: { padding: '6px 8px' } }),
      render: (_, record) => (
        <Tag color={record.__type === 'participant' ? 'green' : 'blue'}>
          {record.__type === 'participant' ? '参训' : '匹配'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      onCell: () => ({ style: { padding: '6px 8px' } }),
      render: (status) => <Tag color={status === '已确认' || status === '已加入' ? 'green' : 'orange'}>{status}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      onCell: () => ({ style: { padding: '6px 8px' } }),
      render: (_, record) => (
        record.__type === 'matched' ? (
          <Space size={8}>
            <Button type="link" size="small" onClick={() => addParticipantFromNode(record)} disabled={participants.some(p => p.sourceId === record.personnelId)}>加入参训</Button>
            <Button type="link" size="small" danger onClick={() => excludeNode(record)}>剔除</Button>
          </Space>
        ) : (
          <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => setParticipants(prev => prev.filter(p => p.id !== record.id))}>移除</Button>
        )
      )
    }
  ];

  // 移除参训人员
  const removeParticipant = (id) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{ minHeight: '100%' }}>
      {configModal.visible ? (
        <div ref={configAreaRef}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', marginBottom: 8 }}>
             <div style={{ fontWeight: 600 }}>
               {(() => {
                 const phase = configModal.phaseId ? phaseMaterials.find(p => p.id === configModal.phaseId) : null;
                 const segs = [];
                 if (phase?.id) { const cn = numberToChinese(phase.id); if (cn) segs.push(`模块${cn}`); }
                 if (phase?.content) segs.push(phase.content);
                 const fmt = formatLabelByKey(configModal.formatKey);
                 if (fmt) segs.push(fmt);
                 return <span>{segs.join(' | ')}</span>;
               })()}
             </div>
             <Space>
               <Button onClick={() => setConfigModal({ visible: false, phaseId: null, formatKey: null, typeKey: null, draft: null })}>返回</Button>
             </Space>
           </div>
          <Card
            title={(
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Tabs
                  activeKey={configTabKey}
                  onChange={setConfigTabKey}
                    items={(
                    configModal.typeKey === 'exam'
                      ? [
                          { key: 'exam-paper', label: '试题' },
                          { key: 'exam-config', label: '试卷' },
                          { key: 'exam-notify', label: '考试' },
                          { key: 'exam-review', label: '评阅' },
                          { key: 'exam-notice', label: '通知' }
                        ]
                      : [
                          { key: 'basic', label: '考核设置' },
                          { key: 'content', label: '课程内容' }
                        ]
                  )}
                  size="small"
                  tabBarGutter={28}
                  tabBarStyle={{ margin: 0 }}
                />
              </div>
            )}
            size="small"
            headStyle={{ borderBottom: 'none', padding: '0 12px', minHeight: 30 }}
            style={{ marginTop: 4 }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            {configModal.draft && (
              // 考试形式：按页签分别渲染，考试配置不包含试卷选择
              (
                configModal.typeKey === 'exam' ? (
                  <>
                    {configTabKey === 'exam-config' && (
                      <Tabs
                        defaultActiveKey="paper"
                        size="small"
                        tabBarStyle={{ marginBottom: 8 }}
                        items={[
                          {
                            key: 'paper',
                            label: '试卷',
                            children: (
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                  <div style={{ fontWeight: 600 }}>试卷列表</div>
                                  <Space>
                                    <Button type="primary" icon={<RobotOutlined />} onClick={openAiPaperModal}>AI配卷</Button>
                                    <Button type="default" icon={<PlusOutlined />} onClick={handleCreatePaper}>新建试卷</Button>
                                  </Space>
                                </div>
                                {Array.isArray(configModal?.draft?.exam?.papers) && (configModal.draft.exam.papers.length > 0) ? (
                                  <Row gutter={12} wrap>
                                    {configModal.draft.exam.papers.map((paper, idx) => (
                                      <Col key={paper?.id || idx} span={8}>
                                        <Card size="small" title={paper?.name || `试卷 ${idx + 1}`} style={{ marginBottom: 8 }} extra={<Button size="small" danger type="text" icon={<DeleteOutlined />} onClick={() => handleDeletePaper(paper?.id || `paper-${idx}`)} />}>
                                          <Space size={8} wrap>
                                            <Tag color="processing">题数 {paper?.questionCount ?? '-'}</Tag>
                                            <Tag color="blue">总分 {paper?.totalScore ?? '-'}</Tag>
                                          </Space>
                                        </Card>
                                      </Col>
                                    ))}
                                  </Row>
                                ) : (
                                  <Empty description="暂未配置试卷" />
                                )}
                                {aiPaperModalVisible && (
                                  <Modal
                                    open={aiPaperModalVisible}
                                    title="AI试卷配置"
                                    onOk={handleAiPaperConfirm}
                                    onCancel={() => setAiPaperModalVisible(false)}
                                    okText="确认生成"
                                    cancelText="取消"
                                    width={800}
                                  >
                                    <Form
                                       form={aiPaperForm}
                                       layout="vertical"
                                       style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden', padding: '16px 12px' }}
                                     >
                                      <Row gutter={16}>
                                         <Col span={24}>
                                           <Form.Item
                                             label="试卷名称"
                                             name="paperName"
                                             rules={[{ required: true, message: '请输入试卷名称' }]}
                                           >
                                             <Input placeholder="请输入试卷名称" />
                                           </Form.Item>
                                         </Col>
                                       </Row>

                                       <Row gutter={16}>
                                         <Col span={8}>
                                           <Form.Item
                                             label="生成套数"
                                             name="setCount"
                                             rules={[{ required: true, message: '请输入生成套数' }]}
                                           >
                                             <InputNumber min={1} max={20} style={{ width: '100%' }} />
                                           </Form.Item>
                                         </Col>
                                       </Row>

                                      <Divider orientation="left">题型配置</Divider>
                                      <Row gutter={16}>
                                        <Col span={12}>
                                          <Form.Item
                                            label="单选题数量"
                                            name="singleCount"
                                            rules={[{ required: true, message: '请输入单选题数量' }]}
                                          >
                                            <InputNumber min={0} max={100} style={{ width: '100%' }} />
                                          </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                          <Form.Item
                                            label="单选题分值"
                                            name="singleScore"
                                            rules={[{ required: true, message: '请输入单选题分值' }]}
                                          >
                                            <InputNumber min={0} max={20} style={{ width: '100%' }} />
                                          </Form.Item>
                                        </Col>
                                      </Row>

                                      <Row gutter={16}>
                                        <Col span={12}>
                                          <Form.Item
                                            label="多选题数量"
                                            name="multipleCount"
                                            rules={[{ required: true, message: '请输入多选题数量' }]}
                                          >
                                            <InputNumber min={0} max={100} style={{ width: '100%' }} />
                                          </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                          <Form.Item
                                            label="多选题分值"
                                            name="multipleScore"
                                            rules={[{ required: true, message: '请输入多选题分值' }]}
                                          >
                                            <InputNumber min={0} max={20} style={{ width: '100%' }} />
                                          </Form.Item>
                                        </Col>
                                      </Row>

                                      <Row gutter={16}>
                                        <Col span={12}>
                                          <Form.Item
                                            label="判断题数量"
                                            name="judgeCount"
                                            rules={[{ required: true, message: '请输入判断题数量' }]}
                                          >
                                            <InputNumber min={0} max={100} style={{ width: '100%' }} />
                                          </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                          <Form.Item
                                            label="判断题分值"
                                            name="judgeScore"
                                            rules={[{ required: true, message: '请输入判断题分值' }]}
                                          >
                                            <InputNumber min={0} max={20} style={{ width: '100%' }} />
                                          </Form.Item>
                                        </Col>
                                      </Row>

                                      <Row gutter={16}>
                                        <Col span={12}>
                                          <Form.Item
                                            label="问答题数量"
                                            name="essayCount"
                                            rules={[{ required: true, message: '请输入问答题数量' }]}
                                          >
                                            <InputNumber min={0} max={50} style={{ width: '100%' }} />
                                          </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                          <Form.Item
                                            label="问答题分值"
                                            name="essayScore"
                                            rules={[{ required: true, message: '请输入问答题分值' }]}
                                          >
                                            <InputNumber min={0} max={50} style={{ width: '100%' }} />
                                          </Form.Item>
                                        </Col>
                                      </Row>

                                      <Divider orientation="left">难度配置</Divider>
                                      <Row gutter={16}>
                                        <Col span={8}>
                                          <Form.Item
                                            label="简单题比例(%)"
                                            name="easyPercent"
                                            rules={[{ required: true, message: '请输入简单题比例' }]}
                                          >
                                            <InputNumber min={0} max={100} style={{ width: '100%' }} />
                                          </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                          <Form.Item
                                            label="中等题比例(%)"
                                            name="mediumPercent"
                                            rules={[{ required: true, message: '请输入中等题比例' }]}
                                          >
                                            <InputNumber min={0} max={100} style={{ width: '100%' }} />
                                          </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                          <Form.Item
                                            label="困难题比例(%)"
                                            name="hardPercent"
                                            rules={[{ required: true, message: '请输入困难题比例' }]}
                                          >
                                            <InputNumber min={0} max={100} style={{ width: '100%' }} />
                                          </Form.Item>
                                        </Col>
                                      </Row>

                                      <Divider orientation="left">其他配置</Divider>
                                      <Row gutter={16}>
                                        <Col span={24}>
                                          <Form.Item
                                            label="生成需求补充"
                                            name="keywords"
                                          >
                                            <Input.TextArea
                                              placeholder="请补充生成需求，最多1000字"
                                              maxLength={1000}
                                              showCount
                                              autoSize={{ minRows: 3, maxRows: 8 }}
                                            />
                                          </Form.Item>
                                        </Col>
                                      </Row>

                                      <Form.Item dependencies={['singleCount', 'singleScore', 'multipleCount', 'multipleScore', 'judgeCount', 'judgeScore', 'essayCount', 'essayScore']}>
                                        {({ getFieldValue }) => {
                                          const singleCount = getFieldValue('singleCount') || 0;
                                          const singleScore = getFieldValue('singleScore') || 0;
                                          const multipleCount = getFieldValue('multipleCount') || 0;
                                          const multipleScore = getFieldValue('multipleScore') || 0;
                                          const judgeCount = getFieldValue('judgeCount') || 0;
                                          const judgeScore = getFieldValue('judgeScore') || 0;
                                          const essayCount = getFieldValue('essayCount') || 0;
                                          const essayScore = getFieldValue('essayScore') || 0;
                                          
                                          const totalQuestions = singleCount + multipleCount + judgeCount + essayCount;
                                          const totalScore = (singleCount * singleScore) + (multipleCount * multipleScore) + (judgeCount * judgeScore) + (essayCount * essayScore);
                                          
                                          return (
                                            <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '6px', marginTop: '16px' }}>
                                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span><strong>总题数：</strong>{totalQuestions} 题</span>
                                                <span><strong>总分：</strong><span style={{ color: '#1890ff', fontSize: '16px' }}>{totalScore}</span> 分</span>
                                              </div>
                                              <div style={{ fontSize: '12px', color: '#666' }}>
                                                题型分布：单选{singleCount}题({singleScore}分/题) | 多选{multipleCount}题({multipleScore}分/题) | 判断{judgeCount}题({judgeScore}分/题) | 问答{essayCount}题({essayScore}分/题)
                                              </div>
                                            </div>
                                          );
                                        }}
                                      </Form.Item>
                                    </Form>
                                  </Modal>
                                )}
                              </div>
                            )
                          }
                        ]}
                      />
                    )}
                    {configTabKey === 'exam-paper' && (
                      <QuestionSelectionTab 
                        draft={configModal.draft} 
                        updateDraft={updateDraft}
                        configModal={configModal}
                        formatConfigs={formatConfigs}
                        phaseMaterials={phaseMaterials}
                        getDefaultConfig={getDefaultConfig}
                      />
                    )}
                    {configTabKey === 'exam-review' && (
                       <ReviewSettingsTab draft={configModal.draft} updateDraft={updateDraft} />
                     )}
                     {configTabKey === 'exam-notify' && (
                       <Tabs
                         defaultActiveKey="config"
                         size="small"
                         tabBarStyle={{ marginBottom: 8 }}
                         items={[
                           {
                             key: 'config',
                             label: '考试配置',
                             children: (
                               <BasicConfigTab 
                                 draft={configModal.draft} 
                                 updateDraft={updateDraft} 
                                 formatKey={configModal.typeKey} 
                                 configModal={configModal}
                                 formatConfigs={formatConfigs}
                                 phaseMaterials={phaseMaterials}
                                 getDefaultConfig={getDefaultConfig}
                               />
                             )
                           }
                         ]}
                       />
                     )}
                     {configTabKey === 'exam-notice' && (
                       <ExamNotifyTab draft={configModal.draft} updateDraft={updateDraft} />
                     )}
                  </>
                ) : (
                  <Tabs
                    activeKey={configTabKey}
                    onChange={setConfigTabKey}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    tabBarStyle={{ display: 'none' }}
                    items={[
                      {
                        key: 'basic',
                        label: '考核设置',
                        children: (
                          <BasicConfigTab draft={configModal.draft} updateDraft={updateDraft} formatKey={configModal.typeKey} />
                        )
                      },
                      {
                        key: 'content',
                        label: (configModal.typeKey === 'exam' ? '试卷' : '课程内容'),
                        children: (
                          configModal.typeKey === 'videos' ? (
                            <VideoContentTab
                              configModal={configModal}
                              formatConfigs={formatConfigs}
                              setFormatConfigs={setFormatConfigs}
                              phaseMaterials={phaseMaterials}
                              leftViewMode={leftViewMode}
                              setLeftViewMode={setLeftViewMode}
                              isSmallScreen={isSmallScreen}
                              leftCollapsed={leftCollapsed}
                              rightFilterCategory={rightFilterCategory}
                              setRightFilterCategory={setRightFilterCategory}
                              rightFilterQuery={rightFilterQuery}
                              setRightFilterQuery={setRightFilterQuery}
                              getDefaultConfig={getDefaultConfig}
                            />
                          ) : (
                            <Empty description="当前形式不支持课程内容配置" />
                          )
                        )
                      }
                    ]}
                  />
                )
              )
            )}
          </Card>
        </div>
      ) : (
        <Tabs
          defaultActiveKey="modules"
          items={[
            {
                key: 'modules',
                label: '模块配置',
                children: (
                  <>
                    {/* 培训模块配置区域 */}
                    <Card 
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Space>
                            <span>📦</span>
                            <span>培训模块配置</span>
                          </Space>
                          <Space>
                            <Select
                              size="small"
                              value={rightFilterCategory}
                              style={{ width: 140 }}
                              onChange={setRightFilterCategory}
                              options={[
                                { value: 'all', label: '全部形式' },
                                { value: 'live', label: '直播课' },
                                { value: 'seminar', label: '线上交流研讨' },
                                { value: 'offline', label: '线下活动' },
                                { value: 'videos', label: '点播课' },
                                { value: 'exam', label: '考试' }
                              ]}
                            />
                            <Button 
                              size="small" 
                              type="default"
                              icon={<SyncOutlined style={{ color: '#096dd9' }} />}
                              onClick={handleSyncWithLeft}
                              style={{ background: '#e6f7ff', borderColor: '#91d5ff', color: '#096dd9' }}
                            >
                              同步
                            </Button>
                          </Space>
                        </div>
                      }
                      style={{ marginBottom: 16 }}
                      bodyStyle={{ padding: '12px' }}
                    >
                      {/* 顶部模块总览与控制 */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Text strong style={{ fontSize: '12px', color: '#666' }}>📦 模块</Text>
                          <div style={{ width: 160, height: 6, background: '#edf2f7', borderRadius: 999, overflow: 'hidden', marginLeft: 10 }}>
                            <div style={{ width: `${overallProgress}%`, height: '100%', background: 'var(--theme-primary, #1890ff)' }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {/* 右侧控制区域移除“全部展开/折叠”、筛选与同步，控件已移至标题右侧 */}
                        </div>
                      </div>

                      {/* 阶段列表（仅显示当前筛选命中的模块）*/}
                      {(() => {
                        const viewPhases = (Array.isArray(phaseMaterials) ? phaseMaterials : []).filter(phase => {
                          const m = phase.materials || {};
                          if (rightFilterCategory === 'all') return true;
                          return Array.isArray(m[rightFilterCategory]) && m[rightFilterCategory].length > 0;
                        });
                        return viewPhases.length > 0 ? (
                          viewPhases.map(phase => {
                            const m = phase.materials || {};
              const presentFormats = [];
              if (Array.isArray(m.live) && m.live.length > 0) presentFormats.push('live');
              if (Array.isArray(m.seminar) && m.seminar.length > 0) presentFormats.push('seminar');
              if (Array.isArray(m.offline) && m.offline.length > 0) presentFormats.push('offline');
              if (Array.isArray(m.videos) && m.videos.length > 0) presentFormats.push('videos');
              if (Array.isArray(m.exam) && m.exam.length > 0) presentFormats.push('exam');
              if (Array.isArray(m.document) && m.document.length > 0) presentFormats.push('document');
              // 移除 assignment 类型

                            return (
                            <div key={`phase-${phase.id}`} style={{ marginBottom: 14, border: '1px solid #e8e8e8', borderLeft: '2px solid #91d5ff', borderRadius: 8, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '8px 8px 6px 8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, width: '100%' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {(phaseViewCompactMode || collapsedPhases.has(phase.id)) ? (
                                      <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => togglePhase(phase.id)} />
                                    ) : (
                                      <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => togglePhase(phase.id)} />
                                    )}
                                    <Text strong style={{ fontSize: 13 }}>
                                      模块 {phase.id}｜{phase.content}
                                    </Text>
                                  </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                  {(() => {
                                    const tagSpecs = [
                                      { key: 'live', present: Array.isArray(m.live) && m.live.length > 0, label: '直播课', color: 'cyan' },
                                      { key: 'seminar', present: Array.isArray(m.seminar) && m.seminar.length > 0, label: '线上交流研讨', color: 'blue' },
                                      { key: 'offline', present: Array.isArray(m.offline) && m.offline.length > 0, label: '线下活动', color: 'orange' },
                                      { key: 'videos', present: Array.isArray(m.videos) && m.videos.length > 0, label: '点播课', color: 'geekblue' },
                                      { key: 'exam', present: Array.isArray(m.exam) && m.exam.length > 0, label: '考试', color: 'purple' },
                                      // 按要求：不显示“文档”标签
                                      // 按要求：移除“教案设计作业”标签
                                    ];
                                    return tagSpecs
                                      .filter(t => t.present)
                                      .map(t => (<Tag color={t.color} key={`phase-${phase.id}-tag-${t.key}`}>{t.label}</Tag>))
                                      .concat([<Tag color="geekblue" key={`phase-${phase.id}-hours`}>{phase.hours}学时</Tag>]);
                                  })()}
                                </div>

                                {/* 按形式渲染独立卡片 */}
                                <div style={{ width: '100%', marginTop: 6, display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                                  {presentFormats
                                    .filter(fmtKey => rightFilterCategory === 'all' || fmtKey === rightFilterCategory)
                                    .map((fmtKey) => {
                                      const cfg = (formatConfigs[phase.id] && formatConfigs[phase.id][fmtKey]) || getDefaultConfig(phase, fmtKey);
                                      return (
                                        <Card key={`phase-${phase.id}-fmt-${fmtKey}`} size="small" bodyStyle={{ padding: '6px 8px' }} style={{ border: '1px solid #e8e8e8', borderRadius: 6 }}>
                                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                                            <div style={{ flex: 1 }}>
                                            <div>
                                              {(() => {
                                                const typeLabel = formatTypeByKey(fmtKey);
                                                const displayName = (phase.displayNames && phase.displayNames[fmtKey]) || cfg.name;
                                                return (
                                                  <Text strong style={{ marginRight: 8 }}>{`${displayName} | ${typeLabel}`}</Text>
                                                );
                                              })()}
                                              {cfg.details ? (
                                                <Text type="secondary">{cfg.details}</Text>
                                              ) : null}
                                            </div>
                                            <div style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                              {fmtKey === 'videos' && (
                                                <>
                                                  {/* 成绩设置值：固定成绩显示分值，否则显示不计成绩 */}
                                                  <Tag color={cfg.assessment?.method === '固定成绩' ? 'green' : 'default'}>
                                                    {`成绩：${cfg.assessment?.method === '固定成绩' ? ((cfg.assessment?.fixedScore ?? 0) + '分') : '不计成绩'}`}
                                                  </Tag>
                                                  {/* 学时设置值：显示阶段学时 */}
                                                  <Tag color="gold">学时：{phase.hours}学时</Tag>
                                                  <Tag color="gold">达标观看：{cfg.watch?.requiredPercent ?? 0}%</Tag>
                                                  <Tag color="geekblue">已选集合：{Array.isArray(cfg.selectedCollections) ? cfg.selectedCollections.length : 0} 个</Tag>
                                                </>
                                              )}
                                              {fmtKey === 'exam' && (
                                                <>
                                                  <Tag color="green">及格：{cfg.assessment?.passScore ?? 60}分</Tag>
                                                  <Tag color="geekblue">满分：{cfg.assessment?.fullScore ?? 100}分</Tag>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            {isExplicitAssessmentForFormat(phase, fmtKey) && (
                                              <Tag color="volcano">考核</Tag>
                                            )}
                                            <Button size="small" type="primary" onClick={() => openConfigModal(phase.id, fmtKey)}>配置</Button>
                                          </div>
                                        </div>
                                      </Card>
                                    );
                                  })}
                                </div>
                              </div>

                            </div>

                            {!(phaseViewCompactMode || collapsedPhases.has(phase.id)) && (() => {
                              const ps = computePhaseCategorySummary(phase);
                              if (!ps || !Array.isArray(ps.categories) || ps.categories.length === 0) return null;
                              const categories = ps.categories;
                              return (
                                <div style={{ padding: '8px 10px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6, margin: '6px 0' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                                    {categories.map((c) => (
                                      <div key={`phase-${phase.id}-cat-${c.key}`} style={{ background: '#ffffff', border: '1px solid #f0e1a0', borderRadius: 6, padding: '6px 8px' }}>
                                        <Text style={{ fontSize: 12, color: '#614700', fontWeight: 600 }}>{c.label}</Text>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                          <Text style={{ fontSize: 12, color: '#333' }}>学时：{(c.hours || 0)}</Text>
                                          <Text style={{ fontSize: 12, color: '#333' }}>成绩：{(c.score == null ? '未评分' : `${c.score}分`)}</Text>
                                        </div>
                                      </div>
                                    ))}
                                    <div style={{ background: '#ffffff', border: '1px dashed #ffe58f', borderRadius: 6, padding: '6px 8px' }}>
                                      <Text style={{ fontSize: 12, color: '#614700', fontWeight: 600 }}>总计</Text>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                        <Text style={{ fontSize: 12, color: '#333' }}>总学时：{ps.totalHours}</Text>
                                        <Text style={{ fontSize: 12, color: '#333' }}>总成绩：{ps.totalScore}分</Text>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })
                        ) : (
                          <Empty description="暂无模块配置数据（请先在计划中添加日程）" />
                        );
                      })()}
                    </Card>
                  </>
                )
              },
              {
              key: 'participants',
              label: '参训人员',
              children: (
                <>
                  <Row gutter={12} wrap={true} style={{ alignItems: 'stretch' }}>
                    <Col span={7} style={{ display: 'flex' }}>
                      <Card
                        title={(
                          <Space>
                            <span>🔖</span>
                            <span>标签筛选</span>
                          </Space>
                        )}
                        style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', minWidth: 280 }}
                        bodyStyle={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <Input
                            size="small"
                            allowClear
                            placeholder="筛选标签（可输入关键字）"
                            value={tagQuery}
                            onChange={(e) => setTagQuery(e.target.value)}
                            style={{ width: 220 }}
                          />
                          <Space>
                            <Button size="small" onClick={() => setSelectedTags([])}>清空选择</Button>
                            <Button size="small" danger onClick={clearExcluded}>清空剔除</Button>
                          </Space>
                        </div>
                        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: 8, padding: '8px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8 }}>
                          <Space size={6} wrap>
                            {filteredDisplayTags.length ? (
                              CheckableTag ? (
                                filteredDisplayTags.map((tag) => (
                                  <CheckableTag
                                    key={`tag-${tag}`}
                                    checked={selectedTags.includes(tag)}
                                    onChange={(checked) => {
                                      setSelectedTags((prev) => {
                                        if (checked) return [...prev, tag];
                                        return prev.filter((t) => t !== tag);
                                      });
                                    }}
                                  >
                                    {tag}
                                  </CheckableTag>
                                ))
                              ) : (
                                filteredDisplayTags.map((tag) => (
                                  <Tag
                                    key={`tag-${tag}`}
                                    color={selectedTags.includes(tag) ? 'processing' : 'default'}
                                    onClick={() => toggleTag(tag)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {tag}
                                  </Tag>
                                ))
                              )
                            ) : (
                              <Text type="secondary" style={{ fontSize: 12 }}>未找到匹配标签</Text>
                            )}
                          </Space>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 10px', background: '#f8f9fa', borderRadius: 8, border: '1px solid #eef2f7', marginTop: 10 }}>
                          <Tag color="geekblue">已选 {selectedTags.length} 个标签</Tag>
                          <Tag color="blue">命中 {matchedPersonnel.length} 人</Tag>
                          <Tag color="red">已剔除 {excludedPersonnelIds.size} 人</Tag>
                        </div>
                      </Card>
                    </Col>
                    <Col span={17} style={{ display: 'flex' }}>
                      <Card
                        title={(
                          <Space>
                            <span>📋</span>
                            <span>{(isSmallScreen || leftCollapsed) ? '人员列表' : '人员列表（匹配 + 参训）'}</span>
                            <Tag color="blue">匹配 {matchedPersonnel.length} 人</Tag>
                            <Tag color="green">参训 {participants.length} 人</Tag>
                          </Space>
                        )}
                        style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', marginLeft: 6 }}
                        bodyStyle={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}
                      >
                        <div style={{ flex: 1, minHeight: 0 }}>
                          <Table
                            size="small"
                            bordered={false}
                            tableLayout="fixed"
                            style={{ margin: 0 }}
                            dataSource={combinedData}
                            columns={combinedColumns}
                            rowKey="key"
                            pagination={false}
                          />
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </>
              )
            },
            ]}
          />
      )}

      {/* 添加参训人员的Modal */}
      <Modal
        title="添加参训人员"
        open={participantModalVisible}
        onCancel={() => setParticipantModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setParticipantModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => setParticipantModalVisible(false)}>
            确定
          </Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="姓名" required>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="部门" required>
            <Input placeholder="请输入部门" />
          </Form.Item>
          <Form.Item label="职位" required>
            <Input placeholder="请输入职位" />
          </Form.Item>
          <Form.Item label="邮箱" required>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 课程内容预览模态框 */}
      {false && (<Modal
        title="课程内容预览"
        open={previewModal.visible}
        onCancel={() => setPreviewModal({ visible: false, phaseId: null, formatKey: null })}
        width={800}
        footer={[
          <Button key="close" onClick={() => setPreviewModal({ visible: false, phaseId: null, formatKey: null })}>
            关闭
          </Button>
        ]}
      >
        {previewModal.visible && (() => {
          const phase = phaseMaterials.find(p => p.id === previewModal.phaseId);
          const phaseCfg = formatConfigs[previewModal.phaseId] || {};
          const videoCfg = phaseCfg.videos || getDefaultConfig(phase, 'videos');
          const selectedIds = videoCfg.selectedCollections || [];
          
          // 创建默认集合数据
          const collections = (function createDefaultCollections() {
            const today = new Date().toLocaleDateString('zh-CN');
            const cats = [
              { id: 'teaching_resources', title: '教学资源精选' },
              { id: 'technology_training', title: '技术培训精选' },
              { id: 'family_education', title: '家庭教育精选' },
              { id: 'school_management', title: '学校管理精选' },
              { id: 'mental_health', title: '心理健康研修' }
            ];
            const pickByCategory = (cat, limit = 8) => initialResources.filter(r => r.category === cat).slice(0, limit);
            const uniqueTags = (items, limit = 12) => {
              const set = new Set();
              items.forEach(i => (i.tags || []).forEach(t => set.add(t)));
              return Array.from(set).slice(0, limit);
            };
            return cats.map((c, idx) => {
              const items = pickByCategory(c.id, 8);
              return {
                id: `rc-${c.id}-${idx+1}`,
                title: c.title,
                category: c.id,
                createdAt: today,
                items,
                tags: uniqueTags(items)
              };
            });
          })();
          
          const byId = new Map(collections.map(c => [c.id, c]));
          const selected = selectedIds.map(id => byId.get(id)).filter(Boolean);
          
          const typeToThumb = {
            documents: '/thumbnails/documents.png',
            videos: '/thumbnails/videos.png',
            images: '/thumbnails/images.png',
            audio: '/thumbnails/audio.png',
            presentations: '/thumbnails/presentations.png',
            default: '/thumbnails/default.png'
          };
          
          const getCollectionThumbnail = (rc) => {
            try {
              const items = (rc && rc.items) || [];
              const firstType = (items.find(it => typeof it?.type === 'string')?.type) || '';
              const t = String(firstType).toLowerCase();
              if (t.includes('ppt') || t.includes('presentation')) return typeToThumb.presentations;
              if (t.includes('doc') || t.includes('pdf') || t.includes('guide')) return typeToThumb.documents;
              if (t.includes('video') || t.includes('mp4')) return typeToThumb.videos;
              if (t.includes('image') || t.includes('png') || t.includes('jpg')) return typeToThumb.images;
              if (t.includes('audio') || t.includes('mp3')) return typeToThumb.audio;
              switch (rc?.category) {
                case 'technology_training': return typeToThumb.videos;
                case 'teaching_resources': return typeToThumb.documents;
                case 'family_education': return typeToThumb.presentations;
                case 'school_management': return typeToThumb.images;
                case 'mental_health': return typeToThumb.images;
                case 'new_teacher_resources': return typeToThumb.presentations;
                default: return typeToThumb.default;
              }
            } catch {
              return '/images/agents/agent-docs.svg';
            }
          };
          
          const categories = [
            { id: 'teaching_resources', name: '教学资源库' },
            { id: 'technology_training', name: '技术培训资源库' },
            { id: 'family_education', name: '家庭教育资源库' },
            { id: 'school_management', name: '学校管理资源库' },
            { id: 'mental_health', name: '心理健康资源库' },
            { id: 'new_teacher_resources', name: '新教师资源库' }
          ];
          
          return (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Text strong>阶段：</Text>
                <Text>{phase?.title || '未知阶段'}</Text>
                <Divider type="vertical" />
                <Text strong>配置信息：</Text>
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Tag color={videoCfg.enabled ? 'blue' : 'default'}>{videoCfg.enabled ? '考核项' : '不考核'}</Tag>
                  <Tag color="purple">方式：{videoCfg.assessment?.method || '未设置'}</Tag>
                  <Tag color="gold">权重：{videoCfg.assessment?.weight ?? 0}%</Tag>
                  <Tag color="gold">达标观看：{videoCfg.watch?.requiredPercent ?? 0}%</Tag>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <Text strong style={{ fontSize: 16 }}>已配置的课程内容</Text>
                <div style={{ marginTop: 12 }}>
                  {selected.length === 0 ? (
                    <Empty description="暂未配置课程内容" />
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
                      {selected.map(rc => {
                        const categoryLabel = categories.find(c => c.id === rc.category)?.name || '资料集合';
                        return (
                          <Card key={rc.id} size="small" hoverable>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                              <div style={{ width: 80, height: 60, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0', flexShrink: 0 }}>
                                <img src={getCollectionThumbnail(rc)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rc.title}</div>
                                <div style={{ color: '#666', fontSize: 12, marginBottom: 6 }}>{categoryLabel}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                  {(rc.tags || []).slice(0, 3).map(tag => (
                                    <Tag key={tag} size="small">{tag}</Tag>
                                  ))}
                                </div>
                                <div style={{ marginTop: 6, color: '#888', fontSize: 12 }}>
                                  创建时间：{rc.createdAt} · 项目数：{rc.items?.length || 0}
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>)}
    </div>
  );
};

export default ImplementationPlan;