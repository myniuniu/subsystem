/**
 * 培训数据模板
 * 针对高教、职教、基教的不同角色定义培训需求模板
 */

// 教育层次定义
export const EDUCATION_LEVELS = {
  HIGHER_ED: 'higher_education',    // 高等教育
  VOCATIONAL: 'vocational',         // 职业教育
  BASIC_ED: 'basic_education'       // 基础教育
};

// 角色定义
export const ROLES = {
  // 通用角色
  TEACHER: 'teacher',               // 教师
  CLASS_TEACHER: 'class_teacher',   // 班主任
  COUNSELOR: 'counselor',           // 辅导员
  
  // 管理角色
  PRINCIPAL: 'principal',           // 校长
  DEAN: 'dean',                     // 院长/系主任
  DEPARTMENT_HEAD: 'department_head', // 教研室主任
  
  // 专业角色
  LIBRARIAN: 'librarian',           // 图书管理员
  IT_SUPPORT: 'it_support',         // 技术支持
  ADMIN_STAFF: 'admin_staff'        // 行政人员
};

// 培训类型定义 - 基于高教、职教、基教的实际需求
export const TRAINING_TYPES = {
  TEACHING_METHODS: 'teaching_methods',     // 教学方法与技能
  STUDENT_MANAGEMENT: 'student_management', // 学生管理与班级建设
  EDUCATIONAL_TECH: 'educational_tech',     // 教育技术与信息化
  PROFESSIONAL_DEV: 'professional_dev',     // 专业素养与发展
  SCHOOL_MANAGEMENT: 'school_management',   // 学校管理与领导力
  CURRICULUM_DESIGN: 'curriculum_design',   // 课程设计与教学改革
  MENTAL_HEALTH: 'mental_health',           // 心理健康与德育工作
  RESEARCH_INNOVATION: 'research_innovation' // 教育科研与创新
};

// 培训来源定义
export const TRAINING_SOURCES = {
  INTERNAL: 'internal',             // 内部培训
  EXTERNAL: 'external',             // 外部培训
  ONLINE: 'online',                 // 在线培训
  CONFERENCE: 'conference',         // 会议培训
  WORKSHOP: 'workshop',             // 工作坊
  CERTIFICATION: 'certification',   // 认证培训
  MENTORING: 'mentoring',           // 导师指导
  SELF_STUDY: 'self_study'          // 自主学习
};

// 优先级定义
export const PRIORITY_LEVELS = {
  URGENT: 'urgent',                 // 紧急
  HIGH: 'high',                     // 高
  MEDIUM: 'medium',                 // 中
  LOW: 'low'                        // 低
};

// 培训状态定义
export const TRAINING_STATUS = {
  PLANNED: 'planned',               // 计划中
  APPROVED: 'approved',             // 已批准
  IN_PROGRESS: 'in_progress',       // 进行中
  COMPLETED: 'completed',           // 已完成
  CANCELLED: 'cancelled',           // 已取消
  POSTPONED: 'postponed'            // 已延期
};

// 高等教育培训模板
export const HIGHER_EDUCATION_TEMPLATES = {
  [ROLES.TEACHER]: {
    commonTrainings: [
      {
        title: '高等教育教学方法创新',
        type: TRAINING_TYPES.TEACHING_METHODS,
        description: '探索现代高等教育教学方法，提升课堂教学效果',
        duration: '40学时',
        priority: PRIORITY_LEVELS.HIGH,
        source: TRAINING_SOURCES.WORKSHOP,
        tags: ['教学方法', '课堂创新', '学生参与']
      },
      {
        title: '科研能力提升培训',
        type: TRAINING_TYPES.RESEARCH_INNOVATION,
        description: '提升教师科研水平，包括项目申报、论文写作等',
        duration: '60学时',
        priority: PRIORITY_LEVELS.HIGH,
        source: TRAINING_SOURCES.EXTERNAL,
        tags: ['科研方法', '项目申报', '学术写作']
      },
      {
        title: '数字化教学工具应用',
        type: TRAINING_TYPES.EDUCATIONAL_TECH,
        description: '掌握现代教育技术工具，提升数字化教学能力',
        duration: '30学时',
        priority: PRIORITY_LEVELS.MEDIUM,
        source: TRAINING_SOURCES.ONLINE,
        tags: ['教育技术', '在线教学', '数字工具']
      }
    ]
  },
  [ROLES.COUNSELOR]: {
    commonTrainings: [
      {
        title: '大学生心理健康教育',
        type: TRAINING_TYPES.MENTAL_HEALTH,
        description: '提升辅导员心理健康教育和危机干预能力',
        duration: '50学时',
        priority: PRIORITY_LEVELS.HIGH,
        source: TRAINING_SOURCES.CERTIFICATION,
        tags: ['心理健康', '危机干预', '学生工作']
      },
      {
        title: '学生事务管理实务',
        type: TRAINING_TYPES.STUDENT_MANAGEMENT,
        description: '学生日常事务管理、突发事件处理等实务技能',
        duration: '40学时',
        priority: PRIORITY_LEVELS.HIGH,
        source: TRAINING_SOURCES.INTERNAL,
        tags: ['学生管理', '事务处理', '应急处理']
      }
    ]
  }
};

