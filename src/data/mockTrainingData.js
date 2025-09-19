/**
 * 模拟培训数据生成器
 * 为不同教育层次和角色生成真实的培训需求数据
 */

import {
  EDUCATION_LEVELS,
  ROLES,
  TRAINING_TYPES,
  TRAINING_SOURCES,
  PRIORITY_LEVELS,
  TRAINING_STATUS,
  getRoleTrainingTemplates,
  getTrainingSourceLabel,
  getRoleLabel,
  getEducationLevelLabel
} from './trainingDataTemplates.js';

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 随机选择数组元素
const randomChoice = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// 随机选择多个元素
const randomChoices = (array, count = 1) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

// 生成随机日期
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// 培训需求详细内容模板 - 基于新的分类体系
const TRAINING_CONTENT_TEMPLATES = {
  [TRAINING_TYPES.TEACHING_METHODS]: [
    '现代教学方法与策略是提升教学质量的关键。本培训将介绍启发式教学、案例教学、项目式学习等先进教学方法，帮助教师掌握多元化的教学策略，提升课堂教学效果和学生参与度。',
    '课堂互动技巧与学生参与度提升是现代教学的重要组成部分。培训将重点介绍如何设计有效的课堂互动环节，运用提问技巧、小组讨论、角色扮演等方式激发学生学习兴趣。',
    '差异化教学与个性化指导能够满足不同学生的学习需求。培训将介绍如何识别学生的学习特点，设计分层教学方案，实施个性化指导策略，促进每个学生的全面发展。',
    '教学评价与反馈机制建设是教学质量保障的重要环节。培训将介绍多元化评价方法、形成性评价策略、有效反馈技巧等内容，帮助教师建立科学的评价体系。'
  ],
  [TRAINING_TYPES.STUDENT_MANAGEMENT]: [
    '班级管理与班风建设是班主任工作的核心内容。本培训将介绍班级文化建设、班级制度制定、学生干部培养等方面的方法和技巧，帮助班主任营造良好的班级氛围。',
    '学生心理健康教育与危机干预是维护学生身心健康的重要工作。培训将重点介绍学生心理问题的识别、心理危机的预防和干预方法，提升教师的心理健康教育能力。',
    '家校沟通与合作是促进学生全面发展的重要途径。培训将介绍有效的家校沟通策略、家长会组织技巧、家庭教育指导方法等内容，建立良好的家校合作关系。',
    '学生行为管理与纪律教育是维护良好教学秩序的基础。培训将介绍正面管教方法、行为矫正技巧、纪律教育策略等内容，帮助教师有效管理学生行为。'
  ],
  [TRAINING_TYPES.EDUCATIONAL_TECH]: [
    '数字化教学工具与平台应用是现代教育的必备技能。本培训将介绍各类教学软件、在线教学平台、多媒体制作工具的使用方法，提升教师的信息技术应用能力。',
    '智慧课堂建设与应用是教育信息化的重要内容。培训将介绍智慧教室设备使用、互动教学系统操作、数字化教学资源整合等内容，推进智慧教育发展。',
    '在线教学设计与实施是混合式教学的关键环节。培训将重点介绍在线课程设计原则、直播教学技巧、学习管理系统使用等内容，提升在线教学质量。',
    '教育大数据分析与应用能够为教学决策提供科学依据。培训将介绍学习数据的收集、分析和应用方法，帮助教师利用数据改进教学效果。'
  ],
  [TRAINING_TYPES.PROFESSIONAL_DEV]: [
    '教师专业素养与职业发展是教师成长的重要基础。本培训将从师德师风、专业知识更新、教学技能提升等方面，促进教师的全面发展和职业成长。',
    '学科前沿知识与教学融合是保持教学内容时效性的重要途径。培训将邀请学科专家介绍最新研究成果和发展趋势，帮助教师更新专业知识体系。',
    '教学反思与专业成长是教师持续发展的内在动力。培训将介绍教学反思的方法和技巧，建立专业学习共同体，促进教师的专业成长。',
    '跨学科教学与综合素养培养是现代教育的重要趋势。培训将介绍跨学科教学设计方法、综合实践活动组织、学生核心素养培养策略等内容。'
  ],
  [TRAINING_TYPES.STUDENT_MANAGEMENT]: [
    '学校战略规划与发展管理是学校可持续发展的重要保障。本培训将介绍学校发展规划制定、目标管理、绩效评估等内容，提升管理者的战略思维和执行能力。',
    '教师队伍建设与人力资源管理是学校管理的核心工作。培训将重点介绍教师招聘选拔、培训发展、激励考核等方面的管理方法和策略。',
    '教学质量管理与监控体系建设是保障教育质量的重要手段。培训将介绍质量标准制定、监控体系建设、评估改进方法等内容，建立科学的质量管理体系。',
    '学校文化建设与品牌塑造是提升学校软实力的重要途径。培训将介绍学校文化的内涵、建设路径和传播策略，打造特色鲜明的学校品牌。'
  ],
  [TRAINING_TYPES.CURRICULUM_DESIGN]: [
    '课程标准解读与教学设计是课程实施的基础工作。本培训将深入解读课程标准要求，介绍教学目标设定、教学内容选择、教学活动设计等方法。',
    '校本课程开发与特色课程建设是学校课程体系的重要组成部分。培训将介绍校本课程开发流程、特色课程设计理念、课程评价方法等内容。',
    '教学改革与创新实践是提升教学质量的重要途径。培训将分享成功的教学改革案例，介绍创新教学模式，推动教学方法的改革与创新。',
    '综合实践活动课程设计与实施是培养学生实践能力的重要载体。培训将介绍活动课程的设计原则、组织实施方法、成果展示形式等内容。'
  ],
  [TRAINING_TYPES.MENTAL_HEALTH]: [
    '学生心理健康教育与咨询技能是维护学生身心健康的重要能力。本培训将介绍心理健康教育的基本理论、咨询技巧、危机干预方法等内容。',
    '德育工作创新与实践是培养学生品德的重要途径。培训将介绍德育工作的新理念、新方法，分享德育实践的成功经验和创新做法。',
    '校园心理危机预防与处理是保障校园安全的重要工作。培训将重点介绍心理危机的识别、预防措施、应急处理程序等内容，提升危机处理能力。',
    '家庭教育指导与亲子关系建设是促进学生健康成长的重要因素。培训将介绍家庭教育的基本原理、指导方法、亲子沟通技巧等内容。'
  ],
  [TRAINING_TYPES.RESEARCH_INNOVATION]: [
    '教育科研方法与课题研究是提升教师科研能力的重要内容。本培训将介绍教育科研的基本方法、课题申报技巧、研究报告撰写等内容。',
    '教学创新与成果转化是推动教育发展的重要动力。培训将介绍教学创新的理念和方法，分享创新成果的转化经验，促进教育教学改革。',
    '学术论文写作与发表技巧是教师专业发展的重要技能。培训将介绍论文写作规范、投稿策略、同行评议等内容，提升教师的学术写作能力。',
    '教育技术创新与应用研究是教育现代化的重要方向。培训将介绍教育技术的发展趋势、创新应用案例、研究方法等内容，推动技术与教育的深度融合。'
  ]
};

