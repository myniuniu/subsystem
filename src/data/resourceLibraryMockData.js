// 资源库模拟数据生成器
// 为场景模拟仿真系统生成丰富的资源库数据

import {
  ResourceType,
  ResourceStatus,
  DifficultyLevel,
  ResourceCategory,
  TargetAudience,
  AgeGroup,
  LicenseType,
  ResourceModel,
  ResourceCategoryModel,
  ResourceAuthor,
  ResourceContent,
  ResourceStats
} from '../types/resourceLibrary.js';

// 模拟作者数据
const mockAuthors = [
  new ResourceAuthor({
    id: 'author-001',
    name: '张心理',
    avatar: '/avatars/zhang-xinli.svg',
    title: '高级心理咨询师',
    organization: '北京师范大学心理学院',
    email: 'zhang.xinli@bnu.edu.cn',
    bio: '从事青少年心理健康研究15年，擅长学习焦虑和校园适应问题干预。'
  }),
  new ResourceAuthor({
    id: 'author-002',
    name: '李教育',
    avatar: '/avatars/li-jiaoyu.svg',
    title: '特级教师',
    organization: '清华大学附属中学',
    email: 'li.jiaoyu@tsinghua.edu.cn',
    bio: '30年教学经验，专注差异化教学和课堂管理创新。'
  }),
  new ResourceAuthor({
    id: 'author-003',
    name: '王技术',
    avatar: '/avatars/wang-jishu.svg',
    title: '教育技术专家',
    organization: '华东师范大学',
    email: 'wang.jishu@ecnu.edu.cn',
    bio: '教育信息化领域专家，致力于数字化教学工具的研发与推广。'
  }),
  new ResourceAuthor({
    id: 'author-004',
    name: '陈家庭',
    avatar: '/avatars/chen-jiating.svg',
    title: '家庭治疗师',
    organization: '中科院心理研究所',
    email: 'chen.jiating@psych.ac.cn',
    bio: '系统式家庭治疗专家，专注亲子关系和家庭动力学研究。'
  }),
  new ResourceAuthor({
    id: 'author-005',
    name: '刘管理',
    avatar: '/avatars/liu-guanli.svg',
    title: '校长',
    organization: '上海市实验学校',
    email: 'liu.guanli@shsy.edu.cn',
    bio: '20年学校管理经验，在危机管理和学校治理方面有丰富实践。'
  })
];

