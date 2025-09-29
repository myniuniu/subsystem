/**
 * 培训方案生成器
 * 基于培训需求自动生成完整的培训方案，包含需求分析、目标设定、内容设计、实施计划等
 */

// 培训类型映射
const TRAINING_TYPE_MAP = {
  'teaching_methods': '教学方法与技能',
  'educational_tech': '教育技术应用',
  'student_management': '学生管理与班级建设',
  'curriculum_design': '课程设计与教学改革',
  'professional_dev': '专业发展与能力提升',
  'mental_health': '心理健康与危机干预',
  'research_innovation': '教学研究与创新',
  'leadership_management': '教育管理与领导力'
};

// 培训目标模板
const TRAINING_OBJECTIVES_TEMPLATES = {
  'teaching_methods': {
    knowledge: ['掌握现代教学理论和方法', '理解学习者特点和需求', '熟悉教学设计原理'],
    skills: ['运用多样化教学策略', '设计有效的教学活动', '实施差异化教学'],
    attitudes: ['树立以学生为中心的教学理念', '培养持续改进的教学态度', '建立反思性教学习惯']
  },
  'educational_tech': {
    knowledge: ['了解教育技术发展趋势', '掌握数字化教学工具', '理解技术与教学融合原理'],
    skills: ['熟练使用教学软件和平台', '制作多媒体教学资源', '开展在线教学活动'],
    attitudes: ['接受教育技术创新', '主动学习新技术', '推动教学数字化转型']
  },
  'student_management': {
    knowledge: ['掌握学生心理发展规律', '了解班级管理理论', '熟悉学生行为管理策略'],
    skills: ['建立良好师生关系', '组织班级活动', '处理学生问题和冲突'],
    attitudes: ['关爱每一个学生', '公平公正对待学生', '促进学生全面发展']
  },
  'curriculum_design': {
    knowledge: ['理解课程标准要求', '掌握课程设计理论', '了解学科核心素养'],
    skills: ['设计课程目标和内容', '开发教学资源', '实施课程评价'],
    attitudes: ['追求课程质量', '注重学生发展', '推进课程改革创新']
  }
};

// 培训内容模块模板
const TRAINING_CONTENT_MODULES = {
  'teaching_methods': [
    {
      module: '教学理论基础',
      duration: '8学时',
      content: ['现代教学理论概述', '学习理论与教学应用', '教学设计基本原理', '教学目标分类与设定'],
      methods: ['专题讲座', '案例分析', '小组讨论'],
      resources: ['理论文献', '教学视频', '案例库']
    },
    {
      module: '教学方法实践',
      duration: '12学时',
      content: ['启发式教学法', '合作学习策略', '项目式学习设计', '翻转课堂实施'],
      methods: ['工作坊', '模拟教学', '同伴观摩'],
      resources: ['教学工具包', '实践指南', '观摩视频']
    },
    {
      module: '课堂管理技巧',
      duration: '8学时',
      content: ['课堂环境营造', '学生注意力管理', '课堂纪律维护', '突发情况处理'],
      methods: ['情景模拟', '角色扮演', '经验分享'],
      resources: ['管理手册', '案例集', '工具表单']
    },
    {
      module: '教学评价与反思',
      duration: '6学时',
      content: ['形成性评价设计', '学习成果评估', '教学反思方法', '持续改进策略'],
      methods: ['实践操作', '反思写作', '同伴评议'],
      resources: ['评价工具', '反思模板', '改进案例']
    }
  ],
  'educational_tech': [
    {
      module: '教育技术基础',
      duration: '6学时',
      content: ['教育技术发展历程', '数字化教学理念', '技术与教学融合模式', '教育信息化政策解读'],
      methods: ['专题讲座', '政策解读', '趋势分析'],
      resources: ['政策文件', '发展报告', '案例视频']
    },
    {
      module: '数字化教学工具',
      duration: '10学时',
      content: ['在线教学平台使用', '多媒体制作技术', '互动教学工具应用', '学习管理系统操作'],
      methods: ['上机实操', '工具演示', '实践练习'],
      resources: ['软件工具', '操作手册', '模板资源']
    },
    {
      module: '在线教学设计',
      duration: '8学时',
      content: ['在线课程设计原理', '混合式教学模式', '虚拟课堂管理', '在线互动策略'],
      methods: ['设计实践', '模拟教学', '效果评估'],
      resources: ['设计模板', '优秀案例', '评估工具']
    },
    {
      module: '教学资源开发',
      duration: '10学时',
      content: ['微课制作技术', '教学视频编辑', '互动课件开发', '数字化教材编写'],
      methods: ['制作实践', '技术指导', '作品展示'],
      resources: ['制作软件', '素材库', '技术指南']
    }
  ]
};