// 生成培训内容
const generateTrainingContent = (type, title) => {
  const templates = TRAINING_CONTENT_TEMPLATES[type] || TRAINING_CONTENT_TEMPLATES[TRAINING_TYPES.PROFESSIONAL_DEV];
  const baseContent = randomChoice(templates);
  
  return `${baseContent}

## 培训目标
- 掌握${title}的核心理念和方法
- 提升实际应用能力和操作技能
- 建立系统性的知识框架
- 促进个人专业发展

## 培训内容
1. 理论基础与发展趋势
2. 实践方法与技巧分享
3. 案例分析与讨论
4. 实操演练与反馈

## 预期成果
通过本次培训，参训人员将能够：
- 理解相关理论知识和实践要求
- 掌握具体的操作方法和技巧
- 提升解决实际问题的能力
- 形成持续学习和改进的意识

## 后续支持
培训结束后，我们将提供：
- 相关学习资料和工具包
- 在线答疑和交流平台
- 定期的跟进指导和评估
- 持续的专业发展机会`;
};

// 生成人员信息
const generatePersonInfo = (role, educationLevel) => {
  const names = {
    [ROLES.TEACHER]: ['张教授', '李老师', '王讲师', '刘副教授', '陈老师', '杨教师', '赵老师', '孙教授'],
    [ROLES.CLASS_TEACHER]: ['马班主任', '周老师', '吴班主任', '郑老师', '冯班主任', '褚老师'],
    [ROLES.COUNSELOR]: ['钱辅导员', '孙老师', '李辅导员', '周老师', '吴辅导员', '郑老师'],
    [ROLES.PRINCIPAL]: ['王校长', '李校长', '张校长', '刘校长', '陈校长'],
    [ROLES.DEAN]: ['赵院长', '孙院长', '周院长', '吴院长', '郑院长']
  };
  
  const departments = {
    [EDUCATION_LEVELS.HIGHER_ED]: ['计算机学院', '经济管理学院', '外国语学院', '机械工程学院', '化学工程学院', '数学学院', '物理学院', '文学院'],
    [EDUCATION_LEVELS.VOCATIONAL]: ['信息技术系', '机电工程系', '商贸管理系', '建筑工程系', '汽车工程系', '艺术设计系'],
    [EDUCATION_LEVELS.BASIC_ED]: ['语文组', '数学组', '英语组', '物理组', '化学组', '生物组', '历史组', '地理组', '政治组', '体育组', '音乐组', '美术组']
  };
  
  return {
    name: randomChoice(names[role] || names[ROLES.TEACHER]),
    department: randomChoice(departments[educationLevel] || departments[EDUCATION_LEVELS.BASIC_ED]),
    role: getRoleLabel(role),
    educationLevel: getEducationLevelLabel(educationLevel)
  };
};

