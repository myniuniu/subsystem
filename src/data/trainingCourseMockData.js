// 培训课程分类和学习资源模拟数据

// 课程分类枚举
export const CourseCategory = {
  TEACHING_METHODS: 'teaching_methods',
  TECHNOLOGY_INTEGRATION: 'technology_integration',
  STUDENT_MANAGEMENT: 'student_management',
  CURRICULUM_DESIGN: 'curriculum_design',
  ASSESSMENT_EVALUATION: 'assessment_evaluation',
  PROFESSIONAL_DEVELOPMENT: 'professional_development',
  SPECIAL_EDUCATION: 'special_education',
  MENTAL_HEALTH: 'mental_health'
};

// 资源类型枚举
export const ResourceType = {
  COURSE: 'course',
  VIDEO: 'video',
  DOCUMENT: 'document',
  CASE_STUDY: 'case_study',
  TOOL: 'tool',
  ASSESSMENT: 'assessment',
  TEMPLATE: 'template',
  RESEARCH: 'research'
};

// 难度等级
export const DifficultyLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// 培训课程分类数据
export const trainingCategories = [
  {
    id: 'teaching_methods',
    name: '教学方法与策略',
    icon: '📚',
    description: '现代教学方法、教学策略和课堂管理技巧',
    color: '#1890ff',
    resources: [
      {
        id: 'tm_001',
        title: '互动式教学方法实践',
        type: ResourceType.COURSE,
        difficulty: DifficultyLevel.INTERMEDIATE,
        duration: '4小时',
        description: '学习如何运用互动式教学方法提高学生参与度和学习效果',
        tags: ['互动教学', '课堂参与', '教学策略'],
        instructor: '张教授',
        rating: 4.8,
        enrollments: 1250,
        lastUpdated: '2024-01-15'
      },
      {
        id: 'tm_002',
        title: '差异化教学设计指南',
        type: ResourceType.DOCUMENT,
        difficulty: DifficultyLevel.ADVANCED,
        pages: 45,
        description: '针对不同学习需求的学生设计个性化教学方案',
        tags: ['差异化教学', '个性化学习', '教学设计'],
        author: '李专家',
        downloads: 890,
        lastUpdated: '2024-01-20'
      },
      {
        id: 'tm_003',
        title: '课堂管理技巧实战',
        type: ResourceType.VIDEO,
        difficulty: DifficultyLevel.BEGINNER,
        duration: '2.5小时',
        description: '有效的课堂管理策略和学生行为引导技巧',
        tags: ['课堂管理', '学生行为', '教学技巧'],
        instructor: '王老师',
        views: 3200,
        likes: 456,
        lastUpdated: '2024-01-10'
      },
      {
        id: 'tm_004',
        title: '小组合作学习案例分析',
        type: ResourceType.CASE_STUDY,
        difficulty: DifficultyLevel.INTERMEDIATE,
        cases: 8,
        description: '成功的小组合作学习实施案例和经验分享',
        tags: ['合作学习', '小组活动', '案例分析'],
        school: '实验中学',
        grade: '初中',
        lastUpdated: '2024-01-12'
      }
    ]
  },
  {
    id: 'technology_integration',
    name: '教育技术应用',
    icon: '💻',
    description: '现代教育技术工具的应用和数字化教学实践',
    color: '#52c41a',
    resources: [
      {
        id: 'ti_001',
        title: '多媒体教学工具使用指南',
        type: ResourceType.COURSE,
        difficulty: DifficultyLevel.BEGINNER,
        duration: '3小时',
        description: '掌握常用多媒体教学工具的使用方法和教学应用',
        tags: ['多媒体教学', '教学工具', '技术应用'],
        instructor: '陈老师',
        rating: 4.6,
        enrollments: 2100,
        lastUpdated: '2024-01-18'
      },
      {
        id: 'ti_002',
        title: '在线教学平台操作手册',
        type: ResourceType.DOCUMENT,
        difficulty: DifficultyLevel.INTERMEDIATE,
        pages: 32,
        description: '详细介绍主流在线教学平台的功能和使用技巧',
        tags: ['在线教学', '教学平台', '远程教育'],
        author: '技术团队',
        downloads: 1560,
        lastUpdated: '2024-01-22'
      },
      {
        id: 'ti_003',
        title: 'AI辅助教学工具应用',
        type: ResourceType.VIDEO,
        difficulty: DifficultyLevel.ADVANCED,
        duration: '1.8小时',
        description: '探索人工智能在教学中的应用和未来发展趋势',
        tags: ['AI教学', '人工智能', '教育创新'],
        instructor: '刘博士',
        views: 1800,
        likes: 320,
        lastUpdated: '2024-01-25'
      },
      {
        id: 'ti_004',
        title: '数字化课堂建设方案',
        type: ResourceType.TEMPLATE,
        difficulty: DifficultyLevel.INTERMEDIATE,
        templates: 5,
        description: '数字化课堂环境建设的完整方案和实施模板',
        tags: ['数字化课堂', '环境建设', '实施方案'],
        organization: '教育技术中心',
        usage: 450,
        lastUpdated: '2024-01-20'
      }
    ]
  },
  {
    id: 'student_management',
    name: '学生管理与发展',
    icon: '👥',
    description: '学生行为管理、心理健康和全面发展指导',
    color: '#fa8c16',
    resources: [
      {
        id: 'sm_001',
        title: '学生心理健康教育',
        type: ResourceType.COURSE,
        difficulty: DifficultyLevel.INTERMEDIATE,
        duration: '6小时',
        description: '识别和应对学生心理问题，促进学生心理健康发展',
        tags: ['心理健康', '学生发展', '心理教育'],
        instructor: '心理专家',
        rating: 4.9,
        enrollments: 980,
        lastUpdated: '2024-01-16'
      },
      {
        id: 'sm_002',
        title: '班级管理实用手册',
        type: ResourceType.DOCUMENT,
        difficulty: DifficultyLevel.BEGINNER,
        pages: 28,
        description: '班主任工作指南和班级管理的实用技巧',
        tags: ['班级管理', '班主任工作', '学生管理'],
        author: '优秀班主任团队',
        downloads: 2200,
        lastUpdated: '2024-01-14'
      },
      {
        id: 'sm_003',
        title: '学生激励与评价策略',
        type: ResourceType.VIDEO,
        difficulty: DifficultyLevel.INTERMEDIATE,
        duration: '2小时',
        description: '有效的学生激励方法和多元化评价策略',
        tags: ['学生激励', '评价策略', '正面引导'],
        instructor: '教育心理学家',
        views: 2800,
        likes: 520,
        lastUpdated: '2024-01-19'
      }
    ]
  },
  {
    id: 'curriculum_design',
    name: '课程设计与开发',
    icon: '📋',
    description: '课程设计理论、教学大纲制定和课程评估',
    color: '#722ed1',
    resources: [
      {
        id: 'cd_001',
        title: '基于核心素养的课程设计',
        type: ResourceType.COURSE,
        difficulty: DifficultyLevel.ADVANCED,
        duration: '5小时',
        description: '以核心素养为导向的课程设计理念和实践方法',
        tags: ['核心素养', '课程设计', '教育理念'],
        instructor: '课程专家',
        rating: 4.7,
        enrollments: 750,
        lastUpdated: '2024-01-21'
      },
      {
        id: 'cd_002',
        title: '教学目标设定与评估',
        type: ResourceType.DOCUMENT,
        difficulty: DifficultyLevel.INTERMEDIATE,
        pages: 38,
        description: '科学设定教学目标和建立有效的评估体系',
        tags: ['教学目标', '课程评估', '教学设计'],
        author: '教学设计团队',
        downloads: 1100,
        lastUpdated: '2024-01-17'
      },
      {
        id: 'cd_003',
        title: '跨学科课程整合案例',
        type: ResourceType.CASE_STUDY,
        difficulty: DifficultyLevel.ADVANCED,
        cases: 12,
        description: '跨学科课程整合的成功案例和实施经验',
        tags: ['跨学科教学', '课程整合', '综合实践'],
        school: '示范学校',
        grade: '高中',
        lastUpdated: '2024-01-23'
      }
    ]
  },
  {
    id: 'assessment_evaluation',
    name: '评估与测评',
    icon: '📊',
    description: '学习评估方法、测试设计和数据分析',
    color: '#13c2c2',
    resources: [
      {
        id: 'ae_001',
        title: '形成性评估设计与实施',
        type: ResourceType.COURSE,
        difficulty: DifficultyLevel.INTERMEDIATE,
        duration: '3.5小时',
        description: '设计和实施有效的形成性评估策略',
        tags: ['形成性评估', '评估设计', '学习反馈'],
        instructor: '评估专家',
        rating: 4.5,
        enrollments: 1350,
        lastUpdated: '2024-01-13'
      },
      {
        id: 'ae_002',
        title: '学习数据分析工具',
        type: ResourceType.TOOL,
        difficulty: DifficultyLevel.ADVANCED,
        features: 15,
        description: '用于分析学生学习数据的专业工具和方法',
        tags: ['数据分析', '学习分析', '教育统计'],
        developer: '教育数据团队',
        downloads: 680,
        lastUpdated: '2024-01-24'
      },
      {
        id: 'ae_003',
        title: '多元化评价体系构建',
        type: ResourceType.RESEARCH,
        difficulty: DifficultyLevel.ADVANCED,
        pages: 55,
        description: '构建多元化、综合性的学生评价体系研究报告',
        tags: ['多元评价', '评价体系', '教育研究'],
        researchers: '教育评价研究所',
        citations: 120,
        lastUpdated: '2024-01-11'
      }
    ]
  },
  {
    id: 'professional_development',
    name: '教师专业发展',
    icon: '🎓',
    description: '教师职业规划、专业能力提升和终身学习',
    color: '#eb2f96',
    resources: [
      {
        id: 'pd_001',
        title: '教师职业生涯规划',
        type: ResourceType.COURSE,
        difficulty: DifficultyLevel.BEGINNER,
        duration: '2.5小时',
        description: '帮助教师制定个人职业发展规划和目标',
        tags: ['职业规划', '专业发展', '教师成长'],
        instructor: '职业规划师',
        rating: 4.4,
        enrollments: 1800,
        lastUpdated: '2024-01-09'
      },
      {
        id: 'pd_002',
        title: '教学反思与改进方法',
        type: ResourceType.DOCUMENT,
        difficulty: DifficultyLevel.INTERMEDIATE,
        pages: 25,
        description: '系统的教学反思方法和持续改进策略',
        tags: ['教学反思', '持续改进', '专业成长'],
        author: '资深教师',
        downloads: 1650,
        lastUpdated: '2024-01-26'
      },
      {
        id: 'pd_003',
        title: '教师学习共同体建设',
        type: ResourceType.VIDEO,
        difficulty: DifficultyLevel.INTERMEDIATE,
        duration: '1.5小时',
        description: '建立和参与教师学习共同体的方法和经验',
        tags: ['学习共同体', '协作学习', '专业交流'],
        instructor: '教育管理专家',
        views: 2100,
        likes: 380,
        lastUpdated: '2024-01-08'
      }
    ]
  }
];