// 实施计划模板
const IMPLEMENTATION_PLAN_TEMPLATE = {
  phases: [
    {
      phase: '准备阶段',
      duration: '1周',
      activities: ['需求调研确认', '培训资源准备', '学员分组安排', '培训环境布置'],
      deliverables: ['需求调研报告', '培训资源清单', '学员名册', '培训计划书']
    },
    {
      phase: '实施阶段',
      duration: '4-6周',
      activities: ['理论学习', '实践操作', '案例分析', '小组讨论', '作业完成'],
      deliverables: ['学习笔记', '实践作品', '案例分析报告', '小组展示']
    },
    {
      phase: '评估阶段',
      duration: '1周',
      activities: ['学习成果评估', '培训效果调查', '反馈收集整理', '改进建议制定'],
      deliverables: ['评估报告', '满意度调查', '反馈汇总', '改进方案']
    },
    {
      phase: '跟踪阶段',
      duration: '2-3个月',
      activities: ['应用效果跟踪', '持续指导支持', '经验分享交流', '后续培训规划'],
      deliverables: ['跟踪报告', '应用案例', '经验总结', '后续计划']
    }
  ]
};

// 评估体系模板
const EVALUATION_SYSTEM_TEMPLATE = {
  levels: [
    {
      level: 'Level 1 - 反应评估',
      description: '评估学员对培训的满意度和反应',
      methods: ['满意度调查', '现场反馈', '培训评价表'],
      indicators: ['培训内容满意度', '培训方式认可度', '培训组织评价', '整体满意度']
    },
    {
      level: 'Level 2 - 学习评估',
      description: '评估学员的知识、技能和态度变化',
      methods: ['前后测试', '技能考核', '作业评估', '案例分析'],
      indicators: ['知识掌握程度', '技能提升水平', '态度转变情况', '学习目标达成度']
    },
    {
      level: 'Level 3 - 行为评估',
      description: '评估学员在实际工作中的行为改变',
      methods: ['行为观察', '360度评估', '工作表现评价', '同事反馈'],
      indicators: ['教学行为改变', '工作方式改进', '新技能应用', '持续学习行为']
    },
    {
      level: 'Level 4 - 结果评估',
      description: '评估培训对组织和学生的影响',
      methods: ['绩效数据分析', '学生成绩对比', '教学质量评估', '投资回报分析'],
      indicators: ['教学质量提升', '学生学习效果', '工作效率改善', '组织目标达成']
    }
  ]
};

/**
 * 生成培训需求分析
 */
function generateNeedsAnalysis(trainingData) {
  const trainingType = trainingData.category || 'teaching_methods';
  const typeName = TRAINING_TYPE_MAP[trainingType] || '专业发展';
  
  return {
    targetGroup: {
      description: `针对${trainingData.targetAudience || '全体教师'}的${typeName}培训需求`,
      characteristics: [
        '具有一定的教学经验基础',
        '对新理念和方法有学习意愿',
        '希望提升专业能力和教学效果',
        '需要系统性的理论指导和实践支持'
      ],
      currentLevel: '具备基础教学能力，但在特定领域需要进一步提升',
      expectedLevel: '能够熟练运用相关理论和方法，显著提升教学效果'
    },
    gapAnalysis: {
      knowledgeGaps: [
        '理论知识不够系统完整',
        '前沿理念了解不足',
        '相关政策理解不深'
      ],
      skillGaps: [
        '实践操作技能有待提升',
        '新技术应用能力不足',
        '问题解决能力需要加强'
      ],
      attitudeGaps: [
        '创新意识有待增强',
        '持续学习习惯需要培养',
        '协作分享精神需要提升'
      ]
    },
    priorityNeeds: [
      {
        need: '理论基础强化',
        urgency: '高',
        importance: '高',
        description: '建立系统的理论知识框架'
      },
      {
        need: '实践技能提升',
        urgency: '高',
        importance: '高',
        description: '掌握具体的操作方法和技巧'
      },
      {
        need: '应用能力培养',
        urgency: '中',
        importance: '高',
        description: '能够在实际工作中灵活运用'
      }
    ]
  };
}

