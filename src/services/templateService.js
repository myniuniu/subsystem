// 主题模版服务
import { message } from 'antd';

// 默认模版数据
const DEFAULT_TEMPLATES = [
  {
    id: 'teaching-research',
    name: '教研智能体',
    description: '面向教学与教研场景的通用智能体',
    category: 'teaching_research',
    sourceTypes: ['文档', '视频', '链接'],
    smartTools: ['教学方案', '知识图谱', '智能写作'],
    usageCount: 156,
    createdAt: '2024-01-15',
    icon: 'BookOutlined',
    color: '#1890ff'
  },
  {
    id: 'class-teacher',
    name: '班主任智能体',
    description: '面向班级管理与家校沟通的班主任辅助智能体',
    category: 'class_management',
    sourceTypes: ['文档', '表格', '链接'],
    smartTools: ['班级管理', '阅卷工具', '教学助手'],
    usageCount: 120,
    createdAt: '2024-01-20',
    icon: 'TeamOutlined',
    color: '#52c41a'
  },
  {
    id: 'counselor',
    name: '辅导员智能体',
    description: '面向学生思想政治与事务管理的辅导员智能体',
    category: 'student_affairs',
    sourceTypes: ['文档', '链接', '音频'],
    smartTools: ['学生关怀', '智能写作', '效率提升'],
    usageCount: 234,
    createdAt: '2024-01-10',
    icon: 'UserOutlined',
    color: '#722ed1'
  },
  {
    id: 'supervisor',
    name: '督学智能体',
    description: '面向督导评估与质量监测的督学智能体',
    category: 'supervision',
    sourceTypes: ['文档', '链接', '表格'],
    smartTools: ['督导评估', '数据分析', '效率提升'],
    usageCount: 178,
    createdAt: '2024-01-25',
    icon: 'SettingOutlined',
    color: '#fa8c16'
  },
  {
    id: 'principal',
    name: '校长智能体',
    description: '面向学校治理与决策支持的校长智能体',
    category: 'governance',
    sourceTypes: ['文档', '视频', '链接'],
    smartTools: ['决策支持', '数据分析', '智能写作'],
    usageCount: 145,
    createdAt: '2024-01-30',
    icon: 'BulbOutlined',
    color: '#eb2f96'
  },
  {
    id: 'scientific-research',
    name: '科研智能体',
    description: '面向课题研究与成果管理的科研智能体',
    category: 'scientific_research',
    sourceTypes: ['文档', '链接', '图片'],
    smartTools: ['科研助手', '数据分析', '知识图谱'],
    usageCount: 198,
    createdAt: '2024-02-05',
    icon: 'BookOutlined',
    color: '#eb2f96'
  }
];

// 从localStorage获取模版数据
export const getTemplatesFromStorage = () => {
  try {
    const savedTemplates = localStorage.getItem('theme-templates');
    if (savedTemplates) {
      return JSON.parse(savedTemplates);
    }
    return [];
  } catch (error) {
    console.error('获取模版数据失败:', error);
    return [];
  }
};

// 保存模版数据到localStorage
export const saveTemplatesToStorage = (templates) => {
  try {
    localStorage.setItem('theme-templates', JSON.stringify(templates));
    return true;
  } catch (error) {
    console.error('保存模版数据失败:', error);
    return false;
  }
};

// 获取所有可用模版
export const getAvailableTemplates = async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 首先尝试从localStorage获取
    let templates = getTemplatesFromStorage();
    
    // 如果没有数据，使用默认
    if (templates.length === 0) {
      templates = DEFAULT_TEMPLATES;
      saveTemplatesToStorage(templates);
    }
    
    return {
      success: true,
      data: templates,
      message: '获取智能体列表成功'
    };
  } catch (error) {
    console.error('获取智能体列表失败:', error);
    return {
      success: false,
      data: [],
      message: '获取智能体列表失败'
    };
  }
};

// 根据ID获取特定模版
export const getTemplateById = async (templateId) => {
  try {
    const templates = getTemplatesFromStorage();
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
      return {
        success: true,
        data: template,
        message: '获取智能体详情成功'
      };
    } else {
      return {
        success: false,
        data: null,
        message: '智能体不存在'
      };
    }
  } catch (error) {
    console.error('获取智能体详情失败:', error);
    return {
      success: false,
      data: null,
      message: '获取智能体详情失败'
    };
  }
};

