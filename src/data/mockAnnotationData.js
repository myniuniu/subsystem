// 资源标注模拟数据
export const DEFAULT_MOCK_ANNOTATION_DATA = [
  {
    id: 'ann_001',
    title: '教学视频重点标注',
    content: '这个视频片段讲解了重要的概念，需要学生重点关注',
    type: 'video',
    resourceUrl: '/videos/lesson1.mp4',
    timestamp: '00:05:30',
    tags: ['重点', '概念讲解'],
    category: '教学视频',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    starred: false,
    author: '张老师'
  },
  {
    id: 'ann_002',
    title: '文档关键段落',
    content: '此段落包含了课程的核心理论，建议深入理解',
    type: 'document',
    resourceUrl: '/docs/theory.pdf',
    pageNumber: 15,
    tags: ['理论', '核心内容'],
    category: '教学文档',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    starred: true,
    author: '李老师'
  }
];

export const ANNOTATION_SOURCE_INIT_DATA = {
  categories: ['教学视频', '教学文档', '实验资料', '参考资料'],
  tags: ['重点', '概念讲解', '理论', '核心内容', '实践', '案例分析'],
  sources: ['本地上传', '在线资源', '课程资料', '参考文献']
};

export const generateAllMockAnnotationData = () => {
  return {
    annotations: DEFAULT_MOCK_ANNOTATION_DATA,
    categories: ANNOTATION_SOURCE_INIT_DATA.categories,
    tags: ANNOTATION_SOURCE_INIT_DATA.tags,
    sources: ANNOTATION_SOURCE_INIT_DATA.sources
  };
};

export const generateRoleSpecificData = (role = 'teacher') => {
  const baseData = generateAllMockAnnotationData();
  
  if (role === 'student') {
    return {
      ...baseData,
      annotations: baseData.annotations.map(ann => ({
        ...ann,
        author: '学生用户'
      }))
    };
  }
  
  return baseData;
};

export const generateAnnotationStats = () => {
  return {
    totalAnnotations: DEFAULT_MOCK_ANNOTATION_DATA.length,
    categoriesCount: ANNOTATION_SOURCE_INIT_DATA.categories.length,
    tagsCount: ANNOTATION_SOURCE_INIT_DATA.tags.length,
    starredCount: DEFAULT_MOCK_ANNOTATION_DATA.filter(ann => ann.starred).length,
    recentCount: DEFAULT_MOCK_ANNOTATION_DATA.filter(ann => {
      const createdDate = new Date(ann.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }).length
  };
};