// 职业教育培训模板
export const VOCATIONAL_EDUCATION_TEMPLATES = {
  [ROLES.TEACHER]: {
    commonTrainings: [
      {
        title: '产教融合教学模式',
        type: TRAINING_TYPES.TEACHING_METHODS,
        description: '掌握职业教育产教融合的教学理念和实践方法',
        duration: '45学时',
        priority: PRIORITY_LEVELS.HIGH,
        source: TRAINING_SOURCES.WORKSHOP,
        tags: ['产教融合', '实践教学', '校企合作']
      },
      {
        title: '职业技能等级认定',
        type: TRAINING_TYPES.PROFESSIONAL_DEV,
        description: '获得相关职业技能等级认定资格，提升专业水平',
        duration: '80学时',
        priority: PRIORITY_LEVELS.HIGH,
        source: TRAINING_SOURCES.EXTERNAL,
        tags: ['技能认定', '专业资格', '行业标准']
      },
      {
        title: '双师型教师能力建设',
        type: TRAINING_TYPES.PROFESSIONAL_DEV,
        description: '提升理论教学和实践指导的双重能力',
        duration: '60学时',
        priority: PRIORITY_LEVELS.MEDIUM,
        source: TRAINING_SOURCES.MENTORING,
        tags: ['双师型', '实践能力', '理论结合']
      }
    ]
  },
  [ROLES.CLASS_TEACHER]: {
    commonTrainings: [
      {
        title: '职业生涯规划指导',
        type: TRAINING_TYPES.STUDENT_MANAGEMENT,
        description: '帮助学生进行职业生涯规划和就业指导',
        duration: '35学时',
        priority: PRIORITY_LEVELS.HIGH,
        source: TRAINING_SOURCES.CERTIFICATION,
        tags: ['职业规划', '就业指导', '生涯教育']
      }
    ]
  }
};

