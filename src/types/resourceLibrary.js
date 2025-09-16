// 资源库数据模型定义
// 定义资源库相关的数据结构和类型

/**
 * 资源类型枚举
 */
export const ResourceType = {
  GUIDE: 'guide',           // 指南
  VIDEO: 'video',           // 视频
  AUDIO: 'audio',           // 音频
  DOCUMENT: 'document',     // 文档
  TOOL: 'tool',            // 工具
  CASE_STUDY: 'case_study' // 案例研究
};

/**
 * 资源状态枚举
 */
export const ResourceStatus = {
  DRAFT: 'draft',         // 草稿
  REVIEW: 'review',       // 审核中
  PUBLISHED: 'published', // 已发布
  ARCHIVED: 'archived'    // 已归档
};

/**
 * 难度等级枚举
 */
export const DifficultyLevel = {
  EASY: 'easy',     // 简单
  MEDIUM: 'medium', // 中等
  HARD: 'hard'      // 困难
};

/**
 * 资源分类枚举
 */
export const ResourceCategory = {
  MENTAL_HEALTH: 'mental_health',           // 心理健康资源库
  TEACHING_RESOURCES: 'teaching_resources', // 教学资源库
  TECHNOLOGY_TRAINING: 'technology_training', // 技术培训资源库
  FAMILY_EDUCATION: 'family_education',     // 家庭教育资源库
  SCHOOL_MANAGEMENT: 'school_management'    // 学校管理资源库
};

/**
 * 目标受众枚举
 */
export const TargetAudience = {
  TEACHER: '学科教师',
  CLASS_TEACHER: '班主任',
  COUNSELOR: '心理咨询师',
  PRINCIPAL: '校长',
  VICE_PRINCIPAL: '副校长',
  PARENT: '家长',
  SOCIAL_WORKER: '社工',
  SPECIAL_ED_TEACHER: '特殊教育老师',
  SCHOOL_MANAGER: '学校管理者',
  IT_SUPPORT: 'IT支持人员',
  FAMILY_THERAPIST: '家庭治疗师',
  SAFETY_MANAGER: '安全管理员'
};

/**
 * 年龄组枚举
 */
export const AgeGroup = {
  PRESCHOOL: '幼儿',
  ELEMENTARY: '小学生',
  MIDDLE_SCHOOL: '初中生',
  HIGH_SCHOOL: '高中生'
};

/**
 * 许可证类型枚举
 */
export const LicenseType = {
  CC_BY: 'CC BY 4.0',
  CC_BY_SA: 'CC BY-SA 4.0',
  CC_BY_NC: 'CC BY-NC 4.0',
  CC_BY_NC_SA: 'CC BY-NC-SA 4.0',
  ALL_RIGHTS_RESERVED: 'All Rights Reserved'
};

/**
 * 资源内容结构
 */
export class ResourceContent {
  constructor({
    mainFile = '',
    attachments = [],
    previewUrl = '',
    thumbnailUrl = '',
    videoUrl = '',
    audioUrl = '',
    downloadUrl = ''
  } = {}) {
    this.mainFile = mainFile;           // 主文件路径
    this.attachments = attachments;     // 附件列表
    this.previewUrl = previewUrl;       // 预览URL
    this.thumbnailUrl = thumbnailUrl;   // 缩略图URL
    this.videoUrl = videoUrl;           // 视频URL
    this.audioUrl = audioUrl;           // 音频URL
    this.downloadUrl = downloadUrl;     // 下载URL
  }
}

/**
 * 资源统计信息
 */
export class ResourceStats {
  constructor({
    views = 0,
    likes = 0,
    downloads = 0,
    rating = 0,
    reviewCount = 0,
    shareCount = 0,
    favoriteCount = 0
  } = {}) {
    this.views = views;                 // 浏览量
    this.likes = likes;                 // 点赞数
    this.downloads = downloads;         // 下载量
    this.rating = rating;               // 评分
    this.reviewCount = reviewCount;     // 评论数
    this.shareCount = shareCount;       // 分享数
    this.favoriteCount = favoriteCount; // 收藏数
  }
}

/**
 * 资源作者信息
 */
export class ResourceAuthor {
  constructor({
    id = '',
    name = '',
    avatar = '',
    title = '',
    organization = '',
    email = '',
    bio = ''
  } = {}) {
    this.id = id;                     // 作者ID
    this.name = name;                 // 作者姓名
    this.avatar = avatar;             // 头像URL
    this.title = title;               // 职称
    this.organization = organization; // 所属机构
    this.email = email;               // 邮箱
    this.bio = bio;                   // 简介
  }
}