// 生成心理健康资源数据
const generateMentalHealthResources = () => [
  new ResourceModel({
    id: 'psych-006',
    title: '注意力缺陷多动障碍(ADHD)识别与支持',
    description: '帮助教师识别ADHD学生特征，提供课堂支持策略和行为管理技巧',
    category: ResourceCategory.MENTAL_HEALTH,
    subcategory: 'adhd_support',
    resourceType: ResourceType.GUIDE,
    author: mockAuthors[0],
    authorId: 'author-001',
    createTime: '2024-01-28',
    updateTime: '2024-01-30',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.MEDIUM,
    duration: '65分钟',
    tags: ['ADHD', '注意力缺陷', '多动症', '特殊需求', '行为管理'],
    keywords: ['注意力训练', '行为干预', '课堂适应', '药物管理', '家校合作'],
    targetAudience: [TargetAudience.TEACHER, TargetAudience.CLASS_TEACHER, TargetAudience.SPECIAL_ED_TEACHER],
    ageGroup: [AgeGroup.ELEMENTARY, AgeGroup.MIDDLE_SCHOOL],
    license: LicenseType.CC_BY,
    content: new ResourceContent({
      mainFile: '/resources/mental-health/adhd-support-guide.pdf',
      attachments: [
        '/resources/mental-health/adhd-checklist.pdf',
        '/resources/mental-health/classroom-strategies.docx',
        '/resources/mental-health/parent-communication-template.pdf'
      ],
      previewUrl: '/resources/mental-health/adhd-support-preview.html',
      thumbnailUrl: '/images/adhd-support-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 1456,
      likes: 89,
      downloads: 234,
      rating: 4.6,
      reviewCount: 42
    }),
    relatedResources: ['psych-004', 'psych-007'],
    learningObjectives: [
      '识别ADHD学生的行为特征',
      '掌握课堂支持策略',
      '了解药物治疗的配合要点',
      '建立有效的家校沟通机制'
    ]
  }),
  
  new ResourceModel({
    id: 'psych-007',
    title: '自闭症谱系障碍学生融合教育指南',
    description: '为普通学校教师提供自闭症学生融合教育的理论基础和实践策略',
    category: ResourceCategory.MENTAL_HEALTH,
    subcategory: 'autism_support',
    resourceType: ResourceType.VIDEO,
    author: mockAuthors[0],
    authorId: 'author-001',
    createTime: '2024-02-01',
    updateTime: '2024-02-01',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.HARD,
    duration: '95分钟',
    tags: ['自闭症', 'ASD', '融合教育', '特殊需求', '社交技能'],
    keywords: ['感统训练', '社交故事', '视觉支持', '结构化教学', '行为分析'],
    targetAudience: [TargetAudience.TEACHER, TargetAudience.SPECIAL_ED_TEACHER, TargetAudience.COUNSELOR],
    ageGroup: [AgeGroup.ELEMENTARY, AgeGroup.MIDDLE_SCHOOL, AgeGroup.HIGH_SCHOOL],
    license: LicenseType.CC_BY_SA,
    content: new ResourceContent({
      mainFile: '/resources/mental-health/autism-inclusion-video.mp4',
      attachments: [
        '/resources/mental-health/autism-assessment-tools.pdf',
        '/resources/mental-health/visual-supports-templates.zip',
        '/resources/mental-health/social-stories-examples.pdf'
      ],
      previewUrl: '/resources/mental-health/autism-inclusion-preview.html',
      thumbnailUrl: '/images/autism-inclusion-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 987,
      likes: 76,
      downloads: 156,
      rating: 4.8,
      reviewCount: 28
    }),
    relatedResources: ['psych-006', 'psych-008'],
    learningObjectives: [
      '理解自闭症谱系障碍的特征',
      '掌握融合教育的基本原则',
      '学会使用视觉支持工具',
      '建立结构化的学习环境'
    ]
  }),
  
  new ResourceModel({
    id: 'psych-008',
    title: '校园心理危机干预应急处理',
    description: '学校心理危机事件的识别、评估和干预流程，包含自杀风险评估工具',
    category: ResourceCategory.MENTAL_HEALTH,
    subcategory: 'crisis_intervention',
    resourceType: ResourceType.TOOL,
    author: mockAuthors[0],
    authorId: 'author-001',
    createTime: '2024-02-05',
    updateTime: '2024-02-08',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.HARD,
    duration: '120分钟',
    tags: ['心理危机', '危机干预', '自杀预防', '应急处理', '风险评估'],
    keywords: ['危机识别', '安全评估', '转介流程', '后续跟进', '团队协作'],
    targetAudience: [TargetAudience.COUNSELOR, TargetAudience.CLASS_TEACHER, TargetAudience.PRINCIPAL],
    ageGroup: [AgeGroup.MIDDLE_SCHOOL, AgeGroup.HIGH_SCHOOL],
    license: LicenseType.CC_BY_NC,
    content: new ResourceContent({
      mainFile: '/resources/mental-health/crisis-intervention-toolkit.zip',
      attachments: [
        '/resources/mental-health/suicide-risk-assessment.pdf',
        '/resources/mental-health/crisis-response-flowchart.pdf',
        '/resources/mental-health/emergency-contacts-template.docx'
      ],
      previewUrl: '/resources/mental-health/crisis-intervention-preview.html',
      thumbnailUrl: '/images/crisis-intervention-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 756,
      likes: 67,
      downloads: 123,
      rating: 4.9,
      reviewCount: 19
    }),
    relatedResources: ['psych-002', 'mgmt-001'],
    learningObjectives: [
      '识别心理危机的预警信号',
      '掌握危机干预的基本步骤',
      '学会使用风险评估工具',
      '建立有效的转介机制'
    ]
  }),
  
  new ResourceModel({
    id: 'psych-009',
    title: '学生情绪调节技能训练',
    description: '帮助学生学习情绪识别、表达和调节的技能，提高情绪管理能力',
    category: ResourceCategory.MENTAL_HEALTH,
    subcategory: 'emotion_regulation',
    resourceType: ResourceType.CASE_STUDY,
    author: mockAuthors[0],
    authorId: 'author-001',
    createTime: '2024-02-10',
    updateTime: '2024-02-10',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.MEDIUM,
    duration: '80分钟',
    tags: ['情绪调节', '情绪管理', '心理技能', '自我调节', '情商培养'],
    keywords: ['情绪识别', '放松技巧', '认知重构', '正念练习', '应对策略'],
    targetAudience: [TargetAudience.COUNSELOR, TargetAudience.CLASS_TEACHER, TargetAudience.TEACHER],
    ageGroup: [AgeGroup.ELEMENTARY, AgeGroup.MIDDLE_SCHOOL, AgeGroup.HIGH_SCHOOL],
    license: LicenseType.CC_BY,
    content: new ResourceContent({
      mainFile: '/resources/mental-health/emotion-regulation-cases.pdf',
      attachments: [
        '/resources/mental-health/emotion-wheel.pdf',
        '/resources/mental-health/relaxation-exercises.mp3',
        '/resources/mental-health/mindfulness-scripts.docx'
      ],
      previewUrl: '/resources/mental-health/emotion-regulation-preview.html',
      thumbnailUrl: '/images/emotion-regulation-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 1234,
      likes: 98,
      downloads: 187,
      rating: 4.7,
      reviewCount: 35
    }),
    relatedResources: ['psych-003', 'psych-010'],
    learningObjectives: [
      '学会识别不同的情绪状态',
      '掌握基本的放松技巧',
      '了解认知与情绪的关系',
      '培养积极的应对策略'
    ]
  }),
  
  new ResourceModel({
    id: 'psych-010',
    title: '校园人际关系与社交技能培养',
    description: '帮助学生建立良好的人际关系，提高社交技能和沟通能力',
    category: ResourceCategory.MENTAL_HEALTH,
    subcategory: 'social_skills',
    resourceType: ResourceType.AUDIO,
    author: mockAuthors[0],
    authorId: 'author-001',
    createTime: '2024-02-12',
    updateTime: '2024-02-12',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.EASY,
    duration: '45分钟',
    tags: ['人际关系', '社交技能', '沟通能力', '友谊建立', '冲突解决'],
    keywords: ['社交焦虑', '沟通技巧', '同伴关系', '团队合作', '冲突管理'],
    targetAudience: [TargetAudience.COUNSELOR, TargetAudience.CLASS_TEACHER],
    ageGroup: [AgeGroup.ELEMENTARY, AgeGroup.MIDDLE_SCHOOL],
    license: LicenseType.CC_BY_SA,
    content: new ResourceContent({
      mainFile: '/resources/mental-health/social-skills-audio.mp3',
      attachments: [
        '/resources/mental-health/social-skills-activities.pdf',
        '/resources/mental-health/communication-games.docx',
        '/resources/mental-health/peer-mediation-guide.pdf'
      ],
      previewUrl: '/resources/mental-health/social-skills-preview.html',
      thumbnailUrl: '/images/social-skills-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 876,
      likes: 65,
      downloads: 134,
      rating: 4.5,
      reviewCount: 23
    }),
    relatedResources: ['psych-002', 'psych-009'],
    learningObjectives: [
      '提高社交沟通技巧',
      '学会建立和维护友谊',
      '掌握冲突解决方法',
      '增强团队合作能力'
    ]
  })
];