// 生成单个培训需求
const generateTrainingNeed = (template, role, educationLevel) => {
  const personInfo = generatePersonInfo(role, educationLevel);
  const now = new Date();
  const createdAt = randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now);
  const updatedAt = randomDate(createdAt, now);
  
  // 生成培训对象
  const targetAudiences = {
    [EDUCATION_LEVELS.HIGHER_ED]: ['全体教师', '新入职教师', '骨干教师', '学科带头人', '教授', '副教授', '讲师', '助教', '博士生导师', '硕士生导师'],
    [EDUCATION_LEVELS.VOCATIONAL]: ['专业教师', '实训教师', '班主任', '辅导员', '技能大师', '双师型教师', '企业兼职教师'],
    [EDUCATION_LEVELS.BASIC_ED]: ['学科教师', '班主任', '年级组长', '教研组长', '德育教师', '心理健康教师', '体育教师', '艺术教师']
  };
  
  const targetAudience = randomChoice(targetAudiences[educationLevel] || targetAudiences[EDUCATION_LEVELS.BASIC_ED]);
  
  // 生成培训方式
  const methods = ['线上培训', '线下培训', '混合式培训', '实地考察', '专家讲座', '工作坊', '研讨会', '案例分析', '实操演练'];
  const method = randomChoice(methods);
  
  // 生成预算范围
  const budgets = ['5000-10000元', '10000-20000元', '20000-50000元', '50000-100000元', '100000元以上'];
  const budget = randomChoice(budgets);
  
  // 生成培训地点
  const venues = {
    [EDUCATION_LEVELS.HIGHER_ED]: ['学术报告厅', '多媒体教室', '实验室', '图书馆会议室', '国际会议中心', '在线平台'],
    [EDUCATION_LEVELS.VOCATIONAL]: ['实训中心', '技能工作室', '校企合作基地', '多功能教室', '在线平台'],
    [EDUCATION_LEVELS.BASIC_ED]: ['会议室', '多媒体教室', '教师发展中心', '区教育局', '在线平台']
  };
  
  const venue = randomChoice(venues[educationLevel] || venues[EDUCATION_LEVELS.BASIC_ED]);
  
  // 生成培训师资
  const trainers = {
    [EDUCATION_LEVELS.HIGHER_ED]: ['知名教授', '教育专家', '行业专家', '国外学者', '教学名师', '学科带头人'],
    [EDUCATION_LEVELS.VOCATIONAL]: ['技能大师', '企业专家', '行业导师', '双师型教师', '技术专家'],
    [EDUCATION_LEVELS.BASIC_ED]: ['教研员', '特级教师', '名师工作室主持人', '教育专家', '心理专家']
  };
  
  const trainer = randomChoice(trainers[educationLevel] || trainers[EDUCATION_LEVELS.BASIC_ED]);
  
  const need = {
    id: generateId(),
    title: template.title,
    content: generateTrainingContent(template.type, template.title),
    category: template.type,
    type: template.type,
    source: template.source,
    priority: template.priority === PRIORITY_LEVELS.HIGH,
    priorityLevel: template.priority,
    status: randomChoice(Object.values(TRAINING_STATUS)),
    duration: template.duration,
    tags: [...template.tags, personInfo.role, personInfo.educationLevel],
    
    // 培训基本信息
    targetAudience,
    method,
    budget,
    
    // 申请人信息
    applicant: {
      name: personInfo.name,
      role: personInfo.role,
      department: personInfo.department,
      educationLevel: personInfo.educationLevel
    },
    
    // 时间信息
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    
    // 统计信息
    wordCount: Math.floor(Math.random() * 2000) + 500,
    readTime: Math.floor(Math.random() * 10) + 2,
    
    // 培训详情
    trainingDetails: {
      expectedParticipants: Math.floor(Math.random() * 50) + 10,
      budget: Math.floor(Math.random() * 50000) + 5000,
      venue,
      trainer,
      materials: randomChoice(['PPT课件', '培训手册', '视频资料', '在线资源', '实操工具', '案例集', '工具包'])
    },
    
    // 审批信息
    approval: {
      status: randomChoice(['pending', 'approved', 'rejected', 'under_review']),
      approver: randomChoice(['教务处', '人事处', '院长办公室', '校长办公室', '培训中心']),
      approvedAt: Math.random() > 0.5 ? randomDate(createdAt, now).toISOString() : null,
      comments: Math.random() > 0.7 ? randomChoice([
        '建议调整培训时间和内容',
        '需要进一步明确培训目标',
        '预算需要重新评估',
        '建议增加实践环节',
        '培训对象范围可以扩大',
        '需要提供更详细的培训方案'
      ]) : ''
    }
  };
  
  return need;
};