/**
 * 资源子分类
 */
export class ResourceSubcategory {
  constructor({
    id = '',
    name = '',
    description = '',
    count = 0,
    icon = '',
    color = ''
  } = {}) {
    this.id = id;                     // 子分类ID
    this.name = name;                 // 子分类名称
    this.description = description;   // 描述
    this.count = count;               // 资源数量
    this.icon = icon;                 // 图标
    this.color = color;               // 颜色
  }
}

/**
 * 资源分类
 */
export class ResourceCategoryModel {
  constructor({
    id = '',
    name = '',
    description = '',
    color = '',
    icon = '',
    resourceCount = 0,
    subcategories = [],
    isActive = true,
    sortOrder = 0
  } = {}) {
    this.id = id;                     // 分类ID
    this.name = name;                 // 分类名称
    this.description = description;   // 描述
    this.color = color;               // 主题色
    this.icon = icon;                 // 图标
    this.resourceCount = resourceCount; // 资源数量
    this.subcategories = subcategories.map(sub => 
      sub instanceof ResourceSubcategory ? sub : new ResourceSubcategory(sub)
    );
    this.isActive = isActive;         // 是否激活
    this.sortOrder = sortOrder;       // 排序
  }
}

/**
 * 资源模型
 */
export class ResourceModel {
  constructor({
    id = '',
    title = '',
    description = '',
    category = '',
    subcategory = '',
    resourceType = ResourceType.DOCUMENT,
    author = null,
    authorId = '',
    createTime = '',
    updateTime = '',
    status = ResourceStatus.DRAFT,
    difficulty = DifficultyLevel.MEDIUM,
    duration = '',
    tags = [],
    keywords = [],
    targetAudience = [],
    ageGroup = [],
    license = LicenseType.CC_BY,
    content = null,
    stats = null,
    relatedResources = [],
    requirements = [],
    learningObjectives = [],
    isRecommended = false,
    isFeatured = false,
    language = 'zh-CN',
    version = '1.0'
  } = {}) {
    this.id = id;                     // 资源ID
    this.title = title;               // 标题
    this.description = description;   // 描述
    this.category = category;         // 主分类
    this.subcategory = subcategory;   // 子分类
    this.resourceType = resourceType; // 资源类型
    this.author = author instanceof ResourceAuthor ? author : new ResourceAuthor(author || {});
    this.authorId = authorId;         // 作者ID
    this.createTime = createTime;     // 创建时间
    this.updateTime = updateTime;     // 更新时间
    this.status = status;             // 状态
    this.difficulty = difficulty;     // 难度
    this.duration = duration;         // 时长
    this.tags = tags;                 // 标签
    this.keywords = keywords;         // 关键词
    this.targetAudience = targetAudience; // 目标受众
    this.ageGroup = ageGroup;         // 年龄组
    this.license = license;           // 许可证
    this.content = content instanceof ResourceContent ? content : new ResourceContent(content || {});
    this.stats = stats instanceof ResourceStats ? stats : new ResourceStats(stats || {});
    this.relatedResources = relatedResources; // 相关资源
    this.requirements = requirements; // 使用要求
    this.learningObjectives = learningObjectives; // 学习目标
    this.isRecommended = isRecommended; // 是否推荐
    this.isFeatured = isFeatured;     // 是否精选
    this.language = language;         // 语言
    this.version = version;           // 版本
  }

  // 获取资源的完整URL
  getResourceUrl() {
    return this.content.mainFile;
  }

  // 获取缩略图URL
  getThumbnailUrl() {
    return this.content.thumbnailUrl || '/images/default-resource-thumb.svg';
  }

  // 获取预览URL
  getPreviewUrl() {
    return this.content.previewUrl;
  }

  // 检查是否为视频资源
  isVideo() {
    return this.resourceType === ResourceType.VIDEO;
  }

  // 检查是否为音频资源
  isAudio() {
    return this.resourceType === ResourceType.AUDIO;
  }

  // 检查是否为文档资源
  isDocument() {
    return this.resourceType === ResourceType.DOCUMENT || this.resourceType === ResourceType.GUIDE;
  }

  // 获取格式化的创建时间
  getFormattedCreateTime() {
    return new Date(this.createTime).toLocaleDateString('zh-CN');
  }

  // 获取格式化的更新时间
  getFormattedUpdateTime() {
    return new Date(this.updateTime).toLocaleDateString('zh-CN');
  }