// 基础教育培训模板
export const BASIC_EDUCATION_TEMPLATES = {
  [ROLES.TEACHER]: {
    commonTrainings: [
      {
        title: '新课程标准解读与实施',
        type: TRAINING_TYPES.CURRICULUM_DESIGN,
        description: '深入理解新课程标准，提升课程实施能力',
        duration: '40学时',
        priority: PRIORITY_LEVELS.HIGH,
        source: TRAINING_SOURCES.INTERNAL,
        tags: ['课程标准', '教学改革', '素质教育']
      },
      {
        title: '差异化教学策略',
        type: TRAINING_TYPES.TEACHING_METHODS,
        description: '针对不同学习需求学生的个性化教学方法',
        duration: '30学时',
        priority: PRIORITY_LEVELS.MEDIUM,
        source: TRAINING_SOURCES.WORKSHOP,
        tags: ['差异化教学', '个性化', '因材施教']
      },
      {
        title: '信息技术与学科融合',
        type: TRAINING_TYPES.EDUCATIONAL_TECH,
        description: '将信息技术有效融入学科教学中',
        duration: '35学时',
        priority: PRIORITY_LEVELS.MEDIUM,
        source: TRAINING_SOURCES.ONLINE,
        tags: ['信息技术', '学科融合', '智慧课堂']
      }
    ]
  },
  [ROLES.CLASS_TEACHER]: {
    commonTrainings: [
      {
        title: '班级管理与学生发展',
        type: TRAINING_TYPES.STUDENT_MANAGEMENT,
        description: '提升班级管理效能，促进学生全面发展',
        duration: '40学时',
        priority: PRIORITY_LEVELS.HIGH,
        source: TRAINING_SOURCES.INTERNAL,
        tags: ['班级管理', '学生发展', '德育工作']
      },
      {
        title: '家校沟通技巧',
        type: TRAINING_TYPES.STUDENT_MANAGEMENT,
        description: '改善家校沟通，建立良好的家校合作关系',
        duration: '25学时',
        priority: PRIORITY_LEVELS.MEDIUM,
        source: TRAINING_SOURCES.WORKSHOP,
        tags: ['家校沟通', '家长工作', '协同育人']
      }
    ]
  },
  [ROLES.PRINCIPAL]: {
    commonTrainings: [
      {
        title: '学校发展规划与管理',
        type: TRAINING_TYPES.STUDENT_MANAGEMENT,
        description: '制定学校发展战略，提升学校管理水平',
        duration: '60学时',
        priority: PRIORITY_LEVELS.HIGH,
        source: TRAINING_SOURCES.EXTERNAL,
        tags: ['学校管理', '发展规划', '战略思维']
      },
      {
        title: '教育法律法规培训',
        type: TRAINING_TYPES.POLICY_COMPLIANCE,
        description: '了解教育相关法律法规，规范办学行为',
        duration: '30学时',
        priority: PRIORITY_LEVELS.HIGH,
        source: TRAINING_SOURCES.INTERNAL,
        tags: ['法律法规', '合规办学', '风险防控']
      }
    ]
  }
};

// 获取角色培训模板
export const getRoleTrainingTemplates = (educationLevel, role) => {
  const templates = {
    [EDUCATION_LEVELS.HIGHER_ED]: HIGHER_EDUCATION_TEMPLATES,
    [EDUCATION_LEVELS.VOCATIONAL]: VOCATIONAL_EDUCATION_TEMPLATES,
    [EDUCATION_LEVELS.BASIC_ED]: BASIC_EDUCATION_TEMPLATES
  };
  
  return templates[educationLevel]?.[role]?.commonTrainings || [];
};

// 获取所有培训来源选项
export const getTrainingSourceOptions = () => {
  return Object.entries(TRAINING_SOURCES).map(([key, value]) => ({
    value,
    label: getTrainingSourceLabel(value)
  }));
};

// 获取培训来源标签
export const getTrainingSourceLabel = (source) => {
  const labels = {
    [TRAINING_SOURCES.INTERNAL]: '内部培训',
    [TRAINING_SOURCES.EXTERNAL]: '外部培训',
    [TRAINING_SOURCES.ONLINE]: '在线培训',
    [TRAINING_SOURCES.CONFERENCE]: '会议培训',
    [TRAINING_SOURCES.WORKSHOP]: '工作坊',
    [TRAINING_SOURCES.CERTIFICATION]: '认证培训',
    [TRAINING_SOURCES.MENTORING]: '导师指导',
    [TRAINING_SOURCES.SELF_STUDY]: '自主学习'
  };
  return labels[source] || source;
};

// 获取角色标签
export const getRoleLabel = (role) => {
  const labels = {
    [ROLES.TEACHER]: '教师',
    [ROLES.CLASS_TEACHER]: '班主任',
    [ROLES.COUNSELOR]: '辅导员',
    [ROLES.PRINCIPAL]: '校长',
    [ROLES.DEAN]: '院长/系主任',
    [ROLES.DEPARTMENT_HEAD]: '教研室主任',
    [ROLES.LIBRARIAN]: '图书管理员',
    [ROLES.IT_SUPPORT]: '技术支持',
    [ROLES.ADMIN_STAFF]: '行政人员'
  };
  return labels[role] || role;
};

// 获取教育层次标签
export const getEducationLevelLabel = (level) => {
  const labels = {
    [EDUCATION_LEVELS.HIGHER_ED]: '高等教育',
    [EDUCATION_LEVELS.VOCATIONAL]: '职业教育',
    [EDUCATION_LEVELS.BASIC_ED]: '基础教育'
  };
  return labels[level] || level;
};