// 生成教学资源数据
const generateTeachingResources = () => [
  new ResourceModel({
    id: 'edu-003',
    title: '项目式学习(PBL)设计与实施',
    description: '项目式学习的理论基础、设计原则和实施策略，包含多学科案例',
    category: ResourceCategory.TEACHING_RESOURCES,
    subcategory: 'project_based_learning',
    resourceType: ResourceType.GUIDE,
    author: mockAuthors[1],
    authorId: 'author-002',
    createTime: '2024-02-15',
    updateTime: '2024-02-18',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.MEDIUM,
    duration: '90分钟',
    tags: ['项目式学习', 'PBL', '探究学习', '跨学科', '实践教学'],
    keywords: ['项目设计', '评估标准', '团队协作', '问题解决', '成果展示'],
    targetAudience: [TargetAudience.TEACHER, TargetAudience.SCHOOL_MANAGER],
    ageGroup: [AgeGroup.MIDDLE_SCHOOL, AgeGroup.HIGH_SCHOOL],
    license: LicenseType.CC_BY,
    content: new ResourceContent({
      mainFile: '/resources/teaching/pbl-design-guide.pdf',
      attachments: [
        '/resources/teaching/pbl-project-templates.zip',
        '/resources/teaching/assessment-rubrics.pdf',
        '/resources/teaching/case-studies.pdf'
      ],
      previewUrl: '/resources/teaching/pbl-design-preview.html',
      thumbnailUrl: '/images/pbl-design-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 1567,
      likes: 123,
      downloads: 289,
      rating: 4.7,
      reviewCount: 56
    }),
    relatedResources: ['edu-004', 'edu-005'],
    learningObjectives: [
      '理解项目式学习的核心理念',
      '掌握项目设计的基本步骤',
      '学会制定评估标准',
      '培养学生的综合能力'
    ]
  }),
  
  new ResourceModel({
    id: 'edu-004',
    title: '翻转课堂教学模式实践',
    description: '翻转课堂的设计理念、技术支持和实施经验分享',
    category: ResourceCategory.TEACHING_RESOURCES,
    subcategory: 'flipped_classroom',
    resourceType: ResourceType.VIDEO,
    author: mockAuthors[1],
    authorId: 'author-002',
    createTime: '2024-02-20',
    updateTime: '2024-02-20',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.MEDIUM,
    duration: '75分钟',
    tags: ['翻转课堂', '混合学习', '在线教学', '自主学习', '互动教学'],
    keywords: ['课前预习', '课堂活动', '技术工具', '学习评价', '时间管理'],
    targetAudience: [TargetAudience.TEACHER, TargetAudience.IT_SUPPORT],
    ageGroup: [AgeGroup.MIDDLE_SCHOOL, AgeGroup.HIGH_SCHOOL],
    license: LicenseType.CC_BY_SA,
    content: new ResourceContent({
      mainFile: '/resources/teaching/flipped-classroom-video.mp4',
      attachments: [
        '/resources/teaching/flipped-lesson-plans.docx',
        '/resources/teaching/tech-tools-comparison.pdf',
        '/resources/teaching/student-feedback-forms.pdf'
      ],
      previewUrl: '/resources/teaching/flipped-classroom-preview.html',
      thumbnailUrl: '/images/flipped-classroom-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 1234,
      likes: 89,
      downloads: 198,
      rating: 4.6,
      reviewCount: 41
    }),
    relatedResources: ['edu-003', 'tech-002'],
    learningObjectives: [
      '了解翻转课堂的基本原理',
      '掌握课程设计方法',
      '学会使用相关技术工具',
      '提高学生参与度'
    ]
  }),
  
  new ResourceModel({
    id: 'edu-005',
    title: '多元评价体系构建指南',
    description: '建立多元化、过程性的学生评价体系，促进学生全面发展',
    category: ResourceCategory.TEACHING_RESOURCES,
    subcategory: 'assessment_methods',
    resourceType: ResourceType.DOCUMENT,
    author: mockAuthors[1],
    authorId: 'author-002',
    createTime: '2024-02-25',
    updateTime: '2024-02-25',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.HARD,
    duration: '100分钟',
    tags: ['多元评价', '过程评价', '学生发展', '评价改革', '质量监控'],
    keywords: ['评价标准', '评价工具', '数据分析', '反馈机制', '改进策略'],
    targetAudience: [TargetAudience.TEACHER, TargetAudience.SCHOOL_MANAGER, TargetAudience.PRINCIPAL],
    ageGroup: [AgeGroup.ELEMENTARY, AgeGroup.MIDDLE_SCHOOL, AgeGroup.HIGH_SCHOOL],
    license: LicenseType.CC_BY_NC,
    content: new ResourceContent({
      mainFile: '/resources/teaching/multi-assessment-guide.pdf',
      attachments: [
        '/resources/teaching/assessment-templates.zip',
        '/resources/teaching/rubric-examples.pdf',
        '/resources/teaching/data-analysis-tools.xlsx'
      ],
      previewUrl: '/resources/teaching/multi-assessment-preview.html',
      thumbnailUrl: '/images/multi-assessment-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 987,
      likes: 78,
      downloads: 145,
      rating: 4.8,
      reviewCount: 32
    }),
    relatedResources: ['edu-001', 'edu-006'],
    learningObjectives: [
      '理解多元评价的理念',
      '掌握评价工具的设计',
      '学会数据分析方法',
      '建立有效反馈机制'
    ]
  })
];