// 生成角色培训数据
const generateRoleTrainingData = (educationLevel, role, count = 5) => {
  const templates = getRoleTrainingTemplates(educationLevel, role);
  if (templates.length === 0) return [];
  
  const trainingData = [];
  for (let i = 0; i < count; i++) {
    const template = randomChoice(templates);
    trainingData.push(generateTrainingNeed(template, role, educationLevel));
  }
  
  return trainingData;
};

// 生成所有模拟数据
const generateAllMockTrainingData = () => {
  const allData = [];
  
  // 为每个教育层次和角色生成数据
  Object.values(EDUCATION_LEVELS).forEach(educationLevel => {
    Object.values(ROLES).forEach(role => {
      const roleData = generateRoleTrainingData(educationLevel, role, 3);
      allData.push(...roleData);
    });
  });
  
  return allData;
};

// 生成特定角色的培训数据
const generateRoleSpecificData = (educationLevel, role, count = 10) => {
  return generateRoleTrainingData(educationLevel, role, count);
};

// 生成培训统计数据
const generateTrainingStats = (trainingData) => {
  const stats = {
    total: trainingData.length,
    byStatus: {},
    byType: {},
    byPriority: {},
    bySource: {},
    byEducationLevel: {},
    byRole: {},
    byMethod: {},
    byTargetAudience: {},
    recentActivity: [],
    monthlyTrend: [],
    budgetAnalysis: {
      total: 0,
      average: 0,
      byRange: {}
    }
  };
  
  let totalBudget = 0;
  const monthlyData = {};
  
  trainingData.forEach(item => {
    // 按状态统计
    stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;
    
    // 按类型统计
    stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
    
    // 按优先级统计
    stats.byPriority[item.priorityLevel] = (stats.byPriority[item.priorityLevel] || 0) + 1;
    
    // 按来源统计
    stats.bySource[item.source] = (stats.bySource[item.source] || 0) + 1;
    
    // 按教育层次统计
    const eduLevel = item.applicant.educationLevel;
    stats.byEducationLevel[eduLevel] = (stats.byEducationLevel[eduLevel] || 0) + 1;
    
    // 按角色统计
    const role = item.applicant.role;
    stats.byRole[role] = (stats.byRole[role] || 0) + 1;
    
    // 按培训方式统计
    if (item.method) {
      stats.byMethod[item.method] = (stats.byMethod[item.method] || 0) + 1;
    }
    
    // 按培训对象统计
    if (item.targetAudience) {
      stats.byTargetAudience[item.targetAudience] = (stats.byTargetAudience[item.targetAudience] || 0) + 1;
    }
    
    // 预算统计
    if (item.trainingDetails && item.trainingDetails.budget) {
      totalBudget += item.trainingDetails.budget;
    }
    
    // 按预算范围统计
    if (item.budget) {
      stats.budgetAnalysis.byRange[item.budget] = (stats.budgetAnalysis.byRange[item.budget] || 0) + 1;
    }
    
    // 月度趋势统计
    const month = new Date(item.createdAt).toISOString().substring(0, 7);
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });
  
  // 计算预算分析
  stats.budgetAnalysis.total = totalBudget;
  stats.budgetAnalysis.average = trainingData.length > 0 ? Math.round(totalBudget / trainingData.length) : 0;
  
  // 生成月度趋势数据
  stats.monthlyTrend = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));
  
  // 最近活动
  const actions = ['提交培训需求', '更新培训内容', '审批通过', '开始培训', '完成培训', '评估反馈'];
  stats.recentActivity = trainingData
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 15)
    .map(item => ({
      id: item.id,
      title: item.title,
      applicant: item.applicant.name,
      action: randomChoice(actions),
      time: item.updatedAt,
      status: item.status
    }));
  
  return stats;
};

