// 资源库服务
// 提供资源的分类管理、检索和访问功能

// 资源库数据存储
let resourceStorage = {
  resources: [
    // 心理健康资源库
    {
      id: 'psych-001',
      title: '学生考试焦虑干预指南',
      description: '针对学生考试焦虑问题的系统性干预方法和实践案例',
      category: 'mental_health',
      subcategory: 'anxiety_management',
      resourceType: 'guide', // guide, video, audio, document, tool, case_study
      author: '心理健康专家组',
      authorId: 'expert-001',
      createTime: '2024-01-10',
      updateTime: '2024-01-15',
      status: 'published',
      views: 1245,
      likes: 89,
      downloads: 156,
      difficulty: 'medium',
      duration: '45分钟',
      tags: ['考试焦虑', '心理干预', '学生心理', '认知行为疗法'],
      thumbnail: '/images/anxiety-guide-thumb.svg',
      rating: 4.7,
      reviewCount: 32,
      targetAudience: ['心理咨询师', '班主任', '学校心理老师'],
      ageGroup: ['初中生', '高中生'],
      license: 'CC BY-NC 4.0',
      content: {
        mainFile: '/resources/mental-health/anxiety-guide.pdf',
        attachments: [
          '/resources/mental-health/anxiety-assessment-scale.pdf',
          '/resources/mental-health/intervention-worksheet.docx'
        ],
        previewUrl: '/resources/mental-health/anxiety-guide-preview.html'
      },
      keywords: ['焦虑症状识别', '放松训练', '认知重构', '应对策略'],
      relatedResources: ['psych-002', 'psych-015']
    },
    {
      id: 'psych-002',
      title: '校园霸凌预防与干预手册',
      description: '全面的校园霸凌识别、预防和干预策略，包含实际案例分析',
      category: 'mental_health',
      subcategory: 'bullying_prevention',
      resourceType: 'guide',
      author: '学校心理健康研究中心',
      authorId: 'center-001',
      createTime: '2024-01-05',
      updateTime: '2024-01-20',
      status: 'published',
      views: 2156,
      likes: 145,
      downloads: 298,
      difficulty: 'medium',
      duration: '60分钟',
      tags: ['校园霸凌', '预防干预', '学生安全', '心理创伤'],
      thumbnail: '/images/bullying-prevention-thumb.svg',
      rating: 4.8,
      reviewCount: 67,
      targetAudience: ['班主任', '心理咨询师', '学校管理者', '家长'],
      ageGroup: ['小学生', '初中生', '高中生'],
      license: 'CC BY-SA 4.0',
      content: {
        mainFile: '/resources/mental-health/bullying-prevention-handbook.pdf',
        attachments: [
          '/resources/mental-health/bullying-identification-checklist.pdf',
          '/resources/mental-health/intervention-protocol.pdf',
          '/resources/mental-health/parent-communication-guide.pdf'
        ],
        previewUrl: '/resources/mental-health/bullying-prevention-preview.html'
      },
      keywords: ['霸凌识别', '受害者支持', '施暴者教育', '环境改善'],
      relatedResources: ['psych-003', 'psych-008']
    },
    {
      id: 'psych-003',
      title: '青少年抑郁症识别与支持',
      description: '帮助教育工作者识别青少年抑郁症状并提供适当支持的专业指南',
      category: 'mental_health',
      subcategory: 'depression_support',
      resourceType: 'video',
      author: '临床心理学专家',
      authorId: 'expert-002',
      createTime: '2024-01-12',
      updateTime: '2024-01-12',
      status: 'published',
      views: 987,
      likes: 76,
      downloads: 123,
      difficulty: 'hard',
      duration: '90分钟',
      tags: ['青少年抑郁', '症状识别', '心理支持', '危机干预'],
      thumbnail: '/images/depression-support-thumb.svg',
      rating: 4.6,
      reviewCount: 28,
      targetAudience: ['心理咨询师', '班主任', '学校心理老师'],
      ageGroup: ['初中生', '高中生'],
      license: 'CC BY 4.0',
      content: {
        mainFile: '/resources/mental-health/depression-recognition-video.mp4',
        attachments: [
          '/resources/mental-health/depression-screening-tool.pdf',
          '/resources/mental-health/support-strategies.pdf'
        ],
        previewUrl: '/resources/mental-health/depression-support-preview.html'
      },
      keywords: ['抑郁症状', '情绪识别', '支持网络', '专业转介'],
      relatedResources: ['psych-004', 'psych-009']
    },
    {
      id: 'psych-004',
      title: '学习困难学生心理辅导',
      description: '针对学习困难学生的心理特点和需求，提供个性化辅导策略',
      category: 'mental_health',
      subcategory: 'learning_support',
      resourceType: 'case_study',
      author: '特殊教育专家',
      authorId: 'expert-003',
      createTime: '2024-01-18',
      updateTime: '2024-01-18',
      status: 'published',
      views: 756,
      likes: 58,
      downloads: 89,
      difficulty: 'medium',
      duration: '50分钟',
      tags: ['学习困难', '心理辅导', '个性化支持', '自信建立'],
      thumbnail: '/images/learning-support-thumb.svg',
      rating: 4.5,
      reviewCount: 19,
      targetAudience: ['特殊教育老师', '心理咨询师', '班主任'],
      ageGroup: ['小学生', '初中生'],
      license: 'CC BY-NC-SA 4.0',
      content: {
        mainFile: '/resources/mental-health/learning-difficulties-cases.pdf',
        attachments: [
          '/resources/mental-health/assessment-tools.pdf',
          '/resources/mental-health/intervention-plans.docx'
        ],
        previewUrl: '/resources/mental-health/learning-support-preview.html'
      },
      keywords: ['学习障碍', '自尊建立', '动机激发', '家校合作'],
      relatedResources: ['psych-005', 'edu-002']
    },
    {
      id: 'psych-005',
      title: '家庭心理健康教育资源包',
      description: '为家长提供的心理健康教育资源，包含亲子沟通技巧和家庭治疗方法',
      category: 'mental_health',
      subcategory: 'family_therapy',
      resourceType: 'tool',
      author: '家庭治疗师协会',
      authorId: 'association-001',
      createTime: '2024-01-22',
      updateTime: '2024-01-25',
      status: 'published',
      views: 1456,
      likes: 112,
      downloads: 234,
      difficulty: 'easy',
      duration: '30分钟',
      tags: ['家庭教育', '亲子沟通', '心理健康', '家庭治疗'],
      thumbnail: '/images/family-mental-health-thumb.svg',
      rating: 4.7,
      reviewCount: 45,
      targetAudience: ['家长', '家庭治疗师', '社工'],
      ageGroup: ['幼儿', '小学生', '初中生', '高中生'],
      license: 'CC BY 4.0',
      content: {
        mainFile: '/resources/mental-health/family-mental-health-toolkit.zip',
        attachments: [
          '/resources/mental-health/communication-exercises.pdf',
          '/resources/mental-health/family-assessment-form.pdf'
        ],
        previewUrl: '/resources/mental-health/family-toolkit-preview.html'
      },
      keywords: ['亲子关系', '沟通技巧', '情绪管理', '家庭动力'],
      relatedResources: ['psych-006', 'family-001']
    },

    // 教学资源库
    {
      id: 'edu-001',
      title: '差异化教学策略实施指南',
      description: '针对不同学习需求学生的差异化教学方法和实践案例',
      category: 'teaching_resources',
      subcategory: 'differentiated_instruction',
      resourceType: 'guide',
      author: '教学研究专家',
      authorId: 'expert-004',
      createTime: '2024-01-08',
      updateTime: '2024-01-15',
      status: 'published',
      views: 1876,
      likes: 134,
      downloads: 267,
      difficulty: 'medium',
      duration: '75分钟',
      tags: ['差异化教学', '个性化学习', '教学策略', '学习需求'],
      thumbnail: '/images/differentiated-teaching-thumb.svg',
      rating: 4.6,
      reviewCount: 52,
      targetAudience: ['学科教师', '班主任', '教学管理者'],
      ageGroup: ['小学生', '初中生', '高中生'],
      license: 'CC BY-SA 4.0',
      content: {
        mainFile: '/resources/teaching/differentiated-instruction-guide.pdf',
        attachments: [
          '/resources/teaching/learning-styles-assessment.pdf',
          '/resources/teaching/lesson-plan-templates.docx'
        ],
        previewUrl: '/resources/teaching/differentiated-instruction-preview.html'
      },
      keywords: ['学习风格', '多元智能', '分层教学', '个别化指导'],
      relatedResources: ['edu-002', 'edu-005']
    },
    {
      id: 'edu-002',
      title: '课堂管理与纪律维护技巧',
      description: '有效的课堂管理策略和纪律维护方法，创建积极的学习环境',
      category: 'teaching_resources',
      subcategory: 'classroom_management',
      resourceType: 'video',
      author: '资深班主任',
      authorId: 'teacher-005',
      createTime: '2024-01-14',
      updateTime: '2024-01-14',
      status: 'published',
      views: 2345,
      likes: 189,
      downloads: 345,
      difficulty: 'easy',
      duration: '40分钟',
      tags: ['课堂管理', '纪律维护', '学习环境', '行为管理'],
      thumbnail: '/images/classroom-management-thumb.svg',
      rating: 4.8,
      reviewCount: 78,
      targetAudience: ['新手教师', '班主任', '代课教师'],
      ageGroup: ['小学生', '初中生', '高中生'],
      license: 'CC BY 4.0',
      content: {
        mainFile: '/resources/teaching/classroom-management-video.mp4',
        attachments: [
          '/resources/teaching/behavior-management-chart.pdf',
          '/resources/teaching/classroom-rules-template.docx'
        ],
        previewUrl: '/resources/teaching/classroom-management-preview.html'
      },
      keywords: ['课堂秩序', '学生行为', '正面管教', '环境营造'],
      relatedResources: ['edu-003', 'psych-002']
    },

    // 技术培训资源库
    {
      id: 'tech-001',
      title: '教育技术工具应用指南',
      description: '现代教育技术工具的使用方法和教学应用案例',
      category: 'technology_training',
      subcategory: 'digital_tools',
      resourceType: 'guide',
      author: '教育技术专家',
      authorId: 'expert-005',
      createTime: '2024-01-20',
      updateTime: '2024-01-20',
      status: 'published',
      views: 1234,
      likes: 95,
      downloads: 178,
      difficulty: 'medium',
      duration: '60分钟',
      tags: ['教育技术', '数字化工具', '在线教学', '多媒体教学'],
      thumbnail: '/images/edtech-tools-thumb.svg',
      rating: 4.5,
      reviewCount: 38,
      targetAudience: ['学科教师', '教学管理者', 'IT支持人员'],
      ageGroup: ['小学生', '初中生', '高中生'],
      license: 'CC BY 4.0',
      content: {
        mainFile: '/resources/technology/edtech-tools-guide.pdf',
        attachments: [
          '/resources/technology/tool-comparison-chart.pdf',
          '/resources/technology/implementation-checklist.docx'
        ],
        previewUrl: '/resources/technology/edtech-tools-preview.html'
      },
      keywords: ['数字化转型', '在线平台', '互动工具', '评估技术'],
      relatedResources: ['tech-002', 'edu-006']
    },

    // 家庭教育资源库
    {
      id: 'family-001',
      title: '青春期亲子沟通艺术',
      description: '帮助家长与青春期孩子建立有效沟通的方法和技巧',
      category: 'family_education',
      subcategory: 'parent_child_communication',
      resourceType: 'audio',
      author: '家庭教育专家',
      authorId: 'expert-006',
      createTime: '2024-01-16',
      updateTime: '2024-01-16',
      status: 'published',
      views: 1567,
      likes: 123,
      downloads: 234,
      difficulty: 'medium',
      duration: '55分钟',
      tags: ['青春期', '亲子沟通', '家庭关系', '情感交流'],
      thumbnail: '/images/parent-teen-communication-thumb.svg',
      rating: 4.7,
      reviewCount: 56,
      targetAudience: ['家长', '家庭教育指导师', '心理咨询师'],
      ageGroup: ['初中生', '高中生'],
      license: 'CC BY-NC 4.0',
      content: {
        mainFile: '/resources/family/parent-teen-communication-audio.mp3',
        attachments: [
          '/resources/family/communication-tips.pdf',
          '/resources/family/conflict-resolution-guide.pdf'
        ],
        previewUrl: '/resources/family/parent-teen-communication-preview.html'
      },
      keywords: ['青春期心理', '沟通障碍', '理解支持', '边界设定'],
      relatedResources: ['family-002', 'psych-005']
    },

    // 学校管理资源库
    {
      id: 'mgmt-001',
      title: '学校危机管理应急预案',
      description: '学校各类突发事件的应急处理流程和管理策略',
      category: 'school_management',
      subcategory: 'crisis_management',
      resourceType: 'document',
      author: '学校管理专家',
      authorId: 'expert-007',
      createTime: '2024-01-25',
      updateTime: '2024-01-25',
      status: 'published',
      views: 876,
      likes: 67,
      downloads: 123,
      difficulty: 'hard',
      duration: '120分钟',
      tags: ['危机管理', '应急预案', '学校安全', '风险防控'],
      thumbnail: '/images/crisis-management-thumb.svg',
      rating: 4.6,
      reviewCount: 25,
      targetAudience: ['校长', '副校长', '安全管理员', '班主任'],
      ageGroup: ['小学生', '初中生', '高中生'],
      license: 'CC BY-SA 4.0',
      content: {
        mainFile: '/resources/management/crisis-management-plan.pdf',
        attachments: [
          '/resources/management/emergency-contact-template.pdf',
          '/resources/management/incident-report-form.docx'
        ],
        previewUrl: '/resources/management/crisis-management-preview.html'
      },
      keywords: ['应急响应', '风险评估', '沟通协调', '后续处理'],
      relatedResources: ['mgmt-002', 'psych-002']
    }
  ],
  categories: [
    {
      id: 'mental_health',
      name: '心理健康资源库',
      description: '学生心理健康教育、心理问题识别与干预相关资源',
      color: '#52c41a',
      icon: '🧠',
      resourceCount: 5,
      subcategories: [
        { id: 'anxiety_management', name: '焦虑管理', count: 1 },
        { id: 'bullying_prevention', name: '霸凌预防', count: 1 },
        { id: 'depression_support', name: '抑郁支持', count: 1 },
        { id: 'learning_support', name: '学习支持', count: 1 },
        { id: 'family_therapy', name: '家庭治疗', count: 1 }
      ]
    },
    {
      id: 'teaching_resources',
      name: '教学资源库',
      description: '教学方法、课堂管理、教学技能提升相关资源',
      color: '#1890ff',
      icon: '📚',
      resourceCount: 2,
      subcategories: [
        { id: 'differentiated_instruction', name: '差异化教学', count: 1 },
        { id: 'classroom_management', name: '课堂管理', count: 1 }
      ]
    },
    {
      id: 'technology_training',
      name: '技术培训资源库',
      description: '教育技术工具使用、数字化教学相关资源',
      color: '#722ed1',
      icon: '💻',
      resourceCount: 1,
      subcategories: [
        { id: 'digital_tools', name: '数字化工具', count: 1 }
      ]
    },
    {
      id: 'family_education',
      name: '家庭教育资源库',
      description: '家长教育、亲子关系、家庭教育指导相关资源',
      color: '#fa8c16',
      icon: '👨‍👩‍👧‍👦',
      resourceCount: 1,
      subcategories: [
        { id: 'parent_child_communication', name: '亲子沟通', count: 1 }
      ]
    },
    {
      id: 'school_management',
      name: '学校管理资源库',
      description: '学校管理、危机处理、制度建设相关资源',
      color: '#eb2f96',
      icon: '🏫',
      resourceCount: 1,
      subcategories: [
        { id: 'crisis_management', name: '危机管理', count: 1 }
      ]
    }
  ],
  nextId: 100
};