// 生成技术培训资源数据
const generateTechnologyResources = () => [
  new ResourceModel({
    id: 'tech-002',
    title: '人工智能在教育中的应用',
    description: 'AI技术在个性化学习、智能评估和教学辅助中的应用案例',
    category: ResourceCategory.TECHNOLOGY_TRAINING,
    subcategory: 'ai_in_education',
    resourceType: ResourceType.GUIDE,
    author: mockAuthors[2],
    authorId: 'author-003',
    createTime: '2024-03-01',
    updateTime: '2024-03-05',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.HARD,
    duration: '110分钟',
    tags: ['人工智能', 'AI教育', '个性化学习', '智能评估', '教育创新'],
    keywords: ['机器学习', '自然语言处理', '学习分析', '智能推荐', '自适应学习'],
    targetAudience: [TargetAudience.TEACHER, TargetAudience.IT_SUPPORT, TargetAudience.SCHOOL_MANAGER],
    ageGroup: [AgeGroup.MIDDLE_SCHOOL, AgeGroup.HIGH_SCHOOL],
    license: LicenseType.CC_BY,
    content: new ResourceContent({
      mainFile: '/resources/technology/ai-in-education-guide.pdf',
      attachments: [
        '/resources/technology/ai-tools-catalog.pdf',
        '/resources/technology/implementation-roadmap.docx',
        '/resources/technology/ethics-guidelines.pdf'
      ],
      previewUrl: '/resources/technology/ai-in-education-preview.html',
      thumbnailUrl: '/images/ai-education-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 1456,
      likes: 112,
      downloads: 234,
      rating: 4.5,
      reviewCount: 48
    }),
    relatedResources: ['tech-001', 'tech-003'],
    learningObjectives: [
      '了解AI在教育中的应用场景',
      '掌握相关工具的使用方法',
      '理解AI教育的伦理问题',
      '制定实施计划'
    ]
  }),
  
  new ResourceModel({
    id: 'tech-003',
    title: '虚拟现实(VR)教学应用实践',
    description: 'VR技术在沉浸式学习、虚拟实验和场景模拟中的教学应用',
    category: ResourceCategory.TECHNOLOGY_TRAINING,
    subcategory: 'vr_ar_education',
    resourceType: ResourceType.VIDEO,
    author: mockAuthors[2],
    authorId: 'author-003',
    createTime: '2024-03-08',
    updateTime: '2024-03-08',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.MEDIUM,
    duration: '85分钟',
    tags: ['虚拟现实', 'VR教学', '沉浸式学习', '虚拟实验', '3D教学'],
    keywords: ['VR设备', '教学内容', '交互设计', '学习效果', '技术支持'],
    targetAudience: [TargetAudience.TEACHER, TargetAudience.IT_SUPPORT],
    ageGroup: [AgeGroup.ELEMENTARY, AgeGroup.MIDDLE_SCHOOL, AgeGroup.HIGH_SCHOOL],
    license: LicenseType.CC_BY_SA,
    content: new ResourceContent({
      mainFile: '/resources/technology/vr-teaching-video.mp4',
      attachments: [
        '/resources/technology/vr-equipment-guide.pdf',
        '/resources/technology/vr-content-resources.zip',
        '/resources/technology/safety-guidelines.pdf'
      ],
      previewUrl: '/resources/technology/vr-teaching-preview.html',
      thumbnailUrl: '/images/vr-teaching-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 1123,
      likes: 87,
      downloads: 167,
      rating: 4.6,
      reviewCount: 34
    }),
    relatedResources: ['tech-002', 'tech-004'],
    learningObjectives: [
      '了解VR教学的优势和局限',
      '掌握VR设备的基本操作',
      '学会设计VR教学活动',
      '评估VR教学效果'
    ]
  })
];