// 文档/画板创建使用的模版数据（基于图示模拟）
export const getAvailableNoteTemplates = async () => {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  const templates = [
    // 推荐（面向教师工作与教师培训）
    { id: 'meeting-notes-teaching-simple', name: '会议纪要（教研/教务·简洁版）', description: '议题、要点、行动项与责任人', category: 'meeting_teaching', useCount: 915000, recommended: true },
    { id: 'teacher-weekly', name: '教师工作周报', description: '本周进展、下周计划、问题与建议', category: 'general_docs', useCount: 1420000, recommended: true },
    { id: 'todo-list-teacher', name: '教师待办清单', description: '时间、优先级、状态与负责人', category: 'general_docs', useCount: 3130000, recommended: true },
    { id: 'training-plan-weekly', name: '培训进度周报', description: '进度、出勤、完成率与问题', category: 'training_plan', useCount: 420000, recommended: true },
    { id: 'lesson-plan-basic', name: '教案模板（基础版）', description: '目标、重难点、过程与评价', category: 'teach_design', useCount: 980000, recommended: true },

    // 最新（示例）
    { id: 'teacher-year-summary', name: '教师年度总结', description: '教学成果、反思与改进计划', category: 'general_docs', useCount: 215000 },
    { id: 'open-class-review', name: '公开课评课表', description: '教学目标、方法、效果与建议', category: 'teaching_research', useCount: 519500 },

    // 教学设计
    { id: 'teach-objectives-design', name: '教学目标设计', description: '知识/技能/过程方法/情感态度价值观', category: 'teach_design', useCount: 520000 },
    { id: 'lesson-flow', name: '教学流程设计', description: '导入、讲授、练习、巩固与作业', category: 'teach_design', useCount: 340000 },
    { id: 'evaluation-rubric', name: '课堂评价量表', description: '维度、权重、标准与记录表', category: 'teach_design', useCount: 260000 },

    // 课堂管理
    { id: 'classroom-observation', name: '课堂观察记录', description: '关注点、现象、改进建议', category: 'classroom_management', useCount: 410000 },
    { id: 'classroom-rules', name: '课堂纪律约定', description: '规则、奖惩、执行与反馈', category: 'classroom_management', useCount: 330000 },

    // 作业与评阅
    { id: 'homework-mark', name: '作业批改记录', description: '评分、评语、错题与二次讲评', category: 'homework_review', useCount: 480000 },
    { id: 'paper-review', name: '试卷评审模板', description: '题型、得分率、失分点与建议', category: 'homework_review', useCount: 350000 },

    // 教研活动
    { id: 'research-activity-plan', name: '教研活动方案', description: '主题、目标、流程与分工', category: 'teaching_research', useCount: 300000 },
    { id: 'research-minutes', name: '教研纪要（标准版）', description: '背景、讨论要点、结论与行动', category: 'teaching_research', useCount: 270000 },

    // 会议（教研/教务）
    { id: 'prep-group-minutes', name: '备课组会议纪要', description: '议题、决议与行动项', category: 'meeting_teaching', useCount: 450000 },

    // 教师发展 OKR
    { id: 'teacher-okr-quarter', name: '教师季度 OKR 计划', description: '目标、关键结果与里程碑', category: 'teacher_development_okr', useCount: 370000 },
    { id: 'teacher-okr-review', name: '教师 OKR 复盘', description: 'KR 完成度、经验总结与改进', category: 'teacher_development_okr', useCount: 260000 },

    // 培训方案与管理
    { id: 'training-plan', name: '培训方案模板', description: '目标、阶段模块、进度与考核', category: 'training_plan', useCount: 620000 },
    { id: 'training-attendee-list', name: '参训人员清单', description: '人员、岗位、部门与联系方式', category: 'training_plan', useCount: 410000 },
    { id: 'training-effect-eval', name: '培训效果评估表', description: '满意度、学习成效与改进建议', category: 'training_plan', useCount: 330000 },

    // 培训项目管理
    { id: 'training-needs-survey', name: '培训需求调研问卷', description: '对象、现状、痛点与诉求', category: 'training_needs', useCount: 510000 },
    { id: 'training-needs-summary', name: '培训需求汇总表', description: '能力项、优先级与建议方案', category: 'training_needs', useCount: 430000 },

    // 班级管理
    { id: 'class-weekly', name: '班级工作周报', description: '事务进展、问题与改进', category: 'class_management', useCount: 480000 },
    { id: 'class-duty', name: '班级值日安排', description: '值日表、职责与注意事项', category: 'class_management', useCount: 350000 },

    // 家校沟通
    { id: 'parent-communication', name: '家长沟通记录', description: '主题、沟通要点与跟进', category: 'home_school', useCount: 300000 },
    { id: 'home-visit', name: '家访记录模板', description: '访谈、问题与支持计划', category: 'home_school', useCount: 270000 },

    // 课程融合（E-PBL）
    { id: 'e-pbl-project', name: '项目式学习方案', description: '项目目标、任务分解与评价', category: 'e_pbl', useCount: 520000 },

    // 学情分析
    { id: 'learning-analytics-report', name: '学情分析报告', description: '成绩分布、薄弱点与建议', category: 'learning_analytics', useCount: 470000 },
    { id: 'error-analysis', name: '错题分析报告', description: '错因分类、改进策略与训练', category: 'learning_analytics', useCount: 360000 },

    // 研究课题
    { id: 'research-proposal', name: '课题申报书', description: '背景、目标、方法与计划', category: 'research_topic', useCount: 510000 },
    { id: 'research-plan', name: '研究计划书', description: '阶段安排、任务与预算', category: 'research_topic', useCount: 430000 },

    // 通用模板
    { id: 'meeting-notes-simple', name: '会议纪要（简洁版）', description: '议题、要点、行动项与责任人', category: 'general_docs', useCount: 980000 },
    { id: 'todo-list', name: '待办清单', description: '时间、优先级、状态与负责人', category: 'general_docs', useCount: 3130000 }
  ];

  return { success: true, data: templates, message: '获取文档/画板模版成功' };
};

