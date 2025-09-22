// 树状资源标注模拟数据
import {
  ResourceSourceType,
  AnnotationStatus,
  TreeNodeType,
  TreeNode,
  ResourceAnnotationNode,
  ResourceSourceCategoryNode,
  ResourceAnnotationTreeManager
} from '../types/resourceAnnotationTree.js';

/**
 * 创建模拟的树状资源标注数据
 */
export function createMockResourceAnnotationTree() {
  const manager = new ResourceAnnotationTreeManager();

  // 1. 内部资源分类
  const internalCategory = new ResourceSourceCategoryNode({
    id: 'internal_resources',
    name: '内部资源',
    sourceType: ResourceSourceType.INTERNAL,
    description: '学校内部创建和维护的教学资源',
    icon: '🏫',
    color: '#1890ff'
  });

  // 1.1 教学课件子分类
  const coursewareSubcategory = new ResourceSourceCategoryNode({
    id: 'internal_courseware',
    name: '教学课件',
    sourceType: ResourceSourceType.INTERNAL,
    description: '教师制作的PPT、视频等教学课件',
    icon: '📊',
    color: '#52c41a'
  });

  // 添加具体的课件资源
  const mathPPT = new ResourceAnnotationNode({
    id: 'math_ppt_001',
    name: '高中数学-函数与导数.pptx',
    resourceId: 'res_math_001',
    sourceType: ResourceSourceType.INTERNAL,
    sourceName: '数学教研组',
    sourceUrl: '/internal/courseware/math_functions.pptx',
    annotationStatus: AnnotationStatus.COMPLETED,
    tags: ['数学', '高中', '函数', '导数', '重点知识'],
    annotations: [
      {
        id: 'ann_001',
        content: '该课件系统讲解了函数的基本概念和导数的应用，适合高二学生使用',
        createTime: '2024-01-15T10:30:00Z',
        annotatorId: 'teacher_001'
      },
      {
        id: 'ann_002',
        content: '课件中的例题选择恰当，难度递进合理',
        createTime: '2024-01-15T14:20:00Z',
        annotatorId: 'teacher_002'
      }
    ],
    confidence: 0.95,
    quality: 4.5,
    relevance: 4.8,
    annotatorId: 'teacher_001',
    reviewerId: 'admin_001',
    reviewTime: '2024-01-16T09:00:00Z',
    reviewComments: '质量优秀，可作为标准教学资源推广使用'
  });

  const physicsPPT = new ResourceAnnotationNode({
    id: 'physics_ppt_001',
    name: '物理实验-电磁感应现象.pptx',
    resourceId: 'res_physics_001',
    sourceType: ResourceSourceType.INTERNAL,
    sourceName: '物理实验室',
    sourceUrl: '/internal/courseware/physics_electromagnetic.pptx',
    annotationStatus: AnnotationStatus.REVIEWED,
    tags: ['物理', '实验', '电磁感应', '高中'],
    annotations: [
      {
        id: 'ann_003',
        content: '实验步骤清晰，安全注意事项完备',
        createTime: '2024-01-14T16:45:00Z',
        annotatorId: 'teacher_003'
      }
    ],
    confidence: 0.92,
    quality: 4.3,
    relevance: 4.6,
    annotatorId: 'teacher_003',
    reviewerId: 'admin_001',
    reviewTime: '2024-01-15T11:30:00Z',
    reviewComments: '实验设计合理，建议增加更多安全提示'
  });

  coursewareSubcategory.addChild(mathPPT);
  coursewareSubcategory.addChild(physicsPPT);

  // 1.2 教案资源子分类
  const lessonPlanSubcategory = new ResourceSourceCategoryNode({
    id: 'internal_lesson_plans',
    name: '教案资源',
    sourceType: ResourceSourceType.INTERNAL,
    description: '教师编写的详细教学计划和教案',
    icon: '📝',
    color: '#722ed1'
  });

  const chineseLessonPlan = new ResourceAnnotationNode({
    id: 'chinese_plan_001',
    name: '语文教案-古诗词鉴赏方法',
    resourceId: 'res_chinese_001',
    sourceType: ResourceSourceType.INTERNAL,
    sourceName: '语文教研组',
    sourceUrl: '/internal/lesson_plans/chinese_poetry.docx',
    annotationStatus: AnnotationStatus.IN_PROGRESS,
    tags: ['语文', '古诗词', '鉴赏', '教学方法'],
    annotations: [
      {
        id: 'ann_004',
        content: '教案结构完整，教学目标明确',
        createTime: '2024-01-13T09:15:00Z',
        annotatorId: 'teacher_004'
      }
    ],
    confidence: 0.88,
    quality: 4.0,
    relevance: 4.4,
    annotatorId: 'teacher_004'
  });

  lessonPlanSubcategory.addChild(chineseLessonPlan);

  internalCategory.addChild(coursewareSubcategory);
  internalCategory.addChild(lessonPlanSubcategory);

  // 2. 外部资源分类
  const externalCategory = new ResourceSourceCategoryNode({
    id: 'external_resources',
    name: '外部资源',
    sourceType: ResourceSourceType.EXTERNAL,
    description: '来自互联网和其他机构的教育资源',
    icon: '🌐',
    color: '#fa8c16'
  });

  // 2.1 在线课程子分类
  const onlineCoursesSubcategory = new ResourceSourceCategoryNode({
    id: 'external_online_courses',
    name: '在线课程',
    sourceType: ResourceSourceType.EXTERNAL,
    description: '来自各大在线教育平台的优质课程',
    icon: '💻',
    color: '#13c2c2'
  });

  const khanAcademyMath = new ResourceAnnotationNode({
    id: 'khan_math_001',
    name: 'Khan Academy - 微积分基础',
    resourceId: 'res_khan_001',
    sourceType: ResourceSourceType.EXTERNAL,
    sourceName: 'Khan Academy',
    sourceUrl: 'https://www.khanacademy.org/math/calculus-1',
    annotationStatus: AnnotationStatus.COMPLETED,
    tags: ['数学', '微积分', '在线课程', '英文', '免费'],
    annotations: [
      {
        id: 'ann_005',
        content: '课程内容系统全面，适合作为补充教学资源',
        createTime: '2024-01-12T14:20:00Z',
        annotatorId: 'teacher_005'
      },
      {
        id: 'ann_006',
        content: '视频质量高，讲解清晰，但需要一定英语基础',
        createTime: '2024-01-12T15:30:00Z',
        annotatorId: 'teacher_006'
      }
    ],
    confidence: 0.93,
    quality: 4.6,
    relevance: 4.5,
    annotatorId: 'teacher_005',
    reviewerId: 'admin_002',
    reviewTime: '2024-01-13T10:00:00Z',
    reviewComments: '优质外部资源，建议推荐给有英语基础的学生'
  });

  const courseraCS = new ResourceAnnotationNode({
    id: 'coursera_cs_001',
    name: 'Coursera - Python编程入门',
    resourceId: 'res_coursera_001',
    sourceType: ResourceSourceType.EXTERNAL,
    sourceName: 'Coursera',
    sourceUrl: 'https://www.coursera.org/learn/python-programming',
    annotationStatus: AnnotationStatus.PENDING,
    tags: ['编程', 'Python', '计算机科学', '在线课程'],
    annotations: [],
    confidence: 0.85,
    quality: 4.2,
    relevance: 4.0,
    annotatorId: 'teacher_007'
  });

  onlineCoursesSubcategory.addChild(khanAcademyMath);
  onlineCoursesSubcategory.addChild(courseraCS);

  // 2.2 开放教育资源子分类
  const oerSubcategory = new ResourceSourceCategoryNode({
    id: 'external_oer',
    name: '开放教育资源',
    sourceType: ResourceSourceType.EXTERNAL,
    description: '开放获取的教育资源和学术材料',
    icon: '📚',
    color: '#eb2f96'
  });

  const mitOpenCourse = new ResourceAnnotationNode({
    id: 'mit_open_001',
    name: 'MIT OpenCourseWare - 线性代数',
    resourceId: 'res_mit_001',
    sourceType: ResourceSourceType.EXTERNAL,
    sourceName: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/',
    annotationStatus: AnnotationStatus.REVIEWED,
    tags: ['数学', '线性代数', 'MIT', '大学课程', '免费'],
    annotations: [
      {
        id: 'ann_007',
        content: 'MIT的经典线性代数课程，内容深入浅出',
        createTime: '2024-01-11T11:45:00Z',
        annotatorId: 'teacher_008'
      }
    ],
    confidence: 0.96,
    quality: 4.8,
    relevance: 4.7,
    annotatorId: 'teacher_008',
    reviewerId: 'admin_002',
    reviewTime: '2024-01-12T09:30:00Z',
    reviewComments: '世界顶级大学的开放课程，强烈推荐'
  });

  oerSubcategory.addChild(mitOpenCourse);

  externalCategory.addChild(onlineCoursesSubcategory);
  externalCategory.addChild(oerSubcategory);

  // 3. 导入资源分类
  const importedCategory = new ResourceSourceCategoryNode({
    id: 'imported_resources',
    name: '导入资源',
    sourceType: ResourceSourceType.IMPORTED,
    description: '从其他系统或平台导入的教育资源',
    icon: '📥',
    color: '#52c41a'
  });

  // 3.1 从教务系统导入
  const academicSystemSubcategory = new ResourceSourceCategoryNode({
    id: 'imported_academic_system',
    name: '教务系统导入',
    sourceType: ResourceSourceType.IMPORTED,
    description: '从学校教务管理系统导入的课程资料',
    icon: '🎓',
    color: '#1890ff'
  });

  const syllabusImported = new ResourceAnnotationNode({
    id: 'syllabus_imported_001',
    name: '2024春季学期课程大纲汇总',
    resourceId: 'res_syllabus_001',
    sourceType: ResourceSourceType.IMPORTED,
    sourceName: '教务管理系统',
    sourceUrl: '/imported/academic/syllabus_2024_spring.xlsx',
    annotationStatus: AnnotationStatus.COMPLETED,
    tags: ['课程大纲', '2024春季', '教务系统', '汇总'],
    annotations: [
      {
        id: 'ann_008',
        content: '包含所有学科的课程大纲，格式统一，便于查阅',
        createTime: '2024-01-10T16:00:00Z',
        annotatorId: 'admin_003'
      }
    ],
    confidence: 0.98,
    quality: 4.4,
    relevance: 4.9,
    annotatorId: 'admin_003',
    reviewerId: 'admin_001',
    reviewTime: '2024-01-11T08:30:00Z',
    reviewComments: '导入数据完整，质量良好'
  });

  academicSystemSubcategory.addChild(syllabusImported);

  importedCategory.addChild(academicSystemSubcategory);

  // 4. 生成资源分类
  const generatedCategory = new ResourceSourceCategoryNode({
    id: 'generated_resources',
    name: '生成资源',
    sourceType: ResourceSourceType.GENERATED,
    description: '通过AI或自动化工具生成的教育资源',
    icon: '🤖',
    color: '#722ed1'
  });

  // 4.1 AI生成内容
  const aiGeneratedSubcategory = new ResourceSourceCategoryNode({
    id: 'generated_ai_content',
    name: 'AI生成内容',
    sourceType: ResourceSourceType.GENERATED,
    description: '使用人工智能技术生成的教学内容',
    icon: '🧠',
    color: '#fa541c'
  });

  const aiQuizGenerated = new ResourceAnnotationNode({
    id: 'ai_quiz_001',
    name: 'AI生成-高中化学元素周期表练习题',
    resourceId: 'res_ai_quiz_001',
    sourceType: ResourceSourceType.GENERATED,
    sourceName: 'AI内容生成器',
    sourceUrl: '/generated/ai/chemistry_quiz_001.json',
    annotationStatus: AnnotationStatus.IN_PROGRESS,
    tags: ['化学', '元素周期表', 'AI生成', '练习题', '高中'],
    annotations: [
      {
        id: 'ann_009',
        content: 'AI生成的题目质量较高，但需要人工审核和调整',
        createTime: '2024-01-09T13:20:00Z',
        annotatorId: 'teacher_009'
      }
    ],
    confidence: 0.82,
    quality: 3.8,
    relevance: 4.2,
    annotatorId: 'teacher_009'
  });

  aiGeneratedSubcategory.addChild(aiQuizGenerated);

  generatedCategory.addChild(aiGeneratedSubcategory);

  // 5. 共享资源分类
  const sharedCategory = new ResourceSourceCategoryNode({
    id: 'shared_resources',
    name: '共享资源',
    sourceType: ResourceSourceType.SHARED,
    description: '与其他学校或机构共享的教育资源',
    icon: '🤝',
    color: '#13c2c2'
  });

  // 5.1 校际共享
  const interSchoolSubcategory = new ResourceSourceCategoryNode({
    id: 'shared_inter_school',
    name: '校际共享',
    sourceType: ResourceSourceType.SHARED,
    description: '与友好学校共享的优质教学资源',
    icon: '🏫',
    color: '#52c41a'
  });

  const sharedExperiment = new ResourceAnnotationNode({
    id: 'shared_exp_001',
    name: '共享实验-生物细胞观察实验指导',
    resourceId: 'res_shared_001',
    sourceType: ResourceSourceType.SHARED,
    sourceName: '市第一中学',
    sourceUrl: '/shared/inter_school/biology_cell_experiment.pdf',
    annotationStatus: AnnotationStatus.REVIEWED,
    tags: ['生物', '细胞观察', '实验指导', '校际共享'],
    annotations: [
      {
        id: 'ann_010',
        content: '实验设计科学，步骤详细，适合高一学生使用',
        createTime: '2024-01-08T10:15:00Z',
        annotatorId: 'teacher_010'
      }
    ],
    confidence: 0.91,
    quality: 4.3,
    relevance: 4.5,
    annotatorId: 'teacher_010',
    reviewerId: 'admin_002',
    reviewTime: '2024-01-09T14:00:00Z',
    reviewComments: '优质共享资源，可直接使用'
  });

  interSchoolSubcategory.addChild(sharedExperiment);

  sharedCategory.addChild(interSchoolSubcategory);

  // 将所有主分类添加到管理器
  manager.addNode(internalCategory);
  manager.addNode(externalCategory);
  manager.addNode(importedCategory);
  manager.addNode(generatedCategory);
  manager.addNode(sharedCategory);

  // 更新所有分类的统计信息
  [internalCategory, externalCategory, importedCategory, generatedCategory, sharedCategory].forEach(category => {
    category.updateStats();
  });

  return manager;
}