// 生成家庭教育资源数据
const generateFamilyEducationResources = () => [
  new ResourceModel({
    id: 'family-002',
    title: '数字时代的家庭教育挑战',
    description: '帮助家长应对网络时代的教育挑战，建立健康的数字生活习惯',
    category: ResourceCategory.FAMILY_EDUCATION,
    subcategory: 'digital_parenting',
    resourceType: ResourceType.GUIDE,
    author: mockAuthors[3],
    authorId: 'author-004',
    createTime: '2024-03-10',
    updateTime: '2024-03-12',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.MEDIUM,
    duration: '70分钟',
    tags: ['数字教育', '网络安全', '屏幕时间', '数字素养', '家庭规则'],
    keywords: ['网络成瘾', '在线学习', '数字公民', '隐私保护', '平衡生活'],
    targetAudience: [TargetAudience.PARENT, TargetAudience.FAMILY_THERAPIST],
    ageGroup: [AgeGroup.ELEMENTARY, AgeGroup.MIDDLE_SCHOOL, AgeGroup.HIGH_SCHOOL],
    license: LicenseType.CC_BY,
    content: new ResourceContent({
      mainFile: '/resources/family/digital-parenting-guide.pdf',
      attachments: [
        '/resources/family/screen-time-tracker.pdf',
        '/resources/family/family-media-agreement.docx',
        '/resources/family/digital-safety-checklist.pdf'
      ],
      previewUrl: '/resources/family/digital-parenting-preview.html',
      thumbnailUrl: '/images/digital-parenting-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 1789,
      likes: 134,
      downloads: 267,
      rating: 4.7,
      reviewCount: 62
    }),
    relatedResources: ['family-001', 'family-003'],
    learningObjectives: [
      '了解数字时代的教育挑战',
      '制定合理的屏幕时间规则',
      '培养孩子的数字素养',
      '建立健康的数字生活习惯'
    ]
  }),
  
  new ResourceModel({
    id: 'family-003',
    title: '学习型家庭建设指南',
    description: '如何营造家庭学习氛围，培养孩子的学习兴趣和自主学习能力',
    category: ResourceCategory.FAMILY_EDUCATION,
    subcategory: 'learning_family',
    resourceType: ResourceType.AUDIO,
    author: mockAuthors[3],
    authorId: 'author-004',
    createTime: '2024-03-15',
    updateTime: '2024-03-15',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.EASY,
    duration: '60分钟',
    tags: ['学习型家庭', '学习环境', '学习兴趣', '自主学习', '家庭文化'],
    keywords: ['学习空间', '阅读习惯', '学习计划', '激励机制', '家庭活动'],
    targetAudience: [TargetAudience.PARENT, TargetAudience.FAMILY_THERAPIST],
    ageGroup: [AgeGroup.PRESCHOOL, AgeGroup.ELEMENTARY, AgeGroup.MIDDLE_SCHOOL],
    license: LicenseType.CC_BY_NC,
    content: new ResourceContent({
      mainFile: '/resources/family/learning-family-audio.mp3',
      attachments: [
        '/resources/family/learning-environment-checklist.pdf',
        '/resources/family/family-learning-activities.docx',
        '/resources/family/reading-log-template.pdf'
      ],
      previewUrl: '/resources/family/learning-family-preview.html',
      thumbnailUrl: '/images/learning-family-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 1345,
      likes: 98,
      downloads: 189,
      rating: 4.6,
      reviewCount: 45
    }),
    relatedResources: ['family-002', 'family-004'],
    learningObjectives: [
      '营造良好的家庭学习氛围',
      '培养孩子的学习兴趣',
      '建立有效的学习支持系统',
      '促进家庭成员共同成长'
    ]
  })
];