// 获取所有资源的扁平化列表
export const getAllResources = () => {
  return trainingCategories.reduce((acc, category) => {
    return acc.concat(category.resources.map(resource => ({
      ...resource,
      categoryId: category.id,
      categoryName: category.name,
      categoryIcon: category.icon
    })));
  }, []);
};

// 根据类型筛选资源
export const getResourcesByType = (type) => {
  return getAllResources().filter(resource => resource.type === type);
};

// 根据难度筛选资源
export const getResourcesByDifficulty = (difficulty) => {
  return getAllResources().filter(resource => resource.difficulty === difficulty);
};

// 搜索资源
export const searchResources = (query) => {
  const allResources = getAllResources();
  const lowerQuery = query.toLowerCase();
  
  return allResources.filter(resource => 
    resource.title.toLowerCase().includes(lowerQuery) ||
    resource.description.toLowerCase().includes(lowerQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// 获取热门资源
export const getPopularResources = (limit = 10) => {
  return getAllResources()
    .sort((a, b) => {
      const scoreA = (a.enrollments || a.views || a.downloads || 0) + (a.rating || 0) * 100;
      const scoreB = (b.enrollments || b.views || b.downloads || 0) + (b.rating || 0) * 100;
      return scoreB - scoreA;
    })
    .slice(0, limit);
};

// 获取统计信息
export const getTrainingStats = () => {
  const allResources = getAllResources();
  
  return {
    totalCategories: trainingCategories.length,
    totalResources: allResources.length,
    resourcesByType: {
      [ResourceType.COURSE]: getResourcesByType(ResourceType.COURSE).length,
      [ResourceType.VIDEO]: getResourcesByType(ResourceType.VIDEO).length,
      [ResourceType.DOCUMENT]: getResourcesByType(ResourceType.DOCUMENT).length,
      [ResourceType.CASE_STUDY]: getResourcesByType(ResourceType.CASE_STUDY).length,
      [ResourceType.TOOL]: getResourcesByType(ResourceType.TOOL).length,
      [ResourceType.ASSESSMENT]: getResourcesByType(ResourceType.ASSESSMENT).length,
      [ResourceType.TEMPLATE]: getResourcesByType(ResourceType.TEMPLATE).length,
      [ResourceType.RESEARCH]: getResourcesByType(ResourceType.RESEARCH).length
    },
    resourcesByDifficulty: {
      [DifficultyLevel.BEGINNER]: getResourcesByDifficulty(DifficultyLevel.BEGINNER).length,
      [DifficultyLevel.INTERMEDIATE]: getResourcesByDifficulty(DifficultyLevel.INTERMEDIATE).length,
      [DifficultyLevel.ADVANCED]: getResourcesByDifficulty(DifficultyLevel.ADVANCED).length
    }
  };
};