/**
 * 获取资源标注统计数据
 */
export function getResourceAnnotationStats(manager) {
  const stats = manager.getStatistics();
  
  // 按来源类型统计
  const sourceTypeStats = {};
  Object.values(ResourceSourceType).forEach(type => {
    const nodes = manager.getNodesByType(TreeNodeType.RESOURCE).filter(node => node.sourceType === type);
    sourceTypeStats[type] = {
      count: nodes.length,
      completed: nodes.filter(node => 
        node.annotationStatus === AnnotationStatus.COMPLETED || 
        node.annotationStatus === AnnotationStatus.REVIEWED
      ).length,
      averageQuality: nodes.length > 0 ? 
        nodes.reduce((sum, node) => sum + node.quality, 0) / nodes.length : 0
    };
  });

  // 按状态统计
  const statusStats = {};
  Object.values(AnnotationStatus).forEach(status => {
    const nodes = manager.getNodesByType(TreeNodeType.RESOURCE).filter(node => node.annotationStatus === status);
    statusStats[status] = nodes.length;
  });

  return {
    ...stats,
    sourceTypeStats,
    statusStats,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * 搜索资源标注
 */
export function searchResourceAnnotations(manager, query, filters = {}) {
  let results = manager.searchNodes(query, TreeNodeType.RESOURCE);

  // 应用过滤器
  if (filters.sourceType) {
    results = results.filter(node => node.sourceType === filters.sourceType);
  }

  if (filters.status) {
    results = results.filter(node => node.annotationStatus === filters.status);
  }

  if (filters.minQuality) {
    results = results.filter(node => node.quality >= filters.minQuality);
  }

  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(node => 
      filters.tags.some(tag => node.tags.includes(tag))
    );
  }

  // 按相关性和质量排序
  results.sort((a, b) => {
    const scoreA = a.relevance * 0.6 + a.quality * 0.4;
    const scoreB = b.relevance * 0.6 + b.quality * 0.4;
    return scoreB - scoreA;
  });

  return results;
}

/**
 * 获取热门标签
 */
export function getPopularTags(manager, limit = 20) {
  const tagCount = {};
  const resourceNodes = manager.getNodesByType(TreeNodeType.RESOURCE);

  resourceNodes.forEach(node => {
    node.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

// 创建默认的树状资源标注管理器实例
export const defaultResourceAnnotationTree = createMockResourceAnnotationTree();

// 导出默认数据
export default {
  createMockResourceAnnotationTree,
  getResourceAnnotationStats,
  searchResourceAnnotations,
  getPopularTags,
  defaultResourceAnnotationTree
};