// 生成学校管理资源数据
const generateSchoolManagementResources = () => [
  new ResourceModel({
    id: 'mgmt-002',
    title: '学校文化建设与品牌塑造',
    description: '如何建设积极向上的学校文化，塑造学校品牌形象',
    category: ResourceCategory.SCHOOL_MANAGEMENT,
    subcategory: 'school_culture',
    resourceType: ResourceType.DOCUMENT,
    author: mockAuthors[4],
    authorId: 'author-005',
    createTime: '2024-03-18',
    updateTime: '2024-03-20',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.MEDIUM,
    duration: '95分钟',
    tags: ['学校文化', '品牌建设', '文化传承', '价值观', '学校形象'],
    keywords: ['文化理念', '传统活动', '视觉识别', '宣传推广', '社区关系'],
    targetAudience: [TargetAudience.PRINCIPAL, TargetAudience.VICE_PRINCIPAL, TargetAudience.SCHOOL_MANAGER],
    ageGroup: [AgeGroup.ELEMENTARY, AgeGroup.MIDDLE_SCHOOL, AgeGroup.HIGH_SCHOOL],
    license: LicenseType.CC_BY_SA,
    content: new ResourceContent({
      mainFile: '/resources/management/school-culture-guide.pdf',
      attachments: [
        '/resources/management/culture-assessment-tool.pdf',
        '/resources/management/brand-guidelines.docx',
        '/resources/management/activity-planning-template.pdf'
      ],
      previewUrl: '/resources/management/school-culture-preview.html',
      thumbnailUrl: '/images/school-culture-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 1067,
      likes: 82,
      downloads: 156,
      rating: 4.5,
      reviewCount: 29
    }),
    relatedResources: ['mgmt-001', 'mgmt-003'],
    learningObjectives: [
      '理解学校文化的重要性',
      '掌握文化建设的方法',
      '学会品牌塑造策略',
      '建立文化传承机制'
    ]
  }),
  
  new ResourceModel({
    id: 'mgmt-003',
    title: '教师专业发展规划与管理',
    description: '建立完善的教师专业发展体系，促进教师持续成长',
    category: ResourceCategory.SCHOOL_MANAGEMENT,
    subcategory: 'teacher_development',
    resourceType: ResourceType.TOOL,
    author: mockAuthors[4],
    authorId: 'author-005',
    createTime: '2024-03-22',
    updateTime: '2024-03-22',
    status: ResourceStatus.PUBLISHED,
    difficulty: DifficultyLevel.HARD,
    duration: '105分钟',
    tags: ['教师发展', '专业成长', '培训体系', '评价机制', '激励制度'],
    keywords: ['发展规划', '培训需求', '成长档案', '考核评价', '职业发展'],
    targetAudience: [TargetAudience.PRINCIPAL, TargetAudience.SCHOOL_MANAGER],
    ageGroup: [AgeGroup.ELEMENTARY, AgeGroup.MIDDLE_SCHOOL, AgeGroup.HIGH_SCHOOL],
    license: LicenseType.CC_BY,
    content: new ResourceContent({
      mainFile: '/resources/management/teacher-development-toolkit.zip',
      attachments: [
        '/resources/management/development-plan-template.docx',
        '/resources/management/training-evaluation-form.pdf',
        '/resources/management/growth-portfolio-guide.pdf'
      ],
      previewUrl: '/resources/management/teacher-development-preview.html',
      thumbnailUrl: '/images/teacher-development-thumb.svg'
    }),
    stats: new ResourceStats({
      views: 892,
      likes: 71,
      downloads: 134,
      rating: 4.7,
      reviewCount: 24
    }),
    relatedResources: ['mgmt-002', 'edu-001'],
    learningObjectives: [
      '建立教师发展规划体系',
      '设计有效的培训项目',
      '建立科学的评价机制',
      '营造专业发展文化'
    ]
  })
];