  // 获取评分星级
  getStarRating() {
    return Math.round(this.stats.rating * 2) / 2; // 保留0.5的精度
  }

  // 检查是否适合指定年龄组
  isApplicableForAge(ageGroup) {
    return this.ageGroup.includes(ageGroup);
  }

  // 检查是否适合指定受众
  isApplicableForAudience(audience) {
    return this.targetAudience.includes(audience);
  }

  // 增加浏览量
  incrementViews() {
    this.stats.views += 1;
  }

  // 增加点赞数
  incrementLikes() {
    this.stats.likes += 1;
  }

  // 增加下载量
  incrementDownloads() {
    this.stats.downloads += 1;
  }

  // 更新评分
  updateRating(newRating) {
    const totalRating = this.stats.rating * this.stats.reviewCount + newRating;
    this.stats.reviewCount += 1;
    this.stats.rating = totalRating / this.stats.reviewCount;
  }
}

/**
 * 资源搜索过滤器
 */
export class ResourceFilter {
  constructor({
    category = '',
    subcategory = '',
    resourceType = '',
    difficulty = '',
    targetAudience = '',
    ageGroup = '',
    tags = [],
    search = '',
    sortBy = 'newest',
    page = 1,
    pageSize = 20,
    author = '',
    dateRange = null,
    ratingMin = 0,
    status = ResourceStatus.PUBLISHED
  } = {}) {
    this.category = category;         // 分类筛选
    this.subcategory = subcategory;   // 子分类筛选
    this.resourceType = resourceType; // 类型筛选
    this.difficulty = difficulty;     // 难度筛选
    this.targetAudience = targetAudience; // 受众筛选
    this.ageGroup = ageGroup;         // 年龄组筛选
    this.tags = tags;                 // 标签筛选
    this.search = search;             // 搜索关键词
    this.sortBy = sortBy;             // 排序方式
    this.page = page;                 // 页码
    this.pageSize = pageSize;         // 每页数量
    this.author = author;             // 作者筛选
    this.dateRange = dateRange;       // 日期范围
    this.ratingMin = ratingMin;       // 最低评分
    this.status = status;             // 状态筛选
  }
}

/**
 * 资源搜索结果
 */
export class ResourceSearchResult {
  constructor({
    resources = [],
    total = 0,
    page = 1,
    pageSize = 20,
    totalPages = 0,
    hasMore = false,
    filters = null,
    searchTime = 0
  } = {}) {
    this.resources = resources.map(resource => 
      resource instanceof ResourceModel ? resource : new ResourceModel(resource)
    );
    this.total = total;               // 总数量
    this.page = page;                 // 当前页
    this.pageSize = pageSize;         // 每页数量
    this.totalPages = totalPages;     // 总页数
    this.hasMore = hasMore;           // 是否有更多
    this.filters = filters instanceof ResourceFilter ? filters : new ResourceFilter(filters || {});
    this.searchTime = searchTime;     // 搜索耗时
  }
}

/**
 * 资源统计报告
 */
export class ResourceStatistics {
  constructor({
    totalResources = 0,
    publishedResources = 0,
    draftResources = 0,
    totalViews = 0,
    totalDownloads = 0,
    totalLikes = 0,
    averageRating = 0,
    categoriesCount = 0,
    authorsCount = 0,
    categoryStats = [],
    typeStats = [],
    popularResources = [],
    recentResources = []
  } = {}) {
    this.totalResources = totalResources;     // 总资源数
    this.publishedResources = publishedResources; // 已发布资源数
    this.draftResources = draftResources;     // 草稿资源数
    this.totalViews = totalViews;             // 总浏览量
    this.totalDownloads = totalDownloads;     // 总下载量
    this.totalLikes = totalLikes;             // 总点赞数
    this.averageRating = averageRating;       // 平均评分
    this.categoriesCount = categoriesCount;   // 分类数量
    this.authorsCount = authorsCount;         // 作者数量
    this.categoryStats = categoryStats;       // 分类统计
    this.typeStats = typeStats;               // 类型统计
    this.popularResources = popularResources; // 热门资源
    this.recentResources = recentResources;   // 最新资源
  }
}

// 导出所有模型和枚举
// 默认导出
export default {
  ResourceType,
  ResourceStatus,
  DifficultyLevel,
  ResourceCategory,
  TargetAudience,
  AgeGroup,
  LicenseType,
  ResourceContent,
  ResourceStats,
  ResourceAuthor,
  ResourceSubcategory,
  ResourceCategoryModel,
  ResourceModel,
  ResourceFilter,
  ResourceSearchResult,
  ResourceStatistics
};