/**
 * 生成培训目标
 */
function generateTrainingObjectives(trainingData) {
  const trainingType = trainingData.category || 'teaching_methods';
  const template = TRAINING_OBJECTIVES_TEMPLATES[trainingType] || TRAINING_OBJECTIVES_TEMPLATES['teaching_methods'];
  
  return {
    overallObjective: `通过系统性的培训，提升参训人员在${TRAINING_TYPE_MAP[trainingType] || '专业发展'}方面的综合能力，促进教学质量和效果的显著改善。`,
    specificObjectives: {
      knowledge: {
        title: '知识目标',
        objectives: template.knowledge
      },
      skills: {
        title: '技能目标',
        objectives: template.skills
      },
      attitudes: {
        title: '态度目标',
        objectives: template.attitudes
      }
    },
    learningOutcomes: [
      '能够准确理解和阐述相关理论知识',
      '能够熟练运用所学方法和技巧',
      '能够独立分析和解决实际问题',
      '能够持续改进和创新工作方式',
      '能够与他人协作分享经验成果'
    ]
  };
}

/**
 * 生成培训内容设计
 */
function generateTrainingContent(trainingData) {
  const trainingType = trainingData.category || 'teaching_methods';
  const modules = TRAINING_CONTENT_MODULES[trainingType] || TRAINING_CONTENT_MODULES['teaching_methods'];
  
  return {
    contentFramework: {
      totalDuration: modules.reduce((sum, module) => sum + parseInt(module.duration), 0) + '学时',
      moduleCount: modules.length,
      structure: '理论学习 + 实践操作 + 案例分析 + 反思总结'
    },
    modules: modules.map((module, index) => ({
      ...module,
      sequence: index + 1,
      objectives: [
        `掌握${module.module}的核心理念`,
        `学会${module.module}的实践方法`,
        `能够应用${module.module}解决实际问题`
      ]
    })),
    teachingMethods: {
      theoretical: ['专题讲座', '理论研讨', '文献阅读', '概念解析'],
      practical: ['实践操作', '技能训练', '模拟演练', '工具使用'],
      interactive: ['小组讨论', '案例分析', '经验分享', '同伴学习'],
      reflective: ['反思写作', '总结汇报', '自我评估', '改进计划']
    },
    resources: {
      materials: ['培训教材', '参考资料', '案例集', '工具包'],
      technology: ['在线平台', '教学软件', '多媒体设备', '网络资源'],
      human: ['专家讲师', '实践导师', '同伴学员', '技术支持'],
      environment: ['培训教室', '实践场所', '在线空间', '交流平台']
    }
  };
}

/**
 * 生成实施计划
 */