// 生成完整的模拟数据
export const generateMockResourceData = () => {
  const mentalHealthResources = generateMentalHealthResources();
  const teachingResources = generateTeachingResources();
  const technologyResources = generateTechnologyResources();
  const familyEducationResources = generateFamilyEducationResources();
  const schoolManagementResources = generateSchoolManagementResources();

  const allResources = [
    ...mentalHealthResources,
    ...teachingResources,
    ...technologyResources,
    ...familyEducationResources,
    ...schoolManagementResources
  ];

  // 更新分类统计
  const categories = [
    new ResourceCategoryModel({
      id: ResourceCategory.MENTAL_HEALTH,
      name: '心理健康资源库',
      description: '学生心理健康教育、心理问题识别与干预相关资源',
      color: '#52c41a',
      icon: '🧠',
      resourceCount: mentalHealthResources.length,
      subcategories: [
        { id: 'anxiety_management', name: '焦虑管理', count: 1 },
        { id: 'bullying_prevention', name: '霸凌预防', count: 1 },
        { id: 'depression_support', name: '抑郁支持', count: 1 },
        { id: 'learning_support', name: '学习支持', count: 1 },
        { id: 'family_therapy', name: '家庭治疗', count: 1 },
        { id: 'adhd_support', name: 'ADHD支持', count: 1 },
        { id: 'autism_support', name: '自闭症支持', count: 1 },
        { id: 'crisis_intervention', name: '危机干预', count: 1 },
        { id: 'emotion_regulation', name: '情绪调节', count: 1 },
        { id: 'social_skills', name: '社交技能', count: 1 }
      ]
    }),
    new ResourceCategoryModel({
      id: ResourceCategory.TEACHING_RESOURCES,
      name: '教学资源库',
      description: '教学方法、课堂管理、教学技能提升相关资源',
      color: '#1890ff',
      icon: '📚',
      resourceCount: teachingResources.length,
      subcategories: [
        { id: 'differentiated_instruction', name: '差异化教学', count: 1 },
        { id: 'classroom_management', name: '课堂管理', count: 1 },
        { id: 'project_based_learning', name: '项目式学习', count: 1 },
        { id: 'flipped_classroom', name: '翻转课堂', count: 1 },
        { id: 'assessment_methods', name: '评价方法', count: 1 }
      ]
    }),
    new ResourceCategoryModel({
      id: ResourceCategory.TECHNOLOGY_TRAINING,
      name: '技术培训资源库',
      description: '教育技术工具使用、数字化教学相关资源',
      color: '#722ed1',
      icon: '💻',
      resourceCount: technologyResources.length,
      subcategories: [
        { id: 'digital_tools', name: '数字化工具', count: 1 },
        { id: 'ai_in_education', name: 'AI教育应用', count: 1 },
        { id: 'vr_ar_education', name: 'VR/AR教学', count: 1 }
      ]
    }),
    new ResourceCategoryModel({
      id: ResourceCategory.FAMILY_EDUCATION,
      name: '家庭教育资源库',
      description: '家长教育、亲子关系、家庭教育指导相关资源',
      color: '#fa8c16',
      icon: '👨‍👩‍👧‍👦',
      resourceCount: familyEducationResources.length,
      subcategories: [
        { id: 'parent_child_communication', name: '亲子沟通', count: 1 },
        { id: 'digital_parenting', name: '数字时代教育', count: 1 },
        { id: 'learning_family', name: '学习型家庭', count: 1 }
      ]
    }),
    new ResourceCategoryModel({
      id: ResourceCategory.SCHOOL_MANAGEMENT,
      name: '学校管理资源库',
      description: '学校管理、危机处理、制度建设相关资源',
      color: '#eb2f96',
      icon: '🏫',
      resourceCount: schoolManagementResources.length,
      subcategories: [
        { id: 'crisis_management', name: '危机管理', count: 1 },
        { id: 'school_culture', name: '学校文化', count: 1 },
        { id: 'teacher_development', name: '教师发展', count: 1 }
      ]
    })
  ];

  return {
    resources: allResources,
    categories: categories,
    authors: mockAuthors,
    totalCount: allResources.length
  };
};

// 导出模拟数据
export default generateMockResourceData;