// 面向教师与培训业务的模板分类
export const getNoteTemplateCategories = async () => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return {
    success: true,
    data: [
      { key: 'recommend', label: '推荐' },
      { key: 'latest', label: '最新' },
      { key: 'teach_design', label: '教学设计' },
      { key: 'classroom_management', label: '课堂管理' },
      { key: 'homework_review', label: '作业与评阅' },
      { key: 'teaching_research', label: '教研活动' },
      { key: 'meeting_teaching', label: '会议纪要' },
      { key: 'teacher_development_okr', label: '教师发展 OKR' },
      { key: 'training_plan', label: '培训方案与管理' },
      { key: 'training_needs', label: '培训项目管理' },
      { key: 'class_management', label: '班级管理' },
      { key: 'home_school', label: '家校沟通' },
      { key: 'e_pbl', label: '课程融合（E-PBL）' },
      { key: 'learning_analytics', label: '学情分析' },
      { key: 'research_topic', label: '研究课题' },
      { key: 'general_docs', label: '通用模板' }
    ],
    message: '获取模版分类成功'
  };
};

// 创建新模版
export const createTemplate = async (templateData) => {
  try {
    const templates = getTemplatesFromStorage();
    const newTemplate = {
      id: `template-${Date.now()}`,
      ...templateData,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedTemplates = [...templates, newTemplate];
    const saved = saveTemplatesToStorage(updatedTemplates);
    
    if (saved) {
      return {
        success: true,
        data: newTemplate,
        message: '创建模版成功'
      };
    } else {
      return {
        success: false,
        data: null,
        message: '保存模版失败'
      };
    }
  } catch (error) {
    console.error('创建模版失败:', error);
    return {
      success: false,
      data: null,
      message: '创建模版失败'
    };
  }
};

// 更新模版使用次数
export const updateTemplateUsage = async (templateId) => {
  try {
    const templates = getTemplatesFromStorage();
    const updatedTemplates = templates.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          usageCount: (template.usageCount || 0) + 1
        };
      }
      return template;
    });
    
    const saved = saveTemplatesToStorage(updatedTemplates);
    
    if (saved) {
      return {
        success: true,
        message: '更新使用次数成功'
      };
    } else {
      return {
        success: false,
        message: '更新使用次数失败'
      };
    }
  } catch (error) {
    console.error('更新模版使用次数失败:', error);
    return {
      success: false,
      message: '更新使用次数失败'
    };
  }
};

// 获取热门模版（按使用次数排序）
export const getPopularTemplates = async (limit = 5) => {
  try {
    const result = await getAvailableTemplates();
    if (result.success) {
      const sortedTemplates = result.data
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, limit);
      
      return {
        success: true,
        data: sortedTemplates,
        message: '获取热门模版成功'
      };
    } else {
      return result;
    }
  } catch (error) {
    console.error('获取热门模版失败:', error);
    return {
      success: false,
      data: [],
      message: '获取热门模版失败'
    };
  }
};

// 搜索模版
export const searchTemplates = async (keyword) => {
  try {
    const result = await getAvailableTemplates();
    if (result.success) {
      const filteredTemplates = result.data.filter(template => 
        template.name.toLowerCase().includes(keyword.toLowerCase()) ||
        template.description.toLowerCase().includes(keyword.toLowerCase()) ||
        template.category.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return {
        success: true,
        data: filteredTemplates,
        message: '搜索模版成功'
      };
    } else {
      return result;
    }
  } catch (error) {
    console.error('搜索模版失败:', error);
    return {
      success: false,
      data: [],
      message: '搜索模版失败'
    };
  }
};