function generateImplementationPlan(trainingData) {
  const duration = trainingData.duration || '6周';
  
  return {
    timeline: {
      totalDuration: duration,
      phases: IMPLEMENTATION_PLAN_TEMPLATE.phases.map(phase => ({
        ...phase,
        startDate: '待确定',
        endDate: '待确定',
        responsible: '培训组织方',
        participants: trainingData.targetAudience || '全体学员'
      }))
    },
    schedule: {
      frequency: '每周2-3次',
      duration: '每次2-3小时',
      format: '线上线下结合',
      timeSlots: ['工作日晚上', '周末上午', '寒暑假期间']
    },
    organization: {
      teamStructure: [
        { role: '培训负责人', responsibility: '整体统筹和协调' },
        { role: '专家讲师', responsibility: '理论讲授和指导' },
        { role: '实践导师', responsibility: '实践指导和答疑' },
        { role: '技术支持', responsibility: '技术保障和维护' },
        { role: '班主任', responsibility: '学员管理和服务' }
      ],
      logistics: [
        '培训场地预订和布置',
        '设备器材准备和调试',
        '学习资料印制和分发',
        '餐饮住宿安排协调',
        '交通接送组织安排'
      ]
    },
    riskManagement: {
      risks: [
        { risk: '学员参与度不高', mitigation: '加强动员和激励机制' },
        { risk: '培训效果不理想', mitigation: '及时调整内容和方法' },
        { risk: '技术设备故障', mitigation: '准备备用设备和方案' },
        { risk: '时间安排冲突', mitigation: '提前沟通协调时间' }
      ]
    }
  };
}

/**
 * 生成评估体系
 */
function generateEvaluationSystem(trainingData) {
  return {
    framework: EVALUATION_SYSTEM_TEMPLATE,
    assessmentPlan: {
      formative: {
        description: '过程性评估，及时了解学习进展',
        methods: ['课堂观察', '作业检查', '小测验', '讨论参与'],
        frequency: '每次培训后',
        feedback: '即时反馈和指导'
      },
      summative: {
        description: '总结性评估，全面评价学习成果',
        methods: ['综合考试', '实践考核', '项目作业', '论文报告'],
        timing: '培训结束时',
        criteria: '知识、技能、态度综合评价'
      },
      followUp: {
        description: '跟踪评估，了解应用效果',
        methods: ['问卷调查', '访谈观察', '绩效分析', '案例收集'],
        period: '培训后3-6个月',
        focus: '实际应用和持续改进'
      }
    },
    qualityAssurance: {
      standards: ['培训目标达成度≥85%', '学员满意度≥90%', '知识掌握率≥80%', '技能提升率≥75%'],
      monitoring: ['专家督导', '同伴评议', '学员反馈', '数据分析'],
      improvement: ['定期回顾', '问题诊断', '方案调整', '持续优化']
    }
  };
}

/**
 * 生成完整的培训方案
 */