// 导出默认数据集
const DEFAULT_MOCK_TRAINING_DATA = generateAllMockTrainingData();
const DEFAULT_TRAINING_STATS = generateTrainingStats(DEFAULT_MOCK_TRAINING_DATA);

// 培训来源初始化数据
const TRAINING_SOURCE_INIT_DATA = [
  {
    id: 'source-001',
    name: '校内培训中心',
    type: TRAINING_SOURCES.INTERNAL,
    description: '学校内部培训资源，包括各类专业培训和技能提升课程',
    contact: '培训中心',
    phone: '010-12345678',
    email: 'training@school.edu.cn',
    address: '校内培训楼3楼',
    capacity: 200,
    facilities: ['多媒体教室', '实验室', '会议室', '在线平台'],
    specialties: ['教学方法', '管理培训', '技术培训'],
    rating: 4.5,
    isActive: true,
    recentTrainings: [
      '现代教学方法与策略培训',
      '教育信息化技能培训',
      '学校管理能力提升培训'
    ]
  },
  {
    id: 'source-002',
    name: '教育部培训基地',
    type: TRAINING_SOURCES.EXTERNAL,
    description: '教育部指定的教师培训基地，提供高质量的专业培训',
    contact: '基地办公室',
    phone: '010-87654321',
    email: 'base@edu.gov.cn',
    address: '北京市海淀区教育大厦',
    capacity: 500,
    facilities: ['大型会议厅', '分组讨论室', '实训基地'],
    specialties: ['政策解读', '教育改革', '管理创新'],
    rating: 4.8,
    isActive: true,
    recentTrainings: [
      '新课程标准解读培训',
      '教育法律法规培训',
      '师德师风建设培训'
    ]
  },
  {
    id: 'source-003',
    name: '在线教育平台',
    type: TRAINING_SOURCES.ONLINE,
    description: '专业的在线教育培训平台，提供灵活的学习方式',
    contact: '客服中心',
    phone: '400-1234567',
    email: 'support@online-edu.com',
    address: '在线平台',
    capacity: 10000,
    facilities: ['在线直播', '录播课程', '互动讨论', '在线考试'],
    specialties: ['数字化教学', '在线教育', '技术应用'],
    rating: 4.3,
    isActive: true,
    recentTrainings: [
      'AI辅助教学工具应用培训',
      '混合式教学设计培训',
      '在线课程制作培训'
    ]
  },
  {
    id: 'source-004',
    name: '行业协会培训',
    type: TRAINING_SOURCES.CERTIFICATION,
    description: '各行业协会提供的专业认证培训',
    contact: '协会秘书处',
    phone: '010-11223344',
    email: 'cert@association.org',
    address: '行业协会大厦',
    capacity: 100,
    facilities: ['认证考场', '实操室', '资料室'],
    specialties: ['职业认证', '技能鉴定', '行业标准'],
    rating: 4.6,
    isActive: true,
    recentTrainings: [
      '职业生涯规划指导培训',
      '学术诚信规范培训',
      '教育技术应用培训'
    ]
  },
  {
    id: 'source-005',
    name: '企业合作培训',
    type: TRAINING_SOURCES.WORKSHOP,
    description: '与知名企业合作开展的实践性培训项目',
    contact: '合作部',
    phone: '010-55667788',
    email: 'cooperation@company.com',
    address: '企业培训中心',
    capacity: 80,
    facilities: ['实训车间', '模拟环境', '项目室'],
    specialties: ['实践技能', '项目管理', '创新思维'],
    rating: 4.4,
    isActive: true,
    recentTrainings: [
      '虚拟仿真实验教学培训',
      '智慧教室应用培训',
      '项目式学习设计培训'
    ]
  },
  {
    id: 'source-006',
    name: '国际教育交流中心',
    type: TRAINING_SOURCES.EXTERNAL,
    description: '专注于国际教育交流与合作的培训机构',
    contact: '国际部',
    phone: '010-99887766',
    email: 'international@edu-exchange.org',
    address: '国际教育大厦',
    capacity: 150,
    facilities: ['国际会议厅', '同声传译室', '文化交流中心'],
    specialties: ['国际教育', '跨文化交流', '语言培训'],
    rating: 4.7,
    isActive: true,
    recentTrainings: [
      '国际教育交流培训',
      '跨文化教育理念培训',
      '双语教学方法培训'
    ]
  },
  {
    id: 'source-007',
    name: '心理健康教育中心',
    type: TRAINING_SOURCES.INTERNAL,
    description: '专业的心理健康教育培训机构',
    contact: '心理中心',
    phone: '010-44556677',
    email: 'psychology@mental-health.edu.cn',
    address: '心理健康教育楼',
    capacity: 60,
    facilities: ['心理咨询室', '团体活动室', '沙盘游戏室'],
    specialties: ['心理健康', '危机干预', '心理咨询'],
    rating: 4.9,
    isActive: true,
    recentTrainings: [
      '学生心理健康教育培训',
      '学生心理危机干预培训',
      '教师心理调适培训'
    ]
  },
  {
    id: 'source-008',
    name: '安全教育培训基地',
    type: TRAINING_SOURCES.CERTIFICATION,
    description: '专业的校园安全教育培训基地',
    contact: '安全办',
    phone: '010-33445566',
    email: 'safety@security-edu.org',
    address: '安全教育培训基地',
    capacity: 120,
    facilities: ['安全演练场', '消防体验馆', '应急指挥中心'],
    specialties: ['校园安全', '消防安全', '应急管理'],
    rating: 4.5,
    isActive: true,
    recentTrainings: [
      '校园安全管理培训',
      '消防安全知识培训',
      '实验室安全规范培训'
    ]
  }
];