// 资源类型定义
const RESOURCE_TYPES = {
  GUIDE: 'guide',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
  TOOL: 'tool',
  CASE_STUDY: 'case_study'
};

// 资源状态定义
const RESOURCE_STATUS = {
  DRAFT: 'draft',
  REVIEW: 'review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

// 难度等级定义
const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

// 目标受众定义
const TARGET_AUDIENCES = {
  TEACHER: '学科教师',
  CLASS_TEACHER: '班主任',
  COUNSELOR: '心理咨询师',
  PRINCIPAL: '校长',
  PARENT: '家长',
  SOCIAL_WORKER: '社工',
  SPECIAL_ED_TEACHER: '特殊教育老师'
};

// 年龄组定义
const AGE_GROUPS = {
  PRESCHOOL: '幼儿',
  ELEMENTARY: '小学生',
  MIDDLE_SCHOOL: '初中生',
  HIGH_SCHOOL: '高中生'
};

// 工具函数
const generateId = () => {
  return 'res-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

const getCurrentTime = () => {
  return new Date().toISOString().split('T')[0];
};

// 资源库服务类
class ResourceLibraryService {
  constructor() {
    this.storage = resourceStorage;
  }

  // 获取所有资源
  async getAllResources(filters = {}) {
    try {
      let resources = [...this.storage.resources];

      // 应用筛选条件
      if (filters.category) {
        resources = resources.filter(resource => resource.category === filters.category);
      }

      if (filters.subcategory) {
        resources = resources.filter(resource => resource.subcategory === filters.subcategory);
      }

      if (filters.resourceType) {
        resources = resources.filter(resource => resource.resourceType === filters.resourceType);
      }

      if (filters.difficulty) {
        resources = resources.filter(resource => resource.difficulty === filters.difficulty);
      }

      if (filters.targetAudience) {
        resources = resources.filter(resource => 
          resource.targetAudience.includes(filters.targetAudience)
        );
      }

      if (filters.ageGroup) {
        resources = resources.filter(resource => 
          resource.ageGroup.includes(filters.ageGroup)
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        resources = resources.filter(resource => 
          resource.title.toLowerCase().includes(searchTerm) ||
          resource.description.toLowerCase().includes(searchTerm) ||
          resource.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          resource.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
        );
      }

      // 应用排序
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            resources.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            break;
          case 'oldest':
            resources.sort((a, b) => new Date(a.createTime) - new Date(b.createTime));
            break;
          case 'mostViewed':
            resources.sort((a, b) => b.views - a.views);
            break;
          case 'mostLiked':
            resources.sort((a, b) => b.likes - a.likes);
            break;
          case 'highestRated':
            resources.sort((a, b) => b.rating - a.rating);
            break;
          case 'title':
            resources.sort((a, b) => a.title.localeCompare(b.title));
            break;
          default:
            break;
        }
      }

      // 应用分页
      if (filters.page && filters.pageSize) {
        const startIndex = (filters.page - 1) * filters.pageSize;
        const endIndex = startIndex + filters.pageSize;
        resources = resources.slice(startIndex, endIndex);
      }

      return {
        success: true,
        data: resources,
        total: this.storage.resources.length,
        message: '获取资源列表成功'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: '获取资源列表失败: ' + error.message
      };
    }
  }

  // 根据ID获取资源详情
  async getResourceById(id) {
    try {
      const resource = this.storage.resources.find(r => r.id === id);
      if (!resource) {
        return {
          success: false,
          data: null,
          message: '资源不存在'
        };
      }

      // 增加浏览量
      resource.views += 1;

      return {
        success: true,
        data: resource,
        message: '获取资源详情成功'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '获取资源详情失败: ' + error.message
      };
    }
  }

  // 获取资源分类
  async getCategories() {
    try {
      return {
        success: true,
        data: this.storage.categories,
        message: '获取分类列表成功'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: '获取分类列表失败: ' + error.message
      };
    }
  }

  // 根据分类获取资源
  async getResourcesByCategory(categoryId, filters = {}) {
    try {
      const categoryFilters = { ...filters, category: categoryId };
      return await this.getAllResources(categoryFilters);
    } catch (error) {
      return {
        success: false,
        data: [],
        message: '获取分类资源失败: ' + error.message
      };
    }
  }

  // 搜索资源
  async searchResources(query, filters = {}) {
    try {
      const searchFilters = { ...filters, search: query };
      return await this.getAllResources(searchFilters);
    } catch (error) {
      return {
        success: false,
        data: [],
        message: '搜索资源失败: ' + error.message
      };
    }
  }

  // 获取推荐资源
  async getRecommendedResources(resourceId, limit = 5) {
    try {
      const currentResource = this.storage.resources.find(r => r.id === resourceId);
      if (!currentResource) {
        return {
          success: false,
          data: [],
          message: '当前资源不存在'
        };
      }

      // 基于相关资源ID获取推荐
      let recommended = [];
      if (currentResource.relatedResources && currentResource.relatedResources.length > 0) {
        recommended = this.storage.resources.filter(r => 
          currentResource.relatedResources.includes(r.id) && r.status === 'published'
        );
      }

      // 如果相关资源不足，基于分类和标签推荐
      if (recommended.length < limit) {
        const categoryResources = this.storage.resources.filter(r => 
          r.category === currentResource.category && 
          r.id !== resourceId && 
          r.status === 'published' &&
          !recommended.some(rec => rec.id === r.id)
        );
        
        // 按评分排序
        categoryResources.sort((a, b) => b.rating - a.rating);
        recommended = [...recommended, ...categoryResources.slice(0, limit - recommended.length)];
      }

      return {
        success: true,
        data: recommended.slice(0, limit),
        message: '获取推荐资源成功'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: '获取推荐资源失败: ' + error.message
      };
    }
  }

  // 点赞资源
  async likeResource(id) {
    try {
      const resource = this.storage.resources.find(r => r.id === id);
      if (!resource) {
        return {
          success: false,
          message: '资源不存在'
        };
      }

      resource.likes += 1;
      return {
        success: true,
        data: { likes: resource.likes },
        message: '点赞成功'
      };
    } catch (error) {
      return {
        success: false,
        message: '点赞失败: ' + error.message
      };
    }
  }

  // 增加下载量
  async incrementDownloads(id) {
    try {
      const resource = this.storage.resources.find(r => r.id === id);
      if (!resource) {
        return {
          success: false,
          message: '资源不存在'
        };
      }

      resource.downloads += 1;
      return {
        success: true,
        data: { downloads: resource.downloads },
        message: '下载记录成功'
      };
    } catch (error) {
      return {
        success: false,
        message: '下载记录失败: ' + error.message
      };
    }
  }

  // 获取热门资源
  async getPopularResources(limit = 10) {
    try {
      const resources = this.storage.resources
        .filter(r => r.status === 'published')
        .sort((a, b) => (b.views + b.likes + b.downloads) - (a.views + a.likes + a.downloads))
        .slice(0, limit);

      return {
        success: true,
        data: resources,
        message: '获取热门资源成功'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: '获取热门资源失败: ' + error.message
      };
    }
  }

  // 获取最新资源
  async getLatestResources(limit = 10) {
    try {
      const resources = this.storage.resources
        .filter(r => r.status === 'published')
        .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
        .slice(0, limit);

      return {
        success: true,
        data: resources,
        message: '获取最新资源成功'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: '获取最新资源失败: ' + error.message
      };
    }
  }

  // 获取统计信息
  async getStatistics() {
    try {
      const stats = {
        totalResources: this.storage.resources.length,
        publishedResources: this.storage.resources.filter(r => r.status === 'published').length,
        totalViews: this.storage.resources.reduce((sum, r) => sum + r.views, 0),
        totalDownloads: this.storage.resources.reduce((sum, r) => sum + r.downloads, 0),
        categoriesCount: this.storage.categories.length,
        averageRating: this.storage.resources.reduce((sum, r) => sum + r.rating, 0) / this.storage.resources.length
      };

      return {
        success: true,
        data: stats,
        message: '获取统计信息成功'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '获取统计信息失败: ' + error.message
      };
    }
  }
}

// 创建服务实例
const resourceLibraryService = new ResourceLibraryService();

// 导出服务和常量
export default resourceLibraryService;
export {
  RESOURCE_TYPES,
  RESOURCE_STATUS,
  DIFFICULTY_LEVELS,
  TARGET_AUDIENCES,
  AGE_GROUPS
};