export function generateComprehensiveTrainingPlan(trainingData) {
  const plan = {
    metadata: {
      title: trainingData.title || '专业发展培训方案',
      type: TRAINING_TYPE_MAP[trainingData.category] || '专业发展',
      targetAudience: trainingData.targetAudience || '全体教师',
      duration: trainingData.duration || '6周',
      generatedAt: new Date().toLocaleString(),
      version: '1.0'
    },
    
    // 1. 培训需求分析
    needsAnalysis: generateNeedsAnalysis(trainingData),
    
    // 2. 培训目标设定
    objectives: generateTrainingObjectives(trainingData),
    
    // 3. 培训内容设计
    content: generateTrainingContent(trainingData),
    
    // 4. 培训课程安排
    courseArrangement: {
      totalHours: 120,
      totalWeeks: 8,
      courses: [
        {
          id: 'course_1',
          courseName: '现代教学理论与实践',
          instructor: '张教授',
          duration: '8学时',
          type: '理论课程',
          status: '进行中',
          progress: 75,
          description: '深入学习现代教学理论，掌握有效的教学方法和策略',
          schedule: '第1-2周',
          location: '培训教室A',
          materials: ['教学理论手册', '案例分析集', '实践指南']
        },
        {
          id: 'course_2',
          courseName: '数字化教学工具应用',
          instructor: '李老师',
          duration: '12学时',
          type: '实践课程',
          status: '未开始',
          progress: 0,
          description: '学习使用各种数字化教学工具，提升教学效率',
          schedule: '第3-4周',
          location: '计算机实验室',
          materials: ['软件安装包', '操作手册', '练习素材']
        },
        {
          id: 'course_3',
          courseName: '课堂管理与学生互动',
          instructor: '王老师',
          duration: '6学时',
          type: '工作坊',
          status: '已完成',
          progress: 100,
          description: '掌握有效的课堂管理技巧，提升师生互动质量',
          schedule: '第5周',
          location: '模拟教室',
          materials: ['管理工具包', '互动游戏集', '评估表单']
        },
        {
          id: 'course_4',
          courseName: '教学评价与反思',
          instructor: '陈老师',
          duration: '4学时',
          type: '研讨课',
          status: '未开始',
          progress: 0,
          description: '学习科学的教学评价方法，培养反思性教学习惯',
          schedule: '第6周',
          location: '研讨室',
          materials: ['评价工具集', '反思模板', '优秀案例']
        }
      ]
    },
    
    // 5. 参训人员管理
    participantManagement: {
      totalParticipants: 25,
      groupStructure: '分为5个小组，每组5人',
      participants: [
        {
          id: 'participant_1',
          name: '张三',
          department: '数学系',
          position: '副教授',
          experience: '8年',
          status: '积极参与',
          completionRate: 85,
          lastActive: '2024-01-15',
          specialNeeds: '希望加强数字化教学技能',
          contactInfo: 'zhangsan@university.edu'
        },
        {
          id: 'participant_2',
          name: '李四',
          department: '物理系',
          position: '讲师',
          experience: '5年',
          status: '正常参与',
          completionRate: 72,
          lastActive: '2024-01-14',
          specialNeeds: '需要提升课堂管理能力',
          contactInfo: 'lisi@university.edu'
        },
        {
          id: 'participant_3',
          name: '王五',
          department: '化学系',
          position: '教授',
          experience: '15年',
          status: '积极参与',
          completionRate: 90,
          lastActive: '2024-01-15',
          specialNeeds: '关注教学创新方法',
          contactInfo: 'wangwu@university.edu'
        },
        {
          id: 'participant_4',
          name: '赵六',
          department: '生物系',
          position: '副教授',
          experience: '10年',
          status: '需要关注',
          completionRate: 45,
          lastActive: '2024-01-12',
          specialNeeds: '需要额外辅导支持',
          contactInfo: 'zhaoliu@university.edu'
        }
      ],
      attendanceTracking: {
        method: '电子签到系统',
        requirements: '每次课程必须签到',
        makeupPolicy: '缺课可申请补课或在线学习'
      },
      communicationChannels: [
        '微信群组',
        '邮件通知',
        '学习平台消息',
        '定期电话回访'
      ]
    },
    
    // 6. 实施计划
    implementation: generateImplementationPlan(trainingData),
    
    // 7. 评估体系
    evaluation: generateEvaluationSystem(trainingData),
    
    // 8. 预期成果
    expectedOutcomes: {
      immediate: [
        '参训人员掌握相关理论知识',
        '具备基本的实践操作能力',
        '建立正确的理念和态度'
      ],
      shortTerm: [
        '能够在工作中应用所学知识技能',
        '教学或工作效果有明显改善',
        '形成持续学习和改进的习惯'
      ],
      longTerm: [
        '成为相关领域的骨干和专家',
        '能够指导和带动其他同事',
        '为组织发展做出更大贡献'
      ]
    },
    
    // 9. 资源需求
    resourceRequirements: {
      human: {
        trainers: '2-3名专家讲师',
        support: '1-2名技术支持人员',
        management: '1名培训管理员'
      },
      material: {
        venue: '可容纳50人的培训教室',
        equipment: '投影仪、音响、电脑等',
        supplies: '培训资料、文具用品等'
      },
      financial: {
        trainerFees: '专家讲师费用',
        materials: '资料印制费用',
        venue: '场地租赁费用',
        other: '餐饮、交通等其他费用'
      }
    },
    
    // 10. 持续改进
    continuousImprovement: {
      feedbackCollection: '多渠道收集反馈意见',
      dataAnalysis: '定期分析培训效果数据',
      planAdjustment: '根据反馈调整培训方案',
      bestPractices: '总结推广优秀经验做法'
    }
  };
  
  return plan;
}