// 生成更多真实的培训需求示例 - 基于新的分类体系，每个分类4条数据
const generateAdditionalTrainingExamples = () => {
  const additionalExamples = [
    // 教学方法与技能 (4条)
    {
      title: '启发式教学方法与课堂互动技巧培训',
      type: TRAINING_TYPES.TEACHING_METHODS,
      description: '掌握启发式教学的核心理念，学会运用提问技巧、讨论引导等方法激发学生思维',
      targetAudience: '全体教师',
      duration: '2天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '项目式学习(PBL)设计与实施培训',
      type: TRAINING_TYPES.TEACHING_METHODS,
      description: '学习项目式学习的设计原则，掌握项目选题、过程指导、成果评价的方法',
      targetAudience: '专业课教师',
      duration: '3天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '差异化教学策略与个性化指导培训',
      type: TRAINING_TYPES.TEACHING_METHODS,
      description: '识别学生学习差异，设计分层教学方案，实施个性化教学指导',
      targetAudience: '中小学教师',
      duration: '2天',
      priority: PRIORITY_LEVELS.MEDIUM
    },
    {
      title: '翻转课堂教学模式设计与实践培训',
      type: TRAINING_TYPES.TEACHING_METHODS,
      description: '掌握翻转课堂的教学设计方法，学会制作微课视频和设计课堂活动',
      targetAudience: '骨干教师',
      duration: '4天',
      priority: PRIORITY_LEVELS.HIGH
    },

    // 学生管理与班级建设 (4条)
    {
      title: '班级文化建设与班风塑造培训',
      type: TRAINING_TYPES.STUDENT_MANAGEMENT,
      description: '学习班级文化建设的理念和方法，掌握营造良好班风的策略和技巧',
      targetAudience: '班主任',
      duration: '2天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '学生心理危机识别与干预培训',
      type: TRAINING_TYPES.STUDENT_MANAGEMENT,
      description: '提升教师识别学生心理问题的能力，掌握心理危机干预的基本方法',
      targetAudience: '班主任、辅导员',
      duration: '3天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '家校沟通技巧与合作策略培训',
      type: TRAINING_TYPES.STUDENT_MANAGEMENT,
      description: '掌握有效的家校沟通方法，建立良好的家校合作关系',
      targetAudience: '班主任、任课教师',
      duration: '1天',
      priority: PRIORITY_LEVELS.MEDIUM
    },
    {
      title: '学生行为管理与正面管教培训',
      type: TRAINING_TYPES.STUDENT_MANAGEMENT,
      description: '学习正面管教的理念和方法，掌握有效的学生行为管理策略',
      targetAudience: '全体教师',
      duration: '2天',
      priority: PRIORITY_LEVELS.MEDIUM
    },

    // 教育技术与信息化 (4条)
    {
      title: '智慧教室设备使用与教学应用培训',
      type: TRAINING_TYPES.EDUCATIONAL_TECH,
      description: '掌握智慧教室各类设备的使用方法，学会设计智慧教学活动',
      targetAudience: '全体教师',
      duration: '2天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '在线教学平台操作与课程设计培训',
      type: TRAINING_TYPES.EDUCATIONAL_TECH,
      description: '熟练使用在线教学平台，掌握在线课程设计和直播教学技巧',
      targetAudience: '任课教师',
      duration: '3天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '多媒体课件制作与教学资源开发培训',
      type: TRAINING_TYPES.EDUCATIONAL_TECH,
      description: '学习PPT、视频、动画等多媒体课件的制作技巧和教学资源开发方法',
      targetAudience: '全体教师',
      duration: '2天',
      priority: PRIORITY_LEVELS.MEDIUM
    },
    {
      title: '教育大数据分析与精准教学培训',
      type: TRAINING_TYPES.EDUCATIONAL_TECH,
      description: '掌握教学数据的收集和分析方法，利用数据驱动教学决策',
      targetAudience: '骨干教师',
      duration: '4天',
      priority: PRIORITY_LEVELS.MEDIUM
    },

    // 专业素养与发展 (4条)
    {
      title: '师德师风建设与职业素养提升培训',
      type: TRAINING_TYPES.PROFESSIONAL_DEV,
      description: '加强师德师风建设，提升教师职业道德修养和专业素养',
      targetAudience: '全体教师',
      duration: '1天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '学科前沿知识更新与教学融合培训',
      type: TRAINING_TYPES.PROFESSIONAL_DEV,
      description: '了解学科最新发展动态，学会将前沿知识融入教学实践',
      targetAudience: '专业教师',
      duration: '3天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '教学反思与专业成长培训',
      type: TRAINING_TYPES.PROFESSIONAL_DEV,
      description: '掌握教学反思的方法，建立专业学习共同体，促进持续成长',
      targetAudience: '青年教师',
      duration: '2天',
      priority: PRIORITY_LEVELS.MEDIUM
    },
    {
      title: '跨学科教学与综合素养培养培训',
      type: TRAINING_TYPES.PROFESSIONAL_DEV,
      description: '学习跨学科教学设计方法，培养学生的综合素养和核心能力',
      targetAudience: '骨干教师',
      duration: '3天',
      priority: PRIORITY_LEVELS.MEDIUM
    },

    // 学校管理与领导力 (4条)
    {
      title: '学校发展战略规划与执行培训',
      type: TRAINING_TYPES.STUDENT_MANAGEMENT,
      description: '掌握学校发展规划的制定方法，提升战略执行和目标管理能力',
      targetAudience: '校级领导',
      duration: '3天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '教师队伍建设与人才培养培训',
      type: TRAINING_TYPES.STUDENT_MANAGEMENT,
      description: '学习教师队伍建设的策略，掌握人才选拔、培养和激励的方法',
      targetAudience: '中层管理干部',
      duration: '2天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '教学质量监控与评估体系建设培训',
      type: TRAINING_TYPES.STUDENT_MANAGEMENT,
      description: '建立科学的教学质量监控体系，掌握质量评估和改进方法',
      targetAudience: '教学管理人员',
      duration: '2天',
      priority: PRIORITY_LEVELS.MEDIUM
    },
    {
      title: '学校文化建设与品牌塑造培训',
      type: TRAINING_TYPES.STUDENT_MANAGEMENT,
      description: '学习学校文化建设的理念和方法，提升学校品牌影响力',
      targetAudience: '管理干部',
      duration: '2天',
      priority: PRIORITY_LEVELS.MEDIUM
    },

    // 课程设计与教学改革 (4条)
    {
      title: '新课程标准解读与教学设计培训',
      type: TRAINING_TYPES.CURRICULUM_DESIGN,
      description: '深入解读新课程标准，掌握基于标准的教学设计方法',
      targetAudience: '学科教师',
      duration: '2天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '校本课程开发与特色课程建设培训',
      type: TRAINING_TYPES.CURRICULUM_DESIGN,
      description: '学习校本课程开发的流程和方法，建设具有学校特色的课程体系',
      targetAudience: '课程开发团队',
      duration: '4天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: 'OBE理念下的课程改革与实践培训',
      type: TRAINING_TYPES.CURRICULUM_DESIGN,
      description: '掌握成果导向教育的理念，设计以学习成果为导向的课程体系',
      targetAudience: '专业负责人',
      duration: '3天',
      priority: PRIORITY_LEVELS.MEDIUM
    },
    {
      title: '综合实践活动课程设计与实施培训',
      type: TRAINING_TYPES.CURRICULUM_DESIGN,
      description: '学习综合实践活动的设计原则，掌握活动组织和评价方法',
      targetAudience: '实践指导教师',
      duration: '3天',
      priority: PRIORITY_LEVELS.MEDIUM
    },

    // 心理健康与德育工作 (4条)
    {
      title: '学生心理健康教育与咨询技能培训',
      type: TRAINING_TYPES.MENTAL_HEALTH,
      description: '掌握心理健康教育的基本理论和咨询技巧，提升心理辅导能力',
      targetAudience: '心理教师、班主任',
      duration: '5天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '德育工作创新与实践培训',
      type: TRAINING_TYPES.MENTAL_HEALTH,
      description: '学习德育工作的新理念和方法，创新德育实践形式',
      targetAudience: '德育工作者',
      duration: '2天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '校园心理危机预防与应急处理培训',
      type: TRAINING_TYPES.MENTAL_HEALTH,
      description: '提升心理危机识别和预防能力，掌握应急处理程序和方法',
      targetAudience: '全体教师',
      duration: '1天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '家庭教育指导与亲子关系建设培训',
      type: TRAINING_TYPES.MENTAL_HEALTH,
      description: '学习家庭教育指导的理论和方法，帮助家长建立良好的亲子关系',
      targetAudience: '班主任、心理教师',
      duration: '2天',
      priority: PRIORITY_LEVELS.MEDIUM
    },

    // 教育科研与创新 (4条)
    {
      title: '教育科研方法与课题申报培训',
      type: TRAINING_TYPES.RESEARCH_INNOVATION,
      description: '掌握教育科研的基本方法，学会课题申报和研究方案设计',
      targetAudience: '骨干教师',
      duration: '3天',
      priority: PRIORITY_LEVELS.HIGH
    },
    {
      title: '教学创新成果培育与推广培训',
      type: TRAINING_TYPES.RESEARCH_INNOVATION,
      description: '学习教学创新成果的培育方法，掌握成果推广和转化策略',
      targetAudience: '教学名师',
      duration: '2天',
      priority: PRIORITY_LEVELS.MEDIUM
    },
    {
      title: '学术论文写作与发表技巧培训',
      type: TRAINING_TYPES.RESEARCH_INNOVATION,
      description: '提升学术论文写作能力，掌握期刊投稿和发表技巧',
      targetAudience: '青年教师',
      duration: '2天',
      priority: PRIORITY_LEVELS.MEDIUM
    },
    {
      title: '教育技术创新应用研究培训',
      type: TRAINING_TYPES.RESEARCH_INNOVATION,
      description: '探索教育技术的创新应用，开展相关研究和实践',
      targetAudience: '信息技术教师',
      duration: '4天',
      priority: PRIORITY_LEVELS.MEDIUM
    }
  ];
  
  return additionalExamples;
};

export {
  generateAllMockTrainingData,
  generateRoleSpecificData,
  generateTrainingStats,
  generateAdditionalTrainingExamples,
  DEFAULT_MOCK_TRAINING_DATA,
  DEFAULT_TRAINING_STATS,
  TRAINING_SOURCE_INIT_DATA
};