/**
 * 生成培训方案的Markdown格式文档
 */
export function generateTrainingPlanMarkdown(trainingPlan) {
  const { metadata, needsAnalysis, objectives, content, implementation, evaluation, expectedOutcomes, resourceRequirements, continuousImprovement } = trainingPlan;
  
  return `# ${metadata.title}

## 方案概述

**培训类型：** ${metadata.type}  
**目标群体：** ${metadata.targetAudience}  
**培训周期：** ${metadata.duration}  
**生成时间：** ${metadata.generatedAt}  
**方案版本：** ${metadata.version}

---

## 一、培训需求分析

### 1.1 目标群体分析

**群体描述：** ${needsAnalysis.targetGroup.description}

**群体特征：**
${needsAnalysis.targetGroup.characteristics.map(item => `- ${item}`).join('\n')}

**当前水平：** ${needsAnalysis.targetGroup.currentLevel}

**期望水平：** ${needsAnalysis.targetGroup.expectedLevel}

### 1.2 能力差距分析

**知识差距：**
${needsAnalysis.gapAnalysis.knowledgeGaps.map(gap => `- ${gap}`).join('\n')}

**技能差距：**
${needsAnalysis.gapAnalysis.skillGaps.map(gap => `- ${gap}`).join('\n')}

**态度差距：**
${needsAnalysis.gapAnalysis.attitudeGaps.map(gap => `- ${gap}`).join('\n')}

### 1.3 优先需求识别

${needsAnalysis.priorityNeeds.map(need => `
**${need.need}**
- 紧迫性：${need.urgency}
- 重要性：${need.importance}
- 描述：${need.description}
`).join('\n')}

---

## 二、培训目标设定

### 2.1 总体目标

${objectives.overallObjective}

### 2.2 具体目标

**${objectives.specificObjectives.knowledge.title}：**
${objectives.specificObjectives.knowledge.objectives.map(obj => `- ${obj}`).join('\n')}

**${objectives.specificObjectives.skills.title}：**
${objectives.specificObjectives.skills.objectives.map(obj => `- ${obj}`).join('\n')}

**${objectives.specificObjectives.attitudes.title}：**
${objectives.specificObjectives.attitudes.objectives.map(obj => `- ${obj}`).join('\n')}

### 2.3 学习成果

${objectives.learningOutcomes.map(outcome => `- ${outcome}`).join('\n')}

---

## 三、培训内容设计

### 3.1 内容框架

- **总学时：** ${content.contentFramework.totalDuration}
- **模块数量：** ${content.contentFramework.moduleCount}个
- **结构安排：** ${content.contentFramework.structure}

### 3.2 培训模块

${content.modules.map(module => `
#### 模块${module.sequence}：${module.module}

**学时安排：** ${module.duration}

**学习目标：**
${module.objectives.map(obj => `- ${obj}`).join('\n')}

**主要内容：**
${module.content.map(item => `- ${item}`).join('\n')}

**教学方法：**
${module.methods.map(method => `- ${method}`).join('\n')}

**学习资源：**
${module.resources.map(resource => `- ${resource}`).join('\n')}
`).join('\n')}

### 3.3 教学方法

**理论教学：** ${content.teachingMethods.theoretical.join('、')}

**实践教学：** ${content.teachingMethods.practical.join('、')}

**互动教学：** ${content.teachingMethods.interactive.join('、')}

**反思教学：** ${content.teachingMethods.reflective.join('、')}

### 3.4 学习资源

**学习材料：** ${content.resources.materials.join('、')}

**技术资源：** ${content.resources.technology.join('、')}

**人力资源：** ${content.resources.human.join('、')}

**环境资源：** ${content.resources.environment.join('、')}

---

## 四、实施计划

### 4.1 时间安排

**总体周期：** ${implementation.timeline.totalDuration}

${implementation.timeline.phases.map(phase => `
**${phase.phase}（${phase.duration}）**

主要活动：
${phase.activities.map(activity => `- ${activity}`).join('\n')}

交付成果：
${phase.deliverables.map(deliverable => `- ${deliverable}`).join('\n')}
`).join('\n')}

### 4.2 培训安排

- **培训频次：** ${implementation.schedule.frequency}
- **单次时长：** ${implementation.schedule.duration}
- **培训形式：** ${implementation.schedule.format}
- **时间选择：** ${implementation.schedule.timeSlots.join('、')}

### 4.3 组织架构

${implementation.organization.teamStructure.map(member => `- **${member.role}：** ${member.responsibility}`).join('\n')}

### 4.4 后勤保障

${implementation.organization.logistics.map(item => `- ${item}`).join('\n')}

### 4.5 风险管控

${implementation.riskManagement.risks.map(item => `- **风险：** ${item.risk} | **应对：** ${item.mitigation}`).join('\n')}

---

## 五、评估体系

### 5.1 评估框架

${evaluation.framework.levels.map(level => `
**${level.level}**
- 评估内容：${level.description}
- 评估方法：${level.methods.join('、')}
- 关键指标：${level.indicators.join('、')}
`).join('\n')}

### 5.2 评估计划

**过程性评估**
- 评估说明：${evaluation.assessmentPlan.formative.description}
- 评估方法：${evaluation.assessmentPlan.formative.methods.join('、')}
- 评估频次：${evaluation.assessmentPlan.formative.frequency}
- 反馈机制：${evaluation.assessmentPlan.formative.feedback}

**总结性评估**
- 评估说明：${evaluation.assessmentPlan.summative.description}
- 评估方法：${evaluation.assessmentPlan.summative.methods.join('、')}
- 评估时机：${evaluation.assessmentPlan.summative.timing}
- 评估标准：${evaluation.assessmentPlan.summative.criteria}

**跟踪评估**
- 评估说明：${evaluation.assessmentPlan.followUp.description}
- 评估方法：${evaluation.assessmentPlan.followUp.methods.join('、')}
- 评估周期：${evaluation.assessmentPlan.followUp.period}
- 关注重点：${evaluation.assessmentPlan.followUp.focus}

### 5.3 质量保障

**质量标准：**
${evaluation.qualityAssurance.standards.map(standard => `- ${standard}`).join('\n')}

**监控机制：**
${evaluation.qualityAssurance.monitoring.map(method => `- ${method}`).join('\n')}

**改进措施：**
${evaluation.qualityAssurance.improvement.map(measure => `- ${measure}`).join('\n')}

---

## 六、预期成果

### 6.1 即时成果
${expectedOutcomes.immediate.map(outcome => `- ${outcome}`).join('\n')}

### 6.2 短期成果
${expectedOutcomes.shortTerm.map(outcome => `- ${outcome}`).join('\n')}

### 6.3 长期成果
${expectedOutcomes.longTerm.map(outcome => `- ${outcome}`).join('\n')}

---

## 七、资源需求

### 7.1 人力资源
- **培训师资：** ${resourceRequirements.human.trainers}
- **技术支持：** ${resourceRequirements.human.support}
- **管理人员：** ${resourceRequirements.human.management}

### 7.2 物质资源
- **培训场地：** ${resourceRequirements.material.venue}
- **设备器材：** ${resourceRequirements.material.equipment}
- **学习用品：** ${resourceRequirements.material.supplies}

### 7.3 财务预算
- **师资费用：** ${resourceRequirements.financial.trainerFees}
- **材料费用：** ${resourceRequirements.financial.materials}
- **场地费用：** ${resourceRequirements.financial.venue}
- **其他费用：** ${resourceRequirements.financial.other}

---

## 八、持续改进

### 8.1 反馈收集
${continuousImprovement.feedbackCollection}

### 8.2 数据分析
${continuousImprovement.dataAnalysis}

### 8.3 方案调整
${continuousImprovement.planAdjustment}

### 8.4 经验推广
${continuousImprovement.bestPractices}

---

*本培训方案由智能培训方案生成器自动生成，可根据实际情况进行调整和完善。*
`;
}

export default {
  generateComprehensiveTrainingPlan,
  generateTrainingPlanMarkdown
};